'use client'
import { useState, useEffect } from 'react'
import { ArrowLeft, Copy, Check } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Merchant {
  id: string
  business_name: string
  slug: string
  whatsapp_number: string
  category: string
}

export default function BroadcastPage() {
  const router = useRouter()
  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      const fallbackEmail = typeof window !== 'undefined' ? localStorage.getItem('earket_merchant_email') : null
      const email = user?.email || fallbackEmail
      if (!email) { router.push('/login'); return }
      const { data: m } = await supabase.from('merchants').select('*').eq('email', email).single()
      if (!m) { router.push('/onboarding'); return }
      setMerchant(m)
      setLoading(false)
    }
    load()
  }, [router])

  function getTemplates(m: Merchant) {
    const storeUrl = `earket.com/store/${m.slug}`
    return [
      {
        id: 'new_products',
        emoji: '🆕',
        title: 'New Products',
        description: 'Tell customers you have new items',
        message: `Hello! 👋\n\nWe just added *new products* to *${m.business_name}*! 🛍️\n\nCome check out what's new:\n${storeUrl}\n\nDon't miss out — some items are limited! ⚡\n\n_Reply STOP to unsubscribe_`,
      },
      {
        id: 'promotion',
        emoji: '🔥',
        title: 'Promotion / Sale',
        description: 'Announce a special deal or discount',
        message: `🔥 *SPECIAL OFFER* from *${m.business_name}*!\n\nWe have something exciting for you this week — don't miss our special deals!\n\nShop now:\n${storeUrl}\n\nOffer valid while stocks last ⏰\n\n_Reply STOP to unsubscribe_`,
      },
      {
        id: 'restock',
        emoji: '📦',
        title: 'Back in Stock',
        description: 'Let customers know popular items are back',
        message: `📦 Good news from *${m.business_name}*!\n\nYour favourite items are *back in stock*! 🙌\n\nBe quick before they run out again:\n${storeUrl}\n\nOrder now and we'll confirm via WhatsApp ✅\n\n_Reply STOP to unsubscribe_`,
      },
      {
        id: 'reminder',
        emoji: '⏰',
        title: 'Gentle Reminder',
        description: 'Nudge customers who haven\'t visited lately',
        message: `Hey! 👋 It's *${m.business_name}*.\n\nWe miss you! Come check out our latest products:\n${storeUrl}\n\nWe're always adding new items and great deals 🛍️\n\nMessage us on WhatsApp if you need anything!\n\n_Reply STOP to unsubscribe_`,
      },
      {
        id: 'service_available',
        emoji: '✅',
        title: 'We\'re Open / Available',
        description: 'Let customers know you\'re ready to serve',
        message: `✅ *${m.business_name}* is open and ready!\n\nWe're available to serve you today 🙌\n\nView our services and get in touch:\n${storeUrl}\n\nJust send us a WhatsApp message to get started — we respond fast! ⚡\n\n_Reply STOP to unsubscribe_`,
      },
    ]
  }

  function handleSend(message: string) {
    if (!merchant) return
    const waNumber = merchant.whatsapp_number?.replace(/\D/g, '')
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank')
  }

  async function handleCopy(id: string, message: string) {
    await navigator.clipboard.writeText(message)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!merchant) return null

  const templates = getTemplates(merchant)

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/dashboard" className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
          <ArrowLeft size={16} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="font-display font-bold text-brand-dark leading-tight">Broadcast</h1>
          <p className="text-xs text-gray-400">{merchant.business_name}</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">

        {/* Explainer */}
        <div className="bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl p-4 flex items-start gap-3">
          <span className="text-2xl shrink-0">📢</span>
          <div>
            <p className="font-semibold text-gray-800 text-sm mb-1">How Broadcast Works</p>
            <p className="text-xs text-gray-600">Tap <strong>Send on WhatsApp</strong> to open a pre-written message to your own number. Copy it and paste into your WhatsApp Broadcast list to reach all your customers at once.</p>
          </div>
        </div>

        {/* How to broadcast tip */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="font-semibold text-amber-800 text-xs mb-2">💡 How to reach all customers at once</p>
          <ol className="text-xs text-amber-700 space-y-1 list-decimal list-inside">
            <li>Open WhatsApp → tap the menu (⋮)</li>
            <li>Select <strong>New Broadcast</strong></li>
            <li>Add your customers' numbers</li>
            <li>Paste the message and send</li>
          </ol>
        </div>

        {/* Templates */}
        <h2 className="font-display font-bold text-brand-dark text-sm uppercase tracking-wide px-1">Message Templates</h2>

        {templates.map(t => (
          <div key={t.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            {/* Template header */}
            <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-3">
              <span className="text-2xl">{t.emoji}</span>
              <div>
                <p className="font-display font-bold text-brand-dark text-sm">{t.title}</p>
                <p className="text-xs text-gray-400">{t.description}</p>
              </div>
            </div>

            {/* Message preview */}
            <div className="px-4 py-3">
              <div className="bg-[#DCF8C6] rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-800 whitespace-pre-line leading-relaxed font-[system-ui] text-xs">
                {t.message}
              </div>
            </div>

            {/* Action buttons */}
            <div className="px-4 pb-4 flex gap-2">
              <button
                onClick={() => handleSend(t.message)}
                className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white text-xs font-bold py-2.5 rounded-xl hover:opacity-90 transition-opacity">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                Send on WhatsApp
              </button>
              <button
                onClick={() => handleCopy(t.id, t.message)}
                className="flex items-center justify-center gap-1.5 bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-2.5 rounded-xl hover:bg-gray-200 transition-colors min-w-[80px]">
                {copiedId === t.id ? (
                  <><Check size={13} className="text-green-600" /> Copied!</>
                ) : (
                  <><Copy size={13} /> Copy</>
                )}
              </button>
            </div>
          </div>
        ))}

        {/* Bottom tip */}
        <div className="text-center text-xs text-gray-400 pt-2">
          <p>Messages include your store link automatically.</p>
          <p>You can edit the message in WhatsApp before sending.</p>
        </div>
      </div>
    </div>
  )
}
