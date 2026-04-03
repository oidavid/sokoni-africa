'use client'
import { useState, useEffect } from 'react'
import { MapPin, Share2, Phone, Star, Search, X, ChevronRight, MessageCircle, ExternalLink, CheckCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import StoreJsonLd from '@/components/StoreJsonLd'
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
  logo_url: string | null
  business_type?: string
  theme_preset?: string
  address?: string
  holiday_mode?: boolean
  holiday_message?: string
  business_hours?: Record<string, {open: string; close: string; closed: boolean}>
  profile_photo_url?: string
  testimonials?: Array<{name: string; role: string; text: string; rating: number}>
  updated_at?: string
  instagram?: string
  facebook?: string
  linkedin?: string
  twitter_x?: string
  website?: string
  youtube?: string
  tiktok?: string
  other_link?: string
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
  coaching: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80',
  mental_wellness: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80',
  education: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80',
  digital_services: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&q=80',
  health_wellness: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80',
}

const CATEGORY_HEADLINE: Record<string, string> = {
  coaching: 'Transform your life. Unlock your full potential.',
  mental_wellness: 'Your mind matters. You deserve real support.',
  education: 'Knowledge that opens every door.',
  digital_services: 'Smart, results-driven solutions for your business.',
  health_wellness: 'Your health and wellbeing, our highest priority.',
  womens_empowerment: 'Rise into the powerful woman you were built to be.',
  business_coach: 'Build a business that matches your ambition.',
  childcare: 'Trusted care for your most precious people.',
  food_catering: 'Exceptional food, created with care and skill.',
  events: 'Every occasion, made unforgettable.',
  domestic: 'Your home, immaculate. Your time, yours again.',
  transport: 'Professional, reliable and always on time.',
  agriculture: 'Grow more. Earn more. Farm smarter.',
}

const CATEGORY_SUBHEADLINE: Record<string, string> = {
  coaching: 'Book a free discovery call and take the first step toward the life you truly want.',
  mental_wellness: 'A safe, confidential space to heal, grow and find your balance again.',
  education: 'Qualified, passionate and deeply committed to your success.',
  digital_services: 'From branding to digital strategy — professional solutions that grow your business.',
  health_wellness: 'Evidence-based care and wellness support, delivered with genuine compassion.',
  womens_empowerment: 'A powerful, confidential space to break barriers and step fully into your potential.',
  business_coach: 'Strategy, clarity and accountability — everything you need to grow with confidence.',
  childcare: 'Experienced, background-checked and genuinely caring. Because your family deserves the best.',
  food_catering: 'From intimate dinners to large events — fresh, flavourful and beautifully presented.',
  events: 'Professional planning and execution so you can enjoy every moment without worry.',
  domestic: 'Reliable, thorough and discreet. A cleaner home without lifting a finger.',
  transport: 'Safe, punctual and professional — whether across town or across the city.',
  agriculture: 'Expert agricultural services to maximise your yields and grow a profitable farm.',
}

const CATEGORY_LABEL: Record<string, string> = {
  coaching: 'Life Coaching & Mentoring',
  mental_wellness: 'Mental Wellness & Counselling',
  education: 'Education & Tutoring',
  digital_services: 'Digital & Tech Services',
  health_wellness: 'Health & Wellness',
  womens_empowerment: "Women's Empowerment Coaching",
  business_coach: 'Business Coaching & Strategy',
  childcare: 'Childcare & Nanny Services',
  food_catering: 'Food & Catering',
  events: 'Events & Entertainment',
  domestic: 'Home & Cleaning Services',
  transport: 'Transport & Logistics',
  agriculture: 'Agricultural Services',
}

