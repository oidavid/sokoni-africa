'use client'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, Package, ShoppingCart, BarChart2, Settings,
  CreditCard, LogOut, Users, Boxes, Radio, Tag, FileText,
  ExternalLink, ChevronRight, Inbox, Sparkles, TrendingUp,
  Menu, X, ShoppingBag, Megaphone
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface NavItem {
  icon: React.ElementType
  label: string
  href: string
  badge?: number
  serviceOnly?: boolean
  productOnly?: boolean
}

const PRODUCT_NAV: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard',   href: '/dashboard' },
  { icon: Package,         label: 'Products',    href: '/dashboard/products/new', productOnly: true },
  { icon: Sparkles,        label: 'Services',    href: '/dashboard/products/new', serviceOnly: true },
  { icon: ShoppingCart,    label: 'Orders',      href: '/dashboard/orders',       productOnly: true },
  { icon: Inbox,           label: 'Bookings',    href: '/dashboard/orders',       serviceOnly: true },
  { icon: Inbox,           label: 'Leads',       href: '/dashboard/leads',        serviceOnly: true },
  { icon: Boxes,           label: 'Inventory',   href: '/dashboard/inventory',    productOnly: true },
  { icon: Users,           label: 'Customers',   href: '/dashboard/customers' },
  { icon: Megaphone,       label: 'Broadcast',   href: '/dashboard/broadcast' },
  { icon: BarChart2,       label: 'Analytics',   href: '/dashboard/analytics' },
  { icon: CreditCard,      label: 'Payments',    href: '/dashboard/payments' },
  { icon: Tag,             label: 'Discounts',   href: '/dashboard/discounts' },
  { icon: FileText,        label: 'Credit Report', href: '/dashboard/credit-report' },
  { icon: Radio,           label: 'Referrals',   href: '/dashboard/referrals' },
  { icon: Settings,        label: 'Settings',    href: '/dashboard/settings' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [merchant, setMerchant] = useState<{
    business_name: string; slug: string; logo_url?: string
    business_type?: string; instagram?: string; facebook?: string
    linkedin?: string; twitter_x?: string; website?: string
    youtube?: string; tiktok?: string; other_link?: string
  } | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      const fallbackEmail = typeof window !== 'undefined' ? localStorage.getItem('earket_merchant_email') : null
      const email = user?.email || fallbackEmail
      if (!email) return
      const { data: m } = await supabase.from('merchants')
        .select('business_name,slug,logo_url,business_type,instagram,facebook,linkedin,twitter_x,website,youtube,tiktok,other_link')
        .eq('email', email).single()
      if (m) setMerchant(m)
    }
    load()
  }, [])

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false) }, [pathname])

  const isService = merchant?.business_type === 'services'

  const navItems = PRODUCT_NAV.filter(item => {
    if (item.serviceOnly && !isService) return false
    if (item.productOnly && isService) return false
    return true
  })

  const socialCount = merchant ? [
    merchant.instagram, merchant.facebook, merchant.linkedin,
    merchant.twitter_x, merchant.website, merchant.youtube,
    merchant.tiktok, merchant.other_link
  ].filter(Boolean).length : 0

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-4 py-4 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          {merchant?.logo_url ? (
            <img src={merchant.logo_url} alt="" className="w-9 h-9 rounded-xl object-cover shrink-0" />
          ) : (
            <div className="w-9 h-9 bg-brand-green rounded-xl flex items-center justify-center shrink-0">
              <ShoppingBag size={16} className="text-white" />
            </div>
          )}
          <div className="min-w-0">
            <p className="font-display font-bold text-brand-dark text-sm leading-tight truncate">
              {merchant?.business_name || 'Earket'}
            </p>
            <p className="text-xs text-gray-400 leading-tight">Dashboard</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5">
        {navItems.map(item => {
          const active = isActive(item.href)
          return (
            <Link key={item.label} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                active
                  ? 'bg-brand-green text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}>
              <item.icon size={17} className={active ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'} />
              <span className="flex-1">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                  active ? 'bg-white/20 text-white' : 'bg-brand-accent text-white'
                }`}>{item.badge}</span>
              )}
              {active && <ChevronRight size={14} className="text-white/60" />}
            </Link>
          )
        })}
      </nav>

      {/* Social links status */}
      {merchant && (
        <div className="mx-3 mb-3">
          <Link href="/dashboard/settings"
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all ${
              socialCount > 0
                ? 'bg-brand-light border-brand-green/20 hover:bg-brand-green/10'
                : 'bg-amber-50 border-amber-200 hover:bg-amber-100'
            }`}>
            <span className="text-base">{socialCount > 0 ? '🔗' : '⚡'}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-semibold leading-tight ${socialCount > 0 ? 'text-brand-green' : 'text-amber-700'}`}>
                {socialCount > 0 ? `${socialCount} social link${socialCount > 1 ? 's' : ''} active` : 'Add social links'}
              </p>
              <p className="text-xs text-gray-400 leading-tight truncate">
                {socialCount > 0 ? 'Visible on your store page' : 'Boost your online presence'}
              </p>
            </div>
            <ChevronRight size={13} className="text-gray-400 shrink-0" />
          </Link>
        </div>
      )}

      {/* View Store + Logout */}
      <div className="px-3 pb-4 space-y-1 border-t border-gray-100 pt-3">
        {merchant?.slug && (
          <Link href={`/store/${merchant.slug}`} target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-brand-green hover:bg-brand-light transition-colors">
            <ExternalLink size={17} className="text-brand-green" />
            <span className="flex-1">View Store</span>
            <ExternalLink size={12} className="text-brand-green/50" />
          </Link>
        )}
        <a href="mailto:earket@earket.com"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-brand-light hover:text-brand-green transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          <span>Contact Support</span>
        </a>
        <button onClick={async () => {
          await supabase.auth.signOut()
          localStorage.removeItem('earket_merchant_email')
          router.push('/')
        }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors">
          <LogOut size={17} />
          <span>Sign out</span>
        </button>
        <div className="pt-3 mx-1">
          <div className="bg-gray-50 rounded-xl px-3 py-2.5 text-center border border-gray-100">
            <div className="flex items-center justify-center gap-1.5 mb-0.5">
              <span className="font-display font-bold text-brand-green text-sm">Earket</span>
              <span className="text-gray-300 text-xs">·</span>
              <span className="text-xs text-gray-400 font-medium">Free Forever</span>
            </div>
            <a href="https://intelsystechnology.com" target="_blank" rel="noreferrer"
              className="text-xs text-gray-400 hover:text-brand-green transition-colors font-medium">
              A product of IntelSys Technologies
            </a>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 bg-white border-r border-gray-100 sticky top-0 h-screen overflow-hidden">
        <SidebarContent />
      </aside>

      {/* ── MOBILE SIDEBAR OVERLAY ── */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 bg-white h-full shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="font-display font-bold text-brand-dark text-sm">Menu</span>
              <button onClick={() => setSidebarOpen(false)}
                className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center">
                <X size={14} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <SidebarContent />
            </div>
          </aside>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile top bar */}
        <header className="md:hidden bg-white border-b border-gray-100 sticky top-0 z-30 px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {merchant?.logo_url ? (
              <img src={merchant.logo_url} alt="" className="w-8 h-8 rounded-lg object-cover" />
            ) : (
              <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
                <ShoppingBag size={14} className="text-white" />
              </div>
            )}
            <span className="font-display font-bold text-sm text-brand-dark">{merchant?.business_name || 'Earket'}</span>
          </div>
          <div className="flex items-center gap-2">
            {merchant?.slug && (
              <Link href={`/store/${merchant.slug}`} target="_blank"
                className="text-xs font-semibold text-brand-green bg-brand-light px-3 py-1.5 rounded-xl">
                View Store →
              </Link>
            )}
            <button onClick={() => setSidebarOpen(true)}
              className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
              <Menu size={16} className="text-gray-600" />
            </button>
          </div>
        </header>

        {/* Breadcrumb — desktop only, not on main dashboard */}
        {pathname !== '/dashboard' && (
          <div className="hidden md:flex items-center gap-2 px-6 py-3 bg-white border-b border-gray-50 text-xs text-gray-400">
            <Link href="/dashboard" className="hover:text-brand-green transition-colors">Dashboard</Link>
            <ChevronRight size={12} />
            <span className="font-semibold text-gray-600 capitalize">
              {pathname.split('/').pop()?.replace(/-/g, ' ')}
            </span>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-30">
          <div className="flex">
            {[
              { icon: LayoutDashboard, label: 'Home',     href: '/dashboard' },
              { icon: isService ? Sparkles : Package, label: isService ? 'Services' : 'Products', href: '/dashboard/products/new' },
              { icon: isService ? Inbox : ShoppingCart, label: isService ? 'Leads' : 'Orders', href: isService ? '/dashboard/leads' : '/dashboard/orders' },
              { icon: Users,          label: 'Customers', href: '/dashboard/customers' },
              { icon: Settings,       label: 'Settings',  href: '/dashboard/settings' },
            ].map(item => {
              const active = isActive(item.href)
              return (
                <Link key={item.href} href={item.href}
                  className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors ${
                    active ? 'text-brand-green' : 'text-gray-400'
                  }`}>
                  <item.icon size={19} />
                  <span className="text-[10px]">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="md:hidden h-16" />
      </div>
    </div>
  )
}
