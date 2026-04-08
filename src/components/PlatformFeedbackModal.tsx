'use client'
import { useState } from 'react'
import { X, Star, Send, Check, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Props {
  merchantId: string
  merchantSlug: string
  businessName: string
  onClose: () => void
}

export default function PlatformFeedbackModal({
  merchantId, merchantSlug, businessName, onClose
}: Props) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  async function submit() {
    if (!rating) return
    setSending(true)
    try {
      await supabase.from('platform_feedback').insert({
        merchant_id: merchantId,
        merchant_slug: merchantSlug,
        business_name: businessName,
        rating,
        message: message.trim() || null,
      })
    } catch {}
    setSent(true)
    setSending(false)
    setTimeout(onClose, 2200)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {sent ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-3">
              <Check size={24} className="text-brand-green" />
            </div>
            <p className="font-bold text-gray-900 text-lg mb-1">Thank you!</p>
            <p className="text-sm text-gray-500">Your feedback helps us make Earket better for everyone.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-gray-900 text-base">How is Earket working for you?</h3>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X size={13} />
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-5">
              Your honest feedback helps us improve the platform.
            </p>

            {/* Star rating */}
            <div className="flex justify-center gap-2 mb-5">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHovered(n)}
                  onMouseLeave={() => setHovered(0)}
                  className="transition-transform hover:scale-125"
                >
                  <Star
                    size={32}
                    className={
                      n <= (hovered || rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-200 fill-gray-200'
                    }
                  />
                </button>
              ))}
            </div>

            {/* Rating label */}
            {(hovered || rating) > 0 && (
              <p className="text-center text-xs font-medium text-gray-500 -mt-3 mb-4">
                {['', 'Needs improvement', 'Below expectations', 'It\'s okay', 'Pretty good', 'Love it!'][hovered || rating]}
              </p>
            )}

            {/* Message */}
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Tell us what you love or what we can improve..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green mb-4"
            />

            {/* Submit */}
            <button
              onClick={submit}
              disabled={!rating || sending}
              className="w-full bg-brand-green text-white font-semibold text-sm py-3 rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {sending ? (
                <><Loader2 size={15} className="animate-spin" /> Sending...</>
              ) : (
                <><Send size={15} /> Send Feedback</>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
