'use client'
import Link from 'next/link'
import { useState } from 'react'
import {
  Zap, Smartphone, MessageCircle,
  ChevronRight, Star, Check, Globe, ArrowRight
} from 'lucide-react'

const freeFeatures = [
  "Your own business link (earket.com/yourbusiness)",
  "Unlimited products & services",
  "WhatsApp order & booking button",
  "AI writes your descriptions for you",
  "Works on 2G/3G connections",
  "Accept any payment method",
  "Order & booking management dashboard",
  "Free forever — no credit card needed",
]

const testimonials = [
  {
    name: "Tropical Market",
    location: "Lagos, Nigeria",
    text: "My customers can now see all my products online and order on WhatsApp. It completely changed how I run my business.",
    stars: 5,
    type: "🛍️ Retailer",
  },
  {
    name: "Keiko Hair Studio",
    location: "Nairobi, Kenya",
    text: "I set up my booking page in 5 minutes. Clients book straight from WhatsApp. No more missed calls or lost business.",
    stars: 5,
    type: "💄 Service",
  },
  {
    name: "Al-Rashid Electronics",
    location: "Cairo, Egypt",
    text: "The AI wrote all my product descriptions. My store looks professional and customers trust it. Sales doubled in 2 months.",
    stars: 5,
    type: "📱 Retailer",
  },
]

const features = [
  { icon: "⚡", title: "Live in 5 minutes", body: "Answer a few questions and your business page is ready to share. Products or services — we set it up for you." },
  { icon: "📱", title: "Works on any phone", body: "Optimised for slow connections and basic smartphones. Built for the real world, not Silicon Valley." },
  { icon: "💬", title: "WhatsApp orders & bookings", body: "Customers order or book straight from WhatsApp. No app to download. No account to create." },
  { icon: "🆓", title: "Free forever", body: "No monthly fee. No hidden charges. No credit card. Free. Period." },
  { icon: "🌍", title: "Built for emerging markets", body: "Works in Nigeria, Kenya, Egypt, Pakistan, Indonesia and beyond. Any country, any language." },
  { icon: "🤖", title: "AI assistant", body: "AI writes your product and service descriptions automatically. Save time, look professional." },
]

const steps = [
  { title: "Tell us about your business", body: "Selling products or offering services? Answer a few quick questions. Our AI does the rest." },
  { title: "Your page goes live instantly", body: "Get a shareable link right away. Share it on WhatsApp, Instagram or anywhere." },
  { title: "Customers reach you on WhatsApp", body: "They order or book directly. You confirm and deliver. Simple." },
]

const businessTypes = [
  { emoji: "🍱", label: "Food & Groceries" },
  { emoji: "👗", label: "Fashion & Clothing" },
  { emoji: "🔧", label: "Home Repairs" },
  { emoji: "💄", label: "Beauty & Hair" },
  { emoji: "📱", label: "Electronics" },
  { emoji: "🎉", label: "Events & Catering" },
  { emoji: "🚗", label: "Auto Services" },
  { emoji: "📚", label: "Tutoring" },
  { emoji: "🏠", label: "Cleaning Services" },
  { emoji: "🚚", label: "Delivery & Logistics" },
]

