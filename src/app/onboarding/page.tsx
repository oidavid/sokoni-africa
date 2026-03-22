'use client'
import { useState, useRef } from 'react'
import { ArrowRight, ArrowLeft, Loader2, Check, ShoppingBag, Mail, MessageCircle, Eye, EyeOff, Lock, Mic, MicOff, X, Plus } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getSampleProducts } from '@/lib/sample-products'
import { getSampleServices } from '@/lib/sample-services'
import { COUNTRIES, normalizeNumber } from '@/lib/countries'
import { COUNTRY_LIST } from '@/lib/countries-cities'

type Step = 'language' | 'business' | 'whatsapp' | 'email' | 'password' | 'biztype' | 'category' | 'subcategory' | 'location' | 'products' | 'generating' | 'done'

const CATEGORIES = [
  { id: 'food', label: 'Food & Drinks', emoji: '🍱', pidgin: 'Food & Drink' },
  { id: 'groceries', label: 'Groceries & Provisions', emoji: '🛒', pidgin: 'Provisions & Groceries' },
  { id: 'fashion', label: 'Fashion & Clothing', emoji: '👗', pidgin: 'Cloth & Fashion' },
  { id: 'beauty', label: 'Beauty & Hair', emoji: '💄', pidgin: 'Beauty & Hair' },
  { id: 'shoes', label: 'Shoes & Bags', emoji: '👟', pidgin: 'Shoes & Bags' },
  { id: 'electronics', label: 'Electronics & Gadgets', emoji: '📱', pidgin: 'Electronics & Gadgets' },
  { id: 'phones', label: 'Phones & Laptops', emoji: '💻', pidgin: 'Phone & Laptop' },
  { id: 'furniture', label: 'Furniture & Home', emoji: '🪑', pidgin: 'Furniture & Home' },
  { id: 'health', label: 'Health & Pharmacy', emoji: '💊', pidgin: 'Health & Pharmacy' },
  { id: 'stationery', label: 'Stationery & Office', emoji: '📚', pidgin: 'Books & Office' },
  { id: 'automobile', label: 'Auto Parts & Car', emoji: '🚗', pidgin: 'Car & Auto Parts' },
  { id: 'other', label: 'Other Business', emoji: '🏪', pidgin: 'Other Business' },
]

const SERVICE_CATEGORIES = [
  { id: 'home_services', label: 'Home & Technical', emoji: '🔧', pidgin: 'Home Repair & Technical' },
  { id: 'auto_services', label: 'Auto & Vehicle', emoji: '🚗', pidgin: 'Car & Vehicle' },
  { id: 'beauty_services', label: 'Beauty & Personal Care', emoji: '💄', pidgin: 'Beauty & Style' },
  { id: 'education', label: 'Education & Tutoring', emoji: '📚', pidgin: 'Teaching & Tutoring' },
  { id: 'health_wellness', label: 'Health & Wellness', emoji: '🏥', pidgin: 'Health & Wellness' },
  { id: 'domestic', label: 'Domestic Services', emoji: '🏠', pidgin: 'House Help & Cleaning' },
  { id: 'events', label: 'Events & Occasions', emoji: '🎉', pidgin: 'Events & Party' },
  { id: 'digital_services', label: 'Digital & Tech', emoji: '💻', pidgin: 'Digital & Tech' },
  { id: 'transport', label: 'Transport & Delivery', emoji: '🚚', pidgin: 'Delivery & Transport' },
  { id: 'agriculture', label: 'Agriculture', emoji: '🌱', pidgin: 'Farm & Agriculture' },
]

