'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export function Announcements() {
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Fetch announcements from API
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/announcements`)
      .then((res) => res.json())
      .then((data) => {
        const active = data.filter((a: any) => a.is_active && new Date(a.end_date) >= new Date())
        setAnnouncements(active)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (announcements.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % announcements.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [announcements.length])

  if (!isVisible || announcements.length === 0) return null

  const current = announcements[currentIndex]

  return (
    <div className="bg-yellow-50 border-b border-yellow-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">
                {current?.title}
              </p>
              {current?.content && (
                <p className="text-sm text-yellow-700 mt-1">
                  {current.content}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="ml-4 text-yellow-600 hover:text-yellow-800"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