const HOW_I_WORK: Record<string, Array<{ icon: string; title: string; desc: string }>> = {
  coaching: [
    { icon: '📞', title: 'Free Discovery Call', desc: 'We start with a free 30-min call to understand your goals and see if we are the right fit.' },
    { icon: '🗺️', title: 'Personalised Plan', desc: 'Together we create a clear coaching plan tailored to exactly where you want to go.' },
    { icon: '🚀', title: 'Transform & Grow', desc: 'Regular sessions, accountability and support as you take action and create real change.' },
  ],
  mental_wellness: [
    { icon: '🤝', title: 'Initial Consultation', desc: 'A confidential first session to understand your needs and what kind of support would help.' },
    { icon: '🗓️', title: 'Tailored Sessions', desc: 'Regular one-on-one sessions using evidence-based techniques suited to your situation.' },
    { icon: '💙', title: 'Ongoing Support', desc: 'Continued care with progress check-ins and adjustments as you heal and grow.' },
  ],
  education: [
    { icon: '📋', title: 'Assessment', desc: 'We assess your current level, goals and learning style to create the right plan.' },
    { icon: '📚', title: 'Structured Learning', desc: 'Regular sessions with clear milestones, materials and practice to ensure real progress.' },
    { icon: '🏆', title: 'Results', desc: 'Track your progress and celebrate achievements. We stay with you until you reach your goal.' },
  ],
  digital_services: [
    { icon: '💬', title: 'Discovery Chat', desc: 'We discuss your business, goals and what you need. No pressure, just clarity.' },
    { icon: '📐', title: 'Proposal & Plan', desc: 'We send a clear proposal with scope, timeline and pricing. No hidden costs.' },
    { icon: '✅', title: 'Delivery & Support', desc: 'We deliver on time and provide ongoing support to make sure everything works perfectly.' },
  ],
  health_wellness: [
    { icon: '🩺', title: 'Initial Assessment', desc: 'A thorough assessment of your health, goals and any concerns before we begin.' },
    { icon: '📝', title: 'Personalised Programme', desc: 'A tailored plan designed specifically for your body, goals and lifestyle.' },
    { icon: '📈', title: 'Track & Adjust', desc: 'Regular check-ins to monitor progress, celebrate wins and adjust the plan as needed.' },
  ],
}


function buildSocialLink(platform: string, value: string): string {
  const v = value.trim().replace(/\/+$/, '')
  if (!v) return ''
  const domains: Record<string, string[]> = {
    instagram: ['instagram.com'],
    facebook:  ['facebook.com'],
    linkedin:  ['linkedin.com'],
    twitter_x: ['x.com', 'twitter.com'],
    youtube:   ['youtube.com'],
    tiktok:    ['tiktok.com'],
  }
  const platformDomains = domains[platform] || []
  if (platformDomains.some(d => v.includes(d))) {
    return v.startsWith('http') ? v : 'https://' + v
  }
  const handle = v.replace(/^@/, '')
  const builders: Record<string, string> = {
    instagram: `https://instagram.com/${handle}`,
    facebook:  `https://facebook.com/${handle}`,
    linkedin:  `https://linkedin.com/in/${handle}`,
    twitter_x: `https://x.com/${handle}`,
    youtube:   `https://youtube.com/@${handle}`,
    tiktok:    `https://tiktok.com/@${handle}`,
  }
  return builders[platform] || (v.startsWith('http') ? v : `https://${v}`)
}

function getContrastColor(hex: string): string {
  if (!hex || hex.length < 7) return '#ffffff'
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? '#111827' : '#ffffff'
}

function getRegionNames(location: string): { first: [string, string]; last: [string, string] } {
  const loc = (location || '').toLowerCase()
  if (/\b(ar|tx|ca|ny|fl|ga|il|oh|wa|co|nc|az|nv|tn|mo|wi|mn|or|ok|la|ut|rogers|bentonville|atlanta|dallas|houston|chicago|miami|seattle|denver|boston|portland|austin|nashville|los angeles|new york|san francisco|philadelphia)\b/.test(loc)) {
    return { first: ['Jessica', 'Michael'], last: ['Thompson', 'Williams'] }
  }
  if (/\b(london|manchester|birmingham|leeds|glasgow|edinburgh|bristol|uk|england)\b/.test(loc)) {
    return { first: ['Sophie', 'James'], last: ['Harrison', 'Bennett'] }
  }
  if (/\b(lagos|abuja|port harcourt|accra|kumasi|nigeria|ghana|benin|enugu)\b/.test(loc)) {
    return { first: ['Amara', 'Chidi'], last: ['Okonkwo', 'Mensah'] }
  }
  if (/\b(nairobi|kampala|dar es salaam|kigali|kenya|uganda|tanzania)\b/.test(loc)) {
    return { first: ['Grace', 'Brian'], last: ['Wanjiku', 'Otieno'] }
  }
  return { first: ['Sarah', 'Marcus'], last: ['Mitchell', 'Johnson'] }
}

