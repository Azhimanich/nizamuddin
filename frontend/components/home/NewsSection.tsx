'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRightIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export function NewsSection() {
  const [news, setNews] = useState<any[]>([])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/news?limit=3&priority=pinned`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setNews(data.data)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="section-title">Berita Terkini</h2>
            <p className="section-subtitle">
              Update terbaru dari kegiatan dan informasi pesantren
            </p>
          </div>
          <Link
            href="/berita"
            className="hidden md:flex items-center space-x-2 text-primary-600 font-semibold hover:text-primary-700"
          >
            <span>Lihat Semua</span>
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.length > 0 ? (
            news.map((item) => (
              <Link
                key={item.id}
                href={`/berita/${item.slug}`}
                className="card hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  {item.featured_image ? (
                    <img
                      src={item.featured_image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                      <span className="text-white text-4xl">📰</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>
                    {format(new Date(item.published_at || item.created_at), 'dd MMMM yyyy', {
                      locale: id,
                    })}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">{item.excerpt}</p>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-gray-500">
              Belum ada berita tersedia
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/berita"
            className="inline-flex items-center space-x-2 text-primary-600 font-semibold"
          >
            <span>Lihat Semua Berita</span>
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

