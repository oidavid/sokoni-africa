'use client'
import { useState, useEffect } from 'react'
import { MapPin, Share2, Phone, Star, Search, X, ChevronRight, ExternalLink, CheckCircle, Loader2, ArrowRight } from 'lucide-react'
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
  hero_image_url?: string
  hero_overlay?: number
  theme_color: string
  logo_url: string | null
  business_type?: string
  theme_preset?: string
  address?: string
  testimonials?: Array<{name: string; role: string; text: string; rating: number}>
  holiday_mode?: boolean
  holiday_message?: string
  business_hours?: Record<string, {open: string; close: string; closed: boolean}>
  profile_photo_url?: string
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

const CATEGORY_CONFIG: Record<string, {
  hero_image: string
  headline: string
  subheadline: string
  label: string
  cta: string
  process: Array<{ icon: string; title: string; desc: string }>
  tagline: string
}> = {
  digital_services: {
    hero_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    headline: 'Grow your business. Build your brand. Dominate online.',
    subheadline: 'From branding and social media to websites and automation — complete digital solutions that deliver measurable results.',
    label: 'Digital & Tech Services',
    cta: 'Get a Free Quote',
    tagline: 'Results-driven digital solutions',
    process: [
      { icon: '💬', title: 'Discovery Chat', desc: 'We learn about your business, goals and what you need. No pressure, just clarity.' },
      { icon: '📐', title: 'Clear Proposal', desc: 'You get a detailed scope, timeline and pricing. No surprises, no hidden costs.' },
      { icon: '🚀', title: 'Deliver & Support', desc: 'We deliver on time and support you after launch to make sure everything works.' },
    ],
  },
  education: {
    hero_image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=1200&q=80',
    headline: "Every student has greatness in them. We help it emerge.",
    subheadline: 'Qualified, passionate educators who deliver real improvement, real confidence and real results.',
    label: 'Education & Tutoring',
    cta: 'Book a Free Assessment',
    tagline: 'Knowledge that opens doors',
    process: [
      { icon: '📋', title: 'Free Assessment', desc: "We assess the student's current level, goals and learning style to create the right plan." },
      { icon: '📚', title: 'Structured Sessions', desc: 'Regular sessions with clear milestones, materials and progress tracking.' },
      { icon: '🏆', title: 'Results', desc: 'Measurable improvement, confidence and the grades to match.' },
    ],
  },
  health_wellness: {
    hero_image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80',
    headline: 'Your health is your greatest investment.',
    subheadline: 'Evidence-based care and personalised wellness programmes that transform how you look, feel and perform.',
    label: 'Health & Wellness',
    cta: 'Book a Free Consultation',
    tagline: 'Your health is your greatest asset',
    process: [
      { icon: '🩺', title: 'Initial Assessment', desc: 'A thorough review of your health, goals and any specific concerns before we begin.' },
      { icon: '📝', title: 'Personalised Plan', desc: 'A tailored programme designed for your body, schedule and lifestyle.' },
      { icon: '📈', title: 'Track & Adjust', desc: 'Regular check-ins to celebrate progress and keep the plan optimised for you.' },
    ],
  },
  home_services: {
    hero_image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&q=80',
    headline: 'Expert home services. Done right, the first time.',
    subheadline: 'Licensed professionals for electrical, plumbing, solar and all home repairs. Fast response, quality work, guaranteed.',
    label: 'Home & Technical Services',
    cta: 'Book a Service',
    tagline: 'Trusted repairs, on time and on budget',
    process: [
      { icon: '📞', title: 'Quick Booking', desc: 'Tell us what needs fixing. We respond fast and schedule at your convenience.' },
      { icon: '🔧', title: 'Professional Service', desc: 'Licensed technicians arrive on time with the right tools for the job.' },
      { icon: '✅', title: 'Guaranteed Work', desc: "All work is guaranteed. If it's not right, we fix it at no extra cost." },
    ],
  },
  auto_services: {
    hero_image: 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=1200&q=80',
    headline: 'Your vehicle deserves expert hands.',
    subheadline: 'Certified mechanics, honest diagnosis and quality repairs that keep you on the road with confidence.',
    label: 'Auto & Vehicle Services',
    cta: 'Book a Service',
    tagline: 'Quality auto care at fair prices',
    process: [
      { icon: '🔍', title: 'Free Diagnosis', desc: 'We inspect your vehicle and give you a clear, honest assessment before any work begins.' },
      { icon: '🔧', title: 'Expert Repair', desc: 'Certified mechanics fix the problem right the first time using quality parts.' },
      { icon: '🚗', title: 'Back on the Road', desc: 'We get you moving again quickly with a full quality check before handover.' },
    ],
  },
  beauty_services: {
    hero_image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80',
    headline: 'Look extraordinary. Feel unstoppable.',
    subheadline: 'Premium beauty and personal care services by skilled professionals. The result you want, every single time.',
    label: 'Beauty & Personal Care',
    cta: 'Book an Appointment',
    tagline: 'Your beauty, our expertise',
    process: [
      { icon: '📅', title: 'Easy Booking', desc: 'Book your appointment via WhatsApp at a time that works for you.' },
      { icon: '💆', title: 'Expert Care', desc: 'Skilled professionals deliver outstanding results with premium products.' },
      { icon: '✨', title: 'Love the Result', desc: "Leave looking and feeling amazing. We won't stop until you're delighted." },
    ],
  },
  domestic: {
    hero_image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    headline: 'Your home, immaculate. Your time, reclaimed.',
    subheadline: 'Professional cleaning and domestic services so you can focus on your life while we handle your home.',
    label: 'Domestic Services',
    cta: 'Book a Service',
    tagline: 'Professional care for your home',
    process: [
      { icon: '📋', title: 'Tell Us What You Need', desc: 'Share your requirements and schedule. We tailor the service to your home.' },
      { icon: '🏠', title: 'We Handle It', desc: 'Our trained team arrives fully equipped and gets to work immediately.' },
      { icon: '😊', title: 'Enjoy Your Space', desc: 'Come home to a spotless, fresh, perfectly maintained home every time.' },
    ],
  },
  events: {
    hero_image: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1200&q=80',
    headline: 'Make every occasion unforgettable.',
    subheadline: 'Professional photography, DJ, decoration, catering and MC services — everything to make your event extraordinary.',
    label: 'Events & Occasions',
    cta: 'Plan Your Event',
    tagline: 'Every event tells a story',
    process: [
      { icon: '💬', title: 'Share Your Vision', desc: 'Tell us about your event, budget and ideas. We listen and advise.' },
      { icon: '📐', title: 'We Plan Everything', desc: 'Full event planning, coordination and supplier management handled for you.' },
      { icon: '🎉', title: 'Perfect Execution', desc: 'On the day, we manage everything so you can enjoy every moment.' },
    ],
  },
  transport: {
    hero_image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=80',
    headline: 'Professional transport. Always on time.',
    subheadline: 'Reliable drivers, safe vehicles and punctual service for personal and corporate transportation needs.',
    label: 'Transport & Delivery',
    cta: 'Book a Ride',
    tagline: 'On time, every time',
    process: [
      { icon: '📍', title: 'Share Your Route', desc: 'Tell us your pickup, destination and time. We confirm immediately.' },
      { icon: '🚗', title: 'Professional Driver', desc: 'A vetted, professional driver arrives on time in a clean, safe vehicle.' },
      { icon: '✅', title: 'Safe Arrival', desc: 'Arrive safely, on time. We track every journey for your peace of mind.' },
    ],
  },
  agriculture: {
    hero_image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&q=80',
    headline: 'Grow more. Earn more. Farm smarter.',
    subheadline: 'Expert agricultural services, fresh farm produce and professional farming consultation for better yields.',
    label: 'Agriculture & Farm Produce',
    cta: 'Place an Order',
    tagline: 'Farm fresh, every time',
    process: [
      { icon: '🌱', title: 'Choose Your Produce', desc: 'Browse our fresh, seasonal produce and farm services. Quality guaranteed.' },
      { icon: '📦', title: 'We Pack & Deliver', desc: 'Your order is carefully packed and delivered fresh to your location.' },
      { icon: '🤝', title: 'Ongoing Supply', desc: 'Set up regular deliveries and never worry about fresh produce again.' },
    ],
  },
  food_catering: {
    hero_image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&q=80',
    headline: 'Exceptional food, crafted with passion.',
    subheadline: 'From weekly meal prep to private chefs and large event catering — fresh, flavourful and beautifully presented.',
    label: 'Food & Catering',
    cta: 'Get a Quote',
    tagline: 'Food that brings people together',
    process: [
      { icon: '📋', title: 'Share Your Brief', desc: 'Tell us your event, guest count and menu preferences. We advise on the best options.' },
      { icon: '👨‍🍳', title: 'We Prepare & Deliver', desc: 'Fresh, delicious food prepared by our chefs and delivered on time.' },
      { icon: '🍽️', title: 'Everyone Eats Well', desc: 'Sit back and enjoy compliments from your guests on the exceptional food.' },
    ],
  },
  childcare: {
    hero_image: 'https://images.unsplash.com/photo-1567705323043-dce7c5d78a83?w=1200&q=80',
    headline: 'Trusted care for your most precious people.',
    subheadline: 'Background-checked, experienced and genuinely caring professionals. Because your children deserve nothing less than the best.',
    label: 'Childcare & Nanny Services',
    cta: 'Book a Carer',
    tagline: "Your child's safety, our priority",
    process: [
      { icon: '👋', title: 'Meet & Greet', desc: 'We arrange a meet-and-greet so your child and carer get comfortable first.' },
      { icon: '🛡️', title: 'Background Checked', desc: 'All our carers are fully vetted, background checked and first-aid trained.' },
      { icon: '❤️', title: 'Peace of Mind', desc: 'Your child thrives in safe, nurturing care while you focus on your day.' },
    ],
  },
  hair_salon: {
    hero_image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1200&q=80',
    headline: 'Your hair. Your crown. Your story.',
    subheadline: 'Expert braiding, styling, colouring and treatments by skilled stylists who know exactly how to make you shine.',
    label: 'Hair Salon & Barber',
    cta: 'Book an Appointment',
    tagline: 'Great hair starts here',
    process: [
      { icon: '📅', title: 'Book Your Slot', desc: 'Choose your style and book a time that works for you via WhatsApp. Fast and easy.' },
      { icon: '💈', title: 'Expert Styling', desc: 'Our skilled stylists give you their full attention and the look you have in mind.' },
      { icon: '✨', title: 'Leave Glowing', desc: "Walk out feeling incredible. We won't stop until you love what you see." },
    ],
  },
  fashion_design: {
    hero_image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    headline: 'Clothes that tell the world who you are.',
    subheadline: 'Custom-made outfits, expert alterations and made-to-measure fashion — stitched to perfection, fitted to you.',
    label: 'Fashion Design & Tailoring',
    cta: 'Book a Fitting',
    tagline: 'Dressed to impress, made to measure',
    process: [
      { icon: '📐', title: 'Consultation & Measurements', desc: 'We discuss your style vision and take precise measurements to ensure a perfect fit.' },
      { icon: '🧵', title: 'Crafted With Care', desc: 'Your outfit is cut and sewn by skilled hands using quality fabric and fine detail.' },
      { icon: '👗', title: 'Try On & Perfect', desc: 'A fitting session to make any final adjustments before your outfit is ready.' },
    ],
  },
  photography: {
    hero_image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80',
    headline: 'Moments worth remembering. Images worth keeping.',
    subheadline: 'Professional photography and videography for events, portraits, products and brand content — captured beautifully.',
    label: 'Photography & Videography',
    cta: 'Book a Shoot',
    tagline: 'Every frame tells your story',
    process: [
      { icon: '💬', title: 'Creative Brief', desc: 'We talk through your vision, location, style and what the shoot is for.' },
      { icon: '📸', title: 'The Shoot', desc: 'A relaxed, professional session that brings out the best in every subject.' },
      { icon: '🖼️', title: 'Edited & Delivered', desc: 'Professionally edited images delivered quickly in high resolution, ready to use.' },
    ],
  },
  legal_finance: {
    hero_image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=1200&q=80',
    headline: 'Your business. Protected. Compliant. Growing.',
    subheadline: 'Professional legal and financial services for entrepreneurs and businesses — clear advice, fast turnaround, fair pricing.',
    label: 'Legal & Financial Services',
    cta: 'Get a Free Consultation',
    tagline: 'Expert guidance you can trust',
    process: [
      { icon: '💬', title: 'Free Consultation', desc: 'Tell us what you need. We listen, assess and give you honest, clear guidance.' },
      { icon: '📋', title: 'We Handle the Work', desc: 'From registration to contracts and tax filings — done accurately and on time.' },
      { icon: '✅', title: 'Peace of Mind', desc: 'Your business stays compliant and protected so you can focus on growth.' },
    ],
  },
  real_estate: {
    hero_image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80',
    headline: 'Find the right property. Make the right move.',
    subheadline: 'Professional property listing, valuation, tenant management and real estate advisory — we make property work for you.',
    label: 'Real Estate & Property',
    cta: 'Talk to an Agent',
    tagline: 'Your property goals, our expertise',
    process: [
      { icon: '🏡', title: 'Tell Us What You Need', desc: 'Whether buying, selling or renting — share your requirements and budget.' },
      { icon: '🔍', title: 'We Find the Best Options', desc: 'We shortlist, verify and present properties that match your exact criteria.' },
      { icon: '🤝', title: 'Smooth Completion', desc: 'We handle viewings, negotiations and paperwork right through to completion.' },
    ],
  },
  printing: {
    hero_image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&q=80',
    headline: 'Your brand, printed perfectly.',
    subheadline: 'Business cards, flyers, banners, branded apparel and signage — high quality print that makes your brand impossible to ignore.',
    label: 'Printing & Branding',
    cta: 'Get a Print Quote',
    tagline: 'Quality print, fast turnaround',
    process: [
      { icon: '📤', title: 'Send Your Design', desc: 'Share your artwork or let us design it for you. We advise on the best format and size.' },
      { icon: '🖨️', title: 'We Print It', desc: 'Vibrant, crisp print on quality materials with careful quality control.' },
      { icon: '📦', title: 'Delivered or Collected', desc: 'Pick up in person or have your prints delivered straight to your door.' },
    ],
  },
  security: {
    hero_image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=1200&q=80',
    headline: 'Your safety is not negotiable.',
    subheadline: 'Professional CCTV installation, alarm systems, electric fencing, access control and security personnel — complete protection.',
    label: 'Security Services',
    cta: 'Get a Security Assessment',
    tagline: 'Protecting what matters most',
    process: [
      { icon: '🔎', title: 'Security Assessment', desc: 'We assess your property, identify vulnerabilities and recommend the right solution.' },
      { icon: '🛡️', title: 'Professional Installation', desc: 'Our certified team installs and configures all systems to the highest standard.' },
      { icon: '📱', title: 'Ongoing Monitoring', desc: 'Remote monitoring, maintenance and 24/7 support to keep you protected.' },
    ],
  },
  fitness: {
    hero_image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80',
    headline: 'The body you want. The strength you deserve.',
    subheadline: 'Personal training, group classes, nutrition plans and online coaching — real results from a programme built around you.',
    label: 'Fitness & Personal Training',
    cta: 'Start Your Journey',
    tagline: 'Stronger every single day',
    process: [
      { icon: '📋', title: 'Free Fitness Assessment', desc: 'We assess your current fitness, goals and lifestyle to build the right programme.' },
      { icon: '💪', title: 'Personalised Training', desc: 'Structured sessions with a dedicated coach who pushes you and keeps you accountable.' },
      { icon: '📈', title: 'Real Results', desc: 'Track your progress week by week and see the transformation in your body and energy.' },
    ],
  },
  music: {
    hero_image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200&q=80',
    headline: 'Music that moves people. Performance that stays with them.',
    subheadline: 'Music lessons, studio recording, DJ services, live band performances and music production — your sound, perfected.',
    label: 'Music & Entertainment',
    cta: 'Book Now',
    tagline: 'Your sound, our passion',
    process: [
      { icon: '🎵', title: 'Tell Us Your Vision', desc: 'Whether lessons, recording or a live event — share what you have in mind.' },
      { icon: '🎙️', title: 'We Make It Happen', desc: 'Professional musicians, producers and performers who deliver the highest quality.' },
      { icon: '🎉', title: 'An Unforgettable Experience', desc: 'Leave your audience, students or clients genuinely impressed every single time.' },
    ],
  },
}
const DEFAULT_CONFIG = CATEGORY_CONFIG.home_services

