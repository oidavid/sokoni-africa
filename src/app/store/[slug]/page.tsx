'use client'
import { useState, useEffect, useRef } from 'react'
import { Search, MapPin, Share2, ShoppingCart, Plus, Minus, X, ChevronDown, SlidersHorizontal, User, Star, MessageCircle, LogOut, Heart } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { COUNTRIES, formatMoney } from '@/lib/countries'
import { getCart, saveCart, addToCart as addToLocalCart, clearCart, type CartItem as LocalCartItem } from '@/lib/cart'
import { getThemeById, getThemeStyle } from '@/lib/themes'
import { getPlaceholderImage } from '@/lib/placeholders'
import ServiceStorefrontPage from '@/components/ServiceStorefrontPage'
import ConsultationStorefrontPage from '@/components/ConsultationStorefrontPage'
import ServicesLedStorefrontPage from '@/components/ServicesLedStorefrontPage'

interface Merchant {
  id: string
  business_name: string
  slug: string
  description: string
  location: string
  whatsapp_number: string
  category: string
  order_mode: string
  theme_color: string
  logo_url: string | null
  business_type?: string
  address?: string
  holiday_mode?: boolean
  holiday_message?: string
  business_hours?: Record<string, {open: string; close: string; closed: boolean}>
  theme_preset?: string
  country?: string
  instagram?: string
  facebook?: string
  linkedin?: string
  twitter_x?: string
  website?: string
  youtube?: string
  tiktok?: string
  other_link?: string
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  price_display: string
  image_url: string | null
  in_stock: boolean
  category: string
  variants: Array<{name: string; price: number; price_display: string; stock_qty?: number | null}> | null
}

interface CartItem {
  product: Product
  qty: number
}

// Generate contrasting text color (white or dark) based on background
function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#111827' : '#ffffff'
}

// Lighten a hex color for backgrounds
function lightenColor(hex: string, amount: number): string {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + amount)
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + amount)
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + amount)
  return `rgb(${r},${g},${b})`
}

const CATEGORY_EMOJI: Record<string, string> = {
  fashion: '👗', food: '🍱', electronics: '📱', beauty: '💄',
  groceries: '🛒', furniture: '🪑', shoes: '👟', phones: '💻',
  health: '💊', stationery: '📚', automobile: '🚗', other: '🏪'
}

function formatPrice(p: Product, country?: string | null) {
  if (p.price_display) return p.price_display
  return formatMoney(p.price, country)
}

const PRODUCTS_PER_PAGE = 24


function formatHour(time: string) {
  const [h, m] = time.split(':').map(Number)
  const period = h < 12 ? 'AM' : 'PM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2,'0')} ${period}`
}
const DAY_ORDER = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

