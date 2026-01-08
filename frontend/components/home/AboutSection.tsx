'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

const defaultContent = {
  title: 'Tentang Kami',
  content: 'Pondok Pesantren kami adalah lembaga pendidikan Islam yang berkomitmen untuk mencetak generasi yang berakhlak mulia, berilmu, dan bermanfaat bagi umat. Dengan menggabungkan kurikulum modern dan tradisi pesantren, kami memberikan pendidikan yang holistik dan terpadu.\n\nVisi kami adalah menjadi pesantren terdepan dalam menghasilkan santri yang hafal Al-Quran, menguasai ilmu agama, dan berprestasi di bidang akademik.',
  cta_text: 'Pelajari Lebih Lanjut',
  cta_link: '/profil',
  image: null,
  video_url: null,
}

export function AboutSection({ locale = 'id' }: { locale?: string }) {
  const [about, setAbout] = useState(defaultContent)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
        // Add cache busting to ensure fresh data
        const response = await fetch(`${apiUrl}/about?locale=${locale}&t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
        if (response.ok) {
          const data = await response.json()
          if (data) {
            setAbout({
              title: data.title || defaultContent.title,
              content: data.content || defaultContent.content,
              cta_text: data.cta_text || defaultContent.cta_text,
              cta_link: data.cta_link || defaultContent.cta_link,
              image: data.image,
              video_url: data.video_url,
            })
          }
        }
      } catch (error) {
        console.error('Error fetching about section:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchAbout()
  }, [locale])

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="section-title">{about.title}</h2>
            <div className="text-gray-600 mb-8 leading-relaxed whitespace-pre-line">
              {about.content}
            </div>
            {about.cta_text && about.cta_link && (
              <Link
                href={`/${locale || 'id'}${about.cta_link}`}
                className="inline-flex items-center space-x-2 text-primary-600 font-semibold hover:text-primary-700"
              >
                <span>{about.cta_text}</span>
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
            )}
          </div>
          <div className="relative">
            <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
              {about.video_url ? (
                <iframe
                  src={about.video_url}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : about.image ? (
                <img
                  src={about.image}
                  alt={about.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                  <span className="text-white text-6xl">📚</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

