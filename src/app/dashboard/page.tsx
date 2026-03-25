'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBag, FileText, Package, Plus, ExternalLink, LogOut, RefreshCw, Settings, Pencil, ShoppingCart, TrendingUp, BarChart2, CreditCard, Sparkles, Inbox, Tag, Megaphone, ChevronDown, ChevronUp } from 'lucide-react'
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

const GRID_PREVIEW = 9 // products visible before "show all"

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
  const [announcements, setAnnouncements] = useState<{id:string;message:string;type:string}[]>([])
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())
  const [proJoined, setProJoined] = useState(false)
  const [joiningPro, setJoiningPro] = useState(false)
  const [showAllProducts, setShowAllProducts] = useState(false)

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
    const { data: ann } = await supabase.from('announcements').select('id,message,type').eq('active', true).order('created_at', { ascending: false })
    setAnnouncements(ann || [])
    const { data: waitlist } = await supabase.from('pro_waitlist').select('id').eq('merchant_id', m.id).maybeSingle()
    if (waitlist) setProJoined(true)
    await supabase.from('merchants').update({ last_login_at: new Date().toISOString() }).eq('id', m.id)
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
      await supabase.from('products').delete().eq('merchant_id', merchant.id)
      await fetch('/api/services/refresh', {
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
  const visibleProducts = showAllProducts ? products : products.slice(0, GRID_PREVIEW)

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* ── TOP NAV ── */}
      <nav className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-brand-green rounded-lg flex items-center justify-center">
            <ShoppingBag size={14} className="text-white" />
          </div>
          <div>
            <div className="font-display font-bold text-sm text-brand-dark leading-tight">{merchant.business_name}</div>
            <div className="text-xs text-gray-400 leading-tight">{merchant.location}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Pro pill only shows if no promo announcement is active */}
          {!proJoined && announcements.filter(a => a.type === 'promo' && !dismissedIds.has(a.id)).length === 0 && (
            <button
              disabled={joiningPro}
              onClick={async () => {
                if (!merchant) return
                setJoiningPro(true)
                await supabase.from('pro_waitlist').upsert({
                  merchant_id: merchant.id,
                  email: merchant.email,
                  business_name: merchant.business_name,
                }, { onConflict: 'merchant_id' })
                setProJoined(true)
                setJoiningPro(false)
              }}
              className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1.5 rounded-xl font-semibold hover:bg-purple-100 transition-colors disabled:opacity-50">
              {joiningPro ? '...' : '⭐ Pro'}
            </button>
          )}
          {proJoined && announcements.filter(a => a.type === 'promo' && !dismissedIds.has(a.id)).length === 0 && (
            <span className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1.5 rounded-xl font-semibold">
              ✅ Pro list
            </span>
          )}
          <Link href={`/store/${merchant.slug}`} target="_blank"
            className="flex items-center gap-1 text-xs text-brand-green font-semibold border border-brand-green/20 bg-brand-light rounded-xl px-3 py-1.5 hover:bg-brand-green hover:text-white transition-colors">
            <ExternalLink size={11} /> View Store
          </Link>
          <button onClick={handleLogout}
            className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200">
            <LogOut size={15} className="text-gray-500" />
          </button>
        </div>
      </nav>

      {/* Theme picker modal — unchanged */}
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

      <div className="max-w-lg mx-auto px-4 py-4">

        {/* ── PLATFORM ANNOUNCEMENTS — top priority, above everything ── */}
        {announcements.filter(a => !dismissedIds.has(a.id)).length > 0 && (
          <div className="mb-4">
            {announcements.filter(a => !dismissedIds.has(a.id)).map(a => (
              a.type === 'promo' ? (
                /* ── PROMO — compact premium banner ── */
                <div key={a.id} className="relative rounded-2xl mb-2 overflow-hidden"
                  style={{ background: 'linear-gradient(120deg, #1e2d6b 0%, #2d3a8c 100%)' }}>
                  <div className="px-4 py-3 flex items-center gap-3">
                    <span className="text-lg shrink-0">⭐</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-xs leading-snug pr-4">{a.message}</p>
                    </div>
                    {!proJoined ? (
                      <button
                        disabled={joiningPro}
                        onClick={async () => {
                          if (!merchant) return
                          setJoiningPro(true)
                          await supabase.from('pro_waitlist').upsert({
                            merchant_id: merchant.id,
                            email: merchant.email,
                            business_name: merchant.business_name,
                          }, { onConflict: 'merchant_id' })
                          setProJoined(true)
                          setJoiningPro(false)
                        }}
                        className="shrink-0 bg-white text-indigo-900 text-[11px] font-bold px-3 py-1.5 rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-50 whitespace-nowrap">
                        {joiningPro ? '...' : 'Join Free →'}
                      </button>
                    ) : (
                      <span className="shrink-0 bg-white/20 text-white text-[11px] font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap">
                        ✅ Joined
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                /* ── OTHER TYPES — standard alert ── */
                <div key={a.id} className={`flex items-start gap-3 rounded-2xl px-4 py-3.5 mb-2 border ${
                  a.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                  a.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
                  'bg-sky-50 border-sky-200 text-sky-900'
                }`}>
                  <span className="text-lg shrink-0">
                    {a.type === 'warning' ? '⚠️' : a.type === 'success' ? '✅' : '📢'}
                  </span>
                  <p className="text-sm flex-1 font-medium leading-snug">{a.message}</p>
                  <button onClick={() => setDismissedIds(prev => { const next = new Set(Array.from(prev)); next.add(a.id); return next; })}
                    className="text-lg leading-none opacity-40 hover:opacity-80 shrink-0 mt-0.5">✕</button>
                </div>
              )
            ))}
          </div>
        )}

        {/* ── STATS ROW ── */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="bg-white rounded-2xl p-3 border border-gray-100 text-center">
            <div className="font-display font-bold text-xl text-brand-dark">{products.length}</div>
            <div className="text-xs text-gray-500">{isService ? 'Services' : 'Products'}</div>
          </div>
          <div className="bg-white rounded-2xl p-3 border border-gray-100 text-center">
            <div className="font-display font-bold text-xl text-brand-dark">{inStockCount}</div>
            <div className="text-xs text-gray-500">{isService ? 'Active' : 'In Stock'}</div>
          </div>
          <Link href="/dashboard/leads" className="bg-white rounded-2xl p-3 border border-gray-100 text-center hover:border-brand-green transition-colors">
            <div className="font-display font-bold text-xl text-brand-dark">{leadCount}</div>
            <div className="text-xs text-gray-500">Leads</div>
          </Link>
          <Link href="/dashboard/orders" className="bg-white rounded-2xl p-3 border border-gray-100 text-center relative hover:border-brand-green transition-colors">
            {newOrderCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-accent rounded-full text-white text-xs font-bold flex items-center justify-center">{newOrderCount}</span>
            )}
            <div className="font-display font-bold text-xl text-brand-dark">{orderCount}</div>
            <div className="text-xs text-gray-500">{isService ? 'Bookings' : 'Orders'}</div>
          </Link>
        </div>

        {/* ── STORE URL BAR ── */}
        <div className="bg-white rounded-2xl border border-gray-100 px-3 py-2.5 flex items-center gap-2 mb-4">
          <div className="flex-1 text-xs font-medium text-brand-green truncate">earket.com/store/{merchant.slug}</div>
          <button onClick={() => setShowThemePicker(true)}
            className="text-xs text-brand-green font-semibold bg-brand-light px-2 py-1 rounded-lg border border-brand-green/20 shrink-0">
            🎨
          </button>
          <a href={`https://wa.me/?text=${encodeURIComponent(`🛍️ Shop at *${merchant.business_name}*!\n\nearket.com/store/${merchant.slug}`)}`}
            target="_blank" rel="noreferrer"
            className="text-xs bg-[#25D366] text-white font-semibold px-2.5 py-1 rounded-lg shrink-0">
            Share
          </a>
          <a href={storeUrl} target="_blank" rel="noreferrer"
            className="text-xs bg-brand-green text-white font-semibold px-2.5 py-1 rounded-lg shrink-0">
            Visit
          </a>
        </div>

        {/* ── HERO ACTION: CASH SALE + CREDIT REPORT ── */}
        <div className="mb-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Record & Build Credit</p>
          <div className="grid grid-cols-2 gap-3 mb-3">

            {/* Cash Sale — primary featured card */}
            <Link href="/dashboard/cash-sale"
              className="flex flex-col gap-2 bg-brand-light border-2 border-brand-green rounded-2xl p-4 hover:brightness-95 transition-all active:scale-[0.98] shadow-sm">
              <div className="w-10 h-10 bg-brand-green/15 rounded-xl flex items-center justify-center">
                <ShoppingBag size={20} className="text-brand-green" />
              </div>
              <div>
                <div className="font-display font-bold text-sm text-brand-dark">Cash Sale</div>
                <div className="text-xs text-gray-500 leading-snug mt-0.5">Record a walk-in sale</div>
              </div>
              <span className="self-start text-[10px] bg-brand-green text-white px-2 py-0.5 rounded-full font-semibold">Record now →</span>
            </Link>

            {/* Credit Report — primary featured card */}
            <Link href="/dashboard/credit-report"
              className="flex flex-col gap-2 bg-slate-50 border-2 border-slate-400 rounded-2xl p-4 hover:brightness-95 transition-all active:scale-[0.98] shadow-sm">
              <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center">
                <FileText size={20} className="text-slate-600" />
              </div>
              <div>
                <div className="font-display font-bold text-sm text-brand-dark">Credit Report</div>
                <div className="text-xs text-gray-500 leading-snug mt-0.5">PDF report for loans</div>
              </div>
              <span className="self-start text-[10px] bg-slate-700 text-white px-2 py-0.5 rounded-full font-semibold">Generate →</span>
            </Link>
          </div>
        </div>

        {/* ── ADD PRODUCT CTA ── */}
        <Link href="/dashboard/products/new"
          className="flex items-center gap-3 bg-brand-green text-white rounded-2xl p-4 mb-4 hover:bg-brand-dark transition-colors active:scale-[0.98]">
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

        {/* ── SECONDARY ACTIONS — 2x2 grid ── */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Manage</p>
          <div className="grid grid-cols-2 gap-3">

            {/* Enable Payments */}
            {!(merchant as any).paystack_subaccount && (
              <Link href="/dashboard/payments"
                className="flex flex-col gap-2 bg-amber-50 border-2 border-amber-300 rounded-2xl p-3.5 hover:brightness-95 transition-all active:scale-[0.98] shadow-sm">
                <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
                  <CreditCard size={17} className="text-amber-600" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-800">Online Payments</div>
                  <div className="text-xs text-gray-500 leading-snug mt-0.5">Connect bank account</div>
                </div>
                <span className="self-start text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-semibold">Setup needed</span>
              </Link>
            )}

            {/* Analytics */}
            <Link href="/dashboard/analytics"
              className="flex flex-col gap-2 bg-brand-light border-2 border-brand-green/40 rounded-2xl p-3.5 hover:brightness-95 transition-all active:scale-[0.98] shadow-sm">
              <div className="w-9 h-9 bg-brand-green/15 rounded-xl flex items-center justify-center">
                <BarChart2 size={17} className="text-brand-green" />
              </div>
              <div>
                <div className="font-semibold text-sm text-gray-800">Analytics</div>
                <div className="text-xs text-gray-500 leading-snug mt-0.5">Views & conversions</div>
              </div>
            </Link>

            {/* Broadcast */}
            <Link href="/dashboard/broadcast"
              className="flex flex-col gap-2 bg-sky-50 border-2 border-sky-300 rounded-2xl p-3.5 hover:brightness-95 transition-all active:scale-[0.98] shadow-sm">
              <div className="w-9 h-9 bg-sky-100 rounded-xl flex items-center justify-center">
                <Megaphone size={17} className="text-sky-600" />
              </div>
              <div>
                <div className="font-semibold text-sm text-gray-800">Broadcast</div>
                <div className="text-xs text-gray-500 leading-snug mt-0.5">Message all customers</div>
              </div>
            </Link>

            {/* Discount Codes */}
            <Link href="/dashboard/discounts"
              className="flex flex-col gap-2 bg-violet-50 border-2 border-violet-300 rounded-2xl p-3.5 hover:brightness-95 transition-all active:scale-[0.98] shadow-sm">
              <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center">
                <Tag size={17} className="text-violet-600" />
              </div>
              <div>
                <div className="font-semibold text-sm text-gray-800">Discount Codes</div>
                <div className="text-xs text-gray-500 leading-snug mt-0.5">Create promo offers</div>
              </div>
            </Link>

            {/* Refresh services — only for service merchants */}
            {isService && (
              <button onClick={refreshServices} disabled={refreshingServices}
                className="flex flex-col gap-2 bg-brand-light border-2 border-brand-green/40 rounded-2xl p-3.5 hover:brightness-95 transition-all active:scale-[0.98] shadow-sm text-left disabled:opacity-50">
                <div className="w-9 h-9 bg-brand-green/15 rounded-xl flex items-center justify-center">
                  {refreshingServices ? <RefreshCw size={17} className="text-brand-green animate-spin" /> : <Sparkles size={17} className="text-brand-green" />}
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-800">
                    {refreshDone ? '✅ Refreshed!' : 'Refresh Services'}
                  </div>
                  <div className="text-xs text-gray-500 leading-snug mt-0.5">AI-selected for your category</div>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Sample product nudge */}
        {!isService && products.length > 0 && products.some(p =>
          p.name.startsWith('My Product') ||
          ['Indomie Noodles', 'Golden Penny', 'Vegetable Oil', 'Pounded Yam', 'Ankara Print', 'Plain Cotton'].some(s => p.name.startsWith(s))
        ) && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 flex items-start gap-3">
            <div className="text-xl shrink-0">📸</div>
            <div>
              <p className="font-semibold text-amber-800 text-sm">Replace sample products with yours</p>
              <p className="text-amber-700 text-xs mt-0.5">Add your real products with photos for a better customer experience.</p>
              <Link href="/dashboard/products/new" className="inline-block mt-2 text-xs font-bold text-amber-800 underline">
                Add my real products →
              </Link>
            </div>
          </div>
        )}

        {/* Placeholder image nudge for services */}
        {isService && products.length > 0 && products.some(p => p.image_url && p.image_url.includes('unsplash')) && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 flex items-start gap-3">
            <span className="text-xl shrink-0">📸</span>
            <div className="flex-1">
              <p className="font-semibold text-amber-800 text-sm">Add your own photos</p>
              <p className="text-amber-700 text-xs mt-0.5">Your services are using placeholder images. Tap any service to upload real photos.</p>
            </div>
          </div>
        )}

        {/* ── PRODUCTS — 3-column grid ── */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              {isService ? 'Your Services' : 'Your Products'}
            </p>
            <Link href="/dashboard/products/new" className="text-xs text-brand-green font-semibold">+ Add</Link>
          </div>

          {products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 text-center py-10 px-4">
              <div className="text-3xl mb-2">{isService ? '🔧' : '📦'}</div>
              <p className="text-gray-500 text-sm mb-1">{isService ? 'No services yet' : 'No products yet'}</p>
              <Link href="/dashboard/products/new" className="inline-block bg-brand-green text-white text-xs font-bold px-5 py-2.5 rounded-xl mt-2">
                {isService ? 'Add First Service' : 'Add First Product'}
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2">
                {visibleProducts.map(product => (
                  <Link key={product.id} href={`/dashboard/products/edit?id=${product.id}`}
                    className="bg-white rounded-2xl border border-gray-100 p-3 hover:border-brand-green transition-colors active:scale-[0.97]">
                    <div className="w-8 h-8 bg-brand-light rounded-xl flex items-center justify-center font-bold text-brand-green text-sm mb-2">
                      {product.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="font-semibold text-xs text-gray-800 leading-snug line-clamp-2 mb-1">{product.name}</div>
                    <div className="text-xs text-brand-green font-medium">{formatPrice(product)}</div>
                    <div className={`text-[10px] mt-0.5 ${product.in_stock ? 'text-green-500' : 'text-red-400'}`}>
                      {isService ? (product.in_stock ? 'Available' : 'Unavailable') : (product.in_stock ? 'In Stock' : 'Out of Stock')}
                    </div>
                  </Link>
                ))}
              </div>

              {products.length > GRID_PREVIEW && (
                <button
                  onClick={() => setShowAllProducts(v => !v)}
                  className="w-full mt-3 flex items-center justify-center gap-1.5 text-xs text-brand-green font-semibold py-2.5 bg-white rounded-xl border border-brand-green/20 hover:bg-brand-light transition-colors">
                  {showAllProducts
                    ? <><ChevronUp size={14} /> Show fewer</>
                    : <><ChevronDown size={14} /> Show all {products.length} {isService ? 'services' : 'products'}</>
                  }
                </button>
              )}
            </>
          )}
        </div>

        {/* ── WHATSAPP CTA ── */}
        <div className="bg-[#075E54] text-white rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl">💬</div>
          <div className="flex-1 min-w-0">
            <div className="font-display font-bold text-sm">WhatsApp {isService ? 'Bookings' : 'Orders'}</div>
            <div className="text-xs text-white/70 truncate">+{merchant.whatsapp_number}</div>
          </div>
          <a href={`https://wa.me/${merchant.whatsapp_number?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
            className="text-xs bg-[#25D366] px-3 py-1.5 rounded-xl font-semibold shrink-0">
            Open
          </a>
        </div>

      </div>

      {/* ── BOTTOM NAV ── */}
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