const SERVICE_SUBCATEGORIES: Record<string, Array<{ id: string; label: string; emoji: string }>> = {
  home_services: [
    { id: 'electrician', label: 'Electrician / House Wiring', emoji: '⚡' },
    { id: 'plumber', label: 'Plumber', emoji: '🔧' },
    { id: 'generator', label: 'Generator Repair', emoji: '🔌' },
    { id: 'ac', label: 'AC / Air Conditioning', emoji: '❄️' },
    { id: 'painter', label: 'Painter', emoji: '🖌️' },
    { id: 'tiler', label: 'Tiling & Flooring', emoji: '🏠' },
    { id: 'solar', label: 'Solar Installation', emoji: '☀️' },
    { id: 'carpenter', label: 'Carpenter', emoji: '🪵' },
    { id: 'welder', label: 'Welder / Metal Work', emoji: '⚙️' },
    { id: 'general', label: 'General House Repairs', emoji: '🛠️' },
  ],
  auto_services: [
    { id: 'mechanic', label: 'Mechanic / Car Service', emoji: '🔩' },
    { id: 'carwash', label: 'Car Wash', emoji: '🚿' },
    { id: 'tyres', label: 'Tyre Repair / Vulcanizer', emoji: '🛞' },
    { id: 'brakes', label: 'Brakes & Suspension', emoji: '🛑' },
    { id: 'auto_electrician', label: 'Auto Electrician', emoji: '⚡' },
    { id: 'panel_beater', label: 'Panel Beating / Body Repair', emoji: '🚘' },
    { id: 'detailing', label: 'Car Detailing', emoji: '✨' },
    { id: 'motorcycle', label: 'Motorcycle Repair', emoji: '🏍️' },
  ],
  beauty_services: [
    { id: 'massage', label: 'Massage & Body Therapy', emoji: '💆' },
    { id: 'braiding', label: 'Hair Braiding & Styling', emoji: '💇' },
    { id: 'makeup', label: 'Makeup Artist', emoji: '💄' },
    { id: 'nails', label: 'Nails & Manicure', emoji: '💅' },
    { id: 'barber', label: "Barber / Men's Grooming", emoji: '✂️' },
    { id: 'skincare', label: 'Skincare & Facial', emoji: '🧴' },
    { id: 'wigs', label: 'Wig Making & Installation', emoji: '👱' },
    { id: 'threading', label: 'Eyebrow Threading', emoji: '🪡' },
    { id: 'relaxer', label: 'Hair Relaxer & Treatment', emoji: '🧪' },
  ],
  education: [
    { id: 'primary', label: 'Primary School Tutoring', emoji: '📖' },
    { id: 'exam_prep', label: 'WAEC / JAMB Exam Prep', emoji: '📝' },
    { id: 'computer', label: 'Computer Training', emoji: '💻' },
    { id: 'music', label: 'Music Lessons', emoji: '🎵' },
    { id: 'language', label: 'Language / English', emoji: '🗣️' },
    { id: 'digital', label: 'Digital & Online Business', emoji: '📱' },
    { id: 'coding', label: 'Coding & Programming', emoji: '👨‍💻' },
  ],
  health_wellness: [
    { id: 'physio', label: 'Physiotherapy', emoji: '🦴' },
    { id: 'fitness', label: 'Personal Fitness Trainer', emoji: '🏋️' },
    { id: 'nutrition', label: 'Nutrition & Diet', emoji: '🥗' },
    { id: 'nanny', label: 'Childcare / Nanny', emoji: '👶' },
    { id: 'elderly', label: 'Elderly Home Care', emoji: '👴' },
    { id: 'nursing', label: 'Mobile Nursing', emoji: '🩺' },
  ],
  domestic: [
    { id: 'cleaning', label: 'House / Office Cleaning', emoji: '🧹' },
    { id: 'laundry', label: 'Laundry & Ironing', emoji: '👕' },
    { id: 'cooking', label: 'Home Cooking', emoji: '🍳' },
    { id: 'pest', label: 'Pest Control', emoji: '🐛' },
    { id: 'weekly', label: 'Weekly Cleaning Service', emoji: '🗓️' },
  ],
  events: [
    { id: 'photography', label: 'Photography', emoji: '📸' },
    { id: 'videography', label: 'Videography', emoji: '🎥' },
    { id: 'catering', label: 'Catering', emoji: '🍽️' },
    { id: 'decoration', label: 'Event Decoration', emoji: '🎊' },
    { id: 'cake', label: 'Cake Making', emoji: '🎂' },
    { id: 'dj', label: 'DJ Services', emoji: '🎧' },
    { id: 'mc', label: 'MC / Event Host', emoji: '🎤' },
  ],
  digital_services: [
    { id: 'logo', label: 'Logo & Graphic Design', emoji: '🎨' },
    { id: 'phone_repair', label: 'Phone Screen Repair', emoji: '📱' },
    { id: 'laptop_repair', label: 'Laptop Repair', emoji: '💻' },
    { id: 'social_media', label: 'Social Media Management', emoji: '📣' },
    { id: 'cv', label: 'CV & Cover Letter Writing', emoji: '📄' },
    { id: 'flyer', label: 'Flyer & Banner Design', emoji: '🖼️' },
    { id: 'printing', label: 'Printing Services', emoji: '🖨️' },
  ],
  transport: [
    { id: 'delivery', label: 'Package Delivery', emoji: '📦' },
    { id: 'driver', label: 'Driver for Hire', emoji: '🚗' },
    { id: 'airport', label: 'Airport Pick-up & Drop-off', emoji: '✈️' },
    { id: 'school_run', label: 'School Run Service', emoji: '🏫' },
    { id: 'moving', label: 'Moving & Relocation', emoji: '🏠' },
    { id: 'bike', label: 'Bike / Okada Delivery', emoji: '🏍️' },
  ],
  agriculture: [
    { id: 'poultry', label: 'Poultry Farm Consultation', emoji: '🐔' },
    { id: 'farm_labour', label: 'Farm Labour', emoji: '👨‍🌾' },
    { id: 'irrigation', label: 'Irrigation Installation', emoji: '💧' },
    { id: 'tractor', label: 'Tractor / Ploughing', emoji: '🚜' },
    { id: 'fish', label: 'Fish Farm Setup', emoji: '🐟' },
    { id: 'produce', label: 'Produce Aggregation', emoji: '🌽' },
  ],
}

