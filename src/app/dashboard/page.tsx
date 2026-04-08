'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ShoppingBag, FileText, Package, Plus, ExternalLink, LogOut,
  RefreshCw, Settings, ShoppingCart, TrendingUp, BarChart2,
  CreditCard, Sparkles, Inbox, Tag, Megaphone, ChevronDown,
  ChevronUp, Star, ChevronRight, Instagram, Globe, Youtube,
  Users
} from 'lucide-react'
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
  instagram?: string
  facebook?: string
  linkedin?: string
  twitter_x?: string
  website?: string
  youtube?: string
  tiktok?: string
  other_link?: string
}

interface Product {
  id: string
  name: string
  price: number
  price_display: string
  in_stock: boolean
  image_url?: string
}

const GRID_PREVIEW = 9

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
  const [showWelcome, setShowWelcome] = useState(false)

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
    const welcomeDismissed = typeof window !== 'undefined' ? localStorage.getItem(`earket_welcome_${m.id}`) : null
    if (!welcomeDismissed) setShowWelcome(true)
    setLoading(false)
    setRefreshing(false)
  }, [router])

  useEffect(() => { loadData() }, [loadData])

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
    } catch (e) { console.error(e) }
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
  const storeUrl = typeof window !== 'undefined' ? `${window.location.origin}/store/${merchant.slug}` : ''
  const visibleProducts = showAllProducts ? products : products.slice(0, GRID_PREVIEW)

  const socialLinks = [
    { key: 'instagram', value: merchant.instagram, label: 'Instagram', color: 'text-pink-500' },
    { key: 'facebook', value: merchant.facebook, label: 'Facebook', color: 'text-blue-500' },
    { key: 'linkedin', value: merchant.linkedin, label: 'LinkedIn', color: 'text-sky-500' },
    { key: 'twitter_x', value: merchant.twitter_x, label: 'X / Twitter', color: 'text-gray-700' },
    { key: 'youtube', value: merchant.youtube, label: 'YouTube', color: 'text-red-500' },
    { key: 'tiktok', value: merchant.tiktok, label: 'TikTok', color: 'text-gray-900' },
    { key: 'website', value: merchant.website, label: 'Website', color: 'text-brand-green' },
    { key: 'other_link', value: merchant.other_link, label: 'Other', color: 'text-purple-500' },
  ]
  const filledSocial = socialLinks.filter(s => s.value)
  const missingSocial = socialLinks.filter(s => !s.value)

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-6">

      {/* Theme picker modal */}
      {showThemePicker && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowThemePicker(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl p-5">
            <h3 className="font-display font-bold text-brand-dark text-lg mb-1">Change Theme</h3>
            <p className="text-gray-500 text-xs mb-4">Pick a colour theme for your store page</p>
            <div className="grid grid-cols-3 gap-2 mb-4 max-h-72 overflow-y-auto">
              {EARKET_THEMES.map(theme => (
                <button key={theme.id} onClick={() => saveTheme(theme)} disabled={savingTheme}
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

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-6">

        {/* ── ANNOUNCEMENTS ── */}
        {announcements.filter(a => !dismissedIds.has(a.id)).length > 0 && (
          <div className="mb-5">
            {announcements.filter(a => !dismissedIds.has(a.id)).map(a => (
              a.type === 'promo' ? (
                <div key={a.id} className="relative rounded-2xl mb-2 overflow-hidden"
                  style={{ background: 'linear-gradient(120deg, #1e2d6b 0%, #2d3a8c 100%)' }}>
                  <div className="px-4 py-3 flex items-center gap-3">
                    <span className="text-lg shrink-0">⭐</span>
                    <p className="text-white font-semibold text-xs leading-snug flex-1 pr-2">{a.message}</p>
                    {!proJoined ? (
                      <button disabled={joiningPro} onClick={async () => {
                        if (!merchant) return
                        setJoiningPro(true)
                        const { error } = await supabase.from('pro_waitlist').insert({
                          merchant_id: merchant.id,
                          email: merchant.email,
                          business_name: merchant.business_name,
                          whatsapp_number: merchant.whatsapp_number || null,
                        })
                        if (!error || error.code === '23505') {
                          // 23505 = unique violation = already on list, both cases = joined
                          setProJoined(true)
                        }
                        setJoiningPro(false)
                      }} className="shrink-0 bg-white text-indigo-900 text-[11px] font-bold px-3 py-1.5 rounded-xl hover:bg-indigo-50 disabled:opacity-50 whitespace-nowrap">
                        {joiningPro ? '...' : 'Join Free →'}
                      </button>
                    ) : (
                      <span className="shrink-0 bg-white/20 text-white text-[11px] font-semibold px-3 py-1.5 rounded-xl">✨ Joined</span>
                    )}
                  </div>
                </div>
              ) : (
                <div key={a.id} className={`flex items-start gap-3 rounded-2xl px-4 py-3.5 mb-2 border ${
                  a.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                  a.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
                  'bg-sky-50 border-sky-200 text-sky-900'
                }`}>
                  <span className="text-lg shrink-0">{a.type === 'warning' ? '⚠️' : a.type === 'success' ? '✨' : 'ℹ️'}</span>
                  <p className="text-sm flex-1 font-medium leading-snug">{a.message}</p>
                  <button onClick={() => setDismissedIds(prev => { const n = new Set(Array.from(prev)); n.add(a.id); return n })}
                    className="text-lg leading-none opacity-40 hover:opacity-80 shrink-0">×</button>
                </div>
              )
            ))}
          </div>
        )}

        {/* ── WELCOME ── */}
        {showWelcome && merchant && (
          <div className="mb-5 rounded-2xl overflow-hidden border border-brand-green/30"
            style={{ background: 'linear-gradient(135deg, #f0faf4 0%, #e8f5ed 100%)' }}>
            <div className="px-4 pt-4 pb-3">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-display font-bold text-brand-dark text-base">Welcome to your dashboard! 🎉</p>
                  <p className="text-xs text-gray-500 mt-0.5">Here's everything you can do from here:</p>
                </div>
                <button onClick={() => { setShowWelcome(false); if (typeof window !== 'undefined') localStorage.setItem(`earket_welcome_${merchant.id}`, '1') }}
                  className="text-gray-400 hover:text-gray-600 text-xl leading-none shrink-0 ml-2">×</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                {[
                  { icon: '💵', title: 'Cash Sale', desc: 'Record every in-person sale instantly', href: '/dashboard/cash-sale' },
                  { icon: '📦', title: isService ? 'Add Service' : 'Add Product', desc: isService ? 'Add services & pricing' : 'AI writes descriptions', href: '/dashboard/products/new' },
                  { icon: '📊', title: 'Analytics', desc: 'Track your sales performance', href: '/dashboard/analytics' },
                  { icon: '📣', title: 'Broadcast', desc: 'Message all your customers', href: '/dashboard/broadcast' },
                  { icon: '🏷️', title: 'Discounts', desc: 'Create promo codes', href: '/dashboard/discounts' },
                  { icon: '👥', title: 'Customers', desc: 'See who bought from you', href: '/dashboard/customers' },
                  { icon: '📝', title: isService ? 'Bookings' : 'Orders', desc: 'Manage all orders', href: '/dashboard/orders' },
                  { icon: '🎨', title: 'Change Theme', desc: 'Customise your store look', href: '#theme' },
                ].map((f, i) => (
                  <a key={i} href={f.href === '#theme' ? '#' : f.href}
                    onClick={f.href === '#theme' ? (e) => { e.preventDefault(); setShowThemePicker(true); setShowWelcome(false); if (typeof window !== 'undefined') localStorage.setItem(`earket_welcome_${merchant.id}`, '1') } : undefined}
                    className="bg-white rounded-xl p-2.5 flex items-start gap-2 hover:border-brand-green border border-transparent transition-colors cursor-pointer">
                    <span className="text-base shrink-0">{f.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-brand-dark">{f.title}</p>
                      <p className="text-xs text-gray-500 leading-snug">{f.desc}</p>
                    </div>
                  </a>
                ))}
              </div>
              <button onClick={() => { setShowWelcome(false); if (typeof window !== 'undefined') localStorage.setItem(`earket_welcome_${merchant.id}`, '1') }}
                className="w-full text-xs font-semibold text-brand-green py-2 hover:text-brand-dark transition-colors">
                Got it — close this ×
              </button>
            </div>
          </div>
        )}

        {/* ── STATS + STORE URL ROW ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
            <div className="font-display font-bold text-2xl text-brand-dark">{products.length}</div>
            <div className="text-xs text-gray-500 mt-0.5">{isService ? 'Services' : 'Products'}</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
            <div className="font-display font-bold text-2xl text-brand-dark">{inStockCount}</div>
            <div className="text-xs text-gray-500 mt-0.5">{isService ? 'Active' : 'In Stock'}</div>
          </div>
          <Link href="/dashboard/leads" className="bg-white rounded-2xl p-4 border border-gray-100 text-center hover:border-brand-green transition-colors">
            <div className="font-display font-bold text-2xl text-brand-dark">{leadCount}</div>
            <div className="text-xs text-gray-500 mt-0.5">Leads</div>
          </Link>
          <Link href="/dashboard/orders" className="bg-white rounded-2xl p-4 border border-gray-100 text-center relative hover:border-brand-green transition-colors">
            {newOrderCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-accent rounded-full text-white text-xs font-bold flex items-center justify-center">{newOrderCount}</span>
            )}
            <div className="font-display font-bold text-2xl text-brand-dark">{orderCount}</div>
            <div className="text-xs text-gray-500 mt-0.5">{isService ? 'Bookings' : 'Orders'}</div>
          </Link>
        </div>

        {/* ── STORE URL BAR ── */}
        <div className="bg-white rounded-2xl border border-gray-100 px-4 py-3 flex items-center gap-3 mb-5">
          <div className="flex-1 text-sm font-medium text-brand-green truncate">earket.com/store/{merchant.slug}</div>
          <button onClick={() => setShowThemePicker(true)}
            className="text-xs text-brand-green font-semibold bg-brand-light px-2.5 py-1.5 rounded-lg border border-brand-green/20 shrink-0 hover:bg-brand-green hover:text-white transition-colors">
            🎨 Theme
          </button>
          <a href={`https://wa.me/?text=${encodeURIComponent(`🔗 Shop at *${merchant.business_name}*!\n\nearket.com/store/${merchant.slug}`)}`}
            target="_blank" rel="noreferrer"
            className="text-xs bg-[#25D366] text-white font-semibold px-3 py-1.5 rounded-lg shrink-0">
            Share
          </a>
          <a href={storeUrl} target="_blank" rel="noreferrer"
            className="text-xs bg-brand-green text-white font-semibold px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1">
            Visit <ExternalLink size={10} />
          </a>
        </div>

        {/* ── MAIN GRID: Actions + Social Links ── */}
        <div className="grid md:grid-cols-3 gap-5 mb-5">

          {/* Left: Quick Actions (2/3 width) */}
          <div className="md:col-span-2 space-y-5">

            {/* Record & Build Credit */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Record & Build Credit</p>
              <div className="grid grid-cols-2 gap-3">
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
                <Link href="/dashboard/cash-sale?tab=today"
                  className="flex flex-col gap-2 bg-indigo-50 border-2 border-indigo-400 rounded-2xl p-4 hover:brightness-95 transition-all active:scale-[0.98] shadow-sm">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <TrendingUp size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-sm text-brand-dark">Sales Report</div>
                    <div className="text-xs text-gray-500 leading-snug mt-0.5">Today's cash sales</div>
                  </div>
                  <span className="self-start text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-semibold">View →</span>
                </Link>
              </div>
            </div>

            {/* Add Product/Service CTA */}
            <Link href="/dashboard/products/new"
              className="flex items-center gap-3 bg-brand-green text-white rounded-2xl p-4 hover:bg-brand-dark transition-colors active:scale-[0.98] block">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <Plus size={20} />
              </div>
              <div>
                <div className="font-display font-bold">{isService ? 'Add New Service' : 'Add New Product'}</div>
                <div className="text-xs text-white/70">
                  {isService ? 'Add a service with description and pricing ✨' : 'AI writes the description for you ✨'}
                </div>
              </div>
            </Link>

            {/* Manage grid */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Manage</p>
              <div className="grid grid-cols-2 gap-3">
                {!(merchant as any).paystack_subaccount && (
                  <Link href="/dashboard/payments"
                    className="flex flex-col gap-2 bg-amber-50 border-2 border-amber-300 rounded-2xl p-3.5 hover:brightness-95 transition-all shadow-sm">
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
                <Link href="/dashboard/analytics"
                  className="flex flex-col gap-2 bg-brand-light border-2 border-brand-green/40 rounded-2xl p-3.5 hover:brightness-95 transition-all shadow-sm">
                  <div className="w-9 h-9 bg-brand-green/15 rounded-xl flex items-center justify-center">
                    <BarChart2 size={17} className="text-brand-green" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-800">Analytics</div>
                    <div className="text-xs text-gray-500 leading-snug mt-0.5">Views & conversions</div>
                  </div>
                </Link>
                <Link href="/dashboard/customers"
                  className="flex flex-col gap-2 bg-amber-50 border-2 border-amber-300 rounded-2xl p-3.5 hover:brightness-95 transition-all shadow-sm">
                  <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Star size={17} className="text-amber-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-800">Customers</div>
                    <div className="text-xs text-gray-500 leading-snug mt-0.5">Loyalty & contacts</div>
                  </div>
                </Link>
                <Link href="/dashboard/broadcast"
                  className="flex flex-col gap-2 bg-sky-50 border-2 border-sky-300 rounded-2xl p-3.5 hover:brightness-95 transition-all shadow-sm">
                  <div className="w-9 h-9 bg-sky-100 rounded-xl flex items-center justify-center">
                    <Megaphone size={17} className="text-sky-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-800">Broadcast</div>
                    <div className="text-xs text-gray-500 leading-snug mt-0.5">Message all customers</div>
                  </div>
                </Link>
                <Link href="/dashboard/discounts"
                  className="flex flex-col gap-2 bg-violet-50 border-2 border-violet-300 rounded-2xl p-3.5 hover:brightness-95 transition-all shadow-sm">
                  <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center">
                    <Tag size={17} className="text-violet-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-800">Discount Codes</div>
                    <div className="text-xs text-gray-500 leading-snug mt-0.5">Create promo offers</div>
                  </div>
                </Link>
                <Link href="/dashboard/credit-report"
                  className="flex flex-col gap-2 bg-slate-50 border-2 border-slate-300 rounded-2xl p-3.5 hover:brightness-95 transition-all shadow-sm">
                  <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">
                    <FileText size={17} className="text-slate-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-800">Credit Report</div>
                    <div className="text-xs text-gray-500 leading-snug mt-0.5">PDF report for loans</div>
                  </div>
                </Link>
                {isService && (
                  <button onClick={refreshServices} disabled={refreshingServices}
                    className="flex flex-col gap-2 bg-brand-light border-2 border-brand-green/40 rounded-2xl p-3.5 hover:brightness-95 transition-all shadow-sm text-left disabled:opacity-50">
                    <div className="w-9 h-9 bg-brand-green/15 rounded-xl flex items-center justify-center">
                      {refreshingServices ? <RefreshCw size={17} className="text-brand-green animate-spin" /> : <Sparkles size={17} className="text-brand-green" />}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-gray-800">{refreshDone ? '✨ Refreshed!' : 'Refresh Services'}</div>
                      <div className="text-xs text-gray-500 leading-snug mt-0.5">AI-selected for your category</div>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right: Social Links Card (1/3 width) */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-brand-dark text-sm">Social & Web</h3>
                <Link href="/dashboard/settings?tab=social"
                  className="text-xs text-brand-green font-semibold hover:text-brand-dark transition-colors">
                  Edit →
                </Link>
              </div>

              {filledSocial.length > 0 ? (
                <div className="space-y-2 mb-3">
                  {filledSocial.map(s => (
                    <div key={s.key} className="flex items-center gap-2.5 py-1">
                      <div className="w-2 h-2 rounded-full bg-brand-green shrink-0" />
                      <span className={`text-xs font-semibold ${s.color}`}>{s.label}</span>
                      <span className="text-xs text-gray-400 truncate flex-1 min-w-0">{s.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-amber-50 rounded-xl p-3 mb-3">
                  <p className="text-xs font-semibold text-amber-700 mb-0.5">No social links yet</p>
                  <p className="text-xs text-amber-600">Add your Instagram, Facebook, YouTube and more to grow your audience.</p>
                </div>
              )}

              {missingSocial.length > 0 && filledSocial.length > 0 && (
                <div className="text-xs text-gray-400 mb-3">
                  {missingSocial.length} link{missingSocial.length > 1 ? 's' : ''} not set: {missingSocial.slice(0, 3).map(s => s.label).join(', ')}{missingSocial.length > 3 ? '...' : ''}
                </div>
              )}

              <Link href="/dashboard/settings?tab=social"
                className="flex items-center justify-center gap-1.5 w-full bg-brand-light text-brand-green text-xs font-bold py-2.5 rounded-xl hover:bg-brand-green hover:text-white transition-colors">
                {filledSocial.length > 0 ? 'Manage Links' : 'Add Social Links'}
                <ChevronRight size={12} />
              </Link>
            </div>

            {/* WhatsApp card */}
            <div className="bg-[#075E54] text-white rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-lg">💬</div>
                <div>
                  <div className="font-display font-bold text-sm">WhatsApp {isService ? 'Bookings' : 'Orders'}</div>
                  <div className="text-xs text-white/60 truncate">+{merchant.whatsapp_number}</div>
                </div>
              </div>
              <a href={`https://wa.me/${merchant.whatsapp_number?.replace(/\D/g, '')}`}
                target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-1.5 w-full bg-[#25D366] text-white text-xs font-bold py-2.5 rounded-xl hover:bg-[#1ea854] transition-colors">
                Open WhatsApp
              </a>
            </div>

            {/* Settings shortcut */}
            <Link href="/dashboard/settings"
              className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 p-4 hover:border-brand-green transition-colors">
              <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                <Settings size={16} className="text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-800">Store Settings</div>
                <div className="text-xs text-gray-400">Theme, hours, social links</div>
              </div>
              <ChevronRight size={14} className="text-gray-400 shrink-0" />
            </Link>
          </div>
        </div>

        {/* ── NUDGES ── */}
        {!isService && products.length > 0 && products.some(p =>
          p.name.startsWith('My Product') ||
          ['Indomie Noodles', 'Golden Penny', 'Vegetable Oil', 'Pounded Yam', 'Ankara Print', 'Plain Cotton'].some(s => p.name.startsWith(s))
        ) && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 flex items-start gap-3">
            <span className="text-xl shrink-0">📸</span>
            <div>
              <p className="font-semibold text-amber-800 text-sm">Replace sample products with yours</p>
              <p className="text-amber-700 text-xs mt-0.5">Add your real products with photos for a better customer experience.</p>
              <Link href="/dashboard/products/new" className="inline-block mt-2 text-xs font-bold text-amber-800 underline">Add my real products →</Link>
            </div>
          </div>
        )}

        {isService && products.length > 0 && products.some(p => p.image_url && p.image_url.includes('unsplash')) && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 flex items-start gap-3">
            <span className="text-xl shrink-0">📸</span>
            <div className="flex-1">
              <p className="font-semibold text-amber-800 text-sm">Add your own photos</p>
              <p className="text-amber-700 text-xs mt-0.5">Your services are using placeholder images. Tap any service to upload real photos.</p>
            </div>
          </div>
        )}

        {/* ── PRODUCTS / SERVICES GRID ── */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              {isService ? 'Your Services' : 'Your Products'}
            </p>
            <Link href="/dashboard/products/new" className="text-xs text-brand-green font-semibold">+ Add</Link>
          </div>

          {products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 text-center py-12 px-4">
              <p className="text-gray-500 text-sm mb-1">{isService ? 'No services yet' : 'No products yet'}</p>
              <Link href="/dashboard/products/new"
                className="inline-block bg-brand-green text-white text-xs font-bold px-5 py-2.5 rounded-xl mt-2">
                {isService ? 'Add First Service' : 'Add First Product'}
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {visibleProducts.map(product => (
                  <Link key={product.id} href={`/dashboard/products/edit?id=${product.id}`}
                    className="bg-white rounded-2xl border border-gray-100 p-3 hover:border-brand-green transition-colors active:scale-[0.97]">
                    {product.image_url && !product.image_url.includes('unsplash') ? (
                      <img src={product.image_url} alt={product.name} className="w-full aspect-square object-cover rounded-xl mb-2" />
                    ) : (
                      <div className="w-full aspect-square bg-brand-light rounded-xl flex items-center justify-center font-bold text-brand-green text-lg mb-2">
                        {product.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="font-semibold text-xs text-gray-800 leading-snug line-clamp-2 mb-1">{product.name}</div>
                    <div className="text-xs text-brand-green font-medium">{formatPrice(product)}</div>
                    <div className={`text-[10px] mt-0.5 ${product.in_stock ? 'text-green-500' : 'text-red-400'}`}>
                      {isService ? (product.in_stock ? 'Available' : 'Unavailable') : (product.in_stock ? 'In Stock' : 'Out of Stock')}
                    </div>
                  </Link>
                ))}
              </div>
              {products.length > GRID_PREVIEW && (
                <button onClick={() => setShowAllProducts(v => !v)}
                  className="w-full mt-3 flex items-center justify-center gap-1.5 text-xs text-brand-green font-semibold py-2.5 bg-white rounded-xl border border-brand-green/20 hover:bg-brand-light transition-colors">
                  {showAllProducts
                    ? <><ChevronUp size={14} /> Show fewer</>
                    : <><ChevronDown size={14} /> Show all {products.length} {isService ? 'services' : 'products'}</>}
                </button>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  )
}
