'use client'

import { useEffect, useMemo, useState } from 'react'
import { 
  QuestionMarkCircleIcon, 
  ClipboardDocumentListIcon,
  BanknotesIcon,
  AcademicCapIcon,
  HomeModernIcon,
  ChevronDownIcon, 
  ChevronUpIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  ShareIcon,
  HeartIcon,
  PlayIcon,
  ChatBubbleLeftRightIcon as TwitterIcon
} from '@heroicons/react/24/outline'

type ApiFaq = {
  id: number
  question: string
  answer: string
  locale: string
  order: number
  is_active: boolean
  category?: string | null
}

export function PSBFaq({ locale = 'id' }: { locale?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [faqs, setFaqs] = useState<ApiFaq[]>([])
  const [error, setError] = useState<string>('')

  const content = {
    id: {
      title: 'Frequently Asked Questions',
      subtitle: 'Pertanyaan yang sering diajukan tentang pendaftaran',
      contact: 'Butuh Bantuan?',
      contactSubtitle: 'Jika Anda memiliki pertanyaan lain, jangan ragu untuk menghubungi kami',
    },
    en: {
      title: 'Frequently Asked Questions',
      subtitle: 'Common questions about registration',
      contact: 'Need Help?',
      contactSubtitle: 'If you have other questions, don\'t hesitate to contact us',
    }
  }

  const t = content[locale as keyof typeof content] || content.id

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const fetchFaqs = async () => {
      try {
        setLoading(true)
        setError('')

        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
        const res = await fetch(`${apiBase}/psb/faqs?locale=${encodeURIComponent(locale)}`, {
          signal: controller.signal
        })

        const json = await res.json()
        const apiFaqs: ApiFaq[] = Array.isArray(json?.data?.faqs)
          ? json.data.faqs
          : Object.values(json?.data?.faqs || {}).flat()

        if (!isMounted) return
        setFaqs(apiFaqs)
      } catch (e: any) {
        if (!isMounted) return
        if (e?.name === 'AbortError') return
        setError(locale === 'id' ? 'Gagal memuat FAQ.' : 'Failed to load FAQs.')
      } finally {
        if (!isMounted) return
        setLoading(false)
      }
    }

    fetchFaqs()
    return () => {
      isMounted = false
      controller.abort()
    }
  }, [locale])

  const uiFaqs = useMemo(() => {
    return (faqs || []).filter((f) => f.is_active)
  }, [faqs])

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const normalizeCategory = (category: string) => {
    return (category || '').trim().toLowerCase()
  }

  const getCategoryMeta = (category: string) => {
    const c = normalizeCategory(category)
    if (c === 'pendaftaran' || c === 'registration') {
      return { gradient: 'from-blue-500 to-blue-600', Icon: ClipboardDocumentListIcon }
    }
    if (c === 'biaya' || c === 'fees') {
      return { gradient: 'from-emerald-500 to-teal-600', Icon: BanknotesIcon }
    }
    if (c === 'akademik' || c === 'academic') {
      return { gradient: 'from-violet-500 to-purple-600', Icon: AcademicCapIcon }
    }
    if (c === 'asrama' || c === 'dormitory') {
      return { gradient: 'from-rose-500 to-pink-600', Icon: HomeModernIcon }
    }

    return { gradient: 'from-gray-500 to-gray-600', Icon: QuestionMarkCircleIcon }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-6">
            <QuestionMarkCircleIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            {t.title}
          </h2>
          <p className="text-xl text-gray-600">
            {t.subtitle}
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 mb-16">
          {loading && (
            <div className="text-center py-10 text-gray-500">Loading...</div>
          )}

          {!loading && error && (
            <div className="text-center py-10 text-red-600">{error}</div>
          )}

          {!loading && !error && uiFaqs.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              {locale === 'id' ? 'Belum ada FAQ.' : 'No FAQs yet.'}
            </div>
          )}

          {!loading && !error && uiFaqs.map((faq, index) => {
            const { gradient, Icon } = getCategoryMeta(String(faq.category || ''))
            return (
            <div
              key={faq.id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                </div>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-500 group-hover:text-emerald-600 transition-colors" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-500 group-hover:text-emerald-600 transition-colors" />
                  )}
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <div className="pl-14 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              )}
            </div>
            )
          })}
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-2xl" />
          </div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl mb-4">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">
                {t.contact}
              </h3>
              <p className="text-emerald-100">
                {t.contactSubtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <a 
                href="https://facebook.com/nizamuddin.sch"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center group block"
              >
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-white/30 transition-colors">
                  <ShareIcon className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold mb-1">
                  Facebook
                </h4>
                <p className="text-emerald-100 text-sm">
                  @nizamuddin.sch
                </p>
              </a>

              <a 
                href="https://instagram.com/nizamuddin.official"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center group block"
              >
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-white/30 transition-colors">
                  <HeartIcon className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold mb-1">
                  Instagram
                </h4>
                <p className="text-emerald-100 text-sm">
                  @nizamuddin.official
                </p>
              </a>

              <a 
                href="https://youtube.com/@pondoknizamuddin"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center group block"
              >
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-white/30 transition-colors">
                  <PlayIcon className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold mb-1">
                  YouTube
                </h4>
                <p className="text-emerald-100 text-sm">
                  Pondok Nizamuddin
                </p>
              </a>

              <a 
                href="https://twitter.com/nizamuddin_id"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center group block"
              >
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-white/30 transition-colors">
                  <TwitterIcon className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold mb-1">
                  Twitter/X
                </h4>
                <p className="text-emerald-100 text-sm">
                  @nizamuddin_id
                </p>
              </a>
            </div>

            <div className="text-center">
              <a
                href={`https://wa.me/6281234567890`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center bg-white text-emerald-600 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <SparklesIcon className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                {locale === 'id' ? 'Hubungi WhatsApp' : 'Contact WhatsApp'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