const SUBCATEGORY_SERVICE_MAP: Record<string, string[]> = {
  electrician: ['House Wiring', 'Electrical'],
  plumber: ['Plumbing'],
  generator: ['Generator'],
  ac: ['AC', 'Air Condition'],
  painter: ['Paint'],
  tiler: ['Tiling', 'Flooring'],
  solar: ['Solar'],
  carpenter: ['Carpentry'],
  welder: ['Welding', 'Metal'],
  general: ['General House'],
  mechanic: ['Car Service', 'Oil Change'],
  carwash: ['Car Wash'],
  tyres: ['Tyre'],
  brakes: ['Brake'],
  auto_electrician: ['Auto Electrical'],
  panel_beater: ['Panel Beating', 'Body Repair'],
  detailing: ['Detailing'],
  motorcycle: ['Motorcycle'],
  massage: ['Massage', 'Body Therapy'],
  braiding: ['Braiding', 'Hair Stylist'],
  makeup: ['Makeup'],
  nails: ['Nail', 'Manicure'],
  barber: ['Haircut', 'Barber'],
  skincare: ['Facial', 'Skin'],
  wigs: ['Wig'],
  threading: ['Threading', 'Eyebrow'],
  relaxer: ['Relaxer', 'Treatment'],
  primary: ['Primary', 'Home Tutoring'],
  exam_prep: ['WAEC', 'JAMB', 'Exam'],
  computer: ['Computer', 'Microsoft'],
  music: ['Music', 'Piano'],
  language: ['English', 'Language'],
  digital: ['Digital', 'Online Business'],
  coding: ['Coding', 'Programming'],
  physio: ['Physiotherapy'],
  fitness: ['Fitness', 'Training'],
  nutrition: ['Nutrition', 'Diet'],
  nanny: ['Childcare', 'Nanny'],
  elderly: ['Elderly', 'Home Care'],
  nursing: ['Nursing', 'Mobile Nurse'],
  cleaning: ['Cleaning', 'Office Clean'],
  laundry: ['Laundry', 'Ironing'],
  cooking: ['Cooking', 'Chef'],
  pest: ['Pest'],
  weekly: ['Weekly'],
  photography: ['Photography'],
  videography: ['Videography'],
  catering: ['Catering'],
  decoration: ['Decoration'],
  cake: ['Cake'],
  dj: ['DJ'],
  mc: ['MC', 'Host'],
  logo: ['Logo', 'Graphic'],
  phone_repair: ['Phone Screen', 'Phone Repair'],
  laptop_repair: ['Laptop'],
  social_media: ['Social Media'],
  cv: ['CV', 'Cover Letter'],
  flyer: ['Flyer', 'Banner'],
  printing: ['Print'],
  delivery: ['Delivery', 'Same Day'],
  driver: ['Driver'],
  airport: ['Airport'],
  school_run: ['School Run'],
  moving: ['Moving', 'Relocation'],
  bike: ['Bike', 'Okada'],
  poultry: ['Poultry'],
  farm_labour: ['Farm Labour'],
  irrigation: ['Irrigation'],
  tractor: ['Tractor', 'Plough'],
  fish: ['Fish'],
  produce: ['Produce'],
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-2 justify-center mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${
          i < current ? 'bg-brand-green w-6' : i === current ? 'bg-brand-green w-4' : 'bg-gray-200 w-4'
        }`} />
      ))}
    </div>
  )
}

export default function OnboardingPage() {
  const [lang, setLang] = useState<'en' | 'pid'>('pid')
  const [step, setStep] = useState<Step>('language')
  const [businessName, setBusinessName] = useState('')
  const [whatsappRaw, setWhatsappRaw] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0])
  const [showCountryPicker, setShowCountryPicker] = useState(false)
  const [email, setEmail] = useState('')
  const [category, setCategory] = useState('')
  const [businessType, setBusinessType] = useState<'products' | 'services' | ''>('')
  const [location, setLocation] = useState('')
  const [genStep, setGenStep] = useState(0)
  const [storeSlug, setStoreSlug] = useState('')
  const [error, setError] = useState('')
  const [loginSent, setLoginSent] = useState<'email' | 'whatsapp' | null>(null)
  const [alreadyExists, setAlreadyExists] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set())
  const [customCity, setCustomCity] = useState('')
  const [showOtherCity, setShowOtherCity] = useState(false)
  const [selectedSubcategories, setSelectedSubcategories] = useState<Set<string>>(new Set())
  const [customServices, setCustomServices] = useState<string[]>([])
  const [customServiceInput, setCustomServiceInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<any>(null)

  const pid = lang === 'pid'
  const rawSampleItems = category ? (businessType === 'services' ? getSampleServices(category) : getSampleProducts(category)) : []
  const countryCurrencyMap: Record<string, {symbol: string; rate: number}> = {
    '234': {symbol: '₦', rate: 1}, '233': {symbol: 'GH₵', rate: 0.0094},
    '254': {symbol: 'KSh', rate: 0.078}, '27': {symbol: 'R', rate: 0.011},
    '1': {symbol: '$', rate: 0.00061}, '44': {symbol: '£', rate: 0.00048},
    '55': {symbol: 'R$', rate: 0.0031}, '92': {symbol: '₨', rate: 0.17},
    '91': {symbol: '₹', rate: 0.051}, '60': {symbol: 'RM', rate: 0.0029},
    '63': {symbol: '₱', rate: 0.034}, '62': {symbol: 'Rp', rate: 9.6},
    '20': {symbol: 'E£', rate: 0.029}, '255': {symbol: 'TSh', rate: 1.53},
    '256': {symbol: 'USh', rate: 2.29}, '251': {symbol: 'Br', rate: 0.034},
    '221': {symbol: 'CFA', rate: 0.37}, '237': {symbol: 'FCFA', rate: 0.37},
  }
  const selectedCurrency = countryCurrencyMap[selectedCountry.dial] || {symbol: '$', rate: 0.00061}
  const sampleProducts = rawSampleItems.map(p => {
    if (selectedCurrency.symbol === '₦') return p
    const converted = Math.round(p.price * selectedCurrency.rate)
    const rounded = converted >= 1000 ? Math.floor(converted/500)*500 :
                    converted >= 100 ? Math.floor(converted/50)*50 :
                    Math.floor(converted/5)*5 || 1
    return { ...p, price: rounded, price_display: `${selectedCurrency.symbol}${rounded.toLocaleString()}` }
  })
  const normalizedWa = normalizeNumber(whatsappRaw, selectedCountry.dial)

  const generatingSteps = businessType === 'services' ? [
    pid ? 'We dey create your business page...' : 'Creating your business page...',
    pid ? 'We dey set up your services...' : 'Setting up your services...',
    pid ? 'We dey configure your WhatsApp booking...' : 'Configuring your WhatsApp booking button...',
    pid ? 'We dey save your business details...' : 'Saving your business details...',
    pid ? 'E almost ready...' : 'Almost ready...',
  ] : [
    pid ? 'We dey create your shop design...' : 'Creating your store design...',
    pid ? 'We dey set up your product catalogue...' : 'Setting up your product catalogue...',
    pid ? 'We dey configure your WhatsApp order button...' : 'Configuring your WhatsApp order button...',
    pid ? 'We dey save your business details...' : 'Saving your business details...',
    pid ? 'E almost ready...' : 'Almost ready...',
  ]

  const prevStep: Record<string, Step> = {
    business: 'language', whatsapp: 'business', email: 'whatsapp',
    password: 'email', biztype: 'password', category: 'biztype',
    subcategory: 'category',
    location: businessType === 'services' ? 'subcategory' : 'category',
    products: 'location',
  }

  function toggleProduct(i: number) {
    setSelectedProducts(prev => { const next = new Set(prev); next.has(i) ? next.delete(i) : next.add(i); return next })
  }

  function toggleSubcategory(id: string) {
    setSelectedSubcategories(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next })
  }

  function addCustomService() {
    const val = customServiceInput.trim()
    if (val && !customServices.includes(val)) setCustomServices(prev => [...prev, val])
    setCustomServiceInput('')
  }

  function removeCustomService(s: string) {
    setCustomServices(prev => prev.filter(x => x !== s))
  }

  function startVoice() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) { alert('Voice input not supported on this browser. Please type instead.'); return }
    const rec = new SR()
    rec.lang = 'en-NG'; rec.continuous = false; rec.interimResults = false
    rec.onresult = (e: any) => {
      const t = e.results[0][0].transcript
      setCustomServiceInput(prev => prev ? prev + ', ' + t : t)
      setIsListening(false)
    }
    rec.onerror = () => setIsListening(false)
    rec.onend = () => setIsListening(false)
    recognitionRef.current = rec
    rec.start()
    setIsListening(true)
  }

  function stopVoice() { recognitionRef.current?.stop(); setIsListening(false) }

  function getFilteredServices() {
    const allServices = getSampleServices(category)
    if (selectedSubcategories.size === 0 && customServices.length === 0) return allServices
    const keywords: string[] = []
    selectedSubcategories.forEach(id => { keywords.push(...(SUBCATEGORY_SERVICE_MAP[id] || [])) })
    const filtered = allServices.filter(s => keywords.some(kw => s.name.toLowerCase().includes(kw.toLowerCase())))
    const customEntries = customServices.map(name => ({
      name,
      description: `Professional ${name.toLowerCase()} service. Contact us via WhatsApp to book your appointment.`,
      price: 500000,
      price_display: `₦5,000`,
      in_stock: true,
      image_url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&q=80',
    }))
    return [...(filtered.length > 0 ? filtered : allServices.slice(0, 5)), ...customEntries]
  }

  async function handleGenerate() {
    setStep('generating')
    setGenStep(0)
    const slug = slugify(businessName) + '-' + Math.random().toString(36).slice(2, 6)
    for (let i = 0; i < generatingSteps.length; i++) {
      await new Promise(r => setTimeout(r, 700))
      setGenStep(i + 1)
    }
    const { data: existingList } = await supabase.from('merchants').select('slug, email, phone')
      .or(`email.eq.${email},phone.eq.${normalizedWa}`).limit(1)
    if (existingList?.[0]) { setStoreSlug(existingList[0].slug); setAlreadyExists(true); setStep('done'); return }
    try {
      await supabase.auth.signUp({ email, password })
      const { data: newMerchant, error: insertError } = await supabase.from('merchants').insert({
        business_name: businessName, slug, category, location,
        whatsapp_number: normalizedWa, email, phone: normalizedWa,
        language: lang, business_type: businessType || 'products',
        plan: 'free', is_active: true, login_pin: password,
      }).select('id').single()

      if (!insertError && newMerchant) {
        if (businessType === 'services') {
          const filtered = getFilteredServices()
          const items = filtered.map(s => {
            if (selectedCurrency.symbol === '₦') return { ...s, merchant_id: newMerchant.id }
            const converted = Math.round(s.price * selectedCurrency.rate)
            const rounded = converted >= 1000 ? Math.floor(converted/500)*500 : converted >= 100 ? Math.floor(converted/50)*50 : Math.floor(converted/5)*5 || 1
            return { ...s, price: rounded, price_display: `${selectedCurrency.symbol}${rounded.toLocaleString()}`, merchant_id: newMerchant.id }
          })
          if (items.length > 0) await supabase.from('products').insert(items)
        } else if (selectedProducts.size > 0) {
          const chosen = sampleProducts.filter((_, i) => selectedProducts.has(i)).map(p => ({ ...p, merchant_id: newMerchant.id }))
          await supabase.from('products').insert(chosen)
        }
      }
      setStoreSlug(slug)
    } catch (e) { console.error('Save error:', e); setStoreSlug(slug) }
    setStep('done')
  }

  async function sendLoginEmail() {
    await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } })
    setLoginSent('email')
  }

  function sendLoginWhatsApp() {
    const msg = `Your Earket business page is live!\n\nPage: earket.com/store/${storeSlug}\n\nLogin to manage: ${window.location.origin}/login\n\nEmail: ${email}`
    window.open(`https://wa.me/${normalizedWa}?text=${encodeURIComponent(msg)}`, '_blank')
    setLoginSent('whatsapp')
  }

  async function handleNext() {
    setError('')
    if (step === 'business') {
      if (!businessName.trim()) { setError(pid ? 'Abeg enter your business name' : 'Please enter your business name'); return }
      setStep('whatsapp')
    } else if (step === 'whatsapp') {
      const digits = whatsappRaw.replace(/\D/g, '')
      if (!digits) { setError(pid ? 'Abeg enter your WhatsApp number' : 'Please enter your WhatsApp number'); return }
      const minLen = selectedCountry.dial === '234' ? 10 : selectedCountry.dial === '1' ? 10 : selectedCountry.dial === '44' ? 10 : 9
      if (digits.length < minLen) { setError(`Please enter a valid ${selectedCountry.name} phone number (minimum ${minLen} digits)`); return }
      setStep('email')
    } else if (step === 'email') {
      if (!email.trim() || !email.includes('@')) { setError(pid ? 'Abeg enter valid email' : 'Please enter a valid email'); return }
      const { data: existing } = await supabase.from('merchants').select('id, slug').eq('email', email.toLowerCase()).maybeSingle()
      if (existing) { setError(pid ? 'This email don already dey. Abeg use another email.' : 'This email is already registered. Please use a different email.'); return }
      setStep('password')
    } else if (step === 'password') {
      if (password.length < 4) { setError(pid ? 'Abeg enter at least 4 characters' : 'Password must be at least 4 characters'); return }
      setStep('biztype')
    } else if (step === 'biztype') {
      if (!businessType) { setError('Please select your business type'); return }
      setStep('category')
    } else if (step === 'category') {
      if (!category) { setError(pid ? 'Abeg select your category' : 'Please select a category'); return }
      setStep(businessType === 'services' ? 'subcategory' : 'location')
    } else if (step === 'subcategory') {
      setStep('location')
    } else if (step === 'location') {
      const finalLocation = location || customCity
      if (!finalLocation) { setError(pid ? 'Abeg select your city' : 'Please select or enter your city'); return }
      if (!location && customCity) setLocation(customCity)
      const { data: dupName } = await supabase.from('merchants').select('id').ilike('business_name', businessName.trim()).ilike('location', location).maybeSingle()
      if (dupName) {
        setError(pid ? `"${businessName}" don already exist for ${location}. Abeg choose different name.` : `"${businessName}" already exists in ${location}. Please choose a different business name.`)
        setStep('business'); return
      }
      if (businessType === 'services') { handleGenerate(); return }
      setSelectedProducts(new Set(getSampleProducts(category).map((_, i) => i)))
      setStep('products')
    } else if (step === 'products') {
      handleGenerate()
    }
  }

  const stepsList = businessType === 'services'
    ? ['business', 'whatsapp', 'email', 'password', 'biztype', 'category', 'subcategory', 'location']
    : ['business', 'whatsapp', 'email', 'password', 'biztype', 'category', 'location', 'products']

  const currentSubcats = SERVICE_SUBCATEGORIES[category] || []
  const totalSelected = selectedSubcategories.size + customServices.length

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

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">

          {!['generating', 'done', 'language'].includes(step) && (
            <StepIndicator current={stepsList.indexOf(step)} total={stepsList.length} />
          )}

          {step === 'language' && (
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-brand-green rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-green/20">
                <ShoppingBag size={28} className="text-white" />
              </div>
              <h1 className="font-display text-2xl font-bold text-brand-dark mb-2">Let's build your business</h1>
              <p className="text-gray-500 text-sm mb-8">Answer a few quick questions. Your page will be live in minutes.</p>
              <div className="space-y-3">
                {([
                  { code: 'en' as const, label: 'English', sub: 'Continue in English' },
                  { code: 'pid' as const, label: '🌍 Pidgin English', sub: 'I wan use Pidgin' },
                ]).map(l => (
                  <button key={l.code} onClick={() => { setLang(l.code); setStep('business') }}
                    className="w-full flex items-center justify-between bg-white border-2 border-gray-200 hover:border-brand-green rounded-2xl p-4 transition-all group">
                    <div className="text-left">
                      <div className="font-display font-bold text-brand-dark">{l.label}</div>
                      <div className="text-xs text-gray-400">{l.sub}</div>
                    </div>
                    <ArrowRight size={18} className="text-gray-300 group-hover:text-brand-green transition-colors" />
                  </button>
                ))}
                <p className="text-xs text-gray-400 text-center pt-2">More languages coming soon · French, Spanish, Arabic, Swahili</p>
              </div>
            </div>
          )}

          {step === 'business' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-bold text-brand-dark mb-1">
                {pid ? 'Wetin be your business name?' : 'What is your business name?'}
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                {pid ? 'This go be the name wey customers go see.' : 'This is what customers will see on your page.'}
              </p>
              <input type="text" placeholder="e.g. Rebecca Massage" value={businessName}
                onChange={e => { setBusinessName(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleNext()} autoFocus
                className="w-full border-2 border-gray-200 focus:border-brand-green rounded-2xl px-4 py-4 text-brand-dark font-display font-bold text-lg outline-none transition-colors" />
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            </div>
          )}

          {step === 'whatsapp' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-bold text-brand-dark mb-1">Your WhatsApp business number?</h2>
              <p className="text-gray-500 text-sm mb-6">
                {pid ? 'Customers go contact you on this number' : 'Customers will contact you on this number'}
              </p>
              <div className="flex gap-2 mb-2">
                <button onClick={() => setShowCountryPicker(!showCountryPicker)}
                  className="flex items-center gap-1.5 bg-white border-2 border-gray-200 rounded-2xl px-3 py-4 text-sm font-semibold hover:border-brand-green transition-colors shrink-0">
                  <img src={`https://flagcdn.com/20x15/${selectedCountry.code.toLowerCase()}.png`}
                    alt={selectedCountry.name} className="w-5 h-4 object-cover rounded-sm"
                    onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
                  <span className="text-gray-600 text-sm font-semibold">+{selectedCountry.dial}</span>
                </button>
                <input type="tel" placeholder="Phone number" value={whatsappRaw}
                  onChange={e => { setWhatsappRaw(e.target.value); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleNext()} autoFocus
                  className="flex-1 border-2 border-gray-200 focus:border-brand-green rounded-2xl px-4 py-4 text-brand-dark font-display font-bold text-lg outline-none transition-colors" />
              </div>
              {showCountryPicker && (
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg max-h-52 overflow-y-auto mb-2">
                  {COUNTRIES.map(c => (
                    <button key={c.code} onClick={() => { setSelectedCountry(c); setShowCountryPicker(false) }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 ${selectedCountry.code === c.code ? 'bg-brand-light text-brand-green font-semibold' : 'text-gray-700'}`}>
                      <img src={`https://flagcdn.com/20x15/${c.code.toLowerCase()}.png`}
                        alt={c.name} className="w-5 h-4 object-cover rounded-sm shrink-0"
                        onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
                      <span className="flex-1 text-left">{c.name}</span>
                      <span className="text-gray-400 text-xs">+{c.dial}</span>
                    </button>
                  ))}
                </div>
              )}
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
              <p className="text-xs text-gray-400 mt-2">⚠️ Make sure this number is active on WhatsApp</p>
            </div>
          )}

          {step === 'email' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-bold text-brand-dark mb-1">Your email address?</h2>
              <p className="text-gray-500 text-sm mb-6">{pid ? 'We go use this to send you login link' : 'We use this to send your login link'}</p>
              <input type="email" placeholder="you@example.com" value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleNext()} autoFocus
                className="w-full border-2 border-gray-200 focus:border-brand-green rounded-2xl px-4 py-4 text-brand-dark font-semibold text-lg outline-none transition-colors" />
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
              <p className="text-xs text-gray-400 mt-3">🔒 {pid ? 'No password wahala' : 'No password required'}</p>
            </div>
          )}

          {step === 'password' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-bold text-brand-dark mb-1">Set your password</h2>
              <p className="text-gray-500 text-sm mb-6">{pid ? 'You go use this to login anytime' : 'You will use this to log in to your dashboard anytime'}</p>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} placeholder="Enter password" value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleNext()} autoFocus autoComplete="new-password"
                  className="w-full border-2 border-gray-200 focus:border-brand-green rounded-2xl pl-10 pr-12 py-4 text-brand-dark font-semibold text-lg outline-none transition-colors" />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
              <p className="text-xs text-gray-400 mt-3">🔒 {pid ? 'Minimum 4 characters. Save am well well.' : 'Minimum 4 characters. Keep it safe.'}</p>
            </div>
          )}

          {step === 'biztype' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-bold text-brand-dark mb-2">
                {pid ? 'Wetin you dey do?' : 'Choose your business type'}
              </h2>
              <p className="text-gray-500 text-sm mb-6">{pid ? 'You dey sell things or you dey offer service?' : 'Are you selling products or offering a service?'}</p>
              <div className="space-y-3">
                <button onClick={() => setBusinessType('products')}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${businessType === 'products' ? 'border-brand-green bg-brand-light' : 'border-gray-200 bg-white'}`}>
                  <span className="text-3xl">🛍️</span>
                  <div className="text-left">
                    <p className="font-display font-bold text-brand-dark">{pid ? 'I dey sell products' : 'I sell products'}</p>
                    <p className="text-xs text-gray-500">Food, clothing, electronics, groceries etc.</p>
                  </div>
                </button>
                <button onClick={() => setBusinessType('services')}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${businessType === 'services' ? 'border-brand-green bg-brand-light' : 'border-gray-200 bg-white'}`}>
                  <span className="text-3xl">🔧</span>
                  <div className="text-left">
                    <p className="font-display font-bold text-brand-dark">{pid ? 'I dey offer service' : 'I offer a service'}</p>
                    <p className="text-xs text-gray-500">Repairs, beauty, tutoring, events, delivery etc.</p>
                  </div>
                </button>
              </div>
              {error && <p className="text-red-500 text-xs mt-3">{error}</p>}
            </div>
          )}

          {step === 'category' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-bold text-brand-dark mb-6">
                {businessType === 'services' ? (pid ? 'Wetin service you dey offer?' : 'What type of service do you offer?') : (pid ? 'Wetin you dey sell?' : 'What do you sell?')}
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {(businessType === 'services' ? SERVICE_CATEGORIES : CATEGORIES).map(cat => (
                  <button key={cat.id} onClick={() => { setCategory(cat.id); setSelectedSubcategories(new Set()) }}
                    className={`flex items-center gap-2 p-3 rounded-2xl border-2 text-left transition-all ${category === cat.id ? 'border-brand-green bg-brand-light text-brand-green' : 'border-gray-200 text-gray-600 hover:border-brand-green/50'}`}>
                    <span className="text-xl">{cat.emoji}</span>
                    <span className="text-xs font-semibold leading-tight">{pid ? cat.pidgin : cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'subcategory' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-bold text-brand-dark mb-1">
                {pid ? 'Which service you dey offer?' : 'What specifically do you offer?'}
              </h2>
              <p className="text-gray-500 text-sm mb-4">
                {pid ? 'Tick all wey apply. You fit add your own too.' : 'Tick everything that applies. Add your own below.'}
              </p>

              <div className="space-y-2 max-h-52 overflow-y-auto pr-1 mb-4">
                {currentSubcats.map(sub => (
                  <button key={sub.id} onClick={() => toggleSubcategory(sub.id)}
                    className={`w-full flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition-all ${selectedSubcategories.has(sub.id) ? 'border-brand-green bg-brand-light' : 'border-gray-200 bg-white hover:border-brand-green/40'}`}>
                    <span className="text-lg shrink-0">{sub.emoji}</span>
                    <span className="flex-1 text-sm font-semibold text-gray-800">{sub.label}</span>
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${selectedSubcategories.has(sub.id) ? 'bg-brand-green border-brand-green' : 'border-gray-300'}`}>
                      {selectedSubcategories.has(sub.id) && (
                        <svg viewBox="0 0 12 10" className="w-3 h-3">
                          <path d="M1 5l3 4L11 1" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {customServices.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {customServices.map(s => (
                    <span key={s} className="flex items-center gap-1.5 bg-brand-green text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                      {s}
                      <button onClick={() => removeCustomService(s)} className="hover:opacity-70"><X size={12} /></button>
                    </span>
                  ))}
                </div>
              )}

              <div className="border-2 border-dashed border-gray-200 rounded-xl p-3">
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  {pid ? '➕ Add service wey no dey above' : '➕ Add a service not listed above'}
                </p>
                <div className="flex gap-2">
                  <input type="text" value={customServiceInput}
                    onChange={e => setCustomServiceInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomService() } }}
                    placeholder="e.g. Deep Tissue Massage"
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-brand-green" />
                  <button onClick={isListening ? stopVoice : startVoice}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-500 hover:bg-brand-light hover:text-brand-green'}`}
                    title={isListening ? 'Stop recording' : 'Speak your service'}>
                    {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>
                  <button onClick={addCustomService} disabled={!customServiceInput.trim()}
                    className="w-9 h-9 rounded-xl bg-brand-green text-white flex items-center justify-center shrink-0 disabled:opacity-30">
                    <Plus size={16} />
                  </button>
                </div>
                {isListening && (
                  <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse inline-block" />
                    {pid ? 'We dey listen... speak now' : 'Listening... speak now'}
                  </p>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">
                {pid ? "If you no select anything, we go add all services for you" : "Don't tick anything? We'll add all services for you"}
              </p>
            </div>
          )}

          {step === 'location' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-bold text-brand-dark mb-2">
                {pid ? 'Where your business dey?' : 'Where is your business located?'}
              </h2>
              <div className="flex items-center gap-2 mb-4">
                <img src={`https://flagcdn.com/20x15/${selectedCountry.code.toLowerCase()}.png`}
                  alt={selectedCountry.name} className="w-5 h-4 object-cover rounded-sm" />
                <p className="text-xs text-gray-500">
                  {location && !showOtherCity
                    ? <><span className="font-semibold text-gray-700">{location}, {selectedCountry.name}</span> — tap another city to change</>
                    : <>Showing cities in <span className="font-semibold text-gray-700">{selectedCountry.name}</span></>}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(COUNTRY_LIST.find(c => c.dial === selectedCountry.dial)?.cities || ['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan', 'Benin City', 'Other']).concat(['Other']).filter((v, i, a) => a.indexOf(v) === i).map(loc => (
                  <button key={loc} onMouseDown={e => e.preventDefault()} onClick={() => { setLocation(loc === 'Other' ? '' : loc); if (loc === 'Other') setCustomCity('') }}
                    className={`py-2.5 px-3 rounded-xl border-2 text-xs font-semibold transition-all ${(loc === 'Other' ? location === '' : location === loc) ? 'border-brand-green bg-brand-light text-brand-green' : 'border-gray-200 text-gray-600 hover:border-brand-green/50'}`}>
                    {loc}
                  </button>
                ))}
              </div>
              {location === '' && (
                <input type="text" defaultValue=""
                  onChange={e => setCustomCity(e.target.value)}
                  onBlur={e => setLocation(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { setLocation((e.target as HTMLInputElement).value); (e.target as HTMLInputElement).blur() } }}
                  placeholder="Type your city or town — press Enter when done"
                  className="mt-3 w-full border-2 border-brand-green rounded-xl px-4 py-3 text-sm focus:outline-none" />
              )}
            </div>
          )}

          {step === 'products' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-bold text-brand-dark mb-1">Pick your starter products</h2>
              <p className="text-gray-500 text-sm mb-4">
                {pid ? 'Select products wey you want add. You fit edit them later.' : 'Select products to add. You can edit or replace them later.'}
              </p>
              <div className="flex gap-2 mb-3">
                <button onClick={() => setSelectedProducts(new Set(sampleProducts.map((_, i) => i)))}
                  className="text-xs font-semibold text-brand-green border border-brand-green/30 bg-brand-light px-3 py-1.5 rounded-xl">Select All</button>
                <button onClick={() => setSelectedProducts(new Set())}
                  className="text-xs font-semibold text-gray-500 border border-gray-200 px-3 py-1.5 rounded-xl">Clear All</button>
                <span className="ml-auto text-xs text-gray-400 self-center">{selectedProducts.size} selected</span>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {sampleProducts.map((product, i) => (
                  <button key={i} onClick={() => toggleProduct(i)}
                    className={`w-full flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition-all ${selectedProducts.has(i) ? 'border-brand-green bg-brand-light' : 'border-gray-200 bg-white hover:border-brand-green/40'}`}>
                    <img src={product.image_url} alt={product.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 text-xs leading-tight truncate">{product.name}</div>
                      <div className="text-brand-green font-bold text-sm mt-0.5">{product.price_display}</div>
                    </div>
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${selectedProducts.has(i) ? 'bg-brand-green border-brand-green' : 'border-gray-300'}`}>
                      {selectedProducts.has(i) && (
                        <svg viewBox="0 0 12 10" className="w-3 h-3">
                          <path d="M1 5l3 4L11 1" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'generating' && (
            <div className="animate-fade-in text-center py-8">
              <div className="w-20 h-20 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 size={36} className="text-brand-green animate-spin" />
              </div>
              <h2 className="font-display text-2xl font-bold text-brand-dark mb-3">
                {pid ? 'We dey build your business page...' : 'Building your business page...'}
              </h2>
              <div className="space-y-2">
                {generatingSteps.map((s, i) => (
                  <div key={i} className={`flex items-center justify-center gap-2 text-sm transition-all duration-300 ${i < genStep ? 'text-brand-green' : i === genStep ? 'text-brand-dark font-medium' : 'text-gray-300'}`}>
                    {i < genStep ? <Check size={14} /> : i === genStep ? <Loader2 size={14} className="animate-spin" /> : <div className="w-3.5 h-3.5 rounded-full border border-gray-300" />}
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'done' && (
            <div className="animate-fade-in text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ${alreadyExists ? 'bg-brand-accent shadow-brand-accent/30' : 'bg-brand-green shadow-brand-green/30'}`}>
                <Check size={36} className="text-white" />
              </div>
              {alreadyExists && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 text-left">
                  <p className="font-semibold text-amber-800 text-sm mb-1">{pid ? '⚠️ You don already get shop!' : '⚠️ You already have a business page!'}</p>
                  <p className="text-amber-700 text-xs">{pid ? 'This email or WhatsApp don already use.' : 'This email or WhatsApp is already linked to a business.'}</p>
                </div>
              )}
              <h2 className="font-display text-2xl font-bold text-brand-dark mb-2">
                {alreadyExists ? (pid ? 'Your shop dey here! 👋' : 'Welcome back! 👋') : (pid ? 'Your shop don go live! 🎉' : 'Your business is live! 🎉')}
              </h2>
              <div className="bg-brand-light border-2 border-brand-green/20 rounded-2xl p-4 mb-6">
                <p className="text-xs text-gray-500 mb-1">{pid ? 'Your shop link:' : 'Your business link:'}</p>
                <p className="font-display font-bold text-brand-green text-sm">earket.com/store/{storeSlug}</p>
              </div>
              {!loginSent ? (
                <>
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    {pid ? 'How you want receive your login link?' : 'How would you like to receive your login link?'}
                  </p>
                  <div className="space-y-2 mb-5">
                    <button onClick={sendLoginEmail}
                      className="w-full flex items-center gap-3 bg-white border-2 border-gray-200 hover:border-brand-green rounded-2xl p-4 transition-all">
                      <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center"><Mail size={20} className="text-brand-green" /></div>
                      <div className="text-left">
                        <div className="font-semibold text-brand-dark text-sm">Send to my Email</div>
                        <div className="text-xs text-gray-400 truncate">{email}</div>
                      </div>
                    </button>
                    <button onClick={sendLoginWhatsApp}
                      className="w-full flex items-center gap-3 bg-[#25D366] rounded-2xl p-4 hover:opacity-90 transition-all">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><MessageCircle size={20} className="text-white" /></div>
                      <div className="text-left">
                        <div className="font-semibold text-white text-sm">Send to my WhatsApp</div>
                        <div className="text-xs text-white/70">+{normalizedWa}</div>
                      </div>
                    </button>
                  </div>
                </>
              ) : (
                <div className="bg-brand-light rounded-2xl p-4 mb-5 flex items-center gap-3">
                  <Check size={18} className="text-brand-green shrink-0" />
                  <p className="text-sm text-brand-dark font-semibold">
                    {loginSent === 'email' ? 'Login link sent to your email!' : 'Login details sent to your WhatsApp!'}
                  </p>
                </div>
              )}
              <Link href={`/store/${storeSlug}`}
                className="block w-full bg-brand-green text-white font-bold py-3 rounded-2xl hover:bg-brand-dark transition-colors mb-2 text-sm">
                {pid ? 'See My Shop' : 'View My Business'}
              </Link>
              <a href={`https://wa.me/?text=${encodeURIComponent('Check out my business page: https://earket.com/store/' + storeSlug)}`}
                target="_blank" rel="noreferrer" className="btn-whatsapp w-full justify-center">
                📲 {pid ? 'Share for WhatsApp' : 'Share on WhatsApp'}
              </a>
            </div>
          )}

          {!['language', 'generating', 'done'].includes(step) && (
            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(prevStep[step] as Step)}
                className="flex items-center gap-1.5 text-gray-500 hover:text-brand-dark text-sm font-medium px-4 py-3">
                <ArrowLeft size={16} /> {pid ? 'Go Back' : 'Back'}
              </button>
              <button onClick={handleNext}
                disabled={(step === 'category' && !category) || (step === 'location' && !location && !customCity)}
                className="flex-1 bg-brand-green text-white font-bold py-3 rounded-2xl hover:bg-brand-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm">
                {step === 'subcategory'
                  ? (totalSelected > 0
                    ? `Continue with ${totalSelected} service${totalSelected !== 1 ? 's' : ''} selected`
                    : 'Continue — add all services')
                  : <>Continue <ArrowRight size={18} /></>
                }
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
