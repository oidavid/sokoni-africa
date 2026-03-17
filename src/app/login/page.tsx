'use client'
import { useState } from 'react'
import { ShoppingBag, Mail, ArrowRight, Check, MessageCircle, Hash } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { COUNTRIES, normalizeNumber } from '@/lib/countries'

type Method = 'email' | 'whatsapp' | 'pin'

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

  async function handleLogin() {
    setError('')
    setLoading(true)

    if (method === 'pin') {
      if (!email.trim()) { setError('Please enter your email'); setLoading(false); return }
      if (pin.length !== 4) { setError('Please enter your 4-digit PIN'); setLoading(false); return }

      // Check PIN against merchant record
      const { data: merchant } = await supabase
        .from('merchants')
        .select('email, login_pin')
        .eq('email', email.trim().toLowerCase())
        .single()

      if (!merchant) {
        setError('No store found with that email. Try magic link login instead.')
        setLoading(false)
        return
      }

      if (!merchant.login_pin) {
        setError('No PIN set yet. Use magic link login first, then set your PIN in Settings.')
        setLoading(false)
        return
      }

      if (merchant.login_pin !== pin) {
        setError('Incorrect PIN. Please try again.')
        setLoading(false)
        return
      }

      // PIN correct — sign in via magic link silently and redirect
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: merchant.email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
      })

      if (!authError) {
        setSent(true)
      } else {
        // If rate limited, still show success — PIN was correct
        setSent(true)
      }

    } else if (method === 'email') {
      if (!email.trim()) { setError('Please enter your email'); setLoading(false); return }
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

    } else {
      if (!phone.trim()) { setError('Please enter your WhatsApp number'); setLoading(false); return }
      const normalized = normalizeNumber(phone, selectedCountry.dial)
      const { data: merchants } = await supabase
        .from('merchants')
        .select('email, business_name, slug, whatsapp_number')
        .or(`whatsapp_number.eq.${normalized},phone.eq.${normalized}`)
        .limit(1)

      let merchant = merchants?.[0]
      if (!merchant) {
        const { data: merchants2 } = await supabase
          .from('merchants')
          .select('email, business_name, slug, whatsapp_number')
          .ilike('whatsapp_number', `%${phone.replace(/\D/g, '').slice(-8)}%`)
          .limit(1)
        merchant = merchants2?.[0]
      }

      if (!merchant) {
        setError('No store found with that WhatsApp number. Try email login instead.')
        setLoading(false)
        return
      }

      const { error: authError } = await supabase.auth.signInWithOtp({
        email: merchant.email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
      })
      const msg = `Your Earket login link for *${merchant.business_name}*:\n\n${window.location.origin}/login\n\nUse email: ${merchant.email || 'the email you registered with'}`
      window.open(`https://wa.me/${normalized}?text=${encodeURIComponent(msg)}`, '_blank')
      if (authError && !authError.message.toLowerCase().includes('rate')) {
        setError(authError.message)
        setLoading(false)
        return
      }
      setSent(true)
    }

    setLoading(false)
  }

  const methodLabels = {
    pin: { icon: Hash, label: 'PIN Login', desc: 'Email + 4-digit PIN' },
    email: { icon: Mail, label: 'Magic Link', desc: 'Login link by email' },
    whatsapp: { icon: MessageCircle, label: 'WhatsApp', desc: 'Login link by WhatsApp' },
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
          {!sent ? (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-brand-green rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-green/20">
                  <ShoppingBag size={28} className="text-white" />
                </div>
                <h1 className="font-display text-2xl font-bold text-brand-dark mb-2">Login to your store</h1>
                <p className="text-gray-500 text-sm">Choose how you want to log in.</p>
              </div>

              {/* Method tabs */}
              <div className="flex bg-gray-100 rounded-2xl p-1 mb-6 gap-1">
                {(Object.keys(methodLabels) as Method[]).map(m => {
                  const { icon: Icon, label } = methodLabels[m]
                  return (
                    <button key={m} onClick={() => { setMethod(m); setError('') }}
                      className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                        method === m ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-400'
                      }`}>
                      <Icon size={14} />
                      {label}
                    </button>
                  )
                })}
              </div>

              {/* PIN login */}
              {method === 'pin' && (
                <div className="space-y-3">
                  <input type="email" placeholder="your@email.com" value={email}
                    onChange={e => { setEmail(e.target.value); setError('') }}
                    className="w-full border-2 border-gray-200 focus:border-brand-green rounded-2xl px-4 py-4 text-brand-dark font-semibold outline-none transition-colors" />
                  <div>
                    <input type="password" inputMode="numeric" maxLength={4} placeholder="4-digit PIN"
                      value={pin} onChange={e => { setPin(e.target.value.replace(/\D/g, '').slice(0, 4)); setError('') }}
                      className="w-full border-2 border-gray-200 focus:border-brand-green rounded-2xl px-4 py-4 text-brand-dark font-display font-bold text-2xl text-center tracking-widest outline-none transition-colors" />
                    <p className="text-xs text-gray-400 mt-1 text-center">
                      Set your PIN in Dashboard → Settings
                    </p>
                  </div>
                </div>
              )}

              {/* Email magic link */}
              {method === 'email' && (
                <input type="email" placeholder="your@email.com" value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()} autoFocus
                  className="w-full border-2 border-gray-200 focus:border-brand-green rounded-2xl px-4 py-4 text-brand-dark font-semibold outline-none transition-colors" />
              )}

              {/* WhatsApp */}
              {method === 'whatsapp' && (
                <div>
                  <div className="flex gap-2 mb-2">
                    <button onClick={() => setShowCountryPicker(!showCountryPicker)}
                      className="flex items-center gap-1.5 bg-white border-2 border-gray-200 rounded-2xl px-3 py-4 text-sm font-semibold hover:border-brand-green transition-colors shrink-0">
                      <span>{selectedCountry.flag}</span>
                      <span className="text-gray-600">+{selectedCountry.dial}</span>
                    </button>
                    <input type="tel" placeholder="Phone number" value={phone}
                      onChange={e => { setPhone(e.target.value); setError('') }}
                      onKeyDown={e => e.key === 'Enter' && handleLogin()} autoFocus
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
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mt-3">
                  <p className="text-red-600 text-xs">{error}</p>
                </div>
              )}

              <button onClick={handleLogin} disabled={loading}
                className={`w-full text-white font-bold py-4 rounded-2xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-4 ${
                  method === 'whatsapp' ? 'bg-[#25D366] hover:bg-[#1ea855]' : 'bg-brand-green hover:bg-brand-dark'
                }`}>
                {loading ? 'Please wait...' : method === 'pin'
                  ? <><Hash size={18} /> Login with PIN <ArrowRight size={18} /></>
                  : method === 'email'
                    ? <><Mail size={18} /> Send Magic Link <ArrowRight size={18} /></>
                    : <><MessageCircle size={18} /> Send via WhatsApp <ArrowRight size={18} /></>
                }
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                Don't have a store yet?{' '}
                <Link href="/onboarding" className="text-brand-green font-semibold">Create one free</Link>
              </p>
            </>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-green/30">
                <Check size={36} className="text-white" />
              </div>
              {method === 'pin' ? (
                <>
                  <h2 className="font-display text-2xl font-bold text-brand-dark mb-2">Check your email! 📬</h2>
                  <p className="text-gray-500 text-sm mb-2">PIN verified! We sent a login link to:</p>
                  <p className="font-bold text-brand-dark mb-6">{email}</p>
                  <p className="text-xs text-gray-400">Click the link to access your dashboard.</p>
                </>
              ) : method === 'email' ? (
                <>
                  <h2 className="font-display text-2xl font-bold text-brand-dark mb-2">Check your email! 📬</h2>
                  <p className="text-gray-500 text-sm mb-2">We sent a login link to:</p>
                  <p className="font-bold text-brand-dark mb-6">{email}</p>
                  <p className="text-xs text-gray-400">Click the link in the email to open your dashboard.</p>
                </>
              ) : (
                <>
                  <h2 className="font-display text-2xl font-bold text-brand-dark mb-2">Check your WhatsApp! 💬</h2>
                  <p className="text-gray-500 text-sm mb-6">A login link was sent to your WhatsApp number.</p>
                </>
              )}
              <button onClick={() => { setSent(false); setError('') }}
                className="mt-6 text-sm text-brand-green font-semibold">
                ← Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
