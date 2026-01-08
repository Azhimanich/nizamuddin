'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

export function Footer({ locale = 'id' }: { locale?: string }) {
  const [contactInfo, setContactInfo] = useState<any>({})

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
        const response = await fetch(`${apiUrl}/contact-information?locale=${locale}`)
        if (response.ok) {
          const data = await response.json()
          // Convert array to object for easier access
          const infoObj: any = {}
          data.forEach((item: any) => {
            infoObj[item.type] = item.value
          })
          setContactInfo(infoObj)
        }
      } catch (error) {
        console.error('Error fetching contact information:', error)
      }
    }
    fetchContactInfo()
  }, [locale])

  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Pesantren Nizamuddin</h3>
            <p className="text-gray-400 text-sm">
              Mencerdaskan umat melalui pendidikan Islam yang berkualitas dan terpadu.
            </p>
          </div>
          
          <div>
            <h4 className="text-base font-semibold mb-4">Tautan Cepat</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/profil`} className="text-gray-400 hover:text-white">Profil</Link></li>
              <li><Link href={`/${locale}/akademik`} className="text-gray-400 hover:text-white">Akademik</Link></li>
              <li><Link href={`/${locale}/berita`} className="text-gray-400 hover:text-white">Berita</Link></li>
              <li><Link href={`/${locale}/galeri`} className="text-gray-400 hover:text-white">Galeri</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-base font-semibold mb-4">Informasi</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/download`} className="text-gray-400 hover:text-white">Download</Link></li>
              <li><Link href={`/${locale}/kontak`} className="text-gray-400 hover:text-white">Kontak</Link></li>
              <li><Link href={`/${locale}/akademik#kalender-akademik`} className="text-gray-400 hover:text-white">Kalender Akademik</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-base font-semibold mb-4">Kontak</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {contactInfo.address && (
                <li className="flex items-start space-x-2">
                  <MapPinIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span className="whitespace-pre-line">{contactInfo.address}</span>
                </li>
              )}
              {contactInfo.phone && (
                <li className="flex items-center space-x-2">
                  <PhoneIcon className="h-5 w-5 flex-shrink-0" />
                  <a href={`tel:${contactInfo.phone}`} className="hover:text-white transition-colors">
                    {contactInfo.phone}
                  </a>
                </li>
              )}
              {contactInfo.email && (
                <li className="flex items-center space-x-2">
                  <EnvelopeIcon className="h-5 w-5 flex-shrink-0" />
                  <a href={`mailto:${contactInfo.email}`} className="hover:text-white transition-colors">
                    {contactInfo.email}
                  </a>
                </li>
              )}
              {!contactInfo.address && !contactInfo.phone && !contactInfo.email && (
                <>
                  <li className="flex items-center space-x-2">
                    <MapPinIcon className="h-5 w-5" />
                    <span>Jl. Pesantren No. 123, Jakarta</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <PhoneIcon className="h-5 w-5" />
                    <span>+62 123 456 789</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <EnvelopeIcon className="h-5 w-5" />
                    <span>info@pesantren.com</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Nizamuddin. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

