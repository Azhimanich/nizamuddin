'use client'

import { ArrowDownIcon, CalendarIcon, UserGroupIcon, AcademicCapIcon } from '@heroicons/react/24/outline'

export function PSBHero({ locale = 'id' }: { locale?: string }) {
  const content = {
    id: {
      title: 'Pendaftaran Santri Baru',
      description: 'Bergabunglah dengan kami dalam perjalanan menggapai keilmuan dan kebaikan. Membentuk generasi yang cerdas, berakhlak mulia, dan berwawasan global.',
      features: [
        {
          icon: AcademicCapIcon,
          title: 'Kurikulum Terpadu',
          description: 'Menggabungkan pendidikan Diknas dan kitab kuning'
        },
        {
          icon: UserGroupIcon,
          title: 'Lingkungan Asri',
          description: 'Suasana belajar yang nyaman dan kondusif'
        },
        {
          icon: CalendarIcon,
          title: 'Pendaftaran Online',
          description: 'Proses pendaftaran mudah dan transparan'
        }
      ],
      highlights: [],
      cta_primary: 'Isi Formulir',
      cta_secondary: 'Cek Status Pendaftaran'
    },
    en: {
      title: 'New Student Registration',
      description: 'Join us in the journey of knowledge and goodness. Shaping intelligent, virtuous, and globally-minded generations.',
      features: [
        {
          icon: AcademicCapIcon,
          title: 'Integrated Curriculum',
          description: 'Combining national education and Islamic classical texts'
        },
        {
          icon: UserGroupIcon,
          title: 'Serene Environment',
          description: 'Comfortable and conducive learning atmosphere'
        },
        {
          icon: CalendarIcon,
          title: 'Online Registration',
          description: 'Easy and transparent registration process'
        }
      ],
      highlights: [],
      cta_primary: 'Fill Form',
      cta_secondary: 'Check Registration Status'
    }
  }

  const t = content[locale as keyof typeof content] || content.id

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-500 pt-32 pb-20 md:pt-40 md:pb-24">
      {/* Background Shapes */}
      <div className="absolute inset-0">
        {/* Floating Shapes */}
        <div className="absolute top-10 left-5 w-48 h-48 bg-emerald-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-5 w-64 h-64 bg-teal-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/4 left-1/4 w-56 h-56 bg-emerald-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            {t.title}
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
            {t.description}
          </p>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {t.features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => window.location.href = `/${locale}/psb/formulir`}
              className="group relative px-6 py-3 bg-white text-emerald-600 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="relative z-10 flex items-center justify-center">
                {t.cta_primary}
                <ArrowDownIcon className="h-4 w-4 ml-2 group-hover:translate-y-1 transition-transform" />
              </span>
            </button>
            <button 
              onClick={() => window.location.href = `/${locale}/psb/status`}
              className="group px-6 py-3 bg-emerald-700 text-white border border-emerald-700 rounded-xl font-semibold hover:bg-emerald-800 transition-all duration-300 transform hover:-translate-y-1"
            >
              {t.cta_secondary}
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="animate-bounce">
            <ArrowDownIcon className="h-6 w-6 text-white/60 mx-auto" />
          </div>
        </div>
      </div>
    </section>
  )
}
