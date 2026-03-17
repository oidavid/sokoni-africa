'use client'
import { useState } from 'react'
import { ShoppingBag, Mail, ArrowRight, Check, MessageCircle, Hash } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { COUNTRIES, normalizeNumber } from '@/lib/countries'

type Method = 'pin' | 'email' | 'whatsapp'
type PinStep = 'enter' | 'choose_delivery' | 'sent'

export default function LoginPage() {
  const [method, setMethod] = useState<Method>('pin')
  const [email, setEmail] = useState('')
  const [pin, setPin] = useState('')
  const [phone, setPhone] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0])
  const [showCountryPicker, setShowCountryPicker] = useState(false)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // PIN flow state
  const [pinStep, setPinStep] = useState<PinStep>('enter')
  const [verifiedMerchant, setVerifiedMerchant] = useState<{ email: string; whatsapp_number: string; business_name: string } | null>(null)

  async function handlePinVerify() {
    if (!email.trim()) { setError('Please enter your email'); return }
    if (pin.length !== 4) { setError('Please enter your 4-digit PIN'); return }
    setLoading(true)
    setError('')

    const { data: merchant } = await supabase
      .from('merchants')
      .select('email, login_pin, whatsapp_number, business_name')
      .eq('email', email.trim().toLowerCase())
      .single()

    if (!merchant) {
      setError('No store found with that email.')
      setLoading(false)
      return
    }

    if (!merchant.login_pin) {
      setError('No PIN set yet. Use Magic Link login first, then set your PIN in Settings.')
      setLoading(false)
      return
    }

    if (merchant.login_pin !== pin) {
      setError('Incorrect PIN. Please try again.')
      setLoading(false)
      return
    }

    // PIN correct — let merchant choose how to receive login link
    setVerifiedMerchant(merchant)
    setPinStep('choose_delivery')
    setLoading(false)
  }

  async function sendPinLoginLink(via: 'email' | 'whatsapp') {
    if (!verifiedMerchant) return
    setLoading(true)

    await supabase.auth.signInWithOtp({
      email: verifiedMerchant.email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    })

    if (via === 'whatsapp') {
      const msg = `Your Earket login link for *${verifiedMerchant.business_name}*:\n\nClick here to access your dashboard:\n${window.location.origin}/auth/callback\n\nOr go to: ${window.location.origin}/login and use your email: ${verifiedMerchant.email}`
      const waNum = verifiedMerchant.whatsapp_number?.replace(/\D/g, '')
      window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`, '_blank')
    }

    setPinStep('sent')
    setLoading(false)
  }

  async function handleMagicLink() {
    if (!email.trim()) { setError('Please enter your email'); return }
    setLoading(true)
    setError('')
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    })
    if (authError) {
      setError(authError.message.toLowerCase().includes('rate')
        ? 'Too many emails sent. Please wait 1 hour or use PIN login instead.'
        : authError.message)
      setLoading(false)
      return
    }
    setSent(true)
    setLoading(false)
  }

  async function handleWhatsAppLogin() {
    if (!phone.trim()) { setError('Please enter your WhatsApp number'); return }
    setLoading(true)
    setError('')
    const normalized = normalizeNumber(phone, selectedCountry.dial)
    const { data: merchants } = await supabase
      .from('merchants')
      .select('email, business_name, slug, whatsapp_number')
      .or(`whatsapp_number.eq.${normalized},phone.eq.${normalized}`)
      .limit(1)

    let merchant = merchants?.[0]
    if (!merchant) {
      const { data: m2 } = await supabase
        .from('merchants')
        .select('email, business_name, slug, whatsapp_number')
        .ilike('whatsapp_number', `%${phone.replace(/\D/g, '').slice(-8)}%`)
        .limit(1)
      merchant = m2?.[0]
    }

    if (!merchant) {
      setError('No store found with that WhatsApp number. Try email login instead.')
      setLoading(false)
      return
    }

    await supabase.auth.signInWithOtp({
      email: merchant.email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    })

    const msg = `Your Earket login link for *${merchant.business_name}*:\n\nTap the link in your email (${merchant.email}) to access your dashboard.\n\nOr go to: ${window.location.origin}/login`
    window.open(`https://wa.me/${normalized}?text=${encodeURIComponent(msg)}`, '_blank')
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-light to-white flex flex-col">
      <nav className="px-4 h-14 flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-green rounded-lg flex items-center justify-center">
            <ShoppingBag size={14} className="text-white" />
          </div>
          <span className="font-display font-bold text-brand-dark text-base">Earket</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">

          {/* PIN — choose delivery after verification */}
          {method === 'pin' && pinStep === 'choose_delivery' && verifiedMerchant && (
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-brand-green rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-green/20">
                <Check size={28} className="text-white" />
              </div>
              <h2 className="font-display text-xl font-bold text-brand-dark mb-2">PIN Verified! ✅</h2>
              <p className="text-gray-500 text-sm mb-6">How would you like to receive your login link?</p>
              <div className="space-y-3">
                <button onClick={() => sendPinLoginLink('email')} disabled={loading}
                  className="w-full flex items-center gap-3 bg-white border-2 border-gray-200 hover:border-brand-green rounded-2xl p-4 transition-all">
                  <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center">
                    <Mail size={20} className="text-brand-green" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-brand-dark text-sm">Send to Email</div>
                    <div className="text-xs text-gray-400 truncate">{verifiedMerchant.email}</div>
                  </div>
                </button>
                <button onClick={() => sendPinLoginLink('whatsapp')} disabled={loading}
                  className="w-full flex items-center gap-3 bg-[#25D366] rounded-2xl p-4 hover:opacity-90 transition-all">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <MessageCircle size={20} className="text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-white text-sm">Send to WhatsApp</div>
                    <div className="text-xs text-white/70">+{verifiedMerchant.whatsapp_number}</div>
                  </div>
                </button>
              </div>
              <button onClick={() => { setPinStep('enter'); setError('') }}
                className="mt-4 text-xs text-gray-400 font-semibold">← Back</button>
            </div>
          )}

          {/* Sent confirmation */}
          {sent || pinStep === 'sent' ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-green/30">
                <Check size={36} className="text-white" />
              </div>
              <h2 className="font-display text-2xl font-bold text-brand-dark mb-2">Check your email! 📬</h2>
              <p className="text-gray-500 text-sm mb-2">We sent a login link to:</p>
              <p className="font-bold text-brand-dark mb-6">{verifiedMerchant?.email || email}</p>
              <p className="text-xs text-gray-400 mb-6">Click the link to access your dashboard. Check spam if you don't see it.</p>
              <button onClick={() => { setSent(false); setPinStep('enter'); setError('') }}
                className="text-sm text-brand-green font-semibold">← Try again</button>
            </div>
          ) : method === 'pin' && pinStep === 'enter' ? (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-brand-green rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-green/20">
                  <ShoppingBag size={28} className="text-white" />
                </div>
                <h1 className="font-display text-2xl font-bold text-brand-dark mb-2">Login to your store</h1>
                <p className="text-gray-500 text-sm">Enter your email and PIN.</p>
              </div>

              <div className="flex bg-gray-100 rounded-2xl p-1 mb-6 gap-1">
                {([
                  { m: 'pin' as Method, icon: Hash, label: 'PIN' },
                  { m: 'email' as Method, icon: Mail, label: 'Email' },
                  { m: 'whatsapp' as Method, icon: MessageCircle, label: 'WhatsApp' },
                ]).map(({ m, icon: Icon, label }) => (
                  <button key={m} onClick={() => { setMethod(m); setError('') }}
                    className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      method === m ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-400'
                    }`}>
                    <Icon size={14} />
                    {label}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <input type="email" placeholder="your@email.com" value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  className="w-full border-2 border-gray-200 focus:border-brand-green rounded-2xl px-4 py-4 text-brand-dark font-semibold outline-none transition-colors" />
                <input type="password" inputMode="numeric" maxLength={4} placeholder="••••"
                  value={pin} onChange={e => { setPin(e.target.value.replace(/\D/g, '').slice(0, 4)); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handlePinVerify()}
                  className="w-full border-2 border-gray-200 focus:border-brand-green rounded-2xl px-4 py-4 text-brand-dark font-display font-bold text-2xl text-center tracking-widest outline-none transition-colors" />
              </div>

              <p className="text-xs text-center text-gray-400 mt-2">
                Forgot your PIN?{' '}
                <button onClick={() => { setMethod('email'); setError('') }} className="text-brand-green font-semibold">
                  Use magic link instead
                </button>
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mt-3">
                  <p className="text-red-600 text-xs">{error}</p>
                </div>
              )}

              <button onClick={handlePinVerify} disabled={loading}
                className="w-full bg-brand-green text-white font-bold py-4 rounded-2xl hover:bg-brand-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-4">
                {loading ? 'Verifying...' : <><Hash size={18} /> Login with PIN <ArrowRight size={18} /></>}
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                Don't have a store yet?{' '}
                <Link href="/onboarding" className="text-brand-green font-semibold">Create one free</Link>
              </p>
            </>
          ) : method === 'email' ? (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-brand-green rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-green/20">
                  <ShoppingBag size={28} className="text-white" />
                </div>
                <h1 className="font-display text-2xl font-bold text-brand-dark mb-2">Login to your store</h1>
              </div>

              <div className="flex bg-gray-100 rounded-2xl p-1 mb-6 gap-1">
                {([
                  { m: 'pin' as Method, icon: Hash, label: 'PIN' },
                  { m: 'email' as Method, icon: Mail, label: 'Email' },
                  { m: 'whatsapp' as Method, icon: MessageCircle, label: 'WhatsApp' },
                ]).map(({ m, icon: Icon, label }) => (
                  <button key={m} onClick={() => { setMethod(m); setError('') }}
                    className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      method === m ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-400'
                    }`}>
                    <Icon size={14} />
                    {label}
                  </button>
                ))}
              </div>

              <input type="email" placeholder="your@email.com" value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleMagicLink()} autoFocus
                className="w-full border-2 border-gray-200 focus:border-brand-green rounded-2xl px-4 py-4 text-brand-dark font-semibold outline-none transition-colors" />

              {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mt-3"><p className="text-red-600 text-xs">{error}</p></div>}

              <button onClick={handleMagicLink} disabled={loading}
                className="w-full bg-brand-green text-white font-bold py-4 rounded-2xl hover:bg-brand-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-4">
                {loading ? 'Sending...' : <><Mail size={18} /> Send Magic Link <ArrowRight size={18} /></>}
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                Don't have a store yet?{' '}
                <Link href="/onboarding" className="text-brand-green font-semibold">Create one free</Link>
              </p>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-brand-green rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-green/20">
                  <ShoppingBag size={28} className="text-white" />
                </div>
                <h1 className="font-display text-2xl font-bold text-brand-dark mb-2">Login to your store</h1>
              </div>

              <div className="flex bg-gray-100 rounded-2xl p-1 mb-6 gap-1">
                {([
                  { m: 'pin' as Method, icon: Hash, label: 'PIN' },
                  { m: 'email' as Method, icon: Mail, label: 'Email' },
                  { m: 'whatsapp' as Method, icon: MessageCircle, label: 'WhatsApp' },
                ]).map(({ m, icon: Icon, label }) => (
                  <button key={m} onClick={() => { setMethod(m); setError('') }}
                    className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      method === m ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-400'
                    }`}>
                    <Icon size={14} />
                    {label}
                  </button>
                ))}
              </div>

              <div className="mb-3">
                <div className="flex gap-2 mb-2">
                  <button onClick={() => setShowCountryPicker(!showCountryPicker)}
                    className="flex items-center gap-1.5 bg-white border-2 border-gray-200 rounded-2xl px-3 py-4 text-sm font-semibold hover:border-brand-green transition-colors shrink-0">
                    <span>{selectedCountry.flag}</span>
                    <span className="text-gray-600">+{selectedCountry.dial}</span>
                  </button>
                  <input type="tel" placeholder="Phone number" value={phone}
                    onChange={e => { setPhone(e.target.value); setError('') }}
                    onKeyDown={e => e.key === 'Enter' && handleWhatsAppLogin()} autoFocus
                    className="flex-1 border-2 border-gray-200 focus:border-brand-green rounded-2xl px-4 py-4 text-brand-dark font-semibold outline-none transition-colors" />
                </div>
                {showCountryPicker && (
                  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg max-h-52 overflow-y-auto mb-2">
                    {COUNTRIES.map(c => (
                      <button key={c.code} onClick={() => { setSelectedCountry(c); setShowCountryPicker(false) }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                          selectedCountry.code === c.code ? 'bg-brand-light text-brand-green font-semibold' : 'text-gray-700'
                        }`}>
                        <span>{c.flag}</span>
                        <span className="flex-1 text-left">{c.name}</span>
                        <span className="text-gray-400 text-xs">+{c.dial}</span>
                      </button>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-400">Enter the WhatsApp number you used when creating your store</p>
              </div>

              {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mt-3"><p className="text-red-600 text-xs">{error}</p></div>}

              <button onClick={handleWhatsAppLogin} disabled={loading}
                className="w-full bg-[#25D366] hover:bg-[#1ea855] text-white font-bold py-4 rounded-2xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-4">
                {loading ? 'Sending...' : <><MessageCircle size={18} /> Send via WhatsApp <ArrowRight size={18} /></>}
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                Don't have a store yet?{' '}
                <Link href="/onboarding" className="text-brand-green font-semibold">Create one free</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
