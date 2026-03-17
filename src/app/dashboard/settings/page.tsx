'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, Loader2, ShoppingBag } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { COUNTRIES, normalizeNumber } from '@/lib/countries'

interface Merchant {
  id: string
  business_name: string
  slug: string
  location: string
  whatsapp_number: string
  category: string
  email: string
  description: string
}

const LOCATIONS = [
  'Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan',
  'Benin City', 'Onitsha', 'Aba', 'Enugu', 'Warri',
  'Kaduna', 'Calabar', 'Jos', 'Ilorin', 'Other'
]

export default function SettingsPage() {
  const router = useRouter()
  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const [businessName, setBusinessName] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [whatsappRaw, setWhatsappRaw] = useState('')
  const [dialCode, setDialCode] = useState('234')
  const [showCountryPicker, setShowCountryPicker] = useState(false)
  const [orderMode, setOrderMode] = useState('both')
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0])

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: m } = await supabase.from('merchants').select('*').eq('email', user.email).single()
      if (!m) { router.push('/onboarding'); return }
      setMerchant(m)
      setBusinessName(m.business_name || '')
      setDescription(m.description || '')
      setLocation(m.location || '')
      // Parse existing whatsapp number
      const wa = m.whatsapp_number || ''
      const country = COUNTRIES.find(c => c.dial && wa.startsWith(c.dial)) || COUNTRIES[0]
      setSelectedCountry(country)
      setDialCode(country.dial)
      setWhatsappRaw(wa.startsWith(country.dial) ? wa.slice(country.dial.length) : wa)
      setOrderMode(m.order_mode || 'both')
      setLoading(false)
    }
    load()
  }, [router])

  async function handleSave() {
    if (!merchant) return
    setSaving(true)
    setError('')
    const normalized = normalizeNumber(whatsappRaw, dialCode)
    const { error: updateError } = await supabase
      .from('merchants')
      .update({
        business_name: businessName,
        description,
        location,
        whatsapp_number: normalized,
        order_mode: orderMode,
        phone: normalized,
      })
      .eq('id', merchant.id)
    if (updateError) {
      setError('Failed to save. Please try again.')
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={24} className="text-brand-green animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-lg mx-auto">
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/dashboard" className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
          <ArrowLeft size={16} className="text-gray-600" />
        </Link>
        <h1 className="font-display font-bold text-brand-dark">Store Settings</h1>
        {saved && (
          <div className="ml-auto flex items-center gap-1.5 text-brand-green text-xs font-semibold">
            <Check size={14} /> Saved
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Business Name */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Business Name</label>
          <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)}
            className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:border-brand-green outline-none" />
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Store Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)}
            placeholder="Tell customers what you sell and what makes your store special..."
            rows={3}
            className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:border-brand-green outline-none resize-none" />
        </div>

        {/* WhatsApp Number */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">WhatsApp Business Number</label>
          <div className="flex gap-2">
            <button onClick={() => setShowCountryPicker(!showCountryPicker)}
              className="flex items-center gap-1.5 bg-white border-2 border-gray-200 rounded-xl px-3 py-3 text-sm font-semibold hover:border-brand-green transition-colors shrink-0">
              <span>{selectedCountry.flag}</span>
              <span className="text-gray-600">+{selectedCountry.dial}</span>
            </button>
            <input type="tel" value={whatsappRaw} onChange={e => setWhatsappRaw(e.target.value)}
              placeholder="Phone number"
              className="flex-1 bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:border-brand-green outline-none" />
          </div>
          {showCountryPicker && (
            <div className="mt-2 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg max-h-60 overflow-y-auto">
              {COUNTRIES.map(c => (
                <button key={c.code} onClick={() => {
                  setSelectedCountry(c)
                  setDialCode(c.dial)
                  setShowCountryPicker(false)
                }} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                  selectedCountry.code === c.code ? 'bg-brand-light text-brand-green font-semibold' : 'text-gray-700'
                }`}>
                  <span>{c.flag}</span>
                  <span className="flex-1 text-left">{c.name}</span>
                  <span className="text-gray-400">+{c.dial}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Location</label>
          <div className="grid grid-cols-3 gap-2">
            {LOCATIONS.map(loc => (
              <button key={loc} onClick={() => setLocation(loc)}
                className={`py-2 px-2 rounded-xl border-2 text-xs font-semibold transition-all ${
                  location === loc ? 'border-brand-green bg-brand-light text-brand-green' : 'border-gray-200 text-gray-600'
                }`}>
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Order Mode */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Ordering Mode</label>
          <p className="text-xs text-gray-400 mb-3">How do you want customers to place orders?</p>
          <div className="space-y-2">
            {[
              { value: 'both', label: 'WhatsApp + Cart', desc: 'Customers can order via WhatsApp or add to cart and checkout on site' },
              { value: 'whatsapp', label: 'WhatsApp Only', desc: 'Customers tap WhatsApp to order directly with you' },
              { value: 'cart', label: 'Cart & Checkout Only', desc: 'Customers add to cart and complete orders on site' },
            ].map(mode => (
              <button key={mode.value} onClick={() => setOrderMode(mode.value)}
                className={`w-full flex items-start gap-3 p-3 rounded-2xl border-2 text-left transition-all ${
                  orderMode === mode.value ? 'border-brand-green bg-brand-light' : 'border-gray-200 hover:border-brand-green/40'
                }`}>
                <div className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${
                  orderMode === mode.value ? 'border-brand-green' : 'border-gray-300'
                }`}>
                  {orderMode === mode.value && <div className="w-2 h-2 bg-brand-green rounded-full" />}
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">{mode.label}</div>
                  <div className="text-xs text-gray-400">{mode.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Store link */}
        <div className="bg-brand-light rounded-2xl p-4">
          <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">Your Store Link</p>
          <p className="font-display font-bold text-brand-green text-sm">earket.com/store/{merchant?.slug}</p>
          <Link href={`/store/${merchant?.slug}`} target="_blank"
            className="inline-block mt-2 text-xs text-brand-green font-semibold underline">
            View store →
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-red-600 text-xs">{error}</p>
          </div>
        )}

        <button onClick={handleSave} disabled={saving}
          className="w-full bg-brand-green text-white font-bold py-4 rounded-2xl hover:bg-brand-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {saving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Check size={18} /> Save Changes</>}
        </button>

        {/* Danger zone */}
        <div className="border border-red-100 rounded-2xl p-4">
          <p className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-3">Account</p>
          <button onClick={async () => { await supabase.auth.signOut(); router.push('/') }}
            className="text-sm text-red-500 font-semibold">
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
