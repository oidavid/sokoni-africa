'use client'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ShoppingBag, LayoutDashboard, Package, ShoppingCart,
  BarChart2, Settings, CreditCard, LogOut, Menu, X, Users, Gift, Boxes
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: ShoppingCart, label: 'Orders', href: '/dashboard/orders' },
  { icon: Package, label: 'Products', href: '/dashboard/products/new' },
  { icon: BarChart2, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: CreditCard, label: 'Payments', href: '/dashboard/payments' },
  { icon: Users, label: 'Customers', href: '/dashboard/customers' },
  { icon: Boxes, label: 'Inventory', href: '/dashboard/inventory' },
  { icon: Gift, label: 'Referrals', href: '/dashboard/referrals' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [merchant, setMerchant] = useState<{ business_name: string; slug: string; logo_url?: string } | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      const fallbackEmail = typeof window !== 'undefined' ? localStorage.getItem('earket_merchant_email') : null
      const email = user?.email || fallbackEmail
      if (!email) return
      const { data: m } = await supabase.from('merchants').select('business_name, slug, logo_url').eq('email', email).single()
      if (m) setMerchant(m)
    }
    load()
  }, [])

  const activeNav = NAV.find(n => n.href === pathname || (n.href !== '/dashboard' && pathname.startsWith(n.href)))

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
            {merchant?.logo_url ? (
              <img src={merchant.logo_url} alt={merchant.business_name} className="w-8 h-8 rounded-lg object-cover" />
            ) : (
              <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
                <ShoppingBag size={15} className="text-white" />
              </div>
            )}
            <div className="hidden sm:block">
              <p className="font-display font-bold text-brand-dark text-sm leading-tight">{merchant?.business_name || 'Earket'}</p>
              <p className="text-xs text-gray-400 leading-tight">Dashboard</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 ml-4 flex-1">
            {NAV.map(item => {
              const isActive = item.href === pathname || (item.href !== '/dashboard' && pathname.startsWith(item.href))
              return (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isActive ? 'bg-brand-light text-brand-green' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  }`}>
                  <item.icon size={14} />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2 ml-auto">
            {merchant?.slug && (
              <Link href={`/store/${merchant.slug}`} target="_blank"
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-brand-green bg-brand-light px-3 py-2 rounded-xl hover:bg-brand-green hover:text-white transition-colors">
                View Store →
              </Link>
            )}
            <button onClick={async () => {
              await supabase.auth.signOut()
              localStorage.removeItem('earket_merchant_email')
              router.push('/')
            }} className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
              <LogOut size={15} className="text-gray-500" />
            </button>
            {/* Mobile menu */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
              {menuOpen ? <X size={15} /> : <Menu size={15} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 grid grid-cols-3 gap-2">
            {NAV.map(item => {
              const isActive = item.href === pathname || (item.href !== '/dashboard' && pathname.startsWith(item.href))
              return (
                <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive ? 'bg-brand-light text-brand-green' : 'text-gray-500 hover:bg-gray-100'
                  }`}>
                  <item.icon size={18} />
                  {item.label}
                </Link>
              )
            })}
            {merchant?.slug && (
              <Link href={`/store/${merchant.slug}`} target="_blank" onClick={() => setMenuOpen(false)}
                className="flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs font-semibold text-brand-green bg-brand-light">
                <ShoppingBag size={18} />
                My Store
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Page title bar */}
      {activeNav && pathname !== '/dashboard' && (
        <div className="bg-white border-b border-gray-50 px-4 py-2 max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="text-xs text-gray-400 hover:text-brand-green transition-colors">Dashboard</Link>
            <span className="text-gray-300 text-xs">/</span>
            <span className="text-xs font-semibold text-gray-600">{activeNav.label}</span>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Bottom nav for mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-30 safe-area-pb">
        <div className="flex">
          {NAV.slice(0, 5).map(item => {
            const isActive = item.href === pathname || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-semibold transition-colors ${
                  isActive ? 'text-brand-green' : 'text-gray-400'
                }`}>
                <item.icon size={18} />
                <span className="text-xs">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <footer className="hidden md:block bg-white border-t border-gray-100 py-4 px-4 mt-auto">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-green rounded-md flex items-center justify-center">
              <ShoppingBag size={12} className="text-white" />
            </div>
            <span className="font-display font-bold text-brand-dark text-sm">Earket</span>
            <span className="text-gray-300 text-xs">·</span>
            <span className="text-xs text-gray-400">Free online stores for emerging markets</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <Link href="/privacy" className="hover:text-brand-green transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-brand-green transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-brand-green transition-colors">Help</Link>
            <span className="text-gray-300">·</span>
            <span>© {new Date().getFullYear()} Earket</span>
          </div>
        </div>
      </footer>

      {/* Bottom padding for mobile nav */}
      <div className="md:hidden h-16" />
    </div>
  )
}
