'use client'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, Info, BookOpen } from 'lucide-react'

const steps = [
  {
    label: 'Create account',
    icon: '1',
    title: 'Create your Earket account',
    badge: null,
    actions: [
      { text: 'Go to earket.com and tap Sign Up', note: 'Use the email address you check regularly' },
      { text: 'Enter your business name, email and create a password', note: 'Your business name becomes part of your store link — e.g. earket.com/mybusiness' },
      { text: 'Check your email for a confirmation link and tap it', note: 'Check your spam folder if you don\'t see it within 2 minutes' },
    ],
    tip: 'Use a name your customers already know you by — it makes your link easy to share.',
    warning: null,
    alert: null,
    mock: null,
  },
  {
    label: 'Store setup',
    icon: '2',
    title: 'Set up your store profile',
    badge: null,
    actions: [
      { text: 'Go to Dashboard → Settings → Brand tab', note: 'Upload your logo and choose your store colours' },
      { text: 'Go to Business tab — write what you sell in 1–2 sentences', note: 'This is the first thing customers read when they visit your store' },
      { text: 'Go to Social tab — enter your WhatsApp number with country code', note: 'Example: +2348012345678 for Nigeria. This is how customers reach you.' },
      { text: 'Go to Hours tab — set when you are open', note: 'Customers see this on your storefront' },
    ],
    tip: 'A complete profile gets 3× more enquiries. Never leave your description empty.',
    warning: null,
    alert: null,
    mock: {
      title: 'Example — how customers see your profile',
      rows: [
        { label: 'Business', value: 'Adaeze Fashion House' },
        { label: 'Description', value: 'Quality ankara fabrics and ready-to-wear outfits. Delivery available Lagos-wide.' },
        { label: 'WhatsApp', value: '+2348012345678' },
        { label: 'Hours', value: 'Mon–Sat, 8am–7pm' },
      ],
    },
  },
  {
    label: 'Add products',
    icon: '3',
    title: 'Add your first product',
    badge: null,
    actions: [
      { text: 'Go to Dashboard → Products → tap Add Product', note: '' },
      { text: 'Enter the product name and write a short description', note: 'Say what it is, what it is made of, and who it is for' },
      { text: 'Upload your own photo — tap the photo box and choose from your phone', note: 'Use a clear, bright photo in good natural light. Your real photo always performs better than a generated one.' },
      { text: 'Set your price and select your currency', note: 'Currency defaults to your country but you can change it' },
      { text: 'Add variants if needed — tap Add Variant', note: 'Example: Size → S, M, L, XL  or  Colour → Red, Blue, Black. Each variant can have its own price.' },
      { text: 'Enter your stock quantity and tap Save', note: '' },
    ],
    tip: 'Add at least 3 products before sharing your store link — an empty store loses customers.',
    warning: null,
    alert: null,
    mock: null,
  },
  {
    label: 'Fix AI images',
    icon: '!',
    title: 'How to replace the AI-generated images',
    badge: 'Most asked',
    actions: [
      { text: 'When you first set up, Earket adds placeholder AI-generated images to your products', note: 'These are temporary. Customers will notice they are not real photos of your products.' },
      { text: 'Go to Dashboard → Products — you will see all your products listed', note: '' },
      { text: 'Tap the product name to open it for editing', note: '' },
      { text: 'Tap the image — a Replace Photo option will appear', note: 'You can also tap the trash icon to remove the AI image first, then upload your own' },
      { text: 'Choose a photo from your phone gallery or take a new one', note: 'Near a window in natural light gives the best result' },
      { text: 'Tap Save — your real photo is now live on your storefront', note: 'Repeat this for every product that still shows an AI image' },
    ],
    tip: 'Real photos of your actual products build trust and get more orders. This is the single most important thing you can do after setup.',
    warning: 'Customers who see AI placeholder images often think the store is not genuine. Replace them as soon as possible.',
    alert: null,
    mock: {
      title: 'What you see on the Products page',
      rows: [
        { label: '[ placeholder image ]', value: 'Ankara dress — tap the product name to edit →' },
        { label: '[ placeholder image ]', value: 'Headtie set — tap the product name to edit →' },
        { label: '[ placeholder image ]', value: 'Blouse — tap the product name to edit →' },
      ],
      note: 'Tap any product row → scroll down → tap the image → Replace Photo',
    },
  },
  {
    label: 'Inventory',
    icon: '5',
    title: 'Managing your inventory and stock',
    badge: null,
    actions: [
      { text: 'Dashboard → Products is your inventory list', note: 'See all products, prices, and stock levels at a glance' },
      { text: 'To update stock — tap a product → change the Quantity → tap Save', note: 'Do this whenever you restock or sell out' },
      { text: 'To mark out of stock — set the quantity to 0', note: 'Customers will see Out of stock and cannot order until you update it' },
      { text: 'To edit a price — tap the product → change the price → tap Save', note: 'Price changes apply immediately to your storefront' },
      { text: 'To remove a product — tap the product → scroll down → tap Delete', note: 'You can always add it back later' },
      { text: 'To add a new product — tap Add Product at the top of the Products page', note: '' },
    ],
    tip: 'Check your inventory at least once a week. Nothing loses a customer faster than ordering something that turns out to be out of stock.',
    warning: null,
    alert: null,
    mock: {
      title: 'Products page — what you see',
      rows: [
        { label: 'Ankara dress', value: '₦12,500 · 5 in stock · Live' },
        { label: 'Headtie set', value: '₦4,000 · 0 in stock · Out of stock' },
        { label: 'Blouse', value: '₦8,000 · 12 in stock · Live' },
      ],
    },
  },
  {
    label: 'Share your store',
    icon: '6',
    title: 'Share your store and get customers',
    badge: null,
    actions: [
      { text: 'Your store is live at earket.com/[your-handle]', note: 'Find your exact link in Dashboard → Settings → Account tab' },
      { text: 'Copy your link and add it to your WhatsApp status right now', note: 'This is the fastest way to get your first customers today' },
      { text: 'Add it to your Instagram bio and Facebook page', note: '' },
      { text: 'Share in your customer WhatsApp groups with a short message', note: 'Try: "My shop is now online — browse and order here: earket.com/yourname"' },
    ],
    tip: 'Want a shorter branded link like earket.com/go/yourname? Join the Pro waitlist on your dashboard — it\'s free.',
    warning: null,
    alert: null,
    mock: null,
  },
  {
    label: 'Orders & payment',
    icon: '7',
    title: 'Managing orders and getting paid',
    badge: null,
    actions: [
      { text: 'When a customer orders you get an alert by email and WhatsApp', note: 'Make sure your WhatsApp number is saved correctly in Settings → Social' },
      { text: 'Go to Dashboard → Orders to see all your orders', note: '' },
      { text: 'Tap an order to see what was ordered and the customer\'s contact details', note: '' },
      { text: 'Update the status as you process: Confirmed → Packed → Dispatched → Delivered', note: 'Customers can see this — it builds trust and reduces support messages' },
      { text: 'Add your bank details in Settings → Account to receive online payments', note: 'Payouts arrive within 1–3 business days' },
    ],
    tip: 'Reply to every order within 1 hour. Fast sellers get more repeat customers.',
    warning: 'Cash-on-delivery orders still appear in your Orders tab. Mark them as Delivered once you collect payment.',
    alert: null,
    mock: null,
  },
]

