'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Package, Plus, ExternalLink, LogOut, RefreshCw, Settings, Pencil, ShoppingCart, TrendingUp, BarChart2, CreditCard, Sparkles, Inbox } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getThemeById, getThemeStyle, EARKET_THEMES, type EarketTheme } from '@/lib/themes'

interface Merchant {
  id: string
  business_name: string
  slug: string
  location: string
  whatsapp_number: string
  category: string
  email: string
  business_type?: string
  theme_preset?: string
  theme_color?: string
}

interface Product {
  id: string
  name: string
  price: number
  price_display: string
  in_stock: boolean
  image_url?: string
}

const CATEGORY_EMOJI: Record<string, string> = {
  fashion: '👗', food: '🍱', electronics: '📱', beauty: '💄',
  groceries: '🛒', furniture: '🪑', shoes: '👟', phones: '💻',
  health: '💊', stationery: '📚', automobile: '🚗', other: '🏪',
  home_services: '🔧', auto_services: '🚗', beauty_services: '💄',
  education: '📚', health_wellness: '🏥', domestic: '🏠',
  events: '🎉', digital_services: '💻', transport: '🚚', agriculture: '🌱',
}

export default function DashboardPage() {
  const router = useRouter()
  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [orderCount, setOrderCount] = useState(0)
  const [newOrderCount, setNewOrderCount] = useState(0)
  const [leadCount, setLeadCount] = useState(0)
  const [refreshingServices, setRefreshingServices] = useState(false)
  const [refreshDone, setRefreshDone] = useState(false)
  const [showThemePicker, setShowThemePicker] = useState(false)
  const [savingTheme, setSavingTheme] = useState(false)

  const loadData = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    const { data: { user } } = await supabase.auth.getUser()
    const fallbackEmail = typeof window !== 'undefined' ? localStorage.getItem('earket_merchant_email') : null
    const merchantEmail = user?.email || fallbackEmail
    if (!merchantEmail) { router.push('/login'); return }
    const { data: m } = await supabase.from('merchants').select('*').eq('email', merchantEmail).single()
    if (!m) { router.push('/onboarding'); return }
    setMerchant(m)
    const { data: prods } = await supabase.from('products').select('*').eq('merchant_id', m.id).order('created_at', { ascending: false })
    setProducts(prods || [])
    const { count: total } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('merchant_id', m.id)
    const { count: newOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('merchant_id', m.id).eq('status', 'new')
    const { count: totalLeads } = await supabase.from('leads').select('*', { count: 'exact', head: true }).eq('merchant_id', m.id)
    setOrderCount(total || 0)
    setNewOrderCount(newOrders || 0)
    setLeadCount(totalLeads || 0)
    setLoading(false)
    setRefreshing(false)
  }, [router])

  useEffect(() => { loadData() }, [loadData])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  async function refreshServices() {
    if (!merchant || refreshingServices) return
    setRefreshingServices(true)
    try {
      // Delete existing sample/placeholder services
      await supabase.from('products').delete().eq('merchant_id', merchant.id)
      // Fetch fresh services based on category
      const res = await fetch('/api/services/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchant_id: merchant.id, category: merchant.category })
      })
      await loadData(true)
      setRefreshDone(true)
      setTimeout(() => setRefreshDone(false), 4000)
    } catch (e) {
      console.error('Refresh error:', e)
    }
    setRefreshingServices(false)
  }

  function formatPrice(p: Product) {
    if (p.price_display) return p.price_display
    return `₦${(p.price / 100).toLocaleString()}`
  }

  async function saveTheme(theme: EarketTheme) {
    if (!merchant) return
    setSavingTheme(true)
    await supabase.from('merchants').update({
      theme_color: theme.primary,
      theme_preset: theme.id,
    }).eq('id', merchant.id)
    setMerchant(prev => prev ? { ...prev, theme_color: theme.primary, theme_preset: theme.id } : prev)
    setSavingTheme(false)
    setShowThemePicker(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!merchant) return null

  const isService = merchant.business_type === 'services'
  const inStockCount = products.filter(p => p.in_stock).length
  const categoryEmoji = CATEGORY_EMOJI[merchant.category] || '🏪'
  const storeUrl = typeof window !== 'undefined' ? `${window.location.origin}/store/${merchant.slug}` : ''

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <nav className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-green rounded-lg flex items-center justify-center">
            <ShoppingBag size={14} className="text-white" />
          </div>
          <span className="font-display font-bold text-brand-dark">Earket</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/store/${merchant.slug}`} target="_blank"
            className="flex items-center gap-1.5 text-xs text-brand-green font-medium border border-brand-green/20 bg-brand-light rounded-xl px-3 py-2 hover:bg-brand-green hover:text-white transition-colors">
            <ExternalLink size={12} /> View Store
          </Link>
          <button onClick={handleLogout}
            className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200">
            <LogOut size={15} className="text-gray-500" />
          </button>
        </div>
      </nav>

      {/* Theme picker modal */}
      {showThemePicker && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowThemePicker(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl p-5">
            <h3 className="font-display font-bold text-brand-dark text-lg mb-1">Change Theme</h3>
            <p className="text-gray-500 text-xs mb-4">Pick a new colour theme for your business page</p>
            <div className="grid grid-cols-3 gap-2 mb-4 max-h-72 overflow-y-auto">
              {EARKET_THEMES.map(theme => (
                <button key={theme.id} onClick={() => saveTheme(theme)}
                  disabled={savingTheme}
                  className={`relative rounded-2xl overflow-hidden border-2 transition-all ${
                    merchant?.theme_preset === theme.id ? 'border-brand-green scale-105 shadow-lg' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  <div className="h-10 w-full" style={getThemeStyle(theme)} />
                  <div className="bg-white px-2 py-1.5 text-center">
                    <p className="text-xs font-semibold text-gray-700 leading-tight">{theme.emoji} {theme.name}</p>
                  </div>
                  {merchant?.theme_preset === theme.id && (
                    <div className="absolute top-1 right-1 w-5 h-5 bg-brand-green rounded-full flex items-center justify-center">
                      <svg viewBox="0 0 12 10" className="w-3 h-3"><path d="M1 5l3 4L11 1" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <button onClick={() => setShowThemePicker(false)} className="w-full text-sm text-gray-400 font-medium py-2">Cancel</button>
          </div>
        </div>
      )}

      <div className="max-w-lg mx-auto px-4 py-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="font-display font-bold text-xl text-brand-dark">{categoryEmoji} {merchant.business_name}</h1>
            <p className="text-gray-500 text-sm">{merchant.location}</p>
          </div>
          <button onClick={() => loadData(true)} disabled={refreshing}
            className="w-9 h-9 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50">
            <RefreshCw size={15} className={`text-gray-400 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Add product / service CTA */}
        <Link href="/dashboard/products/new"
          className="flex items-center gap-3 bg-brand-green text-white rounded-2xl p-4 mb-5 hover:bg-brand-dark transition-colors active:scale-[0.98]">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Plus size={20} />
          </div>
          <div>
            <div className="font-display font-bold">{isService ? 'Add New Service' : 'Add New Product'}</div>
            <div className="text-xs text-white/70">
              {isService ? 'Add a service with description and pricing ✨' : 'AI writes the description for you ✨'}
            </div>
          </div>
        </Link>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          <div className="bg-white rounded-2xl p-3 border border-gray-100">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2 bg-blue-50 text-blue-600">
              <Package size={16} />
            </div>
            <div className="font-display font-bold text-xl text-brand-dark">{products.length}</div>
            <div className="text-xs text-gray-500">{isService ? 'Services' : 'Products'}</div>
          </div>
          <div className="bg-white rounded-2xl p-3 border border-gray-100">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2 bg-brand-light text-brand-green">
              <ShoppingBag size={16} />
            </div>
            <div className="font-display font-bold text-xl text-brand-dark">{inStockCount}</div>
            <div className="text-xs text-gray-500">{isService ? 'Available' : 'In Stock'}</div>
          </div>
          <Link href="/dashboard/leads" className="bg-white rounded-2xl p-3 border border-gray-100 hover:border-brand-green transition-colors">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2 bg-purple-50 text-purple-600">
              <Inbox size={16} />
            </div>
            <div className="font-display font-bold text-xl text-brand-dark">{leadCount}</div>
            <div className="text-xs text-gray-500">Leads</div>
          </Link>
          <Link href="/dashboard/orders" className="bg-white rounded-2xl p-3 border border-gray-100 relative hover:border-brand-green transition-colors">
            {newOrderCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-accent rounded-full text-white text-xs font-bold flex items-center justify-center">
                {newOrderCount}
              </span>
            )}
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2 bg-amber-50 text-amber-600">
              <ShoppingCart size={16} />
            </div>
            <div className="font-display font-bold text-xl text-brand-dark">{orderCount}</div>
            <div className="text-xs text-gray-500">{isService ? 'Bookings' : 'Orders'}</div>
          </Link>
        </div>

        {/* Payment Setup Banner */}
        {!(merchant as any).paystack_subaccount && (
          <Link href="/dashboard/payments"
            className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 hover:bg-amber-100 transition-colors">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
              <CreditCard size={18} className="text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-amber-800 text-sm">Enable Online Payments</p>
              <p className="text-amber-600 text-xs">Connect your bank account to accept card payments</p>
            </div>
            <span className="text-amber-500 text-lg">→</span>
          </Link>
        )}

        {/* Store link + share buttons */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-5">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Your Store</div>
            <button onClick={() => setShowThemePicker(true)}
              className="flex items-center gap-1 text-xs font-semibold text-brand-green bg-brand-light px-2.5 py-1 rounded-lg border border-brand-green/20">
              🎨 Theme
            </button>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 bg-brand-light rounded-xl px-3 py-2.5 text-xs font-medium text-brand-green truncate">
              earket.com/store/{merchant.slug}
            </div>
            <a href={storeUrl} target="_blank" rel="noreferrer"
              className="shrink-0 bg-brand-green text-white text-xs font-semibold px-3 py-2.5 rounded-xl">
              Visit
            </a>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <a href={`https://wa.me/?text=${encodeURIComponent(`🛍️ Shop at *${merchant.business_name}*!\n\nBrowse and order online:\nearket.com/share/${merchant.slug}`)}`}
              target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-1.5 bg-[#25D366] text-white text-xs font-semibold py-2.5 rounded-xl">
              📲 Share on WhatsApp
            </a>
            <a href={`https://earket.com/share/${merchant.slug}`} target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-1.5 bg-brand-light text-brand-green text-xs font-semibold py-2.5 rounded-xl border border-brand-green/20">
              🔗 Share Page
            </a>
          </div>
          <div className="mt-2">
            <Link href="/dashboard/broadcast"
              className="w-full flex items-center justify-center gap-1.5 bg-gray-50 text-gray-600 text-xs font-semibold py-2.5 rounded-xl border border-gray-200">
              📢 Broadcast to Customers
            </Link>
          </div>
          {isService && (
            <div className="mt-2">
              <button onClick={refreshServices} disabled={refreshingServices}
                className="w-full flex items-center justify-center gap-1.5 bg-brand-light text-brand-green text-xs font-semibold py-2.5 rounded-xl border border-brand-green/20 disabled:opacity-50">
                {refreshingServices ? <RefreshCw size={13} className="animate-spin" /> : <Sparkles size={13} />}
                {refreshDone ? '✅ Services refreshed!' : refreshingServices ? 'Refreshing services...' : 'Refresh My Services'}
              </button>
              <p className="text-xs text-gray-400 text-center mt-1">Replace all services with fresh AI-selected ones</p>
            </div>
          )}
        </div>

        {/* Private placeholder notice for service businesses */}
        {isService && products.length > 0 && products.some(p => p.image_url && p.image_url.includes('unsplash')) && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 flex items-start gap-3">
            <span className="text-xl shrink-0">📸</span>
            <div className="flex-1">
              <p className="font-semibold text-amber-800 text-sm">Add your own photos</p>
              <p className="text-amber-700 text-xs mt-0.5">Your services are using placeholder images. Tap any service below to upload your real photos — it builds much more trust with customers.</p>
            </div>
          </div>
        )}

        {/* Sample products nudge — products mode only */}
        {!isService && products.length > 0 && products.some(p =>
          p.name.startsWith('My Product') ||
          ['Indomie Noodles', 'Golden Penny', 'Vegetable Oil', 'Pounded Yam', 'Ankara Print', 'Plain Cotton'].some(s => p.name.startsWith(s))
        ) && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 flex items-start gap-3">
            <div className="text-xl shrink-0">📸</div>
            <div>
              <p className="font-semibold text-amber-800 text-sm">Replace sample products with yours</p>
              <p className="text-amber-700 text-xs mt-0.5">Your store has sample products. Add your real products with photos for a better customer experience.</p>
              <Link href="/dashboard/products/new" className="inline-block mt-2 text-xs font-bold text-amber-800 underline">
                Add my real products →
              </Link>
            </div>
          </div>
        )}

        {/* Products / Services list */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-5">
          <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-display font-bold text-brand-dark">
              {isService ? 'Your Services' : 'Your Products'}
            </h2>
            <Link href="/dashboard/products/new" className="text-xs text-brand-green font-semibold">+ Add</Link>
          </div>
          {products.length === 0 ? (
            <div className="text-center py-10 px-4">
              <div className="text-3xl mb-2">{isService ? '🔧' : '📦'}</div>
              <p className="text-gray-500 text-sm mb-1">{isService ? 'No services yet' : 'No products yet'}</p>
              <Link href="/dashboard/products/new" className="inline-block bg-brand-green text-white text-xs font-bold px-5 py-2.5 rounded-xl mt-2">
                {isService ? 'Add First Service' : 'Add First Product'}
              </Link>
            </div>
          ) : (
            products.map((product, i) => (
              <div key={product.id} className={`px-4 py-3 flex items-center gap-3 ${i < products.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <div className="w-9 h-9 bg-brand-light rounded-xl flex items-center justify-center font-bold text-brand-green shrink-0 text-sm">
                  {product.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-gray-800 truncate">{product.name}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1.5">
                    <span className="font-medium text-brand-green">{formatPrice(product)}</span>
                    <span>·</span>
                    <span className={product.in_stock ? 'text-green-500' : 'text-red-400'}>
                      {isService
                        ? (product.in_stock ? 'Available' : 'Unavailable')
                        : (product.in_stock ? 'In Stock' : 'Out of Stock')}
                    </span>
                  </div>
                </div>
                <Link href={`/dashboard/products/edit?id=${product.id}`}
                  className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-brand-light shrink-0">
                  <Pencil size={13} className="text-gray-500" />
                </Link>
              </div>
            ))
          )}
        </div>

        {/* WhatsApp */}
        <div className="bg-[#075E54] text-white rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl">💬</div>
          <div className="flex-1 min-w-0">
            <div className="font-display font-bold text-sm">
              WhatsApp {isService ? 'Bookings' : 'Orders'}
            </div>
            <div className="text-xs text-white/70 truncate">+{merchant.whatsapp_number}</div>
          </div>
          <a href={`https://wa.me/${merchant.whatsapp_number?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
            className="text-xs bg-[#25D366] px-3 py-1.5 rounded-xl font-semibold shrink-0">
            Open
          </a>
        </div>
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex max-w-lg mx-auto">
        {[
          { icon: TrendingUp, label: 'Dashboard', href: '/dashboard' },
          { icon: Package, label: isService ? 'Services' : 'Products', href: '/dashboard/products/new' },
          { icon: Inbox, label: 'Leads', href: '/dashboard/leads' },
          { icon: ShoppingCart, label: isService ? 'Bookings' : 'Orders', href: '/dashboard/orders' },
          { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
        ].map((item, i) => (
          <Link key={i} href={item.href}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${i === 0 ? 'text-brand-green' : 'text-gray-400'}`}>
            <item.icon size={20} />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

