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
  title: 'Earket — Your Market, Online',
  description: 'Build your free online store in 5 minutes. Made for Nigerian traders. Works on any phone, any connection.',
  keywords: ['online store Nigeria', 'free shop Nigeria', 'WhatsApp shop', 'sell online Nigeria', 'Lagos market online'],
  openGraph: {
    title: 'Earket',
    description: 'Your market, online. Free forever.',
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