export default function MerchantGuide({ compact = false }: { compact?: boolean }) {
  const [cur, setCur] = useState(0)
  const step = steps[cur]

  return (
    <div className={compact ? 'w-full' : 'max-w-2xl mx-auto'}>
      {/* Step nav pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => setCur(i)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              i === cur
                ? 'bg-brand-green text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
              i === cur ? 'bg-white text-brand-green' : 'bg-gray-300 text-gray-600'
            }`}>
              {s.icon === '!' ? '!' : i + 1}
            </span>
            {s.label}
            {s.badge && (
              <span className="bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {s.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <h2 className="font-display font-bold text-brand-dark text-base leading-snug">{step.title}</h2>
          {step.badge && (
            <span className="ml-2 shrink-0 bg-red-50 text-red-600 text-[11px] px-2 py-1 rounded-lg font-semibold">
              {step.badge}
            </span>
          )}
        </div>

        {/* Actions */}
        <ol className="space-y-3 mb-4">
          {step.actions.map((a, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 w-6 h-6 shrink-0 rounded-full bg-brand-light text-brand-green text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <div>
                <p className="text-sm text-gray-800 leading-relaxed">{a.text}</p>
                {a.note && <p className="text-xs text-gray-400 mt-0.5">{a.note}</p>}
              </div>
            </li>
          ))}
        </ol>

        {/* Mock screen */}
        {step.mock && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-4">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">{step.mock.title}</p>
            <div className="space-y-1.5">
              {step.mock.rows.map((r, i) => (
                <div key={i} className="flex gap-2 text-xs">
                  <span className="text-gray-400 w-36 shrink-0">{r.label}</span>
                  <span className="text-gray-700">{r.value}</span>
                </div>
              ))}
            </div>
            {step.mock.note && (
              <p className="mt-2 text-xs text-brand-green font-medium">→ {step.mock.note}</p>
            )}
          </div>
        )}

        {/* Tip */}
        {step.tip && (
          <div className="flex gap-2 bg-green-50 text-green-700 rounded-xl p-3 text-xs mb-2">
            <CheckCircle size={14} className="shrink-0 mt-0.5" />
            <span>{step.tip}</span>
          </div>
        )}

        {/* Warning */}
        {step.warning && (
          <div className="flex gap-2 bg-amber-50 text-amber-700 rounded-xl p-3 text-xs">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            <span>{step.warning}</span>
          </div>
        )}
      </div>

      {/* Prev / Next */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setCur(c => Math.max(0, c - 1))}
          disabled={cur === 0}
          className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 disabled:opacity-30 transition-colors"
        >
          <ChevronLeft size={15} /> Back
        </button>
        <span className="text-xs text-gray-400">Step {cur + 1} of {steps.length}</span>
        <button
          onClick={() => setCur(c => Math.min(steps.length - 1, c + 1))}
          disabled={cur === steps.length - 1}
          className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-brand-green hover:bg-brand-dark disabled:opacity-30 transition-colors"
        >
          Next <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}
