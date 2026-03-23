'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, Loader2, ShoppingBag, Upload, Camera } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { COUNTRY_LIST } from '@/lib/countries-cities'
import { COUNTRIES, normalizeNumber } from '@/lib/countries'
import { EARKET_THEMES, getThemeStyle, getThemeById, type EarketTheme } from '@/lib/themes'
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
  theme_preset?: string
  order_mode: string
  login_pin: string
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
  const [selectedTheme, setSelectedTheme] = useState<EarketTheme>(EARKET_THEMES[0])
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
      if (m.location) {
        // Check if location is in the cities list for the country
        const { COUNTRY_LIST: cl } = await import('@/lib/countries-cities')
        const countryData = cl.find(c => c.code === (m.country || 'NG'))
        if (countryData && !countryData.cities.includes(m.location)) {
          setCustomCity(m.location)
        }
      }
      setOrderMode(m.order_mode || 'both')
      setLoginPin(m.login_pin || '')
      setThemeColor(m.theme_color || '#1A7A4A')
      if (m.theme_preset) {
        const t = getThemeById(m.theme_preset)
        setSelectedTheme(t)
      }
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
        theme_color: selectedTheme.primary,
        theme_preset: selectedTheme.id,
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

        {/* Theme Picker — full grid */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-3">Brand Theme</label>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {EARKET_THEMES.map(theme => (
              <button key={theme.id} onClick={() => { setSelectedTheme(theme); setThemeColor(theme.primary) }}
                className={`relative rounded-2xl overflow-hidden border-2 transition-all ${
                  selectedTheme.id === theme.id ? 'border-brand-green scale-105 shadow-md' : 'border-gray-200 hover:border-gray-300'
                }`}>
                <div className="h-10 w-full" style={getThemeStyle(theme) as React.CSSProperties} />
                <div className="bg-white px-2 py-1.5 text-center">
                  <p className="text-xs font-semibold text-gray-700 leading-tight">{theme.emoji} {theme.name}</p>
                </div>
                {selectedTheme.id === theme.id && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-brand-green rounded-full flex items-center justify-center">
                    <svg viewBox="0 0 12 10" className="w-3 h-3"><path d="M1 5l3 4L11 1" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                )}
              </button>
            ))}
          </div>
          {/* Preview */}
          <div className="rounded-2xl overflow-hidden border border-gray-200">
            <div className="h-14 flex items-center px-4 gap-3" style={getThemeStyle(selectedTheme) as React.CSSProperties}>
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-lg">💼</div>
              <div>
                <p className="font-display font-bold text-sm" style={{ color: selectedTheme.textOnPrimary }}>{businessName || merchant?.business_name}</p>
                <p className="text-xs opacity-70" style={{ color: selectedTheme.textOnPrimary }}>{selectedTheme.name} theme</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">This will update your store page immediately after saving</p>
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

        {/* Country */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Country</label>
          <select value={storeCountry} onChange={e => { setStoreCountry(e.target.value); setLocation('') }}
            className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-green outline-none">
            {COUNTRY_LIST.map(c => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">City</label>
          <div className="grid grid-cols-3 gap-2">
            {(COUNTRY_LIST.find(c => c.code === storeCountry)?.cities || []).map(loc => (
              <button key={loc} onClick={() => setLocation(loc)}
                className={`py-2 px-2 rounded-xl border-2 text-xs font-semibold transition-all ${
                  location === loc ? 'border-brand-green bg-brand-light text-brand-green' : 'border-gray-200 text-gray-600'
                }`}>
                {loc}
              </button>
            ))}
            <button onClick={() => setLocation('')}
              className={`py-2 px-2 rounded-xl border-2 text-xs font-semibold transition-all ${
                !COUNTRY_LIST.find(c => c.code === storeCountry)?.cities.includes(location) ? 'border-brand-green bg-brand-light text-brand-green' : 'border-gray-200 text-gray-600'
              }`}>
              Other
            </button>
          </div>
          {!COUNTRY_LIST.find(c => c.code === storeCountry)?.cities.includes(location) && (
            <input type="text" value={location} onChange={e => setLocation(e.target.value)}
              placeholder="Type your city or town"
              className="mt-2 w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-green outline-none" />
          )}
        </div>

        {/* WhatsApp */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">WhatsApp Business Number</label>
          <div className="flex gap-2">
            <button onClick={() => setShowCountryPicker(!showCountryPicker)}
              className="flex items-center gap-1.5 bg-white border-2 border-gray-200 rounded-xl px-3 py-3 text-sm font-semibold hover:border-brand-green transition-colors shrink-0">
              <img src={`https://flagcdn.com/20x15/${selectedCountry.code.toLowerCase()}.png`}
                alt={selectedCountry.name} className="w-5 h-4 object-cover rounded-sm"
                onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
              <span className="text-gray-600 text-sm font-semibold">+{selectedCountry.dial}</span>
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
                  <img src={`https://flagcdn.com/20x15/${c.code.toLowerCase()}.png`}
                    alt={c.name} className="w-5 h-4 object-cover rounded-sm shrink-0"
                    onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
                  <span className="flex-1 text-left">{c.name}</span><span className="text-gray-400">+{c.dial}</span>
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
