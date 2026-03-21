'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, Loader2, ShoppingBag, Upload, Camera } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { COUNTRY_LIST } from '@/lib/countries-cities'
import { COUNTRIES, normalizeNumber } from '@/lib/countries'
import { uploadProductImage } from '@/lib/storage'

interface Merchant {
  id: string
  business_name: string
  slug: string
  location: string
  address: string
  whatsapp_number: string
  category: string
  email: string
  description: string
  logo_url: string
  theme_color: string
  order_mode: string
  login_pin: string
}

const LOCATIONS = [
  'Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan',
  'Benin City', 'Onitsha', 'Aba', 'Enugu', 'Warri',
  'Kaduna', 'Calabar', 'Jos', 'Ilorin', 'Other'
]

const THEME_COLORS = [
  { name: 'Green', value: '#1A7A4A', bg: 'bg-[#1A7A4A]' },
  { name: 'Blue', value: '#1A56DB', bg: 'bg-[#1A56DB]' },
  { name: 'Purple', value: '#7E3AF2', bg: 'bg-[#7E3AF2]' },
  { name: 'Red', value: '#E02424', bg: 'bg-[#E02424]' },
  { name: 'Orange', value: '#FF5A1F', bg: 'bg-[#FF5A1F]' },
  { name: 'Black', value: '#111827', bg: 'bg-[#111827]' },
  { name: 'Teal', value: '#0694A2', bg: 'bg-[#0694A2]' },
  { name: 'Pink', value: '#E74694', bg: 'bg-[#E74694]' },
]

