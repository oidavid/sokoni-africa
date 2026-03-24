'use client'
import { useState, useEffect } from 'react'
import { MapPin, Share2, Phone, Star, Search, X, Clock, ChevronRight, List, Grid3X3, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getThemeById, getThemeStyle } from '@/lib/themes'

interface Merchant {
  id: string
  business_name: string
  slug: string
  description: string
  location: string
  whatsapp_number: string
  category: string
  theme_color: string
  hero_image_url?: string
  hero_overlay?: number
  hero_text_color?: string
  hero_font?: string
  logo_position?: string
  logo_size?: string
  hero_text_align?: string
  hero_font_size?: string
  hero_text_vertical?: string
  logo_url: string | null
  business_type?: string
  theme_preset?: string
  address?: string
  testimonials?: Array<{name: string; role: string; text: string; rating: number}>
  holiday_mode?: boolean
  holiday_message?: string
  business_hours?: Record<string, {open: string; close: string; closed: boolean}>
}

interface Service {
  id: string
  name: string
  description: string
  price: number
  price_display: string
  image_url: string | null
  in_stock: boolean
}

const CATEGORY_HERO: Record<string, string> = {
  beauty_services: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80',
  home_services: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&q=80',
  auto_services: 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=1200&q=80',
  education: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=1200&q=80',
  health_wellness: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80',
  domestic: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
  events: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1200&q=80',
  digital_services: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
  transport: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=80',
  agriculture: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&q=80',
  coaching: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80',
  mental_wellness: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1200&q=80',
  childcare: 'https://images.unsplash.com/photo-1567705323043-dce7c5d78a83?w=1200&q=80',
  food_catering: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&q=80',
}

const CATEGORY_HEADLINE: Record<string, string> = {
  beauty_services: 'Look your best. Feel your best.',
  home_services: 'Repairs & installations done right.',
  auto_services: 'Keep your vehicle in top condition.',
  education: "Unlock every student's potential.",
  health_wellness: 'Invest in your health today.',
  domestic: 'A clean home, a clear mind.',
  events: 'Unforgettable events, expertly planned.',
  digital_services: 'Grow your business online.',
  transport: 'Safe, reliable transport when you need it.',
  agriculture: 'Fresh produce, direct from the farm.',
  coaching: 'Transform your life. Unlock your potential.',
  mental_wellness: 'Your mental health matters.',
  childcare: 'Safe, nurturing care for your little ones.',
  food_catering: 'Delicious food for every occasion.',
}

const CATEGORY_LABEL: Record<string, string> = {
  home_services: 'Home & Technical Services',
  auto_services: 'Auto & Vehicle Services',
  beauty_services: 'Beauty & Personal Care',
  education: 'Education & Tutoring',
  health_wellness: 'Health & Wellness',
  domestic: 'Domestic Services',
  events: 'Events & Occasions',
  digital_services: 'Digital & Tech Services',
  transport: 'Transport & Delivery',
  agriculture: 'Agriculture Services',
  coaching: 'Coaching & Mentoring',
  mental_wellness: 'Mental Wellness & Counselling',
  childcare: 'Childcare & Nanny Services',
  food_catering: 'Food & Catering',
}

const CATEGORY_TAGLINE: Record<string, string> = {
  home_services: 'Trusted repairs & installations, done right',
  auto_services: 'Professional vehicle care you can count on',
  beauty_services: 'Look amazing. Feel confident. Book today.',
  education: 'Qualified tutors who deliver real results',
  health_wellness: 'Your health and wellbeing, our priority',
  domestic: 'A cleaner home, a happier life',
  events: 'Making every moment unforgettable',
  digital_services: 'Smart tech solutions for your business',
  transport: 'Reliable, on-time delivery and transport',
  agriculture: 'Supporting farmers and agribusiness',
  coaching: 'Unlock your potential. Transform your life.',
  mental_wellness: 'Your mind matters. You deserve support.',
  childcare: 'Safe, caring and trusted childcare for your family.',
  food_catering: 'Delicious food, beautifully prepared for you.',
}

