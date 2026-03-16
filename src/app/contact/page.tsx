'use client'
import Link from 'next/link'
import { ShoppingBag, MessageCircle, Mail } from 'lucide-react'

export default function ContactPage() {
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
      <div className="max-w-lg mx-auto px-4 py-12">
        <h1 className="font-display text-3xl font-bold text-brand-dark mb-2">Contact Us</h1>
        <p className="text-gray-500 mb-10">We're here to help. Reach us on WhatsApp for the fastest response.</p>

        <div className="space-y-4">
          <a href="https://wa.me/2348000000000?text=Hi Earket, I need help with my store."
            target="_blank" rel="noreferrer"
            className="flex items-center gap-4 bg-[#25D366] text-white rounded-2xl p-5 hover:opacity-90 transition-opacity">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <MessageCircle size={24} />
            </div>
            <div>
              <div className="font-display font-bold text-lg">WhatsApp Support</div>
              <div className="text-sm opacity-80">Fastest response — usually within 1 hour</div>
            </div>
          </a>

          <a href="mailto:hello@earket.com"
            className="flex items-center gap-4 bg-brand-light border-2 border-brand-green/20 rounded-2xl p-5 hover:border-brand-green/40 transition-colors">
            <div className="w-12 h-12 bg-brand-green/10 rounded-xl flex items-center justify-center">
              <Mail size={24} className="text-brand-green" />
            </div>
            <div>
              <div className="font-display font-bold text-lg text-brand-dark">Email Us</div>
              <div className="text-sm text-gray-500">hello@earket.com</div>
            </div>
          </a>
        </div>

        <div className="mt-12 bg-gray-50 rounded-2xl p-6">
          <h2 className="font-display font-bold text-brand-dark mb-4">Interested in Premium Setup?</h2>
          <p className="text-gray-500 text-sm mb-4">
            Our team will build your full store for you — logo, branding, product photos, WhatsApp bot, and more.
          </p>
          <div className="flex gap-3">
            <div className="flex-1 bg-white rounded-xl p-3 border border-gray-200 text-center">
              <div className="font-display font-bold text-brand-dark text-xl">₦25,000</div>
              <div className="text-xs text-gray-400">One-time setup</div>
            </div>
            <div className="flex-1 bg-white rounded-xl p-3 border border-gray-200 text-center">
              <div className="font-display font-bold text-brand-dark text-xl">₦15,000</div>
              <div className="text-xs text-gray-400">Monthly managed</div>
            </div>
          </div>
          <a href="https://wa.me/2348000000000?text=Hi, I'm interested in the Premium Setup for my Earket store."
            target="_blank" rel="noreferrer"
            className="btn-whatsapp w-full justify-center mt-4">
            💬 Book a Setup Call
          </a>
        </div>
      </div>
    </div>
  )
}
