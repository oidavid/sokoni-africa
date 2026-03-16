'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Package, ShoppingCart, TrendingUp, Plus, ExternalLink, Settings, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Merchant {
  id: string
  business_name: string
  slug: string
  location: string
  whatsapp_number: string
  category: string
}

interface Product {
  id: string
  name: string
  price: number
  price_display: string
  in_stock: boolean
}

export default function DashboardPage() {
  const router = useRouter()
  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: m } = await supabase
        .from('merchants')
        .select('*')
        .eq('email', user.email)
        .single()

      if (!m) {
        router.push('/onboarding')
        return
      }

      setMerchant(m)

      const { data: prods } = await supabase
        .from('products')
        .select('*')
        .eq('merchant_id', m.id)
        .order('created_at', { ascending: false })

      setProducts(prods || [])
      setLoading(false)
    }
    load()
  }, [router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
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

  const inStockCount = products.filter(p => p.in_stock).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <nav className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-green rounded-lg flex items-center justify-center">
            <ShoppingBag size={14} className="text-white" />
          </div>
          <span className="font-display font-bold text-brand-dark">Earket</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/store/${merchant.slug}`} target="_blank"
            className="flex items-center gap-1.5 text-xs text-brand-green font-medium border border-brand-green/20 
                       bg-brand-light rounded-xl px-3 py-2 hover:bg-brand-green hover:text-white transition-colors">
            <ExternalLink size={12} />
            View Store
          </Link>
          <button onClick={handleLogout}
            className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200">
            <LogOut size={15} className="text-gray-500" />
          </button>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-5">
        {/* Welcome */}
        <div className="mb-5">
          <h1 className="font-display font-bold text-xl text-brand-dark">Welcome back! 👋</h1>
          <p className="text-gray-500 text-sm">{merchant.business_name} · {merchant.location}</p>
        </div>

        {/* Add product CTA */}
        <Link href="/dashboard/products/new"
          className="flex items-center gap-3 bg-brand-green text-white rounded-2xl p-4 mb-5 hover:bg-brand-dark transition-colors active:scale-[0.98]">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Plus size={20} />
          </div>
          <div>
            <div className="font-display font-bold">Add New Product</div>
            <div className="text-xs text-white/70">AI writes the description for you</div>
          </div>
        </Link>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 bg-blue-50 text-blue-600">
              <Package size={18} />
            </div>
            <div className="font-display font-bold text-2xl text-brand-dark">{products.length}</div>
            <div className="text-xs text-gray-500 mt-0.5">Total Products</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 bg-brand-light text-brand-green">
              <ShoppingCart size={18} />
            </div>
            <div className="font-display font-bold text-2xl text-brand-dark">{inStockCount}</div>
            <div className="text-xs text-gray-500 mt-0.5">In Stock</div>
          </div>
        </div>

        {/* Store link */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-5">
          <div className="text-xs font-semibold text-gray-500 mb-2">YOUR STORE LINK</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-brand-light rounded-xl px-3 py-2.5 text-sm font-medium text-brand-green truncate">
              earket.com/{merchant.slug}
            </div>
            <a href={`https://wa.me/?text=Check out my store: https://earket-gamma.vercel.app/store/${merchant.slug}`}
              target="_blank" rel="noreferrer" className="btn-whatsapp shrink-0 py-2.5">
              📲 Share
            </a>
          </div>
        </div>

        {/* Products list */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-5">
          <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-display font-bold text-brand-dark">Your Products</h2>
            <Link href="/dashboard/products/new" className="text-xs text-brand-green font-medium">+ Add</Link>
          </div>
          {products.length === 0 ? (
            <div className="text-center py-10 px-4">
              <div className="text-3xl mb-2">📦</div>
              <p className="text-gray-500 text-sm mb-3">No products yet</p>
              <Link href="/dashboard/products/new"
                className="inline-block bg-brand-green text-white text-xs font-bold px-4 py-2 rounded-xl">
                Add Your First Product
              </Link>
            </div>
          ) : (
            products.map((product, i) => (
              <div key={product.id} className={`px-4 py-3 flex items-center gap-3 ${i < products.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <div className="w-9 h-9 bg-brand-light rounded-xl flex items-center justify-center text-sm font-bold text-brand-green shrink-0">
                  {product.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-gray-800 truncate">{product.name}</div>
                  <div className="text-xs text-gray-500">
                    {product.price_display || `₦${(product.price / 100).toLocaleString()}`} ·{' '}
                    <span className={product.in_stock ? 'text-brand-green' : 'text-red-400'}>
                      {product.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* WhatsApp */}
        <div className="bg-[#075E54] text-white rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl">💬</div>
          <div className="flex-1">
            <div className="font-display font-bold text-sm">WhatsApp Orders</div>
            <div className="text-xs text-white/70">+{merchant.whatsapp_number}</div>
          </div>
          <a href={`https://wa.me/${merchant.whatsapp_number}`} target="_blank" rel="noreferrer"
            className="text-xs bg-[#25D366] px-3 py-1.5 rounded-xl font-semibold">
            Open
          </a>
        </div>
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex max-w-lg mx-auto">
        {[
          { icon: TrendingUp, label: 'Dashboard', href: '/dashboard', active: true },
          { icon: Package, label: 'Products', href: '/dashboard/products/new', active: false },
          { icon: Settings, label: 'Settings', href: '/dashboard/settings', active: false },
        ].map((item, i) => (
          <Link key={i} href={item.href}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${item.active ? 'text-brand-green' : 'text-gray-400'}`}>
            <item.icon size={20} />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="h-16" />
    </div>
  )
}
