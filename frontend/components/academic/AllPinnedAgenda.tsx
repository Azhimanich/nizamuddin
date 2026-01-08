'use client'

import { useState, useEffect } from 'react'
import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline'

interface AgendaEvent {
  id: number
  title: string
  start_date: string
  end_date?: string
  type: 'exam' | 'holiday' | 'activity' | 'meeting' | 'audit' | 'workshop' | 'evaluation'
  school_type: 'tk' | 'sd' | 'smp' | 'kepondokan' | 'yayasan'
  description?: string
  is_pinned: boolean
  pinned_at?: string
}

interface AllPinnedAgendaProps {
  locale: string
  maxItems?: number
}

export function AllPinnedAgenda({ locale, maxItems = 3 }: AllPinnedAgendaProps) {
  const [events, setEvents] = useState<AgendaEvent[]>([])
  const [loading, setLoading] = useState(true)

  const schoolTypes = ['tk', 'sd', 'smp', 'kepondokan', 'yayasan'] as const

  useEffect(() => {
    const fetchAllPinnedEvents = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
        const allPinnedEvents: AgendaEvent[] = []

        // Fetch pinned events from all school types
        for (const schoolType of schoolTypes) {
          const response = await fetch(`${apiUrl}/academic/calendar?school_type=${schoolType}&locale=${locale}`)
          
          if (response.ok) {
            const data = await response.json()
            const pinnedEvents = Array.isArray(data) 
              ? data.filter((event: any) => event.is_pinned)
              : []
            allPinnedEvents.push(...pinnedEvents)
          }
        }

        // Sort by pinned_at and limit to maxItems
        const sortedEvents = allPinnedEvents
          .sort((a, b) => {
            const dateA = a.pinned_at ? new Date(a.pinned_at).getTime() : 0
            const dateB = b.pinned_at ? new Date(b.pinned_at).getTime() : 0
            return dateA - dateB // Oldest pinned first
          })
          .slice(0, maxItems)

        setEvents(sortedEvents)
        setLoading(false)
      } catch (error) {
        console.error('Fetch error:', error)
        setLoading(false)
      }
    }
    
    fetchAllPinnedEvents()
  }, [locale, maxItems])

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
      case 'meeting': return 'bg-gray-500'
      case 'audit': return 'bg-orange-500'
      case 'workshop': return 'bg-indigo-500'
      case 'evaluation': return 'bg-purple-500'
      default: return 'bg-blue-500'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'exam': return 'Ujian'
      case 'holiday': return 'Libur'
      case 'meeting': return 'Rapat'
      case 'audit': return 'Audit'
      case 'workshop': return 'Workshop'
      case 'evaluation': return 'Evaluasi'
      default: return 'Kegiatan'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exam': return '📝'
      case 'holiday': return '🎉'
      case 'meeting': return '🤝'
      case 'audit': return '🔍'
      case 'workshop': return '🛠️'
      case 'evaluation': return '📊'
      default: return '📚'
    }
  }

  const getSchoolTypeLabel = (schoolType: string) => {
    switch (schoolType) {
      case 'tk': return 'TK'
      case 'sd': return 'SD'
      case 'smp': return 'SMP'
      case 'kepondokan': return 'Kepondokan'
      case 'yayasan': return 'Yayasan'
      default: return schoolType
    }
  }

  const getSchoolTypeColor = (schoolType: string) => {
    switch (schoolType) {
      case 'tk': return 'bg-pink-100 text-pink-700 border-pink-200'
      case 'sd': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'smp': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'kepondokan': return 'bg-green-100 text-green-700 border-green-200'
      case 'yayasan': return 'bg-gray-100 text-gray-700 border-gray-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const isToday = (dateString: string) => {
    const today = new Date()
    const date = new Date(dateString)
    return today.toDateString() === date.toDateString()
  }

  const isOngoing = (startDate: string, endDate?: string) => {
    const today = new Date()
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : start
    return today >= start && today <= end
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-20"></div>
          </div>
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <MapPinIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Belum ada agenda prioritas</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {events.map((event) => {
        const ongoing = isOngoing(event.start_date, event.end_date)
        const today = isToday(event.start_date)
        
        return (
          <div 
            key={event.id} 
            className="group relative bg-gradient-to-r from-gray-50/50 to-gray-100/50 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-gray-200/50"
          >
            {/* Event type indicator */}
            <div className={`absolute left-0 top-0 bottom-0 w-2 rounded-l-2xl ${getTypeColor(event.type)}`}></div>
            
            {/* Pin and School Type indicators */}
            <div className="absolute top-2 right-2 flex gap-1">
              <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getSchoolTypeColor(event.school_type)}`}>
                {getSchoolTypeLabel(event.school_type)}
              </div>
            </div>
            
            <div className="flex items-start ml-4">
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ${getTypeColor(event.type)}`}>
                  {getTypeIcon(event.type)}
                </div>
              </div>
              
              <div className="ml-3 flex-1">
                <div className="flex flex-col gap-1">
                  <h4 className={`font-bold text-gray-900 text-sm leading-tight ${today || ongoing ? 'text-green-700' : ''} group-hover:text-gray-900 transition-colors`}>
                    {event.title}
                  </h4>
                  
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold text-white ${getTypeColor(event.type)}`}>
                      {getTypeLabel(event.type)}
                    </span>
                    <div className="flex items-center text-xs text-gray-500">
                      <CalendarIcon className="w-3 h-3 mr-1" />
                      {formatDateShort(event.start_date)}
                      {event.end_date && event.end_date !== event.start_date && (
                        <span> - {formatDateShort(event.end_date)}</span>
                      )}
                    </div>
                  </div>
                  
                  {event.description && (
                    <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">{event.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
