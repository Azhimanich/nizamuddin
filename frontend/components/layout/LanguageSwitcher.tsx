'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { GlobeAltIcon } from '@heroicons/react/24/outline'

const languages = [
  { code: 'id', name: 'ID', flag: '🇮🇩' },
  { code: 'en', name: 'EN', flag: '🇬🇧' },
  { code: 'ar', name: 'AR', flag: '🇸🇦' },
]

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const currentLang = pathname.split('/')[1] || 'id'

  const changeLanguage = (lang: string) => {
    // Extract current path without locale
    const pathWithoutLocale = pathname.replace(/^\/(id|en|ar)/, '') || ''
    const newPath = `/${lang}${pathWithoutLocale || ''}`
    router.push(newPath)
    setIsOpen(false)
  }

  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
          aria-label="Change language"
        >
          <GlobeAltIcon className="h-5 w-5" />
          <span>{currentLanguage.flag}</span>
        </button>
        
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl overflow-hidden min-w-[120px] z-50">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center space-x-2 ${
                    currentLang === lang.code ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

