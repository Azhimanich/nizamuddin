'use client'

import { useState, useEffect } from 'react'
import { CalendarIcon, AcademicCapIcon, BookOpenIcon, SparklesIcon } from '@heroicons/react/24/outline'

interface AcademicCalendarEvent {
  id: number
  title: string
  start_date: string
  end_date?: string
  type: 'exam' | 'holiday' | 'activity'
  school_type: 'tk' | 'sd' | 'smp' | 'kepondokan'
  description?: string
  order: number
}

interface AcademicCalendarProps {
  locale: string
}

export function AcademicCalendar({ locale }: AcademicCalendarProps) {
  const [events, setEvents] = useState<AcademicCalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'tk' | 'sd' | 'smp' | 'kepondokan'>('tk')

  const schoolTypes = [
    { id: 'tk', name: 'TK', icon: SparklesIcon, color: 'from-pink-500 to-rose-500' },
    { id: 'sd', name: 'SD', icon: BookOpenIcon, color: 'from-blue-500 to-cyan-500' },
    { id: 'smp', name: 'SMP', icon: AcademicCapIcon, color: 'from-purple-500 to-indigo-500' },
    { id: 'kepondokan', name: 'Kepondokan', icon: CalendarIcon, color: 'from-green-500 to-emerald-500' }
  ]

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
        const response = await fetch(`${apiUrl}/academic/calendar?school_type=${activeTab}&locale=${locale}`)
        
        if (!response.ok) {
          console.error('API Error:', response.status, response.statusText)
          setLoading(false)
          return
        }
        
        const data = await response.json()
        setEvents(Array.isArray(data) ? data : [])
        setLoading(false)
      } catch (error) {
        console.error('Fetch error:', error)
        setLoading(false)
      }
    }
    
    fetchEvents()
  }, [activeTab, locale])

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const formatDateShort = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'exam': return 'bg-red-500'
      case 'holiday': return 'bg-yellow-500'
      default: return 'bg-blue-500'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'exam': return 'Ujian'
      case 'holiday': return 'Libur'
      default: return 'Kegiatan'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exam': return '📝'
      case 'holiday': return '🎉'
      default: return '📚'
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden p-8">
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {schoolTypes.map((type) => {
              const Icon = type.icon
              const isActive = activeTab === type.id
              
              return (
                <button
                  key={type.id}
                  onClick={() => setActiveTab(type.id as any)}
                  className={`
                    flex-1 flex items-center justify-center px-4 py-4 text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? `text-white bg-gradient-to-r ${type.color} border-transparent` 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-transparent'
                    }
                    ${isActive ? 'rounded-tl-3xl rounded-tr-3xl' : ''}
                  `}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {type.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-8">
          {events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event) => (
                <div 
                  key={event.id} 
                  className="group relative bg-gradient-to-r from-gray-50/50 to-gray-100/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-gray-200/50"
                >
                  {/* Event type indicator */}
                  <div className={`absolute left-0 top-0 bottom-0 w-2 rounded-l-2xl ${getTypeColor(event.type)}`}></div>
                  
                  <div className="flex items-start ml-4">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ${getTypeColor(event.type)}`}>
                        {getTypeIcon(event.type)}
                      </div>
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                            {event.title}
                          </h4>
                          <div className="mt-2 flex items-center space-x-3">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white ${getTypeColor(event.type)}`}>
                              {getTypeLabel(event.type)}
                            </span>
                            <div className="flex items-center text-sm text-gray-500">
                              <CalendarIcon className="w-4 h-4 mr-1" />
                              {formatDate(event.start_date)}
                              {event.end_date && event.end_date !== event.start_date && (
                                <span> - {formatDate(event.end_date)}</span>
                              )}
                            </div>
                          </div>
                          {event.description && (
                            <p className="mt-3 text-gray-600 leading-relaxed">{event.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Belum Ada Kalender</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Kalender akademik untuk {schoolTypes.find(t => t.id === activeTab)?.name} akan segera tersedia. Silakan kembali lagi nanti.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
