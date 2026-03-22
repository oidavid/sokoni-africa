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
  title: 'Earket — Your Business, Online',
  description: 'Build your free business page in 5 minutes. Sell products or offer services. Customers order and book via WhatsApp. Works on any phone, anywhere in the world.',
  keywords: [
    'online store Nigeria', 'service business online Africa', 'WhatsApp shop',
    'sell online Nigeria', 'book services online Kenya', 'free business page Africa',
    'WhatsApp ordering', 'service provider online', 'emerging markets ecommerce',
  ],
  openGraph: {
    title: 'Earket — Your Business, Online',
    description: 'Sell products or offer services. Free forever. Live in 5 minutes.',
    type: 'website',
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
