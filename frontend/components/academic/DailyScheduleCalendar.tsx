'use client'

import { useState, useEffect } from 'react'
import { ClockIcon, AcademicCapIcon, BookOpenIcon, SparklesIcon } from '@heroicons/react/24/outline'

interface DailyScheduleEvent {
  id: number
  school_type: 'tk' | 'sd' | 'smp' | 'kepondokan'
  start_time: string
  end_time?: string
  activity_id: string
  activity_en?: string
  activity_ar?: string
  order: number
  is_active: boolean
}

interface DailyScheduleCalendarProps {
  locale: string
  activeTab?: 'tk' | 'sd' | 'smp' | 'kepondokan'
  setActiveTab?: (tab: 'tk' | 'sd' | 'smp' | 'kepondokan') => void
}

export function DailyScheduleCalendar({ locale, activeTab: externalActiveTab, setActiveTab: externalSetActiveTab }: DailyScheduleCalendarProps) {
  const [schedules, setSchedules] = useState<DailyScheduleEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [internalActiveTab, setInternalActiveTab] = useState<'tk' | 'sd' | 'smp' | 'kepondokan'>('tk')
  
  // Use external tab state if provided, otherwise use internal state
  const activeTab = externalActiveTab || internalActiveTab
  const setActiveTab = externalSetActiveTab || setInternalActiveTab

  const schoolTypes = [
    { id: 'tk', name: 'TK', icon: SparklesIcon, color: 'from-emerald-500 to-green-600' },
    { id: 'sd', name: 'SD', icon: BookOpenIcon, color: 'from-teal-500 to-emerald-600' },
    { id: 'smp', name: 'SMP', icon: AcademicCapIcon, color: 'from-green-500 to-teal-600' },
    { id: 'kepondokan', name: 'Kepondokan', icon: ClockIcon, color: 'from-lime-500 to-green-600' }
  ]

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
        const response = await fetch(`${apiUrl}/daily-schedules?school_type=${activeTab}`)
        
        if (!response.ok) {
          console.error('API Error:', response.status, response.statusText)
          setLoading(false)
          return
        }
        
        const data = await response.json()
        setSchedules(Array.isArray(data) ? data : [])
        setLoading(false)
      } catch (error) {
        console.error('Fetch error:', error)
        setLoading(false)
      }
    }
    
    fetchSchedules()
  }, [activeTab])

  const formatTime = (timeString: string) => {
    if (!timeString) return ''
    const time = new Date(`2000-01-01T${timeString}`)
    return time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  }

  const getActivityText = (schedule: DailyScheduleEvent) => {
    switch (locale) {
      case 'en':
        return schedule.activity_en || schedule.activity_id
      case 'ar':
        return schedule.activity_ar || schedule.activity_id
      default:
        return schedule.activity_id
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-emerald-200 overflow-hidden p-8" style={{ 
          boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.15), 0 10px 10px -5px rgba(16, 185, 129, 0.1)'
        }}>
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="mt-4 text-emerald-600 font-medium">Memuat jadwal...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-emerald-200 overflow-hidden" style={{ 
        boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.15), 0 10px 10px -5px rgba(16, 185, 129, 0.1)'
      }}>
        {/* Content - Green themed design */}
        <div className="p-8 bg-gradient-to-br from-emerald-50/30 to-teal-50/30">
          {schedules.length > 0 ? (
            <div className="divide-y divide-emerald-100">
              {schedules.map((schedule, index) => (
                <div key={schedule.id} className="group relative p-6 transition-all duration-300 hover:bg-gradient-to-r hover:from-emerald-50/70 hover:to-teal-50/70">
                  {/* Decorative green gradient border */}
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-r-full"></div>
                  
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-36">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-3 rounded-2xl text-center font-bold shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-emerald-400">
                        <div className="text-lg font-bold">{formatTime(schedule.start_time)}</div>
                        {schedule.end_time && (
                          <div className="text-xs opacity-90 mt-1">- {formatTime(schedule.end_time)}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-6 flex-1">
                      <div className="text-lg font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors duration-300 flex items-center">
                        <span className="flex-1">
                          {locale === 'id' ? schedule.activity_id : 
                           locale === 'en' ? schedule.activity_en || schedule.activity_id :
                           schedule.activity_ar || schedule.activity_id}
                        </span>
                        <div className="flex items-center ml-4">
                          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse mr-2"></div>
                          <span className="text-sm font-medium text-emerald-600">Aktif</span>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="text-sm text-gray-600 font-medium">Rutinitas Harian</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-28 h-28 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-emerald-200">
                <span className="text-5xl">🌱</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Belum Ada Jadwal</h3>
              <p className="text-gray-600 max-w-md mx-auto text-lg">
                Jadwal kegiatan harian akan segera tersedia. Silakan kembali lagi nanti.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
