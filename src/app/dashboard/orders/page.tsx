'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, RefreshCw, ShoppingBag, MessageCircle, Check, X, Clock, Truck } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Order {
  id: string
  created_at: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_address: string
  items: Array<{ name: string; price: number; qty: number; product_id?: string }>
  subtotal: number
  status: string
  source: string
  notes: string
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  new: { label: 'New', color: 'bg-blue-100 text-blue-700', icon: <Clock size={12} /> },
  confirmed: { label: 'Confirmed', color: 'bg-amber-100 text-amber-700', icon: <Check size={12} /> },
  dispatched: { label: 'Dispatched', color: 'bg-purple-100 text-purple-700', icon: <Truck size={12} /> },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: <Check size={12} /> },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-600', icon: <X size={12} /> },
}

function formatNaira(kobo: number) {
  return `₦${(kobo / 100).toLocaleString()}`
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (mins > 0) return `${mins}m ago`
  return 'Just now'
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [merchantId, setMerchantId] = useState<string | null>(null)
  const [merchantWa, setMerchantWa] = useState<string>('')
  const [filter, setFilter] = useState<string>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const loadOrders = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    const { data: { user } } = await supabase.auth.getUser()
    const fallbackEmail = typeof window !== 'undefined' ? localStorage.getItem('earket_merchant_email') : null
    const merchantEmail = user?.email || fallbackEmail
    if (!merchantEmail) { router.push('/login'); return }

    const { data: m } = await supabase.from('merchants').select('id, whatsapp_number').eq('email', merchantEmail).single()
    if (!m) { router.push('/onboarding'); return }

    setMerchantId(m.id)
    setMerchantWa(m.whatsapp_number || '')

    const { data: orderData } = await supabase
      .from('orders')
      .select('*')
      .eq('merchant_id', m.id)
      .order('created_at', { ascending: false })

    setOrders(orderData || [])
    setLoading(false)
    setRefreshing(false)
  }, [router])

  useEffect(() => { loadOrders() }, [loadOrders])

  async function updateStatus(orderId: string, status: string, order: Order) {
    setUpdatingId(orderId)
    await supabase.from('orders').update({ status }).eq('id', orderId)
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))

    // Reduce stock when delivered
    if (status === 'delivered') {
      for (const item of order.items || []) {
        if (item.product_id) {
          const { data: product } = await supabase
            .from('products').select('stock_qty').eq('id', item.product_id).single()
          if (product?.stock_qty != null) {
            const newQty = Math.max(0, product.stock_qty - item.qty)
            await supabase.from('products').update({
              stock_qty: newQty,
              in_stock: newQty > 0
            }).eq('id', item.product_id)
          }
        }
      }
    }

    // Notify customer via WhatsApp
    const statusMessages: Record<string, string> = {
      confirmed: `Hi ${order.customer_name}! Your order *${order.order_number}* has been confirmed. We'll prepare it shortly.`,
      dispatched: `Hi ${order.customer_name}! Your order *${order.order_number}* is on its way! 🚚`,
      delivered: `Hi ${order.customer_name}! Your order *${order.order_number}* has been delivered. Thank you for shopping with us! 🎉`,
      cancelled: `Hi ${order.customer_name}! Unfortunately your order *${order.order_number}* has been cancelled. Please contact us for more info.`,
    }

    if (statusMessages[status]) {
      const msg = statusMessages[status]
      const waNum = order.customer_phone.replace(/\D/g, '')
      window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`, '_blank')
    }
    setUpdatingId(null)
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)
  const newCount = orders.filter(o => o.status === 'new').length

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/dashboard" className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
          <ArrowLeft size={16} className="text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="font-display font-bold text-brand-dark">Orders</h1>
          {newCount > 0 && <p className="text-xs text-brand-accent font-semibold">{newCount} new order{newCount > 1 ? 's' : ''}</p>}
        </div>
        <button onClick={() => loadOrders(true)} disabled={refreshing}
          className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
          <RefreshCw size={14} className={`text-gray-500 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filter tabs */}
      <div className="bg-white border-b border-gray-100 px-4 py-2 flex gap-2 overflow-x-auto">
        {['all', 'new', 'confirmed', 'dispatched', 'delivered', 'cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filter === f ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-500'
            }`}>
            {f === 'all' ? `All (${orders.length})` : `${STATUS_CONFIG[f]?.label} (${orders.filter(o => o.status === f).length})`}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📦</div>
            <p className="font-semibold text-gray-700 mb-1">No orders yet</p>
            <p className="text-gray-400 text-sm">Orders from your storefront will appear here</p>
          </div>
        ) : (
          filtered.map(order => {
            const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.new
            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {/* Order header */}
                <div className="px-4 py-3 flex items-center justify-between border-b border-gray-50">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-brand-dark text-sm">{order.order_number}</span>
                      <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${status.color}`}>
                        {status.icon} {status.label}
                      </span>
                      {order.source === 'web' && (
                        <span className="text-xs bg-brand-light text-brand-green font-semibold px-2 py-0.5 rounded-full">Online</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{timeAgo(order.created_at)}</p>
                  </div>
                  <span className="font-display font-bold text-brand-dark">{formatNaira(order.subtotal)}</span>
                </div>

                {/* Customer */}
                <div className="px-4 py-3 border-b border-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{order.customer_name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">{order.customer_phone}</p>
                      {order.customer_address && order.customer_address !== 'PICKUP' && (
                        <p className="text-xs text-gray-400 mt-0.5">📍 {order.customer_address}</p>
                      )}
                      {order.customer_address === 'PICKUP' && (
                        <p className="text-xs text-brand-green font-semibold mt-0.5">📦 Pickup</p>
                      )}
                      {order.notes && <p className="text-xs text-gray-400 mt-0.5 italic">"{order.notes}"</p>}
                    </div>
                    <a href={`https://wa.me/${order.customer_phone?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${order.customer_name}! Regarding your order ${order.order_number}`)}`}
                      target="_blank" rel="noreferrer"
                      className="w-9 h-9 bg-[#25D366] rounded-xl flex items-center justify-center shrink-0">
                      <MessageCircle size={16} className="text-white" />
                    </a>
                  </div>
                </div>

                {/* Items */}
                <div className="px-4 py-3 border-b border-gray-50">
                  {(order.items || []).map((item, i) => (
                    <div key={i} className="flex justify-between text-xs text-gray-600 py-0.5">
                      <span>{item.name} × {item.qty}</span>
                      <span className="font-medium">₦{(item.price * item.qty / 100).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <div className="px-4 py-3 flex gap-2 flex-wrap">
                    {order.status === 'new' && (
                      <button onClick={() => updateStatus(order.id, 'confirmed', order)}
                        disabled={updatingId === order.id}
                        className="flex-1 bg-brand-green text-white text-xs font-bold py-2 rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-50">
                        ✓ Confirm Order
                      </button>
                    )}
                    {order.status === 'confirmed' && (
                      <button onClick={() => updateStatus(order.id, 'dispatched', order)}
                        disabled={updatingId === order.id}
                        className="flex-1 bg-purple-500 text-white text-xs font-bold py-2 rounded-xl hover:bg-purple-600 transition-colors disabled:opacity-50">
                        🚚 Mark Dispatched
                      </button>
                    )}
                    {order.status === 'dispatched' && (
                      <button onClick={() => updateStatus(order.id, 'delivered', order)}
                        disabled={updatingId === order.id}
                        className="flex-1 bg-brand-green text-white text-xs font-bold py-2 rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-50">
                        ✓ Mark Delivered
                      </button>
                    )}
                    {order.status !== 'cancelled' && (
                      <button onClick={() => updateStatus(order.id, 'cancelled', order)}
                        disabled={updatingId === order.id}
                        className="bg-red-50 text-red-500 text-xs font-bold py-2 px-4 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50">
                        Cancel
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
