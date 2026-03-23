'use client'
import { useState, useEffect } from 'react'
import { MapPin, Share2, Phone, Star, Search, X, ChevronRight, MessageCircle, ExternalLink, CheckCircle } from 'lucide-react'
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
  logo_url: string | null
  business_type?: string
  theme_preset?: string
  address?: string
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
  mental_wellness: 'Your mind matters. You deserve support.',
  education: 'Knowledge that opens doors.',
  digital_services: 'Smart solutions for your business.',
  health_wellness: 'Your health and wellbeing, our priority.',
}

const CATEGORY_SUBHEADLINE: Record<string, string> = {
  coaching: 'Book a free discovery call and take the first step toward the life you want.',
  mental_wellness: 'A safe, confidential space to heal, grow and find your balance.',
  education: 'Qualified, passionate and committed to your success.',
  digital_services: 'From branding to digital marketing — we help your business grow online.',
  health_wellness: 'Evidence-based care, delivered with compassion.',
}

const CATEGORY_LABEL: Record<string, string> = {
  coaching: 'Coaching & Mentoring',
  mental_wellness: 'Mental Wellness & Counselling',
  education: 'Education & Tutoring',
  digital_services: 'Digital & Tech Services',
  health_wellness: 'Health & Wellness',
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

export default function ConsultationStorefrontPage({ params }: { params: { slug: string } }) {
  const [store, setStore] = useState<Merchant | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [search, setSearch] = useState('')

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

  return (
    <div className="min-h-screen bg-white">

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
      <nav className="relative z-20 flex items-center justify-between px-4 py-4 max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-3">
          {store.logo_url
            ? <img src={store.logo_url} alt={store.business_name} className="w-10 h-10 rounded-xl object-contain bg-white shadow-sm" />
            : <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm" style={themeStyle as React.CSSProperties}>💼</div>
          }
          <div>
            <p className="font-display font-bold text-sm text-gray-900 leading-tight">{store.business_name}</p>
            <p className="text-xs text-gray-500">{categoryLabel}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(bookMsg)}`}
            target="_blank" rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl text-white"
            style={themeStyle as React.CSSProperties}>
            {WA_SVG} Book a Call
          </a>
          <button onClick={shareStore} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-200">
            <Share2 size={15} />
          </button>
        </div>
      </nav>

      {/* ── HERO ── Clean minimal, full-width image, one headline ── */}
      <div className="relative overflow-hidden" style={{ minHeight: '480px' }}>
        {heroImage && (
          <div className="absolute inset-0">
            <img src={heroImage} alt="" className="w-full h-full object-cover object-top" />
            {/* Light gradient — dark at bottom, mostly transparent at top */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/75" />
          </div>
        )}
        {/* Accepting badge */}
        <div className="relative px-4 pt-4 flex justify-end max-w-3xl mx-auto">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-white">Accepting new clients</span>
          </div>
        </div>

        {/* Hero text — bottom aligned, clean */}
        <div className="relative flex flex-col items-center justify-end text-center px-6 pb-12 pt-24 max-w-3xl mx-auto">
          <h1 className="font-display font-bold text-white leading-tight mb-3"
            style={{ fontSize: 'clamp(1.75rem, 5vw, 2.75rem)' }}>
            {headline}
          </h1>
          <p className="text-white/85 text-sm sm:text-base leading-relaxed mb-8 max-w-md">
            {personalDescription.length > 120 ? subheadline : personalDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
            <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(bookMsg)}`}
              target="_blank" rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-white font-bold py-4 rounded-2xl text-sm shadow-xl"
              style={{ color }}>
              {WA_SVG} Book a Free Call
            </a>
            <a href={`tel:+${waNumber}`}
              className="flex items-center justify-center gap-2 bg-white/25 backdrop-blur-sm border border-white/30 text-white font-semibold py-4 px-5 rounded-2xl text-sm">
              <Phone size={16} /> Call
            </a>
          </div>
          <div className="flex items-center gap-1.5 mt-4">
            <MapPin size={12} className="text-white/50 shrink-0" />
            <span className="text-xs text-white/60">{store.location}</span>
          </div>
        </div>
      </div>

      {/* ── ABOUT ME ── */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          {/* Profile photo placeholder */}
          <div className="w-full sm:w-40 shrink-0">
            {store.logo_url ? (
              <img src={store.logo_url} alt={store.business_name}
                className="w-full sm:w-40 h-48 sm:h-48 rounded-2xl object-cover shadow-md" />
            ) : (
              <div className="w-full sm:w-40 h-48 sm:h-48 rounded-2xl bg-gray-100 flex flex-col items-center justify-center shadow-sm border-2 border-dashed border-gray-200">
                <span className="text-4xl mb-2">📸</span>
                <p className="text-xs text-gray-400 text-center px-2">Upload your photo from your Dashboard</p>
              </div>
            )}
          </div>
          {/* Bio */}
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color }}>About</p>
            <h2 className="font-display font-bold text-2xl text-brand-dark mb-3">{store.business_name}</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">{personalDescription}</p>
            <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(bookMsg)}`}
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl"
              style={{ backgroundColor: color + '15', color }}>
              {WA_SVG} Let's Talk
            </a>
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

      {/* ── SERVICES — no prices ── */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color }}>What I Offer</p>
            <h2 className="font-display font-bold text-2xl text-brand-dark">Services</h2>
          </div>
          <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{filtered.length} available</span>
        </div>
        <p className="text-sm text-gray-500 mb-5">Book a free call to discuss the right service for your needs and goals.</p>

        {/* Search */}
        <div className="relative mb-5">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="search" placeholder="Search services..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-50 rounded-2xl pl-10 pr-4 py-3 text-sm outline-none border border-gray-200 focus:border-brand-green" />
        </div>

        <div className="space-y-4">
          {filtered.map(service => (
            <div key={service.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div className="flex">
                {service.image_url && (
                  <div className="w-28 sm:w-36 shrink-0 overflow-hidden">
                    <img src={service.image_url} alt={service.name}
                      className="w-full h-full object-cover" style={{ minHeight: '120px' }} loading="lazy" />
                  </div>
                )}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-brand-dark text-base leading-tight mb-1">{service.name}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">{service.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setSelectedService(service)}
                      className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl border transition-colors hover:bg-gray-50"
                      style={{ borderColor: color, color }}>
                      Learn More <ChevronRight size={12} />
                    </button>
                    <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi ${store.business_name}! I'm interested in: ${service.name}. Can we book a free call to discuss?`)}`}
                      target="_blank" rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-xl"
                      style={{ backgroundColor: color, color: contrast }}>
                      {WA_SVG} Book a Free Call
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA after services */}
        <div className="mt-6 rounded-2xl p-5 text-center" style={{ backgroundColor: color + '10', border: `1px solid ${color}25` }}>
          <p className="font-display font-bold text-brand-dark text-base mb-1">Not sure where to start?</p>
          <p className="text-gray-500 text-xs mb-4">Book a free 30-minute discovery call. No obligation, no pressure — just a conversation.</p>
          <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(bookMsg)}`}
            target="_blank" rel="noreferrer"
            style={{ backgroundColor: color, color: contrast }}
            className="inline-flex items-center gap-2 font-bold py-3 px-6 rounded-2xl text-sm">
            {WA_SVG} Book Your Free Call Now
          </a>
        </div>
      </div>

      {/* ── TESTIMONIALS ── */}
      <div className="py-8" style={{ backgroundColor: color + '08' }}>
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-semibold uppercase tracking-widest mb-1 text-center" style={{ color }}>Social Proof</p>
          <h2 className="font-display font-bold text-2xl text-brand-dark mb-1 text-center">Client Stories</h2>
          <p className="text-xs text-gray-400 mb-6 text-center">Log in to your dashboard to add real client testimonials</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {reviews.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex gap-0.5 mb-3">
                  {[1,2,3,4,5].map(j => <Star key={j} size={14} className="text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0"
                    style={{ backgroundColor: color }}>
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-dark">{r.name}</p>
                    <p className="text-xs text-gray-400">{r.role} · {store.location}</p>
                  </div>
                </div>
              </div>
            ))}
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

      {/* Footer */}
      <div className="max-w-3xl mx-auto px-4 py-6 text-center">
        <div className="rounded-2xl p-5" style={themeStyle as React.CSSProperties}>
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
