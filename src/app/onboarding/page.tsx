'use client'
import { useState } from 'react'
import { ArrowRight, ArrowLeft, Loader2, Check, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type Step = 'language' | 'business' | 'whatsapp' | 'email' | 'category' | 'location' | 'generating' | 'done'

const CATEGORIES = [
  { id: 'fashion', label: 'Fashion & Clothing', emoji: '👗', pidgin: 'Cloth & Fashion' },
  { id: 'food', label: 'Food & Drinks', emoji: '🍱', pidgin: 'Food & Drink' },
  { id: 'electronics', label: 'Electronics & Phones', emoji: '📱', pidgin: 'Electronics & Phone' },
  { id: 'beauty', label: 'Beauty & Hair', emoji: '💄', pidgin: 'Beauty & Hair' },
  { id: 'groceries', label: 'Groceries & Provisions', emoji: '🛒', pidgin: 'Provisions & Groceries' },
  { id: 'furniture', label: 'Furniture & Home', emoji: '🪑', pidgin: 'Furniture & Home' },
  { id: 'shoes', label: 'Shoes & Bags', emoji: '👟', pidgin: 'Shoes & Bags' },
  { id: 'other', label: 'Other Business', emoji: '🏪', pidgin: 'Other Business' },
]

const LOCATIONS = [
  'Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan',
  'Benin City', 'Onitsha', 'Aba', 'Enugu', 'Warri',
  'Kaduna', 'Calabar', 'Jos', 'Ilorin', 'Other'
]

const TEXT = {
  en: {
    welcome: "Let's build your store",
    welcomeSub: "Answer a few quick questions. Your store will be live in minutes.",
    bizQ: "What is your business name?",
    bizPlaceholder: "e.g. Tropical Market",
    whatsappQ: "Your WhatsApp business number?",
    whatsappPlaceholder: "e.g. 08012345678",
    whatsappHint: "Customers will send orders to this number",
    emailQ: "Your email address?",
    emailPlaceholder: "you@example.com",
    emailHint: "We'll send your store login link here",
    catQ: "What do you sell?",
    locQ: "Where is your business located?",
    generating: "Building your store...",
    generatingSteps: [
      "Creating your store design...",
      "Setting up your product catalogue...",
      "Configuring your WhatsApp order button...",
      "Sending your login details...",
      "Almost ready...",
    ],
    doneTitle: "Your store is live! 🎉",
    doneSub: "Check your email for your login link.",
    viewStore: "View My Store",
    addProducts: "Go to Dashboard",
    next: "Continue",
    back: "Back",
  },
  pid: {
    welcome: "Make we build your shop",
    welcomeSub: "Answer small questions. Your shop go dey live for minutes.",
    bizQ: "Wetin be your business name?",
    bizPlaceholder: "e.g. Tropical Market",
    whatsappQ: "Your WhatsApp business number?",
    whatsappPlaceholder: "e.g. 08012345678",
    whatsappHint: "Customers go send orders to this number",
    emailQ: "Your email address?",
    emailPlaceholder: "you@example.com",
    emailHint: "We go send your store login link to this email",
    catQ: "Wetin you dey sell?",
    locQ: "Where your business dey?",
    generating: "We dey build your shop...",
    generatingSteps: [
      "We dey create your shop design...",
      "We dey set up your product catalogue...",
      "We dey configure your WhatsApp order button...",
      "We dey send your login details...",
      "E almost ready...",
    ],
    doneTitle: "Your shop don go live! 🎉",
    doneSub: "Check your email for your login link.",
    viewStore: "See My Shop",
    addProducts: "Go to Dashboard",
    next: "Continue",
    back: "Go Back",
  }
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function normalizeWhatsApp(number: string) {
  const digits = number.replace(/\D/g, '')
  if (digits.startsWith('0')) return '234' + digits.slice(1)
  if (digits.startsWith('234')) return digits
  return '234' + digits
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
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [email, setEmail] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [genStep, setGenStep] = useState(0)
  const [storeSlug, setStoreSlug] = useState('')
  const [error, setError] = useState('')

  const t = TEXT[lang]
  const stepMap: Record<Step, number> = { language: 0, business: 1, whatsapp: 2, email: 3, category: 4, location: 5, generating: 6, done: 6 }
  const totalSteps = 6

  async function handleGenerate() {
    setStep('generating')
    setGenStep(0)

    const slug = slugify(businessName) + '-' + Math.random().toString(36).slice(2, 6)
    setStoreSlug(slug)

    for (let i = 0; i < t.generatingSteps.length; i++) {
      await new Promise(r => setTimeout(r, 700))
      setGenStep(i + 1)
    }

    try {
      // Sign up / send magic link via Supabase Auth
      await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: { business_name: businessName, slug }
        }
      })

      // Save merchant record
      const { data: { user } } = await supabase.auth.getUser()
      await supabase.from('merchants').insert({
        business_name: businessName,
        slug,
        category,
        location,
        whatsapp_number: normalizeWhatsApp(whatsappNumber),
        email,
        phone: normalizeWhatsApp(whatsappNumber),
        language: lang,
        plan: 'free',
        is_active: true,
        ...(user ? { id: user.id } : {})
      })
    } catch (e) {
      console.error('Setup error:', e)
    }

    setStep('done')
  }

  function handleNext() {
    setError('')
    if (step === 'business') {
      if (!businessName.trim()) { setError(lang === 'pid' ? 'Abeg enter your business name' : 'Please enter your business name'); return }
      setStep('whatsapp')
    } else if (step === 'whatsapp') {
      if (!whatsappNumber.trim()) { setError(lang === 'pid' ? 'Abeg enter your WhatsApp number' : 'Please enter your WhatsApp number'); return }
      setStep('email')
    } else if (step === 'email') {
      if (!email.trim() || !email.includes('@')) { setError(lang === 'pid' ? 'Abeg enter valid email' : 'Please enter a valid email'); return }
      setStep('category')
    } else if (step === 'category') {
      setStep('location')
    } else if (step === 'location') {
      handleGenerate()
    }
  }

  const prevStep: Record<string, Step> = { business: 'language', whatsapp: 'business', email: 'whatsapp', category: 'email', location: 'category' }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-light to-white flex flex-col">
      <nav className="px-4 h-14 flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-green rounded-lg flex items-center justify-center">
            <ShoppingBag size={14} className="text-white" />
          </div>
          <span className="font-display font-bold text-brand-dark text-base">Sokoni Africa</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          {!['generating', 'done', 'language'].includes(step) && (
            <StepIndicator current={stepMap[step] - 1} total={totalSteps} />
          )}

          {/* Language */}
          {step === 'language' && (
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-brand-green rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-green/20">
                <ShoppingBag size={28} className="text-white" />
              </div>
              <h1 className="font-display text-2xl font-bold text-brand-dark mb-2">{t.welcome}</h1>
              <p className="text-gray-500 text-sm mb-8">{t.welcomeSub}</p>
              <div className="space-y-3">
                {[
                  { code: 'pid' as const, label: 'Pidgin English', sub: 'I wan use Pidgin' },
                  { code: 'en' as const, label: 'English', sub: 'I prefer English' },
                ].map(l => (
                  <button key={l.code} onClick={() => { setLang(l.code); setStep('business') }}
                    className="w-full flex items-center justify-between bg-white border-2 border-gray-200 
                               hover:border-brand-green rounded-2xl p-4 transition-all group">
                    <div className="text-left">
                      <div className="font-display font-bold text-brand-dark">{l.label}</div>
                      <div className="text-xs text-gray-400">{l.sub}</div>
                    </div>
                    <ArrowRight size={18} className="text-gray-300 group-hover:text-brand-green transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Business Name */}
          {step === 'business' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-bold text-brand-dark mb-1">{t.bizQ}</h2>
              <p className="text-gray-500 text-sm mb-6">{lang === 'pid' ? 'This go be the name wey customers go see.' : 'This is what customers will see on your store.'}</p>
              <input type="text" placeholder={t.bizPlaceholder} value={businessName}
                onChange={e => { setBusinessName(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleNext()} autoFocus
                className="w-full border-2 border-gray-200 focus:border-brand-green rounded-2xl px-4 py-4 
                           text-brand-dark font-display font-bold text-lg outline-none transition-colors" />
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            </div>
          )}

          {/* WhatsApp */}
          {step === 'whatsapp' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-bold text-brand-dark mb-1">{t.whatsappQ}</h2>
              <p className="text-gray-500 text-sm mb-6">{t.whatsappHint}</p>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">🇳🇬 +234</span>
                <input type="tel" placeholder={t.whatsappPlaceholder} value={whatsappNumber}
                  onChange={e => { setWhatsappNumber(e.target.value); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleNext()} autoFocus
                  className="w-full border-2 border-gray-200 focus:border-brand-green rounded-2xl pl-24 pr-4 py-4 
                             text-brand-dark font-display font-bold text-lg outline-none transition-colors" />
              </div>
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
              <p className="text-xs text-gray-400 mt-3">⚠️ {lang === 'pid' ? 'Make sure say this number dey active on WhatsApp' : 'Make sure this number is active on WhatsApp'}</p>
            </div>
          )}

          {/* Email */}
          {step === 'email' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-bold text-brand-dark mb-1">{t.emailQ}</h2>
              <p className="text-gray-500 text-sm mb-6">{t.emailHint}</p>
              <input type="email" placeholder={t.emailPlaceholder} value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleNext()} autoFocus
                className="w-full border-2 border-gray-200 focus:border-brand-green rounded-2xl px-4 py-4 
                           text-brand-dark font-semibold text-lg outline-none transition-colors" />
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
              <p className="text-xs text-gray-400 mt-3">🔒 {lang === 'pid' ? 'We go use this to send you login link — no password needed' : 'We use this to send you a login link — no password needed'}</p>
            </div>
          )}

          {/* Category */}
          {step === 'category' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-bold text-brand-dark mb-6">{t.catQ}</h2>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map(cat => (
                  <button key={cat.id} onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-2 p-3 rounded-2xl border-2 text-left transition-all ${
                      category === cat.id ? 'border-brand-green bg-brand-light text-brand-green' : 'border-gray-200 text-gray-600 hover:border-brand-green/50'
                    }`}>
                    <span className="text-xl">{cat.emoji}</span>
                    <span className="text-xs font-semibold leading-tight">{lang === 'pid' ? cat.pidgin : cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          {step === 'location' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-bold text-brand-dark mb-6">{t.locQ}</h2>
              <div className="grid grid-cols-3 gap-2">
                {LOCATIONS.map(loc => (
                  <button key={loc} onClick={() => setLocation(loc)}
                    className={`py-2.5 px-3 rounded-xl border-2 text-xs font-semibold transition-all ${
                      location === loc ? 'border-brand-green bg-brand-light text-brand-green' : 'border-gray-200 text-gray-600 hover:border-brand-green/50'
                    }`}>
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Generating */}
          {step === 'generating' && (
            <div className="animate-fade-in text-center py-8">
              <div className="w-20 h-20 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 size={36} className="text-brand-green animate-spin" />
              </div>
              <h2 className="font-display text-2xl font-bold text-brand-dark mb-3">{t.generating}</h2>
              <div className="space-y-2">
                {t.generatingSteps.map((s, i) => (
                  <div key={i} className={`flex items-center justify-center gap-2 text-sm transition-all duration-300 ${
                    i < genStep ? 'text-brand-green' : i === genStep ? 'text-brand-dark font-medium' : 'text-gray-300'
                  }`}>
                    {i < genStep ? <Check size={14} /> : i === genStep ? <Loader2 size={14} className="animate-spin" /> : <div className="w-3.5 h-3.5 rounded-full border border-gray-300" />}
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Done */}
          {step === 'done' && (
            <div className="animate-fade-in text-center">
              <div className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-green/30">
                <Check size={36} className="text-white" />
              </div>
              <h2 className="font-display text-2xl font-bold text-brand-dark mb-2">{t.doneTitle}</h2>
              <p className="text-gray-500 text-sm mb-2">{t.doneSub}</p>
              <p className="font-bold text-brand-dark text-sm mb-6">{email}</p>

              <div className="bg-brand-light border-2 border-brand-green/20 rounded-2xl p-4 mb-6">
                <p className="text-xs text-gray-500 mb-1">{lang === 'pid' ? "Your shop link:" : "Your store link:"}</p>
                <p className="font-display font-bold text-brand-green text-sm">sokoni.africa/{storeSlug}</p>
              </div>

              <div className="space-y-3">
                <Link href={`/store/${storeSlug}`}
                  className="block w-full bg-brand-green text-white font-bold py-4 rounded-2xl hover:bg-brand-dark transition-colors">
                  {t.viewStore}
                </Link>
                <Link href="/login"
                  className="block w-full bg-white border-2 border-brand-green text-brand-green font-bold py-4 rounded-2xl hover:bg-brand-light transition-colors">
                  {t.addProducts}
                </Link>
              </div>

              <a href={`https://wa.me/?text=Check out my online store: sokoni.africa/${storeSlug}`}
                target="_blank" rel="noreferrer" className="btn-whatsapp w-full justify-center mt-3">
                📲 {lang === 'pid' ? "Share for WhatsApp" : "Share on WhatsApp"}
              </a>
            </div>
          )}

          {/* Nav buttons */}
          {!['language', 'generating', 'done'].includes(step) && (
            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(prevStep[step])}
                className="flex items-center gap-1.5 text-gray-500 hover:text-brand-dark text-sm font-medium px-4 py-3">
                <ArrowLeft size={16} /> {t.back}
              </button>
              <button onClick={handleNext}
                disabled={(step === 'category' && !category) || (step === 'location' && !location)}
                className="flex-1 bg-brand-green text-white font-bold py-3 rounded-2xl hover:bg-brand-dark 
                           transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {t.next} <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
