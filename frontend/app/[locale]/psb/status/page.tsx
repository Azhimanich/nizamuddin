'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon, CheckCircleIcon, ExclamationTriangleIcon, ClockIcon } from '@heroicons/react/24/outline'

export default function PSBStatusCheckPage({ locale = 'id' }: { locale?: string }) {
  const [nik, setNik] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const content = {
    id: {
      title: 'Cek Status Pendaftaran',
      subtitle: 'Masukkan NIK Anda untuk mengecek status pendaftaran PSB',
      placeholder: 'Masukkan 16 digit NIK',
      checkButton: 'Cek Status',
      checking: 'Memeriksa...',
      notFound: 'NIK tidak ditemukan dalam sistem pendaftaran',
      error: 'Terjadi kesalahan. Silakan coba lagi.',
      registrationFound: 'Data Pendaftaran Ditemukan',
      personalInfo: 'Informasi Pribadi',
      registrationInfo: 'Informasi Pendaftaran',
      currentStatus: 'Status Saat Ini',
      registrationDate: 'Tanggal Pendaftaran',
      adminNotes: 'Catatan Admin',
      fields: {
        nik: 'NIK',
        fullName: 'Nama Lengkap',
        birthPlace: 'Tempat Lahir',
        birthDate: 'Tanggal Lahir',
        gender: 'Jenis Kelamin',
        address: 'Alamat Lengkap',
        phone: 'Nomor Telepon',
        email: 'Email'
      },
      status: {
        pending: 'Pending - Menunggu Verifikasi',
        diproses: 'Diproses - Sedang Diverifikasi',
        diterima: 'Diterima - Selamat! Anda Diterima',
        ditolak: 'Ditolak - Maaf, Anda Belum Diterima'
      }
    },
    en: {
      title: 'Check Registration Status',
      subtitle: 'Enter your NIK to check PSB registration status',
      placeholder: 'Enter 16 digit NIK',
      checkButton: 'Check Status',
      checking: 'Checking...',
      notFound: 'NIK not found in registration system',
      error: 'An error occurred. Please try again.',
      registrationFound: 'Registration Data Found',
      personalInfo: 'Personal Information',
      registrationInfo: 'Registration Information',
      currentStatus: 'Current Status',
      registrationDate: 'Registration Date',
      adminNotes: 'Admin Notes',
      fields: {
        nik: 'NIK',
        fullName: 'Full Name',
        birthPlace: 'Place of Birth',
        birthDate: 'Date of Birth',
        gender: 'Gender',
        address: 'Full Address',
        phone: 'Phone Number',
        email: 'Email'
      },
      status: {
        pending: 'Pending - Waiting for Verification',
        diproses: 'In Progress - Being Verified',
        diterima: 'Accepted - Congratulations! You are Accepted',
        ditolak: 'Rejected - Sorry, You are Not Accepted'
      }
    }
  }

  const t = content[locale as keyof typeof content] || content.id

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!nik || nik.length !== 16) {
      setError(locale === 'id' ? 'NIK harus 16 digit' : 'NIK must be 16 digits')
      return
    }

    setIsChecking(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/psb/check-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nik })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setResult(data.data)
      } else {
        setError(data.message || (locale === 'id' ? 'NIK tidak ditemukan dalam sistem pendaftaran' : 'NIK not found in registration system'))
      }
    } catch (error) {
      setError(locale === 'id' ? 'Terjadi kesalahan. Silakan coba lagi.' : 'An error occurred. Please try again.')
      console.error('Status check error:', error)
    } finally {
      setIsChecking(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { bg: '#fef3c7', color: '#92400e', icon: '⏳' },
      diproses: { bg: '#dbeafe', color: '#1e40af', icon: '🔄' },
      diterima: { bg: '#d1fae5', color: '#065f46', icon: '✅' },
      ditolak: { bg: '#fee2e2', color: '#991b1b', icon: '❌' }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 20px',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '600',
        backgroundColor: config.bg,
        color: config.color
      }}>
        <span style={{ fontSize: '20px' }}>{config.icon}</span>
        {t.status[status as keyof typeof t.status]}
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t.title}
          </h1>
          <p className="text-xl text-gray-600">
            {t.subtitle}
          </p>
        </div>

        {/* Check Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <form onSubmit={handleCheck} className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={nik}
                  onChange={(e) => setNik(e.target.value.replace(/\D/g, '').slice(0, 16))}
                  placeholder={t.placeholder}
                  maxLength={16}
                  pattern="[0-9]{16}"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isChecking || nik.length !== 16}
                className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
              >
                {isChecking ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    {t.checking}
                  </>
                ) : (
                  <>
                    <MagnifyingGlassIcon className="h-5 w-5" />
                    {t.checkButton}
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Result */}
        {result && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Status Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">{t.registrationFound}</h2>
                {getStatusBadge(result.status)}
              </div>
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-primary-600 mr-2" />
                    {t.personalInfo}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">{t.fields.fullName}</span>
                      <p className="font-medium text-gray-900">{result.nama_lengkap}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">{t.fields.birthPlace}</span>
                      <p className="font-medium text-gray-900">{result.tempat_lahir}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">{t.fields.birthDate}</span>
                      <p className="font-medium text-gray-900">
                        {result.tanggal_lahir ? new Date(result.tanggal_lahir).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US') : '-'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">{t.fields.gender}</span>
                      <p className="font-medium text-gray-900">
                        {result.jenis_kelamin === 'L' ? (locale === 'id' ? 'Laki-laki' : 'Male') : (locale === 'id' ? 'Perempuan' : 'Female')}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">{t.fields.address}</span>
                      <p className="font-medium text-gray-900 whitespace-pre-line">{result.alamat_lengkap}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">{t.fields.phone}</span>
                      <p className="font-medium text-gray-900">{result.nomor_telepon}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">{t.fields.email}</span>
                      <p className="font-medium text-gray-900">{result.email}</p>
                    </div>
                  </div>
                </div>

                {/* Registration Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <ClockIcon className="h-5 w-5 text-primary-600 mr-2" />
                    {t.registrationInfo}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">{t.registrationDate}</span>
                      <p className="font-medium text-gray-900">{formatDate(result.created_at)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">{t.currentStatus}</span>
                      <div className="mt-1">{getStatusBadge(result.status)}</div>
                    </div>
                    {result.catatan && (
                      <div>
                        <span className="text-sm text-gray-500">{t.adminNotes}</span>
                        <div className="mt-1 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="font-medium text-gray-900 whitespace-pre-line">{result.catatan}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Instructions */}
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <ExclamationTriangleIcon className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="text-blue-800 text-sm">
                    {result.status === 'pending' && (
                      locale === 'id' 
                        ? 'Pendaftaran Anda sedang dalam proses verifikasi oleh tim kami. Mohon menunggu informasi selanjutnya.'
                        : 'Your registration is being verified by our team. Please wait for further information.'
                    )}
                    {result.status === 'diproses' && (
                      locale === 'id'
                        ? 'Pendaftaran Anda sedang diproses. Tim kami akan menghubungi Anda jika ada informasi tambahan yang dibutuhkan.'
                        : 'Your registration is being processed. Our team will contact you if additional information is needed.'
                    )}
                    {result.status === 'diterima' && (
                      locale === 'id'
                        ? 'Selamat! Pendaftaran Anda telah diterima. Tim kami akan segera menghubungi Anda untuk langkah selanjutnya.'
                        : 'Congratulations! Your registration has been accepted. Our team will contact you soon for next steps.'
                    )}
                    {result.status === 'ditolak' && (
                      locale === 'id'
                        ? 'Maaf, pendaftaran Anda belum dapat diterima. Anda dapat mencoba kembali pada periode pendaftaran berikutnya.'
                        : 'Sorry, your registration could not be accepted. You may try again in the next registration period.'
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
