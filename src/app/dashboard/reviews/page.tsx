'use client'
import { useEffect, useState, useMemo } from 'react'
import { Star, MessageSquare, User, Search, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Review {
  id: string
  rating: number
  message: string | null
  customer_name: string | null
  anonymous: boolean
  created_at: string
}

const PER_PAGE = 10

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [merchantSlug, setMerchantSlug] = useState<string | null>(null)
  const [starFilter, setStarFilter] = useState<number | null>(null)
  const [sort, setSort] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      const fallbackEmail = typeof window !== 'undefined'
        ? localStorage.getItem('earket_merchant_email') : null
      const email = user?.email || fallbackEmail
      if (!email) return
      const { data: m } = await supabase
        .from('merchants').select('slug').eq('email', email).single()
      if (!m) return
      setMerchantSlug(m.slug)
      const [{ data: newReviews }, { data: legacyReviews }] = await Promise.all([
        supabase.from('store_reviews').select('*').eq('merchant_slug', m.slug),
        supabase.from('feedback').select('*').eq('merchant_slug', m.slug),
      ])
      const combined = [
        ...(newReviews || []),
        ...(legacyReviews || []),
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      setReviews(combined)
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => { setPage(1) }, [starFilter, sort, search])

  const avgRating = reviews.length
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
    : null

  const distribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct: reviews.length
      ? Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100) : 0,
  }))

  const filtered = useMemo(() => {
    let result = [...reviews]
    if (starFilter) result = result.filter(r => r.rating === starFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(r =>
        r.message?.toLowerCase().includes(q) ||
        r.customer_name?.toLowerCase().includes(q)
      )
    }
    switch (sort) {
      case 'oldest':  result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()); break
      case 'highest': result.sort((a, b) => b.rating - a.rating); break
      case 'lowest':  result.sort((a, b) => a.rating - b.rating); break
      default:        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }
    return result
  }, [reviews, starFilter, search, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const hasFilters = !!starFilter || !!search.trim()

  function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(n => (
          <Star key={n} size={size === 'lg' ? 20 : 13}
            className={n <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[200px]">
        <div className="w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">

      <div className="mb-6">
        <h1 className="font-display font-bold text-brand-dark text-xl mb-1">Customer Reviews</h1>
        <p className="text-sm text-gray-500">What customers are saying about your store</p>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center">
          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={24} className="text-gray-300" />
          </div>
          <p className="font-semibold text-gray-700 mb-1">No reviews yet</p>
          <p className="text-sm text-gray-400 max-w-xs mx-auto">
            When customers visit your store and leave a rating it will appear here.
            Share your store link to get your first review.
          </p>
          {merchantSlug && (
            <a href={`/store/${merchantSlug}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-brand-green bg-brand-light px-4 py-2 rounded-xl hover:bg-brand-green hover:text-white transition-colors">
              View your store →
            </a>
          )}
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center">
              <div className="text-3xl font-display font-bold text-brand-dark mb-1">{avgRating}</div>
              <Stars rating={Math.round(avgRating!)} />
              <p className="text-xs text-gray-400 mt-1">Average rating</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center">
              <div className="text-3xl font-display font-bold text-brand-dark mb-1">{reviews.length}</div>
              <p className="text-xs text-gray-400 mt-1">Total reviews</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center">
              <div className="text-3xl font-display font-bold text-brand-dark mb-1">{distribution[0].count}</div>
              <p className="text-xs text-gray-400 mt-1">5-star reviews</p>
            </div>
          </div>

          {/* Clickable distribution bars */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-5">
            <p className="text-sm font-semibold text-gray-700 mb-3">Rating breakdown — tap to filter</p>
            <div className="space-y-2">
              {distribution.map(d => (
                <button key={d.star} onClick={() => setStarFilter(starFilter === d.star ? null : d.star)}
                  className={`w-full flex items-center gap-3 transition-opacity rounded-lg px-1 py-0.5 ${starFilter && starFilter !== d.star ? 'opacity-35' : 'hover:bg-gray-50'}`}>
                  <div className={`flex items-center gap-1 w-10 shrink-0 ${starFilter === d.star ? 'text-amber-600 font-semibold' : 'text-gray-500'}`}>
                    <span className="text-xs">{d.star}</span>
                    <Star size={11} className="text-amber-400 fill-amber-400" />
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all ${starFilter === d.star ? 'bg-amber-500' : 'bg-amber-400'}`}
                      style={{ width: `${d.pct}%` }} />
                  </div>
                  <span className="text-xs text-gray-400 w-6 text-right shrink-0">{d.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Search + sort */}
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or message..."
                className="w-full pl-8 pr-8 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-brand-green" />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={13} />
                </button>
              )}
            </div>
            <select value={sort} onChange={e => setSort(e.target.value as typeof sort)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-brand-green bg-white text-gray-600 shrink-0">
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="highest">Highest rated</option>
              <option value="lowest">Lowest rated</option>
            </select>
          </div>

          {/* Active filter pills */}
          {hasFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {starFilter && (
                <span className="flex items-center gap-1.5 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-medium">
                  {starFilter}★ only
                  <button onClick={() => setStarFilter(null)}><X size={11} /></button>
                </span>
              )}
              {search.trim() && (
                <span className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full font-medium">
                  "{search}"
                  <button onClick={() => setSearch('')}><X size={11} /></button>
                </span>
              )}
              <span className="text-xs text-gray-400">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
              <button onClick={() => { setStarFilter(null); setSearch('') }}
                className="text-xs text-gray-400 hover:text-gray-600 underline ml-1">
                Clear all
              </button>
            </div>
          )}

          {/* Review list */}
          {paginated.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
              <p className="text-sm text-gray-400">No reviews match your filter.</p>
              <button onClick={() => { setStarFilter(null); setSearch('') }}
                className="mt-2 text-sm text-brand-green hover:underline">Clear filters</button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {paginated.map(review => (
                <div key={review.id} className="bg-white border border-gray-100 rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center shrink-0">
                        <User size={14} className="text-brand-green" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {review.anonymous || !review.customer_name ? 'Anonymous customer' : review.customer_name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(review.created_at).toLocaleDateString('en-GB', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <Stars rating={review.rating} />
                  </div>
                  {review.message && (
                    <p className="text-sm text-gray-600 leading-relaxed pl-10">{review.message}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-brand-green disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft size={16} /> Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | string)[]>((acc, p, i, arr) => {
                    if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push('ellipsis-' + p)
                    acc.push(p)
                    return acc
                  }, [])
                  .map((p) =>
                    typeof p === 'string' ? (
                      <span key={p} className="text-xs text-gray-400 px-1">…</span>
                    ) : (
                      <button key={p} onClick={() => setPage(p)}
                        className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${page === p ? 'bg-brand-green text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                        {p}
                      </button>
                    )
                  )}
              </div>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-brand-green disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}

          <p className="text-xs text-gray-400 text-center mt-3">
            Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} review{filtered.length !== 1 ? 's' : ''}
            {hasFilters ? ` (filtered from ${reviews.length} total)` : ''}
          </p>
        </>
      )}
    </div>
  )
}
