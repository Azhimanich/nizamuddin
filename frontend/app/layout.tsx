import type { Metadata } from 'next'
import { Inter, Cairo } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const cairo = Cairo({ 
  subsets: ['latin', 'arabic'],
  variable: '--font-cairo',
})

export const metadata: Metadata = {
  title: 'Pondok Pesantren Nizamuddin',
  description: 'Website resmi Pondok Pesantren Nizamuddin',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${inter.variable} ${cairo.variable}`}>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
