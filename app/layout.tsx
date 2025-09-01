import type { Metadata } from 'next'
import { Geist, Geist_Mono, Lora, Google_Sans_Code } from 'next/font/google'
import '@/assets/styles/global.css'
import '@/assets/styles/scss/main.scss'
import Slider from '@/components/Slider'
import Footer from '@/components/Footer'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

const googleSansCode = Google_Sans_Code({
  variable: '--font-google-sans-code',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic']
})

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic']
})

export const metadata: Metadata = {
  title: 'Q2 Posts App',
  description: 'Q2 Posts App'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${googleSansCode.variable} ${lora.variable} antialiased`}
      >
        <Slider />
        <main className="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
