'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon, 
  ClockIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  ShareIcon
} from '@heroicons/react/24/outline'

export function PSBFooter({ locale = 'id' }: { locale?: string }) {
  const [email, setEmail] = useState('')

  const content = {
    id: {
      description: 'Pondok Pesantren Nizamuddin adalah lembaga pendidikan Islam yang berkomitmen untuk mencetak generasi yang cerdas, berakhlak mulia, dan berwawasan global.',
      quickLinks: 'Link Cepat',
      links: [
        { name: 'Beranda', href: '/' },
        { name: 'Tentang Kami', href: '/profil' },
        { name: 'Program Akademik', href: '/akademik' },
        { name: 'Galeri', href: '/galeri' },
        { name: 'Kontak', href: '/kontak' }
      ],
      psbInfo: 'Info PSB',
      psbLinks: [
        { name: 'Panduan Pendaftaran', href: '#' },
        { name: 'Persyaratan', href: '#' },
        { name: 'Biaya Pendidikan', href: '#' },
        { name: 'FAQ', href: '#' },
        { name: 'Hubungi Admin', href: '#' }
      ],
      contact: 'Kontak Kami',
      office: 'Kantor PSB',
      officeHours: 'Jam Kerja',
      hours: 'Senin - Jumat: 08:00 - 16:00',
      weekend: 'Sabtu: 08:00 - 12:00',
      newsletter: 'Newsletter',
      newsletterDesc: 'Dapatkan informasi terbaru tentang pendaftaran dan kegiatan pesantren',
      subscribeButton: 'Berlangganan',
      subscribeSuccess: 'Terima kasih telah berlangganan!',
      copyright: '© 2024 Pondok Pesantren Nizamuddin. Hak Cipta Dilindungi.',
      privacy: 'Kebijakan Privasi',
      terms: 'Syarat & Ketentuan'
    },
    en: {
      description: 'Nizamuddin Islamic Boarding School is an Islamic educational institution committed to producing intelligent, virtuous, and globally-minded generations.',
      quickLinks: 'Quick Links',
      links: [
        { name: 'Home', href: '/' },
        { name: 'About Us', href: '/profil' },
        { name: 'Academic Programs', href: '/akademik' },
        { name: 'Gallery', href: '/galeri' },
        { name: 'Contact', href: '/kontak' }
      ],
      psbInfo: 'PSB Info',
      psbLinks: [
        { name: 'Registration Guide', href: '#' },
        { name: 'Requirements', href: '#' },
        { name: 'Education Costs', href: '#' },
        { name: 'FAQ', href: '#' },
        { name: 'Contact Admin', href: '#' }
      ],
      contact: 'Contact Us',
      office: 'PSB Office',
      officeHours: 'Office Hours',
      hours: 'Monday - Friday: 08:00 - 16:00',
      weekend: 'Saturday: 08:00 - 12:00',
      newsletter: 'Newsletter',
      newsletterDesc: 'Get the latest information about registration and pesantren activities',
      subscribeButton: 'Subscribe',
      subscribeSuccess: 'Thank you for subscribing!',
      copyright: '© 2024 Nizamuddin Islamic Boarding School. All Rights Reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms & Conditions'
    }
  }

  const t = content[locale as keyof typeof content] || content.id

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    alert(t.subscribeSuccess)
    setEmail('')
  }

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <AcademicCapIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Nizamuddin</h3>
                <p className="text-xs text-gray-400">PSB Online</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {t.description}
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <ShareIcon className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <ShareIcon className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <ShareIcon className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <GlobeAltIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t.quickLinks}</h4>
            <ul className="space-y-2">
              {t.links.map((link, index) => (
                <li key={index}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* PSB Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t.psbInfo}</h4>
            <ul className="space-y-2">
              {t.psbLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t.contact}</h4>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <PhoneIcon className="h-5 w-5 text-primary-400 mr-3 flex-shrink-0" />
                <span className="text-gray-300 text-sm">+62 812-3456-7890</span>
              </div>
              <div className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 text-primary-400 mr-3 flex-shrink-0" />
                <span className="text-gray-300 text-sm">pmb@nizamuddin.sch.id</span>
              </div>
              <div className="flex items-center">
                <MapPinIcon className="h-5 w-5 text-primary-400 mr-3 flex-shrink-0" />
                <span className="text-gray-300 text-sm">Jl. Pesantren No. 1, Jakarta</span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-primary-400 mr-3 flex-shrink-0" />
                <div>
                  <div className="text-gray-300 text-sm">{t.hours}</div>
                  <div className="text-gray-300 text-sm">{t.weekend}</div>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h5 className="font-medium mb-2">{t.newsletter}</h5>
              <p className="text-gray-400 text-sm mb-3">{t.newsletterDesc}</p>
              <form onSubmit={handleSubscribe} className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={locale === 'id' ? 'Email Anda' : 'Your email'}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-sm focus:outline-none focus:border-primary-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-r-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  {t.subscribeButton}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-2 md:mb-0">
              {t.copyright}
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                {t.privacy}
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                {t.terms}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
