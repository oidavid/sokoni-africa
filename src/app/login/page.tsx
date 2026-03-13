'use client'
import { useState } from 'react'
import { ShoppingBag, Mail, ArrowRight, Check, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type Method = 'email' | 'whatsapp'

export default function LoginPage() {
  const [method, setMethod] = useState<Method>('email')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    setError('')
    if (method === 'email') {
      if (!email.trim()) { setError('Please enter your email'); return }
      setLoading(true)
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
      })
      if (authError) { setError(authError.message); setLoading(false); return }
    } else {
      if (!phone.trim()) { setError('Please enter your WhatsApp number'); return }
      setLoading(true)
      // Look up merchant by phone, then send magic link to their email
      const digits = phone.replace(/\D/g, '')
      const normalized = digits.startsWith('0') ? '234' + digits.slice(1) : digits.startsWith('234') ? digits : '234' + digits
      const { data: merchant } = await supabase
        .from('merchants')
        .select('email')
        .eq('whatsapp_number', normalized)
        .single()

      if (!merchant?.email) {
        setError('No store found with that WhatsApp number')
        setLoading(false)
        return
      }

      const loginLink = `${window.location.origin}/auth/callback`
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: merchant.email,
        options: { emailRedirectTo: loginLink }
      })

      // Also send WhatsApp message with the link
      const waMessage = encodeURIComponent(
        `Hi! Here is your Sokoni login link:\n\n${loginLink}\n\nClick it to access your store dashboard. It expires in 24 hours.`
      )
      window.open(`https://wa.me/${normalized}?text=${waMessage}`, '_blank')

      if (authError) { setError(authError.message); setLoading(false); return }
    }

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
          <span className="font-display font-bold text-brand-dark text-base">Sokoni Africa</span>
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
                <p className="text-gray-500 text-sm">No password needed. We'll send you a magic link.</p>
              </div>

              {/* Method toggle */}
              <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
                <button onClick={() => { setMethod('email'); setError('') }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    method === 'email' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-400'
                  }`}>
                  <Mail size={15} /> Email
                </button>
                <button onClick={() => { setMethod('whatsapp'); setError('') }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    method === 'whatsapp' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-400'
                  }`}>
                  <MessageCircle size={15} /> WhatsApp
                </button>
              </div>

              {method === 'email' ? (
                <input type="email" placeholder="your@email.com" value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()} autoFocus
                  className="w-full border-2 border-gray-200 focus:border-brand-green rounded-2xl px-4 py-4 
                             text-brand-dark font-semibold outline-none transition-colors mb-3" />
              ) : (
                <div className="relative mb-3">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">🇳🇬 +234</span>
                  <input type="tel" placeholder="08012345678" value={phone}
                    onChange={e => { setPhone(e.target.value); setError('') }}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()} autoFocus
                    className="w-full border-2 border-gray-200 focus:border-brand-green rounded-2xl pl-24 pr-4 py-4 
                               text-brand-dark font-semibold outline-none transition-colors" />
                </div>
              )}

              {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

              <button onClick={handleLogin} disabled={loading}
                className={`w-full text-white font-bold py-4 rounded-2xl transition-colors disabled:opacity-50 
                           flex items-center justify-center gap-2 ${
                             method === 'whatsapp' ? 'bg-[#25D366] hover:bg-[#1ea855]' : 'bg-brand-green hover:bg-brand-dark'
                           }`}>
                {loading ? 'Sending...' : method === 'email'
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
              <h2 className="font-display text-2xl font-bold text-brand-dark mb-2">
                {method === 'email' ? 'Check your email! 📬' : 'Check your WhatsApp! 💬'}
              </h2>
              <p className="text-gray-500 text-sm mb-2">We sent your login link to:</p>
              <p className="font-bold text-brand-dark mb-6">{method === 'email' ? email : `+234 ${phone}`}</p>
              <p className="text-xs text-gray-400">
                {method === 'email'
                  ? "Click the link in the email to access your dashboard. Check your spam if you don't see it."
                  : "Click the link in your WhatsApp message to access your dashboard."}
              </p>
              <button onClick={() => setSent(false)} className="mt-6 text-sm text-brand-green font-semibold">
                ← Try a different {method === 'email' ? 'email' : 'number'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
