import type { Metadata } from 'next'
import { Sora, DM_Sans } from 'next/font/google'
import './globals.css'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Earket — Any Business. Any Country. Online Today.',
  description: 'Create your free professional business store in minutes. No tech skills. No cost. AI-powered. Works in 134 countries. A product of IntelSys Technologies.',
  keywords: [
    'free online store', 'free business page', 'sell online free',
    'WhatsApp shop', 'online store Nigeria', 'service business online Africa',
    'sell online Kenya', 'free business website', 'emerging markets ecommerce',
    'AI business page', 'online store no cost', 'IntelSys Technologies',
  ],
  openGraph: {
    title: 'Earket — Any Business. Any Country. Online Today.',
    description: 'The fastest way for any business, anywhere in the world, to get online. Free forever. AI-powered. Live in minutes.',
    type: 'website',
    url: 'https://earket.com',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${dmSans.variable}`}>
      <body className="font-body bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
