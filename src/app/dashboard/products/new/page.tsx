'use client'
import { useState, useRef, useEffect } from 'react'
import { Camera, Wand2, ArrowLeft, Check, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { uploadProductImage } from '@/lib/storage'

type State = 'idle' | 'uploading' | 'generating' | 'ready' | 'saving' | 'saved'

interface Merchant {
  id: string
  category: string
  language: string
  business_name: string
  slug: string
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

export default function AddProductPage() {
  const router = useRouter()
  const [state, setState] = useState<State>('idle')
  const [photo, setPhoto] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [inStock, setInStock] = useState(true)
  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [currencySymbol, setCurrencySymbol] = useState('₦')
  const [aiError, setAiError] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [stockQty, setStockQty] = useState<string>('')
  const [trackInventory, setTrackInventory] = useState(false)
  const [costPrice, setCostPrice] = useState<string>('')
  const [variants, setVariants] = useState<Array<{id: string; name: string; price: string; stock: string}>>([])
  const [showVariants, setShowVariants] = useState(false)
  const [saveError, setSaveError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const merchantRef = useRef<Merchant | null>(null)

  useEffect(() => {
    async function getMerchant() {
      const { data: { user } } = await supabase.auth.getUser()
      const fallbackEmail = typeof window !== 'undefined' ? localStorage.getItem('earket_merchant_email') : null
      const merchantEmail = user?.email || fallbackEmail
      if (!merchantEmail) { router.push('/login'); return }
      const { data: m } = await supabase
        .from('merchants')
        .select('id, category, language, business_name, slug, country')
        .eq('email', merchantEmail)
        .single()
      if (!m) { router.push('/onboarding'); return }
      setMerchant(m)
      merchantRef.current = m
      setCurrencySymbol(CURRENCY_BY_COUNTRY[m.country || 'NG']?.symbol || '₦')
    }
    getMerchant()
  }, [router])

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setState('uploading')
    setAiError('')

    const reader = new FileReader()
    reader.onload = async () => {
      const base64 = reader.result as string
      setPhoto(base64)
      setState('generating')
      // Upload image to storage in background
      const currentMerchant = merchantRef.current || merchant
      if (currentMerchant) {
        setUploadingImage(true)
        const url = await uploadProductImage(file, currentMerchant.id)
        if (url) {
          setImageUrl(url)
        } else {
          setAiError('Image upload failed — product will be saved without image')
        }
        setUploadingImage(false)
      }

      try {
        const res = await fetch('/api/ai/describe-product', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64,
            category: merchant?.category || 'general',
            language: merchant?.language || 'en',
          })
        })
        const data = await res.json()

        if (data.name) setName(data.name)
        if (data.description) setDescription(data.description)
        if (data.suggestedPrice?.min) {
          setPrice(String(data.suggestedPrice.min))
        }
        if (data.error) setAiError(data.error)
      } catch {
        setAiError('AI unavailable — please fill in the details manually')
      }
      setState('ready')
    }
    reader.readAsDataURL(file)
  }

  async function handleSave() {
    if (!merchant) return
    setSaveError('')
    setState('saving')

    const priceNum = parseFloat(price)
    if (isNaN(priceNum) || priceNum <= 0) {
      setSaveError('Please enter a valid price')
      setState('ready')
      return
    }

    const priceKobo = Math.round(priceNum * 100)
    const { error } = await supabase.from('products').insert({
      merchant_id: merchant.id,
      name: name.trim(),
      description: description.trim(),
      price: priceKobo,
      price_display: `${currencySymbol}${priceNum.toLocaleString()}`,
      image_url: imageUrl,
      stock_qty: trackInventory && stockQty ? parseInt(stockQty) : null,
      cost_price: costPrice ? Math.round(parseFloat(costPrice) * 100) : null,
      variants: showVariants && variants.length > 0 ? variants.map(v => ({
        name: v.name,
        price: Math.round(parseFloat(v.price || String(priceNum)) * 100),
        price_display: `₦${parseFloat(v.price || String(priceNum)).toLocaleString()}`,
        stock_qty: v.stock ? parseInt(v.stock) : null,
      })) : null,
      in_stock: inStock,
      ai_generated_description: state === 'ready',
    })

    if (error) {
      setSaveError('Failed to save product. Please try again.')
      setState('ready')
      return
    }

    setState('saved')
  }

  function resetForm() {
    setState('idle')
    setPhoto(null)
    setName('')
    setDescription('')
    setPrice('')
    setInStock(true)
    setAiError('')
    setSaveError('')
  }

  const pid = merchant?.language === 'pid'

  return (
    <div className="min-h-screen bg-gray-50 max-w-lg mx-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/dashboard" className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
          <ArrowLeft size={16} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="font-display font-bold text-brand-dark leading-tight">Add Product</h1>
          {merchant && <p className="text-xs text-gray-400">{merchant.business_name}</p>}
        </div>
      </div>

      <div className="p-4 space-y-4 pb-10">
        {/* Saved state */}
        {state === 'saved' ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-green/30">
              <Check size={28} className="text-white" />
            </div>
            <h2 className="font-display font-bold text-xl text-brand-dark mb-2">Product Added! 🎉</h2>
            <p className="text-gray-500 text-sm mb-2">{name}</p>
            <p className="text-brand-green font-bold mb-6">₦{parseFloat(price).toLocaleString()}</p>
            <div className="flex gap-3">
              <button onClick={resetForm}
                className="flex-1 bg-brand-green text-white font-bold py-3 rounded-2xl text-sm">
                {pid ? 'Add Another' : 'Add Another'}
              </button>
              <Link href={`/store/${merchant?.slug}`} target="_blank"
                className="flex-1 bg-white border border-gray-200 text-brand-green font-bold py-3 rounded-2xl text-center text-sm">
                View Store
              </Link>
            </div>
            <Link href="/dashboard" className="block mt-3 text-sm text-gray-400 font-medium">
              ← Back to Dashboard
            </Link>
          </div>
        ) : (
          <>
            {/* Photo upload */}
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                {pid ? 'Product Photo' : 'Product Photo'}
              </p>
              <input ref={fileRef} type="file" accept="image/*" capture="environment"
                className="hidden" onChange={handlePhoto} />

              {!photo ? (
                <button onClick={() => fileRef.current?.click()}
                  className="w-full h-48 bg-white border-2 border-dashed border-gray-200 rounded-2xl 
                             flex flex-col items-center justify-center gap-3 hover:border-brand-green/50 
                             hover:bg-brand-light/30 transition-colors group">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-brand-light">
                    <Camera size={24} className="text-gray-400 group-hover:text-brand-green" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-600 text-sm">
                      {pid ? 'Take photo or upload' : 'Take photo or upload'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {pid ? 'AI go write the description for you ✨' : 'AI will write the description for you ✨'}
                    </p>
                  </div>
                </button>
              ) : (
                <div className="relative">
                  <img src={photo} alt="Product" className="w-full h-48 object-cover rounded-2xl" />
                  <button onClick={() => { setPhoto(null); setState('idle'); setName(''); setDescription(''); setPrice(''); setAiError('') }}
                    className="absolute top-2 right-2 bg-white/90 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-600">
                    Change
                  </button>
                </div>
              )}
            </div>

            {/* AI generating */}
            {state === 'generating' && (
              <div className="bg-brand-light rounded-2xl p-4 flex items-center gap-3">
                <Loader2 size={20} className="text-brand-green animate-spin shrink-0" />
                <div>
                  <p className="font-semibold text-brand-dark text-sm">
                    {pid ? 'AI dey write your description...' : 'AI is writing your description...'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {pid ? 'This go take small time' : 'This takes a few seconds'}
                  </p>
                </div>
              </div>
            )}

            {/* AI success */}
            {state === 'ready' && !aiError && name && (
              <div className="bg-brand-light border border-brand-green/20 rounded-2xl p-3 flex items-center gap-2.5">
                <Wand2 size={16} className="text-brand-green shrink-0" />
                <p className="text-xs text-brand-green font-semibold">
                  {pid ? 'AI don write your description! You fit edit am.' : 'AI wrote your description. Feel free to edit it.'}
                </p>
              </div>
            )}

            {/* AI error — non-blocking */}
            {aiError && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center gap-2.5">
                <AlertCircle size={16} className="text-amber-500 shrink-0" />
                <p className="text-xs text-amber-700">{aiError}</p>
              </div>
            )}

            {/* Product Name */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
                {pid ? 'Product Name' : 'Product Name'}
              </label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder={pid ? "e.g. Ankara Print Fabric (6 yards)" : "e.g. Ankara Print Fabric (6 yards)"}
                className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:border-brand-green outline-none" />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
                Description {state === 'ready' && !aiError && name && <span className="text-brand-green ml-1 normal-case">✨ AI-generated</span>}
              </label>
              <textarea value={description} onChange={e => setDescription(e.target.value)}
                placeholder={pid ? "Describe your product..." : "Describe your product..."} rows={4}
                className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:border-brand-green outline-none resize-none" />
            </div>

            {/* Price */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Price ({currencySymbol})</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm whitespace-nowrap">{currencySymbol}</span>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)}
                  placeholder="0" min="0"
                  className="w-full bg-white border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3 text-lg font-display font-bold text-brand-dark focus:border-brand-green outline-none" />
              </div>
              {state === 'ready' && price && (
                <p className="text-xs text-gray-400 mt-1">💡 {pid ? 'AI suggest dis price — you fit change am' : 'AI suggested this price — you can adjust it'}</p>
              )}
            </div>

            {/* Cost Price */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
                Cost Price <span className="text-gray-400 font-normal normal-case">(optional — for profit tracking)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm whitespace-nowrap">{currencySymbol}</span>
                <input type="number" value={costPrice} onChange={e => setCostPrice(e.target.value)} min="0"
                  placeholder="0"
                  className="w-full bg-white border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-brand-dark focus:border-brand-green outline-none" />
              </div>
              {costPrice && price && parseFloat(price) > 0 && (
                <p className="text-xs text-brand-green mt-1 font-semibold">
                  Profit per unit: {currencySymbol}{(parseFloat(price) - parseFloat(costPrice || '0')).toLocaleString()}
                  ({Math.round(((parseFloat(price) - parseFloat(costPrice || '0')) / parseFloat(price)) * 100)}% margin)
                </p>
              )}
            </div>

            {/* Inventory Tracking */}
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

            {/* Product tip - replaces variants */}
            <div className="bg-brand-light border border-brand-green/20 rounded-xl p-4">
              <p className="text-xs font-semibold text-brand-green mb-1">💡 Selling in different sizes or colors?</p>
              <p className="text-xs text-gray-600">Add each size as a separate product. For example: <span className="font-semibold">"Rice 2kg"</span>, <span className="font-semibold">"Rice 5kg"</span>, <span className="font-semibold">"Rice 10kg"</span> — each with its own photo and price.</p>
            </div>

            {/* In Stock toggle */}
            <div className="flex items-center justify-between bg-white border border-gray-100 rounded-xl p-4">
              <div>
                <div className="font-semibold text-gray-800 text-sm">{pid ? 'In Stock' : 'In Stock'}</div>
                <div className="text-xs text-gray-500">
                  {inStock
                    ? (pid ? 'Available to order' : 'Available to order')
                    : (pid ? 'Not available' : 'Not available')}
                </div>
              </div>
              <button onClick={() => setInStock(!inStock)}
                className={`w-12 h-6 rounded-full transition-colors relative ${inStock ? 'bg-brand-green' : 'bg-gray-200'}`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${inStock ? 'left-6' : 'left-0.5'}`} />
              </button>
            </div>

            {/* Save error */}
            {saveError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-red-600 text-xs">{saveError}</p>
              </div>
            )}

            {/* Save button */}
            <button onClick={handleSave}
              disabled={!name.trim() || !price || !merchant || ['saving', 'generating', 'uploading'].includes(state)}
              className="w-full bg-brand-green text-white font-bold py-4 rounded-2xl hover:bg-brand-dark 
                         transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {state === 'saving'
                ? <><Loader2 size={18} className="animate-spin" /> {pid ? 'Saving...' : 'Saving...'}</>
                : <><Check size={18} /> {pid ? 'Add to Store' : 'Add to Store'}</>
              }
            </button>
          </>
        )}
      </div>
    </div>
  )
}
