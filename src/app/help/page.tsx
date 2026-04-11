import MerchantGuide from '@/components/MerchantGuide'
import Link from 'next/link'
import { ShoppingBag, ArrowRight, MessageCircle, Mail } from 'lucide-react'

export const metadata = {
  title: 'Merchant Help & Setup Guide — Earket',
  description: 'Step-by-step guide to setting up your Earket store, adding products, replacing AI images, managing inventory, and getting paid.',
}

export default function HelpPublicPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Simple public header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-green rounded-lg flex items-center justify-center">
              <ShoppingBag size={14} className="text-white" />
            </div>
            <span className="font-display font-bold text-brand-dark text-sm">Earket</span>
            <span className="text-gray-300 text-sm mx-1">/</span>
            <span className="text-sm text-gray-500">Help</span>
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-green bg-brand-light px-3 py-2 rounded-xl hover:bg-brand-green hover:text-white transition-colors"
          >
            Go to dashboard <ArrowRight size={12} />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-10 text-center">
          <h1 className="font-display font-bold text-brand-dark text-2xl mb-2">
            Earket Merchant Setup Guide
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Follow these steps to set up your store, add your products, and start selling — in under 30 minutes.
          </p>
        </div>
      </div>

      {/* AI image callout */}
      <div className="max-w-2xl mx-auto px-4 mt-6">
        <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="shrink-0 w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 font-bold text-sm">!</div>
          <div>
            <p className="text-sm font-semibold text-amber-800 mb-0.5">Seeing AI-generated images on your store?</p>
            <p className="text-xs text-amber-700">
              Those are temporary placeholders. Tap <strong>Step 4 — Fix AI images</strong> in the guide below to replace them with your own photos in under 2 minutes.
            </p>
          </div>
        </div>
      </div>

      {/* Guide */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <MerchantGuide />
      </div>

      {/* Support section */}
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">Still need help?</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="https://wa.me/14793219433"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-2xl p-4 transition-colors"
            >
              <MessageCircle size={20} className="text-green-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-800">WhatsApp support</p>
                <p className="text-xs text-green-600">Chat with us directly</p>
              </div>
            </a>
            <a
              href="mailto:earket@earket.com"
              className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl p-4 transition-colors"
            >
              <Mail size={20} className="text-gray-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-700">Email support</p>
                <p className="text-xs text-gray-400">earket@earket.com</p>
              </div>
            </a>
          </div>
        </div>

        <p className="text-center text-xs text-gray-300 mt-6">
          © {new Date().getFullYear()} Earket · Built by IntelSys Technologies
        </p>
      </div>

    </div>
  )
}
