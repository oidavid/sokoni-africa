'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, RefreshCw, MessageCircle, Check, X, Clock, Truck, ChevronDown, ChevronUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Order {
  id: string
  created_at: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_address: string
  customer_id?: string
  items: Array<{ name: string; price: number; qty: number; product_id?: string }>
  subtotal: number
  status: string
  source: string
  notes: string
}

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  new:       { label: 'New',       color: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-500' },
  confirmed: { label: 'Confirmed', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  dispatched:{ label: 'Dispatched',color: 'bg-purple-100 text-purple-700',dot: 'bg-purple-500' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-600',     dot: 'bg-red-400' },
}

function formatNaira(kobo: number) { return `₦${(kobo / 100).toLocaleString()}` }

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
  const [filter, setFilter] = useState<string>('new')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [loadError, setLoadError] = useState('')

  const [merchantId, setMerchantId] = useState<string>('')

  const loadOrders = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    setLoadError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const fallbackEmail = typeof window !== 'undefined' ? localStorage.getItem('earket_merchant_email') : null
      const merchantEmail = user?.email || fallbackEmail
      if (!merchantEmail) { router.push('/login'); return }

      const { data: m, error: mError } = await supabase.from('merchants').select('id, whatsapp_number').eq('email', merchantEmail).single()
      if (mError || !m) { router.push('/onboarding'); return }
      setMerchantId(m.id)

      const { data: orderData, error: oError } = await supabase
        .from('orders')
        .select('id, created_at, order_number, customer_name, customer_phone, customer_address, customer_id, items, subtotal, status, source, notes')
        .eq('merchant_id', m.id)
        .order('created_at', { ascending: false })

      if (oError) { setLoadError('Could not load orders: ' + oError.message) }
      setOrders(orderData || [])
    } catch (e) {
      setLoadError('Something went wrong.')
    }
    setLoading(false)
    setRefreshing(false)
  }, [router])

  useEffect(() => { loadOrders() }, [loadOrders])

  async function updateStatus(orderId: string, status: string, order: Order) {
    setUpdatingId(orderId)
    await supabase.from('orders').update({ status }).eq('id', orderId)
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
    const m = { id: merchantId }

    if (status === 'delivered') {
      for (const item of order.items || []) {
        if (item.product_id) {
          const { data: product } = await supabase.from('products').select('stock_qty').eq('id', item.product_id).single()
          if (product?.stock_qty != null) {
            const newQty = Math.max(0, product.stock_qty - item.qty)
            await supabase.from('products').update({ stock_qty: newQty, in_stock: newQty > 0 }).eq('id', item.product_id)
          }
        }
      }

      // Award loyalty points to customer on delivery
      if (order.customer_id) {
        const pointsEarned = Math.floor((order.subtotal / 100) / 100) // 1 point per ₦100
        if (pointsEarned > 0) {
          const { data: existing } = await supabase.from('customer_points')
            .select('id, points, lifetime_points')
            .eq('customer_id', order.customer_id)
            .eq('merchant_id', m.id)
            .maybeSingle()

          if (existing) {
            await supabase.from('customer_points').update({
              points: existing.points + pointsEarned,
              lifetime_points: existing.lifetime_points + pointsEarned,
            }).eq('id', existing.id)
          } else {
            await supabase.from('customer_points').insert({
              customer_id: order.customer_id,
              merchant_id: m.id,
              points: pointsEarned,
              lifetime_points: pointsEarned,
            })
          }

          await supabase.from('points_transactions').insert({
            customer_id: order.customer_id,
            merchant_id: m.id,
            order_id: orderId,
            points: pointsEarned,
            type: 'earn',
            note: `Earned from order ${order.order_number}`,
          })
        }
      }
    }

    const statusMessages: Record<string, string> = {
      confirmed: `Hi ${order.customer_name}! Your order *${order.order_number}* has been confirmed. We'll prepare it shortly.`,
      dispatched: `Hi ${order.customer_name}! Your order *${order.order_number}* is on its way! 🚚`,
      delivered: `Hi ${order.customer_name}! Your order *${order.order_number}* has been delivered. Thank you! 🎉`,
      cancelled: `Hi ${order.customer_name}! Your order *${order.order_number}* has been cancelled. Please contact us for more info.`,
    }
    if (statusMessages[status]) {
      window.open(`https://wa.me/${order.customer_phone?.replace(/\D/g, '')}?text=${encodeURIComponent(statusMessages[status])}`, '_blank')
    }
    setUpdatingId(null)
  }

  const allFilters = ['new', 'confirmed', 'dispatched', 'delivered', 'all', 'cancelled']
  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)
  const newCount = orders.filter(o => o.status === 'new').length
  const counts = Object.fromEntries(allFilters.map(f => [f, f === 'all' ? orders.length : orders.filter(o => o.status === f).length]))

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin" /></div>
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <Link href="/dashboard" className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
          <ArrowLeft size={16} className="text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="font-display font-bold text-brand-dark">Orders</h1>
          {newCount > 0 && <p className="text-xs text-brand-accent font-semibold">{newCount} new order{newCount > 1 ? 's' : ''} waiting</p>}
        </div>
        <button onClick={() => loadOrders(true)} disabled={refreshing} className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
          <RefreshCw size={14} className={`text-gray-500 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filter tabs */}
      <div className="bg-white border-b border-gray-100 px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
        {allFilters.map(f => {
          const cfg = STATUS_CONFIG[f]
          return (
            <button key={f} onClick={() => setFilter(f)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === f ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}>
              {cfg && filter !== f && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />}
              {f === 'all' ? 'All' : cfg?.label} ({counts[f]})
            </button>
          )
        })}
      </div>

      {loadError && (
        <div className="m-4 bg-red-50 border border-red-200 rounded-xl p-3">
          <p className="text-red-600 text-xs">{loadError}</p>
        </div>
      )}

      <div className="divide-y divide-gray-100">
        {filtered.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="text-4xl mb-3">📦</div>
            <p className="font-semibold text-gray-700 mb-1">No {filter === 'all' ? '' : filter} orders</p>
            <p className="text-gray-400 text-sm">Orders will appear here</p>
          </div>
        ) : filtered.map(order => {
          const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.new
          const isExpanded = expandedId === order.id
          const itemCount = (order.items || []).reduce((s, i) => s + i.qty, 0)

          return (
            <div key={order.id} className="bg-white">
              {/* Compact row — always visible */}
              <button onClick={() => setExpandedId(isExpanded ? null : order.id)}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left">
                <div className={`w-2 h-2 rounded-full shrink-0 mt-1 ${status.dot}`} />
                <div className="flex-1 min-w-0">
                  {/* Row 1: Customer name + amount */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display font-bold text-brand-dark text-sm truncate">
                      {order.customer_name || 'Unknown Customer'}
                    </span>
                    <span className="font-display font-bold text-brand-dark text-sm shrink-0">{formatNaira(order.subtotal)}</span>
                  </div>
                  {/* Row 2: Order number + status + time */}
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400">{order.order_number}</span>
                    <span className="text-gray-300">·</span>
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${status.color}`}>{status.label}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-400">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-400">{timeAgo(order.created_at)}</span>
                  </div>
                </div>
                {isExpanded ? <ChevronUp size={14} className="text-gray-400 shrink-0" /> : <ChevronDown size={14} className="text-gray-400 shrink-0" />}
              </button>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-gray-50">
                  {/* Customer */}
                  <div className="flex items-start justify-between pt-3">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{order.customer_name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">{order.customer_phone}</p>
                      {order.customer_address && order.customer_address !== 'PICKUP' && (
                        <p className="text-xs text-gray-400 mt-0.5">📍 {order.customer_address}</p>
                      )}
                      {order.customer_address === 'PICKUP' && <p className="text-xs text-brand-green font-semibold mt-0.5">📦 Pickup</p>}
                      {order.notes && <p className="text-xs text-gray-400 mt-0.5 italic">"{order.notes}"</p>}
                    </div>
                    <a href={`https://wa.me/${order.customer_phone?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${order.customer_name}! Regarding your order ${order.order_number}`)}`}
                      target="_blank" rel="noreferrer"
                      className="w-9 h-9 bg-[#25D366] rounded-xl flex items-center justify-center shrink-0">
                      <MessageCircle size={16} className="text-white" />
                    </a>
                  </div>

                  {/* Items */}
                  <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                    {(order.items || []).map((item, i) => (
                      <div key={i} className="flex justify-between text-xs text-gray-600">
                        <span>{item.name} × {item.qty}</span>
                        <span className="font-medium">₦{(item.price * item.qty / 100).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-xs font-bold text-gray-800 pt-1 border-t border-gray-200 mt-1">
                      <span>Total</span>
                      <span>{formatNaira(order.subtotal)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  {order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <div className="flex gap-2">
                      {order.status === 'new' && (
                        <button onClick={() => updateStatus(order.id, 'confirmed', order)} disabled={updatingId === order.id}
                          className="flex-1 bg-brand-green text-white text-xs font-bold py-2.5 rounded-xl disabled:opacity-50">
                          ✓ Confirm Order
                        </button>
                      )}
                      {order.status === 'confirmed' && (
                        <button onClick={() => updateStatus(order.id, 'dispatched', order)} disabled={updatingId === order.id}
                          className="flex-1 bg-purple-500 text-white text-xs font-bold py-2.5 rounded-xl disabled:opacity-50">
                          🚚 Mark Dispatched
                        </button>
                      )}
                      {order.status === 'dispatched' && (
                        <button onClick={() => updateStatus(order.id, 'delivered', order)} disabled={updatingId === order.id}
                          className="flex-1 bg-brand-green text-white text-xs font-bold py-2.5 rounded-xl disabled:opacity-50">
                          ✓ Mark Delivered
                        </button>
                      )}
                      <button onClick={() => updateStatus(order.id, 'cancelled', order)} disabled={updatingId === order.id}
                        className="bg-red-50 text-red-500 text-xs font-bold py-2.5 px-4 rounded-xl disabled:opacity-50">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
