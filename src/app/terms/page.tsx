import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="px-4 h-14 flex items-center border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-green rounded-lg flex items-center justify-center">
            <ShoppingBag size={14} className="text-white" />
          </div>
          <span className="font-display font-bold text-brand-dark text-base">Earket</span>
        </Link>
      </nav>
      <div className="max-w-2xl mx-auto px-4 py-12 prose prose-sm">
        <h1 className="font-display text-3xl font-bold text-brand-dark mb-2">Terms of Service</h1>
        <p className="text-gray-400 text-sm mb-8">Last updated: January 2025</p>

        <h2>1. Acceptance</h2>
        <p>By creating a store on Earket, you agree to these terms. If you do not agree, please do not use the platform.</p>

        <h2>2. Your store</h2>
        <p>You are responsible for the content you publish on your storefront, including product listings, prices, and descriptions. You must not list illegal products or services.</p>

        <h2>3. Free plan</h2>
        <p>The free plan is available indefinitely at no cost. We reserve the right to introduce limits on the free plan with 30 days notice.</p>

        <h2>4. WhatsApp ordering</h2>
        <p>Orders placed through your WhatsApp button are transactions between you and your customers. Earket is not a party to any transaction and accepts no liability for disputes between merchants and customers.</p>

        <h2>5. Platform availability</h2>
        <p>We aim for high availability but do not guarantee 100% uptime. We are not liable for any loss arising from platform downtime.</p>

        <h2>6. Termination</h2>
        <p>We reserve the right to suspend or delete stores that violate these terms. You may delete your store at any time.</p>

        <h2>7. Changes</h2>
        <p>We may update these terms. Continued use of the platform after changes means you accept the new terms.</p>

        <h2>Contact</h2>
        <p>Questions? <Link href="/contact" className="text-brand-green">Contact us here</Link>.</p>
      </div>
    </div>
  )
}
