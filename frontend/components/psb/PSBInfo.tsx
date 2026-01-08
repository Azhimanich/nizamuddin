'use client'

import { InformationCircleIcon, AcademicCapIcon, CalendarIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

export function PSBInfo() {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Informasi Pendaftaran
          </h2>
          <p className="text-lg text-gray-600">
            Semua yang perlu Anda ketahui tentang pendaftaran santri baru
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Persyaratan */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary-100 rounded-full">
                <DocumentTextIcon className="h-8 w-8 text-primary-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Persyaratan
            </h3>
            <p className="text-gray-600">
              Siapkan dokumen lengkap untuk pendaftaran
            </p>
          </div>

          {/* Jadwal */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary-100 rounded-full">
                <CalendarIcon className="h-8 w-8 text-primary-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Jadwal
            </h3>
            <p className="text-gray-600">
              Perhatikan timeline pendaftaran
            </p>
          </div>

          {/* Proses */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary-100 rounded-full">
                <AcademicCapIcon className="h-8 w-8 text-primary-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Proses
            </h3>
            <p className="text-gray-600">
              Ikuti tahapan pendaftaran dengan benar
            </p>
          </div>

          {/* Informasi */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary-100 rounded-full">
                <InformationCircleIcon className="h-8 w-8 text-primary-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Bantuan
            </h3>
            <p className="text-gray-600">
              Hubungi kami jika ada pertanyaan
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}