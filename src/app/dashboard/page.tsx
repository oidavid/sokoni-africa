'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Package, Plus, ExternalLink, LogOut, RefreshCw } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Merchant {
  id: string
  business_name: string
  slug: string
  location: string
  whatsapp_number: string
  category: string
  email: string
}

interface Product {
  id: string
  name: string
  price: number
  price_display: string
  in_stock: boolean
  created_at: string
}

const CATEGORY_EMOJI: Record<string, string> = {
  fashion: '👗', food: '🍱', electronics: '📱', beauty: '💄',
  groceries: '🛒', furniture: '🪑', shoes: '👟', other: '🏪'
}

export default function DashboardPage() {
  const router = useRouter()
  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadData = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data: m } = await supabase
      .from('merchants')
      .select('*')
      .eq('email', user.email)
      .single()

    if (!m) { router.push('/onboarding'); return }

    setMerchant(m)

    const { data: prods } = await supabase
      .from('products')
      .select('*')
      .eq('merchant_id', m.id)
      .order('created_at', { ascending: false })

    setProducts(prods || [])
    setLoading(false)
    setRefreshing(false)
  }, [router])

  useEffect(() => { loadData() }, [loadData])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  function formatPrice(p: Product) {
    if (p.price_display) return p.price_display
    return `₦${(p.price / 100).toLocaleString()}`
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
  const categoryEmoji = CATEGORY_EMOJI[merchant.category] || '🏪'
  const storeUrl = `${window.location.origin}/store/${merchant.slug}`

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Top nav */}
      <nav className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-green rounded-lg flex items-center justify-center">
            <ShoppingBag size={14} className="text-white" />
          </div>
          <span className="font-display font-bold text-brand-dark">Earket</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href={storeUrl} target="_blank"
            className="flex items-center gap-1.5 text-xs text-brand-green font-medium border border-brand-green/20 
                       bg-brand-light rounded-xl px-3 py-2 hover:bg-brand-green hover:text-white transition-colors">
            <ExternalLink size={12} /> View Store
          </Link>
          <button onClick={handleLogout}
            className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200" title="Logout">
            <LogOut size={15} className="text-gray-500" />
          </button>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-5">
        {/* Welcome */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="font-display font-bold text-xl text-brand-dark">
              {categoryEmoji} {merchant.business_name}
            </h1>
            <p className="text-gray-500 text-sm">{merchant.location}</p>
          </div>
          <button onClick={() => loadData(true)} disabled={refreshing}
            className="w-9 h-9 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50">
            <RefreshCw size={15} className={`text-gray-400 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Add product CTA */}
        <Link href="/dashboard/products/new"
          className="flex items-center gap-3 bg-brand-green text-white rounded-2xl p-4 mb-5 hover:bg-brand-dark transition-colors active:scale-[0.98]">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Plus size={20} />
          </div>
          <div>
            <div className="font-display font-bold">Add New Product</div>
            <div className="text-xs text-white/70">AI writes the description for you ✨</div>
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
              <ShoppingBag size={18} />
            </div>
            <div className="font-display font-bold text-2xl text-brand-dark">{inStockCount}</div>
            <div className="text-xs text-gray-500 mt-0.5">In Stock</div>
          </div>
        </div>

        {/* Store link */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-5">
          <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Your Store Link</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-brand-light rounded-xl px-3 py-2.5 text-xs font-medium text-brand-green truncate">
              earket.com/store/{merchant.slug}
            </div>
            <a href={`https://wa.me/?text=${encodeURIComponent('Check out my store: ' + storeUrl)}`}
              target="_blank" rel="noreferrer" className="btn-whatsapp shrink-0 py-2.5 text-xs">
              📲 Share
            </a>
          </div>
        </div>

        {/* Products list */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-5">
          <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-display font-bold text-brand-dark">Your Products</h2>
            <Link href="/dashboard/products/new" className="text-xs text-brand-green font-semibold">+ Add</Link>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-10 px-4">
              <div className="text-3xl mb-2">📦</div>
              <p className="text-gray-500 text-sm mb-1">No products yet</p>
              <p className="text-gray-400 text-xs mb-4">Add your first product — AI will write the description</p>
              <Link href="/dashboard/products/new"
                className="inline-block bg-brand-green text-white text-xs font-bold px-5 py-2.5 rounded-xl">
                Add First Product
              </Link>
            </div>
          ) : (
            products.map((product, i) => (
              <div key={product.id}
                className={`px-4 py-3 flex items-center gap-3 ${i < products.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <div className="w-9 h-9 bg-brand-light rounded-xl flex items-center justify-center font-bold text-brand-green shrink-0 text-sm">
                  {product.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-gray-800 truncate">{product.name}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1.5">
                    <span className="font-medium text-brand-green">{formatPrice(product)}</span>
                    <span>·</span>
                    <span className={product.in_stock ? 'text-green-500' : 'text-red-400'}>
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
          <div className="flex-1 min-w-0">
            <div className="font-display font-bold text-sm">WhatsApp Orders</div>
            <div className="text-xs text-white/70 truncate">+{merchant.whatsapp_number}</div>
          </div>
          <a href={`https://wa.me/${merchant.whatsapp_number?.replace(/\D/g, '')}`}
            target="_blank" rel="noreferrer"
            className="text-xs bg-[#25D366] px-3 py-1.5 rounded-xl font-semibold shrink-0">
            Open
          </a>
        </div>
      </div>
    </div>
  )
}