function getDuration(name: string): string | null {
  const n = name.toLowerCase()
  if (n.includes('60 min')) return '60 min'
  if (n.includes('90 min')) return '90 min'
  if (n.includes('75 min')) return '75 min'
  if (n.includes('30 min')) return '30 min'
  if (n.includes('45 min')) return '45 min'
  if (n.includes('massage') || n.includes('facial')) return '60 min'
  if (n.includes('haircut') || n.includes('braiding') || n.includes('makeup')) return '90 min'
  if (n.includes('threading') || n.includes('eyebrow')) return '15 min'
  if (n.includes('nail') || n.includes('pedicure')) return '45 min'
  return null
}

function getContrastColor(hex: string): string {
  if (!hex || hex.length < 7) return '#ffffff'
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? '#111827' : '#ffffff'
}

function fmtPrice(s: Service): string {
  return s.price_display || `₦${(s.price / 100).toLocaleString()}`
}

// Name pools by region — detected from common location keywords
function getRegionNames(location: string): { first: [string, string]; last: [string, string] } {
  const loc = (location || '').toLowerCase()
  // US / Canada
  if (/(street|st\.|ave|blvd|road|rd\.|ar|tx|ca|ny|fl|ga|il|oh|wa|co|nc|az|nv|tn|mo|wi|mn|or|ok|ks|ia|ms|al|sc|ky|la|ut|ne|nm|sd|nd|wv|id|mt|wy|ak|hi|vt|nh|ri|de|ct|me|dc|rogers|bentonville|fayetteville|springdale|atlanta|dallas|houston|chicago|miami|seattle|denver|boston|portland|austin|nashville|charlotte|phoenix|las vegas|san|los|new york)/.test(loc)) {
    return { first: ['Jessica', 'Michael'], last: ['Thompson', 'Williams'] }
  }
  // UK
  if (/(london|manchester|birmingham|leeds|glasgow|edinburgh|bristol|cardiff|liverpool|sheffield|uk|england|scotland|wales)/.test(loc)) {
    return { first: ['Sophie', 'James'], last: ['Harrison', 'Bennett'] }
  }
  // West Africa / Nigeria / Ghana
  if (/(lagos|abuja|port harcourt|accra|kumasi|nigeria|ghana|benin|enugu|kano|ibadan|onitsha|aba)/.test(loc)) {
    return { first: ['Amara', 'Chidi'], last: ['Okonkwo', 'Mensah'] }
  }
  // East Africa
  if (/(nairobi|kampala|dar es salaam|kigali|addis|mombasa|kenya|uganda|tanzania|ethiopia|rwanda)/.test(loc)) {
    return { first: ['Grace', 'Brian'], last: ['Wanjiku', 'Otieno'] }
  }
  // South Africa
  if (/(johannesburg|cape town|durban|pretoria|south africa)/.test(loc)) {
    return { first: ['Nomsa', 'Thabo'], last: ['Dlamini', 'Nkosi'] }
  }
  // UAE / Gulf
  if (/(dubai|abu dhabi|sharjah|riyadh|jeddah|doha|uae|saudi)/.test(loc)) {
    return { first: ['Sara', 'Ahmed'], last: ['Al-Rashid', 'Hassan'] }
  }
  // India / South Asia
  if (/(mumbai|delhi|bangalore|hyderabad|chennai|kolkata|india|pakistan|lahore|karachi)/.test(loc)) {
    return { first: ['Priya', 'Rahul'], last: ['Sharma', 'Patel'] }
  }
  // Default — neutral international names
  return { first: ['Sarah', 'Marcus'], last: ['Mitchell', 'Johnson'] }
}

