'use client'

import { useState } from 'react'
import { PSBHeader } from '@/components/psb/PSBHeader'
import { Footer } from '@/components/layout/Footer'
import { PSBHero } from '@/components/psb/PSBHero'
import { PSBRequirements } from '@/components/psb/PSBRequirements'
import { PSBFaq } from '@/components/psb/PSBFaq'

export default function PSBPage({ params }: { params: { locale: string } }) {
  const locale = params?.locale || 'id'
  
  return (
    <div className="min-h-screen bg-gray-50">
      <PSBHeader locale={locale} />
      <main>
        <PSBHero locale={locale} />
        <PSBRequirements locale={locale} />
        <PSBFaq locale={locale} />
      </main>
      <Footer locale={locale} />
    </div>
  )
}
