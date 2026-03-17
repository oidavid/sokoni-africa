'use client'
import { useState } from 'react'
import { ShoppingBag, Mail, ArrowRight, Check, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type Method = 'email' | 'whatsapp'

function normalizePhone(number: string) {
  const digits = number.replace(/\D/g, '')
  if (digits.startsWith('0')) return '234' + digits.slice(1)
  if (digits.startsWith('234')) return digits
  return '234' + digits
}

export default function LoginPage() {
  const [method, setMethod] = useState<Method>('email')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    setError('')
    setLoading(true)

    if (method === 'email') {
      if (!email.trim()) { setError('Please enter your email'); setLoading(false); return }
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
      })
      if (authError) {
        if (authError.message.toLowerCase().includes('rate')) {
          setError('Too many emails sent. Please wait 1 hour or use WhatsApp login instead.')
        } else {
          setError(authError.message)
        }
        setLoading(false)
        return
      }
      setSent(true)

    } else {
      if (!phone.trim()) { setError('Please enter your WhatsApp number'); setLoading(false); return }

      const normalized = normalizePhone(phone)
      // Try multiple formats to find the merchant
      const { data: merchants } = await supabase
        .from('merchants')
        .select('email, business_name, slug, whatsapp_number')
        .or(`whatsapp_number.eq.${normalized},phone.eq.${normalized}`)

      let merchant = merchants?.[0]

      // If not found, try with leading zero variant
      if (!merchant) {
        const alt = '0' + normalized.slice(3) // convert 2348... back to 08...
        const { data: merchants2 } = await supabase
          .from('merchants')
          .select('email, business_name, slug, whatsapp_number')
          .or(`whatsapp_number.eq.${alt},phone.eq.${alt}`)
        merchant = merchants2?.[0]
      }

      if (!merchant) {
        setError('No store found with that WhatsApp number. Try using your email instead.')
        setLoading(false)
        return
      }

      // Send magic link to their email
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: merchant.email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
      })

      // Always send WhatsApp message with login link regardless of email status
      const loginUrl = `${window.location.origin}/auth/callback`
      const msg = `Hi! Here is your Earket login link for *${merchant.business_name}*:\n\n${window.location.origin}/login\n\nYour store: earket.com/store/${merchant.slug}\n\n${merchant.email ? 'Login with your email: ' + merchant.email : 'Use the email you registered with to login'}`
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
                <div className="mb-3">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">🇳🇬 +234</span>
                    <input type="tel" placeholder="08012345678" value={phone}
                      onChange={e => { setPhone(e.target.value); setError('') }}
                      onKeyDown={e => e.key === 'Enter' && handleLogin()} autoFocus
                      className="w-full border-2 border-gray-200 focus:border-brand-green rounded-2xl pl-24 pr-4 py-4 
                                 text-brand-dark font-semibold outline-none transition-colors" />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Enter the WhatsApp number you used when creating your store</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-3">
                  <p className="text-red-600 text-xs">{error}</p>
                </div>
              )}

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
              <p className="text-gray-500 text-sm mb-2">Your login link was sent to:</p>
              <p className="font-bold text-brand-dark mb-6">{method === 'email' ? email : `+234 ${phone}`}</p>
              <p className="text-xs text-gray-400 mb-6">
                {method === 'email'
                  ? "Click the link in the email to open your dashboard. Check spam if you don't see it."
                  : "A WhatsApp message just opened — send it to yourself to receive your login link."}
              </p>
              <button onClick={() => { setSent(false); setError('') }}
                className="text-sm text-brand-green font-semibold">
                ← Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
