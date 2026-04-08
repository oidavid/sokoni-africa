'use client'
import { useEffect, useState } from 'react'
import { Star, MessageSquare, TrendingUp, User } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Review {
  id: string
  rating: number
  message: string | null
  customer_name: string | null
  anonymous: boolean
  created_at: string
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [merchantSlug, setMerchantSlug] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      const fallbackEmail = typeof window !== 'undefined'
        ? localStorage.getItem('earket_merchant_email') : null
      const email = user?.email || fallbackEmail
      if (!email) return

      const { data: m } = await supabase
        .from('merchants')
        .select('slug')
        .eq('email', email)
        .single()
      if (!m) return
      setMerchantSlug(m.slug)

      // Read from both tables — new reviews in store_reviews, legacy in feedback
      const [{ data: newReviews }, { data: legacyReviews }] = await Promise.all([
        supabase.from('store_reviews').select('*').eq('merchant_slug', m.slug).order('created_at', { ascending: false }),
        supabase.from('feedback').select('*').eq('merchant_slug', m.slug).order('created_at', { ascending: false }),
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

  const avgRating = reviews.length
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
    : null

  const distribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct: reviews.length
      ? Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100)
      : 0,
  }))

  function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(n => (
          <Star
            key={n}
            size={size === 'lg' ? 22 : 14}
            className={n <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
          />
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

      {/* Header */}
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
            When customers visit your store and leave a rating, it will appear here.
            Share your store link to get your first review.
          </p>
          {merchantSlug && (
            <a
              href={`/store/${merchantSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-brand-green bg-brand-light px-4 py-2 rounded-xl hover:bg-brand-green hover:text-white transition-colors"
            >
              View your store →
            </a>
          )}
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center">
              <div className="text-3xl font-display font-bold text-brand-dark mb-1">
                {avgRating}
              </div>
              <Stars rating={Math.round(avgRating!)} size="sm" />
              <p className="text-xs text-gray-400 mt-1">Average rating</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center">
              <div className="text-3xl font-display font-bold text-brand-dark mb-1">
                {reviews.length}
              </div>
              <p className="text-xs text-gray-400 mt-1">Total reviews</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center">
              <div className="text-3xl font-display font-bold text-brand-dark mb-1">
                {distribution[0].count}
              </div>
              <p className="text-xs text-gray-400 mt-1">5-star reviews</p>
            </div>
          </div>

          {/* Rating distribution */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">Rating breakdown</p>
            <div className="space-y-2">
              {distribution.map(d => (
                <div key={d.star} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-14 shrink-0">
                    <span className="text-xs text-gray-500">{d.star}</span>
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-amber-400 h-2 rounded-full transition-all"
                      style={{ width: `${d.pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-8 text-right shrink-0">{d.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual reviews */}
          <div className="space-y-3">
            {reviews.map(review => (
              <div key={review.id} className="bg-white border border-gray-100 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center shrink-0">
                      <User size={14} className="text-brand-green" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {review.anonymous || !review.customer_name
                          ? 'Anonymous customer'
                          : review.customer_name}
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
                  <p className="text-sm text-gray-600 leading-relaxed pl-10">
                    {review.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
