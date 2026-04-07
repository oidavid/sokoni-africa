'use client'
import { BookOpen, MessageCircle, Mail } from 'lucide-react'
import MerchantGuide from '@/components/MerchantGuide'

export default function HelpPage() {
  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display font-bold text-brand-dark text-xl mb-1">Help & Setup Guide</h1>
        <p className="text-sm text-gray-500">
          Everything you need to get your store live and start selling.
        </p>
      </div>

      {/* AI image alert — shown prominently at top */}
      <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
        <div className="shrink-0 w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 font-bold text-sm">!</div>
        <div>
          <p className="text-sm font-semibold text-amber-800 mb-0.5">Replace your AI-generated product images</p>
          <p className="text-xs text-amber-700">
            Your products currently show placeholder images. Tap <strong>Step 4</strong> in the guide below to learn how to replace them with your own photos.
          </p>
        </div>
      </div>

      {/* Guide */}
      <MerchantGuide compact />

      {/* Still stuck section */}
      <div className="mt-8 border-t border-gray-100 pt-6">
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
            href="mailto:contact@earket.com"
            className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl p-4 transition-colors"
          >
            <Mail size={20} className="text-gray-500 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-700">Email support</p>
              <p className="text-xs text-gray-400">contact@earket.com</p>
            </div>
          </a>
        </div>
      </div>

    </div>
  )
}
