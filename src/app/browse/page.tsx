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
  { label: 'Food & Groceries', values: ['food', 'groceries', 'food_catering', 'food & groceries', 'agriculture'] },
  { label: 'Fashion & Clothing', values: ['fashion', 'clothing', 'fashion & clothing', 'shoes', 'cosmetics'] },
  { label: 'Beauty & Hair', values: ['beauty', 'beauty_services', 'hair_salon', 'beauty & hair'] },
  { label: 'Electronics', values: ['electronics', 'phones', 'gadgets', 'digital_services'] },
  { label: 'Home & Services', values: ['home_services', 'furniture', 'domestic', 'home', 'art_crafts'] },
  { label: 'Health & Wellness', values: ['health', 'health_wellness', 'baby_kids'] },
  { label: 'Auto & Transport', values: ['automobile', 'auto_services', 'auto', 'transport'] },
  { label: 'Education', values: ['education', 'coaching', 'tutoring', 'stationery'] },
  { label: 'Other', values: ['other'] },
]

export default function BrowsePage() {
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [showFilters, setShowFilters] = useState(true)
  const [page, setPage] = useState(1)
  const PER_PAGE = 30

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
    setPage(1)
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
  const totalPages = Math.max(1, Math.ceil(regular.length / PER_PAGE))
  const paginatedRegular = regular.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  function MerchantCard({ m }: { m: Merchant }) {
    const color = m.theme_color || '#1A7A4A'
    const initials = m.business_name?.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
    return (
      <Link href={`/store/${m.slug}`}
        className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all group">
        <div className="h-16 relative" style={{ backgroundColor: color + '18' }}>
          {m.is_featured && (
            <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-amber-900">
              ⭐ Featured
            </span>
          )}
        </div>
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
            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-2">{m.description}</p>
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

      {/* ── FULL SITE HEADER ── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="font-display font-bold text-brand-dark text-xl tracking-tight group-hover:text-brand-green transition-colors">
              Earket
            </span>
            <span className="hidden sm:inline-flex text-xs font-semibold text-brand-green bg-brand-light border border-brand-green/20 px-2.5 py-0.5 rounded-full">
              Free Forever
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/#how-it-works" className="text-sm font-medium text-gray-500 hover:text-brand-green transition-colors">How It Works</Link>
            <Link href="/browse" className="text-sm font-medium text-brand-green border-b-2 border-brand-green pb-0.5">Browse Stores</Link>
            <Link href="/#features" className="text-sm font-medium text-gray-500 hover:text-brand-green transition-colors">Features</Link>
            <Link href="/about" className="text-sm font-medium text-gray-500 hover:text-brand-green transition-colors">About</Link>
          </div>
          <div className="flex items-center gap-2.5">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-brand-green transition-colors px-1">Login</Link>
            <Link href="/onboarding"
              className="bg-brand-green text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-brand-dark transition-all active:scale-95 shadow-md shadow-brand-green/20">
              Start Free →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO STRIP ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="font-display font-bold text-2xl text-brand-dark mb-1">Discover businesses on Earket</h1>
          <p className="text-sm text-gray-500">Browse {merchants.length > 0 ? `${merchants.length}+` : ''} businesses across Nigeria and beyond — products, services, and more.</p>
        </div>
      </div>

      {/* ── SEARCH + FILTER BAR ── */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by city, store name, or type of business..."
              className="w-full pl-8 pr-8 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-brand-green bg-gray-50" />
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
        {showFilters && (
          <div className="max-w-5xl mx-auto px-4 pb-3">
            <div className="flex gap-2 overflow-x-auto pb-1">
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

      {/* ── CONTENT ── */}
      <div className="max-w-5xl mx-auto px-4 py-6">
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
            {featured.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-3">⭐ Featured Stores</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {featured.map(m => <MerchantCard key={m.id} m={m} />)}
                </div>
              </div>
            )}
            {regular.length > 0 && (
              <div>
                {featured.length > 0 && (
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">All Stores</p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {paginatedRegular.map(m => <MerchantCard key={m.id} m={m} />)}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                    <button onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                      disabled={page === 1}
                      className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-brand-green disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-4 py-2 rounded-xl border border-gray-200 hover:border-brand-green/50 bg-white">
                      ← Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                        .reduce<(number | string)[]>((acc, p, i, arr) => {
                          if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push('ellipsis-' + p)
                          acc.push(p)
                          return acc
                        }, [])
                        .map(p =>
                          typeof p === 'string' ? (
                            <span key={p} className="text-xs text-gray-400 px-1">…</span>
                          ) : (
                            <button key={p} onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                              className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${page === p ? 'bg-brand-green text-white' : 'text-gray-500 hover:bg-gray-100 bg-white border border-gray-200'}`}>
                              {p}
                            </button>
                          )
                        )}
                    </div>
                    <button onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                      disabled={page === totalPages}
                      className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-brand-green disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-4 py-2 rounded-xl border border-gray-200 hover:border-brand-green/50 bg-white">
                      Next →
                    </button>
                  </div>
                )}

                <p className="text-xs text-gray-400 text-center mt-3">
                  Showing {Math.min((page - 1) * PER_PAGE + 1, regular.length)}–{Math.min(page * PER_PAGE, regular.length)} of {regular.length} stores
                  {(search || category !== 'All') ? ` (filtered from ${merchants.length} total)` : ''}
                </p>
              </div>
            )}
          </>
        )}

        {!loading && filtered.length > 0 && (
          <div className="mt-12 text-center bg-white border border-gray-100 rounded-2xl p-8">
            <h2 className="font-display font-bold text-brand-dark text-lg mb-2">Sell on Earket — It's Free</h2>
            <p className="text-sm text-gray-500 mb-4">Join {merchants.length}+ businesses already selling on Earket</p>
            <Link href="/onboarding"
              className="inline-flex items-center gap-2 bg-brand-green text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-brand-dark transition-colors">
              Start your free store →
            </Link>
          </div>
        )}
      </div>

      {/* ── FULL SITE FOOTER ── */}
      <footer className="bg-brand-dark text-white mt-12">
        <div className="max-w-5xl mx-auto px-4 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
              <div className="text-2xl font-display font-bold text-white tracking-tight mb-2">Earket</div>
              <p className="text-white/45 text-sm leading-relaxed mb-5 max-w-xs">
                The fastest way for any business, anywhere in the world, to get online. Free forever. AI-powered. Live in minutes.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/30">A product of</span>
                <a href="https://intelsystechnology.com" target="_blank" rel="noopener noreferrer"
                   className="text-xs font-bold text-white/55 hover:text-white transition-colors tracking-wide uppercase">
                  IntelSys Technologies
                </a>
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-white/25 uppercase tracking-widest mb-4">Product</div>
              <ul className="space-y-3">
                <li><Link href="/onboarding" className="text-sm text-white/50 hover:text-white transition-colors">Start Free</Link></li>
                <li><Link href="/browse" className="text-sm text-white font-medium">Browse Stores</Link></li>
                <li><Link href="/login" className="text-sm text-white/50 hover:text-white transition-colors">Login</Link></li>
                <li><Link href="/dashboard" className="text-sm text-white/50 hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <div className="text-xs font-bold text-white/25 uppercase tracking-widest mb-4">Company</div>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-sm text-white/50 hover:text-white transition-colors">About Earket</Link></li>
                <li><a href="https://intelsystechnology.com" target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 hover:text-white transition-colors">IntelSys Technologies</a></li>
                <li><Link href="/contact" className="text-sm text-white/50 hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/privacy" className="text-sm text-white/50 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-sm text-white/50 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-white/8">
          <div className="max-w-5xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/22">© 2025 IntelSys Technologies. All rights reserved.</p>
            <div className="flex items-center gap-3 text-xs text-white/18">
              <span>AI-Powered</span><span className="text-white/10">·</span>
              <span>Free Forever</span><span className="text-white/10">·</span>
              <span>134 Countries</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
