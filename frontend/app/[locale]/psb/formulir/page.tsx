'use client'

import { PSBFormHeader } from '@/components/psb/PSBFormHeader'
import { Footer } from '@/components/layout/Footer'
import { PSBRegistration } from '@/components/psb/PSBRegistration'

export default function PSBFormPage({ params }: { params: { locale: string } }) {
  const locale = params?.locale || 'id'
  
  return (
    <div className="min-h-screen bg-gray-50">
      <PSBFormHeader locale={locale} />
      <main>
        <PSBRegistration locale={locale} />
      </main>
      <Footer locale={locale} />
    </div>
  )
}