function getPlaceholderReviews(category: string, location: string): Array<{name: string; text: string}> {
  const loc = location || 'the area'
  const names = getRegionNames(location)
  const n1 = `${names.first[0]} ${names.last[0][0]}.`
  const n2 = `${names.first[1]} ${names.last[1][0]}.`

  const reviews: Record<string, Array<{name: string; text: string}>> = {
    beauty_services: [
      { name: n1, text: `Best experience I've had in ${loc}. Professional setup, very relaxing — I left feeling brand new. Definitely booking again.` },
      { name: n2, text: `Absolutely loved every minute. The therapist was skilled and attentive. My skin felt amazing afterwards. Highly recommend!` },
    ],
    home_services: [
      { name: n1, text: `Fixed the issue in one visit. Very professional, clean work and fair pricing. Will definitely call again.` },
      { name: n2, text: `Came same day, solved a problem I'd had for weeks. Left the place spotless. Very impressed with the service.` },
    ],
    auto_services: [
      { name: n1, text: `Brought my car in and they were thorough and transparent about everything. Car runs perfectly now. Great team.` },
      { name: n2, text: `Best car service in ${loc}. Very professional, honest pricing and quick turnaround. Will be coming back.` },
    ],
    education: [
      { name: n1, text: `My child's grades improved dramatically after just 4 sessions. Patient, knowledgeable and explains things clearly.` },
      { name: n2, text: `Excellent preparation and study techniques. Results showed within weeks. Very happy with the outcome.` },
    ],
    health_wellness: [
      { name: n1, text: `Helped me recover from my injury much faster than I expected. Very professional and genuinely caring approach.` },
      { name: n2, text: `Training sessions in ${loc} are excellent — pushes you at the right pace. Saw real results within the first month!` },
    ],
    domestic: [
      { name: n1, text: `My home hasn't been this clean in years! Deep clean was thorough and they brought all their own supplies.` },
      { name: n2, text: `Reliable weekly cleaning service. Always on time, very detailed and respectful. Couldn't ask for better.` },
    ],
    events: [
      { name: n1, text: `The photography at my event was absolutely stunning. Every moment captured perfectly. Will definitely book again!` },
      { name: n2, text: `Kept the crowd going all night. Great energy, perfect playlist. My guests are still talking about it.` },
    ],
    digital_services: [
      { name: n1, text: `Had my device repaired same day. Quick, professional and the price was very fair. Great service overall.` },
      { name: n2, text: `The design work exceeded my expectations. Fast turnaround and listened to exactly what I wanted. Customers love it.` },
    ],
    transport: [
      { name: n1, text: `Very reliable service. Everything arrived on time and in perfect condition. Will definitely use again.` },
      { name: n2, text: `Prompt and professional. Polite, clean and stress-free experience from start to finish. Highly recommend.` },
    ],
    coaching: [
      { name: n1, text: `This coaching changed my life. I came in lost and left with a clear vision and the confidence to actually go for it. Incredible.` },
      { name: n2, text: `Best investment I've made in myself. The sessions were deep, practical and I saw real results within weeks. Highly recommend.` },
    ],
    mental_wellness: [
      { name: n1, text: `Finally found a space where I felt truly heard. The sessions helped me manage my anxiety in ways I never thought possible.` },
      { name: n2, text: `Compassionate, professional and genuinely transformational. I came in overwhelmed and left with tools that actually work.` },
    ],
    childcare: [
      { name: n1, text: `My children absolutely love her. She's warm, patient and so reliable. I finally have peace of mind during my working hours.` },
      { name: n2, text: `Excellent after-school care. Kids are always happy, homework is done and they're well looked after. Couldn't ask for more.` },
    ],
    food_catering: [
      { name: n1, text: `The weekly meal prep has been a total game changer. Fresh, delicious and perfectly portioned. My family loves it.` },
      { name: n2, text: `Catered our office lunch and everyone was raving about the food. Professional setup, great variety and on time. Will book again!` },
    ],
    agriculture: [
      { name: n1, text: `The installation significantly improved our output. Very professional team and great follow-up support.` },
      { name: n2, text: `Excellent consultation service. Very practical advice that I implemented immediately with great results.` },
    ],
  }
  return reviews[category] || [
    { name: n1, text: `Outstanding service in ${loc}. Professional, punctual and really knows their work. Highly recommended!` },
    { name: n2, text: `Excellent experience from start to finish. Great communication and the quality was superb. Will use again.` },
  ]
}

const WA_SVG = (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
)


function formatHour(time: string) {
  const [h, m] = time.split(':').map(Number)
  const period = h < 12 ? 'AM' : 'PM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2,'0')} ${period}`
}
const DAY_ORDER = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

