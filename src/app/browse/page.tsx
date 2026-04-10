'use client'
import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, MapPin, ShoppingBag, X, SlidersHorizontal } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Merchant {
  id: string
  business_name: string
  slug: string
  description: string
  location: string
  category: string
  logo_url: string | null
  theme_color: string
  business_type?: string
  country?: string
  is_featured?: boolean
}

const CATEGORIES: { label: string; values: string[] }[] = [
  { label: 'All', values: [] },
  { label: 'Food & Groceries', values: ['food', 'groceries', 'food_catering', 'food & groceries', 'food and groceries', 'agriculture'] },
  { label: 'Fashion & Clothing', values: ['fashion', 'clothing', 'fashion & clothing', 'shoes', 'cosmetics'] },
  { label: 'Beauty & Hair', values: ['beauty', 'beauty_services', 'hair_salon', 'beauty & hair', 'beauty and hair'] },
  { label: 'Electronics', values: ['electronics', 'phones', 'gadgets', 'digital_services'] },
  { label: 'Home & Services', values: ['home_services', 'furniture', 'domestic', 'home', 'home & garden', 'art_crafts'] },
  { label: 'Health & Wellness', values: ['health', 'health_wellness', 'health & wellness', 'baby_kids'] },
  { label: 'Auto & Transport', values: ['automobile', 'auto_services', 'auto', 'automotive', 'transport'] },
  { label: 'Education', values: ['education', 'coaching', 'tutoring', 'stationery'] },
  { label: 'Other', values: ['other'] },
]

export default function BrowsePage() {
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('merchants')
        .select('id,business_name,slug,description,location,category,logo_url,theme_color,business_type,country,is_featured')
        .eq('is_published', true)
        .not('status', 'in', '("suspended","terminated","deleted")')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })
      setMerchants(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    let result = [...merchants]
    if (category !== 'All') {
      const cat = CATEGORIES.find(c => c.label === category)
      if (cat && cat.values.length > 0) {
        result = result.filter(m =>
          cat.values.some(v => m.category?.toLowerCase() === v.toLowerCase())
        )
      }
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(m =>
        m.business_name?.toLowerCase().includes(q) ||
        m.description?.toLowerCase().includes(q) ||
        m.location?.toLowerCase().includes(q) ||
        m.category?.toLowerCase().includes(q)
      )
    }
    return result
  }, [merchants, search, category])

  const featured = filtered.filter(m => m.is_featured)
  const regular = filtered.filter(m => !m.is_featured)

  function MerchantCard({ m }: { m: Merchant }) {
    const color = m.theme_color || '#1A7A4A'
    const initials = m.business_name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    return (
      <Link href={`/store/${m.slug}`}
        className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all group">
        {/* Header band */}
        <div className="h-16 relative" style={{ backgroundColor: color + '18' }}>
          {m.is_featured && (
            <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-amber-900">
              ⭐ Featured
            </span>
          )}
        </div>
        {/* Logo */}
        <div className="px-4 -mt-7 mb-3">
          {m.logo_url ? (
            <img src={m.logo_url} alt={m.business_name}
              className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-sm" />
          ) : (
            <div className="w-14 h-14 rounded-xl border-2 border-white shadow-sm flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: color }}>
              {initials}
            </div>
          )}
        </div>
        <div className="px-4 pb-4">
          <h3 className="font-display font-bold text-brand-dark text-sm leading-tight mb-0.5 group-hover:text-brand-green transition-colors">
            {m.business_name}
          </h3>
          {m.category && (
            <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-1.5"
              style={{ backgroundColor: color + '15', color }}>
              {m.category}
            </span>
          )}
          {m.description && (
            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-2">
              {m.description}
            </p>
          )}
          {m.location && (
            <div className="flex items-center gap-1">
              <MapPin size={10} className="text-gray-300 shrink-0" />
              <span className="text-xs text-gray-400 truncate">{m.location}</span>
            </div>
          )}
        </div>
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="font-display font-bold text-brand-dark text-lg shrink-0">
            Earket
          </Link>
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search stores, products, services, locations..."
              className="w-full pl-8 pr-8 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-brand-green bg-gray-50"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <X size={13} />
              </button>
            )}
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl border transition-colors shrink-0 ${
              showFilters || category !== 'All'
                ? 'bg-brand-light border-brand-green/30 text-brand-green'
                : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }`}>
            <SlidersHorizontal size={14} />
            Filter
            {category !== 'All' && <span className="w-1.5 h-1.5 bg-brand-green rounded-full" />}
          </button>
        </div>

        {/* Category pills */}
        {showFilters && (
          <div className="max-w-6xl mx-auto px-4 pb-3">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {CATEGORIES.map(cat => (
                <button key={cat.label} onClick={() => setCategory(cat.label)}
                  className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                    category === cat.label
                      ? 'bg-brand-green text-white border-brand-green'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-brand-green/50'
                  }`}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Result count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            {loading ? 'Finding stores...' : (
              <>
                <span className="font-semibold text-gray-800">{filtered.length}</span> store{filtered.length !== 1 ? 's' : ''}
                {category !== 'All' && <> in <span className="text-brand-green font-medium">{category}</span></>}
                {search && <> matching <span className="text-brand-green font-medium">"{search}"</span></>}
              </>
            )}
          </p>
          {(search || category !== 'All') && (
            <button onClick={() => { setSearch(''); setCategory('All') }}
              className="text-xs text-gray-400 hover:text-brand-green transition-colors">
              Clear filters ×
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-16 bg-gray-100" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                  <div className="h-2 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={24} className="text-gray-300" />
            </div>
            <p className="font-semibold text-gray-700 mb-1">No stores found</p>
            <p className="text-sm text-gray-400 mb-4">Try a different search or category</p>
            <button onClick={() => { setSearch(''); setCategory('All') }}
              className="text-sm text-brand-green font-medium hover:underline">
              Show all stores
            </button>
          </div>
        ) : (
          <>
            {/* Featured section */}
            {featured.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-3">⭐ Featured Stores</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {featured.map(m => <MerchantCard key={m.id} m={m} />)}
                </div>
              </div>
            )}

            {/* All stores */}
            {regular.length > 0 && (
              <div>
                {featured.length > 0 && (
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">All Stores</p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {regular.map(m => <MerchantCard key={m.id} m={m} />)}
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer CTA */}
        {!loading && filtered.length > 0 && (
          <div className="mt-12 text-center bg-white border border-gray-100 rounded-2xl p-8">
            <h2 className="font-display font-bold text-brand-dark text-lg mb-2">
              Sell on Earket — It's Free
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Join {merchants.length}+ businesses already selling on Earket
            </p>
            <Link href="/onboarding"
              className="inline-flex items-center gap-2 bg-brand-green text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-brand-dark transition-colors">
              Start your free store →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
