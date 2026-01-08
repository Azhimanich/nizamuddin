import { Inter, Cairo } from 'next/font/google'
import '../globals.css'
import { Providers } from '../providers'
import { generateMetadata } from './metadata'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' })

export { generateMetadata }

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const locale = params?.locale || 'id'

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body className={`${inter.variable} ${cairo.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

