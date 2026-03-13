import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="px-4 h-14 flex items-center border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-green rounded-lg flex items-center justify-center">
            <ShoppingBag size={14} className="text-white" />
          </div>
          <span className="font-display font-bold text-brand-dark text-base">Sokoni Africa</span>
        </Link>
      </nav>
      <div className="max-w-2xl mx-auto px-4 py-12 prose prose-sm">
        <h1 className="font-display text-3xl font-bold text-brand-dark mb-2">Privacy Policy</h1>
        <p className="text-gray-400 text-sm mb-8">Last updated: January 2025</p>

        <h2>What we collect</h2>
        <p>When you create a store on Sokoni Africa, we collect your business name, WhatsApp number, business category, and location. We use this information only to create and operate your storefront.</p>

        <h2>How we use your data</h2>
        <p>Your data is used to generate and display your storefront, connect customers to you via WhatsApp, and improve our platform. We do not sell your data to third parties.</p>

        <h2>Customer data</h2>
        <p>When customers place orders through your WhatsApp button, they communicate directly with you via WhatsApp. We do not store customer order data on our servers.</p>

        <h2>Cookies</h2>
        <p>We use minimal cookies to keep the platform running. We do not use advertising or tracking cookies.</p>

        <h2>Data security</h2>
        <p>Your data is stored securely using Supabase, a secure cloud database provider. We use industry-standard encryption.</p>

        <h2>Your rights</h2>
        <p>You can request deletion of your store and all associated data at any time by contacting us on WhatsApp or via our contact page.</p>

        <h2>Contact us</h2>
        <p>For any privacy questions, <Link href="/contact" className="text-brand-green">contact us here</Link>.</p>
      </div>
    </div>
  )
}
