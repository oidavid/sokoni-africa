'use client'
import { useState } from 'react'
import { ArrowRight, ArrowLeft, Loader2, Check, ShoppingBag, Mail, MessageCircle } from 'lucide-react'
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
  const [loginSent, setLoginSent] = useState<'email' | 'whatsapp' | null>(null)
  const [alreadyExists, setAlreadyExists] = useState(false)

  const pid = lang === 'pid'

  const generatingSteps = pid ? [
    'We dey create your shop design...',
    'We dey set up your product catalogue...',
    'We dey configure your WhatsApp order button...',
    'We dey save your business details...',
    'E almost ready...',
  ] : [
    'Creating your store design...',
    'Setting up your product catalogue...',
    'Configuring your WhatsApp order button...',
    'Saving your business details...',
    'Almost ready...',
  ]

  const stepMap: Record<Step, number> = { language: 0, business: 1, whatsapp: 2, email: 3, category: 4, location: 5, generating: 6, done: 6 }
  const prevStep: Record<string, Step> = { business: 'language', whatsapp: 'business', email: 'whatsapp', category: 'email', location: 'category' }

  async function handleGenerate() {
    setStep('generating')
    setGenStep(0)

    const slug = slugify(businessName) + '-' + Math.random().toString(36).slice(2, 6)
    setStoreSlug(slug)

    for (let i = 0; i < generatingSteps.length; i++) {
      await new Promise(r => setTimeout(r, 700))
      setGenStep(i + 1)
    }

    // Check if email or phone already has a store
    const normalized = normalizeWhatsApp(whatsappNumber)
    const { data: existing } = await supabase
      .from('merchants')
      .select('slug, email, phone')
      .or(`email.eq.${email},phone.eq.${normalized}`)
      .single()

    if (existing) {
      // Already has a store — skip to done with existing slug
      setStoreSlug(existing.slug)
      setAlreadyExists(true)
      setStep('done')
      return
    }

    try {
      const { error: insertError } = await supabase.from('merchants').insert({
        business_name: businessName,
        slug,
        category,
        location,
        whatsapp_number: normalized,
        email,
        phone: normalized,
        language: lang,
        plan: 'free',
        is_active: true,
      })
      if (insertError) console.error('Insert error:', insertError)
    } catch (e) {
      console.error('Save error:', e)
    }

    setStep('done')
  }

  async function sendLoginEmail() {
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    })
    setLoginSent('email')
  }

  function sendLoginWhatsApp() {
    const waNum = normalizeWhatsApp(whatsappNumber)
    const loginUrl = `${window.location.origin}/login`
    const msg = pid
      ? `Your Sokoni store don ready! 🎉\n\nYour store link: sokoni.africa/${storeSlug}\n\nTo add products and manage your store, login here:\n${loginUrl}\n\nUse your email: ${email}`
      : `Your Sokoni store is live! 🎉\n\nYour store link: sokoni.africa/${storeSlug}\n\nTo add products and manage your store, login here:\n${loginUrl}\n\nUse your email: ${email}`
    window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`, '_blank')
    setLoginSent('whatsapp')
  }

  function handleNext() {
    setError('')
    if (step === 'business') {
      if (!businessName.trim()) { setError(pid ? 'Abeg enter your business name' : 'Please enter your business name'); return }
      setStep('whatsapp')
    } else if (step === 'whatsapp') {
      if (!whatsappNumber.trim()) { setError(pid ? 'Abeg enter your WhatsApp number' : 'Please enter your WhatsApp number'); return }
      setStep('email')
    } else if (step === 'email') {
      if (!email.trim() || !email.includes('@')) { setError(pid ? 'Abeg enter valid email' : 'Please enter a valid email'); return }
      setStep('category')
    } else if (step === 'category') {
      setStep('location')
    } else if (step === 'location') {
      handleGenerate()
    }
  }

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
            <StepIndicator current={stepMap[step] - 1} total={6} />
          )}

          {/* Language */}
          {step === 'language' && (
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-brand-green rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-green/20">
                <ShoppingBag size={28} className="text-white" />
              </div>
              <h1 className="font-display text-2xl font-bold text-brand-dark mb-2">
                {pid ? 'Make we build your shop' : "Let's build your store"}
              </h1>
              <p className="text-gray-500 text-sm mb-8">
                {pid ? 'Answer small questions. Your shop go dey live for minutes.' : 'Answer a few quick questions. Your store will be live in minutes.'}
              </p>
              <div className="space-y-3">
                {[
                  { code: 'pid' as const, label: 'Pidgin English', sub: 'I wan use Pidgin' },
                  { code: 'en' as const, label: 'English', sub: 'I prefer English' },
                ].map(l => (
                  <button key={l.code} onClick={() => { setLang(l.code); setStep('business') }}
                    className="w-full flex items-center justify-between bg-white border-2 border-gray-200 hover:border-brand-green rounded-2xl p-4 transition-all group">
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
              <h2 className="font-display text-xl font-bold text-brand-dark mb-1">
                {pid ? 'Wetin be your business name?' : 'What is your business name?'}
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                {pid ? 'This go be the name wey customers go see.' : 'This is what customers will see on your store.'}
              </p>
              <input type="text" placeholder="e.g. Tropical Market" value={businessName}
                onChange={e => { setBusinessName(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleNext()} autoFocus
                className="w-full border-2 border-gray-200 focus:border-brand-green rounded-2xl px-4 py-4 text-brand-dark font-display font-bold text-lg outline-none transition-colors" />
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            </div>
          )}

          {/* WhatsApp */}
          {step === 'whatsapp' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-bold text-brand-dark mb-1">
                {pid ? 'Your WhatsApp business number?' : 'Your WhatsApp business number?'}
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                {pid ? 'Customers go send orders to this number' : 'Customers will send orders to this number'}
              </p>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">🇳🇬 +234</span>
                <input type="tel" placeholder="08012345678" value={whatsappNumber}
                  onChange={e => { setWhatsappNumber(e.target.value); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleNext()} autoFocus
                  className="w-full border-2 border-gray-200 focus:border-brand-green rounded-2xl pl-24 pr-4 py-4 text-brand-dark font-display font-bold text-lg outline-none transition-colors" />
              </div>
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
              <p className="text-xs text-gray-400 mt-3">
                ⚠️ {pid ? 'Make sure say this number dey active on WhatsApp' : 'Make sure this number is active on WhatsApp'}
              </p>
            </div>
          )}

          {/* Email */}
          {step === 'email' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-bold text-brand-dark mb-1">
                {pid ? 'Your email address?' : 'Your email address?'}
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                {pid ? 'We go use this to send you login link — no password needed' : 'We use this to send your login link — no password needed'}
              </p>
              <input type="email" placeholder="you@example.com" value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleNext()} autoFocus
                className="w-full border-2 border-gray-200 focus:border-brand-green rounded-2xl px-4 py-4 text-brand-dark font-semibold text-lg outline-none transition-colors" />
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
              <p className="text-xs text-gray-400 mt-3">🔒 {pid ? 'No password wahala' : 'No password required'}</p>
            </div>
          )}

          {/* Category */}
          {step === 'category' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-bold text-brand-dark mb-6">
                {pid ? 'Wetin you dey sell?' : 'What do you sell?'}
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map(cat => (
                  <button key={cat.id} onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-2 p-3 rounded-2xl border-2 text-left transition-all ${
                      category === cat.id ? 'border-brand-green bg-brand-light text-brand-green' : 'border-gray-200 text-gray-600 hover:border-brand-green/50'
                    }`}>
                    <span className="text-xl">{cat.emoji}</span>
                    <span className="text-xs font-semibold leading-tight">{pid ? cat.pidgin : cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          {step === 'location' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-bold text-brand-dark mb-6">
                {pid ? 'Where your business dey?' : 'Where is your business located?'}
              </h2>
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
              <h2 className="font-display text-2xl font-bold text-brand-dark mb-3">
                {pid ? 'We dey build your shop...' : 'Building your store...'}
              </h2>
              <div className="space-y-2">
                {generatingSteps.map((s, i) => (
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
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ${alreadyExists ? 'bg-brand-accent shadow-brand-accent/30' : 'bg-brand-green shadow-brand-green/30'}`}>
                <Check size={36} className="text-white" />
              </div>
              {alreadyExists && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 text-left">
                  <p className="font-semibold text-amber-800 text-sm mb-1">⚠️ {pid ? 'You don already get shop!' : 'You already have a store!'}</p>
                  <p className="text-amber-700 text-xs">{pid ? 'This email or WhatsApp number don already use to create shop. We go take you to your existing shop.' : 'This email or WhatsApp number is already linked to a store. We're showing your existing store below.'}</p>
                </div>
              )}
              <h2 className="font-display text-2xl font-bold text-brand-dark mb-2">
                {alreadyExists
                  ? (pid ? 'Your shop dey here! 👋' : 'Welcome back! 👋')
                  : (pid ? 'Your shop don go live! 🎉' : 'Your store is live! 🎉')
                }
              </h2>

              <div className="bg-brand-light border-2 border-brand-green/20 rounded-2xl p-4 mb-6">
                <p className="text-xs text-gray-500 mb-1">{pid ? 'Your shop link:' : 'Your store link:'}</p>
                <p className="font-display font-bold text-brand-green text-sm">sokoni.africa/{storeSlug}</p>
              </div>

              {/* Login delivery options */}
              {!loginSent ? (
                <>
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    {pid ? 'How you want receive your login link?' : 'How would you like to receive your login link?'}
                  </p>
                  <div className="space-y-2 mb-5">
                    <button onClick={sendLoginEmail}
                      className="w-full flex items-center gap-3 bg-white border-2 border-gray-200 hover:border-brand-green rounded-2xl p-4 transition-all">
                      <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center">
                        <Mail size={20} className="text-brand-green" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-brand-dark text-sm">{pid ? 'Send to my Email' : 'Send to my Email'}</div>
                        <div className="text-xs text-gray-400 truncate">{email}</div>
                      </div>
                    </button>

                    <button onClick={sendLoginWhatsApp}
                      className="w-full flex items-center gap-3 bg-[#25D366] rounded-2xl p-4 transition-all hover:opacity-90">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <MessageCircle size={20} className="text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-white text-sm">{pid ? 'Send to my WhatsApp' : 'Send to my WhatsApp'}</div>
                        <div className="text-xs text-white/70">+{normalizeWhatsApp(whatsappNumber)}</div>
                      </div>
                    </button>
                  </div>
                </>
              ) : (
                <div className="bg-brand-light rounded-2xl p-4 mb-5 flex items-center gap-3">
                  <Check size={18} className="text-brand-green shrink-0" />
                  <p className="text-sm text-brand-dark font-semibold">
                    {loginSent === 'email'
                      ? (pid ? 'Login link don reach your email!' : 'Login link sent to your email!')
                      : (pid ? 'Login details don reach your WhatsApp!' : 'Login details sent to your WhatsApp!')}
                  </p>
                </div>
              )}

              <Link href={`/store/${storeSlug}`}
                className="block w-full bg-brand-green text-white font-bold py-3 rounded-2xl hover:bg-brand-dark transition-colors mb-2 text-sm">
                {pid ? 'See My Shop' : 'View My Store'}
              </Link>

              <a href={`https://wa.me/?text=${encodeURIComponent('Check out my online store: sokoni.africa/' + storeSlug)}`}
                target="_blank" rel="noreferrer" className="btn-whatsapp w-full justify-center">
                📲 {pid ? 'Share for WhatsApp' : 'Share on WhatsApp'}
              </a>
            </div>
          )}

          {/* Nav buttons */}
          {!['language', 'generating', 'done'].includes(step) && (
            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(prevStep[step])}
                className="flex items-center gap-1.5 text-gray-500 hover:text-brand-dark text-sm font-medium px-4 py-3">
                <ArrowLeft size={16} /> {pid ? 'Go Back' : 'Back'}
              </button>
              <button onClick={handleNext}
                disabled={(step === 'category' && !category) || (step === 'location' && !location)}
                className="flex-1 bg-brand-green text-white font-bold py-3 rounded-2xl hover:bg-brand-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {pid ? 'Continue' : 'Continue'} <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
