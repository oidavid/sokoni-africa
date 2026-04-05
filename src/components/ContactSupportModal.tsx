'use client'
import { useState } from 'react'
import { X, Send, Check, Loader2, Mail } from 'lucide-react'

interface Props {
  merchantName?: string
  merchantEmail?: string
  onClose: () => void
}

export default function ContactSupportModal({ merchantName, merchantEmail, onClose }: Props) {
  const [name, setName] = useState(merchantName || '')
  const [email, setEmail] = useState(merchantEmail || '')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSend() {
    if (!message.trim()) { setError('Please write a message'); return }
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, businessName: merchantName }),
      })
      if (!res.ok) throw new Error('Failed')
      setSent(true)
    } catch {
      setError('Failed to send. Please try again.')
    }
    setSending(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-light rounded-xl flex items-center justify-center">
              <Mail size={15} className="text-brand-green" />
            </div>
            <div>
              <p className="font-display font-bold text-brand-dark text-sm">Contact Support</p>
              <p className="text-xs text-gray-400">We'll reply to your email</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X size={14} className="text-gray-500" />
          </button>
        </div>

        <div className="p-5">
          {sent ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-green/20">
                <Check size={24} className="text-white" />
              </div>
              <p className="font-display font-bold text-brand-dark text-lg mb-1">Message sent!</p>
              <p className="text-sm text-gray-500 mb-5">We'll get back to you as soon as possible.</p>
              <button onClick={onClose}
                className="bg-brand-green text-white font-bold px-8 py-2.5 rounded-2xl text-sm hover:bg-brand-dark transition-colors">
                Done
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Your Name</label>
                <input value={name} onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green transition-colors" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Reply Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green transition-colors" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Message <span className="text-red-400">*</span></label>
                <textarea value={message} onChange={e => { setMessage(e.target.value); setError('') }}
                  placeholder="How can we help you?"
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green transition-colors resize-none" />
              </div>

              {error && <p className="text-red-500 text-xs">{error}</p>}

              <button onClick={handleSend} disabled={sending}
                className="w-full bg-brand-green text-white font-bold py-3 rounded-2xl hover:bg-brand-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                {sending
                  ? <><Loader2 size={16} className="animate-spin" /> Sending...</>
                  : <><Send size={15} /> Send Message</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
