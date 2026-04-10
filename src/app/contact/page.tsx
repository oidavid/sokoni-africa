'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, businessName: name }),
      })
      if (res.ok) {
        setSent(true)
      } else {
        setError('Something went wrong. Please reach us on WhatsApp instead.')
      }
    } catch {
      setError('Something went wrong. Please reach us on WhatsApp instead.')
    }
    setSending(false)
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-display font-bold text-xl text-brand-dark">Earket</Link>
          <div className="flex items-center gap-4">
            <Link href="/browse" className="text-sm font-medium text-gray-500 hover:text-brand-green transition-colors">Browse Stores</Link>
            <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-brand-green transition-colors">Login</Link>
            <Link href="/onboarding" className="bg-brand-green text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-brand-dark transition-colors">
              Start Free →
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-16">

        <div className="mb-10">
          <h1 className="font-display font-bold text-3xl text-brand-dark mb-2">Contact Us</h1>
          <p className="text-gray-500">We're here to help. Reach us on WhatsApp for the fastest response.</p>
        </div>

        {/* WhatsApp — primary */}
        <a href="https://wa.me/14793219433?text=Hi Earket, I need some help."
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-4 bg-[#25D366] hover:bg-[#22c35e] text-white rounded-2xl p-5 mb-4 transition-colors">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.858L.057 23.5l5.797-1.52A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.001-1.371l-.36-.214-3.724.977.995-3.63-.234-.374A9.818 9.818 0 1 1 12 21.818z"/></svg>
          </div>
          <div>
            <p className="font-bold text-base">Chat on WhatsApp</p>
            <p className="text-white/80 text-sm">Fastest response — usually within 1 hour</p>
          </div>
          <span className="ml-auto text-white/60 text-xl">→</span>
        </a>

        {/* Email form — secondary */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
          <h2 className="font-display font-semibold text-brand-dark mb-1">Send us a message</h2>
          <p className="text-xs text-gray-400 mb-5">We'll reply by email within 1–2 business days.</p>

          {sent ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-3">✅</div>
              <p className="font-semibold text-gray-800 mb-1">Message sent!</p>
              <p className="text-sm text-gray-500">We'll get back to you within 1–2 business days.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Your name" required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-green bg-white"
              />
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Your email (optional)"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-green bg-white"
              />
              <textarea
                value={message} onChange={e => setMessage(e.target.value)}
                placeholder="How can we help you?" rows={4} required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-green resize-none bg-white"
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
              <button type="submit" disabled={sending || !name.trim() || !message.trim()}
                className="w-full bg-brand-green text-white font-bold text-sm py-3 rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>

        {/* Info */}
        <div className="text-center text-xs text-gray-400 space-y-1">
          <p>Earket is a product of <a href="https://intelsystechnology.com" target="_blank" rel="noopener noreferrer" className="text-brand-green hover:underline">IntelSys Technologies</a></p>
          <p>contact@earket.com</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-8">
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">© 2025 IntelSys Technologies. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <Link href="/about" className="hover:text-gray-600">About</Link>
            <Link href="/privacy" className="hover:text-gray-600">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-600">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
