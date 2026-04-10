import Link from 'next/link'

export const metadata = {
  title: 'About Earket — Our Story',
  description: 'Earket helps businesses in emerging markets get online in minutes. Free forever. Built by IntelSys Technologies.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-display font-bold text-xl text-brand-dark">Earket</Link>
          <div className="flex items-center gap-4">
            <Link href="/browse" className="text-sm font-medium text-gray-500 hover:text-brand-green transition-colors">Browse Stores</Link>
            <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-brand-green transition-colors">Login</Link>
            <Link href="/onboarding" className="bg-brand-green text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-brand-dark transition-colors">
              Start Free →
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-16">

        {/* Hero */}
        <div className="mb-14">
          <div className="inline-block text-xs font-bold text-brand-green bg-brand-light px-3 py-1.5 rounded-full uppercase tracking-widest mb-4">
            Our Story
          </div>
          <h1 className="font-display font-bold text-4xl text-brand-dark leading-tight mb-4">
            We believe every business deserves to be online.
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            No matter where you are, what you sell, or how tech-savvy you are — your business deserves a professional online presence. That's why we built Earket.
          </p>
        </div>

        {/* Story */}
        <div className="prose prose-gray max-w-none mb-14">
          <h2 className="font-display font-bold text-2xl text-brand-dark mb-4">The problem we're solving</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Millions of businesses across emerging markets — in Nigeria, Ghana, Kenya, and beyond — operate entirely through WhatsApp, word of mouth, and personal referrals. They're real businesses, with real customers, real products, and real services. But they're invisible online.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Existing e-commerce platforms are built for Western markets — they require credit cards, technical knowledge, expensive monthly subscriptions, and complex setups. A market trader in Lagos or a hair salon in Accra shouldn't need all of that just to take orders online.
          </p>
          <p className="text-gray-600 leading-relaxed mb-8">
            Earket was built to fix this. Get your business online in under 5 minutes. Share your store link on WhatsApp. Let customers order, book, or reach you directly. No credit card. No tech skills. Free forever.
          </p>

          <h2 className="font-display font-bold text-2xl text-brand-dark mb-4">Who we are</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Earket is built and maintained by <a href="https://intelsystechnology.com" target="_blank" rel="noopener noreferrer" className="text-brand-green font-medium hover:underline">IntelSys Technologies</a>, a technology company focused on building practical, AI-powered products for businesses in emerging markets.
          </p>
          <p className="text-gray-600 leading-relaxed mb-8">
            We are a lean team of builders, designers, and strategists who believe technology should unlock opportunity — not create barriers to it.
          </p>

          <h2 className="font-display font-bold text-2xl text-brand-dark mb-4">Our mission</h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            To give every business — regardless of size, location, or technical ability — the tools to sell, grow, and thrive online. Starting in Africa. Built for the world.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-14">
          {[
            { value: '90+', label: 'Merchants live' },
            { value: '134', label: 'Countries supported' },
            { value: '5 min', label: 'To go live' },
          ].map(stat => (
            <div key={stat.label} className="bg-brand-light rounded-2xl p-5 text-center">
              <div className="font-display font-bold text-2xl text-brand-green mb-1">{stat.value}</div>
              <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Built by */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-14">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Built by</p>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="font-display font-bold text-brand-dark text-lg">IntelSys Technologies</p>
              <p className="text-sm text-gray-500 mt-0.5">AI consulting, product development, and digital transformation</p>
            </div>
            <a href="https://intelsystechnology.com" target="_blank" rel="noopener noreferrer"
              className="text-sm font-semibold text-brand-green hover:underline">
              intelsystechnology.com →
            </a>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-brand-dark rounded-2xl p-10">
          <h2 className="font-display font-bold text-2xl text-white mb-2">Ready to get your business online?</h2>
          <p className="text-white/60 text-sm mb-6">Free forever. Live in 5 minutes. No credit card needed.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/onboarding"
              className="bg-brand-green text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-brand-green/90 transition-colors">
              Start your free store →
            </Link>
            <Link href="/contact"
              className="border border-white/20 text-white font-medium px-6 py-3 rounded-xl text-sm hover:bg-white/10 transition-colors">
              Contact us
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-16">
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">© 2025 IntelSys Technologies. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <Link href="/privacy" className="hover:text-gray-600">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-600">Terms of Service</Link>
            <Link href="/contact" className="hover:text-gray-600">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
