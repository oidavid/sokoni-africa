'use client'
import { useState } from 'react'
import { Check, Loader2, ExternalLink, Copy } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface SubdomainSettingsProps {
  merchantId: string
  merchantSlug: string
  merchantName: string
  merchantEmail: string
  merchantWhatsapp?: string
  currentSubdomain?: string | null
}

const RESERVED = ['www', 'app', 'api', 'admin', 'dashboard', 'earket', 'store',
  'help', 'support', 'blog', 'mail', 'smtp', 'pop', 'ftp', 'ssh']
const PRICE = '$25'
const PRICE_DESC = 'One-time payment · No monthly fees · Yours forever'
const SUPPORT_WA = '14793219433'
const SUPPORT_EMAIL = 'contact@intelsystechnology.com'

type Step = 'intro' | 'choose' | 'payment' | 'pending' | 'active'
type Availability = 'idle' | 'available' | 'taken' | 'invalid'

export default function SubdomainSettings({
  merchantId, merchantSlug, merchantName, merchantEmail,
  merchantWhatsapp, currentSubdomain,
}: SubdomainSettingsProps) {
  const [step, setStep] = useState<Step>(currentSubdomain ? 'active' : 'intro')
  const [subdomain, setSubdomain] = useState(currentSubdomain || '')
  const [checking, setChecking] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [availability, setAvailability] = useState<Availability>('idle')
  const [copied, setCopied] = useState(false)

  function validate(v: string): string | null {
    if (v.length < 3) return 'Minimum 3 characters'
    if (v.length > 30) return 'Maximum 30 characters'
    if (!/^[a-z0-9-]+$/.test(v)) return 'Only lowercase letters, numbers and hyphens'
    if (v.startsWith('-') || v.endsWith('-')) return 'Cannot start or end with a hyphen'
    if (RESERVED.includes(v)) return 'That name is reserved'
    return null
  }

  async function checkAvailability() {
    const val = subdomain.toLowerCase().trim()
    if (!val || validate(val)) { setAvailability('invalid'); return }
    setChecking(true); setAvailability('idle')
    const { data } = await supabase.from('merchants').select('id')
      .eq('subdomain', val).neq('id', merchantId).maybeSingle()
    setChecking(false)
    setAvailability(data ? 'taken' : 'available')
  }

  async function submitRequest() {
    if (availability !== 'available') return
    setSubmitting(true)
    try {
      await fetch('/api/subdomain/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchant_id: merchantId, merchant_name: merchantName,
          merchant_email: merchantEmail, merchant_whatsapp: merchantWhatsapp,
          subdomain: subdomain.toLowerCase().trim(),
        }),
      })
      setStep('payment')
    } catch {}
    setSubmitting(false)
  }

  function copyEmail() {
    navigator.clipboard.writeText(SUPPORT_EMAIL)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const waPaymentMsg = encodeURIComponent(
    `Hi, I'd like to claim *${subdomain}.earket.com* for my Earket store (${merchantName}). Please send me the payment link.`
  )
  const emailSubject = encodeURIComponent(`Subdomain Request — ${subdomain}.earket.com`)
  const emailBody = encodeURIComponent(
    `Hi,\n\nI'd like to claim the subdomain ${subdomain}.earket.com for my Earket store (${merchantName}).\n\nPlease send me a Paystack payment link.\n\nMerchant ID: ${merchantId}\nEmail: ${merchantEmail}`
  )

  // ── ACTIVE ─────────────────────────────────────────────────────────────
  if (step === 'active') return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center shrink-0">
          <span className="text-lg">⭐</span>
        </div>
        <div>
          <p className="font-display font-bold text-brand-dark text-sm">Earket Pro — Active</p>
          <p className="text-xs text-gray-400">Your branded subdomain is live</p>
        </div>
      </div>
      <div className="bg-brand-light rounded-xl p-4">
        <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">Your branded link</p>
        <a href={`https://${currentSubdomain}.earket.com`} target="_blank" rel="noreferrer"
          className="text-base font-bold text-brand-green hover:underline flex items-center gap-1.5">
          {currentSubdomain}.earket.com <ExternalLink size={14} />
        </a>
        <p className="text-xs text-gray-400 mt-2">Your original link earket.com/store/{merchantSlug} still works too</p>
      </div>
      <p className="text-xs text-gray-400 text-center">
        Need changes? Contact{' '}
        <a href={`https://wa.me/${SUPPORT_WA}`} target="_blank" rel="noreferrer" className="text-brand-green hover:underline">+1 479 321 9433</a>
      </p>
    </div>
  )

  // ── PENDING ────────────────────────────────────────────────────────────
  if (step === 'pending') return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4 text-center">
      <div className="text-4xl">🎉</div>
      <div>
        <p className="font-display font-bold text-brand-dark text-base mb-1">Request submitted!</p>
        <p className="text-sm text-gray-500">
          Your request for <span className="font-bold text-brand-green">{subdomain}.earket.com</span> is received.
        </p>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left space-y-2">
        <p className="text-xs font-bold text-amber-700">What happens next:</p>
        {[
          'Our team has been notified',
          'We\'ll send you a Paystack bank transfer link via WhatsApp or email within 24 hours',
          'Pay from your banking app — no card needed',
          'Your subdomain goes live within 1 hour of payment confirmation',
        ].map((s, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-amber-500 font-bold text-xs mt-0.5 shrink-0">{i + 1}.</span>
            <p className="text-xs text-amber-700">{s}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400">
        Questions?{' '}
        <a href={`https://wa.me/${SUPPORT_WA}`} target="_blank" rel="noreferrer" className="text-brand-green font-semibold hover:underline">
          WhatsApp us →
        </a>
      </p>
    </div>
  )

  // ── PAYMENT ────────────────────────────────────────────────────────────
  if (step === 'payment') return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
      <div>
        <p className="font-display font-bold text-brand-dark text-sm">Complete Your Payment</p>
        <p className="text-xs text-gray-400 mt-0.5">
          Claiming: <span className="font-bold text-brand-green">{subdomain}.earket.com</span>
        </p>
      </div>
      <div className="bg-brand-light rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 font-semibold">Custom Subdomain — Earket Pro</p>
          <p className="text-xs text-gray-400">{PRICE_DESC}</p>
        </div>
        <p className="font-display font-bold text-2xl text-brand-green">{PRICE}</p>
      </div>
      <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">How to pay:</p>
      {/* WhatsApp option */}
      <div className="bg-[#075E54]/5 border border-[#25D366]/20 rounded-xl p-4 space-y-2.5">
        <div className="flex items-center gap-2">
          <span className="text-base">💬</span>
          <p className="text-xs font-bold text-gray-700">Option 1 — WhatsApp (fastest)</p>
        </div>
        <p className="text-xs text-gray-500">We'll send you a Paystack virtual account number instantly. Pay from your banking app.</p>
        <a href={`https://wa.me/${SUPPORT_WA}?text=${waPaymentMsg}`}
          target="_blank" rel="noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white text-sm font-bold py-2.5 rounded-xl hover:bg-[#1ea854] transition-colors">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          Message Us on WhatsApp
        </a>
      </div>
      {/* Email option */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2.5">
        <div className="flex items-center gap-2">
          <span className="text-base">✉️</span>
          <p className="text-xs font-bold text-gray-700">Option 2 — Email us</p>
        </div>
        <p className="text-xs text-gray-500">We'll reply with a payment link within 24 hours.</p>
        <div className="flex gap-2">
          <a href={`mailto:${SUPPORT_EMAIL}?subject=${emailSubject}&body=${emailBody}`}
            className="flex-1 flex items-center justify-center gap-1.5 bg-white border-2 border-gray-200 text-gray-700 text-xs font-bold py-2.5 rounded-xl hover:border-brand-green hover:text-brand-green transition-colors">
            Send Email
          </a>
          <button onClick={copyEmail}
            className="flex items-center gap-1.5 bg-white border-2 border-gray-200 text-gray-600 text-xs font-semibold px-4 py-2.5 rounded-xl hover:border-gray-300 transition-colors">
            <Copy size={12} />{copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
      <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500 space-y-1">
        <p className="font-semibold text-gray-600 mb-1">How Paystack bank transfer works:</p>
        <p>• We send you a unique temporary account number</p>
        <p>• Transfer {PRICE} from your banking app — no card needed</p>
        <p>• Confirmed automatically · Subdomain live within 1 hour</p>
      </div>
      <button onClick={() => setStep('pending')} className="w-full text-xs text-gray-400 hover:text-gray-600 py-1 transition-colors">
        Already contacted us? → Mark as pending
      </button>
    </div>
  )

  // ── CHOOSE ─────────────────────────────────────────────────────────────
  if (step === 'choose') {
    const validationError = subdomain ? validate(subdomain.toLowerCase()) : null
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <div>
          <p className="font-display font-bold text-brand-dark text-sm">Choose Your Subdomain</p>
          <p className="text-xs text-gray-400 mt-0.5">Pick your branded link on earket.com</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Your branded link</label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input type="text" value={subdomain} maxLength={30}
                onChange={e => { setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')); setAvailability('idle') }}
                placeholder="yourbrand"
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green pr-28 font-mono" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">.earket.com</span>
            </div>
            <button onClick={checkAvailability} disabled={!subdomain || checking || !!validationError}
              className="bg-gray-100 text-gray-700 text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-40 shrink-0">
              {checking ? <Loader2 size={14} className="animate-spin" /> : 'Check'}
            </button>
          </div>
          {validationError && <p className="text-xs text-red-500 mt-1.5">❌ {validationError}</p>}
          {!validationError && availability === 'available' && <p className="text-xs text-brand-green mt-1.5 flex items-center gap-1"><Check size={12} /> {subdomain}.earket.com is available!</p>}
          {availability === 'taken' && <p className="text-xs text-red-500 mt-1.5">❌ Already taken — try a different name</p>}
        </div>
        <div className="text-xs text-gray-400 space-y-1">
          <p>• Use your business name (e.g. jbmart, nwatransport)</p>
          <p>• Lowercase letters, numbers and hyphens only · 3–30 characters</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setStep('intro')} className="flex-1 bg-gray-100 text-gray-600 text-sm font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors">Back</button>
          <button onClick={submitRequest} disabled={availability !== 'available' || submitting}
            className="flex-1 bg-brand-green text-white text-sm font-bold py-3 rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
            {submitting ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : `Claim for ${PRICE} →`}
          </button>
        </div>
      </div>
    )
  }

  // ── INTRO (default) ────────────────────────────────────────────────────
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200 p-5 space-y-4">
      <div className="flex items-start gap-3">
        <span className="text-2xl">⭐</span>
        <div>
          <p className="font-display font-bold text-indigo-900 text-sm">Get Your Branded Link</p>
          <p className="text-xs text-indigo-500 mt-0.5">{PRICE_DESC}</p>
        </div>
      </div>
      <div className="bg-white rounded-xl p-4 border border-indigo-100 space-y-3">
        <div>
          <p className="text-xs text-gray-400 mb-1">Instead of:</p>
          <p className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1.5 rounded-lg">earket.com/store/{merchantSlug}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-indigo-100" />
          <span className="text-indigo-300 text-xs">you get</span>
          <div className="flex-1 h-px bg-indigo-100" />
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Your own branded link:</p>
          <p className="text-sm font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-1.5 rounded-lg">yourbrand.earket.com</p>
        </div>
      </div>
      <div className="space-y-2">
        {[
          { icon: '🔗', text: 'Shorter, professional link to share everywhere' },
          { icon: '📱', text: 'Easier to remember and type on any device' },
          { icon: '💼', text: 'Builds brand recognition with every customer visit' },
          { icon: '✅', text: 'One-time payment — no monthly fees, yours forever' },
        ].map((b, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <span className="text-sm shrink-0">{b.icon}</span>
            <p className="text-xs text-indigo-700">{b.text}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl p-3 border border-indigo-100 flex items-center justify-between">
        <div>
          <p className="font-display font-bold text-2xl text-indigo-900">{PRICE}</p>
          <p className="text-xs text-gray-400">One-time · No subscription</p>
        </div>
        <button onClick={() => setStep('choose')}
          className="bg-indigo-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
          Get Started →
        </button>
      </div>
    </div>
  )
}
