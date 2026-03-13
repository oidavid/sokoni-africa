'use client'
import { useState } from 'react'
import { Search, ShoppingBag, MapPin, Phone, Share2, Star } from 'lucide-react'

// Demo data - in production this comes from Supabase based on slug
const DEMO_STORE = {
  name: "Tropical Market",
  slug: "tropical-market",
  description: "Fresh African groceries & food items delivered to your door. Yam, plantain, palm oil, crayfish, ogiri and more. Lagos delivery available.",
  location: "Lagos, Nigeria",
  whatsapp: "+2348012345678",
  category: "food",
  products: [
    { id: 1, name: "Pounded Yam Flour (5kg)", price: 4500, emoji: "🟡", inStock: true, description: "Premium pounded yam flour. Smooth, tasty and quick to prepare. Perfect for owambe and everyday meals." },
    { id: 2, name: "Fresh Plantain (bunch)", price: 2800, emoji: "🍌", inStock: true, description: "Ripe and unripe plantain available. Sweet, fresh and locally sourced. Great for dodo, boli and porridge." },
    { id: 3, name: "Palm Oil (4 litres)", price: 5200, emoji: "🟠", inStock: true, description: "Pure red palm oil, locally processed. Rich colour and flavour for all your soups and stews." },
    { id: 4, name: "Dried Crayfish (500g)", price: 3800, emoji: "🦐", inStock: true, description: "High-quality dried crayfish, well-processed and clean. Adds authentic flavour to egusi, ogbono and all Nigerian soups." },
    { id: 5, name: "Egusi (Melon) Seeds 1kg", price: 4200, emoji: "🥣", inStock: true, description: "Fresh, well-dried egusi seeds. Ground or whole available. Perfect for egusi soup and other traditional dishes." },
    { id: 6, name: "Ogiri Seasoning (wrap)", price: 1500, emoji: "🫙", inStock: true, description: "Traditional ogiri seasoning, freshly made. Gives that deep, rich flavour to your egusi, ofe onugbu and bitterleaf soup." },
    { id: 7, name: "Dried Stockfish (medium)", price: 6500, emoji: "🐟", inStock: true, description: "Quality Norwegian stockfish, well-dried and odour-free. Tender when soaked. Perfect for ofe oha, bitterleaf and pepper soup." },
    { id: 8, name: "Uziza Leaves (fresh, bunch)", price: 800, emoji: "🌿", inStock: false, description: "Fresh uziza leaves for pepper soup and ofe onugbu. Currently out of stock — message us to be notified." },
  ]
}

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString()}`
}

function WhatsAppOrderBtn({ product, store }: { product: typeof DEMO_STORE.products[0], store: typeof DEMO_STORE }) {
  const message = encodeURIComponent(
    `Hi! I saw your Sokoni store and I want to order:\n\n*${product.name}* - ${formatNaira(product.price)}\n\nPlease confirm if available. Thank you!`
  )
  return (
    <a
      href={`https://wa.me/${store.whatsapp.replace(/\D/g, '')}?text=${message}`}
      target="_blank" rel="noreferrer"
      className="btn-whatsapp w-full justify-center text-sm"
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
      Order on WhatsApp
    </a>
  )
}

export default function StorefrontPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'instock'>('all')
  const store = DEMO_STORE

  const filtered = store.products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || p.inStock
    return matchSearch && matchFilter
  })

  function shareStore() {
    if (navigator.share) {
      navigator.share({ title: store.name, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-lg mx-auto">
      {/* Store Header */}
      <div className="bg-brand-green text-white">
        <div className="px-4 pt-5 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                👗
              </div>
              <div>
                <h1 className="font-display font-bold text-lg leading-tight">{store.name}</h1>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={11} className="opacity-75" />
                  <span className="text-xs opacity-75">{store.location}</span>
                </div>
              </div>
            </div>
            <button onClick={shareStore} className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20">
              <Share2 size={16} />
            </button>
          </div>
          <p className="text-sm text-white/80 mt-3">{store.description}</p>

          {/* Stats row */}
          <div className="flex gap-4 mt-4 pb-1">
            <div className="text-center">
              <div className="font-display font-bold text-xl">{store.products.length}</div>
              <div className="text-xs opacity-60">Products</div>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <div className="font-display font-bold text-xl">{store.products.filter(p => p.inStock).length}</div>
              <div className="text-xs opacity-60">In Stock</div>
            </div>
            <div className="w-px bg-white/20" />
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-brand-accent text-brand-accent" />
              <div className="font-display font-bold text-xl">4.9</div>
              <div className="text-xs opacity-60">(42)</div>
            </div>
          </div>
        </div>

        {/* WhatsApp contact strip */}
        <a href={`https://wa.me/${store.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
          className="flex items-center justify-center gap-2 bg-[#25D366] py-3 text-sm font-semibold">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          Chat with {store.name}
        </a>
      </div>

      {/* Search & Filter */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <div className="relative mb-2">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-100 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-brand-green/20 border border-transparent focus:border-brand-green/30"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'instock'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === f ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-500'
              }`}>
              {f === 'all' ? 'All Products' : '✅ In Stock'}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-400 self-center">{filtered.length} items</span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4 grid grid-cols-2 gap-3">
        {filtered.map(product => (
          <div key={product.id} className={`storefront-card ${!product.inStock ? 'opacity-60' : ''}`}>
            {/* Product image placeholder */}
            <div className="bg-brand-light h-32 flex items-center justify-center text-5xl relative">
              {product.emoji}
              {!product.inStock && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">Out of Stock</span>
                </div>
              )}
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-gray-800 text-xs leading-tight mb-1 line-clamp-2">{product.name}</h3>
              <p className="text-brand-green font-display font-bold text-base mb-2">{formatNaira(product.price)}</p>
              {product.inStock ? (
                <WhatsAppOrderBtn product={product} store={store} />
              ) : (
                <button disabled className="w-full bg-gray-100 text-gray-400 text-xs font-semibold py-2.5 rounded-xl cursor-not-allowed">
                  Out of Stock
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 px-4">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gray-500 text-sm">No products found for "{search}"</p>
        </div>
      )}

      {/* Footer */}
      <div className="text-center py-6 px-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 mb-1">Powered by</p>
        <a href="/" className="text-brand-green font-display font-bold text-sm">Sokoni Africa 🛒</a>
        <p className="text-xs text-gray-400 mt-1">Build your free store at sokoni.africa</p>
      </div>
    </div>
  )
}
