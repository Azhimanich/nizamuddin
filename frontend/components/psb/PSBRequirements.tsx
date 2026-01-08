'use client'

import { useState, useEffect } from 'react'
import { 
  DocumentTextIcon, 
  AcademicCapIcon, 
  HeartIcon,
  CheckCircleIcon,
  SparklesIcon,
  ArrowRightIcon,
  UserIcon,
  CalendarIcon,
  BanknotesIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface PSBData {
  documents: Array<{
    title: string
    items: string[]
  }>
  requirements: string[]
  costs: Array<{
    item: string
    amount: string
    note: string
  }>
  note: string
}

export function PSBRequirements({ locale = 'id' }: { locale?: string }) {
  const [data, setData] = useState<PSBData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPSBData()
  }, [locale])

  const fetchPSBData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/psb/requirements?locale=${locale}`)
      const result = await response.json()
      
      if (result.success) {
        setData(result.data)
      } else {
        console.error('Failed to fetch PSB data:', result.message)
        // Fallback to static data if API fails
        setData(getStaticData())
      }
    } catch (error) {
      console.error('Error fetching PSB data:', error)
      // Fallback to static data if API fails
      setData(getStaticData())
    } finally {
      setLoading(false)
    }
  }

  const getStaticData = (): PSBData => {
    return {
      documents: [
        {
          title: locale === 'id' ? 'Dokumen Identitas' : 'Identity Documents',
          items: locale === 'id' ? [
            'Akta Kelahiran (fotokopi)',
            'Kartu Keluarga (fotokopi)',
            'KTP Orang Tua/Wali (fotokopi)',
            'Pas foto 3x4 (4 lembar)',
            'Pas foto 2x3 (4 lembar)'
          ] : [
            'Birth certificate (photocopy)',
            'Family card (photocopy)',
            'Parent/Guardian ID (photocopy)',
            '3x4 photos (4 pieces)',
            '2x3 photos (4 pieces)'
          ]
        },
        {
          title: locale === 'id' ? 'Dokumen Akademik' : 'Academic Documents',
          items: locale === 'id' ? [
            'Rapor semester terakhir',
            'Surat Keterangan Berkelakuan Baik',
            'Ijazah/SKL (jika ada)',
            'Sertifikat penghargaan (jika ada)',
            'Surat rekomendasi dari sekolah (opsional)'
          ] : [
            'Latest semester report card',
            'Good conduct certificate',
            'Diploma/SKL (if available)',
            'Award certificates (if available)',
            'School recommendation letter (optional)'
          ]
        },
        {
          title: locale === 'id' ? 'Dokumen Kesehatan' : 'Health Documents',
          items: locale === 'id' ? [
            'Surat keterangan sehat dari dokter',
            'Kartu imunisasi',
            'Surat keterangan bebas narkoba',
            'Data riwayat penyakit (jika ada)',
            'Informasi alergi (jika ada)'
          ] : [
            'Health certificate from doctor',
            'Immunization card',
            'Drug-free certificate',
            'Medical history (if any)',
            'Allergy information (if any)'
          ]
        }
      ],
      requirements: locale === 'id' ? [
        'Usia minimal 6 tahun untuk tingkat SD/MI',
        'Usia maksimal 19 tahun untuk tingkat SMA/MA',
        'Mampu membaca Al-Quran (dasar)',
        'Bersedia tinggal di asrama',
        'Menyetujui peraturan pesantren',
        'Orang tua/wali menyetujui syarat dan ketentuan'
      ] : [
        'Minimum age 6 years for elementary level',
        'Maximum age 19 years for high school level',
        'Able to read Quran (basic)',
        'Willing to live in dormitory',
        'Agree to pesantren regulations',
        'Parent/guardian agrees to terms and conditions'
      ],
      costs: [
        { 
          item: locale === 'id' ? 'Biaya Pendaftaran' : 'Registration Fee', 
          amount: 'Rp 500.000', 
          note: locale === 'id' ? 'Tidak dapat dikembalikan' : 'Non-refundable'
        },
        { 
          item: locale === 'id' ? 'Biaya Tes Masuk' : 'Entrance Test Fee', 
          amount: 'Rp 300.000', 
          note: locale === 'id' ? 'Termasuk tes akademik dan psikotes' : 'Includes academic and psychological tests'
        },
        { 
          item: locale === 'id' ? 'Uang Pangkal' : 'Initial Fee', 
          amount: 'Rp 5.000.000', 
          note: locale === 'id' ? 'Dapat dicicil 3x' : 'Can be paid in 3 installments'
        },
        { 
          item: locale === 'id' ? 'SPP Bulanan' : 'Monthly Tuition', 
          amount: 'Rp 800.000', 
          note: locale === 'id' ? 'Belum termasuk biaya makan' : 'Excluding meal costs'
        }
      ],
      note: locale === 'id' 
        ? 'Biaya dapat berubah sewaktu-waktu. Hubungi admin untuk informasi terkini.'
        : 'Fees are subject to change. Contact admin for current information.'
    }
  }

  const getColorClasses = (index: number) => {
    const colors = [
      'from-emerald-500 to-teal-600 bg-emerald-50 border-emerald-200',
      'from-teal-500 to-cyan-600 bg-teal-50 border-teal-200',
      'from-cyan-500 to-blue-600 bg-cyan-50 border-cyan-200'
    ]
    return colors[index % colors.length]
  }

  const getIcon = (index: number) => {
    const icons = [DocumentTextIcon, UserIcon, CalendarIcon]
    return icons[index % icons.length]
  }

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">Loading requirements...</p>
          </div>
        </div>
      </section>
    )
  }

  if (!data) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-red-600">Failed to load requirements. Please try again later.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            {locale === 'id' ? 'Persyaratan Pendaftaran' : 'Registration Requirements'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {locale === 'id' 
              ? 'Pastikan semua dokumen lengkap untuk kelancaran proses pendaftaran'
              : 'Ensure all documents are complete for smooth registration process'
            }
          </p>
        </div>

        {/* Documents Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {data.documents.map((doc, index) => {
            const Icon = getIcon(index)
            const colorClasses = getColorClasses(index)
            
            return (
              <div
                key={index}
                className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden border border-gray-100"
              >
                {/* Gradient Header */}
                <div className={`h-2 bg-gradient-to-r ${colorClasses.split(' ').slice(0, 2).join(' ')}`} />
                
                {/* Floating Badge */}
                <div className="absolute -top-4 -right-4">
                  <div className={`w-20 h-20 bg-gradient-to-br ${colorClasses.split(' ').slice(0, 2).join(' ')} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="relative p-8 pt-12">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {doc.title}
                    </h3>
                    <div className={`h-1 w-16 bg-gradient-to-r ${colorClasses.split(' ').slice(0, 2).join(' ')} rounded-full`} />
                  </div>
                  
                  <ul className="space-y-4">
                    {doc.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start group/item">
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${colorClasses.split(' ').slice(0, 2).join(' ')} flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-200`}>
                          <CheckCircleIcon className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-gray-700 group-hover/item:text-gray-900 transition-colors">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            )
          })}
        </div>

        {/* Additional Requirements */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl shadow-xl p-8 mb-16 border border-emerald-100">
          <div className="flex items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <CheckCircleIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {locale === 'id' ? 'Persyaratan Tambahan' : 'Additional Requirements'}
              </h3>
              <p className="text-gray-600 mt-1">
                {locale === 'id' ? 'Syarat wajib yang harus dipenuhi' : 'Mandatory requirements to be fulfilled'}
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {data.requirements.map((req, index) => (
              <div key={index} className="group flex items-center p-4 bg-white/70 backdrop-blur-sm rounded-2xl hover:bg-white transition-all duration-300 border border-emerald-100 hover:border-emerald-200">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                  <CheckCircleIcon className="h-5 w-5 text-white" />
                </div>
                <span className="text-gray-700 group-hover:text-gray-900 transition-colors font-medium">{req}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Information */}
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl shadow-xl p-8 border border-teal-100">
          <div className="flex items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <BanknotesIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {locale === 'id' ? 'Informasi Biaya' : 'Cost Information'}
              </h3>
              <p className="text-gray-600 mt-1">
                {locale === 'id' ? 'Rincian biaya pendaftaran dan pendidikan' : 'Registration and education fee details'}
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {data.costs.map((cost, index) => (
              <div key={index} className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 hover:bg-white transition-all duration-300 border border-teal-100 hover:border-teal-200 hover:shadow-lg">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                    <BanknotesIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                      {cost.item}
                    </h4>
                    <p className="text-2xl font-bold text-teal-600 mb-2">
                      {cost.amount}
                    </p>
                    <p className="text-sm text-gray-600">
                      {cost.note}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                <ExclamationTriangleIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-amber-800 mb-1">
                  {locale === 'id' ? 'Catatan Penting' : 'Important Note'}
                </h4>
                <p className="text-amber-700 text-sm">
                  {data.note}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
