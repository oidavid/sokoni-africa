'use client'
import { useState } from 'react'
import { ShoppingBag, Mail, ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    if (!email.trim()) { setError('Please enter your email'); return }
    setLoading(true)
    setError('')
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    })
    if (authError) {
      setError(authError.message)
      setLoading(false)
    } else {
      setSent(true)
      setLoading(false)
    }
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
                  <Mail size={28} className="text-white" />
                </div>
                <h1 className="font-display text-2xl font-bold text-brand-dark mb-2">Login to your store</h1>
                <p className="text-gray-500 text-sm">We'll send a magic link to your email. No password needed.</p>
              </div>

              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                autoFocus
                className="w-full border-2 border-gray-200 focus:border-brand-green rounded-2xl px-4 py-4 
                           text-brand-dark font-semibold outline-none transition-colors mb-3"
              />
              {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

              <button onClick={handleLogin} disabled={loading}
                className="w-full bg-brand-green text-white font-bold py-4 rounded-2xl hover:bg-brand-dark 
                           transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? 'Sending...' : <><Mail size={18} /> Send Magic Link <ArrowRight size={18} /></>}
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
              <h2 className="font-display text-2xl font-bold text-brand-dark mb-2">Check your email! 📬</h2>
              <p className="text-gray-500 text-sm mb-2">We sent a magic login link to:</p>
              <p className="font-bold text-brand-dark mb-6">{email}</p>
              <p className="text-xs text-gray-400">Click the link in the email to access your dashboard. Check your spam folder if you don't see it.</p>
              <button onClick={() => setSent(false)} className="mt-6 text-sm text-brand-green font-semibold">
                ← Use a different email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
