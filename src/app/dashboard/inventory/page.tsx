'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Pencil, AlertTriangle, CheckCircle, XCircle, Package } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Product {
  id: string
  name: string
  price: number
  price_display: string
  image_url: string | null
  in_stock: boolean
  stock_qty: number | null
  category: string
}

function StockBadge({ qty }: { qty: number | null }) {
  if (qty === null) return <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">Not tracked</span>
  if (qty === 0) return <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-1 rounded-full flex items-center gap-1"><XCircle size={10} /> Out of stock</span>
  if (qty <= 5) return <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-1 rounded-full flex items-center gap-1"><AlertTriangle size={10} /> Low: {qty} left</span>
  return <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle size={10} /> {qty} in stock</span>
}

export default function InventoryPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'low' | 'out' | 'untracked'>('all')
  const [merchantId, setMerchantId] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      const email = user?.email || localStorage.getItem('earket_merchant_email')
      if (!email) { router.push('/login'); return }
      const { data: m } = await supabase.from('merchants').select('id').eq('email', email).single()
      if (!m) return
      setMerchantId(m.id)
      const { data: prods } = await supabase.from('products')
        .select('id, name, price, price_display, image_url, in_stock, stock_qty, category')
        .eq('merchant_id', m.id)
        .order('name')
      setProducts(prods || [])
      setLoading(false)
    }
    load()
  }, [router])

  const filtered = products.filter(p => {
    if (filter === 'low') return p.stock_qty !== null && p.stock_qty > 0 && p.stock_qty <= 5
    if (filter === 'out') return p.stock_qty === 0 || !p.in_stock
    if (filter === 'untracked') return p.stock_qty === null
    return true
  })

  const lowCount = products.filter(p => p.stock_qty !== null && p.stock_qty > 0 && p.stock_qty <= 5).length
  const outCount = products.filter(p => p.stock_qty === 0 || !p.in_stock).length
  const untrackedCount = products.filter(p => p.stock_qty === null).length

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 size={24} className="animate-spin text-brand-green" /></div>

  return (
    <div className="min-h-screen bg-gray-50 max-w-4xl mx-auto pb-10">
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <h1 className="font-display font-bold text-brand-dark">Inventory</h1>
        <p className="text-xs text-gray-400">{products.length} products · {lowCount} low stock · {outCount} out of stock</p>
      </div>

      {/* Summary cards */}
      <div className="p-4 grid grid-cols-3 gap-3">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-3 text-center">
          <p className="font-display font-bold text-2xl text-green-700">{products.filter(p => p.stock_qty !== null && p.stock_qty > 5).length}</p>
          <p className="text-xs text-green-600 mt-0.5">Well Stocked</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center">
          <p className="font-display font-bold text-2xl text-amber-700">{lowCount}</p>
          <p className="text-xs text-amber-600 mt-0.5">Low Stock</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-center">
          <p className="font-display font-bold text-2xl text-red-700">{outCount}</p>
          <p className="text-xs text-red-600 mt-0.5">Out of Stock</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="px-4 flex gap-2 overflow-x-auto pb-2">
        {[
          { key: 'all', label: `All (${products.length})` },
          { key: 'low', label: `⚠️ Low (${lowCount})` },
          { key: 'out', label: `❌ Out (${outCount})` },
          { key: 'untracked', label: `📦 Untracked (${untrackedCount})` },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key as typeof filter)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              filter === f.key ? 'bg-brand-green text-white' : 'bg-white text-gray-500 border border-gray-200'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Product list */}
      <div className="px-4 space-y-2 mt-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl">
            <Package size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-semibold">No products in this category</p>
          </div>
        ) : filtered.map(p => (
          <div key={p.id} className={`bg-white rounded-2xl p-3 flex items-center gap-3 border-2 ${
            p.stock_qty === 0 || !p.in_stock ? 'border-red-100' :
            p.stock_qty !== null && p.stock_qty <= 5 ? 'border-amber-100' : 'border-transparent'
          }`}>
            {/* Image */}
            <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden shrink-0">
              {p.image_url
                ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-2xl">🛍️</div>}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm truncate">{p.name}</p>
              <p className="text-xs text-brand-green font-bold">{p.price_display}</p>
              <div className="mt-1">
                <StockBadge qty={p.stock_qty} />
              </div>
            </div>

            {/* Edit button */}
            <Link href={`/dashboard/products/edit?id=${p.id}`}
              className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 hover:bg-brand-light transition-colors">
              <Pencil size={14} className="text-gray-500" />
            </Link>
          </div>
        ))}
      </div>

      {untrackedCount > 0 && filter === 'all' && (
        <div className="mx-4 mt-4 bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-xs font-semibold text-blue-700 mb-1">💡 Enable inventory tracking</p>
          <p className="text-xs text-blue-600">{untrackedCount} product{untrackedCount > 1 ? 's are' : ' is'} not tracked. Edit them and turn on "Track Inventory" to monitor stock levels.</p>
        </div>
      )}
    </div>
  )
}
