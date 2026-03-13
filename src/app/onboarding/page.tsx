'use client'
import { useState } from 'react'
import { ArrowRight, ArrowLeft, Loader2, Check, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

type Step = 'language' | 'business' | 'category' | 'location' | 'generating' | 'done'

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
    welcomeSub: "Answer 3 quick questions. Your store will be live in minutes.",
    langQ: "What language do you prefer?",
    bizQ: "What is your business name?",
    bizPlaceholder: "e.g. Tropical Market",
    catQ: "What do you sell?",
    locQ: "Where is your business located?",
    generating: "Building your store...",
    generatingSteps: [
      "Creating your store design...",
      "Setting up your product catalogue...",
      "Configuring your WhatsApp order button...",
      "Adding your business details...",
      "Almost ready...",
    ],
    doneTitle: "Your store is live! 🎉",
    doneSub: "Share your link and start receiving orders on WhatsApp.",
    viewStore: "View My Store",
    addProducts: "Add My Products",
    next: "Continue",
    back: "Back",
    bizNameError: "Please enter your business name",
  },
  pid: {
    welcome: "Make we build your shop",
    welcomeSub: "Answer 3 small questions. Your shop go dey live for minutes.",
    langQ: "Which language you prefer?",
    bizQ: "Wetin be your business name?",
    bizPlaceholder: "e.g. Tropical Market",
    catQ: "Wetin you dey sell?",
    locQ: "Where your business dey?",
    generating: "We dey build your shop...",
    generatingSteps: [
      "We dey create your shop design...",
      "We dey set up your product catalogue...",
      "We dey configure your WhatsApp order button...",
      "We dey add your business details...",
      "E almost ready...",
    ],
    doneTitle: "Your shop don go live! 🎉",
    doneSub: "Share your link and start receive orders on WhatsApp.",
    viewStore: "See My Shop",
    addProducts: "Add My Products",
    next: "Continue",
    back: "Go Back",
    bizNameError: "Abeg enter your business name",
  }
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-2 justify-center mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${
          i < current ? 'bg-brand-green w-6' : i === current ? 'bg-brand-green w-10' : 'bg-gray-200 w-6'
        }`} />
      ))}
    </div>
  )
}

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>('language')
  const [lang, setLang] = useState<'en' | 'pid'>('pid')
  const [bizName, setBizName] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [error, setError] = useState('')
  const [genStep, setGenStep] = useState(0)
  const [storeSlug, setStoreSlug] = useState('')

  const t = TEXT[lang]
  const stepNums: Record<Step, number> = {
    language: 0, business: 1, category: 2, location: 3, generating: 4, done: 4
  }

  async function generateStore() {
    setStep('generating')
    // Simulate AI generation with progressive steps
    for (let i = 0; i < t.generatingSteps.length; i++) {
      setGenStep(i)
      await new Promise(r => setTimeout(r, 800))
    }
    // Create slug from business name
    const slug = bizName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    setStoreSlug(slug)

    // In production: POST to /api/stores/create with { bizName, category, location, lang }
    // For now: simulate success
    await new Promise(r => setTimeout(r, 500))
    setStep('done')
  }

  function handleNext() {
    setError('')
    if (step === 'language') { setStep('business'); return }
    if (step === 'business') {
      if (!bizName.trim()) { setError(t.bizNameError); return }
      setStep('category'); return
    }
    if (step === 'category') { setStep('location'); return }
    if (step === 'location') { generateStore(); return }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-light to-white flex flex-col">
      {/* Nav */}
      <nav className="p-4 flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-green rounded-lg flex items-center justify-center">
            <ShoppingBag size={14} className="text-white" />
          </div>
          <span className="font-display font-bold text-brand-dark text-sm">Sokoni Africa</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">

          {/* STEP: Language */}
          {step === 'language' && (
            <div className="animate-fade-in">
              <StepIndicator current={0} total={4} />
              <h1 className="font-display text-2xl font-bold text-brand-dark text-center mb-2">{t.welcome}</h1>
              <p className="text-gray-500 text-center text-sm mb-8">{t.welcomeSub}</p>
              <p className="font-semibold text-brand-dark mb-4 text-center">{t.langQ}</p>
              <div className="grid grid-cols-2 gap-3">
                {(['en', 'pid'] as const).map(l => (
                  <button key={l} onClick={() => { setLang(l); setStep('business') }}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      lang === l ? 'border-brand-green bg-brand-light' : 'border-gray-200 hover:border-brand-green/50'
                    }`}>
                    <div className="text-2xl mb-2">{l === 'en' ? '🇬🇧' : '🇳🇬'}</div>
                    <div className="font-display font-bold text-brand-dark text-sm">
                      {l === 'en' ? 'English' : 'Pidgin English'}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {l === 'en' ? 'Standard English' : 'Nigerian Pidgin'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP: Business Name */}
          {step === 'business' && (
            <div className="animate-fade-in">
              <StepIndicator current={1} total={4} />
              <h2 className="font-display text-2xl font-bold text-brand-dark text-center mb-2">{t.bizQ}</h2>
              <p className="text-gray-500 text-center text-sm mb-8">
                {lang === 'pid' ? "This na wetin go show for your shop" : "This is what customers will see on your store"}
              </p>
              <input
                type="text"
                value={bizName}
                onChange={e => { setBizName(e.target.value); setError('') }}
                placeholder={t.bizPlaceholder}
                className={`w-full border-2 rounded-2xl px-5 py-4 text-lg font-display font-semibold 
                           text-brand-dark placeholder-gray-300 outline-none transition-colors
                           ${error ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-brand-green bg-white'}`}
                onKeyDown={e => e.key === 'Enter' && handleNext()}
                autoFocus
              />
              {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
              {bizName && (
                <p className="text-xs text-gray-400 text-center mt-3">
                  {lang === 'pid' ? "Your link go be:" : "Your store link will be:"}{" "}
                  <span className="text-brand-green font-medium">
                    sokoni.africa/{bizName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                  </span>
                </p>
              )}
            </div>
          )}

          {/* STEP: Category */}
          {step === 'category' && (
            <div className="animate-fade-in">
              <StepIndicator current={2} total={4} />
              <h2 className="font-display text-2xl font-bold text-brand-dark text-center mb-2">{t.catQ}</h2>
              <p className="text-gray-500 text-center text-sm mb-6">
                {lang === 'pid' ? "Pick the one wey close to your business" : "Pick the closest to your business"}
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {CATEGORIES.map(cat => (
                  <button key={cat.id}
                    onClick={() => { setCategory(cat.id); }}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                      category === cat.id
                        ? 'border-brand-green bg-brand-light'
                        : 'border-gray-200 bg-white hover:border-brand-green/50'
                    }`}>
                    <div className="text-xl mb-1">{cat.emoji}</div>
                    <div className="text-xs font-semibold text-brand-dark">
                      {lang === 'pid' ? cat.pidgin : cat.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP: Location */}
          {step === 'location' && (
            <div className="animate-fade-in">
              <StepIndicator current={3} total={4} />
              <h2 className="font-display text-2xl font-bold text-brand-dark text-center mb-2">{t.locQ}</h2>
              <p className="text-gray-500 text-center text-sm mb-6">
                {lang === 'pid' ? "Which city or state you dey?" : "Which city or state are you in?"}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {LOCATIONS.map(loc => (
                  <button key={loc}
                    onClick={() => setLocation(loc)}
                    className={`py-2.5 px-3 rounded-xl border-2 text-xs font-semibold transition-all ${
                      location === loc
                        ? 'border-brand-green bg-brand-light text-brand-green'
                        : 'border-gray-200 text-gray-600 hover:border-brand-green/50'
                    }`}>
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP: Generating */}
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

          {/* STEP: Done */}
          {step === 'done' && (
            <div className="animate-fade-in text-center">
              <div className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-green/30">
                <Check size={36} className="text-white" />
              </div>
              <h2 className="font-display text-2xl font-bold text-brand-dark mb-2">{t.doneTitle}</h2>
              <p className="text-gray-500 text-sm mb-6">{t.doneSub}</p>
              
              <div className="bg-brand-light border-2 border-brand-green/20 rounded-2xl p-4 mb-6">
                <p className="text-xs text-gray-500 mb-1">
                  {lang === 'pid' ? "Your shop link:" : "Your store link:"}
                </p>
                <p className="font-display font-bold text-brand-green">sokoni.africa/{storeSlug}</p>
              </div>

              <div className="space-y-3">
                <Link href={`/store/${storeSlug}`}
                  className="block w-full bg-brand-green text-white font-bold py-4 rounded-2xl 
                             hover:bg-brand-dark transition-colors">
                  {t.viewStore}
                </Link>
                <Link href="/dashboard/products/new"
                  className="block w-full bg-white border-2 border-brand-green text-brand-green 
                             font-bold py-4 rounded-2xl hover:bg-brand-light transition-colors">
                  {t.addProducts}
                </Link>
              </div>

              {/* WhatsApp share */}
              <a href={`https://wa.me/?text=Check out my online store: sokoni.africa/${storeSlug}`}
                target="_blank" rel="noreferrer"
                className="btn-whatsapp w-full justify-center mt-3">
                📲 {lang === 'pid' ? "Share for WhatsApp" : "Share on WhatsApp"}
              </a>
            </div>
          )}

          {/* Navigation buttons */}
          {!['language', 'generating', 'done'].includes(step) && (
            <div className="flex gap-3 mt-8">
              <button onClick={() => {
                const prev: Record<string, Step> = { business: 'language', category: 'business', location: 'category' }
                setStep(prev[step] as Step)
              }} className="flex items-center gap-1.5 text-gray-500 hover:text-brand-dark text-sm font-medium px-4 py-3">
                <ArrowLeft size={16} /> {t.back}
              </button>
              <button
                onClick={handleNext}
                disabled={(step === 'category' && !category) || (step === 'location' && !location)}
                className="flex-1 bg-brand-green text-white font-bold py-3 rounded-2xl 
                           hover:bg-brand-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2">
                {t.next} <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
