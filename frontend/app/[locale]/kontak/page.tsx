'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/layout/Layout'
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

export default function KontakPage({ params }: { params: { locale: string } }) {
  const locale = params?.locale || 'id'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [contactInfo, setContactInfo] = useState<any[]>([])
  const [map, setMap] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const getContactValue = (type: string) => {
    const item = contactInfo.find(item => item.type === type)
    return item ? item.value : ''
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch contact information
        const contactResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/contact-information?locale=${locale}`)
        const contactData = await contactResponse.json()
        setContactInfo(contactData)

        // Fetch map data
        const mapResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/map`)
        const mapData = await mapResponse.json()
        setMap(mapData)
      } catch (error) {
        console.error('Error fetching contact data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [locale])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        setSubmitted(true)
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <Layout locale={locale}>
      <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 text-center">Kontak Kami</h1>
            <p className="text-xl text-gray-600 text-center mb-12">
              Hubungi kami untuk informasi lebih lanjut
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Informasi Kontak</h2>
                <div className="space-y-6">
                  {getContactValue('address') && (
                    <div className="flex items-start">
                      <MapPinIcon className="h-6 w-6 text-primary-600 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Alamat</h3>
                        <p className="text-gray-600 whitespace-pre-line">{getContactValue('address')}</p>
                      </div>
                    </div>
                  )}
                  {getContactValue('phone') && (
                    <div className="flex items-start">
                      <PhoneIcon className="h-6 w-6 text-primary-600 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Telepon</h3>
                        <p className="text-gray-600">
                          <a href={`tel:${getContactValue('phone')}`} className="hover:text-primary-600 transition-colors">
                            {getContactValue('phone')}
                          </a>
                        </p>
                      </div>
                    </div>
                  )}
                  {getContactValue('email') && (
                    <div className="flex items-start">
                      <EnvelopeIcon className="h-6 w-6 text-primary-600 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                        <p className="text-gray-600">
                          <a href={`mailto:${getContactValue('email')}`} className="hover:text-primary-600 transition-colors">
                            {getContactValue('email')}
                          </a>
                        </p>
                      </div>
                    </div>
                  )}
                  {getContactValue('whatsapp') && (
                    <div className="flex items-start">
                      <PhoneIcon className="h-6 w-6 text-primary-600 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">WhatsApp</h3>
                        <p className="text-gray-600">
                          <a 
                            href={`https://wa.me/${getContactValue('whatsapp').replace(/[^0-9]/g, '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-primary-600 transition-colors"
                          >
                            {getContactValue('whatsapp')}
                          </a>
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Google Maps */}
                <div className="mt-8 rounded-xl overflow-hidden shadow-lg">
                                    <div className="aspect-video">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.132538478054!2d100.50886577447267!3d1.0623320624335886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x302b519460cb8bf3%3A0x41b18d9029df65af!2sPondok%20Pesantren%20Nizhamuddin!5e0!3m2!1sen!2sid!4v1767172744608!5m2!1sen!2sid"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Kirim Pesan</h2>
                {submitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <p className="text-green-800 font-semibold">Pesan berhasil dikirim!</p>
                    <p className="text-green-600 text-sm mt-2">Kami akan menghubungi Anda segera.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nama</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Telepon</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Subjek</label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Pesan</label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                    >
                      Kirim Pesan
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}