export default function ServiceStorefrontPage({ params }: { params: { slug: string } }) {
  const [store, setStore] = useState<Merchant | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    async function load() {
      const { data: merchant } = await supabase.from('merchants').select('*').eq('slug', params.slug).single()
      if (merchant) {
        setStore(merchant)
        const { data: svcs } = await supabase.from('products').select('*')
          .eq('merchant_id', merchant.id).order('created_at', { ascending: false })
        setServices(svcs || [])
        fetch('/api/analytics/view', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ merchant_id: merchant.id }) }).catch(() => {})
      }
      setLoading(false)
    }
    load()
  }, [params.slug])

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!store) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="font-display font-bold text-xl text-brand-dark mb-2">Business not found</h1>
        <Link href="/" className="bg-brand-green text-white font-bold px-6 py-3 rounded-xl text-sm inline-block mt-4">Back to Earket</Link>
      </div>
    </div>
  )

  const theme = store.theme_preset ? getThemeById(store.theme_preset) : null
  const themeStyle = theme ? getThemeStyle(theme) : { backgroundColor: store.theme_color || '#1A7A4A' }
  const color = theme?.primary || store.theme_color || '#1A7A4A'
  const contrast = theme?.textOnPrimary || getContrastColor(color)
  const waNumber = store.whatsapp_number?.replace(/\D/g, '')
  const heroImage = store.hero_image_url || CATEGORY_HERO[store.category]
  const heroOverlay = store.hero_overlay ?? 0.45
  const heroTextColor = store.hero_text_color || 'white'
  const heroFontClass = store.hero_font === 'serif' ? 'font-serif' : store.hero_font === 'mono' ? 'font-mono' : 'font-display'
  const logoPosition = store.logo_position || 'center'
  const logoSize = store.logo_size || 'medium'
  const textAlign = store.hero_text_align || 'center'
  const fontSizeClass = store.hero_font_size === 'sm' ? 'text-2xl' : store.hero_font_size === 'lg' ? 'text-4xl' : store.hero_font_size === 'xl' ? 'text-5xl' : 'text-3xl'
  const textVertical = store.hero_text_vertical || 'middle'
  const verticalClass = textVertical === 'top' ? 'justify-start pt-8' : textVertical === 'bottom' ? 'justify-end pb-8' : 'justify-center'
  const logoSizeClass = logoSize === 'small' ? 'w-20 h-20' : logoSize === 'large' ? 'w-48 h-48' : 'w-36 h-36'
  const logoCornerClass = logoSize === 'small' ? 'w-12 h-12' : logoSize === 'large' ? 'w-24 h-24' : 'w-16 h-16'
  const alignClass = textAlign === 'left' ? 'items-start text-left' : textAlign === 'right' ? 'items-end text-right' : 'items-center text-center'
  const tc = heroTextColor === 'dark' ? '#1e293b' : '#ffffff'
  const tcMuted = heroTextColor === 'dark' ? 'rgba(30,41,59,0.7)' : 'rgba(255,255,255,0.75)'
  const categoryLabel = CATEGORY_LABEL[store.category] || 'Professional Services'
  const categoryHeadline = store.description || CATEGORY_HEADLINE[store.category] || 'Quality service you can trust'
  const tagline = store.description || CATEGORY_TAGLINE[store.category] || 'Quality service you can trust'
  const available = services.filter(s => s.in_stock)
  const filtered = available.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.description || '').toLowerCase().includes(search.toLowerCase())
  )
  const bookMsg = `Hi ${store.business_name}! I'd like to make a booking. Can you tell me more about your services?`
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((store.address || store.business_name) + ' ' + store.location)}`

  function shareStore() {
    if (navigator.share) navigator.share({ title: store?.business_name, url: window.location.href })
    else { navigator.clipboard.writeText(window.location.href); alert('Link copied!') }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Holiday / Closure Banner */}
      {store.holiday_mode && (
        <div className="bg-red-500 text-white text-center px-4 py-3 text-sm font-semibold">
          🔴 {store.holiday_message || 'We are temporarily closed. Please check back soon!'}
        </div>
      )}

      {/* Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedService(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl">
            {selectedService.image_url && (
              <div className="relative h-60">
                <img src={selectedService.image_url} alt={selectedService.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-12">
                  <h2 className="font-display font-bold text-2xl text-white mb-0.5">{selectedService.name}</h2>
                  <span className="font-display font-bold text-white text-lg">{fmtPrice(selectedService)}</span>
                </div>
                <button onClick={() => setSelectedService(null)}
                  className="absolute top-4 right-4 w-9 h-9 bg-black/40 rounded-full flex items-center justify-center text-white"><X size={18} /></button>
              </div>
            )}
            <div className="p-5">
              {!selectedService.image_url && (
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="font-display font-bold text-xl text-brand-dark mb-1">{selectedService.name}</h2>
                    <p className="font-display font-bold text-xl" style={{ color }}>{fmtPrice(selectedService)}</p>
                  </div>
                  <button onClick={() => setSelectedService(null)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"><X size={16} /></button>
                </div>
              )}
              {getDuration(selectedService.name) && (
                <div className="flex items-center gap-1.5 mb-3">
                  <Clock size={13} className="text-gray-400" />
                  <span className="text-sm text-gray-500 font-medium">{getDuration(selectedService.name)}</span>
                </div>
              )}
              <p className="text-gray-600 text-sm leading-relaxed mb-5">{selectedService.description}</p>
              <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi ${store.business_name}! I'd like to book: ${selectedService.name} (${fmtPrice(selectedService)}). Please confirm availability.`)}`}
                target="_blank" rel="noreferrer"
                style={{ ...themeStyle, color: contrast } as React.CSSProperties}
                className="w-full flex items-center justify-center gap-2 font-bold py-4 rounded-2xl text-sm mb-2">
                {WA_SVG} Book This Now on WhatsApp
              </a>
              <button onClick={() => setSelectedService(null)} className="w-full text-sm text-gray-400 font-medium py-2">Back to services</button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header Bar — always clean white, always readable */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          {store.logo_url ? (
            <img src={store.logo_url} alt={store.business_name}
              className="w-12 h-12 rounded-xl object-contain flex-shrink-0"
              style={{ background: 'transparent' }} />
          ) : (
            <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-xl flex-shrink-0"
              style={themeStyle as React.CSSProperties}>
              {store.business_name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-display font-bold text-gray-900 text-base leading-tight">
              {store.business_name}
            </p>
            <p className="text-xs font-medium" style={{ color }}>{categoryLabel}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(bookMsg)}`}
            target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 text-white text-xs font-bold px-4 py-2.5 rounded-xl whitespace-nowrap"
            style={{ backgroundColor: color }}>
            {WA_SVG} Book Now
          </a>
          <button onClick={shareStore} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 flex-shrink-0">
            <Share2 size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Hero — full bleed, agency quality */}
      <div className="relative overflow-hidden" style={{ minHeight: '420px' }}>
        {heroImage ? (
          <div className="absolute inset-0">
            <img src={heroImage} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${heroOverlay + 0.25})` }} />
          </div>
        ) : (
          <div className="absolute inset-0" style={themeStyle as React.CSSProperties} />
        )}

        <div className="relative px-5 pt-8 pb-10 max-w-2xl">
          {/* Status badge */}
          <div className="flex items-center gap-1.5 mb-5">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-white/80">Open for Bookings</span>
          </div>

          {/* Category label */}
          <p className="text-xs font-bold uppercase tracking-widest mb-3 text-white/60">{categoryLabel}</p>

          {/* Big headline */}
          <h1 className={`${heroFontClass} font-bold leading-tight mb-4`}
            style={{ color: '#ffffff', fontSize: fontSizeClass === 'text-5xl' ? '2.8rem' : fontSizeClass === 'text-4xl' ? '2.4rem' : fontSizeClass === 'text-2xl' ? '1.8rem' : '2.2rem' }}>
            {categoryHeadline}
          </h1>

          {/* Subtext */}
          <p className="text-sm text-white/75 mb-6 leading-relaxed max-w-sm">{tagline !== categoryHeadline ? tagline : `Book via WhatsApp for fast, reliable service in ${store.location}.`}</p>

          {/* CTA buttons */}
          <div className="flex gap-3 mb-6">
            <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(bookMsg)}`}
              target="_blank" rel="noreferrer"
              className="flex items-center gap-2 font-bold py-3 px-5 rounded-2xl text-sm shadow-lg"
              style={{ backgroundColor: color, color: contrast }}>
              {WA_SVG} Book via WhatsApp
            </a>
            <a href="#services"
              className="flex items-center gap-2 font-bold py-3 px-5 rounded-2xl text-sm bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 transition-colors">
              See Services →
            </a>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5">
            <MapPin size={13} className="text-white/50 shrink-0" />
            <span className="text-xs text-white/60">{store.location}</span>
          </div>
        </div>

        {/* Stats bar at bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm px-5 py-3 flex items-center justify-between">
          <div className="flex gap-6">
            <div>
              <p className="text-white font-bold text-lg leading-none">{available.length}+</p>
              <p className="text-white/60 text-xs">Services</p>
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-none">Free</p>
              <p className="text-white/60 text-xs">Consultation</p>
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-none">Fast</p>
              <p className="text-white/60 text-xs">Response</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => <Star key={i} size={10} fill="white" className="text-white" />)}
            </div>
            <span className="text-white/70 text-xs">Trusted</span>
          </div>
        </div>
      </div>

      {/* Search + view toggle */}
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="search" placeholder="Search services..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white rounded-2xl pl-10 pr-4 py-3 text-sm outline-none border border-gray-200 focus:border-brand-green shadow-sm" />
          </div>
          <button onClick={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')}
            className="w-12 h-12 bg-white rounded-2xl border border-gray-200 flex items-center justify-center text-gray-500 hover:text-brand-green shadow-sm shrink-0"
            title={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}>
            {viewMode === 'grid' ? <List size={18} /> : <Grid3X3 size={18} />}
          </button>
        </div>
      </div>

      {/* Services section */}
      <div className="max-w-3xl mx-auto px-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-brand-dark text-xl">Our Services</h2>
          <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{filtered.length} available</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🔍</div>
            <p className="text-gray-600 font-semibold">No services found</p>
          </div>
        ) : viewMode === 'grid' ? (
          // ── GRID VIEW (like Encompass) ──────────────────────────────────────
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(service => (
              <div key={service.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => setSelectedService(service)}>
                <div className="relative h-40 overflow-hidden bg-gray-200">
                  {service.image_url
                    ? <img src={service.image_url} alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                    : <div className="w-full h-full flex items-center justify-center text-5xl bg-gray-100">💼</div>
                  }
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute top-2 right-2 rounded-lg px-2 py-1" style={{ backgroundColor: color }}>
                    <span className="text-xs font-bold" style={{ color: contrast }}>{fmtPrice(service)}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="font-display font-bold text-white text-sm leading-tight">{service.name}</h3>
                    {getDuration(service.name) && (
                      <div className="flex items-center gap-1 mt-1">
                        <Clock size={10} className="text-white/70" />
                        <span className="text-xs text-white/70">{getDuration(service.name)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi ${store.business_name}! I'd like to book: ${service.name}. Please confirm availability.`)}`}
                  target="_blank" rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="flex items-center justify-center gap-1.5 py-3 text-xs font-bold w-full border-t border-gray-100"
                  style={{ color }}>
                  {WA_SVG} Book Now
                </a>
              </div>
            ))}
          </div>
        ) : (
          // ── LIST VIEW ───────────────────────────────────────────────────────
          <div className="space-y-3">
            {filtered.map(service => {
              const duration = getDuration(service.name)
              return (
                <div key={service.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  <div className="flex">
                    <div className="w-36 shrink-0 relative overflow-hidden bg-gray-100 self-stretch">
                      {service.image_url
                        ? <img src={service.image_url} alt={service.name}
                            className="w-full h-full object-cover" style={{ minHeight: '130px' }} loading="lazy" />
                        : <div className="w-full h-full flex items-center justify-center text-4xl" style={{ minHeight: '130px' }}>💼</div>
                      }
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-2">
                        <span className="font-bold text-white text-sm">{fmtPrice(service)}</span>
                      </div>
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                      <div>
                        <h3 className="font-display font-bold text-brand-dark text-sm leading-tight mb-1">{service.name}</h3>
                        {duration && (
                          <div className="flex items-center gap-1 mb-1.5">
                            <Clock size={11} className="text-gray-400" />
                            <span className="text-xs text-gray-400">{duration}</span>
                          </div>
                        )}
                        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{service.description}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <button onClick={() => setSelectedService(service)}
                          className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl border hover:bg-gray-50"
                          style={{ borderColor: color, color }}>
                          Details <ChevronRight size={12} />
                        </button>
                        <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi ${store.business_name}! I'd like to book: ${service.name}. Please confirm availability.`)}`}
                          target="_blank" rel="noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-xl"
                          style={{ backgroundColor: color, color: contrast }}>
                          {WA_SVG} Book Now
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Testimonials — location-based placeholder names */}
      <div className="max-w-3xl mx-auto px-4 pb-6">
        <h2 className="font-display font-bold text-brand-dark text-xl mb-1">What Our Clients Say</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {((store as any).testimonials?.length > 0 ? (store as any).testimonials : getPlaceholderReviews(store.category, store.location)).map((t: any, i: number) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="flex gap-0.5 mb-2">
                {[1,2,3,4,5].map(j => <Star key={j} size={13} className="text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-gray-600 text-xs leading-relaxed mb-3">"{t.text}"</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ backgroundColor: color }}>
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700">{t.name}</p>
                  {t.role ? <p className="text-xs text-gray-400">{t.role}</p> : <p className="text-xs text-gray-400">{store.location}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact & Google Maps link */}
      <div className="max-w-3xl mx-auto px-4 pb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-display font-bold text-brand-dark text-base mb-4">Find Us</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: color + '20' }}>
                <MapPin size={16} style={{ color }} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-0.5">Location</p>
                <p className="text-sm font-semibold text-gray-800">{store.address || store.location}</p>
                <a href={mapsUrl} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold mt-2 px-3 py-1.5 rounded-lg"
                  style={{ backgroundColor: color + '15', color }}>
                  <ExternalLink size={11} /> Get Directions on Google Maps
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#25D366]/10 shrink-0">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#25D366]"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              </div>
              <div>
                <p className="text-xs text-gray-400">WhatsApp / Phone</p>
                <p className="text-sm font-semibold text-gray-800">+{waNumber}</p>
              </div>
            </div>
            {store.business_hours && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: color + '20' }}>
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">Business Hours</p>
                  <div className="space-y-0.5">
                    {DAY_ORDER.map(day => {
                        const val = store.business_hours![day]
                        if (!val) return null
                        return (
                          <div key={day} className="flex items-center gap-2 text-xs">
                            <span className="text-gray-500 w-8 shrink-0">{day}</span>
                            {val.closed
                              ? <span className="text-red-400 font-medium">Closed</span>
                              : <span className="text-gray-700 font-medium">{formatHour(val.open)} – {formatHour(val.close)}</span>
                            }
                          </div>
                        )
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Map — Google Maps embed search, free no API key needed */}
        <a href={mapsUrl} target="_blank" rel="noreferrer"
          className="mt-3 block rounded-2xl overflow-hidden border border-gray-200 hover:opacity-95 transition-opacity">
          <iframe
            title="Business location map"
            width="100%"
            height="200"
            loading="lazy"
            style={{ border: 0, display: 'block' }}
            src={`https://maps.google.com/maps?q=${encodeURIComponent((store.address || store.business_name) + ' ' + store.location)}&output=embed&z=15`}
            allowFullScreen
          />
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-100">
            <div className="flex items-center gap-2 min-w-0">
              <MapPin size={14} style={{ color }} className="shrink-0" />
              <span className="text-xs font-semibold text-gray-700 truncate">
                {store.address || store.location}
              </span>
            </div>
            <span className="text-xs font-semibold flex items-center gap-1 shrink-0 ml-2" style={{ color }}>
              Open Maps <ExternalLink size={10} />
            </span>
          </div>
        </a>
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-gray-100 px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(bookMsg)}`}
            target="_blank" rel="noreferrer"
            style={{ ...(themeStyle as object), color: contrast } as React.CSSProperties}
            className="w-full flex items-center justify-center gap-2 font-bold py-4 rounded-2xl text-sm shadow-lg">
            {WA_SVG} Book via WhatsApp — {store.business_name}
          </a>
        </div>
      </div>

      {/* Footer — uses theme color */}
      <div className="max-w-3xl mx-auto px-4 py-6 text-center">
        <div className="rounded-2xl p-5" style={{ ...(themeStyle as object) }}>
          <p className="text-xs mb-1" style={{ color: contrast, opacity: 0.7 }}>Powered by</p>
          <p className="font-display font-bold text-lg mb-1" style={{ color: contrast }}>Earket 🛒</p>
          <p className="text-xs mb-4" style={{ color: contrast, opacity: 0.7 }}>Build your free business page in 5 minutes</p>
          <Link href="/onboarding"
            className="inline-block font-bold text-sm px-6 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm"
            style={{ color: contrast }}>
            Start Free — earket.com
          </Link>
        </div>
      </div>
    </div>
  )
}