const dashboardFeatures = [
  {
    id: 'overview',
    icon: '📊',
    label: 'Overview',
    title: 'Your business at a glance',
    desc: 'See today\'s orders, revenue, and top products the moment you log in. No spreadsheets, no guesswork.',
    preview: (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Orders Today', val: '12', color: 'text-brand-green' },
            { label: 'Revenue', val: '₦48,500', color: 'text-brand-accent' },
            { label: 'In Stock', val: '94%', color: 'text-blue-500' },
          ].map((s, i) => (
            <div key={i} className="bg-brand-light rounded-xl p-3 text-center">
              <div className={`text-lg font-bold ${s.color} font-display`}>{s.val}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="text-xs font-semibold text-gray-500 mb-2">Recent Orders</div>
          {[
            { name: 'Adaeze O.', item: 'Basmati Rice 5kg', status: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
            { name: 'Chidi M.', item: 'Palm Oil 4L', status: 'Confirmed', color: 'bg-green-100 text-green-700' },
            { name: 'Funmi A.', item: 'Semolina 2kg', status: 'Delivered', color: 'bg-gray-100 text-gray-500' },
          ].map((o, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
              <div>
                <div className="text-xs font-semibold text-gray-800">{o.name}</div>
                <div className="text-xs text-gray-400">{o.item}</div>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${o.color}`}>{o.status}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'cash',
    icon: '💵',
    label: 'Cash Sale',
    title: 'Record in-person sales instantly',
    desc: 'Sold something face-to-face? Log it in seconds. Your inventory updates automatically and the sale appears in your reports.',
    preview: (
      <div className="space-y-3">
        <div className="bg-brand-light rounded-xl p-4 border-2 border-brand-green/20">
          <div className="text-xs font-bold text-brand-dark mb-3">New Cash Sale</div>
          <div className="space-y-2">
            <div className="bg-white rounded-lg p-2 flex items-center justify-between">
              <span className="text-xs text-gray-700">Fresh Tomatoes (1kg)</span>
              <span className="text-xs font-bold text-brand-green">₦3,500</span>
            </div>
            <div className="bg-white rounded-lg p-2 flex items-center justify-between">
              <span className="text-xs text-gray-700">Palm Oil (4L)</span>
              <span className="text-xs font-bold text-brand-green">₦5,200</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-brand-green/20 flex items-center justify-between">
            <span className="text-sm font-bold text-brand-dark">Total</span>
            <span className="text-sm font-bold text-brand-green">₦8,700</span>
          </div>
          <button className="mt-3 w-full bg-brand-green text-white text-xs font-bold py-2.5 rounded-lg">
            ✓ Record Sale
          </button>
        </div>
        <div className="text-xs text-gray-400 text-center">Inventory updates automatically</div>
      </div>
    ),
  },
  {
    id: 'inventory',
    icon: '📦',
    label: 'Inventory',
    title: 'Always know what you have in stock',
    desc: 'Track every product. Set low-stock alerts. Never accidentally sell something you don\'t have. Updates in real time with every sale.',
    preview: (
      <div className="space-y-2">
        <div className="text-xs font-bold text-gray-500 mb-3">Stock Levels</div>
        {[
          { name: 'Basmati Rice (5kg)', stock: 18, max: 30, warning: false },
          { name: 'Palm Oil (4L)', stock: 4, max: 20, warning: true },
          { name: 'Indomie Noodles (40pk)', stock: 12, max: 25, warning: false },
          { name: 'Milo (400g)', stock: 2, max: 15, warning: true },
        ].map((item, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-gray-800">{item.name}</span>
              <span className={`text-xs font-bold ${item.warning ? 'text-red-500' : 'text-gray-600'}`}>
                {item.stock} left {item.warning && '⚠️'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full ${item.warning ? 'bg-red-400' : 'bg-brand-green'}`}
                style={{ width: `${(item.stock / item.max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'broadcast',
    icon: '📣',
    label: 'Broadcast',
    title: 'Message all your customers at once',
    desc: 'Running a promo? New stock arrived? Send a WhatsApp broadcast to every customer who\'s ever ordered from you — in one tap.',
    preview: (
      <div className="space-y-3">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">💬</div>
            <div>
              <div className="text-xs font-bold text-gray-800">WhatsApp Broadcast</div>
              <div className="text-xs text-gray-500">Sending to 247 customers</div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 text-xs text-gray-700 leading-relaxed border border-green-100">
            🎉 <strong>Weekend Special!</strong> Fresh stock just arrived. Get 10% off all groceries this Saturday. Order now: earket.com/jb-mart
          </div>
          <div className="flex gap-2 mt-3">
            <button className="flex-1 bg-green-500 text-white text-xs font-bold py-2 rounded-lg">Send Now</button>
            <button className="px-3 bg-gray-100 text-gray-600 text-xs font-medium py-2 rounded-lg">Preview</button>
          </div>
        </div>
        <div className="text-xs text-gray-400 text-center">Last broadcast: 3 days ago · 89% open rate</div>
      </div>
    ),
  },
  {
    id: 'analytics',
    icon: '📈',
    label: 'Analytics',
    title: 'See how your store is performing',
    desc: 'Track visits, orders, top-selling products, and customer growth over time. Know exactly what\'s working and what isn\'t.',
    preview: (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Store Visits', val: '1,284', change: '+18%', up: true },
            { label: 'Conversion', val: '6.2%', change: '+1.4%', up: true },
            { label: 'Avg Order', val: '₦6,500', change: '+₦800', up: true },
            { label: 'Customers', val: '247', change: '+32', up: true },
          ].map((s, i) => (
            <div key={i} className="bg-brand-light rounded-xl p-3">
              <div className="text-base font-bold text-brand-dark font-display">{s.val}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
              <div className="text-xs text-brand-green font-semibold mt-0.5">{s.change} this week</div>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="text-xs font-bold text-gray-500 mb-2">Top Products</div>
          {[
            { name: 'Basmati Rice', pct: 28 },
            { name: 'Palm Oil', pct: 19 },
            { name: 'Indomie Noodles', pct: 15 },
          ].map((p, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <div className="text-xs text-gray-700 w-28 truncate">{p.name}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                <div className="h-1.5 rounded-full bg-brand-green" style={{ width: `${p.pct * 2.5}%` }} />
              </div>
              <div className="text-xs text-gray-500 w-8 text-right">{p.pct}%</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'customers',
    icon: '👥',
    label: 'Customers',
    title: 'Know who\'s buying from you',
    desc: 'See every customer, their order history, and how much they\'ve spent. Build real relationships, not just transactions.',
    preview: (
      <div className="space-y-2">
        <div className="text-xs font-bold text-gray-500 mb-3">Customer Directory</div>
        {[
          { name: 'Adaeze Okafor', orders: 8, total: '₦52,400', last: '2 days ago' },
          { name: 'Chidi Mensah', orders: 5, total: '₦31,000', last: '1 week ago' },
          { name: 'Funmi Adeyemi', orders: 12, total: '₦78,600', last: 'Today' },
          { name: 'Emeka Nwosu', orders: 3, total: '₦19,500', last: '2 weeks ago' },
        ].map((c, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center text-white text-xs font-bold shrink-0">
              {c.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-gray-800">{c.name}</div>
              <div className="text-xs text-gray-400">{c.orders} orders · {c.total}</div>
            </div>
            <div className="text-xs text-gray-400 shrink-0">{c.last}</div>
          </div>
        ))}
      </div>
    ),
  },
]

function DashboardDemo() {
  const [active, setActive] = useState('overview')
  const current = dashboardFeatures.find(f => f.id === active)!
  return (
    <>
      {/* Sidebar */}
      <div className="w-14 sm:w-48 bg-brand-dark border-r border-white/8 flex flex-col py-3 gap-1 shrink-0">
        {dashboardFeatures.map(f => (
          <button
            key={f.id}
            onClick={() => setActive(f.id)}
            className={`flex items-center gap-2.5 px-3 py-2.5 mx-2 rounded-xl text-left transition-all ${
              active === f.id
                ? 'bg-brand-green text-white'
                : 'text-white/50 hover:text-white hover:bg-white/8'
            }`}
          >
            <span className="text-base shrink-0">{f.icon}</span>
            <span className="text-xs font-semibold hidden sm:block truncate">{f.label}</span>
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden flex flex-col sm:flex-row">
        {/* Panel info */}
        <div className="sm:w-48 lg:w-56 border-b sm:border-b-0 sm:border-r border-gray-100 p-4 bg-gray-50/50 shrink-0">
          <div className="text-sm font-display font-bold text-brand-dark mb-1">{current.title}</div>
          <p className="text-xs text-gray-500 leading-relaxed">{current.desc}</p>
          <Link href="/onboarding"
            className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-green hover:text-brand-dark transition-colors">
            Get this free →
          </Link>
        </div>

        {/* Live preview */}
        <div className="flex-1 p-4 overflow-y-auto">
          {current.preview}
        </div>
      </div>
    </>
  )
}

export default function HomePage() {
  const [lang, setLang] = useState<'en' | 'pid'>('en')
  const [currency, setCurrency] = useState<{ symbol: string; rate: number; name: string; code: string }>({ symbol: '$', rate: 1, name: 'US Dollar', code: 'USD' })
  const [currencyLoaded, setCurrencyLoaded] = useState(false)

  useState(() => {
    fetch('/api/geo').then(r => r.json()).then(data => {
      if (data.currency) setCurrency(data.currency)
      setCurrencyLoaded(true)
    }).catch(() => setCurrencyLoaded(true))
  })

  function formatPrice(usd: number) {
    const raw = usd * currency.rate
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
      {/* Top bar — IntelSys attribution */}
      <div className="bg-brand-dark border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 h-8 flex items-center justify-between">
          <span className="text-xs text-white/40 font-medium">
            A product of{' '}
            <a href="https://intelsystechnology.com" target="_blank" rel="noopener noreferrer"
               className="text-white/65 hover:text-brand-accent transition-colors font-semibold">
              IntelSys Technologies
            </a>
          </span>
          <span className="hidden sm:block text-xs text-white/25 tracking-wide">
            AI-Powered &nbsp;·&nbsp; Free Forever &nbsp;·&nbsp; 134 Countries
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Wordmark */}
          <Link href="/" className="flex items-center gap-3 group">
            <span className="font-display font-bold text-brand-dark text-xl tracking-tight group-hover:text-brand-green transition-colors">
              Earket
            </span>
            <span className="hidden sm:inline-flex text-xs font-semibold text-brand-green bg-brand-light border border-brand-green/20 px-2.5 py-0.5 rounded-full">
              Free Forever
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#how-it-works" className="text-sm font-medium text-gray-500 hover:text-brand-green transition-colors">How It Works</a>
            <Link href="/browse" className="text-sm font-medium text-gray-500 hover:text-brand-green transition-colors">Browse Stores</Link>
            <a href="#features" className="text-sm font-medium text-gray-500 hover:text-brand-green transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-medium text-gray-500 hover:text-brand-green transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setLang(lang === 'en' ? 'pid' : 'en')}
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-brand-green
                         border border-gray-200 rounded-full px-3 py-1.5 transition-colors">
              <Globe size={11} />
              {lang === 'en' ? 'Pidgin' : 'English'}
            </button>
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-brand-green transition-colors px-1">
              Login
            </Link>
            <Link href="/onboarding"
              className="bg-brand-green text-white text-sm font-bold px-5 py-2.5 rounded-full
                         hover:bg-brand-dark transition-all active:scale-95 shadow-md shadow-brand-green/20">
              Start Free →
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
            🌍 For Retailers & Service Providers · Free Forever
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-brand-dark leading-tight 
                         text-balance mb-6">
            {lang === 'en'
              ? 'Your Business, Online in Minutes.'
              : 'Carry Your Business Enter Online.'}
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto mb-4">
            {lang === 'en'
              ? 'Whether you sell products or offer services — build your free business page, share it anywhere, and let customers reach you on WhatsApp.'
              : 'Whether you dey sell things or you dey offer service — build your free page for internet in 5 minutes. E go work on any phone.'}
          </p>

          {/* Two-line value prop */}
          <div className="flex flex-wrap justify-center gap-3 mb-8 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><span className="text-brand-green font-bold">🛍️</span> Sell products online</span>
            <span className="text-gray-300">·</span>
            <span className="flex items-center gap-1.5"><span className="text-brand-green font-bold">🔧</span> Offer services & bookings</span>
            <span className="text-gray-300">·</span>
            <span className="flex items-center gap-1.5"><span className="text-brand-green font-bold">💬</span> All via WhatsApp</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/onboarding"
              className="bg-brand-green text-white font-bold text-base px-8 py-4 rounded-2xl 
                         hover:bg-brand-dark transition-all active:scale-95 shadow-lg shadow-brand-green/20
                         flex items-center justify-center gap-2">
              Start Free — No Credit Card
              <ArrowRight size={18} />
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-3">Join thousands of businesses already using Earket</p>

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
                  { name: "Fresh Tomatoes (1kg)", priceUSD: 1.50, img: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=80&q=80" },
                  { name: "Vegetable Oil (2L)", priceUSD: 2.50, img: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=80&q=80" },
                  { name: "Basmati Rice (5kg)", priceUSD: 4.00, img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=80&q=80" },
                ].map((p, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-xl p-2">
                    <img src={p.img} alt={p.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-gray-800 truncate leading-tight">{p.name}</div>
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

      {/* Business types we serve */}
      <section className="py-10 px-4 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-5">Works for all business types</p>
          <div className="flex flex-wrap justify-center gap-2">
            {businessTypes.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5 bg-brand-light text-brand-dark text-xs font-semibold px-3 py-1.5 rounded-full border border-brand-green/10">
                {b.emoji} {b.label}
              </span>
            ))}
            <span className="flex items-center gap-1.5 bg-gray-100 text-gray-500 text-xs font-semibold px-3 py-1.5 rounded-full">
              + many more
            </span>
          </div>
        </div>
      </section>

      {/* Markets we serve */}
      <section className="py-10 px-4 bg-brand-dark">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-6">Serving businesses across</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-white/70">
            {['🇳🇬 Nigeria', '🇬🇭 Ghana', '🇰🇪 Kenya', '🇿🇦 South Africa', '🇪🇬 Egypt',
              '🇵🇰 Pakistan', '🇧🇩 Bangladesh', '🇮🇩 Indonesia', '🇵🇭 Philippines', '🌍 & more'].map((m, i) => (
              <span key={i} className="bg-white/10 px-3 py-1.5 rounded-full">{m}</span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 px-4 max-w-5xl mx-auto">
        <h2 className="font-display text-3xl font-bold text-center text-brand-dark mb-3">How it works</h2>
        <p className="text-center text-gray-400 text-sm mb-12">Same simple process — whether you sell products or offer services</p>
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

      {/* Dashboard Demo — Interactive Features Section */}
      <section id="features" className="py-20 px-4 bg-brand-dark">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-brand-accent text-xs font-bold uppercase tracking-widest mb-3">Your Business Dashboard</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything you need. Nothing you don't.
            </h2>
            <p className="text-white/50 text-sm max-w-xl mx-auto">
              A complete business operating system — built for real entrepreneurs. Click each feature to see it in action.
            </p>
          </div>

          {/* Dashboard Shell */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl shadow-black/40">

            {/* Dashboard top bar */}
            <div className="bg-brand-dark border-b border-white/10 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
                </div>
                <span className="text-white/40 text-xs font-mono">earket.com/dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-brand-green flex items-center justify-center text-white text-xs font-bold">J</div>
                <span className="text-white/60 text-xs font-medium hidden sm:block">JB Mart</span>
              </div>
            </div>

            <div className="flex min-h-[420px]">

              {/* Sidebar */}
              <DashboardDemo />

            </div>
          </div>

          <p className="text-center text-white/30 text-xs mt-6">
            This is your actual dashboard — available the moment you publish your store.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 px-4 max-w-5xl mx-auto">
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
            <div className="text-gray-500 text-sm mb-5">For every business</div>
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
              {["Professional page setup", "We photograph your products/services", "AI-written descriptions", "WhatsApp bot configured", "Payment setup", "Training session"].map((f, i) => (
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
              {["Everything in Setup", "Monthly product/service updates", "WhatsApp broadcast messages", "Performance report", "Priority support", "Promo graphics included"].map((f, i) => (
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
          <h2 className="font-display text-3xl font-bold text-center text-brand-dark mb-3">Businesses love Earket</h2>
          <p className="text-center text-gray-500 text-sm mb-12">Retailers and service providers across Africa and beyond</p>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-0.5">
                    {[...Array(t.stars)].map((_, j) => <Star key={j} size={14} className="text-brand-accent fill-brand-accent" />)}
                  </div>
                  <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded-full">{t.type}</span>
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
        <p className="text-brand-light mb-2 text-lg">Free forever. Live in 5 minutes. No tech skills needed.</p>
        <p className="text-white/60 text-sm mb-8">Retailers, service providers, tradespeople — everyone welcome.</p>
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
      <footer className="bg-brand-dark text-white">
        <div className="max-w-5xl mx-auto px-4 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

            {/* Brand */}
            <div className="md:col-span-2">
              <div className="text-2xl font-display font-bold text-white tracking-tight mb-2">Earket</div>
              <p className="text-white/45 text-sm leading-relaxed mb-5 max-w-xs">
                The fastest way for any business, anywhere in the world, to get online. Free forever. AI-powered. Live in minutes.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/30">A product of</span>
                <a href="https://intelsystechnology.com" target="_blank" rel="noopener noreferrer"
                   className="text-xs font-bold text-white/55 hover:text-brand-accent transition-colors tracking-wide uppercase">
                  IntelSys Technologies
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <div className="text-xs font-bold text-white/25 uppercase tracking-widest mb-4">Product</div>
              <ul className="space-y-3">
                <li><Link href="/onboarding" className="text-sm text-white/50 hover:text-white transition-colors">Start Free</Link></li>
                <li><Link href="/browse" className="text-sm text-white/50 hover:text-white transition-colors">Browse Stores</Link></li>
                <li><Link href="/login" className="text-sm text-white/50 hover:text-white transition-colors">Login</Link></li>
                <li><Link href="/dashboard" className="text-sm text-white/50 hover:text-white transition-colors">Dashboard</Link></li>
                <li><a href="#features" className="text-sm text-white/50 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-sm text-white/50 hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <div className="text-xs font-bold text-white/25 uppercase tracking-widest mb-4">Company</div>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-sm text-white/50 hover:text-white transition-colors">About Earket</Link></li>
                <li>
                  <a href="https://intelsystechnology.com" target="_blank" rel="noopener noreferrer"
                     className="text-sm text-white/50 hover:text-white transition-colors">
                    IntelSys Technologies
                  </a>
                </li>
                <li><Link href="/contact" className="text-sm text-white/50 hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/privacy" className="text-sm text-white/50 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-sm text-white/50 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8">
          <div className="max-w-5xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/22">
              © 2025 IntelSys Technologies. All rights reserved.
            </p>
            <div className="flex items-center gap-3 text-xs text-white/18">
              <span>AI-Powered</span>
              <span className="text-white/10">·</span>
              <span>Free Forever</span>
              <span className="text-white/10">·</span>
              <span>134 Countries</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
