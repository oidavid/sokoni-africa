'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, Loader2, ShoppingCart, MapPin, Phone, User } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Product {
  id: string
  name: string
  price: number
  price_display: string
  image_url: string | null
}

interface CartItem {
  product: Product
  qty: number
}

interface Merchant {
  id: string
  business_name: string
  slug: string
  whatsapp_number: string
  location: string
}

function formatNaira(amount: number) {
  return `₦${(amount / 100).toLocaleString()}`
}

function CheckoutForm() {
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = params.slug as string

  const [store, setStore] = useState<Merchant | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [fulfillment, setFulfillment] = useState<'delivery' | 'pickup'>('delivery')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    async function load() {
      const { data: merchant } = await supabase.from('merchants').select('*').eq('slug', slug).single()
      if (!merchant) return
      setStore(merchant)

      const cartParam = searchParams.get('cart')
      if (cartParam) {
        try {
          const cartIds: { id: string; qty: number }[] = JSON.parse(decodeURIComponent(cartParam))
          const ids = cartIds.map(c => c.id)
          const { data: products } = await supabase.from('products').select('*').in('id', ids)
          if (products) {
            const items = cartIds.map(c => ({
              product: products.find(p => p.id === c.id)!,
              qty: c.qty,
            })).filter(i => i.product)
            setCart(items)
          }
        } catch (e) {
          console.error('Cart parse error:', e)
        }
      }
      setLoading(false)
    }
    load()
  }, [slug, searchParams])

  const subtotal = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0)

  function validate() {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Please enter your name'
    if (!phone.trim()) errs.phone = 'Please enter your phone number'
    if (fulfillment === 'delivery' && !address.trim()) errs.address = 'Please enter your delivery address'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit() {
    if (!validate() || !store) return
    setSubmitting(true)

    const orderNum = 'ORD-' + Math.floor(1000 + Math.random() * 9000)
    setOrderNumber(orderNum)

    const items = cart.map(i => ({
      product_id: i.product.id,
      name: i.product.name,
      price: i.product.price,
      qty: i.qty,
    }))

    await supabase.from('orders').insert({
      merchant_id: store.id,
      order_number: orderNum,
      customer_name: name,
      customer_phone: phone,
      customer_address: fulfillment === 'delivery' ? address : 'PICKUP',
      items,
      subtotal,
      status: 'new',
      source: 'web',
      notes: `${fulfillment === 'pickup' ? 'PICKUP ORDER. ' : ''}${notes}`,
    })

    // Notify merchant via WhatsApp
    const itemLines = cart.map(i => `• ${i.product.name} x${i.qty} — ${i.product.price_display || formatNaira(i.product.price)}`).join('\n')
    const msg = `🛍️ New Order ${orderNum}!\n\n${itemLines}\n\nTotal: ${formatNaira(subtotal)}\n\nCustomer: ${name}\nPhone: ${phone}\n${fulfillment === 'delivery' ? `Address: ${address}` : '📦 PICKUP'}\n${notes ? `Notes: ${notes}` : ''}\n\nReply to confirm.`
    window.open(`https://wa.me/${store.whatsapp_number?.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank')

    setSubmitting(false)
    setSubmitted(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={24} className="text-brand-green animate-spin" />
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 max-w-lg mx-auto flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-green/30">
            <Check size={36} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-brand-dark mb-2">Order Placed! 🎉</h1>
          <p className="text-gray-500 text-sm mb-2">Your order <span className="font-bold text-brand-dark">{orderNumber}</span> has been sent to {store?.business_name}.</p>
          <p className="text-gray-400 text-xs mb-8">The merchant will contact you on WhatsApp to confirm.</p>
          <Link href={`/store/${slug}`} className="bg-brand-green text-white font-bold px-8 py-3 rounded-2xl text-sm inline-block hover:bg-brand-dark transition-colors">
            Back to Store
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-lg mx-auto">
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Link href={`/store/${slug}`} className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
          <ArrowLeft size={16} className="text-gray-600" />
        </Link>
        <h1 className="font-display font-bold text-brand-dark">Checkout</h1>
        <span className="text-xs text-gray-400 ml-auto">{store?.business_name}</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Order summary */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
            <ShoppingCart size={15} className="text-brand-green" />
            <span className="font-display font-bold text-brand-dark text-sm">Order Summary</span>
          </div>
          {cart.map((item, i) => (
            <div key={item.product.id} className={`px-4 py-3 flex items-center gap-3 ${i < cart.length - 1 ? 'border-b border-gray-50' : ''}`}>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-800 truncate">{item.product.name}</p>
                <p className="text-xs text-gray-400">Qty: {item.qty}</p>
              </div>
              <p className="font-bold text-brand-green text-sm shrink-0">
                {formatNaira(item.product.price * item.qty)}
              </p>
            </div>
          ))}
          <div className="px-4 py-3 border-t border-gray-100 flex justify-between">
            <span className="font-bold text-gray-800">Total</span>
            <span className="font-display font-bold text-brand-dark text-lg">{formatNaira(subtotal)}</span>
          </div>
        </div>

        {/* Fulfillment */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">How would you like to receive your order?</label>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setFulfillment('delivery')}
              className={`flex items-center gap-2 p-3 rounded-2xl border-2 transition-all ${fulfillment === 'delivery' ? 'border-brand-green bg-brand-light' : 'border-gray-200'}`}>
              <MapPin size={16} className={fulfillment === 'delivery' ? 'text-brand-green' : 'text-gray-400'} />
              <div className="text-left">
                <div className={`font-semibold text-sm ${fulfillment === 'delivery' ? 'text-brand-green' : 'text-gray-700'}`}>Delivery</div>
                <div className="text-xs text-gray-400">Bring to me</div>
              </div>
            </button>
            <button onClick={() => setFulfillment('pickup')}
              className={`flex items-center gap-2 p-3 rounded-2xl border-2 transition-all ${fulfillment === 'pickup' ? 'border-brand-green bg-brand-light' : 'border-gray-200'}`}>
              <ShoppingCart size={16} className={fulfillment === 'pickup' ? 'text-brand-green' : 'text-gray-400'} />
              <div className="text-left">
                <div className={`font-semibold text-sm ${fulfillment === 'pickup' ? 'text-brand-green' : 'text-gray-700'}`}>Pickup</div>
                <div className="text-xs text-gray-400">I'll come collect</div>
              </div>
            </button>
          </div>
        </div>

        {/* Customer details */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">Your Details</label>

          <div className="relative">
            <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Your full name" value={name} onChange={e => { setName(e.target.value); setErrors(p => ({...p, name: ''})) }}
              className={`w-full bg-white border-2 rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-colors ${errors.name ? 'border-red-300' : 'border-gray-200 focus:border-brand-green'}`} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="relative">
            <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="tel" placeholder="Your phone number (WhatsApp)" value={phone} onChange={e => { setPhone(e.target.value); setErrors(p => ({...p, phone: ''})) }}
              className={`w-full bg-white border-2 rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-colors ${errors.phone ? 'border-red-300' : 'border-gray-200 focus:border-brand-green'}`} />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          {fulfillment === 'delivery' && (
            <div className="relative">
              <MapPin size={15} className="absolute left-4 top-3.5 text-gray-400" />
              <textarea placeholder="Delivery address" value={address} onChange={e => { setAddress(e.target.value); setErrors(p => ({...p, address: ''})) }}
                rows={2} className={`w-full bg-white border-2 rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-colors resize-none ${errors.address ? 'border-red-300' : 'border-gray-200 focus:border-brand-green'}`} />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>
          )}

          <textarea placeholder="Additional notes (optional)" value={notes} onChange={e => setNotes(e.target.value)}
            rows={2} className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-green transition-colors resize-none" />
        </div>

        {/* Payment note */}
        <div className="bg-brand-light rounded-2xl p-4 flex items-start gap-3">
          <span className="text-xl shrink-0">💳</span>
          <div>
            <p className="font-semibold text-brand-dark text-sm">Payment</p>
            <p className="text-gray-500 text-xs mt-0.5">The merchant will send you payment details on WhatsApp after confirming your order. Accepted: Bank transfer, mobile money, cash on delivery.</p>
          </div>
        </div>

        <button onClick={handleSubmit} disabled={submitting || cart.length === 0}
          className="w-full bg-brand-green text-white font-bold py-4 rounded-2xl hover:bg-brand-dark transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
          {submitting
            ? <><Loader2 size={18} className="animate-spin" /> Placing Order...</>
            : <><Check size={18} /> Place Order · {formatNaira(subtotal)}</>}
        </button>

        <p className="text-xs text-gray-400 text-center">
          By placing this order you'll be connected with {store?.business_name} on WhatsApp to confirm.
        </p>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 size={24} className="text-brand-green animate-spin" /></div>}>
      <CheckoutForm />
    </Suspense>
  )
}
