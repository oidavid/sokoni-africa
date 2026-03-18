'use client'
import { useState } from 'react'
import { ShoppingBag, Mail, ArrowRight, Eye, EyeOff, MessageCircle, Check, Lock } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { COUNTRIES, normalizeNumber } from '@/lib/countries'

type View = 'login' | 'forgot' | 'sent'

export default function LoginPage() {
  const [view, setView] = useState<View>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Forgot password via WhatsApp
  const [phone, setPhone] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0])
  const [showCountryPicker, setShowCountryPicker] = useState(false)

  async function handleLogin() {
    if (!email.trim()) { setError('Please enter your email'); return }
    if (!password.trim()) { setError('Please enter your password'); return }
    setLoading(true)
    setError('')

    // Check password against merchant record directly
    const { data: merchant } = await supabase
      .from('merchants')
      .select('email, login_pin, business_name')
      .eq('email', email.trim().toLowerCase())
      .single()

    if (!merchant) {
      setError('No store found with that email.')
      setLoading(false)
      return
    }

    if (!merchant.login_pin) {
      setError('No password set yet. Please create your store first.')
      setLoading(false)
      return
    }

    if (merchant.login_pin !== password) {
      setError('Incorrect password. Please try again.')
      setLoading(false)
      return
    }

    // Password correct — try Supabase auth, fall back to storing session manually
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: merchant.email,
      password,
    })

    if (authError) {
      // Auth account may not exist or need confirmation — create/update it
      await supabase.auth.signUp({ email: merchant.email, password })
      // Try signing in again
      const { error: retryError } = await supabase.auth.signInWithPassword({
        email: merchant.email,
        password,
      })
      if (retryError) {
        // Store merchant email in localStorage as fallback session
        localStorage.setItem('earket_merchant_email', merchant.email)
        window.location.href = '/dashboard'
        return
      }
    }

    window.location.href = '/dashboard'
  }

  async function handleForgotPassword() {
    if (!phone.trim()) { setError('Please enter your WhatsApp number'); return }
    setLoading(true)
    setError('')

    const normalized = normalizeNumber(phone, selectedCountry.dial)

    // Find merchant by phone
    const { data: merchants } = await supabase
      .from('merchants')
      .select('email, business_name, whatsapp_number, login_pin')
      .or(`whatsapp_number.eq.${normalized},phone.eq.${normalized}`)
      .limit(1)

    let merchant = merchants?.[0]
    if (!merchant) {
      const { data: m2 } = await supabase
        .from('merchants')
        .select('email, business_name, whatsapp_number, login_pin')
        .ilike('whatsapp_number', `%${phone.replace(/\D/g, '').slice(-8)}%`)
        .limit(1)
      merchant = m2?.[0]
    }

    if (!merchant) {
      setError('No store found with that WhatsApp number.')
      setLoading(false)
      return
    }

    // Send login details via WhatsApp
    const pin = merchant.login_pin || 'Not set — please contact support'
    const msg = `Hi! Your Earket login details for *${merchant.business_name}*:\n\n📧 Email: ${merchant.email}\n🔑 PIN: ${pin}\n\n➡️ Login at: earket.com/login\n\nKeep this message safe.`
    window.open(`https://wa.me/${normalized}?text=${encodeURIComponent(msg)}`, '_blank')

    setView('sent')
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

          {/* Login */}
          {view === 'login' && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-brand-green rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-green/20">
                  <ShoppingBag size={28} className="text-white" />
                </div>
                <h1 className="font-display text-2xl font-bold text-brand-dark mb-2">Login to your store</h1>
                <p className="text-gray-500 text-sm">Enter your email and password.</p>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError('') }}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    autoFocus
                    className="w-full border-2 border-gray-200 focus:border-brand-green rounded-2xl pl-10 pr-4 py-4 text-brand-dark font-semibold outline-none transition-colors"
                  />
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError('') }}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    className="w-full border-2 border-gray-200 focus:border-brand-green rounded-2xl pl-10 pr-12 py-4 text-brand-dark font-semibold outline-none transition-colors"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="text-right mt-2 mb-4">
                <button onClick={() => { setView('forgot'); setError('') }}
                  className="text-xs text-brand-green font-semibold">
                  Forgot password? Get it via WhatsApp
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-3">
                  <p className="text-red-600 text-xs">{error}</p>
                </div>
              )}

              <button onClick={handleLogin} disabled={loading}
                className="w-full bg-brand-green text-white font-bold py-4 rounded-2xl hover:bg-brand-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? 'Logging in...' : <><ArrowRight size={18} /> Login to Dashboard</>}
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                Don't have a store yet?{' '}
                <Link href="/onboarding" className="text-brand-green font-semibold">Create one free</Link>
              </p>
            </>
          )}

          {/* Forgot password via WhatsApp */}
          {view === 'forgot' && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#25D366] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
                  <MessageCircle size={28} className="text-white" />
                </div>
                <h1 className="font-display text-2xl font-bold text-brand-dark mb-2">Get login details</h1>
                <p className="text-gray-500 text-sm">Enter your WhatsApp number and we'll send your login details.</p>
              </div>

              <div className="flex gap-2 mb-2">
                <button onClick={() => setShowCountryPicker(!showCountryPicker)}
                  className="flex items-center gap-1.5 bg-white border-2 border-gray-200 rounded-2xl px-3 py-4 text-sm font-semibold hover:border-brand-green transition-colors shrink-0">
                  <span>{selectedCountry.flag}</span>
                  <span className="text-gray-600">+{selectedCountry.dial}</span>
                </button>
                <input type="tel" placeholder="Phone number" value={phone}
                  onChange={e => { setPhone(e.target.value); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleForgotPassword()} autoFocus
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

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-3">
                  <p className="text-red-600 text-xs">{error}</p>
                </div>
              )}

              <button onClick={handleForgotPassword} disabled={loading}
                className="w-full bg-[#25D366] hover:bg-[#1ea855] text-white font-bold py-4 rounded-2xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
                {loading ? 'Sending...' : <><MessageCircle size={18} /> Send Login Details via WhatsApp</>}
              </button>

              <button onClick={() => { setView('login'); setError('') }}
                className="w-full text-center text-sm text-gray-400 font-semibold mt-4">
                ← Back to login
              </button>
            </>
          )}

          {/* Sent confirmation */}
          {view === 'sent' && (
            <div className="text-center">
              <div className="w-20 h-20 bg-[#25D366] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                <Check size={36} className="text-white" />
              </div>
              <h2 className="font-display text-2xl font-bold text-brand-dark mb-2">Sent to WhatsApp! 💬</h2>
              <p className="text-gray-500 text-sm mb-6">Your login details have been sent to your WhatsApp number. Check the message and use your email and password to log in.</p>
              <button onClick={() => { setView('login'); setError('') }}
                className="bg-brand-green text-white font-bold px-8 py-3 rounded-2xl text-sm hover:bg-brand-dark transition-colors">
                Go to Login
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
