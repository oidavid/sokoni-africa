'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Product {
  id: string
  name: string
  description: string
  price: number
  price_display: string
  image_url: string | null
  in_stock: boolean
  category: string
  variants: Array<{name: string; price: number; price_display: string; stock_qty: number | null}> | null
}

interface Merchant {
  id: string
  business_name: string
  slug: string
  whatsapp_number: string
  category: string
  order_mode: string
}

function formatPrice(p: Product) {
  return p.price_display || `₦${(p.price / 100).toLocaleString()}`
}

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const id = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [store, setStore] = useState<Merchant | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [qty, setQty] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: merchant } = await supabase.from('merchants').select('*').eq('slug', slug).single()
      if (!merchant) return
      setStore(merchant)

      const { data: p } = await supabase.from('products').select('*').eq('id', id).single()
      if (p) setProduct(p)

      const { data: rel } = await supabase
        .from('products')
        .select('*')
        .eq('merchant_id', merchant.id)
        .eq('in_stock', true)
        .neq('id', id)
        .limit(4)
      setRelated(rel || [])
      setLoading(false)
    }
    load()
  }, [slug, id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!product || !store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Product not found</p>
          <Link href={`/store/${slug}`} className="text-brand-green font-semibold">← Back to store</Link>
        </div>
      </div>
    )
  }

  const useCart = store.order_mode === 'cart' || store.order_mode === 'both' || !store.order_mode
  const useWhatsApp = store.order_mode === 'whatsapp' || store.order_mode === 'both' || !store.order_mode

  function orderWhatsApp() {
    if (!store || !product) return
    const variantText = selectedVariant !== null && product.variants ? ` (${product.variants[selectedVariant].name})` : ''
    const variantPrice = selectedVariant !== null && product.variants
      ? (product.variants[selectedVariant].price_display || `₦${(product.variants[selectedVariant].price/100).toLocaleString()}`)
      : formatPrice(product)
    const msg = `Hi ${store.business_name}! I want to order:\n\n*${product.name}${variantText}* × ${qty} — ${variantPrice}\n\nPlease confirm availability. Thank you!`
    window.open(`https://wa.me/${store.whatsapp_number?.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Link href={`/store/${slug}`} className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
          <ArrowLeft size={16} className="text-gray-600" />
        </Link>
        <h1 className="font-display font-bold text-brand-dark truncate flex-1">{product.name}</h1>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Product Image */}
        <div className="bg-white">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full aspect-square object-cover" />
          ) : (
            <div className="w-full aspect-square bg-brand-light flex items-center justify-center text-8xl">
              🛍️
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="bg-white mt-2 px-4 py-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h1 className="font-display font-bold text-xl text-brand-dark leading-tight">{product.name}</h1>
            <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${
              product.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
            }`}>
              {product.in_stock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          <p className="font-display font-bold text-3xl text-brand-green mb-4">
            {selectedVariant !== null && product.variants
              ? (product.variants[selectedVariant].price_display || `₦${(product.variants[selectedVariant].price/100).toLocaleString()}`)
              : formatPrice(product)}
          </p>
          {product.description && (
            <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
          )}

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Choose Option</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, i) => (
                  <button key={i} onClick={() => setSelectedVariant(i === selectedVariant ? null : i)}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                      selectedVariant === i
                        ? 'border-brand-green bg-brand-light text-brand-green'
                        : 'border-gray-200 text-gray-700'
                    } ${v.stock_qty === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                    disabled={v.stock_qty === 0}>
                    <span>{v.name}</span>
                    <span className="ml-1.5 text-xs font-bold">{v.price_display || `₦${(v.price/100).toLocaleString()}`}</span>
                    {v.stock_qty === 0 && <span className="ml-1 text-xs text-red-400">Out</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Order section */}
        {product.in_stock && (
          <div className="bg-white mt-2 px-4 py-5 space-y-4">
            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-700">Quantity</span>
              <div className="flex items-center gap-3">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200">
                  <Minus size={14} className="text-gray-600" />
                </button>
                <span className="font-display font-bold text-lg w-8 text-center">{qty}</span>
                <button onClick={() => setQty(q => q + 1)}
                  className="w-9 h-9 bg-brand-green rounded-xl flex items-center justify-center hover:bg-brand-dark">
                  <Plus size={14} className="text-white" />
                </button>
              </div>
              <span className="text-sm text-gray-500 ml-auto font-semibold">
                Total: {`₦${(product.price * qty / 100).toLocaleString()}`}
              </span>
            </div>

            {/* CTA buttons */}
            {useCart && (
              <Link href={`/store/${slug}/checkout?cart=${encodeURIComponent(JSON.stringify([{ id: product.id, qty }]))}`}
                className="block w-full bg-brand-green text-white font-bold py-4 rounded-2xl text-center hover:bg-brand-dark transition-colors flex items-center justify-center gap-2">
                <ShoppingCart size={18} /> Checkout Now
              </Link>
            )}
            {useWhatsApp && (
              <button onClick={orderWhatsApp}
                className="btn-whatsapp w-full justify-center py-4">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                Order on WhatsApp
              </button>
            )}
          </div>
        )}

        {/* Related Products */}
        {related.length > 0 && (
          <div className="bg-white mt-2 px-4 py-5">
            <h2 className="font-display font-bold text-brand-dark mb-4">More from {store.business_name}</h2>
            <div className="grid grid-cols-2 gap-3">
              {related.map(p => (
                <Link key={p.id} href={`/store/${slug}/product/${p.id}`}
                  className="bg-gray-50 rounded-2xl overflow-hidden hover:bg-gray-100 transition-colors">
                  <div className="aspect-square bg-brand-light overflow-hidden">
                    {p.image_url
                      ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                      : <div className="w-full h-full flex items-center justify-center text-3xl">🛍️</div>
                    }
                  </div>
                  <div className="p-2.5">
                    <p className="font-semibold text-xs text-gray-800 line-clamp-2 leading-tight">{p.name}</p>
                    <p className="text-brand-green font-bold text-sm mt-1">{formatPrice(p)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to store */}
        <div className="px-4 py-6 text-center">
          <Link href={`/store/${slug}`} className="text-brand-green font-semibold text-sm">
            ← Back to {store.business_name}
          </Link>
        </div>
      </div>
    </div>
  )
}
