'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PhoneIcon, EnvelopeIcon, GlobeAltIcon } from '@heroicons/react/24/outline'

export function PSBHeader({ locale = 'id' }: { locale?: string }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [academicYear, setAcademicYear] = useState<string>('2024/2025')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const fetchHeader = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
        const res = await fetch(`${apiBase}/psb/header`, { signal: controller.signal })
        const json = await res.json()
        const yr = json?.data?.academic_year
        if (!isMounted) return
        if (typeof yr === 'string' && yr.trim()) {
          setAcademicYear(yr.trim())
        }
      } catch (e: any) {
        if (!isMounted) return
        if (e?.name === 'AbortError') return
      }
    }

    fetchHeader()
    return () => {
      isMounted = false
      controller.abort()
    }
  }, [])

  const content = {
    id: {
      home: 'Beranda',
      phone: '+62 812-3456-7890',
      email: 'info@nizamuddin.sch.id',
      tagline: `Pendaftaran Santri Baru Tahun Ajaran ${academicYear}`
    },
    en: {
      home: 'Home',
      phone: '+62 812-3456-7890',
      email: 'info@nizamuddin.sch.id',
      tagline: `New Student Registration ${academicYear} Academic Year`
    }
  }

  const t = content[locale as keyof typeof content] || content.id

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
    }`}>
      {/* Top Bar */}
      <div className="bg-emerald-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile: Stack vertically, Desktop: Side by side */}
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm gap-2 sm:gap-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm truncate">{t.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <EnvelopeIcon className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm truncate">{t.email}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-center sm:text-left">
              <GlobeAltIcon className="h-4 w-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium truncate">{t.tagline}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center space-x-2 flex-shrink-0">
              <div className="h-10 w-10 sm:h-12 sm:w-12 relative flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="Logo Pesantren Nizamuddin"
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    // Fallback jika logo tidak ada
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent) {
                      parent.innerHTML = '<div class="h-10 w-10 sm:h-12 sm:w-12 bg-primary-600 rounded-lg flex items-center justify-center"><span class="text-white font-bold text-sm sm:text-lg">PN</span></div>'
                    }
                  }}
                />
              </div>
              <div className="flex flex-col" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
                <span className="text-xs sm:text-sm font-bold leading-tight" style={{ 
                  background: 'linear-gradient(135deg, #0a0a0a 0%, #064e3b 50%, #065f46 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '0.5px',
                  fontWeight: '800',
                  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                }}>PONDOK PESANTREN</span>
                <span className="text-xs sm:text-sm font-bold leading-tight" style={{ 
                  background: 'linear-gradient(135deg, #065f46 0%, #064e3b 50%, #0a0a0a 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '0.5px',
                  fontWeight: '800',
                  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                }}>NIZAMUDDIN</span>
              </div>
            </Link>

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
              <Link 
                href={`/${locale}`} 
                className="text-gray-700 hover:text-emerald-600 transition-colors font-medium text-sm lg:text-base"
              >
                {t.home}
              </Link>
              <div className="bg-emerald-100 px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg">
                <span className="text-emerald-700 font-semibold text-sm lg:text-base">PSB {academicYear}</span>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button className="p-2 rounded-md text-gray-700 hover:text-emerald-600 hover:bg-gray-50 transition-colors">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
