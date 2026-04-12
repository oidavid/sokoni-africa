'use client'
import Link from 'next/link'

interface StorefrontFooterProps {
  store: {
    business_name: string
    slug: string
    whatsapp_number?: string | null
  }
  themeColor: string
  contrast: string
  isLight: boolean
  contextType?: 'order' | 'booking' // controls "Need help" copy
  onFeedback?: () => void
}

const WA_SVG = (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#25D366]">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.858L.057 23.5l5.797-1.52A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.001-1.371l-.36-.214-3.724.977.995-3.63-.234-.374A9.818 9.818 0 1 1 12 21.818z" />
  </svg>
)

const SHIELD_SVG = (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

export default function StorefrontFooter({
  store,
  themeColor,
  contrast,
  isLight,
  contextType = 'order',
  onFeedback,
}: StorefrontFooterProps) {
  const waNumber = store.whatsapp_number?.replace(/\D/g, '')
  const isBooking = contextType === 'booking'

  const directMsg = encodeURIComponent(
    isBooking
      ? `Hi ${store.business_name}! I have a question about my booking.`
      : `Hi ${store.business_name}! I have a question about my order from your Earket store.`
  )

  const escalateMsg = encodeURIComponent(
    isBooking
      ? `Hi Earket, I need help with a booking from ${store.business_name} (earket.com/store/${store.slug}). The provider has not resolved my issue.`
      : `Hi Earket, I need help with an order from ${store.business_name} (earket.com/store/${store.slug}). The seller has not resolved my issue.`
  )

  const contactLabel = isBooking ? 'Message the provider directly on WhatsApp' : 'Message the seller directly on WhatsApp'
  const helpTitle = isBooking ? 'Need help with your booking?' : 'Need help with your order?'
  const helpSubtitle = isBooking
    ? 'Start by contacting the provider directly — most issues are resolved quickly on WhatsApp.'
    : 'Start by contacting the seller directly — most issues are resolved quickly on WhatsApp.'
  const escalateNote = isBooking
    ? "Only if the provider hasn't responded after 48–72 hrs"
    : "Only if the seller hasn't responded after 48–72 hrs"

  return (
    <>
      {/* Need help section */}
      <div className="max-w-3xl mx-auto px-4 mb-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-display font-bold text-brand-dark text-base mb-1">{helpTitle}</h2>
          <p className="text-xs text-gray-400 mb-4">{helpSubtitle}</p>
          <div className="space-y-2">
            {/* Primary — contact merchant */}
            <a
              href={`https://wa.me/${waNumber}?text=${directMsg}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#25D366]/5 hover:bg-[#25D366]/10 border border-[#25D366]/20 rounded-xl p-3.5 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-[#25D366]/10 flex items-center justify-center shrink-0">
                {WA_SVG}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Contact {store.business_name}</p>
                <p className="text-xs text-gray-400">{contactLabel}</p>
              </div>
            </a>

            {/* Secondary — escalate to Earket */}
            <a
              href={`https://wa.me/14793219433?text=${escalateMsg}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 hover:bg-gray-50 rounded-xl p-3 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                {SHIELD_SVG}
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400">
                  Still unresolved? <span className="text-brand-green">Escalate to Earket</span>
                </p>
                <p className="text-xs text-gray-300">{escalateNote}</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Viral footer */}
      <div className="max-w-3xl mx-auto px-4 py-6 text-center">
        <div className="rounded-2xl p-5" style={{ backgroundColor: themeColor }}>
          <p className="text-xs mb-1" style={{ color: contrast, opacity: 0.5 }}>Powered by</p>
          <Link
            href="/"
            className="font-display font-bold text-lg mb-1 inline-block transition-opacity hover:opacity-80"
            style={{ color: contrast }}
          >
            Earket
          </Link>
          <p className="text-xs mb-0.5" style={{ color: contrast, opacity: 0.55 }}>
            Build your own free business page in 5 minutes
          </p>
          <p className="text-xs mb-4" style={{ color: contrast, opacity: 0.35 }}>
            A product of{' '}
            <a
              href="https://intelsystechnology.com"
              target="_blank" rel="noopener noreferrer"
              className="font-semibold transition-opacity hover:opacity-70"
              style={{ color: contrast }}
            >
              IntelSys Technologies
            </a>
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Link
              href="/onboarding"
              className="inline-block font-bold text-sm px-6 py-2.5 rounded-xl transition-opacity hover:opacity-90"
              style={{ backgroundColor: isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.15)', color: contrast }}
            >
              Start Free — Earket.com
            </Link>
            {onFeedback && (
              <button
                onClick={onFeedback}
                className="inline-block font-semibold text-sm px-5 py-2.5 rounded-xl transition-opacity hover:opacity-90"
                style={{ backgroundColor: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)', color: contrast, opacity: 0.8 }}
              >
                Leave Feedback
              </button>
            )}
            <Link
              href="/browse"
              className="inline-block font-medium text-sm px-5 py-2.5 rounded-xl transition-opacity hover:opacity-90"
              style={{ backgroundColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)', color: contrast, opacity: 0.6 }}
            >
              Explore Earket
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
