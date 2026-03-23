'use client'
import { useState, useEffect } from 'react'
import { MapPin, Share2, Phone, Star, Search, X, Clock, ChevronRight } from 'lucide-react'
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
  theme_color?: string
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
  beauty_services: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80',
  home_services: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80',
  auto_services: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=1200&q=80',
  education: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80',
  health_wellness: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80',
  domestic: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=1200&q=80',
  events: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80',
  digital_services: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&q=80',
  transport: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=80',
  agriculture: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&q=80',
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
  if (n.includes('daily') || n.includes('monthly')) return 'Per session'
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

const WA_SVG = (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
)

export default function ServiceStorefrontPage({ params }: { params: { slug: string } }) {
  const [store, setStore] = useState<Merchant | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedService, setSelectedService] = useState<Service | null>(null)

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

  const color = store.theme_color || '#1A7A4A'
  const contrast = getContrastColor(color)
  const waNumber = store.whatsapp_number?.replace(/\D/g, '')
  const heroImage = CATEGORY_HERO[store.category]
  const categoryLabel = CATEGORY_LABEL[store.category] || 'Professional Services'
  const tagline = store.description || CATEGORY_TAGLINE[store.category] || 'Quality service you can trust'
  const available = services.filter(s => s.in_stock)
  const filtered = available.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.description || '').toLowerCase().includes(search.toLowerCase())
  )
  const bookMsg = `Hi ${store.business_name}! I'd like to make a booking. Can you tell me more about your services?`

  function shareStore() {
    if (navigator.share) navigator.share({ title: store?.business_name, url: window.location.href })
    else { navigator.clipboard.writeText(window.location.href); alert('Link copied!') }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedService(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl">
            {selectedService.image_url && (
              <div className="relative h-56">
                <img src={selectedService.image_url} alt={selectedService.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-12">
                  <h2 className="font-display font-bold text-xl text-white mb-0.5">{selectedService.name}</h2>
                  <span className="font-display font-bold text-white text-lg">{fmtPrice(selectedService)}</span>
                </div>
                <button onClick={() => setSelectedService(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white">
                  <X size={16} />
                </button>
              </div>
            )}
            <div className="p-5">
              {!selectedService.image_url && (
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="font-display font-bold text-xl text-brand-dark mb-1">{selectedService.name}</h2>
                    <p className="font-display font-bold text-lg" style={{ color }}>{fmtPrice(selectedService)}</p>
                  </div>
                  <button onClick={() => setSelectedService(null)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <X size={16} />
                  </button>
                </div>
              )}
              {getDuration(selectedService.name) && (
                <div className="flex items-center gap-1.5 mb-3">
                  <Clock size={13} className="text-gray-400" />
                  <span className="text-sm text-gray-500">{getDuration(selectedService.name)}</span>
                </div>
              )}
              <p className="text-gray-600 text-sm leading-relaxed mb-5">{selectedService.description}</p>
              <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi ${store.business_name}! I'd like to book: ${selectedService.name} (${fmtPrice(selectedService)}). Please confirm availability.`)}`}
                target="_blank" rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-4 rounded-2xl text-sm mb-2">
                {WA_SVG} Book This Now on WhatsApp
              </a>
              <button onClick={() => setSelectedService(null)} className="w-full text-sm text-gray-400 font-medium py-2">
                Back to services
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="relative overflow-hidden" style={store.theme_preset ? getThemeStyle(getThemeById(store.theme_preset)) : { backgroundColor: color }}>
        {heroImage && (
          <div className="absolute inset-0">
            <img src={heroImage} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: store.theme_preset ? getThemeStyle(getThemeById(store.theme_preset)).background || color : color, opacity: 0.80 }} />
          </div>
        )}
        <div className="relative max-w-3xl mx-auto px-4 pt-5 pb-8">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-white">Open for bookings</span>
            </div>
            <button onClick={shareStore} className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30">
              <Share2 size={16} />
            </button>
          </div>

          <div className="flex items-start gap-4 mb-5">
            <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden flex items-center justify-center shrink-0 shadow-xl">
              {store.logo_url
                ? <img src={store.logo_url} alt={store.business_name} className="w-full h-full object-cover" />
                : <span className="text-3xl">💼</span>
              }
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <h1 className="font-display font-bold text-2xl text-white leading-tight mb-1">{store.business_name}</h1>
              <p className="text-sm font-medium text-white/80 mb-2">{categoryLabel}</p>
              <div className="flex items-center gap-1.5">
                <MapPin size={12} className="text-white/60" />
                <span className="text-xs text-white/70">{store.location}</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-white/85 mb-5 leading-relaxed italic">"{tagline}"</p>

          <div className="flex gap-3 mb-5">
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-3 text-center min-w-[72px]">
              <div className="font-display font-bold text-2xl text-white">{available.length}</div>
              <div className="text-xs text-white/70">Services</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-3 text-center">
              <div className="flex gap-0.5 justify-center mb-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} size={11} fill="white" className="text-white" />)}
              </div>
              <div className="text-xs text-white/70">Top Rated</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-3 flex-1 flex items-center justify-center gap-2">
              {WA_SVG}
              <div>
                <div className="font-bold text-sm text-white">WhatsApp</div>
                <div className="text-xs text-white/70">Instant Booking</div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(bookMsg)}`}
              target="_blank" rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3.5 rounded-2xl text-sm shadow-lg">
              {WA_SVG} Book via WhatsApp
            </a>
            <a href={`tel:+${waNumber}`}
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center hover:bg-white/30 text-white shrink-0">
              <Phone size={18} />
            </a>
          </div>
        </div>
      </div>



      {/* Search */}
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="search" placeholder="Search services..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white rounded-2xl pl-10 pr-4 py-3 text-sm outline-none border border-gray-200 focus:border-brand-green shadow-sm" />
        </div>
      </div>

      {/* Services list */}
      <div className="max-w-3xl mx-auto px-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-brand-dark text-lg">Our Services</h2>
          <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{filtered.length} available</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🔍</div>
            <p className="text-gray-600 font-semibold">No services found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(service => {
              const duration = getDuration(service.name)
              return (
                <div key={service.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  <div className="flex">
                    <div className="w-36 sm:w-44 shrink-0 relative overflow-hidden bg-gray-100 self-stretch">
                      {service.image_url
                        ? <img src={service.image_url} alt={service.name}
                            className="w-full h-full object-cover" style={{ minHeight: '140px' }} loading="lazy" />
                        : <div className="w-full h-full flex items-center justify-center text-4xl" style={{ minHeight: '140px' }}>💼</div>
                      }
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-2">
                        <span className="font-display font-bold text-white text-sm">{fmtPrice(service)}</span>
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
                          className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl border hover:bg-gray-50 transition-colors"
                          style={{ borderColor: color, color }}>
                          Details <ChevronRight size={12} />
                        </button>
                        <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi ${store.business_name}! I'd like to book: ${service.name}. Please confirm availability.`)}`}
                          target="_blank" rel="noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-xl bg-[#25D366] text-white">
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

      {/* Testimonials */}
      <div className="max-w-3xl mx-auto px-4 pb-6">
        <h2 className="font-display font-bold text-brand-dark text-lg mb-4">What Our Clients Say</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { name: 'Your Client Name', text: 'Ask a happy client for a quick review and add it here. Real testimonials build enormous trust with new customers.' },
            { name: 'Another Happy Client', text: 'Replace this with a genuine review. Even one sentence from a real client makes a huge difference to your bookings.' },
          ].map((t, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-dashed border-gray-200 relative">
              <div className="absolute top-3 right-3 text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">Placeholder</div>
              <div className="flex gap-0.5 mb-2">
                {[1,2,3,4,5].map(j => <Star key={j} size={13} className="text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-gray-500 text-xs leading-relaxed mb-3 italic">"{t.text}"</p>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">?</div>
                <div>
                  <p className="text-xs font-semibold text-gray-400">{t.name}</p>
                  <p className="text-xs text-gray-300">Add via your dashboard</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact strip */}
      <div className="max-w-3xl mx-auto px-4 pb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-display font-bold text-brand-dark text-base mb-3">Contact & Location</h2>
          <div className="space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: color + '20' }}>
                <MapPin size={15} style={{ color }} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Location</p>
                <p className="text-sm font-semibold text-gray-800">{store.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#25D366]/10 shrink-0">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#25D366]"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              </div>
              <div>
                <p className="text-xs text-gray-400">WhatsApp</p>
                <p className="text-sm font-semibold text-gray-800">+{waNumber}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-gray-100 px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(bookMsg)}`}
            target="_blank" rel="noreferrer"
            style={{ backgroundColor: color, color: contrast }}
            className="w-full flex items-center justify-center gap-2 font-bold py-4 rounded-2xl text-sm shadow-lg">
            {WA_SVG} Book via WhatsApp — {store.business_name}
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-3xl mx-auto px-4 py-6 text-center">
        <div className="bg-brand-dark rounded-2xl p-5">
          <p className="text-white/60 text-xs mb-1">Powered by</p>
          <p className="font-display font-bold text-white text-lg mb-1">Earket 🛒</p>
          <p className="text-white/70 text-xs mb-4">Build your free business page in 5 minutes</p>
          <Link href="/onboarding" style={{ backgroundColor: color, color: contrast }}
            className="inline-block font-bold text-sm px-6 py-2.5 rounded-xl">
            Start Free — earket.com
          </Link>
        </div>
      </div>
    </div>
  )
}

