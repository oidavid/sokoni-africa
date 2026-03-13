'use client'
import { useState, useRef, useEffect } from 'react'
import { Camera, Wand2, ArrowLeft, Check, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type State = 'idle' | 'uploading' | 'generating' | 'ready' | 'saving' | 'saved'

export default function AddProductPage() {
  const router = useRouter()
  const [state, setState] = useState<State>('idle')
  const [photo, setPhoto] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [inStock, setInStock] = useState(true)
  const [merchantId, setMerchantId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function getMerchant() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: m } = await supabase.from('merchants').select('id').eq('email', user.email).single()
      if (!m) { router.push('/onboarding'); return }
      setMerchantId(m.id)
    }
    getMerchant()
  }, [router])

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setState('uploading')
    const reader = new FileReader()
    reader.onload = async () => {
      const base64 = reader.result as string
      setPhoto(base64)
      setState('generating')
      try {
        const res = await fetch('/api/ai/describe-product', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 })
        })
        const data = await res.json()
        if (data.name) setName(data.name)
        if (data.description) setDescription(data.description)
        if (data.price) setPrice(data.price)
      } catch {
        // If AI fails, just let them fill manually
      }
      setState('ready')
    }
    reader.readAsDataURL(file)
  }

  async function handleSave() {
    if (!merchantId) return
    setState('saving')
    const priceKobo = Math.round(parseFloat(price) * 100)
    await supabase.from('products').insert({
      merchant_id: merchantId,
      name,
      description,
      price: priceKobo,
      price_display: `₦${parseFloat(price).toLocaleString()}`,
      in_stock: inStock,
      ai_generated_description: state === 'ready',
    })
    setState('saved')
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-lg mx-auto">
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/dashboard" className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
          <ArrowLeft size={16} className="text-gray-600" />
        </Link>
        <h1 className="font-display font-bold text-brand-dark">Add Product</h1>
      </div>

      <div className="p-4 space-y-4">
        {state === 'saved' ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-green/30">
              <Check size={28} className="text-white" />
            </div>
            <h2 className="font-display font-bold text-xl text-brand-dark mb-2">Product Added! 🎉</h2>
            <p className="text-gray-500 text-sm mb-6">Your product is now live on your store</p>
            <div className="flex gap-3">
              <button onClick={() => { setState('idle'); setPhoto(null); setName(''); setDescription(''); setPrice('') }}
                className="flex-1 bg-brand-green text-white font-bold py-3 rounded-2xl text-sm">
                Add Another
              </button>
              <Link href="/dashboard" className="flex-1 bg-white border border-gray-200 text-gray-700 font-bold py-3 rounded-2xl text-center text-sm">
                Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Photo upload */}
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Product Photo</p>
              <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto} />
              {!photo ? (
                <button onClick={() => fileRef.current?.click()}
                  className="w-full h-48 bg-white border-2 border-dashed border-gray-200 rounded-2xl 
                             flex flex-col items-center justify-center gap-3 hover:border-brand-green/50 
                             hover:bg-brand-light/30 transition-colors group">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-brand-light">
                    <Camera size={24} className="text-gray-400 group-hover:text-brand-green" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-600 text-sm">Take photo or upload</p>
                    <p className="text-xs text-gray-400">AI go write the description for you</p>
                  </div>
                </button>
              ) : (
                <div className="relative">
                  <img src={photo} alt="Product" className="w-full h-48 object-cover rounded-2xl" />
                  <button onClick={() => { setPhoto(null); setState('idle'); setName(''); setDescription(''); setPrice('') }}
                    className="absolute top-2 right-2 bg-white/90 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-600">
                    Change
                  </button>
                </div>
              )}
            </div>

            {state === 'generating' && (
              <div className="bg-brand-light rounded-2xl p-4 flex items-center gap-3">
                <Loader2 size={20} className="text-brand-green animate-spin shrink-0" />
                <div>
                  <p className="font-semibold text-brand-dark text-sm">AI dey write your description...</p>
                  <p className="text-xs text-gray-500">This go take small time</p>
                </div>
              </div>
            )}

            {state === 'ready' && (
              <div className="bg-brand-light border border-brand-green/20 rounded-2xl p-3 flex items-center gap-2.5">
                <Wand2 size={16} className="text-brand-green shrink-0" />
                <p className="text-xs text-brand-green font-semibold">AI don write your description! You fit edit am.</p>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Product Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g. Ankara Print Fabric (6 yards)"
                className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:border-brand-green outline-none" />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
                Description {state === 'ready' && <span className="text-brand-green ml-1">✨ AI-generated</span>}
              </label>
              <textarea value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Describe your product..." rows={4}
                className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:border-brand-green outline-none resize-none" />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Price (₦)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display font-bold text-gray-400">₦</span>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0"
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

            <button onClick={handleSave}
              disabled={!name || !price || !merchantId || ['saving', 'generating', 'uploading'].includes(state)}
              className="w-full bg-brand-green text-white font-bold py-4 rounded-2xl hover:bg-brand-dark 
                         transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {state === 'saving' ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Check size={18} /> Add to Store</>}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
