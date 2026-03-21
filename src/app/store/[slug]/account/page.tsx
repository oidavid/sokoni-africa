'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Star, ShoppingBag, Heart, LogOut, User, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Customer { id: string; name: string; email: string; phone?: string }
interface Order { id: string; order_number: string; created_at: string; subtotal: number; status: string; items: Array<{name: string; qty: number; price: number}> }
interface Points { points: number; lifetime_points: number }

function formatNaira(kobo: number) { return `₦${(kobo / 100).toLocaleString()}` }
function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime()
  const days = Math.floor(diff / 86400000)
  return days === 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days} days ago`
}

const STATUS_COLOR: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700', confirmed: 'bg-amber-100 text-amber-700',
  dispatched: 'bg-purple-100 text-purple-700', delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
}

export default function CustomerAccountPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [points, setPoints] = useState<Points | null>(null)
  const [merchant, setMerchant] = useState<{ id: string; business_name: string; theme_color: string } | null>(null)
  const [tab, setTab] = useState<'orders' | 'points'>('orders')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: m } = await supabase.from('merchants').select('id, business_name, theme_color').eq('slug', slug).single()
      if (!m) return
      setMerchant(m)

      const stored = typeof window !== 'undefined' ? localStorage.getItem(`earket_customer_${slug}`) : null
      if (!stored) { setLoading(false); return }
      const c: Customer = JSON.parse(stored)
      setCustomer(c)

      // Load orders
      const { data: orderData } = await supabase.from('orders')
        .select('id, order_number, created_at, subtotal, status, items')
        .eq('merchant_id', m.id).eq('customer_id', c.id)
        .order('created_at', { ascending: false })
      setOrders(orderData || [])

      // Load points
      const { data: pts } = await supabase.from('customer_points')
        .select('points, lifetime_points').eq('customer_id', c.id).eq('merchant_id', m.id).single()
      setPoints(pts)
      setLoading(false)
    }
    load()
  }, [slug])

  const themeColor = merchant?.theme_color || '#1A7A4A'

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-brand-green border-t-transparent rounded-full animate-spin" /></div>

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
          <Link href={`/store/${slug}`} className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
            <ArrowLeft size={16} />
          </Link>
          <h1 className="font-display font-bold text-brand-dark">My Account</h1>
        </div>
        <div className="max-w-sm mx-auto px-4 py-12 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: themeColor + '20' }}>
            <User size={36} style={{ color: themeColor }} />
          </div>
          <h2 className="font-display font-bold text-xl text-brand-dark mb-2">Sign in to your account</h2>
          <p className="text-gray-500 text-sm mb-8">Track your orders, earn loyalty points and save your wishlist</p>
          <Link href={`/store/${slug}/login`}
            style={{ backgroundColor: themeColor }}
            className="w-full text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 mb-3">
            Sign In
          </Link>
          <Link href={`/store/${slug}/register`}
            className="w-full bg-gray-100 text-gray-700 font-bold py-4 rounded-2xl flex items-center justify-center">
            Create Account
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Link href={`/store/${slug}`} className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
          <ArrowLeft size={16} />
        </Link>
        <h1 className="font-display font-bold text-brand-dark flex-1">My Account</h1>
        <button onClick={() => { localStorage.removeItem(`earket_customer_${slug}`); router.refresh() }}
          className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
          <LogOut size={14} className="text-gray-500" />
        </button>
      </div>

      <div className="max-w-lg mx-auto">
        {/* Profile card */}
        <div className="px-4 py-5">
          <div className="rounded-2xl p-4 text-white" style={{ backgroundColor: themeColor }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="font-display font-bold text-xl">{customer.name[0]}</span>
              </div>
              <div>
                <p className="font-display font-bold text-lg">{customer.name}</p>
                <p className="text-white/70 text-xs">{customer.email}</p>
              </div>
            </div>
            {points && (
              <div className="bg-white/10 rounded-xl p-3 flex items-center gap-3">
                <Star size={20} className="text-yellow-300 shrink-0" fill="currentColor" />
                <div>
                  <p className="font-display font-bold text-2xl">{points.points.toLocaleString()}</p>
                  <p className="text-white/70 text-xs">{points.lifetime_points.toLocaleString()} lifetime points earned at {merchant?.business_name}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 flex gap-2 mb-4">
          {(['orders', 'points'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${tab === t ? 'text-white' : 'bg-gray-100 text-gray-500'}`}
              style={tab === t ? { backgroundColor: themeColor } : {}}>
              {t === 'orders' ? `Orders (${orders.length})` : 'Points History'}
            </button>
          ))}
        </div>

        {tab === 'orders' && (
          <div className="px-4 space-y-3 pb-8">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag size={40} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-semibold">No orders yet</p>
                <Link href={`/store/${slug}`} className="text-sm font-semibold mt-2 block" style={{ color: themeColor }}>Start shopping →</Link>
              </div>
            ) : orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display font-bold text-brand-dark text-sm">{order.order_number}</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLOR[order.status] || STATUS_COLOR.new}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-3">{timeAgo(order.created_at)} · {(order.items || []).reduce((s, i) => s + i.qty, 0)} items</p>
                <div className="space-y-1 mb-3">
                  {(order.items || []).slice(0, 3).map((item, i) => (
                    <div key={i} className="flex justify-between text-xs text-gray-600">
                      <span>{item.name} × {item.qty}</span>
                      <span>₦{(item.price * item.qty / 100).toLocaleString()}</span>
                    </div>
                  ))}
                  {(order.items || []).length > 3 && <p className="text-xs text-gray-400">+{order.items.length - 3} more items</p>}
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">Total</span>
                  <span className="font-display font-bold text-sm" style={{ color: themeColor }}>{formatNaira(order.subtotal)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'points' && (
          <div className="px-4 pb-8">
            <div className="bg-white rounded-2xl p-4 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <Star size={24} className="text-yellow-400" fill="currentColor" />
                <div>
                  <p className="font-display font-bold text-2xl text-brand-dark">{(points?.points || 0).toLocaleString()} pts</p>
                  <p className="text-xs text-gray-500">Available to redeem</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600">
                <p className="font-semibold mb-1">How to earn points:</p>
                <p>• Earn 1 point for every ₦100 you spend</p>
                <p>• Points are added after each order</p>
                <p>• Contact the store to redeem your points</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
