'use client'
import Link from 'next/link'
import { useState } from 'react'
import {
  ShoppingBag, Zap, Smartphone, MessageCircle,
  ChevronRight, Star, Check, Globe, ArrowRight
} from 'lucide-react'

const freeFeatures = [
  "Your own store link (earket.com/yourstore)",
  "Unlimited products",
  "WhatsApp order button on every product",
  "AI writes your product descriptions",
  "Works on 2G/3G connections",
  "Accept any payment method",
  "Order management dashboard",
  "Free forever — no credit card needed",
]

const testimonials = [
  { name: "Tropical Market", location: "Lagos, Nigeria", text: "My customers can now see all my products online and order on WhatsApp. It completely changed how I run my business.", stars: 5 },
  { name: "Keiko Fashions", location: "Nairobi, Kenya", text: "I set up my store in 5 minutes. Now I get orders from customers I've never met before. The WhatsApp button makes it so easy.", stars: 5 },
  { name: "Al-Rashid Electronics", location: "Cairo, Egypt", text: "The AI wrote all my product descriptions. My store looks professional and customers trust it. Sales doubled in 2 months.", stars: 5 },
]

const features = [
  { icon: "⚡", title: "Live in 5 minutes", body: "AI builds your store for you. Just answer a few questions and your store is ready to share." },
  { icon: "📱", title: "Works on any phone", body: "Optimised for slow connections and basic smartphones. Built for the real world, not Silicon Valley." },
  { icon: "💬", title: "WhatsApp orders", body: "Customers order straight from WhatsApp. No app to download. No account to create." },
  { icon: "🆓", title: "Free forever", body: "No monthly fee. No hidden charges. No credit card. Free. Period." },
  { icon: "🌍", title: "Built for emerging markets", body: "Works in Nigeria, Kenya, Egypt, Pakistan, Indonesia and beyond. Any country, any language." },
  { icon: "🤖", title: "AI assistant", body: "AI writes your product descriptions and handles customer enquiries automatically." },
]

const steps = [
  { title: "Tell us about your business", body: "Answer 3 simple questions. Our AI does the rest." },
  { title: "Your store goes live instantly", body: "Get a shareable link right away. Share on WhatsApp, Instagram or anywhere." },
  { title: "Customers order on WhatsApp", body: "They message you directly. You confirm and deliver." },
]

