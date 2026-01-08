'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  message: string
  type: ToastType
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export function Toast({ message, type, isVisible, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  const icons = {
    success: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
    error: <XCircleIcon className="h-5 w-5 text-red-500" />,
    warning: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />,
    info: <InformationCircleIcon className="h-5 w-5 text-blue-500" />,
  }

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-slide-in">
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-md border shadow-md min-w-[250px] max-w-[400px] ${styles[type]}`}
      >
        <div className="flex-shrink-0">
          {icons[type]}
        </div>
        <div className="flex-1 text-xs font-medium leading-tight">
          {message}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-0.5"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// Hook untuk menggunakan toast
export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false,
  })

  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ message, type, isVisible: true })
  }

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }))
  }

  return {
    Toast: <Toast {...toast} onClose={hideToast} />,
    showToast,
    showSuccess: (message: string) => showToast(message, 'success'),
    showError: (message: string) => showToast(message, 'error'),
    showWarning: (message: string) => showToast(message, 'warning'),
    showInfo: (message: string) => showToast(message, 'info'),
  }
}

export function ToastContainer({ children }: { children: ReactNode }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {children}
    </div>
  )
}

// Helper function untuk validasi gambar
export function validateImage(file: File): { valid: boolean; message?: string } {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      message: 'Format gambar tidak didukung. Gunakan JPG, PNG, GIF, atau WEBP.'
    }
  }

  if (file.size > maxSize) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
    return {
      valid: false,
      message: `Ukuran gambar terlalu besar (${sizeMB} MB). Maksimal 5 MB.`
    }
  }

  return { valid: true }
}
