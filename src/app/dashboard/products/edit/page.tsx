'use client'
import { useEffect, useState, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, Loader2, Trash2, Camera, Wand2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { uploadProductImage } from '@/lib/storage'

interface Product {
  id: string
  name: string
  description: string
  price: number
  price_display: string
  in_stock: boolean
  image_url: string | null
  stock_qty: number | null
  cost_price: number | null
  variants: Array<{name: string; price: number; price_display: string; stock_qty: number | null}> | null
}

interface Merchant {
  id: string
  category: string
  language: string
}

function EditProductForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get('id')

  const [product, setProduct] = useState<Product | null>(null)
  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [currencySymbol, setCurrencySymbol] = useState('₦')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [generatingDesc, setGeneratingDesc] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [inStock, setInStock] = useState(true)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [stockQty, setStockQty] = useState<string>('')
  const [trackInventory, setTrackInventory] = useState(false)
  const [costPrice, setCostPrice] = useState<string>('')
  const [variants, setVariants] = useState<Array<{id: string; name: string; price: string; stock: string}>>([])
  const [showVariants, setShowVariants] = useState(false)

  const fileRef = useRef<HTMLInputElement>(null)
  const merchantIdRef = useRef<string | null>(null)
  const imageUrlRef = useRef<string | null>(null)

  useEffect(() => {
    async function load() {
      if (!productId) { router.push('/dashboard'); return }
      const { data: { user } } = await supabase.auth.getUser()
      const fallbackEmail = typeof window !== 'undefined' ? localStorage.getItem('earket_merchant_email') : null
      const merchantEmail = user?.email || fallbackEmail
      if (!merchantEmail) { router.push('/login'); return }
      const { data: m } = await supabase.from('merchants').select('id, category, language').eq('email', merchantEmail as string).single()
      if (!m) { router.push('/onboarding'); return }
      setMerchant(m)
      merchantIdRef.current = m.id
      const { data: p } = await supabase.from('products').select('*').eq('id', productId).eq('merchant_id', m.id).single()
      if (!p) { router.push('/dashboard'); return } // blocks access to other merchants' products
      setProduct(p)
      setName(p.name)
      setDescription(p.description || '')
      setPrice(String(p.price / 100))
      setInStock(p.in_stock)
      setImageUrl(p.image_url)
      imageUrlRef.current = p.image_url
      setStockQty(p.stock_qty != null ? String(p.stock_qty) : '')
      setTrackInventory(p.stock_qty != null)
      setCostPrice(p.cost_price ? String(p.cost_price / 100) : '')
      if (p.variants && p.variants.length > 0) {
        setShowVariants(true)
        setVariants(p.variants.map((v: {name: string; price: number; stock_qty: number | null}) => ({
          id: Math.random().toString(),
          name: v.name,
          price: String(v.price / 100),
          stock: v.stock_qty != null ? String(v.stock_qty) : '',
        })))
      }
      setLoading(false)
    }
    load()
  }, [productId, router])

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const mid = merchantIdRef.current || merchant?.id
    if (!mid) { setError('Please wait for the page to fully load before uploading a photo.'); return }

    setUploadingImage(true)
    setError('')

    // Show preview immediately
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)

    // Upload to Supabase storage
    const url = await uploadProductImage(file, mid)
    if (url) {
      setImageUrl(url)
      imageUrlRef.current = url
      await generateDescription(file)
    } else {
      setError('Image upload failed — could not get URL from storage.')
      setImagePreview(null)
    }
    setUploadingImage(false)
  }

  async function generateDescription(file?: File) {
    setGeneratingDesc(true)
    try {
      let base64 = imagePreview
      if (file) {
        base64 = await new Promise(res => {
          const r = new FileReader()
          r.onload = () => res(r.result as string)
          r.readAsDataURL(file)
        })
      }
      if (!base64) return
      const res = await fetch('/api/ai/describe-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, category: merchant?.category, language: merchant?.language })
      })
      const data = await res.json()
      if (data.name && !name) setName(data.name)
      if (data.description) setDescription(data.description)
      if (data.suggestedPrice?.min && !price) setPrice(String(data.suggestedPrice.min))
    } catch (e) {
      console.error('AI error:', e)
    }
    setGeneratingDesc(false)
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    const priceNum = parseFloat(price)
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Please enter a valid price')
      setSaving(false)
      return
    }
    const { error: updateError } = await supabase
      .from('products')
      .update({
        name,
        description,
        price: Math.round(priceNum * 100),
        price_display: `${currencySymbol}${priceNum.toLocaleString()}`,
        in_stock: inStock,
        image_url: imageUrlRef.current || imageUrl,
        stock_qty: trackInventory && stockQty ? parseInt(stockQty) : null,
        cost_price: costPrice ? Math.round(parseFloat(costPrice) * 100) : null,
        variants: showVariants && variants.length > 0 ? variants.filter(v => v.name).map(v => ({
          name: v.name,
          price: Math.round(parseFloat(v.price || String(parseFloat(price))) * 100),
          price_display: `₦${parseFloat(v.price || price).toLocaleString()}`,
          stock_qty: v.stock ? parseInt(v.stock) : null,
        })) : null,
      })
      .eq('id', productId!)
        .eq('merchant_id', merchantIdRef.current!)
    if (updateError) {
      setError('Failed to save. Please try again.')
    } else {
      setSaved(true)
      setTimeout(() => router.push('/dashboard'), 1500)
    }
    setSaving(false)
  }

  async function handleDelete() {
    if (!confirm('Delete this product? This cannot be undone.')) return
    setDeleting(true)
    await supabase.from('products').delete().eq('id', productId!).eq('merchant_id', merchantIdRef.current!)
    router.push('/dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={24} className="text-brand-green animate-spin" />
      </div>
    )
  }

  const currentImage = imagePreview || imageUrl

  return (
    <div className="min-h-screen bg-gray-50 max-w-lg mx-auto pb-10">
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/dashboard" className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
          <ArrowLeft size={16} className="text-gray-600" />
        </Link>
        <h1 className="font-display font-bold text-brand-dark">Edit Product</h1>
        {saved && <div className="ml-auto flex items-center gap-1.5 text-brand-green text-xs font-semibold"><Check size={14} /> Saved!</div>}
        <button onClick={handleDelete} disabled={deleting}
          className="ml-auto w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center hover:bg-red-100">
          {deleting ? <Loader2 size={14} className="text-red-400 animate-spin" /> : <Trash2 size={14} className="text-red-400" />}
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Image */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Product Photo</p>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageChange} />
          <div className="relative">
            {currentImage ? (
              <div className="relative">
                <img src={currentImage} alt={name} className="w-full h-48 object-cover rounded-2xl" />
                {uploadingImage && (
                  <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <Loader2 size={24} className="animate-spin mx-auto mb-1" />
                      <p className="text-xs">Uploading...</p>
                    </div>
                  </div>
                )}
                <button onClick={() => fileRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-white/90 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 flex items-center gap-1.5 shadow">
                  <Camera size={12} /> Change Photo
                </button>
              </div>
            ) : (
              <button onClick={() => fileRef.current?.click()}
                className="w-full h-48 bg-white border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-brand-green/50 hover:bg-brand-light/30 transition-colors group">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-brand-light">
                  <Camera size={24} className="text-gray-400 group-hover:text-brand-green" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-600 text-sm">Upload product photo</p>
                  <p className="text-xs text-gray-400">AI will update description automatically</p>
                </div>
              </button>
            )}
          </div>
          {currentImage && !uploadingImage && (
            <button onClick={() => generateDescription()}
              disabled={generatingDesc}
              className="mt-2 flex items-center gap-1.5 text-xs text-brand-green font-semibold">
              {generatingDesc ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
              {generatingDesc ? 'AI writing description...' : 'Regenerate AI description'}
            </button>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Product Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)}
            className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:border-brand-green outline-none" />
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
            Description
            {generatingDesc && <span className="text-brand-green ml-2 font-normal">✨ AI writing...</span>}
          </label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4}
            placeholder="Describe your product..."
            className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:border-brand-green outline-none resize-none" />
        </div>

        {/* Price */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Price</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display font-bold text-gray-400">{currencySymbol}</span>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} min="0"
              className="w-full bg-white border-2 border-gray-200 rounded-xl pl-8 pr-4 py-3 text-lg font-display font-bold text-brand-dark focus:border-brand-green outline-none" />
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-800 text-sm">Track Inventory</div>
              <div className="text-xs text-gray-500">Set quantity on hand</div>
            </div>
            <button onClick={() => setTrackInventory(!trackInventory)}
              className={`w-12 h-6 rounded-full transition-colors relative ${trackInventory ? 'bg-brand-green' : 'bg-gray-200'}`}>
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${trackInventory ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>
          {trackInventory && (
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1">Quantity in stock</label>
              <input type="number" min="0" value={stockQty}
                onChange={e => setStockQty(e.target.value)}
                placeholder="0"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-brand-dark focus:border-brand-green outline-none" />
            </div>
          )}
        </div>

        {/* Product tip */}
        <div className="bg-brand-light border border-brand-green/20 rounded-xl p-4">
          <p className="text-xs font-semibold text-brand-green mb-1">💡 Selling in different sizes or colors?</p>
          <p className="text-xs text-gray-600">Add each size as a separate product. For example: <span className="font-semibold">"Rice 2kg"</span>, <span className="font-semibold">"Rice 5kg"</span>, <span className="font-semibold">"Rice 10kg"</span> — each with its own photo and price.</p>
        </div>

        {/* In Stock */}
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

        <button onClick={handleSave} disabled={saving || !name || !price || uploadingImage}
          className="w-full bg-brand-green text-white font-bold py-4 rounded-2xl hover:bg-brand-dark transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
          {saving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Check size={18} /> Save Changes</>}
        </button>
      </div>
    </div>
  )
}


const CURRENCY_BY_COUNTRY: Record<string, {symbol: string; name: string}> = {
  NG: {symbol: '₦', name: 'NGN'}, GH: {symbol: 'GH₵', name: 'GHS'},
  KE: {symbol: 'KSh', name: 'KES'}, ZA: {symbol: 'R', name: 'ZAR'},
  US: {symbol: '$', name: 'USD'}, GB: {symbol: '£', name: 'GBP'},
  BR: {symbol: 'R$', name: 'BRL'}, PK: {symbol: '₨', name: 'PKR'},
  IN: {symbol: '₹', name: 'INR'}, EG: {symbol: 'E£', name: 'EGP'},
  TZ: {symbol: 'TSh', name: 'TZS'}, UG: {symbol: 'USh', name: 'UGX'},
  ET: {symbol: 'Br', name: 'ETB'}, SN: {symbol: 'CFA', name: 'XOF'},
  CI: {symbol: 'CFA', name: 'XOF'}, CM: {symbol: 'FCFA', name: 'XAF'},
  CA: {symbol: 'C$', name: 'CAD'}, AU: {symbol: 'A$', name: 'AUD'},
}

export default function EditProductPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 size={24} className="text-brand-green animate-spin" /></div>}>
      <EditProductForm />
    </Suspense>
  )
}
