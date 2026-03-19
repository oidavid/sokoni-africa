'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, Loader2, ShoppingCart, MapPin, Phone, User } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { COUNTRIES } from '@/lib/countries'

interface Product {
  id: string
  name: string
  price: number
  price_display: string
  image_url: string | null
}

interface CartItemMeta {
  id: string
  qty: number
  variantIndex?: number | null
  variantName?: string | null
  variantPrice?: number | null
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
  const [phoneCountry, setPhoneCountry] = useState(COUNTRIES[0])
  const [showPhoneCountryPicker, setShowPhoneCountryPicker] = useState(false)
  const [showWaForm, setShowWaForm] = useState(false)
  const [waName, setWaName] = useState('')
  const [waPhone, setWaPhone] = useState('')
  const [waCountry, setWaCountry] = useState(COUNTRIES[0])
  const [showWaCountryPicker, setShowWaCountryPicker] = useState(false)
  const [waError, setWaError] = useState('')

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
            const items = (cartIds as CartItemMeta[]).map(c => {
              const product = products.find(p => p.id === c.id)
              if (!product) return null
              // Use variant price if specified
              if (c.variantPrice) {
                product.price = c.variantPrice
                product.price_display = `₦${(c.variantPrice/100).toLocaleString()}`
              }
              const name = c.variantName ? `${product.name} (${c.variantName})` : product.name
              return { product: { ...product, name }, qty: c.qty }
            }).filter(Boolean) as CartItem[]
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
    const rawPhoneDigits = phone.replace(/\D/g, '')
    const phoneMinLen = rawPhoneDigits.startsWith('0') ? 11 : 10
    if (!phone.trim()) errs.phone = 'Please enter your phone number'
    else if (rawPhoneDigits.length < phoneMinLen) errs.phone = `Please enter a valid phone number for ${phoneCountry.name}`
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
      customer_phone: (() => {
        const raw = phone.replace(/\D/g, '')
        const local = raw.startsWith('0') ? raw.slice(1) : raw.startsWith(phoneCountry.dial) ? raw.slice(phoneCountry.dial.length) : raw
        return phoneCountry.dial + local
      })(),
      customer_address: fulfillment === 'delivery' ? address : 'PICKUP',
      items,
      subtotal,
      status: 'new',
      source: 'web',
      notes: `${fulfillment === 'pickup' ? 'PICKUP ORDER. ' : ''}${notes}`,
    })
    const itemLines = cart.map(i => `• ${i.product.name} x${i.qty} — ${i.product.price_display || formatNaira(i.product.price)}`).join('\n')
    const rawP = phone.replace(/\D/g, '')
    const localP = rawP.startsWith('0') ? rawP.slice(1) : rawP.startsWith(phoneCountry.dial) ? rawP.slice(phoneCountry.dial.length) : rawP
    const normalizedPhone = phoneCountry.dial + localP
    const msg = `🛍️ New Order ${orderNum} — ${store.business_name}!\n\n${itemLines}\n\nTotal: ${formatNaira(subtotal)}\n\nCustomer: ${name}\nPhone: +${normalizedPhone}\n${fulfillment === 'delivery' ? `Delivery to: ${address}` : '📦 PICKUP — customer will collect'}\n${notes ? `Notes: ${notes}` : ''}\n\nReply to confirm.\n\n📲 Tap to message customer: https://wa.me/${normalizedPhone}`
    window.open(`https://wa.me/${store.whatsapp_number?.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank')
    setSubmitting(false)
    setSubmitted(true)
  }

  function handleWhatsAppOrder() {
    if (!store) return
    // Always go through sendWhatsAppOrder which validates
    if (name.trim() && phone.trim()) {
      sendWhatsAppOrder(name, phone)
    } else {
      setShowWaForm(true)
    }
  }

  async function sendWhatsAppOrder(customerName: string, customerPhone: string) {
    if (!store) return
    setWaError('')
    if (!customerName.trim()) { setWaError('Please enter your name'); return }
    const rawPhone = customerPhone.replace(/\D/g, '')
    const minLength = rawPhone.startsWith('0') ? 11 : 10
    if (!rawPhone || rawPhone.length < minLength) { setWaError('Please enter a valid WhatsApp number (e.g. 08037459899)'); return }
    const itemLines = cart.map(i => `• ${i.product.name} x${i.qty} — ${i.product.price_display || formatNaira(i.product.price)}`).join('\n')
    const localPhone = rawPhone.startsWith('0') ? rawPhone.slice(1) : rawPhone.startsWith(waCountry.dial) ? rawPhone.slice(waCountry.dial.length) : rawPhone
    const waPhone = waCountry.dial + localPhone
    const msg = `Hi ${store.business_name}! I'd like to order:\n\n${itemLines}\n\nTotal: ${formatNaira(subtotal)}\n\nName: ${customerName}\nWhatsApp: ${customerPhone}\n${fulfillment === 'delivery' && address ? `Address: ${address}` : fulfillment === 'pickup' ? 'I will pick up' : ''}\n${notes ? `Notes: ${notes}` : ''}\n\nPlease confirm. Thank you!\n\n📲 Tap to message customer: https://wa.me/${waPhone}`
    window.open(`https://wa.me/${store.whatsapp_number?.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank')
    // Save to database
    const orderNum = 'ORD-' + Math.floor(1000 + Math.random() * 9000)
    await supabase.from('orders').insert({
      merchant_id: store.id,
      order_number: orderNum,
      customer_name: customerName,
      customer_phone: waPhone,
      customer_address: fulfillment === 'delivery' ? address : 'PICKUP',
      items: cart.map(i => ({ product_id: i.product.id, name: i.product.name, price: i.product.price, qty: i.qty })),
      subtotal,
      status: 'new',
      source: 'whatsapp',
      notes: notes || '',
    })
    setShowWaForm(false)
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
          <p className="text-gray-500 text-sm mb-2">
            Your order <span className="font-bold text-brand-dark">{orderNumber}</span> has been sent to {store?.business_name}.
          </p>
          <p className="text-gray-400 text-xs mb-8">The merchant will contact you on WhatsApp to confirm.</p>
          <Link href={`/store/${slug}`}
            className="bg-brand-green text-white font-bold px-8 py-3 rounded-2xl text-sm inline-block hover:bg-brand-dark transition-colors">
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
            <div key={item.product.id}
              className={`px-4 py-3 flex items-center gap-3 ${i < cart.length - 1 ? 'border-b border-gray-50' : ''}`}>
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
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
            How would you like to receive your order?
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setFulfillment('delivery')}
              className={`flex items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                fulfillment === 'delivery' ? 'border-brand-green bg-brand-light' : 'border-gray-200'
              }`}>
              <MapPin size={16} className={fulfillment === 'delivery' ? 'text-brand-green' : 'text-gray-400'} />
              <div className="text-left">
                <div className={`font-semibold text-sm ${fulfillment === 'delivery' ? 'text-brand-green' : 'text-gray-700'}`}>
                  Delivery
                </div>
                <div className="text-xs text-gray-400">Bring to me</div>
              </div>
            </button>
            <button onClick={() => setFulfillment('pickup')}
              className={`flex items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                fulfillment === 'pickup' ? 'border-brand-green bg-brand-light' : 'border-gray-200'
              }`}>
              <ShoppingCart size={16} className={fulfillment === 'pickup' ? 'text-brand-green' : 'text-gray-400'} />
              <div className="text-left">
                <div className={`font-semibold text-sm ${fulfillment === 'pickup' ? 'text-brand-green' : 'text-gray-700'}`}>
                  Pickup
                </div>
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
            <input type="text" placeholder="Your full name" value={name}
              onChange={e => { setName(e.target.value); setErrors(p => ({...p, name: ''})) }}
              className={`w-full bg-white border-2 rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-colors ${
                errors.name ? 'border-red-300' : 'border-gray-200 focus:border-brand-green'
              }`} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <div className="flex gap-2">
              <button onClick={() => setShowPhoneCountryPicker(!showPhoneCountryPicker)}
                className="flex items-center gap-1.5 bg-white border-2 border-gray-200 rounded-xl px-3 py-3 text-sm font-semibold hover:border-brand-green transition-colors shrink-0">
                <span>{phoneCountry.flag}</span>
                <span className="text-gray-600">+{phoneCountry.dial}</span>
              </button>
              <input type="tel" placeholder="WhatsApp number" value={phone}
                onChange={e => { setPhone(e.target.value); setErrors(p => ({...p, phone: ''})) }}
                className={`flex-1 bg-white border-2 rounded-xl px-4 py-3 text-sm outline-none transition-colors ${
                  errors.phone ? 'border-red-300' : 'border-gray-200 focus:border-brand-green'
                }`} />
            </div>
            {showPhoneCountryPicker && (
              <div className="mt-1 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg max-h-40 overflow-y-auto">
                {COUNTRIES.map(c => (
                  <button key={c.code} onClick={() => { setPhoneCountry(c); setShowPhoneCountryPicker(false) }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-50 ${phoneCountry.code === c.code ? 'bg-brand-light text-brand-green font-semibold' : 'text-gray-700'}`}>
                    <span>{c.flag}</span>
                    <span className="flex-1 text-left">{c.name}</span>
                    <span className="text-gray-400">+{c.dial}</span>
                  </button>
                ))}
              </div>
            )}
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
          {fulfillment === 'delivery' && (
            <div className="relative">
              <MapPin size={15} className="absolute left-4 top-3.5 text-gray-400" />
              <textarea placeholder="Delivery address" value={address}
                onChange={e => { setAddress(e.target.value); setErrors(p => ({...p, address: ''})) }}
                rows={2}
                className={`w-full bg-white border-2 rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-colors resize-none ${
                  errors.address ? 'border-red-300' : 'border-gray-200 focus:border-brand-green'
                }`} />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>
          )}
          <textarea placeholder="Additional notes (optional)" value={notes}
            onChange={e => setNotes(e.target.value)} rows={2}
            className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-green transition-colors resize-none" />
        </div>

        {/* Payment note */}
        <div className="bg-brand-light rounded-2xl p-4 flex items-start gap-3">
          <span className="text-xl shrink-0">💳</span>
          <div>
            <p className="font-semibold text-brand-dark text-sm">Payment</p>
            <p className="text-gray-500 text-xs mt-0.5">
              The merchant will send payment details on WhatsApp after confirming your order.
              Accepted: Bank transfer, mobile money, cash on delivery.
            </p>
          </div>
        </div>

        {/* Place Order */}
        <button onClick={handleSubmit} disabled={submitting || cart.length === 0}
          className="w-full bg-brand-green text-white font-bold py-4 rounded-2xl hover:bg-brand-dark transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
          {submitting
            ? <><Loader2 size={18} className="animate-spin" /> Placing Order...</>
            : <><Check size={18} /> Place Order · {formatNaira(subtotal)}</>}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* WhatsApp option */}
        {!showWaForm ? (
          <button onClick={handleWhatsAppOrder} disabled={cart.length === 0}
            className="btn-whatsapp w-full justify-center disabled:opacity-40">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Order via WhatsApp instead
          </button>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
            <p className="text-sm font-semibold text-gray-700">Your details for WhatsApp order</p>
            <input type="text" placeholder="Your full name" value={waName}
              onChange={e => setWaName(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-green" />
            <div className="flex gap-2">
              <button onClick={() => setShowWaCountryPicker(!showWaCountryPicker)}
                className="flex items-center gap-1 bg-white border-2 border-gray-200 rounded-xl px-3 py-3 text-sm font-semibold shrink-0 hover:border-brand-green transition-colors">
                <span>{waCountry.flag}</span>
                <span className="text-gray-600">+{waCountry.dial}</span>
              </button>
              <input type="tel" placeholder="WhatsApp number" value={waPhone}
                onChange={e => setWaPhone(e.target.value)}
                className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-green" />
            </div>
            {showWaCountryPicker && (
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg max-h-40 overflow-y-auto">
                {COUNTRIES.map(c => (
                  <button key={c.code} onClick={() => { setWaCountry(c); setShowWaCountryPicker(false) }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-50 ${waCountry.code === c.code ? 'bg-brand-light text-brand-green font-semibold' : 'text-gray-700'}`}>
                    <span>{c.flag}</span>
                    <span className="flex-1 text-left">{c.name}</span>
                    <span className="text-gray-400">+{c.dial}</span>
                  </button>
                ))}
              </div>
            )}
            {waError && <p className="text-red-500 text-xs font-medium">{waError}</p>}
            <button onClick={() => sendWhatsAppOrder(waName, waPhone)}
              className="btn-whatsapp w-full justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Send Order on WhatsApp
            </button>
            <button onClick={() => setShowWaForm(false)} className="w-full text-xs text-gray-400 font-medium">Cancel</button>
          </div>
        )}

        <p className="text-xs text-gray-400 text-center">
          By placing this order you agree to be contacted by {store?.business_name} on WhatsApp to confirm.
        </p>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={24} className="text-brand-green animate-spin" />
      </div>
    }>
      <CheckoutForm />
    </Suspense>
  )
}