export default function HomePage() {
  const [lang, setLang] = useState<'en' | 'pid'>('en')
  const [currency, setCurrency] = useState<{ symbol: string; rate: number; name: string; code: string }>({ symbol: '$', rate: 1, name: 'US Dollar', code: 'USD' })
  const [currencyLoaded, setCurrencyLoaded] = useState(false)

  // Detect visitor currency on load
  useState(() => {
    fetch('/api/geo').then(r => r.json()).then(data => {
      if (data.currency) setCurrency(data.currency)
      setCurrencyLoaded(true)
    }).catch(() => setCurrencyLoaded(true))
  })

  function formatPrice(usd: number) {
    const raw = usd * currency.rate
    // Round DOWN to clean numbers based on magnitude
    let rounded: number
    if (raw >= 10000) rounded = Math.floor(raw / 1000) * 1000
    else if (raw >= 1000) rounded = Math.floor(raw / 500) * 500
    else if (raw >= 100) rounded = Math.floor(raw / 50) * 50
    else if (raw >= 10) rounded = Math.floor(raw / 5) * 5
    else rounded = Math.floor(raw)
    return `${currency.symbol}${rounded.toLocaleString()}`
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
              <ShoppingBag size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-brand-dark text-lg">Earket</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === 'en' ? 'pid' : 'en')}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-brand-green 
                         border border-gray-200 rounded-full px-3 py-1.5 transition-colors">
              <Globe size={12} />
              {lang === 'en' ? 'Pidgin' : 'English'}
            </button>
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-brand-green transition-colors">
              Login
            </Link>
            <Link href="/onboarding"
              className="bg-brand-green text-white text-sm font-semibold px-4 py-2 rounded-xl 
                         hover:bg-brand-dark transition-colors active:scale-95 duration-100">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative bg-gradient-to-b from-brand-light to-white overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231A7A4A' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="relative max-w-5xl mx-auto px-4 pt-16 pb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-accent/10 text-brand-accent border border-brand-accent/20 
                          rounded-full px-4 py-1.5 text-xs font-semibold mb-6">
            🌍 Built for Emerging Markets · Free Forever
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-brand-dark leading-tight 
                         text-balance mb-6">
            {lang === 'en'
              ? 'Your Online Store, Ready in Minutes.'
              : 'Carry Your Market Enter Online.'}
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto mb-8">
            {lang === 'en'
              ? 'Build a free online store. Share it anywhere. Let customers order on WhatsApp. No tech skills needed — works on any phone, anywhere in the world.'
              : 'Build your free shop for internet in 5 minutes. You no need know tech. E go work on any phone.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/onboarding"
              className="bg-brand-green text-white font-bold text-base px-8 py-4 rounded-2xl 
                         hover:bg-brand-dark transition-all active:scale-95 shadow-lg shadow-brand-green/20
                         flex items-center justify-center gap-2">
              Start Free — No Credit Card
              <ArrowRight size={18} />
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-3">Join thousands of merchants already selling online</p>

          {/* Mock phone preview */}
          <div className="mt-14 flex justify-center">
            <div className="relative w-64 bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="bg-brand-green text-white p-3 flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">🛍️</div>
                <div>
                  <div className="text-xs font-bold">Tropical Market</div>
                  <div className="text-xs opacity-75">earket.com/tropical-market</div>
                </div>
              </div>
              <div className="p-3 space-y-2">
                {[
                  { name: "Fresh Tomatoes (1kg)", priceUSD: 1.50, emoji: "🍅" },
                  { name: "Sunflower Oil (1L)", priceUSD: 2.50, emoji: "🫙" },
                  { name: "White Rice (5kg)", priceUSD: 4.00, emoji: "🍚" },
                ].map((p, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-xl p-2">
                    <div className="w-10 h-10 bg-brand-light rounded-lg flex items-center justify-center text-lg">{p.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-gray-800 truncate">{p.name}</div>
                      <div className="text-xs text-brand-green font-bold">{formatPrice(p.priceUSD)}</div>
                    </div>
                  </div>
                ))}
                <button className="w-full btn-whatsapp justify-center text-xs">
                  💬 Order on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Markets we serve */}
      <section className="py-10 px-4 bg-brand-dark">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-6">Serving merchants across</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-white/70">
            {['🇳🇬 Nigeria', '🇬🇭 Ghana', '🇰🇪 Kenya', '🇿🇦 South Africa', '🇪🇬 Egypt',
              '🇵🇰 Pakistan', '🇧🇩 Bangladesh', '🇮🇩 Indonesia', '🇵🇭 Philippines', '🌍 & more'].map((m, i) => (
              <span key={i} className="bg-white/10 px-3 py-1.5 rounded-full">{m}</span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <h2 className="font-display text-3xl font-bold text-center text-brand-dark mb-12">How it works</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <div className="w-14 h-14 bg-brand-light rounded-2xl flex items-center justify-center 
                              text-brand-green font-display font-bold text-xl mx-auto mb-4 
                              border-2 border-brand-green/20">
                {i + 1}
              </div>
              <h3 className="font-display font-bold text-brand-dark mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm">{step.body}</p>
              {i < 2 && (
                <div className="hidden sm:flex justify-center mt-4">
                  <ChevronRight className="text-brand-green/30" size={24} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-brand-dark">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-center text-white mb-4">
            Everything you need. Nothing you don't.
          </h2>
          <p className="text-center text-white/50 text-sm mb-12 max-w-xl mx-auto">
            Designed for merchants in emerging markets where internet is slow, phones are basic, and WhatsApp is how business gets done.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-display font-bold text-white mb-1.5">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <h2 className="font-display text-3xl font-bold text-center text-brand-dark mb-3">Simple pricing</h2>
        <p className="text-center text-gray-500 mb-2 text-sm">No hidden fees. No surprises.</p>
        {currencyLoaded && currency.code !== 'USD' && (
          <p className="text-center text-xs text-gray-400 mb-12">Prices shown in {currency.name} · approximate conversion</p>
        )}
        {currencyLoaded && currency.code === 'USD' && (
          <p className="text-center text-xs text-gray-400 mb-12">&nbsp;</p>
        )}
        <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {/* Free */}
          <div className="border-2 border-brand-green rounded-2xl p-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-green text-white text-xs font-bold px-3 py-1 rounded-full">
              Most Popular
            </div>
            <div className="text-3xl font-display font-bold text-brand-dark mb-1">Free</div>
            <div className="text-gray-500 text-sm mb-5">For every merchant</div>
            <ul className="space-y-2 mb-6">
              {freeFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                  <Check size={14} className="text-brand-green mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/onboarding" className="block w-full bg-brand-green text-white text-center 
              font-bold py-3 rounded-xl hover:bg-brand-dark transition-colors text-sm">
              Start Free Now
            </Link>
          </div>

          {/* Pro Setup */}
          <div className="border border-gray-200 rounded-2xl p-6">
            <div className="text-3xl font-display font-bold text-brand-dark mb-1">{currencyLoaded ? formatPrice(25) : "$25"}</div>
            <div className="text-gray-500 text-sm mb-5">We build it for you</div>
            <ul className="space-y-2 mb-6">
              {["Professional store setup", "We photograph your products", "AI-written descriptions", "WhatsApp bot configured", "Payment setup", "Training session"].map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                  <Check size={14} className="text-brand-accent mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/contact" className="block w-full bg-brand-accent text-white text-center 
              font-bold py-3 rounded-xl hover:bg-orange-600 transition-colors text-sm">
              Book Setup
            </Link>
          </div>

          {/* Monthly */}
          <div className="border border-gray-200 rounded-2xl p-6">
            <div className="text-3xl font-display font-bold text-brand-dark mb-1">{currencyLoaded ? formatPrice(15) : "$15"}<span className="text-lg text-gray-400">/mo</span></div>
            <div className="text-gray-500 text-sm mb-5">We manage it for you</div>
            <ul className="space-y-2 mb-6">
              {["Everything in Setup", "Monthly product updates", "WhatsApp broadcast messages", "Sales performance report", "Priority support", "Promo graphics included"].map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                  <Check size={14} className="text-gray-400 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/contact" className="block w-full bg-gray-900 text-white text-center 
              font-bold py-3 rounded-xl hover:bg-gray-700 transition-colors text-sm">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-brand-light">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-center text-brand-dark mb-12">Merchants love Earket</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.stars)].map((_, j) => <Star key={j} size={14} className="text-brand-accent fill-brand-accent" />)}
                </div>
                <p className="text-gray-600 text-sm mb-4 italic">"{t.text}"</p>
                <div>
                  <div className="font-display font-bold text-brand-dark text-sm">{t.name}</div>
                  <div className="text-xs text-gray-400">{t.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 text-center bg-brand-green">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
          Ready to take your business online?
        </h2>
        <p className="text-brand-light mb-8 text-lg">Free forever. Live in 5 minutes. No tech skills needed.</p>
        <Link href="/onboarding"
          className="inline-flex items-center gap-2 bg-white text-brand-green font-bold text-lg 
                     px-10 py-4 rounded-2xl hover:bg-brand-light transition-colors active:scale-95 
                     shadow-xl">
          Start Free Now
          <ArrowRight size={20} />
        </Link>
        <p className="text-white/60 text-xs mt-4">Works in Nigeria, Kenya, Ghana, Egypt, Pakistan and beyond</p>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-xs text-gray-400 border-t border-gray-100">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 bg-brand-green rounded-md flex items-center justify-center">
            <ShoppingBag size={12} className="text-white" />
          </div>
          <span className="font-display font-bold text-brand-dark text-sm">Earket</span>
        </div>
        <p className="mb-3">© 2025 Earket. Free online stores for emerging market merchants.</p>
        <div className="flex justify-center gap-4">
          <Link href="/privacy" className="hover:text-brand-green">Privacy</Link>
          <Link href="/terms" className="hover:text-brand-green">Terms</Link>
          <Link href="/contact" className="hover:text-brand-green">Contact</Link>
        </div>
      </footer>
    </div>
  )
}
