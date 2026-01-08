'use client'

import { useState } from 'react'
import { PSBHeader } from '@/components/psb/PSBHeader'
import { PSBFooter } from '@/components/psb/PSBFooter'
import { PSBHero } from '@/components/psb/PSBHero'
import { PSBInfo } from '@/components/psb/PSBInfo'
import { PSBRequirements } from '@/components/psb/PSBRequirements'
import { PSBFaq } from '@/components/psb/PSBFaq'

export default function PSBPage({ params }: { params: { locale: string } }) {
  const locale = params?.locale || 'id'
  
  return (
    <div className="min-h-screen bg-gray-50">
      <PSBHeader locale={locale} />
      <main>
        <PSBHero locale={locale} />
        <PSBInfo locale={locale} />
        <PSBRequirements locale={locale} />
        <PSBFaq locale={locale} />
      </main>
      <PSBFooter locale={locale} />
    </div>
  )
}
