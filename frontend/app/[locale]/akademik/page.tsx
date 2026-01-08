'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/layout/Layout'
import { AcademicCalendar } from '@/components/academic/AcademicCalendar'
import { DailyScheduleCalendar } from '@/components/academic/DailyScheduleCalendar'
import { AcademicCapIcon, BookOpenIcon, SparklesIcon, UserGroupIcon, TrophyIcon, ClockIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function AkademikPage({ params }: { params: { locale: string } }) {
  const locale = params?.locale || 'id'
  const [academic, setAcademic] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)
  const [activeScheduleTab, setActiveScheduleTab] = useState<'tk' | 'sd' | 'smp' | 'kepondokan'>('tk')

  const schoolTypes = [
    { id: 'tk', name: 'TK', icon: SparklesIcon, color: 'from-emerald-500 to-green-600' },
    { id: 'sd', name: 'SD', icon: BookOpenIcon, color: 'from-teal-500 to-emerald-600' },
    { id: 'smp', name: 'SMP', icon: AcademicCapIcon, color: 'from-green-500 to-teal-600' },
    { id: 'kepondokan', name: 'Kepondokan', icon: ClockIcon, color: 'from-lime-500 to-green-600' }
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
        const response = await fetch(`${apiUrl}/academic?locale=${locale}`)
        
        if (!response.ok) {
          console.error('API Error:', response.status, response.statusText)
          setLoading(false)
          return
        }
        
        const data = await response.json()
        console.log('Academic data received:', data) // Debug log
        setAcademic(data)
        setLoading(false)
      } catch (error) {
        console.error('Fetch error:', error)
        setLoading(false)
      }
    }
    
    fetchData()
  }, [locale])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && fullscreenImage) {
        setFullscreenImage(null)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [fullscreenImage])

  // Handle scroll to section when hash is present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      if (hash === '#kalender-akademik') {
        setTimeout(() => {
          const element = document.getElementById('kalender-akademik')
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)
      }
    }
  }, [])

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const formatTime = (time: string) => {
    if (!time) return ''
    // If time is in format "HH:MM:SS", extract just "HH:MM"
    if (time.includes(':')) {
      const parts = time.split(':')
      return `${parts[0]}:${parts[1]}`
    }
    return time
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'exam': return '#ef4444' // red
      case 'holiday': return '#eab308' // yellow
      default: return '#3b82f6' // blue
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'exam': return 'Ujian'
      case 'holiday': return 'Libur'
      default: return 'Kegiatan'
    }
  }

  const getProgramIcon = (index: number) => {
    const icons = [AcademicCapIcon, BookOpenIcon, SparklesIcon, UserGroupIcon, TrophyIcon]
    return icons[index % icons.length]
  }

  const getProgramColor = (index: number) => {
    const colors = [
      'from-emerald-400 to-teal-500',    // Soft green-teal
      'from-sky-400 to-blue-500',        // Calm sky-blue
      'from-rose-400 to-pink-500',       // Gentle rose-pink
      'from-amber-400 to-orange-400',     // Warm amber
      'from-purple-400 to-indigo-400',    // Muted purple-indigo
      'from-cyan-400 to-teal-400'        // Soft cyan-teal
    ]
    return colors[index % colors.length]
  }

  if (loading) {
    return (
      <Layout locale={locale}>
        <div style={{ paddingTop: '100px', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div>Loading...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout locale={locale}>
      <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
        {/* Program Unggulan - Modern Design */}
        <section id="program-unggulan" className="py-16 relative scroll-mt-32">
          {/* Enhanced Background with Animated Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/20 via-transparent to-transparent"></div>
          
          <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
            {/* Modern Header with Gradient Text */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl mb-6 shadow-2xl">
                <AcademicCapIcon className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-4" style={{ 
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Program Unggulan
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Program-program terbaik kami yang dirancang untuk mengembangkan potensi maksimal setiap santri
              </p>
            </div>
            
            {/* Modern Grid Layout with Enhanced Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {academic?.programs && academic.programs.length > 0 ? (
                academic.programs.map((program: any, index: number) => {
                  const imageUrl = program.image?.startsWith('http') 
                    ? program.image 
                    : program.image 
                      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/storage/${program.image}`
                      : null
                  const Icon = getProgramIcon(index)
                  const color = getProgramColor(index)
                  
                  return (
                    <div
                      key={program.id}
                      className="group relative"
                    >                      
                      {/* Enhanced Card with Modern Design */}
                      <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-white/20 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] h-full min-h-[400px] flex flex-col">
                        {/* Gradient Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                        
                        {/* Image Section with Modern Styling */}
                        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                          {imageUrl ? (
                            <>
                              <img 
                                src={imageUrl} 
                                alt={program.name} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                draggable={false}
                              />
                              {/* Gradient Overlay on Image */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </>
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                              <div className={`w-20 h-20 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center shadow-lg`}>
                                <Icon className="h-10 w-10 text-white" />
                              </div>
                            </div>
                          )}
                          
                          {/* Floating Icon Badge */}
                          <div className={`absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12`}>
                            <div className={`w-8 h-8 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center`}>
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Enhanced Content Section */}
                        <div className="p-8 relative flex-1 flex flex-col">
                          {/* Program Title with Modern Typography */}
                          <div className="mb-4">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                              {program.name}
                            </h3>
                            <div className={`h-1 w-16 bg-gradient-to-r ${color} rounded-full`}></div>
                          </div>
                          
                          {/* Description with Better Typography */}
                          <p className="text-gray-600 mb-6 leading-relaxed text-lg line-clamp-3 flex-1">
                            {program.description || 'Tidak ada deskripsi'}
                          </p>
                          
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="col-span-full text-center py-16">
                  <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-16 max-w-3xl mx-auto border border-white/20 shadow-2xl">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-8">
                      <BookOpenIcon className="h-12 w-12 text-white opacity-80" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">Program Sedang Disiapkan</h3>
                    <p className="text-lg text-gray-600">
                      Program-program unggulan kami akan segera tersedia. Mohon tunggu update terbaru dari kami.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Fullscreen Image Modal */}
        {fullscreenImage && (
          <div
            onClick={() => setFullscreenImage(null)}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-5 cursor-pointer"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
            >
              <img
                src={fullscreenImage}
                alt="Fullscreen"
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                draggable={false}
              />
              <button
                onClick={() => setFullscreenImage(null)}
                className="absolute -top-12 right-0 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full w-9 h-9 flex items-center justify-center text-gray-700 font-bold text-xl shadow-lg transition-all"
                title="Tutup (ESC)"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Kalender Akademik */}
        <section id="kalender-akademik" className="py-20 relative scroll-mt-20">
          {/* Section background with subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-white/90 to-indigo-50/50 backdrop-blur-md"></div>
          
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold mb-4" style={{ 
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                <span className="text-5xl mr-3">📅</span>
                Kalender Akademik
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Pentingnya tanggal dan kegiatan akademik sepanjang tahun ajaran
              </p>
            </div>
            
            <AcademicCalendar locale={locale} />
          </div>
        </section>

        {/* Jadwal Kegiatan Harian */}
        <section id="jadwal-harian" className="py-20 relative scroll-mt-32">
          {/* Section background with subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white/90 to-teal-50/50 backdrop-blur-md"></div>
          
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold mb-4" style={{ 
                background: 'linear-gradient(135deg, #065f46 0%, #10b981 50%, #059669 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                <span className="text-5xl mr-3">🌿</span>
                Jadwal Kegiatan Harian
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Rutinitas harian yang membentuk karakter dan disiplin santri
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              {/* Tab Navigation for Daily Schedules */}
              <div className="mb-8">
                <div style={{ 
                  display: 'flex', 
                  borderBottom: '1px solid #10b981',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '16px 16px 0 0',
                  overflow: 'hidden',
                  marginBottom: '0',
                  boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.1)'
                }}>
                  {schoolTypes.map((type) => {
                    const Icon = type.icon
                    const isActive = activeScheduleTab === type.id
                    
                    return (
                      <button
                        key={type.id}
                        onClick={() => setActiveScheduleTab(type.id as any)}
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '14px 16px',
                          fontSize: '15px',
                          fontWeight: '800',
                          border: 'none',
                          backgroundColor: isActive ? (
                            `linear-gradient(to right, ${type.color.replace('from-', '#').replace(' to-', ', #')})`
                          ) : 'transparent',
                          color: isActive ? '#ffffff' : '#047857',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          borderRadius: isActive ? '12px 12px 0 0' : '0',
                          textShadow: isActive ? '0 2px 4px rgba(0, 0, 0, 0.5)' : 'none',
                          letterSpacing: isActive ? '0.5px' : 'normal'
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor = '#dcfce7'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor = 'transparent'
                          }
                        }}
                      >
                        <Icon style={{ 
                          width: '20px', 
                          height: '20px', 
                          marginRight: '10px',
                          filter: isActive ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6))' : 'none'
                        }} />
                        {type.name}
                        {isActive && (
                          <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '3px',
                            backgroundColor: 'rgba(255, 255, 255, 0.3)'
                          }} />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-emerald-200 overflow-hidden" style={{ 
                boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.15), 0 10px 10px -5px rgba(16, 185, 129, 0.1)',
                borderTopLeftRadius: '0',
                borderTopRightRadius: '0',
                border: '2px solid #10b981'
              }}>
                {/* Use DailyScheduleCalendar component with tab functionality */}
                <DailyScheduleCalendar locale={locale} activeTab={activeScheduleTab} setActiveTab={setActiveScheduleTab} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}

