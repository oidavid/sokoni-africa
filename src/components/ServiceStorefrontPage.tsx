'use client'
import { useState, useEffect } from 'react'
import { MapPin, Share2, MessageCircle, Phone, Star, ChevronDown, Search, X } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

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
  home_services: 'Trusted home repairs & installations',
  auto_services: 'Professional vehicle care & repairs',
  beauty_services: 'Look and feel your best',
  education: 'Qualified tutors & trainers',
  health_wellness: 'Your health, our priority',
  domestic: 'Clean home, happy life',
  events: 'Making your moments memorable',
  digital_services: 'Tech solutions for your business',
  transport: 'Reliable delivery & transport',
  agriculture: 'Supporting farmers & agribusiness',
}

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? '#111827' : '#ffffff'
}

function fmtPrice(service: Service): string {
  return service.price_display || `₦${(service.price / 100).toLocaleString()}`
}

const WA_ICON = (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
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
          .eq('merchant_id', merchant.id).eq('in_stock', true).order('created_at', { ascending: false })
        setServices(svcs || [])
        fetch('/api/analytics/view', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ merchant_id: merchant.id }) }).catch(() => {})
      }
      setLoading(false)
    }
    load()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="font-display font-bold text-xl text-brand-dark mb-2">Business not found</h1>
          <Link href="/" className="bg-brand-green text-white font-bold px-6 py-3 rounded-xl text-sm inline-block mt-4">Back to Earket</Link>
        </div>
      </div>
    )
  }

  const color = store.theme_color || '#1A7A4A'
  const contrast = getContrastColor(color)
  const waNumber = store.whatsapp_number?.replace(/\D/g, '')
  const categoryLabel = CATEGORY_LABEL[store.category] || 'Professional Services'
  const categoryTagline = CATEGORY_TAGLINE[store.category] || 'Quality service you can trust'

  const filtered = services.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase())
  )

  function shareStore() {
    if (navigator.share) navigator.share({ title: store?.business_name, url: window.location.href })
    else { navigator.clipboard.writeText(window.location.href); alert('Link copied!') }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedService(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl">
            {selectedService.image_url && (
              <div className="relative h-52 overflow-hidden">
                <img src={selectedService.image_url} alt={selectedService.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <button onClick={() => setSelectedService(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                  <X size={16} />
                </button>
              </div>
            )}
            <div className="p-5">
              {!selectedService.image_url && (
                <button onClick={() => setSelectedService(null)} className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <X size={16} />
                </button>
              )}
              <h2 className="font-display font-bold text-xl text-brand-dark mb-2">{selectedService.name}</h2>
              <p className="text-2xl font-display font-bold mb-3" style={{ color }}>{fmtPrice(selectedService)}</p>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">{selectedService.description}</p>
              <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi ${store.business_name}! I'd like to book: ${selectedService.name} (${fmtPrice(selectedService)}). Please confirm availability.`)}`}
                target="_blank" rel="noreferrer"
                style={{ backgroundColor: color, color: contrast }}
                className="w-full flex items-center justify-center gap-2 font-bold py-4 rounded-2xl text-sm">
                {WA_ICON}
                Book This Service on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div style={{ backgroundColor: color }} className="relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

        <div className="relative max-w-3xl mx-auto px-4 pt-6 pb-8">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 bg-white/20 rounded-xl px-3 py-1.5">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
              <span className="text-xs font-semibold" style={{ color: contrast === '#ffffff' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)' }}>Open for bookings</span>
            </div>
            <button onClick={shareStore} className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30">
              <Share2 size={16} style={{ color: contrast }} />
            </button>
          </div>

          {/* Business identity */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden flex items-center justify-center shrink-0 shadow-lg">
              {store.logo_url
                ? <img src={store.logo_url} alt={store.business_name} className="w-full h-full object-cover" />
                : <span className="text-3xl">💼</span>
              }
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-display font-bold text-2xl leading-tight mb-1" style={{ color: contrast }}>{store.business_name}</h1>
              <p className="text-sm font-medium opacity-80 mb-2" style={{ color: contrast }}>{categoryLabel}</p>
              <div className="flex items-center gap-1.5">
                <MapPin size={13} style={{ color: contrast, opacity: 0.7 }} />
                <span className="text-xs opacity-70" style={{ color: contrast }}>{store.location}</span>
              </div>
            </div>
          </div>

          {/* Tagline / description */}
          <p className="text-sm opacity-80 mb-6 leading-relaxed" style={{ color: contrast }}>
            {store.description || categoryTagline}
          </p>

          {/* Stats row */}
          <div className="flex gap-4 mb-6">
            <div className="bg-white/15 rounded-xl px-4 py-2.5 text-center">
              <div className="font-display font-bold text-xl" style={{ color: contrast }}>{services.length}</div>
              <div className="text-xs opacity-70" style={{ color: contrast }}>Services</div>
            </div>
            <div className="bg-white/15 rounded-xl px-4 py-2.5 text-center">
              <div className="flex items-center gap-1 justify-center">
                {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="currentColor" style={{ color: contrast }} />)}
              </div>
              <div className="text-xs opacity-70 mt-0.5" style={{ color: contrast }}>Top Rated</div>
            </div>
            <div className="bg-white/15 rounded-xl px-4 py-2.5 text-center flex-1">
              <div className="font-display font-bold text-sm" style={{ color: contrast }}>WhatsApp</div>
              <div className="text-xs opacity-70" style={{ color: contrast }}>Instant Booking</div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex gap-3">
            <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi ${store.business_name}! I'd like to make a booking. Can you tell me more about your services?`)}`}
              target="_blank" rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3.5 rounded-2xl text-sm shadow-lg">
              {WA_ICON}
              Book via WhatsApp
            </a>
            <a href={`tel:+${waNumber}`}
              className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center hover:bg-white/30">
              <Phone size={18} style={{ color: contrast }} />
            </a>
          </div>
        </div>
      </div>

      {/* Placeholder images notice */}
      <div className="max-w-3xl mx-auto px-4 pt-4">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-start gap-3">
          <span className="text-lg shrink-0">📸</span>
          <div>
            <p className="text-amber-800 text-xs font-semibold">These are placeholder images</p>
            <p className="text-amber-700 text-xs mt-0.5">Go to your Dashboard → tap any service → upload your own real photos to make your page shine.</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="search" placeholder="Search services..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-white rounded-2xl pl-10 pr-4 py-3 text-sm outline-none border border-gray-200 focus:border-brand-green shadow-sm" />
        </div>
      </div>

      {/* Services Menu */}
      <div className="max-w-3xl mx-auto px-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-brand-dark text-lg">Our Services</h2>
          <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{filtered.length} available</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🔍</div>
            <p className="text-gray-600 font-semibold">No services found</p>
            <p className="text-gray-400 text-sm mt-1">Try a different search or browse all services</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(service => (
              <div key={service.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex gap-0">
                  {/* Image */}
                  <div className="w-32 sm:w-44 shrink-0 relative overflow-hidden bg-gray-100">
                    {service.image_url
                      ? <img src={service.image_url} alt={service.name} className="w-full h-full object-cover aspect-square" loading="lazy" />
                      : <div className="w-full h-full flex items-center justify-center text-4xl aspect-square">💼</div>
                    }
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                    <div>
                      <h3 className="font-display font-bold text-brand-dark text-sm leading-tight mb-1">{service.name}</h3>
                      <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-2">{service.description}</p>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display font-bold text-lg" style={{ color }}>{fmtPrice(service)}</span>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => setSelectedService(service)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-xl border-2 transition-colors"
                          style={{ borderColor: color, color }}>
                          Details
                        </button>
                        <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi ${store.business_name}! I'd like to book: ${service.name}. Please confirm availability.`)}`}
                          target="_blank" rel="noreferrer"
                          className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-[#25D366] text-white">
                          {WA_ICON}
                          Book
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Testimonials section */}
      <div className="max-w-3xl mx-auto px-4 pb-6">
        <h2 className="font-display font-bold text-brand-dark text-lg mb-4">What Our Clients Say</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { name: 'Your Client Name', text: 'Add a real testimonial here — ask a happy client to share their experience. Makes a huge difference!' },
            { name: 'Another Client', text: 'Replace this with a real review. Testimonials build trust and help new customers feel confident booking you.' },
          ].map((t, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-dashed border-gray-200">
              <div className="flex gap-0.5 mb-2">
                {[1,2,3,4,5].map(j => <Star key={j} size={13} className="text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-gray-500 text-xs leading-relaxed mb-3 italic">"{t.text}"</p>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">?</div>
                <div>
                  <p className="text-xs font-semibold text-gray-400">{t.name}</p>
                  <p className="text-xs text-gray-300">Add real testimonials in your dashboard</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Book via WhatsApp */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3 max-w-3xl mx-auto">
        <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi ${store.business_name}! I'd like to make a booking. Can you tell me more about your services?`)}`}
          target="_blank" rel="noreferrer"
          style={{ backgroundColor: color, color: contrast }}
          className="w-full flex items-center justify-center gap-2 font-bold py-4 rounded-2xl text-sm shadow-lg">
          {WA_ICON}
          Book via WhatsApp — {store.business_name}
        </a>
      </div>

      {/* Footer */}
      <div className="max-w-3xl mx-auto px-4 py-6 text-center">
        <div className="bg-brand-dark rounded-2xl p-5">
          <p className="text-white/60 text-xs mb-1">Powered by</p>
          <p className="font-display font-bold text-white text-lg mb-1">Earket 🛒</p>
          <p className="text-white/70 text-xs mb-4">Build your own free business page in 5 minutes</p>
          <Link href="/onboarding"
            style={{ backgroundColor: color, color: contrast }}
            className="inline-block font-bold text-sm px-6 py-2.5 rounded-xl">
            Start Free — earket.com
          </Link>
        </div>
      </div>
    </div>
  )
}
