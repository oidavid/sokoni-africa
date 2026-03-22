'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Send, Copy, Check, MessageCircle, Users } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const MESSAGE_TEMPLATES = [
  {
    id: 'new_products',
    label: '🆕 New Products',
    text: (name: string, link: string) => `Hi! 👋 I have exciting new products at *${name}*!\n\nCome check them out and shop online 🛍️\n\n👉 ${link}\n\n_Reply to this message to order_`
  },
  {
    id: 'promo',
    label: '🎉 Promotion / Sale',
    text: (name: string, link: string) => `🎉 *Special Offer at ${name}!*\n\nWe have amazing deals for you today!\n\nShop now before stock runs out 👇\n👉 ${link}\n\n_Limited time offer!_`
  },
  {
    id: 'restock',
    label: '📦 Back in Stock',
    text: (name: string, link: string) => `📦 *Good news!* Your favourite items are back in stock at *${name}*!\n\nShop now 👇\n👉 ${link}`
  },
  {
    id: 'reminder',
    label: '💬 General Reminder',
    text: (name: string, link: string) => `Hi! Just a reminder that *${name}* is open for orders! 😊\n\nVisit our store anytime 👇\n👉 ${link}\n\n_We deliver to your doorstep!_`
  },
  {
    id: 'service',
    label: '🔧 Service Available',
    text: (name: string, link: string) => `Hi! 👋 Looking for professional help?\n\n*${name}* is available for bookings!\n\nView services & book 👇\n👉 ${link}\n\n_Fast response guaranteed!_`
  },
]

export default function BroadcastPage() {
  const router = useRouter()
  const [merchant, setMerchant] = useState<{ id: string; business_name: string; slug: string; whatsapp_number: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState(0)
  const [customMessage, setCustomMessage] = useState('')
  const [useCustom, setUseCustom] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      const email = user?.email || localStorage.getItem('earket_merchant_email')
      if (!email) { router.push('/login'); return }
      const { data: m } = await supabase.from('merchants').select('id, business_name, slug, whatsapp_number').eq('email', email).single()
      if (m) setMerchant(m)
      setLoading(false)
    }
    load()
  }, [router])

  const storeLink = `https://earket.com/store/${merchant?.slug}`
  const message = useCustom ? customMessage : MESSAGE_TEMPLATES[selectedTemplate].text(merchant?.business_name || '', storeLink)

  function copyMessage() {
    navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function openWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 size={24} className="animate-spin text-brand-green" /></div>

  return (
    <div className="min-h-screen bg-gray-50 max-w-2xl mx-auto pb-10">
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <h1 className="font-display font-bold text-brand-dark">Broadcast Message</h1>
        <p className="text-xs text-gray-400">Send your store link to all your WhatsApp contacts</p>
      </div>

      <div className="p-4 space-y-4">
        {/* How it works */}
        <div className="bg-brand-light border border-brand-green/20 rounded-2xl p-4">
          <p className="text-xs font-semibold text-brand-green mb-2">📢 How to broadcast to all your contacts</p>
          <ol className="text-xs text-gray-600 space-y-1">
            <li>1. Choose a message template below</li>
            <li>2. Tap <strong>Open in WhatsApp</strong></li>
            <li>3. In WhatsApp, tap the <strong>share/forward</strong> button</li>
            <li>4. Select multiple contacts or a broadcast list</li>
            <li>5. Send! 🚀</li>
          </ol>
        </div>

        {/* Template selector */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Choose Template</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {MESSAGE_TEMPLATES.map((t, i) => (
              <button key={t.id} onClick={() => { setSelectedTemplate(i); setUseCustom(false) }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  !useCustom && selectedTemplate === i ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                {t.label}
              </button>
            ))}
            <button onClick={() => setUseCustom(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                useCustom ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-600'
              }`}>
              ✏️ Custom
            </button>
          </div>

          {/* Message preview */}
          {useCustom ? (
            <textarea value={customMessage} onChange={e => setCustomMessage(e.target.value)}
              placeholder="Type your custom message here... (your store link will be included)"
              rows={5}
              className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-brand-green outline-none resize-none" />
          ) : (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{message}</p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="space-y-2">
          <button onClick={openWhatsApp}
            className="w-full bg-[#25D366] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-sm">
            <MessageCircle size={18} /> Open in WhatsApp & Send
          </button>
          <button onClick={copyMessage}
            className="w-full bg-white border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 text-sm">
            {copied ? <><Check size={16} className="text-brand-green" /> Copied!</> : <><Copy size={16} /> Copy Message</>}
          </button>
        </div>

        {/* Stats tip */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-xs font-semibold text-gray-700 mb-2">💡 Tips for better results</p>
          <div className="space-y-1.5 text-xs text-gray-500">
            <p>• Send broadcasts in the morning (8-10am) or evening (6-8pm)</p>
            <p>• Don't broadcast more than twice a week to avoid being blocked</p>
            <p>• Personalize messages when possible — mention their name</p>
            <p>• Always include your store link so customers can browse easily</p>
          </div>
        </div>
      </div>
    </div>
  )
}
