'use client'

import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

const defaultSlides = [
  {
    id: 1,
    title: 'Selamat Datang di Pondok Pesantren',
    subtitle: 'Mencerdaskan Umat Melalui Pendidikan Islam',
    image: null,
    cta_text: 'Pelajari Lebih Lanjut',
    cta_link: '/profil',
  },
  {
    id: 2,
    title: 'Program Unggulan Tahfidz Al-Quran',
    subtitle: 'Menghafal Al-Quran dengan Metode Terbaik',
    image: null,
    cta_text: 'Lihat Program',
    cta_link: '/akademik',
  },
  {
    id: 3,
    title: 'Pendidikan Terpadu',
    subtitle: 'Menggabungkan Kurikulum Diknas dan Kitab Kuning',
    image: null,
    cta_text: 'Daftar Sekarang',
    cta_link: '/pmb',
  },
]

export function Hero({ locale = 'id' }: { locale?: string }) {
  const [slides, setSlides] = useState(defaultSlides)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
        const response = await fetch(`${apiUrl}/sliders?locale=${locale}`)
        if (response.ok) {
          const data = await response.json()
          if (data && data.length > 0) {
            setSlides(data)
          }
        }
      } catch (error) {
        console.error('Error fetching sliders:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchSliders()
  }, [locale])

  useEffect(() => {
    if (slides.length === 0) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((currentSlide + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((currentSlide - 1 + slides.length) % slides.length)
  }

  return (
    <div className="relative h-screen w-full overflow-hidden mt-16">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === currentSlide 
              ? 'opacity-100 scale-100 z-10' 
              : 'opacity-0 scale-105 z-0 pointer-events-none'
          }`}
        >
          <div
            className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 transition-transform duration-700 ease-in-out"
            style={{
              backgroundImage: slide.image ? `url(${slide.image})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: index === currentSlide ? 'scale(1)' : 'scale(1.05)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 transition-opacity duration-700" />
          </div>
          <div className="relative h-full flex items-center justify-center">
            <div 
              className={`text-center text-white px-4 max-w-4xl transition-all duration-700 ease-in-out ${
                index === currentSlide 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4'
              }`}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-4">
                {slide.title}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-200">
                {slide.subtitle}
              </p>
              {slide.cta_text && slide.cta_link && (
                <Link
                  href={`/${locale || 'id'}${slide.cta_link}`}
                  className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0"
                >
                  {slide.cta_text}
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
        aria-label="Next slide"
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