function getPlaceholderReviews(category: string, location: string) {
  const loc = location || 'the area'
  const names = getRegionNames(location)
  const n1 = `${names.first[0]} ${names.last[0][0]}.`
  const n2 = `${names.first[1]} ${names.last[1][0]}.`
  const reviews: Record<string, Array<{ name: string; text: string; role: string }>> = {
    coaching: [
      { name: n1, text: 'This coaching completely changed the direction of my life. I came in feeling lost and left with a clear vision and the confidence to actually go for it.', role: 'Entrepreneur' },
      { name: n2, text: 'Best investment I have ever made in myself. The sessions were deep, practical and I saw real results within weeks. Cannot recommend enough.', role: 'Marketing Manager' },
    ],
    mental_wellness: [
      { name: n1, text: 'Finally found a space where I felt truly heard and not judged. The sessions helped me manage my anxiety in ways I never thought possible.', role: 'Teacher' },
      { name: n2, text: 'Compassionate, professional and genuinely transformational. I came in overwhelmed and left with practical tools that actually work in real life.', role: 'Parent' },
    ],
    education: [
      { name: n1, text: 'My child grades improved dramatically after just 4 sessions. Patient, knowledgeable and explains everything in a way that actually clicks.', role: 'Parent' },
      { name: n2, text: 'Excellent preparation and study techniques. Results showed within weeks and my confidence in the subject completely turned around.', role: 'Student' },
    ],
    digital_services: [
      { name: n1, text: 'Delivered everything on time, exactly as promised. The logo and branding exceeded my expectations and my customers love it.', role: 'Small Business Owner' },
      { name: n2, text: 'Professional, communicative and really understood what I needed. Our social media engagement has grown significantly since working together.', role: 'Restaurant Owner' },
    ],
    health_wellness: [
      { name: n1, text: 'Helped me recover from my injury much faster than I expected. Very professional and genuinely caring approach throughout.', role: 'Athlete' },
      { name: n2, text: 'Training sessions are excellent. Pushes you at exactly the right pace and I saw real results within the first month.', role: 'Office Worker' },
    ],
  }
  return reviews[category] || [
    { name: n1, text: `Outstanding service in ${loc}. Professional, attentive and genuinely committed to getting results. Highly recommended.`, role: 'Client' },
    { name: n2, text: 'Excellent experience from start to finish. Great communication and the quality of the work was superb. Will definitely return.', role: 'Client' },
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

export default function ConsultationStorefrontPage({ params }: { params: { slug: string } }) {
  const [store, setStore] = useState<Merchant | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [search, setSearch] = useState('')
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formService, setFormService] = useState('')
  const [formMessage, setFormMessage] = useState('')
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formError, setFormError] = useState('')
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedbackRating, setFeedbackRating] = useState(0)
  const [feedbackText, setFeedbackText] = useState('')
  const [feedbackAnon, setFeedbackAnon] = useState(false)
  const [feedbackSent, setFeedbackSent] = useState(false)
  const [feedbackSending, setFeedbackSending] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: merchant } = await supabase
        .from('merchants')
        .select('*')
        .eq('slug', params.slug)
        .single()
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
  const heroImage = CATEGORY_HERO[store.category] || CATEGORY_HERO.coaching
  const headline = CATEGORY_HEADLINE[store.category] || 'Professional services tailored to your needs.'
  const subheadline = CATEGORY_SUBHEADLINE[store.category] || 'Get in touch to discuss how we can help.'
  const categoryLabel = CATEGORY_LABEL[store.category] || 'Professional Services'
  const howItWorks = HOW_I_WORK[store.category] || HOW_I_WORK.coaching
  const reviews = getPlaceholderReviews(store.category, store.location)
  const available = services.filter(s => s.in_stock)
  const filtered = available.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.description || '').toLowerCase().includes(search.toLowerCase())
  )
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((store.address || store.business_name) + ' ' + store.location)}`
  const bookMsg = `Hi ${store.business_name}! I'd like to book a free discovery call. Please let me know your availability.`
  const locationStr = store.location ? ` based in ${store.location}` : ''
  const personalDescription = store.description || `${store.business_name} is a trusted ${categoryLabel.toLowerCase()}${locationStr}. We are passionate about helping our clients achieve meaningful, lasting results.`

  function shareStore() {
    if (navigator.share) navigator.share({ title: store?.business_name, url: window.location.href })
    else { navigator.clipboard.writeText(window.location.href); alert('Link copied!') }
  }

  async function submitFeedback() {
    if (!feedbackRating) return
    setFeedbackSending(true)
    try {
      await supabase.from('feedback').insert({
        merchant_id: store?.id,
        merchant_slug: store?.slug,
        rating: feedbackRating,
        message: feedbackText.trim() || null,
        anonymous: feedbackAnon,
        page_url: typeof window !== 'undefined' ? window.location.href : null,
      })
    } catch {}
    setFeedbackSent(true)
    setFeedbackSending(false)
    setTimeout(() => { setFeedbackOpen(false); setFeedbackSent(false); setFeedbackRating(0); setFeedbackText('') }, 2000)
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formName.trim() || !formEmail.trim()) { setFormError('Please enter your name and email.'); return }
    setFormSubmitting(true)
    setFormError('')
    try {
      await supabase.from('leads').insert({
        merchant_id: store?.id,
        name: formName,
        email: formEmail,
        phone: formPhone,
        service_interest: formService,
        message: formMessage,
      })
      // Send email notification via our API route
      await fetch('/api/leads/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchant_id: store?.id, name: formName, email: formEmail, service: formService, message: formMessage }),
      }).catch(() => {})
      setFormSubmitted(true)
    } catch {
      setFormError('Something went wrong. Please try WhatsApp instead.')
    }
    setFormSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Holiday / Closure Banner */}
      {store.holiday_mode && (
        <div className="bg-red-500 text-white text-center px-4 py-3 text-sm font-semibold">
          🔴 {store.holiday_message || 'We are temporarily closed. Please check back soon!'}
        </div>
      )}

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedService(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl">
            {selectedService.image_url && (
              <div className="relative h-52">
                <img src={selectedService.image_url} alt={selectedService.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <h2 className="absolute bottom-4 left-4 right-12 font-display font-bold text-2xl text-white">{selectedService.name}</h2>
                <button onClick={() => setSelectedService(null)}
                  className="absolute top-4 right-4 w-9 h-9 bg-black/40 rounded-full flex items-center justify-center text-white"><X size={18} /></button>
              </div>
            )}
            <div className="p-5">
              {!selectedService.image_url && (
                <div className="flex items-start justify-between mb-3">
                  <h2 className="font-display font-bold text-xl text-brand-dark flex-1 pr-4">{selectedService.name}</h2>
                  <button onClick={() => setSelectedService(null)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"><X size={16} /></button>
                </div>
              )}
              <p className="text-gray-600 text-sm leading-relaxed mb-5">{selectedService.description}</p>
              <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi ${store.business_name}! I'm interested in: ${selectedService.name}. Can we book a call to discuss?`)}`}
                target="_blank" rel="noreferrer"
                style={{ ...(themeStyle as object), color: contrast } as React.CSSProperties}
                className="w-full flex items-center justify-center gap-2 font-bold py-4 rounded-2xl text-sm mb-2">
                {WA_SVG} Book a Free Call to Discuss This
              </a>
              <button onClick={() => setSelectedService(null)} className="w-full text-sm text-gray-400 font-medium py-2">Back</button>
            </div>
          </div>
        </div>
      )}

      {/* ── NAVBAR ── */}
      <nav className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {store.logo_url
              ? <img src={store.logo_url} alt={store.business_name} className="w-14 h-14 rounded-xl object-contain shadow-sm" />
              : <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-sm" style={themeStyle as React.CSSProperties}>{store.business_name[0]}</div>
            }
            <div>
              <p className="font-display font-bold text-base text-gray-900 leading-tight">{store.business_name}</p>
              <p className="text-xs font-medium" style={{ color }}>{categoryLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(bookMsg)}`}
              target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 text-sm font-bold px-5 py-2.5 rounded-xl text-white shadow-sm"
              style={themeStyle as React.CSSProperties}>
              {WA_SVG} <span className="hidden sm:inline">Book a Free Call</span><span className="sm:hidden">Book</span>
            </a>
            <button onClick={shareStore} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-200">
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── SPLIT HERO — light background, text left, photo right ── */}
      <div className="bg-white">
        <div className="max-w-3xl mx-auto px-4 py-10 sm:py-16">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* Text — left side */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center gap-2 mb-4 justify-center sm:justify-start">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color }} />
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color }}>Accepting new clients</span>
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">{categoryLabel}</p>
              <h1 className="font-display font-bold text-gray-900 leading-tight mb-4"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>
                {headline}
              </h1>
              <div className="w-12 h-1 rounded-full mb-4 mx-auto sm:mx-0" style={{ backgroundColor: color }} />
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 max-w-md mx-auto sm:mx-0">
                {subheadline}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-xs mx-auto sm:mx-0">
                <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(bookMsg)}`}
                  target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 font-bold py-3.5 px-6 rounded-2xl text-sm shadow-lg"
                  style={{ backgroundColor: color, color: contrast }}>
                  {WA_SVG} Book a Free Call
                </a>
                <a href={`tel:+${waNumber}`}
                  className="flex items-center justify-center gap-2 border-2 font-semibold py-3.5 px-5 rounded-2xl text-sm"
                  style={{ borderColor: color, color }}>
                  <Phone size={15} /> Call Us
                </a>
              </div>
              {store.location && (
                <div className="flex items-center gap-1.5 mt-4 justify-center sm:justify-start">
                  <MapPin size={12} className="text-gray-400 shrink-0" />
                  <span className="text-xs text-gray-400">{store.location}</span>
                </div>
              )}
            </div>

            {/* Photo — right side */}
            <div className="shrink-0 flex flex-col items-center">
              {store.profile_photo_url ? (
                <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-full overflow-hidden shadow-2xl ring-4"
                  style={{ border: `4px solid ${color}` }}>
                  <img src={`${store.profile_photo_url}?v=${store.updated_at || Date.now()}`} alt={store.business_name}
                    className="w-full h-full object-cover object-top" />
                </div>
              ) : store.logo_url ? (
                <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-full overflow-hidden shadow-2xl bg-white"
                  style={{ border: `4px solid ${color}30` }}>
                  <img src={store.logo_url} alt={store.business_name}
                    className="w-full h-full object-contain p-6" />
                </div>
              ) : (
                <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-full flex flex-col items-center justify-center shadow-md"
                  style={{ backgroundColor: color + '10', border: `3px dashed ${color}40` }}>
                  <span className="text-4xl mb-2">📸</span>
                  <p className="text-xs text-gray-400 text-center px-4 leading-tight">Add your photo<br/>in Settings</p>
                </div>
              )}
              {/* Decorative circle behind photo */}
              <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-full absolute -z-10 translate-x-3 translate-y-3 opacity-20"
                style={{ backgroundColor: color }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── EMPATHY SECTION — "Are you struggling with...?" ── */}
      <div className="py-10 px-4" style={{ backgroundColor: color + '08' }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            <div className="flex-1">
              <h2 className="font-display font-bold text-2xl sm:text-3xl leading-tight mb-4" style={{ color }}>
                {store.category === 'coaching' && 'Are you ready to stop playing small and start living fully?'}
                {store.category === 'mental_wellness' && 'Are you struggling with stress, anxiety, or feeling overwhelmed?'}
                {store.category === 'education' && 'Is your child struggling to reach their full potential?'}
                {store.category === 'digital_services' && 'Is your business invisible online?'}
                {store.category === 'health_wellness' && 'Are you ready to invest in your health and feel your best?'}
                {!['coaching','mental_wellness','education','digital_services','health_wellness'].includes(store.category) && 'Ready to take the next step?'}
              </h2>
            </div>
            <div className="flex-1">
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">{personalDescription}</p>
              <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(bookMsg)}`}
                target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 font-bold text-sm px-5 py-3 rounded-xl"
                style={{ backgroundColor: color, color: contrast }}>
                {WA_SVG} Yes — Let's Talk
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div className="bg-white border-b border-gray-100 py-5 px-4">
        <div className="max-w-3xl mx-auto flex flex-wrap gap-4 justify-center sm:justify-start">
          {['Free 30-min discovery call', 'No obligation', 'Confidential & professional', '100% WhatsApp booking'].map((t, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle size={15} style={{ color }} />
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* ── CONTACT FORM ── */}
      <div className="py-10 px-4 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-8">
            {/* Form */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color }}>Get in Touch</p>
              <h2 className="font-display font-bold text-2xl text-brand-dark mb-1">Schedule a Consultation</h2>
              <p className="text-sm text-gray-500 mb-5">Fill in your details and we will be in touch within 24 hours.</p>

              {formSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: color + '20' }}>
                    <CheckCircle size={32} style={{ color }} />
                  </div>
                  <h3 className="font-display font-bold text-xl text-brand-dark mb-2">Thank you, {formName}!</h3>
                  <p className="text-gray-500 text-sm mb-5">Your message has been received. We will be in touch within 24 hours.</p>
                  <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi ${store.business_name}! I just submitted a consultation request. My name is ${formName}.`)}`}
                    target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 font-bold py-3 px-6 rounded-xl text-sm"
                    style={{ backgroundColor: color, color: contrast }}>
                    {WA_SVG} Also message on WhatsApp
                  </a>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1">First Name *</label>
                      <input type="text" value={formName} onChange={e => setFormName(e.target.value)}
                        placeholder="Your name" required
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1">Email *</label>
                      <input type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)}
                        placeholder="your@email.com" required
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">Phone / WhatsApp</label>
                    <input type="tel" value={formPhone} onChange={e => setFormPhone(e.target.value)}
                      placeholder="+1 234 567 8900"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">I'm interested in</label>
                    <select value={formService} onChange={e => setFormService(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green bg-white">
                      <option value="">Select a service...</option>
                      {available.map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                      <option value="Not sure yet">Not sure yet — I'd like to discuss</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">Message</label>
                    <textarea value={formMessage} onChange={e => setFormMessage(e.target.value)}
                      placeholder="Tell us a bit about what you're looking for..."
                      rows={3}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green resize-none" />
                  </div>
                  {formError && <p className="text-red-500 text-xs">{formError}</p>}
                  <button type="submit" disabled={formSubmitting}
                    className="w-full font-bold py-3.5 rounded-xl text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ backgroundColor: color, color: contrast }}>
                    {formSubmitting ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : 'Submit Request'}
                  </button>
                  <p className="text-xs text-gray-400 text-center">Or book instantly via WhatsApp below</p>
                </form>
              )}
            </div>

            {/* Testimonials sidebar */}
            <div className="sm:w-72 shrink-0 space-y-4">
              <p className="font-display font-bold text-lg text-brand-dark">What clients say</p>
              {((store as any).testimonials?.length > 0 ? (store as any).testimonials : getPlaceholderReviews(store.category, store.location)).map((r: any, i: number) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex gap-0.5 mb-2">
                    {[1,2,3,4,5].map(j => <Star key={j} size={12} className="text-amber-400 fill-amber-400" />)}
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed mb-3">"{r.text}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ backgroundColor: color }}>{r.name[0]}</div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">{r.name}</p>
                      <p className="text-xs text-gray-400">{r.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── HOW I WORK ── */}
      <div className="py-8" style={{ backgroundColor: color + '08' }}>
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-semibold uppercase tracking-widest mb-1 text-center" style={{ color }}>Process</p>
          <h2 className="font-display font-bold text-2xl text-brand-dark mb-6 text-center">How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {howItWorks.map((step, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3"
                  style={{ backgroundColor: color + '15' }}>
                  {step.icon}
                </div>
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white mx-auto mb-2"
                  style={{ backgroundColor: color }}>
                  {i + 1}
                </div>
                <h3 className="font-display font-bold text-brand-dark text-sm mb-1">{step.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SERVICES — alternating image+text blocks ── */}
      <div className="py-10 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest mb-1 text-center" style={{ color }}>What I Offer</p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-brand-dark mb-2 text-center">Here's How I Can Help</h2>
          <div className="w-12 h-1 rounded-full mx-auto mb-8" style={{ backgroundColor: color }} />

          {/* Search */}
          <div className="relative mb-8">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="search" placeholder="Search services..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-gray-50 rounded-2xl pl-10 pr-4 py-3 text-sm outline-none border border-gray-100 focus:border-brand-green" />
          </div>

          <div className="space-y-6">
            {filtered.map((service, idx) => (
              <div key={service.id}
                className={`flex flex-col ${idx % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'} gap-0 rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all`}>
                {/* Image */}
                {service.image_url && (
                  <div className="sm:w-2/5 shrink-0 overflow-hidden bg-gray-100" style={{ minHeight: '220px' }}>
                    <img src={service.image_url} alt={service.name}
                      className="w-full h-full object-cover" style={{ minHeight: '220px' }} loading="lazy" />
                  </div>
                )}
                {/* Content */}
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-xl text-brand-dark mb-3">{service.name}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{service.description}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi ${store.business_name}! I'm interested in: ${service.name}. Can we book a free call to discuss?`)}`}
                      target="_blank" rel="noreferrer"
                      className="flex items-center justify-center gap-2 font-bold py-3 px-5 rounded-xl text-sm"
                      style={{ backgroundColor: color, color: contrast }}>
                      {WA_SVG} Book a Free Call
                    </a>
                    <button onClick={() => setSelectedService(service)}
                      className="flex items-center justify-center gap-1 text-sm font-semibold px-4 py-3 rounded-xl border hover:bg-gray-50"
                      style={{ borderColor: color, color }}>
                      More Info <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA block */}
          <div className="mt-10 rounded-2xl p-6 text-center" style={{ backgroundColor: color, color: contrast } as React.CSSProperties}>
            <p className="font-display font-bold text-xl mb-2">Not sure where to start?</p>
            <p className="text-sm mb-5 opacity-80">Book a free 30-minute discovery call. No obligation, no pressure — just a conversation about your goals.</p>
            <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(bookMsg)}`}
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 font-bold py-3.5 px-8 rounded-2xl text-sm bg-white shadow-lg"
              style={{ color }}>
              {WA_SVG} Book Your Free Call Now
            </a>
          </div>
        </div>
      </div>

      {/* ── CONTACT & MAP ── */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color }}>Location</p>
        <h2 className="font-display font-bold text-2xl text-brand-dark mb-5">Find Us</h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-3">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: color + '20' }}>
              <MapPin size={16} style={{ color }} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-0.5">Address</p>
              <p className="text-sm font-semibold text-gray-800">{store.address || store.location}</p>
              <a href={mapsUrl} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold mt-2 px-3 py-1.5 rounded-lg"
                style={{ backgroundColor: color + '15', color }}>
                <ExternalLink size={11} /> Get Directions
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
              <div className="flex items-start gap-3 mt-3">
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
        {/* Map */}
        <a href={mapsUrl} target="_blank" rel="noreferrer" className="block rounded-2xl overflow-hidden border border-gray-200 hover:opacity-95 transition-opacity">
          <iframe title="Location map" width="100%" height="200" loading="lazy"
            style={{ border: 0, display: 'block' }}
            src={`https://maps.google.com/maps?q=${encodeURIComponent((store.address || store.business_name) + ' ' + store.location)}&output=embed&z=15`}
            allowFullScreen />
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-100">
            <div className="flex items-center gap-2 min-w-0">
              <MapPin size={14} style={{ color }} className="shrink-0" />
              <span className="text-xs font-semibold text-gray-700 truncate">{store.address || store.location}</span>
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
            {WA_SVG} Book a Free Call — {store.business_name}
          </a>
        </div>
      </div>

      {/* JSON-LD Structured Data */}
      {store && (
        <StoreJsonLd
          businessName={store.business_name}
          description={store.description}
          location={store.location}
          address={store.address}
          whatsappNumber={store.whatsapp_number}
          category={store.category}
          logoUrl={store.logo_url}
          slug={store.slug}
          themeColor={store.theme_color}
        />
      )}

      {/* Feedback Modal */}
      {feedbackOpen && store && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setFeedbackOpen(false)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            {feedbackSent ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">🙏</div>
                <div className="font-bold text-gray-900 text-lg mb-1">Thank you!</div>
                <p className="text-sm text-gray-500">Your feedback helps us improve Earket.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-gray-900 text-base">Rate your experience</h3>
                  <button onClick={() => setFeedbackOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><X size={14} /></button>
                </div>
                <div className="flex justify-center gap-3 mb-5">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => setFeedbackRating(n)}
                      className={`text-3xl transition-transform hover:scale-125 ${feedbackRating >= n ? '' : 'opacity-25'}`}>
                      ⭐
                    </button>
                  ))}
                </div>
                <textarea value={feedbackText} onChange={e => setFeedbackText(e.target.value)}
                  placeholder="Tell us more (optional)..." rows={3}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-gray-400 resize-none mb-3" />
                <label className="flex items-center gap-2 mb-5 cursor-pointer">
                  <input type="checkbox" checked={feedbackAnon} onChange={e => setFeedbackAnon(e.target.checked)} className="w-4 h-4 rounded" />
                  <span className="text-xs text-gray-500">Submit anonymously</span>
                </label>
                <button onClick={submitFeedback} disabled={!feedbackRating || feedbackSending}
                  className="w-full text-white font-bold text-sm py-3 rounded-2xl disabled:opacity-40 transition-opacity hover:opacity-90"
                  style={themeStyle as React.CSSProperties}>
                  {feedbackSending ? 'Sending...' : 'Submit Feedback'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Social Links — centered, below sticky bar, above footer */}
      {(store.instagram || store.facebook || store.linkedin || store.twitter_x || store.website || store.youtube || store.tiktok || store.other_link) && (
        <div className="max-w-3xl mx-auto px-4 mb-4 mt-2">
          <div className="bg-gray-50 rounded-2xl p-5 text-center">
            <p className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wide">Follow Us</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {store.instagram && <a href={buildSocialLink('instagram', store.instagram || '')} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors">📸 Instagram</a>}
              {store.facebook && <a href={buildSocialLink('facebook', store.facebook || '')} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">📘 Facebook</a>}
              {store.linkedin && <a href={buildSocialLink('linkedin', store.linkedin || '')} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors">💼 LinkedIn</a>}
              {store.twitter_x && <a href={buildSocialLink('twitter_x', store.twitter_x || '')} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">X / Twitter</a>}
              {store.youtube && <a href={buildSocialLink('youtube', store.youtube || '')} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">▶️ YouTube</a>}
              {store.tiktok && <a href={buildSocialLink('tiktok', store.tiktok || '')} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-black transition-colors">🎵 TikTok</a>}
              {store.website && <a href={buildSocialLink('website', store.website || '')} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-light text-brand-green hover:bg-brand-green hover:text-white transition-colors">🌐 Website</a>}
              {store.other_link && <a href={buildSocialLink('other_link', store.other_link || '')} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors">🔗 Follow Us</a>}
            </div>
          </div>
        </div>
      )}

      {/* Footer — adapts to merchant theme */}
      <div className="max-w-3xl mx-auto px-4 py-6 text-center">
        <div className="rounded-2xl p-5" style={themeStyle as React.CSSProperties}>
          {(() => {
            const isLight = contrast === '#111827'
            return (
              <>
                <p className="text-xs mb-1" style={{ color: contrast, opacity: 0.5 }}>Powered by</p>
                <Link href="/" className="font-display font-bold text-lg mb-1 inline-block transition-opacity hover:opacity-80" style={{ color: contrast }}>
                  earket
                </Link>
                <p className="text-xs mb-0.5" style={{ color: contrast, opacity: 0.55 }}>Build your own free business page in 5 minutes</p>
                <p className="text-xs mb-4" style={{ color: contrast, opacity: 0.35 }}>
                  A product of{' '}
                  <a href="https://intelsystechnology.com" target="_blank" rel="noopener noreferrer"
                     className="font-semibold transition-opacity hover:opacity-70" style={{ color: contrast }}>
                    IntelSys Technologies
                  </a>
                </p>
                <div className="flex gap-2 justify-center flex-wrap">
                  <Link href="/onboarding"
                    className="inline-block font-bold text-sm px-6 py-2.5 rounded-xl transition-opacity hover:opacity-90"
                    style={{ backgroundColor: isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.15)', color: contrast }}>
                    Start Free — earket.com
                  </Link>
                  <button onClick={() => setFeedbackOpen(true)}
                    className="inline-block font-semibold text-sm px-5 py-2.5 rounded-xl transition-opacity hover:opacity-90"
                    style={{ backgroundColor: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)', color: contrast, opacity: 0.8 }}>
                    Leave Feedback
                  </button>
                </div>
              </>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