export default function StorefrontPage({ params }: { params: { slug: string } }) {
  const [store, setStore] = useState<Merchant | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'instock'>('all')
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc'>('default')
  const [page, setPage] = useState(1)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [addedId, setAddedId] = useState<string | null>(null)
  const [showSort, setShowSort] = useState(false)
  const [showWhatsAppForm, setShowWhatsAppForm] = useState(false)
  const [discountCode, setDiscountCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState<{code: string; type: string; value: number; id: string} | null>(null)
  const [discountError, setDiscountError] = useState('')
  const [applyingDiscount, setApplyingDiscount] = useState(false)
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const [waError, setWaError] = useState('')
  const [customer, setCustomer] = useState<{id: string; name: string} | null>(null)
  const [customerPoints, setCustomerPoints] = useState<number>(0)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [wishlist, setWishlist] = useState<string[]>([])
  const [variantModal, setVariantModal] = useState<Product | null>(null)
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number | null>(null)
  const [modalQty, setModalQty] = useState(1)
  const [waCountry, setWaCountry] = useState(COUNTRIES[0]) // Default Nigeria
  const [showWaCountryPicker, setShowWaCountryPicker] = useState(false)
  const [waName, setWaName] = useState('')
  const [waPhone, setWaPhone] = useState('')
  const [shareOpen, setShareOpen] = useState(false)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedbackRating, setFeedbackRating] = useState(0)
  const [feedbackText, setFeedbackText] = useState('')
  const [feedbackAnon, setFeedbackAnon] = useState(false)
  const [feedbackSent, setFeedbackSent] = useState(false)
  const [feedbackSending, setFeedbackSending] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function load() {
      const { data: merchant } = await supabase.from('merchants').select('*').eq('slug', params.slug).single()
      if (merchant) {
        setStore(merchant)
        // Default phone country picker to merchant's country
        const merchantCountry = COUNTRIES.find(c => c.code === merchant.country)
        if (merchantCountry) setWaCountry(merchantCountry)
        const { data: prods } = await supabase.from('products').select('*').eq('merchant_id', merchant.id).order('created_at', { ascending: false })
        setProducts(prods || [])
        // Load customer session
        const storedCustomer = typeof window !== 'undefined' ? localStorage.getItem(`earket_customer_${params.slug}`) : null
        if (storedCustomer) {
          const c = JSON.parse(storedCustomer)
          setCustomer(c)
          // Load points
          const { data: pts } = await supabase.from('customer_points')
            .select('points').eq('customer_id', c.id).eq('merchant_id', merchant.id).single()
          if (pts) setCustomerPoints(pts.points)
          // Load wishlist
          const { data: wl } = await supabase.from('wishlists')
            .select('product_id').eq('customer_id', c.id).eq('merchant_id', merchant.id)
          if (wl) setWishlist(wl.map((w: {product_id: string}) => w.product_id))
        }

        // Track store view
        fetch('/api/analytics/view', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ merchant_id: merchant.id })
        }).catch(() => {})
        // Load cart from localStorage
        const savedCart = getCart(params.slug)
        if (savedCart.length > 0) {
          const ids = Array.from(new Set(savedCart.map(i => i.productId)))
          const { data: prods2 } = await supabase.from('products').select('*').in('id', ids)
          if (prods2) {
            setCart(savedCart.map(item => {
              const baseProduct = prods2.find(p => p.id === item.productId)
              if (!baseProduct) return null
              return {
                product: {
                  ...baseProduct,
                  name: item.productName || baseProduct.name,
                  price: item.price,
                  price_display: item.priceDisplay,
                  image_url: item.imageUrl || baseProduct.image_url,
                } as Product,
                qty: item.qty
              }
            }).filter(Boolean) as CartItem[])
          }
        }
      }
      setLoading(false)
    }
    load()
  }, [params.slug])

  // Save cart item to localStorage helper
  function saveCartItem(updatedCart: CartItem[]) {
    if (store) {
      saveCart(store.slug, updatedCart.map(i => ({
        productId: i.product.id,
        productName: i.product.name,
        price: i.product.price,
        priceDisplay: i.product.price_display || formatPrice(i.product, store?.country),
        imageUrl: i.product.image_url,
        qty: i.qty,
        variantName: null,
      })))
    }
  }

  async function toggleWishlist(productId: string) {
    if (!customer || !store) return
    if (wishlist.includes(productId)) {
      await supabase.from('wishlists').delete()
        .eq('customer_id', customer.id).eq('product_id', productId)
      setWishlist(prev => prev.filter(id => id !== productId))
    } else {
      await supabase.from('wishlists').insert({
        customer_id: customer.id, product_id: productId, merchant_id: store.id
      })
      setWishlist(prev => [...prev, productId])
    }
  }

  function addToCart(product: Product) {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.product.name === product.name)
      const newCart = existing
        ? prev.map(i => i.product.id === product.id && i.product.name === product.name ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { product, qty: 1 }]
      saveCartItem(newCart)
      return newCart
    })
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  function removeItem(id: string, name?: string) { setCart(prev => { const newCart = prev.filter(i => !(i.product.id === id && (!name || i.product.name === name))); saveCartItem(newCart); return newCart }) } function updateQty(id: string, qty: number, name?: string) {
    setCart(prev => {
      const newCart = qty <= 0
        ? prev.filter(i => !(i.product.id === id && (!name || i.product.name === name)))
        : prev.map(i => i.product.id === id && (!name || i.product.name === name) ? { ...i, qty } : i)
      saveCartItem(newCart)
      return newCart
    })
  }

  function shareStore() {
    if (navigator.share && /Android|iPhone|iPad/i.test(navigator.userAgent)) {
      navigator.share({ title: store?.business_name, text: `Check out ${store?.business_name} on Earket`, url: window.location.href })
    } else {
      setShareOpen(true)
    }
  }

  function copyStoreLink() {
    navigator.clipboard.writeText(window.location.href)
    const btn = document.getElementById('copy-link-btn')
    if (btn) { btn.textContent = '✓ Copied!'; setTimeout(() => { btn.textContent = 'Copy Link'; }, 2000) }
  }

  async function submitFeedback() {
    if (!feedbackRating) return
    setFeedbackSending(true)
    try {
      await supabase.from('feedback').insert({
        merchant_id: store?.id,
        merchant_slug: store?.slug,
        rating: feedbackRating,
        message: feedbackText.trim() || null,
        anonymous: feedbackAnon,
        customer_name: feedbackAnon ? null : customer?.name || null,
        page_url: window.location.href,
      })
    } catch {}
    setFeedbackSent(true)
    setFeedbackSending(false)
    setTimeout(() => { setFeedbackOpen(false); setFeedbackSent(false); setFeedbackRating(0); setFeedbackText('') }, 2000)
  }

  // People-led: warm, personal, profile photo, empathy headline
  const PEOPLE_LED = ['coaching', 'mental_wellness']
  // Services-led: dark agency feel, grid layout, quote-focused
  const SERVICES_LED = ['digital_services', 'education', 'health_wellness']

  if (!loading && store && store.business_type === 'services') {
    if (PEOPLE_LED.includes(store.category)) return <ConsultationStorefrontPage params={params} />
    return <ServicesLedStorefrontPage params={params} />
  }

  // SEO metadata - dynamic per store
  const pageTitle = store ? `${store.business_name} — Shop on Earket` : 'Earket Store'
  const pageDesc = store
    ? `${store.description || `Shop ${store.business_name} online`}. Order via WhatsApp. Based in ${store.location}.`
    : 'Shop online on Earket'
  const pageUrl = typeof window !== 'undefined' ? window.location.href : `https://earket.com/store/${params.slug}`
  const ogImage = store?.logo_url || 'https://earket.com/og-default.jpg'

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="font-display font-bold text-xl text-brand-dark mb-2">Store not found</h1>
          <Link href="/" className="bg-brand-green text-white font-bold px-6 py-3 rounded-xl text-sm inline-block mt-4">Create Your Own Store</Link>
        </div>
      </div>
    )
  }

  const useCart = store.order_mode === 'cart' || store.order_mode === 'both' || !store.order_mode
  async function applyDiscount() {
    if (!discountCode.trim()) return
    setApplyingDiscount(true)
    setDiscountError('')
    const { data } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('merchant_id', store!.id)
      .eq('code', discountCode.trim().toUpperCase())
      .eq('active', true)
      .single()
    if (!data) {
      setDiscountError('Invalid or expired code')
    } else if (data.expires_at && new Date(data.expires_at) < new Date()) {
      setDiscountError('This code has expired')
    } else if (data.max_uses && data.uses >= data.max_uses) {
      setDiscountError('This code has reached its usage limit')
    } else if (data.min_order > 0 && cartTotal < data.min_order) {
      setDiscountError(`Minimum order of ${formatMoney(data.min_order, store!.country)} required`)
    } else {
      setAppliedDiscount({ code: data.code, type: data.type, value: data.value, id: data.id })
      setDiscountError('')
    }
    setApplyingDiscount(false)
  }

  function getDiscountAmount() {
    if (!appliedDiscount) return 0
    if (appliedDiscount.type === 'percent') return Math.round(cartTotal * appliedDiscount.value / 100)
    const country = COUNTRIES.find(c => c.code === store?.country)
    const isSubunit = country?.subunit ?? true
    return isSubunit ? appliedDiscount.value * 100 : appliedDiscount.value
  }

  const useWhatsApp = store.order_mode === 'whatsapp' || store.order_mode === 'both' || !store.order_mode
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0)
  const categoryEmoji = CATEGORY_EMOJI[store.category] || '🏪'

  // Filter and sort
  let filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(search.toLowerCase())
    const matchFilter = activeFilter === 'all' || p.in_stock
    return matchSearch && matchFilter
  })

  if (sortBy === 'price_asc') filtered = [...filtered].sort((a, b) => a.price - b.price)
  if (sortBy === 'price_desc') filtered = [...filtered].sort((a, b) => b.price - a.price)

  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE)
  const paginated = filtered.slice(0, page * PRODUCTS_PER_PAGE)
  const hasMore = page < totalPages

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Head tags — injected per store */}
      {store && typeof document !== 'undefined' && (() => {
        document.title = pageTitle
        const setMeta = (attr: string, key: string, val: string) => {
          let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null
          if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el) }
          el.setAttribute('content', val)
        }
        setMeta('name','description', pageDesc)
        setMeta('property','og:title', pageTitle)
        setMeta('property','og:description', pageDesc)
        setMeta('property','og:url', pageUrl)
        setMeta('property','og:image', ogImage)
        setMeta('name','twitter:card', 'summary_large_image')
        return null
      })()}

      {/* Share Modal */}
      {shareOpen && store && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShareOpen(false)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-display font-bold text-brand-dark text-base">Share this store</h3>
                <p className="text-xs text-gray-400 mt-0.5">{typeof window !== 'undefined' ? window.location.href : ''}</p>
              </div>
              <button onClick={() => setShareOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"><X size={14} /></button>
            </div>
            <div className="grid grid-cols-4 gap-3 mb-5">
              {(typeof window !== 'undefined' ? [
                { label: 'WhatsApp', color: '#25D366', icon: '💬', href: `https://wa.me/?text=${encodeURIComponent(`Check out ${store.business_name} on Earket: ${window.location.href}`)}` },
                { label: 'Facebook', color: '#1877F2', icon: '📘', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}` },
                { label: 'X / Twitter', color: '#111', icon: '𝕏', href: `https://x.com/intent/tweet?text=${encodeURIComponent(`Check out ${store.business_name}`)}&url=${encodeURIComponent(window.location.href)}` },
                { label: 'LinkedIn', color: '#0A66C2', icon: '💼', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}` },
                { label: 'Email', color: '#EA4335', icon: '✉️', href: `mailto:?subject=${encodeURIComponent(`Check out ${store.business_name}`)}&body=${encodeURIComponent(`I found this store on Earket: ${window.location.href}`)}` },
                { label: 'SMS', color: '#34C759', icon: '📱', href: `sms:?body=${encodeURIComponent(`Check out ${store.business_name}: ${window.location.href}`)}` },
                { label: 'Instagram', color: '#E1306C', icon: '📸', href: 'https://www.instagram.com/' },
                { label: 'Telegram', color: '#2AABEE', icon: '✈️', href: `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Check out ${store.business_name}`)}` },
              ] : []).map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noreferrer" onClick={() => setShareOpen(false)}
                   className="flex flex-col items-center gap-1.5 group">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-transform group-hover:scale-110"
                       style={{ backgroundColor: s.color + '18', border: `1.5px solid ${s.color}28` }}>
                    {s.icon}
                  </div>
                  <span className="text-xs text-gray-500 text-center leading-tight">{s.label}</span>
                </a>
              ))}
            </div>
            <button id="copy-link-btn" onClick={copyStoreLink}
              className="w-full bg-brand-light text-brand-green font-bold text-sm py-3 rounded-2xl hover:bg-brand-green hover:text-white transition-colors">
              Copy Link
            </button>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackOpen && store && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setFeedbackOpen(false)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            {feedbackSent ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">🙏</div>
                <div className="font-display font-bold text-brand-dark text-lg mb-1">Thank you!</div>
                <p className="text-sm text-gray-500">Your feedback helps us improve Earket.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-display font-bold text-brand-dark text-base">Rate your experience</h3>
                  <button onClick={() => setFeedbackOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><X size={14} /></button>
                </div>
                <div className="flex justify-center gap-3 mb-5">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => setFeedbackRating(n)}
                      className={`text-3xl transition-transform hover:scale-125 ${feedbackRating >= n ? '' : 'opacity-25'}`}>
                      ⭐
                    </button>
                  ))}
                </div>
                <textarea
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                  placeholder="Tell us more (optional)..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-brand-green resize-none mb-3"
                />
                <label className="flex items-center gap-2 mb-5 cursor-pointer">
                  <input type="checkbox" checked={feedbackAnon} onChange={e => setFeedbackAnon(e.target.checked)}
                    className="w-4 h-4 rounded" />
                  <span className="text-xs text-gray-500">Submit anonymously</span>
                </label>
                <button onClick={submitFeedback} disabled={!feedbackRating || feedbackSending}
                  className="w-full bg-brand-green text-white font-bold text-sm py-3 rounded-2xl disabled:opacity-40 hover:bg-brand-dark transition-colors">
                  {feedbackSending ? 'Sending...' : 'Submit Feedback'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Holiday / Closure Banner */}
      {store.holiday_mode && (
        <div className="bg-red-500 text-white text-center px-4 py-3 text-sm font-semibold">
          🔴 {store.holiday_message || 'We are temporarily closed. Please check back soon!'}
        </div>
      )}
      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setCartOpen(false)} />
          <div className="w-full max-w-sm bg-white flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} className="text-brand-green" />
                <span className="font-display font-bold text-brand-dark">Cart ({cartCount})</span>
              </div>
              <button onClick={() => setCartOpen(false)} className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-12"><div className="text-4xl mb-3">🛒</div><p className="text-gray-500 text-sm">Your cart is empty</p></div>
              ) : cart.map(item => (
                <div key={item.product.id} className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-brand-light">
                    {item.product.image_url
                      ? <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                      : <img src={getPlaceholderImage(item.product.id, store.category, store.country)} alt={item.product.name} className="w-full h-full object-cover" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-xs truncate">{item.product.name}</p>
                    <p className="font-bold text-sm" style={{ color: getContrastColor(store.theme_color || '#1A7A4A') === '#111827' ? store.theme_color || '#1A7A4A' : '#1A7A4A' }}>{formatPrice(item.product, store.country)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => updateQty(item.product.id, item.qty - 1)} className="w-6 h-6 bg-white border border-gray-200 rounded-lg flex items-center justify-center"><Minus size={10} /></button>
                      <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.product.id, item.qty + 1)} style={{ backgroundColor: store.theme_color || '#1A7A4A' }} className="w-6 h-6 rounded-lg flex items-center justify-center"><Plus size={10} style={{ color: getContrastColor(store.theme_color || '#1A7A4A') }} /></button>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.product.id, item.product.name)} className="w-7 h-7 bg-red-50 rounded-xl flex items-center justify-center">
                    <X size={12} className="text-red-400" />
                  </button>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div className="px-4 py-4 border-t border-gray-100 space-y-3">
                {/* Discount Code */}
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <input value={discountCode} onChange={e => { setDiscountCode(e.target.value.toUpperCase()); setDiscountError('') }}
                      placeholder="Discount code"
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-brand-green" />
                    <button onClick={applyDiscount} disabled={applyingDiscount || !discountCode.trim()}
                      className="text-xs font-bold px-3 py-2 rounded-xl border border-brand-green text-brand-green bg-brand-light disabled:opacity-40">
                      {applyingDiscount ? '...' : 'Apply'}
                    </button>
                  </div>
                  {discountError && <p className="text-red-500 text-xs">{discountError}</p>}
                  {appliedDiscount && (
                    <div className="flex items-center justify-between bg-green-50 rounded-xl px-3 py-2">
                      <span className="text-xs font-semibold text-green-700">🎉 {appliedDiscount.code} applied!</span>
                      <button onClick={() => { setAppliedDiscount(null); setDiscountCode('') }} className="text-xs text-gray-400">✕</button>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Subtotal</span>
                  <span className="text-sm text-gray-700">{formatMoney(cartTotal, store.country)}</span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between items-center">
                    <span className="text-green-600 text-sm">Discount ({appliedDiscount.type === 'percent' ? `${appliedDiscount.value}%` : formatMoney(appliedDiscount.value, store.country)})</span>
                    <span className="text-green-600 font-semibold text-sm">-{formatMoney(getDiscountAmount(), store.country)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center border-t border-gray-100 pt-2">
                  <span className="text-gray-500 text-sm font-semibold">Total</span>
                  <span className="font-display font-bold text-lg" style={{ color: store.theme_color || '#1A7A4A' }}>{formatMoney(cartTotal - getDiscountAmount(), store.country)}</span>
                </div>
                <Link href={`/store/${store.slug}/checkout?cart=${encodeURIComponent(JSON.stringify(cart.map(i => ({ id: i.product.id, qty: i.qty }))))}&discount=${encodeURIComponent(JSON.stringify(appliedDiscount || null))}`}
                  onClick={() => setCartOpen(false)}
                  style={{ backgroundColor: store.theme_color || '#1A7A4A', color: getContrastColor(store.theme_color || '#1A7A4A') }}
                  className="block w-full font-bold py-3.5 rounded-2xl text-center transition-colors">
                  Proceed to Checkout
                </Link>
                {useWhatsApp && (
                  <>
                    {!showWhatsAppForm ? (
                      <button onClick={() => setShowWhatsAppForm(true)} className="btn-whatsapp w-full justify-center">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                        Order via WhatsApp
                      </button>
                    ) : (
                      <div className="space-y-2 bg-gray-50 rounded-2xl p-3">
                        <p className="text-xs font-semibold text-gray-600">Your details</p>
                        <input type="text" placeholder="Your name *" value={waName}
                          onChange={e => setWaName(e.target.value)}
                          className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-brand-green ${!waName.trim() && waPhone ? 'border-red-300' : 'border-gray-200'}`} />
                        <div className="flex gap-2">
                          <button onClick={() => setShowWaCountryPicker(!showWaCountryPicker)}
                            className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl px-2 py-2 text-xs font-semibold shrink-0 hover:border-brand-green">
                            <span>{waCountry.flag}</span>
                            <span className="text-gray-600">+{waCountry.dial}</span>
                          </button>
                          <input type="tel" placeholder="WhatsApp number" value={waPhone}
                            onChange={e => setWaPhone(e.target.value)}
                            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-brand-green" />
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
                        <button onClick={async () => {
                          setWaError('')
                          if (!waName.trim()) { setWaError('Please enter your name'); return }
                          const rawWaPhone = waPhone.replace(/\D/g, '')
                          let localWaDigits = rawWaPhone
                          if (rawWaPhone.startsWith(waCountry.dial)) localWaDigits = rawWaPhone.slice(waCountry.dial.length)
                          else if (rawWaPhone.startsWith('0')) localWaDigits = rawWaPhone.slice(1)
                          if (!rawWaPhone || localWaDigits.length < 10) { setWaError('Please enter a valid 10-digit WhatsApp number'); return }
                          const lines = cart.map(i => `• ${i.product.name} x${i.qty} — ${formatPrice(i.product, store.country)}`).join('\n')
                          const merchantMsg = `Hi ${store.business_name}! I'd like to order:\n\n${lines}\n\nTotal: ${formatMoney(cartTotal, store.country)}\n\nName: ${waName}\nWhatsApp: ${waPhone}\n\nPlease confirm. Thank you!`
                          const customerMsg = `Hi ${waName || 'there'}! Here is your order summary from *${store.business_name}*:\n\n${lines}\n\nTotal: ${formatMoney(cartTotal, store.country)}\n\nThe merchant will confirm your order shortly.`
                          const merchantWa = store.whatsapp_number?.replace(/\D/g, '')
                          const rawPhone = waPhone.replace(/\D/g, '')
                          // Strip leading zero or country code if already included
                          let localPhone = rawPhone
                          if (rawPhone.startsWith('0')) {
                            localPhone = rawPhone.slice(1)
                          } else if (waCountry.dial && rawPhone.startsWith(waCountry.dial)) {
                            localPhone = rawPhone.slice(waCountry.dial.length)
                          }
                          const customerWa = waCountry.dial + localPhone
                          // Include customer WhatsApp link in merchant message for easy follow-up
                          const fullMerchantMsg = merchantMsg + `\n\n📲 Tap to message customer: https://wa.me/${customerWa}`
                          window.open(`https://wa.me/${merchantWa}?text=${encodeURIComponent(fullMerchantMsg)}`, '_blank')
                          setShowWhatsAppForm(false)
                          setOrderConfirmed(true)
                          setCart([])
                          if (store) clearCart(store.slug)
                          setCartOpen(false)
                        }} className="btn-whatsapp w-full justify-center">
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                          Send Order on WhatsApp
                        </button>
                        <button onClick={() => setShowWhatsAppForm(false)} className="w-full text-xs text-gray-400 font-medium py-1">Cancel</button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Variant Selection Modal */}
      {variantModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setVariantModal(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl">
            {/* Product info */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
              {variantModal.image_url ? (
                <img src={variantModal.image_url} alt={variantModal.name} className="w-16 h-16 rounded-2xl object-cover shrink-0" />
              ) : (
                <img src={getPlaceholderImage(variantModal.id, store?.category, store?.country)} alt={variantModal.name} className="w-16 h-16 rounded-2xl object-cover shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm leading-tight">{variantModal.name}</p>
                <p className="font-bold text-sm mt-0.5" style={{ color: getContrastColor(store?.theme_color || '#1A7A4A') === '#111827' ? store?.theme_color || '#1A7A4A' : '#1A7A4A' }}>
                  {selectedVariantIndex !== null && variantModal.variants
                    ? variantModal.variants[selectedVariantIndex].price_display || formatMoney(variantModal.variants[selectedVariantIndex].price, store?.country)
                    : (() => { const prices = variantModal.variants!.map(v => v.price); const min = Math.min(...prices); const max = Math.max(...prices); return min === max ? formatMoney(min, store?.country) : `${formatMoney(min, store?.country)} – ${formatMoney(max, store?.country)}` })()
                  }
                </p>
              </div>
              <button onClick={() => setVariantModal(null)} className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                <X size={14} className="text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Variant options */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Choose Option</p>
                <div className="flex flex-wrap gap-2">
                  {variantModal.variants!.map((v, i) => (
                    <button key={i} onClick={() => setSelectedVariantIndex(i)}
                      disabled={v.stock_qty === 0}
                      className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                        selectedVariantIndex === i ? 'text-white border-transparent' : 'border-gray-200 text-gray-700 bg-white'
                      } ${v.stock_qty === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                      style={selectedVariantIndex === i ? { backgroundColor: store?.theme_color || '#1A7A4A' } : {}}>
                      {v.name}
                      <span className="ml-1.5 text-xs">{v.price_display || formatMoney(v.price, store?.country)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Quantity</p>
                <div className="flex items-center gap-3 ml-auto">
                  <button onClick={() => setModalQty(q => Math.max(1, q - 1))}
                    className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Minus size={13} className="text-gray-600" />
                  </button>
                  <span className="font-bold text-lg w-6 text-center">{modalQty}</span>
                  <button onClick={() => setModalQty(q => q + 1)}
                    style={{ backgroundColor: store?.theme_color || '#1A7A4A' }}
                    className="w-8 h-8 rounded-xl flex items-center justify-center">
                    <Plus size={13} className="text-white" />
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    if (selectedVariantIndex === null) { alert('Please select an option'); return }
                    const variant = variantModal.variants![selectedVariantIndex]
                    const productWithVariant = {
                      ...variantModal,
                      name: `${variantModal.name} (${variant.name})`,
                      price: variant.price,
                      price_display: variant.price_display || formatMoney(variant.price, store?.country),
                    }
                    setCart(prev => {
                      const existing = prev.find(i => i.product.id === productWithVariant.id && i.product.name === productWithVariant.name)
                      const newCart = existing
                        ? prev.map(i => i.product.id === productWithVariant.id && i.product.name === productWithVariant.name ? { ...i, qty: i.qty + modalQty } : i)
                        : [...prev, { product: productWithVariant, qty: modalQty }]
                      saveCartItem(newCart)
                      return newCart
                    })
                    // Close modal and go back to shopping — cart button shows updated count
                    setVariantModal(null)
                    setSelectedVariantIndex(null)
                    setModalQty(1)
                  }}
                  disabled={selectedVariantIndex === null}
                  style={selectedVariantIndex !== null ? { backgroundColor: store?.theme_color || '#1A7A4A' } : {}}
                  className={`w-full font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm transition-all ${
                    selectedVariantIndex === null ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'text-white'
                  }`}>
                  <ShoppingCart size={16} />
                  {selectedVariantIndex !== null
                    ? `Add ${modalQty} ${variantModal.variants![selectedVariantIndex].name} to Cart`
                    : 'Select an option first'}
                </button>
                <button onClick={() => { setVariantModal(null); setCartOpen(true) }}
                  className="w-full text-sm font-semibold py-2 border border-gray-200 rounded-2xl"
                  style={{ color: getContrastColor(store?.theme_color || '#1A7A4A') === '#111827' ? store?.theme_color || '#1A7A4A' : '#1A7A4A' }}>
                  View Cart & Checkout
                </button>
                <button onClick={() => setVariantModal(null)}
                  className="w-full text-sm text-gray-400 font-medium py-1">
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Confirmed Banner */}
      {orderConfirmed && (
        <div style={{ backgroundColor: store.theme_color || '#1A7A4A', color: getContrastColor(store.theme_color || '#1A7A4A') }} className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 max-w-sm mx-4">
          <span className="text-xl">✅</span>
          <div>
            <p className="font-bold text-sm">Order sent!</p>
            <p className="text-xs text-white/80">{store?.business_name} will confirm via WhatsApp shortly.</p>
          </div>
          <button onClick={() => setOrderConfirmed(false)} className="ml-2 text-white/60 hover:text-white">✕</button>
        </div>
      )}

      {/* Store Header */}
      <div style={store.theme_preset ? getThemeStyle(getThemeById(store.theme_preset)) : { backgroundColor: store.theme_color || '#1A7A4A' }} className="text-white">
        <div className="max-w-6xl mx-auto px-4 pt-5 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white/20 rounded-2xl overflow-hidden flex items-center justify-center text-3xl shrink-0">
                {store.logo_url
                  ? <img src={store.logo_url} alt={store.business_name} className="w-full h-full object-cover" />
                  : <span>{categoryEmoji}</span>
                }
              </div>
              <div>
                <h1 className="font-display font-bold text-xl leading-tight">{store.business_name}</h1>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={12} className="opacity-75" />
                  <span className="text-xs opacity-75">{store.location}</span>
                </div>
                {store.description && <p className="text-xs text-white/70 mt-1 max-w-md">{store.description}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {useCart && cartCount > 0 && (
                <button onClick={() => setCartOpen(true)}
                  className="relative flex items-center gap-2 bg-white/20 rounded-xl px-3 py-2 hover:bg-white/30 transition-colors">
                  <ShoppingCart size={16} />
                  <span className="text-sm font-bold">{cartCount}</span>
                </button>
              )}
              <button onClick={shareStore} className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20">
                <Share2 size={16} />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-4">
            <div><span className="font-display font-bold text-xl">{products.length}</span><span className="text-xs opacity-60 ml-1">Products</span></div>
            <div><span className="font-display font-bold text-xl">{products.filter(p => p.in_stock).length}</span><span className="text-xs opacity-60 ml-1">In Stock</span></div>
          </div>
        </div>

        {/* Action strip */}
        <div className="flex">
          <a href={`https://wa.me/${store.whatsapp_number?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] py-3 text-sm font-semibold text-white flex-1">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            Chat with us
          </a>
          <button onClick={() => setCartOpen(true)}
            style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
            className="flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white flex-1">
            <ShoppingCart size={16} />
            {cartCount > 0 ? `Cart (${cartCount}) · ${formatMoney(cartTotal, store.country)}` : 'View Cart'}
          </button>
          <div className="relative">
            <button onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
              className="flex items-center justify-center gap-1.5 py-3 px-3 text-sm font-semibold text-white whitespace-nowrap">
              {customer ? (
                <>
                  <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center font-bold text-xs">{customer.name[0]}</span>
                  <span className="hidden sm:inline text-xs">Hi {customer.name.split(' ')[0]}!</span>
                  {customerPoints > 0 && <span className="text-yellow-300 text-xs font-bold">⭐ {customerPoints}</span>}
                </>
              ) : (
                <><User size={14} /><span className="text-xs">Sign In</span></>
              )}
            </button>

            {/* Account dropdown */}
            {accountMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                {customer ? (
                  <>
                    <div className="px-4 py-3 bg-brand-light border-b border-gray-100">
                      <p className="font-display font-bold text-brand-dark text-sm">Hi {customer.name.split(' ')[0]}! 👋</p>
                      {customerPoints > 0 && (
                        <p className="text-xs text-brand-green font-semibold mt-0.5">⭐ {customerPoints} loyalty points</p>
                      )}
                    </div>
                    <Link href={`/store/${store.slug}/account`} onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50">
                      <ShoppingCart size={14} className="text-gray-400" /> My Orders
                    </Link>
                    <Link href={`/store/${store.slug}/account`} onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50">
                      <Star size={14} className="text-gray-400" /> My Points & Rewards
                    </Link>
                    <a href={`https://wa.me/${store.whatsapp_number?.replace(/\D/g, '')}?text=${encodeURIComponent('Hi! I need help with my order.')}`}
                      target="_blank" rel="noreferrer" onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50">
                      <MessageCircle size={14} className="text-gray-400" /> Help & Contact
                    </a>
                    <button onClick={() => {
                      localStorage.removeItem(`earket_customer_${store.slug}`)
                      setCustomer(null); setCustomerPoints(0); setWishlist([]); setAccountMenuOpen(false)
                    }} className="flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 w-full text-left">
                      <LogOut size={14} /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="font-semibold text-gray-800 text-sm">Welcome!</p>
                      <p className="text-xs text-gray-400">Sign in to earn loyalty points</p>
                    </div>
                    <Link href={`/store/${store.slug}/login`} onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-brand-green hover:bg-brand-light border-b border-gray-50">
                      Sign In
                    </Link>
                    <Link href={`/store/${store.slug}/register`} onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50">
                      ⭐ Create Account & Earn Points
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search, Filter & Sort */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex gap-2 mb-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input ref={searchRef} type="search" placeholder="Search products..." value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                className="w-full bg-gray-100 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-brand-green/20 border border-transparent focus:border-brand-green/30" />
            </div>
            <div className="relative">
              <button onClick={() => setShowSort(!showSort)}
                className="flex items-center gap-1.5 bg-gray-100 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200">
                <SlidersHorizontal size={14} />
                Sort
                <ChevronDown size={12} />
              </button>
              {showSort && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-20 min-w-40">
                  {[
                    { value: 'default', label: 'Default' },
                    { value: 'price_asc', label: 'Price: Low to High' },
                    { value: 'price_desc', label: 'Price: High to Low' },
                  ].map(opt => (
                    <button key={opt.value} onClick={() => { setSortBy(opt.value as typeof sortBy); setShowSort(false) }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 ${sortBy === opt.value ? 'text-brand-green font-semibold' : 'text-gray-700'}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 items-center">
            {(['all', 'instock'] as const).map(f => (
              <button key={f} onClick={() => { setActiveFilter(f); setPage(1) }}
                style={activeFilter === f ? { backgroundColor: store.theme_color || '#1A7A4A', color: getContrastColor(store.theme_color || '#1A7A4A') } : {}}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${activeFilter === f ? '' : 'bg-gray-100 text-gray-500'}`}>
                {f === 'all' ? 'All Products' : '✅ In Stock'}
              </button>
            ))}
            <span className="ml-auto text-xs text-gray-400">{filtered.length} products</span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {paginated.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">{search ? '🔍' : categoryEmoji}</div>
            <p className="text-gray-600 font-semibold mb-1">{search ? `No results for "${search}"` : 'No products yet'}</p>
            {!search && <p className="text-gray-400 text-sm">Check back soon or message us on WhatsApp</p>}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {paginated.map(product => (
                <div key={product.id} className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 ${!product.in_stock ? 'opacity-70' : ''}`}>
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy" />
                    ) : (
                      <img
                        src={getPlaceholderImage(product.id, store.category, store.country)}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    )}
                    {!product.in_stock && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
                      </div>
                    )}
                    {useCart && product.in_stock && (
                      <button onClick={() => addToCart(product)}
                        style={addedId === product.id ? {} : { backgroundColor: store.theme_color || '#1A7A4A' }}
                        className={`absolute bottom-2 right-2 w-8 h-8 rounded-xl flex items-center justify-center shadow-lg transition-all ${
                          addedId === product.id ? 'bg-green-500 scale-110' : ''
                        }`}>
                        {addedId === product.id ? <span className="text-white text-xs font-bold">✓</span> : <Plus size={16} className="text-white" />}
                      </button>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    <Link href={`/store/${store.slug}/product/${product.id}`} className="block">
                    <h3 className="font-semibold text-gray-800 text-sm leading-tight mb-1 line-clamp-2 hover:text-brand-green transition-colors">{product.name}</h3>
                  </Link>
                    <p className="font-display font-bold text-base mb-2" style={{ color: getContrastColor(store.theme_color || '#1A7A4A') === '#111827' ? store.theme_color || '#1A7A4A' : '#1A7A4A' }}>
                      {formatPrice(product, store.country)}
                    </p>

                    {product.in_stock ? (
                      <div className="space-y-1.5">
                        {useCart && (
                          <button onClick={() => addToCart(product)}
                              style={addedId === product.id ? {} : { backgroundColor: store.theme_color || '#1A7A4A', color: getContrastColor(store.theme_color || '#1A7A4A') }}
                              className={`w-full text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                                addedId === product.id ? 'bg-green-500 text-white' : ''
                              }`}>
                              {addedId === product.id ? '✓ Added!' : <><ShoppingCart size={12} /> Add to Cart</>}
                            </button>
                        )}

                      </div>
                    ) : (
                      <button disabled className="w-full bg-gray-100 text-gray-400 text-xs font-semibold py-2 rounded-xl cursor-not-allowed">
                        Out of Stock
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-8">
                <button onClick={() => setPage(p => p + 1)}
                  style={{ borderColor: store.theme_color || '#1A7A4A', color: store.theme_color || '#1A7A4A' }}
                  className="bg-white border-2 font-bold px-8 py-3 rounded-2xl transition-colors">
                  Load More ({filtered.length - paginated.length} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating cart */}
      {useCart && cartCount > 0 && (
        <button onClick={() => setCartOpen(true)}
          style={{ backgroundColor: store.theme_color || '#1A7A4A', color: getContrastColor(store.theme_color || '#1A7A4A') }}
        className="fixed bottom-6 right-6 font-bold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 transition-colors z-40">
          <ShoppingCart size={18} />
          {cartCount} item{cartCount > 1 ? 's' : ''} · {formatMoney(cartTotal, store.country)}
        </button>
      )}

      {/* Testimonials */}
      {(store as any).testimonials?.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 mb-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-display font-bold text-brand-dark text-base mb-4">What Our Customers Say</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(store as any).testimonials.map((t: any, i: number) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex gap-0.5 mb-2">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} className={`text-sm ${s <= (t.rating||5) ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed italic mb-3">"{t.text}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ backgroundColor: store.theme_color || '#1A7A4A' }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{t.name}</p>
                      {t.role && <p className="text-xs text-gray-400">{t.role}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Find Us */}
      <div className="max-w-6xl mx-auto px-4 mb-4 mt-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-display font-bold text-brand-dark text-base mb-4">Find Us</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 bg-brand-light">
                <MapPin size={16} className="text-brand-green" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-0.5">Location</p>
                <p className="text-sm font-semibold text-gray-800">{store.address || store.location}</p>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((store.address || store.business_name) + ' ' + store.location)}`}
                  target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold mt-2 px-3 py-1.5 rounded-lg bg-brand-light text-brand-green">
                  Get Directions on Google Maps
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#25D366]/10 shrink-0">
                <MessageCircle size={16} className="text-[#25D366]" />
              </div>
              <div>
                <p className="text-xs text-gray-400">WhatsApp / Phone</p>
                <p className="text-sm font-semibold text-gray-800">+{store.whatsapp_number?.replace(/\D/g, '')}</p>
              </div>
            </div>
            {store.business_hours && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-brand-light">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#1A7A4A" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">Business Hours</p>
                  <div className="space-y-0.5">
                    {DAY_ORDER.map(day => {
                      const val = store.business_hours![day]
                      if (!val) return null
                      return (
                        <div key={day} className="flex items-center gap-2 text-xs">
                          <span className="text-gray-500 w-8 shrink-0">{day}</span>
                          {val.closed
                            ? <span className="text-red-400 font-medium">Closed</span>
                            : <span className="text-gray-700 font-medium">{formatHour(val.open)} – {formatHour(val.close)}</span>
                          }
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <a href={`https://maps.google.com/maps?q=${encodeURIComponent((store.address || store.business_name) + ' ' + store.location)}&output=embed&z=15`}
          target="_blank" rel="noreferrer"
          className="mt-3 block rounded-2xl overflow-hidden border border-gray-200 hover:opacity-95 transition-opacity">
          <iframe
            title="Business location map"
            width="100%"
            height="200"
            loading="lazy"
            style={{ border: 0, display: 'block' }}
            src={`https://maps.google.com/maps?q=${encodeURIComponent((store.address || store.business_name) + ' ' + store.location)}&output=embed&z=15`}
            allowFullScreen
          />
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-100">
            <div className="flex items-center gap-2 min-w-0">
              <MapPin size={14} className="text-brand-green shrink-0" />
              <span className="text-xs font-semibold text-gray-700 truncate">{store.address || store.location}</span>
            </div>
            <span className="text-xs font-semibold text-brand-green shrink-0 ml-2">Open Maps →</span>
          </div>
        </a>
      </div>

      {/* Social Links — centered, below map, above footer */}
      {(store.instagram || store.facebook || store.linkedin || store.twitter_x || store.website || store.youtube || store.tiktok || store.other_link) && (
        <div className="max-w-6xl mx-auto px-4 mb-2 mt-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Follow Us</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {store.instagram && <a href={`https://instagram.com/${store.instagram.replace('@','')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors">📸 Instagram</a>}
              {store.facebook && <a href={store.facebook.startsWith('http') ? store.facebook : `https://facebook.com/${store.facebook}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">📘 Facebook</a>}
              {store.linkedin && <a href={store.linkedin.startsWith('http') ? store.linkedin : `https://linkedin.com/in/${store.linkedin}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors">💼 LinkedIn</a>}
              {store.twitter_x && <a href={`https://x.com/${store.twitter_x.replace('@','')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">𝕏 Twitter / X</a>}
              {store.youtube && <a href={store.youtube.startsWith('http') ? store.youtube : `https://youtube.com/${store.youtube}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">▶️ YouTube</a>}
              {store.tiktok && <a href={`https://tiktok.com/${store.tiktok.startsWith('@') ? store.tiktok : '@' + store.tiktok}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-black transition-colors">🎵 TikTok</a>}
              {store.website && <a href={store.website.startsWith('http') ? store.website : `https://${store.website}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-light text-brand-green hover:bg-brand-green hover:text-white transition-colors">🌐 Website</a>}
              {store.other_link && <a href={store.other_link.startsWith('http') ? store.other_link : `https://${store.other_link}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors">🔗 Follow Us</a>}
            </div>
          </div>
        </div>
      )}

      {/* Viral Footer — adapts to merchant theme */}
      <div className="max-w-6xl mx-auto px-4 mb-6 mt-4">
        <div className="rounded-2xl p-5 text-center" style={{ backgroundColor: store.theme_preset ? (getThemeById(store.theme_preset)?.primary || store.theme_color || '#1A7A4A') : (store.theme_color || '#1A7A4A') }}>
          {(() => {
            const bg = store.theme_preset ? (getThemeById(store.theme_preset)?.primary || store.theme_color || '#1A7A4A') : (store.theme_color || '#1A7A4A')
            const onBg = getContrastColor(bg)
            const isLight = onBg === '#111827'
            return (
              <>
                <p className="text-xs mb-1" style={{ color: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }}>Powered by</p>
                <Link href="/" className="font-display font-bold text-lg mb-1 inline-block transition-opacity hover:opacity-80" style={{ color: onBg }}>
                  earket
                </Link>
                <p className="text-xs mb-0.5" style={{ color: isLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)' }}>Build your own free online store in 5 minutes</p>
                <p className="text-xs mb-4" style={{ color: isLight ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)' }}>
                  A product of{' '}
                  <a href="https://intelsystechnology.com" target="_blank" rel="noopener noreferrer"
                     className="font-semibold transition-opacity hover:opacity-80" style={{ color: isLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)' }}>
                    IntelSys Technologies
                  </a>
                </p>
                <div className="flex gap-2 justify-center flex-wrap">
                  <Link href="/onboarding"
                    className="inline-block font-bold text-sm px-6 py-2.5 rounded-xl transition-opacity hover:opacity-90"
                    style={{ backgroundColor: isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.15)', color: onBg }}>
                    Start Free — earket.com
                  </Link>
                  <button onClick={() => setFeedbackOpen(true)}
                    className="inline-block font-semibold text-sm px-5 py-2.5 rounded-xl transition-opacity hover:opacity-90"
                    style={{ backgroundColor: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)', color: isLight ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)' }}>
                    Leave Feedback
                  </button>
                </div>
              </>
            )
          })()}
        </div>
      </div>
    </div>
  )
}

