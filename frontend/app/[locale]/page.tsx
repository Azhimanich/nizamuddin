'use client'

import { Hero } from '@/components/home/Hero'
import { Announcements } from '@/components/home/Announcements'
import { NewsAgendaSection } from '@/components/home/NewsAgendaSection'
import { Programs } from '@/components/home/Programs'
import { NewsSection } from '@/components/home/NewsSection'
import { GalleryPreview } from '@/components/home/GalleryPreview'
import { Layout } from '@/components/layout/Layout'

export default function Home({ params }: { params: { locale: string } }) {
  const locale = params?.locale || 'id'
  
  return (
    <Layout locale={locale}>
      <div style={{ paddingTop: '100px' }}>
        <Hero locale={locale} />
        <Announcements />
        <NewsAgendaSection locale={locale} />
        <Programs />
        <GalleryPreview />
      </div>
    </Layout>
  )
}
