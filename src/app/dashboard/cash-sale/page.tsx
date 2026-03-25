'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Minus, ShoppingBag, Check, Search, X, FileText, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Product { id: string; name: string; price: number; price_display: string; image_url: string | null; in_stock: boolean; category?: string }
interface CartItem { product: Product; qty: number }

export default function CashSalePage() {
  const router = useRouter()
  const [merchant, setMerchant] = useState<{ id: string; business_name: string; currency: string } | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [note, setNote] = useState('')
  const [todaySales, setTodaySales] = useState(0)
  const [todayCount, setTodayCount] = useState(0)
  const [tab, setTab] = useState<'sale'|'today'>('sale')
  const [todayOrders, setTodayOrders] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      const email = user?.email || (typeof window !== 'undefined' ? localStorage.getItem('earket_merchant_email') : null)
      if (!email) { router.push('/login'); return }
      const { data: m } = await supabase.from('merchants').select('id, business_name, country').eq('email', email).single()
      if (!m) { router.push('/onboarding'); return }
      const currencyMap: Record<string, string> = { 'NG': '₦', 'GH': 'GH₵', 'KE': 'KSh', 'ZA': 'R', 'US': '$', 'GB': '£', 'TZ': 'TSh' }
      setMerchant({ id: m.id, business_name: m.business_name, currency: currencyMap[m.country || 'NG'] || '₦' })
      const { data: prods } = await supabase.from('products').select('id, name, price, price_display, image_url, in_stock').eq('merchant_id', m.id).eq('in_stock', true).order('name')
      setProducts(prods || [])
      // Load today's cash sales
      const today = new Date().toISOString().split('T')[0]
      const { data: orders } = await supabase.from('orders').select('id, subtotal, items, created_at, customer_name, notes').eq('merchant_id', m.id).eq('status', 'cash_sale').gte('created_at', today + 'T00:00:00').order('created_at', { ascending: false })
      const todayO = orders || []
      setTodayOrders(todayO)
      setTodaySales(todayO.reduce((s: number, o: any) => s + (o.subtotal || 0), 0))
      setTodayCount(todayO.length)
      setLoading(false)
    }
    load()
  }, [router, success])

  function addToCart(product: Product) {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { product, qty: 1 }]
    })
  }

  function updateQty(id: string, delta: number) {
    setCart(prev => prev.map(i => i.product.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0))
  }

  const total = cart.reduce((s, i) => s + i.product.price * i.qty, 0)
  const fmt = (kobo: number) => `${merchant?.currency}${(kobo / 100).toLocaleString()}`
  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  async function recordSale() {
    if (cart.length === 0 || !merchant) return
    setSaving(true)
    const items = cart.map(i => ({ product_id: i.product.id, name: i.product.name, price: i.product.price, qty: i.qty }))
    await supabase.from('orders').insert({
      merchant_id: merchant.id,
      status: 'cash_sale',
      subtotal: total,
      total: total,
      items,
      customer_name: customerName || 'Walk-in Customer',
      notes: note || null,
      source: 'cash_pos',
    })
    // Update analytics
    const today = new Date().toISOString().split('T')[0]
    await supabase.rpc('increment_analytics', { p_merchant_id: merchant.id, p_date: today, p_field: 'views' }).catch(() => {})
    setCart([])
    setCustomerName('')
    setNote('')
    setSaving(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
              <ArrowLeft size={18} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="font-display font-bold text-gray-900 text-base">Cash Sale</h1>
              <p className="text-xs text-gray-500">Record a walk-in sale</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Today's sales</p>
            <p className="font-bold text-brand-green text-sm">{fmt(todaySales)} <span className="text-gray-400 font-normal">({todayCount})</span></p>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-2 mt-3 max-w-2xl mx-auto">
          <button onClick={() => setTab('sale')} className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${tab === 'sale' ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-500'}`}>
            + New Sale
          </button>
          <button onClick={() => setTab('today')} className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${tab === 'today' ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-500'}`}>
            Today ({todayCount})
          </button>
        </div>
      </div>

      {/* Success toast */}
      {success && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-brand-green text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-bold">
          <Check size={16} /> Sale recorded!
        </div>
      )}

      {tab === 'today' ? (
        <div className="max-w-2xl mx-auto px-4 pt-4 space-y-3">
          {todayOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
              <ShoppingBag size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No cash sales recorded today yet</p>
            </div>
          ) : todayOrders.map((o: any, i: number) => (
            <div key={o.id} className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-gray-900 text-sm">{o.customer_name || 'Walk-in Customer'}</p>
                <p className="font-bold text-brand-green">{fmt(o.subtotal)}</p>
              </div>
              <p className="text-xs text-gray-400">{new Date(o.created_at).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })} · {(o.items || []).length} item{(o.items || []).length !== 1 ? 's' : ''}</p>
              {(o.items || []).map((item: any, j: number) => (
                <p key={j} className="text-xs text-gray-600 mt-1">• {item.name} × {item.qty}</p>
              ))}
            </div>
          ))}
          <Link href="/dashboard/analytics" className="flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-2xl p-3 text-sm font-semibold text-brand-green">
            <TrendingUp size={16} /> View Full Analytics
          </Link>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto px-4 pt-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
              className="w-full bg-white border border-gray-200 rounded-2xl pl-9 pr-4 py-3 text-sm outline-none focus:border-brand-green" />
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(p => {
              const inCart = cart.find(i => i.product.id === p.id)
              return (
                <button key={p.id} onClick={() => addToCart(p)}
                  className={`bg-white rounded-2xl p-3 border text-left transition-all ${inCart ? 'border-brand-green shadow-md' : 'border-gray-100 hover:border-brand-green/50'}`}>
                  {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-20 object-cover rounded-xl mb-2" />}
                  <p className="text-sm font-semibold text-gray-800 leading-tight truncate">{p.name}</p>
                  <p className="text-xs font-bold text-brand-green mt-1">{p.price_display}</p>
                  {inCart && <p className="text-xs text-brand-green font-bold mt-1">× {inCart.qty} in cart</p>}
                </button>
              )
            })}
          </div>

          {products.length === 0 && (
            <div className="bg-white rounded-2xl p-6 text-center border border-gray-100">
              <p className="text-gray-500 text-sm">No products yet. <Link href="/dashboard/products/new" className="text-brand-green font-semibold">Add products first →</Link></p>
            </div>
          )}
        </div>
      )}

      {/* Cart footer */}
      {cart.length > 0 && tab === 'sale' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-2xl px-4 py-4 z-20">
          <div className="max-w-2xl mx-auto">
            {/* Cart items */}
            <div className="space-y-2 mb-3 max-h-36 overflow-y-auto">
              {cart.map(item => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <p className="flex-1 text-sm font-medium text-gray-800 truncate">{item.product.name}</p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.product.id, -1)} className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center"><Minus size={12} /></button>
                    <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.product.id, 1)} className="w-7 h-7 bg-brand-green/10 rounded-lg flex items-center justify-center"><Plus size={12} className="text-brand-green" /></button>
                  </div>
                  <p className="text-sm font-bold text-gray-800 w-20 text-right">{fmt(item.product.price * item.qty)}</p>
                </div>
              ))}
            </div>
            {/* Optional fields */}
            <div className="flex gap-2 mb-3">
              <input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Customer name (optional)"
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-brand-green" />
            </div>
            {/* Total + button */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-xl font-display font-bold text-gray-900">{fmt(total)}</p>
              </div>
              <button onClick={recordSale} disabled={saving}
                className="flex-1 bg-brand-green text-white font-bold py-4 rounded-2xl text-sm disabled:opacity-70 flex items-center justify-center gap-2">
                {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check size={16} />}
                {saving ? 'Recording...' : 'Record Sale'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
