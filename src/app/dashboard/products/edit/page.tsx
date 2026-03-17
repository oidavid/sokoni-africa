'use client'
import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, Loader2, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Product {
  id: string
  name: string
  description: string
  price: number
  price_display: string
  in_stock: boolean
  image_url: string | null
}

function EditProductForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get('id')

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [inStock, setInStock] = useState(true)

  useEffect(() => {
    async function load() {
      if (!productId) { router.push('/dashboard'); return }
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: p } = await supabase.from('products').select('*').eq('id', productId).single()
      if (!p) { router.push('/dashboard'); return }
      setProduct(p)
      setName(p.name)
      setDescription(p.description || '')
      setPrice(String(p.price / 100))
      setInStock(p.in_stock)
      setLoading(false)
    }
    load()
  }, [productId, router])

  async function handleSave() {
    setSaving(true)
    setError('')
    const priceNum = parseFloat(price)
    const { error: updateError } = await supabase
      .from('products')
      .update({
        name,
        description,
        price: Math.round(priceNum * 100),
        price_display: `₦${priceNum.toLocaleString()}`,
        in_stock: inStock,
      })
      .eq('id', productId!)
    if (updateError) {
      setError('Failed to save. Please try again.')
    } else {
      setSaved(true)
      setTimeout(() => { setSaved(false); router.push('/dashboard') }, 1500)
    }
    setSaving(false)
  }

  async function handleDelete() {
    if (!confirm('Delete this product? This cannot be undone.')) return
    setDeleting(true)
    await supabase.from('products').delete().eq('id', productId!)
    router.push('/dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={24} className="text-brand-green animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-lg mx-auto">
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/dashboard" className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
          <ArrowLeft size={16} className="text-gray-600" />
        </Link>
        <h1 className="font-display font-bold text-brand-dark">Edit Product</h1>
        {saved && <div className="ml-auto flex items-center gap-1.5 text-brand-green text-xs font-semibold"><Check size={14} /> Saved</div>}
        <button onClick={handleDelete} disabled={deleting}
          className="ml-auto w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center hover:bg-red-100">
          {deleting ? <Loader2 size={14} className="text-red-400 animate-spin" /> : <Trash2 size={14} className="text-red-400" />}
        </button>
      </div>

      <div className="p-4 space-y-4">
        {product?.image_url && (
          <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover rounded-2xl" />
        )}

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Product Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)}
            className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:border-brand-green outline-none" />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4}
            className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:border-brand-green outline-none resize-none" />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Price</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display font-bold text-gray-400">₦</span>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)}
              className="w-full bg-white border-2 border-gray-200 rounded-xl pl-8 pr-4 py-3 text-lg font-display font-bold text-brand-dark focus:border-brand-green outline-none" />
          </div>
        </div>

        <div className="flex items-center justify-between bg-white border border-gray-100 rounded-xl p-4">
          <div>
            <div className="font-semibold text-gray-800 text-sm">In Stock</div>
            <div className="text-xs text-gray-500">{inStock ? 'Available to order' : 'Not available'}</div>
          </div>
          <button onClick={() => setInStock(!inStock)}
            className={`w-12 h-6 rounded-full transition-colors relative ${inStock ? 'bg-brand-green' : 'bg-gray-200'}`}>
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${inStock ? 'left-6' : 'left-0.5'}`} />
          </button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3"><p className="text-red-600 text-xs">{error}</p></div>}

        <button onClick={handleSave} disabled={saving || !name || !price}
          className="w-full bg-brand-green text-white font-bold py-4 rounded-2xl hover:bg-brand-dark transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
          {saving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Check size={18} /> Save Changes</>}
        </button>
      </div>
    </div>
  )
}

export default function EditProductPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 size={24} className="text-brand-green animate-spin" /></div>}>
      <EditProductForm />
    </Suspense>
  )
}
