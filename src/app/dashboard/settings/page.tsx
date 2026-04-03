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
  profile_photo_url?: string
  business_type?: string
  theme_color: string
  theme_preset?: string
  order_mode: string
  login_pin: string
  instagram?: string
  facebook?: string
  linkedin?: string
  twitter_x?: string
  website?: string
}

const LOCATIONS = [
  'Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan',
  'Benin City', 'Onitsha', 'Aba', 'Enugu', 'Warri',
  'Kaduna', 'Calabar', 'Jos', 'Ilorin', 'Other'
]


interface Testimonial {
  name: string
  role: string
  text: string
  rating: number
}

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
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null)
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null)
  const [uploadingProfilePhoto, setUploadingProfilePhoto] = useState(false)
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null)
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null)
  const [uploadingHero, setUploadingHero] = useState(false)
  const [heroOverlay, setHeroOverlay] = useState(0.45)
  const [heroTextColor, setHeroTextColor] = useState<'white' | 'dark'>('white')
  const [heroFont, setHeroFont] = useState<'default' | 'serif' | 'mono'>('default')
  const [logoPosition, setLogoPosition] = useState<'center' | 'top-left' | 'top-right' | 'hidden'>('center')
  const [logoSize, setLogoSize] = useState<'small' | 'medium' | 'large'>('medium')
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center')
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md')
  const [textVertical, setTextVertical] = useState<'top' | 'middle' | 'bottom'>('middle')
  const [holidayMode, setHolidayMode] = useState(false)
  const [holidayMessage, setHolidayMessage] = useState('')
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    { name: '', role: '', text: '', rating: 5 },
  ])
  const [socialInstagram, setSocialInstagram] = useState('')
  const [socialFacebook, setSocialFacebook] = useState('')
  const [socialLinkedin, setSocialLinkedin] = useState('')
  const [socialTwitter, setSocialTwitter] = useState('')
  const [socialWebsite, setSocialWebsite] = useState('')
  const [socialYoutube, setSocialYoutube] = useState('')
  const [socialTiktok, setSocialTiktok] = useState('')
  const [socialOther, setSocialOther] = useState('')

  const [businessHours, setBusinessHours] = useState<Record<string, {open: string; close: string; closed: boolean}>>({
    Mon: { open: '09:00', close: '17:00', closed: false },
    Tue: { open: '09:00', close: '17:00', closed: false },
    Wed: { open: '09:00', close: '17:00', closed: false },
    Thu: { open: '09:00', close: '17:00', closed: false },
    Fri: { open: '09:00', close: '17:00', closed: false },
    Sat: { open: '10:00', close: '15:00', closed: false },
    Sun: { open: '10:00', close: '15:00', closed: true },
  })

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
      setProfilePhotoUrl(m.profile_photo_url || null)
      setHeroImageUrl(m.hero_image_url || null)
      setHeroOverlay(m.hero_overlay ?? 0.45)
      setHeroTextColor(m.hero_text_color || 'white')
      setHeroFont(m.hero_font || 'default')
      setLogoPosition(m.logo_position || 'center')
      setLogoSize(m.logo_size || 'medium')
      setTextAlign(m.hero_text_align || 'center')
      setFontSize(m.hero_font_size || 'md')
      setTextVertical(m.hero_text_vertical || 'middle')
      setHolidayMode(m.holiday_mode || false)
      setHolidayMessage(m.holiday_message || '')
      if (m.business_hours) setBusinessHours(m.business_hours)
      if (m.testimonials) setTestimonials(m.testimonials)
      setSocialInstagram(m.instagram || '')
      setSocialFacebook(m.facebook || '')
      setSocialLinkedin(m.linkedin || '')
      setSocialTwitter(m.twitter_x || '')
      setSocialWebsite(m.website || '')
      setSocialYoutube(m.youtube || '')
      setSocialTiktok(m.tiktok || '')
      setSocialOther(m.other_link || '')
      const wa = m.whatsapp_number || ''
      const country = COUNTRIES.find(c => c.dial && wa.startsWith(c.dial)) || COUNTRIES[0]
      setSelectedCountry(country)
      setWhatsappRaw(wa.startsWith(country.dial) ? wa.slice(country.dial.length) : wa)
      setLoading(false)
    }
    load()
  }, [router])

  async function handleProfilePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !merchant) return
    setUploadingProfilePhoto(true)
    const reader = new FileReader()
    reader.onload = () => setProfilePhotoPreview(reader.result as string)
    reader.readAsDataURL(file)
    const url = await uploadProductImage(file, merchant.id + '-profile')
    if (url) setProfilePhotoUrl(url)
    setUploadingProfilePhoto(false)
  }

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
        profile_photo_url: profilePhotoUrl,
        hero_image_url: heroImageUrl,
        hero_overlay: heroOverlay,
        hero_text_color: heroTextColor,
        hero_font: heroFont,
        logo_position: logoPosition,
        logo_size: logoSize,
        hero_text_align: textAlign,
        hero_font_size: fontSize,
        hero_text_vertical: textVertical,
        holiday_mode: holidayMode,
        holiday_message: holidayMessage,
        business_hours: businessHours,
        testimonials: testimonials.filter(t => t.name.trim() && t.text.trim()),
        instagram: socialInstagram.trim() || null,
        facebook: socialFacebook.trim() || null,
        linkedin: socialLinkedin.trim() || null,
        twitter_x: socialTwitter.trim() || null,
        website: socialWebsite.trim() || null,
        youtube: socialYoutube.trim() || null,
        tiktok: socialTiktok.trim() || null,
        other_link: socialOther.trim() || null,
      })
      .eq('id', merchant.id)
    if (updateError) {
      setError('Failed to save. Please try again.')
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 4000)
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
      {/* Toast notification — success or error */}
      {(saved || error) && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-semibold transition-all duration-300 max-w-xs w-full mx-4
          ${saved ? 'bg-brand-green' : 'bg-red-500'}`}>
          {saved ? (
            <>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Check size={13} className="text-white" />
              </div>
              <div>
                <div className="font-bold text-sm">Changes saved!</div>
                <div className="text-white/75 text-xs font-normal">Your store has been updated.</div>
              </div>
            </>
          ) : (
            <>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div>
                <div className="font-bold text-sm">Save failed</div>
                <div className="text-white/75 text-xs font-normal">{error || 'Please try again.'}</div>
              </div>
              <button onClick={() => setError('')} className="ml-auto text-white/60 hover:text-white text-lg leading-none">×</button>
            </>
          )}
        </div>
      )}

      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <Link href="/dashboard" className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
          <ArrowLeft size={16} className="text-gray-600" />
        </Link>
        <h1 className="font-display font-bold text-brand-dark flex-1">Store Settings</h1>
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

        {/* Profile Photo \u2014 only for service businesses */}
        {merchant?.business_type === 'services' && (
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Profile Photo</label>
          <p className="text-xs text-gray-400 mb-3">Your face/headshot \u2014 shown on coaching & consultation pages. Makes your page feel personal and trustworthy.</p>
          <input type="file" id="profile-photo-upload" accept="image/*" className="hidden" onChange={handleProfilePhotoUpload} />
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-gray-200 relative shrink-0">
              {(profilePhotoPreview || profilePhotoUrl)
                ? <img src={profilePhotoPreview || profilePhotoUrl || ''} alt="Profile" className="w-full h-full object-cover" />
                : <span className="text-2xl"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green opacity-50"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
              }
              {uploadingProfilePhoto && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                  <Loader2 size={16} className="text-white animate-spin" />
                </div>
              )}
            </div>
            <div>
              <label htmlFor="profile-photo-upload"
                className="flex items-center gap-2 bg-white border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-brand-green cursor-pointer transition-colors">
                <Camera size={16} /> Upload Profile Photo
              </label>
              <p className="text-xs text-gray-400 mt-1.5">Your headshot or professional photo (PNG, JPG)</p>
            </div>
          </div>
        </div>
        )}

        {/* Hero Image & Appearance */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-3">Hero Image &amp; Appearance</label>

          {/* Merged preview + upload */}
          <div className="relative w-full h-44 rounded-2xl overflow-hidden border-2 border-gray-200 mb-3">
            {(heroImagePreview || heroImageUrl) ? (
              <img src={heroImagePreview || heroImageUrl!} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600" />
            )}
            <div className="absolute inset-0" style={{
              backgroundColor: heroTextColor === 'dark' ? `rgba(255,255,255,${heroOverlay * 0.6})` : `rgba(0,0,0,${heroOverlay})`
            }} />
            {/* Header bar — matches actual storefront */}
            <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm flex items-center gap-2 px-2 py-1.5 border-b border-gray-200/50 z-10">
              {(logoPreview || logoUrl) ? (
                <img src={logoPreview || logoUrl!} className={`rounded-lg object-contain flex-shrink-0 ${logoSize === 'small' ? 'w-5 h-5' : logoSize === 'large' ? 'w-9 h-9' : 'w-7 h-7'}`} />
              ) : (
                <div className={`rounded-lg bg-brand-green flex items-center justify-center text-white font-bold flex-shrink-0 ${logoSize === 'small' ? 'w-5 h-5 text-[8px]' : logoSize === 'large' ? 'w-9 h-9 text-sm' : 'w-7 h-7 text-xs'}`}>
                  {merchant?.business_name?.charAt(0) || 'B'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-gray-900 leading-tight truncate text-[10px] ${heroFont === 'serif' ? 'font-serif' : heroFont === 'mono' ? 'font-mono' : ''}`}>
                  {merchant?.business_name || 'Your Business'}
                </p>
              </div>
              <div className="bg-brand-green text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0">Book</div>
            </div>
            {/* Hero tagline preview */}
            <div className="absolute bottom-8 left-0 right-0 px-3">
              <p className="text-[9px] font-bold text-white/90 leading-tight">"{merchant?.description?.slice(0,40) || 'Quality service you can trust'}"</p>
              <p className="text-[8px] text-white/60 mt-0.5">{merchant?.location || 'Your City'}</p>
            </div>
            {/* Upload + remove buttons overlay */}
            <div className="absolute bottom-2 left-2 flex gap-2">
              <label className="flex items-center gap-1.5 bg-black/60 text-white rounded-xl px-3 py-1.5 text-xs font-semibold cursor-pointer hover:bg-black/80 transition-colors">
                {uploadingHero ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                {uploadingHero ? 'Uploading...' : heroImageUrl ? 'Change' : 'Upload Photo'}
                <input type="file" accept="image/*" className="hidden" disabled={uploadingHero}
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file || !merchant) return
                    setUploadingHero(true)
                    setHeroImagePreview(URL.createObjectURL(file))
                    try { const url = await uploadProductImage(file, merchant.id); setHeroImageUrl(url) }
                    catch { setHeroImagePreview(null) }
                    setUploadingHero(false)
                  }} />
              </label>
              {(heroImageUrl || heroImagePreview) && (
                <button onClick={() => { setHeroImageUrl(null); setHeroImagePreview(null) }}
                  className="bg-red-500/70 text-white rounded-xl px-3 py-1.5 text-xs font-semibold hover:bg-red-500 transition-colors">
                  Remove
                </button>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-3">Preview updates live · Recommended: 1200px wide landscape photo</p>

          {/* Compact 2-col grid for controls */}
          <div className="grid grid-cols-2 gap-3">

            {/* Overlay */}
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-600 block mb-1">Overlay Darkness — {Math.round(heroOverlay * 100)}%</label>
              <input type="range" min="0" max="80" step="5" value={Math.round(heroOverlay * 100)}
                onChange={e => setHeroOverlay(Number(e.target.value) / 100)}
                className="w-full accent-brand-green" />
              <div className="flex justify-between text-xs text-gray-400"><span>Lighter</span><span>Darker</span></div>
            </div>

            {/* Text Color */}
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">Text Color</label>
              <div className="flex gap-1.5">
                {(['white','dark'] as const).map(c => (
                  <button key={c} onClick={() => setHeroTextColor(c)} className={`flex-1 py-2 rounded-xl border-2 text-xs font-semibold transition-all ${heroTextColor === c ? 'border-brand-green bg-brand-light text-brand-green' : 'border-gray-200 text-gray-600'}`}>
                    {c === 'white' ? '⬜ White' : '⬛ Dark'}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Style */}
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">Font Style</label>
              <div className="flex gap-1.5">
                {([{key:'default',label:'Sans'},{key:'serif',label:'Serif'},{key:'mono',label:'Mono'}] as const).map(f => (
                  <button key={f.key} onClick={() => setHeroFont(f.key)} className={`flex-1 py-2 rounded-xl border-2 text-xs font-semibold transition-all ${heroFont === f.key ? 'border-brand-green bg-brand-light text-brand-green' : 'border-gray-200 text-gray-600'}`}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Horizontal Align */}
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">Text Position</label>
              <div className="flex gap-1.5">
                {([{key:'left',label:'⬅'},{key:'center',label:'↔'},{key:'right',label:'➡'}] as const).map(a => (
                  <button key={a.key} onClick={() => setTextAlign(a.key)} className={`flex-1 py-2 rounded-xl border-2 text-xs font-semibold transition-all ${textAlign === a.key ? 'border-brand-green bg-brand-light text-brand-green' : 'border-gray-200 text-gray-600'}`}>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Vertical Position */}
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">Vertical Position</label>
              <div className="flex gap-1.5">
                {([{key:'top',label:'Top'},{key:'middle',label:'Mid'},{key:'bottom',label:'Bot'}] as const).map(v => (
                  <button key={v.key} onClick={() => setTextVertical(v.key)} className={`flex-1 py-2 rounded-xl border-2 text-xs font-semibold transition-all ${textVertical === v.key ? 'border-brand-green bg-brand-light text-brand-green' : 'border-gray-200 text-gray-600'}`}>
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Name Size */}
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">Name Size</label>
              <div className="flex gap-1.5">
                {([{key:'sm',label:'S'},{key:'md',label:'M'},{key:'lg',label:'L'},{key:'xl',label:'XL'}] as const).map(f => (
                  <button key={f.key} onClick={() => setFontSize(f.key)} className={`flex-1 py-2 rounded-xl border-2 text-xs font-semibold transition-all ${fontSize === f.key ? 'border-brand-green bg-brand-light text-brand-green' : 'border-gray-200 text-gray-600'}`}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Logo Position */}
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">Logo Position</label>
              <div className="grid grid-cols-2 gap-1.5">
                {([{key:'center',label:'Center'},{key:'top-left',label:'↖ Left'},{key:'top-right',label:'↗ Right'},{key:'hidden',label:'Hidden'}] as const).map(p => (
                  <button key={p.key} onClick={() => setLogoPosition(p.key)} className={`py-2 rounded-xl border-2 text-xs font-semibold transition-all ${logoPosition === p.key ? 'border-brand-green bg-brand-light text-brand-green' : 'border-gray-200 text-gray-600'}`}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Logo Size */}
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">Logo Size</label>
              <div className="flex gap-1.5">
                {([{key:'small',label:'S'},{key:'medium',label:'M'},{key:'large',label:'L'}] as const).map(s => (
                  <button key={s.key} onClick={() => setLogoSize(s.key)} className={`flex-1 py-2 rounded-xl border-2 text-xs font-semibold transition-all ${logoSize === s.key ? 'border-brand-green bg-brand-light text-brand-green' : 'border-gray-200 text-gray-600'}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

                {/* Theme Picker - full grid */}
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
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-lg"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></div>
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
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Business Tagline / Slogan</label>
          <p className="text-xs text-gray-400 mb-2">This appears on your hero page. Make it catchy — e.g. "Lagos's most trusted solar installer" or "Fresh meals delivered daily."</p>
          <textarea value={description} onChange={e => setDescription(e.target.value)}
            placeholder="e.g. Lagos's most trusted solar installer" rows={2}
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
            View store \u2192
          </Link>
        </div>


        {/* Testimonials */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-brand-dark text-sm">Client Testimonials</h2>
            {testimonials.length < 5 && (
              <button onClick={() => setTestimonials(t => [...t, { name: '', role: '', text: '', rating: 5 }])}
                className="text-xs font-semibold text-brand-green bg-brand-light px-3 py-1.5 rounded-lg">
                + Add
              </button>
            )}
          </div>
          <p className="text-xs text-gray-400 mb-3">Add up to 5 real client reviews. These replace the placeholder reviews on your store page.</p>
          <div className="space-y-4">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500">Review {i + 1}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <button key={s} onClick={() => setTestimonials(prev => prev.map((r, j) => j === i ? { ...r, rating: s } : r))}>
                          <span className={`text-sm ${s <= t.rating ? 'text-amber-400' : 'text-gray-300'}`}>★</span>
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setTestimonials(prev => prev.filter((_, j) => j !== i))}
                      className="text-red-400 text-xs font-semibold">✕</button>
                  </div>
                </div>
                <input value={t.name} onChange={e => setTestimonials(prev => prev.map((r, j) => j === i ? { ...r, name: e.target.value } : r))}
                  placeholder="Client name" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-green" />
                <input value={t.role} onChange={e => setTestimonials(prev => prev.map((r, j) => j === i ? { ...r, role: e.target.value } : r))}
                  placeholder="Role or title (e.g. Entrepreneur, Teacher)" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-green" />
                <textarea value={t.text} onChange={e => setTestimonials(prev => prev.map((r, j) => j === i ? { ...r, text: e.target.value } : r))}
                  placeholder="What did they say about your service?" rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-green resize-none" />
              </div>
            ))}
          </div>
        </div>

        {/* Holiday / Closure Mode */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
          <h2 className="font-display font-bold text-brand-dark text-sm">Holiday / Closure Mode</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-700">Close my store temporarily</p>
              <p className="text-xs text-gray-400 mt-0.5">Customers will see a notice that you're unavailable</p>
            </div>
            <button onClick={() => setHolidayMode(v => !v)}
              className={`relative w-12 h-6 rounded-full transition-colors ${holidayMode ? 'bg-red-500' : 'bg-gray-200'}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${holidayMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
          {holidayMode && (
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Message to customers (optional)</label>
              <input value={holidayMessage} onChange={e => setHolidayMessage(e.target.value)}
                placeholder="e.g. We're closed for the holidays. Back on Jan 5th!"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green" />
            </div>
          )}
        </div>

        {/* Business Hours */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h2 className="font-display font-bold text-brand-dark text-sm mb-3">Business Hours</h2>
          <div className="space-y-2">
            {Object.entries(businessHours).map(([day, val]) => (
              <div key={day} className="flex items-center gap-2">
                <div className="w-10 text-xs font-semibold text-gray-500">{day}</div>
                <button onClick={() => setBusinessHours(h => ({ ...h, [day]: { ...h[day], closed: !h[day].closed } }))}
                  className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${val.closed ? 'bg-gray-200' : 'bg-brand-green'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${val.closed ? 'translate-x-0.5' : 'translate-x-5'}`} />
                </button>
                {val.closed ? (
                  <span className="text-xs text-gray-400 ml-1">Closed</span>
                ) : (
                  <div className="flex items-center gap-1.5 flex-1">
                    <input type="time" value={val.open}
                      onChange={e => setBusinessHours(h => ({ ...h, [day]: { ...h[day], open: e.target.value } }))}
                      className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-brand-green" />
                    <span className="text-xs text-gray-400">to</span>
                    <input type="time" value={val.close}
                      onChange={e => setBusinessHours(h => ({ ...h, [day]: { ...h[day], close: e.target.value } }))}
                      className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-brand-green" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4">
          <div>
            <h2 className="font-display font-bold text-brand-dark text-sm">Social Media &amp; Website</h2>
            <p className="text-xs text-gray-400 mt-0.5">These links appear on your public store page so customers can follow you.</p>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">📸 <span className="text-pink-500">Instagram</span></label>
              <input value={socialInstagram} onChange={e => setSocialInstagram(e.target.value)}
                placeholder="@yourbusiness"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">📘 <span className="text-blue-500">Facebook</span></label>
              <input value={socialFacebook} onChange={e => setSocialFacebook(e.target.value)}
                placeholder="facebook.com/yourbusiness or username"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">💼 <span className="text-sky-500">LinkedIn</span></label>
              <input value={socialLinkedin} onChange={e => setSocialLinkedin(e.target.value)}
                placeholder="linkedin.com/in/yourname or username"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">𝕏 <span className="text-gray-700">X / Twitter</span></label>
              <input value={socialTwitter} onChange={e => setSocialTwitter(e.target.value)}
                placeholder="@yourhandle"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">🌐 <span className="text-brand-green">Website</span></label>
              <input value={socialWebsite} onChange={e => setSocialWebsite(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">▶️ <span className="text-red-500">YouTube</span></label>
              <input value={socialYoutube} onChange={e => setSocialYoutube(e.target.value)}
                placeholder="youtube.com/@yourchannel or channel URL"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">🎵 <span className="text-gray-800">TikTok</span></label>
              <input value={socialTiktok} onChange={e => setSocialTiktok(e.target.value)}
                placeholder="@yourtiktok"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">🔗 <span className="text-purple-500">Other Link</span></label>
              <input value={socialOther} onChange={e => setSocialOther(e.target.value)}
                placeholder="Any other link — Snapchat, Pinterest, WeChat, Telegram, etc."
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green" />
              <p className="text-xs text-gray-400 mt-1">Use this for any platform not listed above.</p>
            </div>
          </div>
          {(socialInstagram || socialFacebook || socialLinkedin || socialTwitter || socialWebsite || socialYoutube || socialTiktok || socialOther) && (
            <div className="bg-brand-light rounded-xl p-3">
              <p className="text-xs font-semibold text-brand-green mb-1">✓ These links are live on your store page</p>
              <p className="text-xs text-gray-500">Customers can see and click them in the Find Us section of your store.</p>
            </div>
          )}
        </div>

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