function getContrastColor(hex: string): string {
  if (!hex || hex.length < 7) return '#ffffff'
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? '#111827' : '#ffffff'
}

function getRegionNames(location: string) {
  const loc = (location || '').toLowerCase()
  if (/\b(ar|tx|ca|ny|fl|ga|il|wa|co|nc|az|nv|tn|rogers|bentonville|atlanta|dallas|los angeles|chicago|miami|seattle|boston|austin)\b/.test(loc))
    return { first: ['Jessica', 'Michael'], last: ['Thompson', 'Williams'] }
  if (/\b(london|manchester|birmingham|uk|england)\b/.test(loc))
    return { first: ['Sophie', 'James'], last: ['Harrison', 'Bennett'] }
  if (/\b(lagos|abuja|accra|nigeria|ghana)\b/.test(loc))
    return { first: ['Amara', 'Chidi'], last: ['Okonkwo', 'Mensah'] }
  return { first: ['Sarah', 'Marcus'], last: ['Mitchell', 'Johnson'] }
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

export default function ServicesLedStorefrontPage({ params }: { params: { slug: string } }) {
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

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" /></div>
  if (!store) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Business not found</p></div>

  const theme = store.theme_preset ? getThemeById(store.theme_preset) : null
  const themeStyle = theme ? getThemeStyle(theme) : { backgroundColor: store.theme_color || '#1A7A4A' }
  const color = theme?.primary || store.theme_color || '#1A7A4A'
  const contrast = theme?.textOnPrimary || getContrastColor(color)
  const trackWhatsApp = () => {
    if (!store?.id) return
    fetch('/api/analytics/view', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ merchant_id: store.id, type: 'whatsapp_click' }) }).catch(() => {})
  }

  const waNumber = store.whatsapp_number?.replace(/\D/g, '')
  const cfg = CATEGORY_CONFIG[store.category] || DEFAULT_CONFIG
  const heroImage = store.hero_image_url || cfg.hero_image
  const heroOverlay = store.hero_overlay ?? 0.3
  const available = services.filter(s => s.in_stock)
  const filtered = available.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || (s.description || '').toLowerCase().includes(search.toLowerCase()))
  const bookMsg = `Hi ${store.business_name}! I'd like to get a free quote. Can we discuss my project?`
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((store.address || store.business_name) + ' ' + store.location)}`
  const names = getRegionNames(store.location)

  const reviews = [
    { name: `${names.first[0]} ${names.last[0][0]}.`, role: 'Small Business Owner', text: `Delivered everything on time, exactly as promised. Professional, responsive and really understood what I needed. My clients love the result.` },
    { name: `${names.first[1]} ${names.last[1][0]}.`, role: 'Marketing Director', text: `Outstanding work. Clear communication throughout, great attention to detail and the end product exceeded my expectations. Will work together again.` },
  ]

  function shareStore() {
    if (navigator.share) navigator.share({ title: store?.business_name, url: window.location.href })
    else { navigator.clipboard.writeText(window.location.href); alert('Link copied!') }
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Holiday / Closure Banner */}
      {store.holiday_mode && (
        <div className="bg-red-500 text-white text-center px-4 py-3 text-sm font-semibold">
          🔴 {store.holiday_message || 'We are temporarily closed. Please check back soon!'}
        </div>
      )}

      {/* Service detail modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedService(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl">
            {selectedService.image_url && (
              <div className="relative h-52">
                <img src={selectedService.image_url} alt={selectedService.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <h2 className="absolute bottom-4 left-4 right-12 font-display font-bold text-2xl text-white">{selectedService.name}</h2>
                <button onClick={() => setSelectedService(null)} className="absolute top-4 right-4 w-9 h-9 bg-black/40 rounded-full flex items-center justify-center text-white"><X size={18} /></button>
              </div>
            )}
            <div className="p-5">
              {!selectedService.image_url && (
                <div className="flex items-start justify-between mb-3">
                  <h2 className="font-display font-bold text-xl flex-1 pr-4">{selectedService.name}</h2>
                  <button onClick={() => setSelectedService(null)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"><X size={16} /></button>
                </div>
              )}
              <p className="text-gray-600 text-sm leading-relaxed mb-5">{selectedService.description}</p>
              <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi ${store.business_name}! I'd like a quote for: ${selectedService.name}. Can we discuss?`)}`}
                target="_blank" rel="noreferrer"
                style={{ backgroundColor: color, color: contrast }}
                className="w-full flex items-center justify-center gap-2 font-bold py-4 rounded-2xl text-sm">
                {WA_SVG} Get a Quote for This
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── NAVBAR ── */}
      <nav className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {store.logo_url
              ? <img src={store.logo_url} alt={store.business_name} className="w-14 h-14 rounded-xl object-contain shadow-sm" />
              : <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-sm" style={themeStyle as React.CSSProperties}>{store.business_name[0]}</div>
            }
            <div>
              <p className="font-display font-bold text-base text-gray-900 leading-tight">{store.business_name}</p>
              <p className="text-xs font-medium" style={{ color }}>{cfg.label}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(bookMsg)}`}
              target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 text-sm font-bold px-5 py-2.5 rounded-xl text-white shadow-sm"
              style={themeStyle as React.CSSProperties}>
              {WA_SVG} <span className="hidden sm:inline">{cfg.cta}</span><span className="sm:hidden">Quote</span>
            </a>
            <button onClick={shareStore} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-200"><Share2 size={16} /></button>
          </div>
        </div>
      </nav>

      {/* ── DARK HERO — full width, bold, agency feel ── */}
      <div className="relative overflow-hidden bg-gray-900" style={{ minHeight: '420px' }}>
        {heroImage && (
          <div className="absolute inset-0">
            <img src={heroImage} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
          </div>
        )}
        <div className="relative max-w-4xl mx-auto px-4 py-16 sm:py-24">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full animate-pulse bg-green-400" />
              <span className="text-xs font-semibold text-green-400 uppercase tracking-widest">Available for new projects</span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: color === '#1A7A4A' ? '#6ee7b7' : contrast }}>{cfg.tagline}</p>
            <h1 className="font-display font-bold text-white leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              {cfg.headline}
            </h1>
            <p className="text-gray-300 text-base leading-relaxed mb-8 max-w-md">
              {store.description || cfg.subheadline}
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(bookMsg)}`}
                target="_blank" rel="noreferrer"
                className="flex items-center gap-2 font-bold py-3.5 px-6 rounded-xl text-sm"
                style={{ backgroundColor: color, color: contrast }}>
                {WA_SVG} {cfg.cta}
              </a>
              <a href="#services"
                className="flex items-center gap-2 font-semibold py-3.5 px-6 rounded-xl text-sm bg-white/10 text-white border border-white/20 hover:bg-white/20">
                See Services <ArrowRight size={14} />
              </a>
            </div>
            {store.location && (
              <div className="flex items-center gap-1.5 mt-6">
                <MapPin size={12} className="text-gray-500 shrink-0" />
                <span className="text-xs text-gray-500">{store.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative border-t border-white/10">
          <div className="max-w-4xl mx-auto px-4 py-5 flex flex-wrap gap-6">
            <div>
              <p className="font-display font-bold text-2xl text-white">{available.length}+</p>
              <p className="text-xs text-gray-400">Services offered</p>
            </div>
            <div>
              <p className="font-display font-bold text-2xl text-white">Free</p>
              <p className="text-xs text-gray-400">Initial consultation</p>
            </div>
            <div>
              <p className="font-display font-bold text-2xl text-white">Fast</p>
              <p className="text-xs text-gray-400">Turnaround time</p>
            </div>
            <div className="ml-auto hidden sm:flex items-center gap-2">
              <div className="flex -space-x-2">
                {['#e2b96f','#7da7d9','#a0c878'].map((bg, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-900 flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: bg }}>{reviews[i]?.name[0] || '★'}</div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <Star key={i} size={10} className="text-amber-400 fill-amber-400" />)}</div>
                <p className="text-xs text-gray-400">Trusted by clients</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── PROCESS ── */}
      <div className="py-12 px-4 bg-gray-50" id="process">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest mb-1 text-center" style={{ color }}>How We Work</p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-gray-900 mb-8 text-center">Simple, transparent process</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {cfg.process.map((step, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: color + '15' }}>{step.icon}</div>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: color }}>{i + 1}</div>
                </div>
                <h3 className="font-display font-bold text-gray-900 mb-1">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SERVICES GRID ── */}
      <div className="py-12 px-4 bg-white" id="services">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest mb-1 text-center" style={{ color }}>What We Offer</p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-gray-900 mb-2 text-center">Our Services</h2>
          <p className="text-sm text-gray-500 mb-6 text-center">Get in touch to discuss pricing and timelines for your specific project.</p>

          <div className="relative mb-6">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="search" placeholder="Search services..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-gray-50 rounded-xl pl-10 pr-4 py-3 text-sm outline-none border border-gray-100 focus:border-brand-green" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map(service => (
              <div key={service.id}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all overflow-hidden cursor-pointer"
                onClick={() => setSelectedService(service)}>
                {service.image_url && (
                  <div className="h-44 overflow-hidden bg-gray-100 relative">
                    <img src={service.image_url} alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <h3 className="absolute bottom-3 left-4 right-4 font-display font-bold text-white text-base leading-tight">{service.name}</h3>
                  </div>
                )}
                <div className="p-4">
                  {!service.image_url && <h3 className="font-display font-bold text-gray-900 text-base mb-2">{service.name}</h3>}
                  <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">{service.description}</p>
                  <div className="flex gap-2">
                    <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi ${store.business_name}! I'd like a quote for: ${service.name}. Can we discuss?`)}`}
                      target="_blank" rel="noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 rounded-xl"
                      style={{ backgroundColor: color, color: contrast }}>
                      {WA_SVG} Get a Quote
                    </a>
                    <button onClick={() => setSelectedService(service)}
                      className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl border hover:bg-gray-50"
                      style={{ borderColor: color, color }}>
                      Details <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTACT FORM + TESTIMONIALS ── */}
      <div className="py-12 px-4 bg-gray-50" id="contact">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-8">
            {/* Form */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color }}>Get in Touch</p>
              <h2 className="font-display font-bold text-2xl text-gray-900 mb-1">Request a Quote</h2>
              <p className="text-sm text-gray-500 mb-5">Tell us about your project and we will respond within 24 hours.</p>
              {formSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: color + '20' }}>
                    <CheckCircle size={32} style={{ color }} />
                  </div>
                  <h3 className="font-display font-bold text-xl text-gray-900 mb-2">Got it, {formName}!</h3>
                  <p className="text-gray-500 text-sm mb-5">We will be in touch within 24 hours. You can also reach us directly on WhatsApp.</p>
                  <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi ${store.business_name}! I just submitted a project request. My name is ${formName}.`)}`}
                    target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 font-bold py-3 px-6 rounded-xl text-sm"
                    style={{ backgroundColor: color, color: contrast }}>
                    {WA_SVG} Message on WhatsApp
                  </a>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1">Name *</label>
                      <input type="text" value={formName} onChange={e => setFormName(e.target.value)} placeholder="Your name" required
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1">Email *</label>
                      <input type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} placeholder="your@email.com" required
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">Phone / WhatsApp</label>
                    <input type="tel" value={formPhone} onChange={e => setFormPhone(e.target.value)} placeholder="+1 234 567 8900"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">Service needed</label>
                    <select value={formService} onChange={e => setFormService(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green bg-white">
                      <option value="">Select a service...</option>
                      {available.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                      <option value="Not sure yet">Not sure — I'd like to discuss</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">Project details</label>
                    <textarea value={formMessage} onChange={e => setFormMessage(e.target.value)}
                      placeholder="Tell us about your project, timeline and any other details..." rows={3}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green resize-none" />
                  </div>
                  {formError && <p className="text-red-500 text-xs">{formError}</p>}
                  <button type="submit" disabled={formSubmitting}
                    className="w-full font-bold py-3.5 rounded-xl text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ backgroundColor: color, color: contrast }}>
                    {formSubmitting ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : 'Send Project Request'}
                  </button>
                </form>
              )}
            </div>

            {/* Testimonials */}
            <div className="sm:w-72 shrink-0 space-y-4">
              <p className="font-display font-bold text-lg text-gray-900">What clients say</p>
              {((store as any).testimonials?.length > 0 ? (store as any).testimonials : reviews).map((r: any, i: number) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex gap-0.5 mb-2">{[1,2,3,4,5].map(j => <Star key={j} size={12} className="text-amber-400 fill-amber-400" />)}</div>
                  <p className="text-gray-600 text-xs leading-relaxed mb-3">"{r.text}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ backgroundColor: color }}>{r.name[0]}</div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">{r.name}</p>
                      {r.role && <p className="text-xs text-gray-400">{r.role}</p>}
                    </div>
                  </div>
                </div>
              ))}
              {/* WhatsApp CTA */}
              <div className="rounded-2xl p-4" style={{ backgroundColor: color }}>
                <p className="font-bold text-sm mb-1" style={{ color: contrast }}>Prefer WhatsApp?</p>
                <p className="text-xs mb-3 opacity-70" style={{ color: contrast }}>Message us directly for a faster response.</p>
                <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(bookMsg)}`} target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-white font-bold py-2.5 rounded-xl text-xs"
                  style={{ color }}>
                  {WA_SVG} Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Find Us */}
      <div className="py-10 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-xl text-gray-900 mb-4">Find Us</h2>
          <div className="bg-gray-50 rounded-2xl p-5 mb-3 flex flex-col sm:flex-row gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: color + '20' }}><MapPin size={16} style={{ color }} /></div>
              <div>
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
          <a href={mapsUrl} target="_blank" rel="noreferrer" className="block rounded-2xl overflow-hidden border border-gray-200">
            <iframe title="Location map" width="100%" height="180" loading="lazy" style={{ border: 0, display: 'block' }}
              src={`https://maps.google.com/maps?q=${encodeURIComponent((store.address || store.business_name) + ' ' + store.location)}&output=embed&z=15`} allowFullScreen />
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-100">
              <span className="text-xs font-semibold text-gray-700 truncate">{store.address || store.location}</span>
              <span className="text-xs font-semibold flex items-center gap-1 ml-2 shrink-0" style={{ color }}>Open Maps <ExternalLink size={10} /></span>
            </div>
          </a>
        </div>
          {/* Social Links */}
          {(store.instagram || store.facebook || store.linkedin || store.twitter_x || store.website || store.youtube || store.tiktok || store.other_link) && (
            <div className="mt-4 bg-gray-50 rounded-2xl p-4">
              <p className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wide">Follow Us</p>
              <div className="flex flex-wrap gap-2">
                {store.instagram && <a href={`https://instagram.com/${store.instagram.replace('@','')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors">📸 Instagram</a>}
                {store.facebook && <a href={store.facebook.startsWith('http') ? store.facebook : `https://facebook.com/${store.facebook}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">📘 Facebook</a>}
                {store.linkedin && <a href={store.linkedin.startsWith('http') ? store.linkedin : `https://linkedin.com/in/${store.linkedin}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors">💼 LinkedIn</a>}
                {store.twitter_x && <a href={`https://x.com/${store.twitter_x.replace('@','')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">X / Twitter</a>}
                {store.youtube && <a href={store.youtube.startsWith('http') ? store.youtube : `https://youtube.com/${store.youtube}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">▶️ YouTube</a>}
                {store.tiktok && <a href={`https://tiktok.com/${store.tiktok.startsWith('@') ? store.tiktok : '@' + store.tiktok}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-black transition-colors">🎵 TikTok</a>}
                {store.website && <a href={store.website.startsWith('http') ? store.website : `https://${store.website}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-light text-brand-green hover:bg-brand-green hover:text-white transition-colors">🌐 Website</a>}
                {store.other_link && <a href={store.other_link.startsWith('http') ? store.other_link : `https://${store.other_link}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors">🔗 Follow Us</a>}
              </div>
            </div>
          )}

      </div>

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
                <textarea
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                  placeholder="Tell us more (optional)..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-gray-400 resize-none mb-3"
                />
                <label className="flex items-center gap-2 mb-5 cursor-pointer">
                  <input type="checkbox" checked={feedbackAnon} onChange={e => setFeedbackAnon(e.target.checked)} className="w-4 h-4 rounded" />
                  <span className="text-xs text-gray-500">Submit anonymously</span>
                </label>
                <button onClick={submitFeedback} disabled={!feedbackRating || feedbackSending}
                  className="w-full bg-brand-dark text-white font-bold text-sm py-3 rounded-2xl disabled:opacity-40 hover:bg-brand-green transition-colors">
                  {feedbackSending ? 'Sending...' : 'Submit Feedback'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Sticky footer */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-gray-100 px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(bookMsg)}`} target="_blank" rel="noreferrer"
            style={{ backgroundColor: color, color: contrast }}
            className="w-full flex items-center justify-center gap-2 font-bold py-4 rounded-2xl text-sm shadow-lg">
            {WA_SVG} {cfg.cta} — {store.business_name}
          </a>
        </div>
      </div>

      {/* Footer — adapts to merchant theme */}
      <div className="max-w-4xl mx-auto px-4 py-6 text-center">
        <div className="rounded-2xl p-5" style={{ backgroundColor: color }}>
          {(() => {
            const onBg = getContrastColor(color)
            const isLight = onBg === '#111827'
            return (
              <>
                <p className="text-xs mb-1" style={{ color: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }}>Powered by</p>
                <Link href="/" className="font-display font-bold text-lg mb-1 inline-block transition-opacity hover:opacity-80" style={{ color: onBg }}>
                  earket
                </Link>
                <p className="text-xs mb-0.5" style={{ color: isLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)' }}>Build your own free business page in 5 minutes</p>
                <p className="text-xs mb-4" style={{ color: isLight ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)' }}>
                  A product of{' '}
                  <a href="https://intelsystechnology.com" target="_blank" rel="noopener noreferrer"
                     className="font-semibold transition-opacity hover:opacity-80" style={{ color: isLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)' }}>
                    IntelSys Technologies
                  </a>
                </p>
                <div className="flex gap-2 justify-center flex-wrap">
                  <Link href="/onboarding"
                    className="inline-block font-bold text-sm px-6 py-2.5 rounded-xl transition-opacity hover:opacity-90"
                    style={{ backgroundColor: isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.15)', color: onBg }}>
                    Start Free — earket.com
                  </Link>
                  <button onClick={() => setFeedbackOpen(true)}
                    className="inline-block font-semibold text-sm px-5 py-2.5 rounded-xl transition-opacity hover:opacity-90"
                    style={{ backgroundColor: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)', color: isLight ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)' }}>
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
