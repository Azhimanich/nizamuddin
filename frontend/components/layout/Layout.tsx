'use client'

import { Header } from './Header'
import { Footer } from './Footer'
import { LanguageSwitcher } from './LanguageSwitcher'

interface LayoutProps {
  children: React.ReactNode
  locale?: string
  hideHeader?: boolean
}

export function Layout({ 
  children, 
  locale = 'id',
  hideHeader = false
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {hideHeader ? null : <Header locale={locale} />}
      <main className="flex-grow relative">
        {/* Semi-transparent overlay for better content readability */}
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm"></div>
        <div className="relative z-10">
          {children}
        </div>
      </main>
      <Footer locale={locale} />
      <LanguageSwitcher />
    </div>
  )
}