export default function SettingsPage() {
  const router = useRouter()
  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [uploadingLogo, setUploadingLogo] = useState(false)

  const [businessName, setBusinessName] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [location, setLocation] = useState('')
  const [storeCountry, setStoreCountry] = useState('NG')
  const [customCity, setCustomCity] = useState('')
  const [whatsappRaw, setWhatsappRaw] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0])
  const [showCountryPicker, setShowCountryPicker] = useState(false)
  const [orderMode, setOrderMode] = useState('both')
  const [loginPin, setLoginPin] = useState('')
  const [themeColor, setThemeColor] = useState('#1A7A4A')
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      const fallbackEmail = typeof window !== 'undefined' ? localStorage.getItem('earket_merchant_email') : null
      const merchantEmail = user?.email || fallbackEmail
      if (!merchantEmail) { router.push('/login'); return }
      const { data: m } = await supabase.from('merchants').select('*').eq('email', merchantEmail).single()
      if (!m) { router.push('/onboarding'); return }
      setMerchant(m)
      setBusinessName(m.business_name || '')
      setDescription(m.description || '')
      setAddress(m.address || '')
      setLocation(m.location || '')
      if (m.country) setStoreCountry(m.country)
      setOrderMode(m.order_mode || 'both')
      setLoginPin(m.login_pin || '')
      setThemeColor(m.theme_color || '#1A7A4A')
      setLogoUrl(m.logo_url || null)
      const wa = m.whatsapp_number || ''
      const country = COUNTRIES.find(c => c.dial && wa.startsWith(c.dial)) || COUNTRIES[0]
      setSelectedCountry(country)
      setWhatsappRaw(wa.startsWith(country.dial) ? wa.slice(country.dial.length) : wa)
      setLoading(false)
    }
    load()
  }, [router])

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !merchant) return
    setUploadingLogo(true)
    const reader = new FileReader()
    reader.onload = () => setLogoPreview(reader.result as string)
    reader.readAsDataURL(file)
    const url = await uploadProductImage(file, merchant.id + '-logo')
    if (url) setLogoUrl(url)
    setUploadingLogo(false)
  }

  async function handleSave() {
    if (!merchant) return
    setSaving(true)
    setError('')
    const normalized = normalizeNumber(whatsappRaw, selectedCountry.dial)
    const { error: updateError } = await supabase
      .from('merchants')
      .update({
        business_name: businessName,
        description,
        address,
        location,
        country: storeCountry,
        whatsapp_number: normalized,
        phone: normalized,
        order_mode: orderMode,
        login_pin: loginPin || null,
        theme_color: themeColor,
        logo_url: logoUrl,
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

  const currentLogo = logoPreview || logoUrl

  return (
    <div className="min-h-screen bg-gray-50 max-w-lg mx-auto pb-10">
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <Link href="/dashboard" className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
          <ArrowLeft size={16} className="text-gray-600" />
        </Link>
        <h1 className="font-display font-bold text-brand-dark flex-1">Store Settings</h1>
        {saved && <div className="flex items-center gap-1.5 text-brand-green text-xs font-semibold"><Check size={14} /> Saved!</div>}
      </div>

      <div className="p-4 space-y-5">

        {/* Logo Upload */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-3">Store Logo</label>
          <input type="file" id="logo-upload" accept="image/*" className="hidden" onChange={handleLogoUpload} />
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-brand-light flex items-center justify-center border-2 border-gray-200 relative">
              {currentLogo ? (
                <img src={currentLogo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <ShoppingBag size={28} className="text-brand-green" />
              )}
              {uploadingLogo && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 size={16} className="text-white animate-spin" />
                </div>
              )}
            </div>
            <div>
              <label htmlFor="logo-upload"
                className="flex items-center gap-2 bg-white border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-brand-green cursor-pointer transition-colors">
                <Camera size={16} /> Upload Logo
              </label>
              <p className="text-xs text-gray-400 mt-1.5">Square image recommended (PNG, JPG)</p>
            </div>
          </div>
        </div>

        {/* Theme Color */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-3">Store Color</label>
          <div className="flex gap-2 flex-wrap">
            {THEME_COLORS.map(color => (
              <button key={color.value} onClick={() => setThemeColor(color.value)}
                className={`w-10 h-10 rounded-xl ${color.bg} transition-all ${
                  themeColor === color.value ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'
                }`}
                title={color.name} />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">Selected: {THEME_COLORS.find(c => c.value === themeColor)?.name || 'Custom'}</p>
        </div>

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
            placeholder="Tell customers what you sell..." rows={3}
            className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:border-brand-green outline-none resize-none" />
        </div>

        {/* Address */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Business Address</label>
          <textarea value={address} onChange={e => setAddress(e.target.value)}
            placeholder="e.g. 12 Allen Avenue, Ikeja, Lagos" rows={2}
            className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:border-brand-green outline-none resize-none" />
          <p className="text-xs text-gray-400 mt-1">Shown on your storefront so customers can find you</p>
        </div>

        {/* Location */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">City</label>
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

        {/* WhatsApp */}
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
            <div className="mt-2 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg max-h-52 overflow-y-auto">
              {COUNTRIES.map(c => (
                <button key={c.code} onClick={() => { setSelectedCountry(c); setShowCountryPicker(false) }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 ${selectedCountry.code === c.code ? 'bg-brand-light text-brand-green font-semibold' : 'text-gray-700'}`}>
                  <span>{c.flag}</span><span className="flex-1 text-left">{c.name}</span><span className="text-gray-400">+{c.dial}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Login PIN */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Login Password</label>
          <input type="password" placeholder="Your login password" value={loginPin}
            onChange={e => setLoginPin(e.target.value)}
            className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:border-brand-green outline-none" />
          <p className="text-xs text-gray-400 mt-1">Change your login password here</p>
        </div>

        {/* Order Mode */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Ordering Mode</label>
          <div className="space-y-2">
            {[
              { value: 'both', label: 'WhatsApp + Cart', desc: 'Customers can order via WhatsApp or add to cart' },
              { value: 'whatsapp', label: 'WhatsApp Only', desc: 'Customers order directly via WhatsApp' },
              { value: 'cart', label: 'Cart & Checkout Only', desc: 'Customers complete orders on site' },
            ].map(mode => (
              <button key={mode.value} onClick={() => setOrderMode(mode.value)}
                className={`w-full flex items-start gap-3 p-3 rounded-2xl border-2 text-left transition-all ${
                  orderMode === mode.value ? 'border-brand-green bg-brand-light' : 'border-gray-200 hover:border-brand-green/40'
                }`}>
                <div className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${orderMode === mode.value ? 'border-brand-green' : 'border-gray-300'}`}>
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

        {/* Store Link */}
        <div className="bg-brand-light rounded-2xl p-4">
          <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">Your Store Link</p>
          <p className="font-display font-bold text-brand-green text-sm">earket.com/store/{merchant?.slug}</p>
          <Link href={`/store/${merchant?.slug}`} target="_blank" className="inline-block mt-2 text-xs text-brand-green font-semibold underline">
            View store →
          </Link>
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3"><p className="text-red-600 text-xs">{error}</p></div>}

        <button onClick={handleSave} disabled={saving}
          className="w-full bg-brand-green text-white font-bold py-4 rounded-2xl hover:bg-brand-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {saving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Check size={18} /> Save Changes</>}
        </button>

        <button onClick={async () => { await supabase.auth.signOut(); localStorage.removeItem('earket_merchant_email'); router.push('/') }}
          className="w-full text-sm text-red-500 font-semibold py-2">
          Sign out
        </button>
      </div>
    </div>
  )
}
