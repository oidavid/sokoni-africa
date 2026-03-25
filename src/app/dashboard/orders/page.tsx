'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, RefreshCw, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type OrderStatus = 'new' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled' | 'completed'
type TabKey = 'new' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled' | 'cash' | 'all'

interface Order {
  id: string
  status: OrderStatus
  source?: string
  subtotal: number
  items: any[]
  created_at: string
  customer_name?: string
  customer_phone?: string
  customer_email?: string
  payment_method?: string
}

interface Merchant {
  id: string
  business_name: string
  currency: string
  country: string
}

const CURRENCY_MAP: Record<string, string> = {
  'NG': '₦', 'GH': 'GH₵', 'KE': 'KSh', 'ZA': 'R', 'US': '$', 'GB': '£', 'TZ': 'TSh'
}

function formatRelative(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  return `${diffDays}d ago`
}

function formatAbsolute(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ' at ' + date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

// Returns urgency level for unresolved orders (new/confirmed/dispatched)
function urgency(order: Order): 'none' | 'warn' | 'alert' {
  if (order.source === 'cash_pos') return 'none'
  if (!['new', 'confirmed', 'dispatched'].includes(order.status)) return 'none'
  const diffHours = (Date.now() - new Date(order.created_at).getTime()) / 3600000
  if (diffHours >= 4) return 'alert'   // red — 4+ hours unresolved
  if (diffHours >= 2) return 'warn'    // amber — 2+ hours unresolved
  return 'none'
}

function statusBadge(order: Order) {
  if (order.source === 'cash_pos') {
    return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Completed</span>
  }
  const map: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-amber-100 text-amber-700',
    dispatched: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-green-100 text-green-700',
  }
  const label = order.status.charAt(0).toUpperCase() + order.status.slice(1)
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${map[order.status] || 'bg-gray-100 text-gray-600'}`}>{label}</span>
}

const TABS: { key: TabKey; label: string }[] = [
  { key: 'new', label: 'New' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'dispatched', label: 'Dispatched' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cash', label: 'Cash Sales' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'all', label: 'All' },
]

export default function OrdersPage() {
  const router = useRouter()
  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [tab, setTab] = useState<TabKey>('new')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  async function load(showSpin = false) {
    if (showSpin) setRefreshing(true)
    const { data: { user } } = await supabase.auth.getUser()
    const email = user?.email || (typeof window !== 'undefined' ? localStorage.getItem('earket_merchant_email') : null)
    if (!email) { router.push('/login'); return }
    const { data: m } = await supabase.from('merchants').select('id, business_name, country').eq('email', email).single()
    if (!m) { router.push('/onboarding'); return }
    const currency = CURRENCY_MAP[m.country || 'NG'] || '₦'
    setMerchant({ ...m, currency })

    const { data: o } = await supabase
      .from('orders')
      .select('id, status, source, subtotal, items, created_at, customer_name, customer_phone, customer_email, payment_method')
      .eq('merchant_id', m.id)
      .order('created_at', { ascending: false })
      .limit(200)
    setOrders(o || [])
    setLoading(false)
    setRefreshing(false)
  }

  useEffect(() => { load() }, [])

  const fmt = (kobo: number) => `${merchant?.currency}${(kobo / 100).toLocaleString()}`

  function filterOrders(): Order[] {
    if (tab === 'cash') return orders.filter(o => o.source === 'cash_pos')
    if (tab === 'all') return orders
    return orders.filter(o => o.status === tab && o.source !== 'cash_pos')
  }

  function countTab(key: TabKey): number {
    if (key === 'cash') return orders.filter(o => o.source === 'cash_pos').length
    if (key === 'all') return orders.length
    return orders.filter(o => o.status === key && o.source !== 'cash_pos').length
  }

  async function updateStatus(orderId: string, newStatus: string) {
    setUpdatingId(orderId)
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)
    await load()
    setUpdatingId(null)
  }

  const STATUS_NEXT: Record<string, string> = {
    new: 'confirmed',
    confirmed: 'dispatched',
    dispatched: 'delivered',
  }
  const STATUS_NEXT_LABEL: Record<string, string> = {
    new: 'Confirm Order',
    confirmed: 'Mark Dispatched',
    dispatched: 'Mark Delivered',
  }

  const filtered = filterOrders()

  // Cash sales totals
  const cashOrders = orders.filter(o => o.source === 'cash_pos')
  const cashTotal = cashOrders.reduce((s, o) => s + (o.subtotal || 0), 0)

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
              <ArrowLeft size={18} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="font-display font-bold text-gray-900 text-base">Orders</h1>
              {countTab('new') > 0 && (
                <p className="text-xs text-amber-600 font-semibold">{countTab('new')} new order{countTab('new') !== 1 ? 's' : ''} waiting</p>
              )}
            </div>
          </div>
          <button onClick={() => load(true)} disabled={refreshing}
            className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
            <RefreshCw size={16} className={`text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Tabs — horizontally scrollable */}
        <div className="flex gap-2 mt-3 max-w-2xl mx-auto overflow-x-auto pb-1 scrollbar-none">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                tab === t.key ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-500'
              }`}>
              {t.label} ({countTab(t.key)})
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-4 pb-10 space-y-3">

        {/* Cash sales summary banner */}
        {tab === 'cash' && cashOrders.length > 0 && (
          <div className="bg-brand-light border border-brand-green/30 rounded-2xl px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Total Cash Sales</p>
              <p className="font-display font-bold text-brand-green text-lg">{fmt(cashTotal)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 font-medium">Transactions</p>
              <p className="font-bold text-gray-800">{cashOrders.length}</p>
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
            <ShoppingBag size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              {tab === 'cash' ? 'No cash sales recorded yet' : `No ${tab} orders`}
            </p>
            {tab === 'cash' && (
              <Link href="/dashboard/cash-sale" className="mt-2 inline-block text-xs text-brand-green font-semibold">
                Record a cash sale →
              </Link>
            )}
          </div>
        ) : (
          filtered.map(order => {
            const u = urgency(order)
            const borderClass = u === 'alert' ? 'border-red-300 bg-red-50/30' : u === 'warn' ? 'border-amber-300 bg-amber-50/30' : 'border-gray-100'
            return (
            <div key={order.id} className={`bg-white rounded-2xl border overflow-hidden ${borderClass}`}>
              <button
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                className="w-full flex items-center justify-between p-4 text-left">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-gray-900 text-sm truncate">
                      {order.customer_name || 'Walk-in Customer'}
                    </p>
                    {statusBadge(order)}
                  </div>
                  <p className="text-xs text-gray-400 flex items-center gap-1.5">
                    <span>{order.source === 'cash_pos' ? `CASH-${order.id.slice(-8).toUpperCase()}` : `ORD-${order.id.slice(-4).toUpperCase()}`}</span>
                    <span>·</span>
                    <span>{(order.items || []).length} item{(order.items || []).length !== 1 ? 's' : ''}</span>
                    <span>·</span>
                    <span className={u === 'alert' ? 'text-red-500 font-semibold' : u === 'warn' ? 'text-amber-500 font-semibold' : ''}>
                      {formatRelative(order.created_at)}
                    </span>
                    {u === 'alert' && <span className="text-[10px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded-full">Needs attention</span>}
                    {u === 'warn' && <span className="text-[10px] bg-amber-100 text-amber-600 font-bold px-1.5 py-0.5 rounded-full">Waiting</span>}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-2 shrink-0">
                  <p className="font-bold text-gray-900">{fmt(order.subtotal || 0)}</p>
                  {expanded === order.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </div>
              </button>

              {expanded === order.id && (
                <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-3">
                  {/* Items */}
                  <div className="space-y-1">
                    {(order.items || []).map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.name} × {item.qty}</span>
                        <span className="text-gray-600 font-medium">{fmt((item.price || 0) * item.qty)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Customer info */}
                  {(order.customer_phone || order.customer_email) && (
                    <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 space-y-0.5">
                      {order.customer_phone && <p>📱 {order.customer_phone}</p>}
                      {order.customer_email && <p>✉️ {order.customer_email}</p>}
                    </div>
                  )}

                  {/* Full timestamp */}
                  <div className="text-xs text-gray-400 border-t border-gray-100 pt-2">
                    📅 Placed: <span className="font-medium text-gray-600">{formatAbsolute(order.created_at)}</span>
                  </div>

                  {/* Action buttons — only for online orders */}
                  {order.source !== 'cash_pos' && STATUS_NEXT[order.status] && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(order.id, STATUS_NEXT[order.status])}
                        disabled={updatingId === order.id}
                        className="flex-1 bg-brand-green text-white text-xs font-bold py-2.5 rounded-xl disabled:opacity-60">
                        {updatingId === order.id ? 'Updating...' : STATUS_NEXT_LABEL[order.status]}
                      </button>
                      <button
                        onClick={() => updateStatus(order.id, 'cancelled')}
                        disabled={updatingId === order.id}
                        className="px-4 bg-red-50 text-red-500 text-xs font-bold py-2.5 rounded-xl border border-red-200 disabled:opacity-60">
                        Cancel
                      </button>
                    </div>
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
