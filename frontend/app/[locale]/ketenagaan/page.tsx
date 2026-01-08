'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/layout/Layout'
import { AcademicCapIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

export default function KetenagaanPage({ params }: { params: { locale: string } }) {
  const locale = params?.locale || 'id'
  const [staff, setStaff] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('')
  const [organizationStructure, setOrganizationStructure] = useState<any[]>([])

  useEffect(() => {
    // Fetch categories
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/specialization-categories`)
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : (data.data || [])))
      .catch(() => {})

    // Fetch organization structure
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/organization-structure`)
      .then(res => res.json())
      .then(data => setOrganizationStructure(Array.isArray(data) ? data : []))
      .catch(() => {})

    // Fetch staff
    const url = selectedSpecialization 
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/staff?specialization=${selectedSpecialization}&locale=${locale}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/staff?locale=${locale}`
    
    fetch(url)
      .then(res => res.json())
      .then(data => setStaff(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [locale, selectedSpecialization])

  return (
    <Layout locale={locale}>
      <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <section id="struktur-organisasi" className="py-20 bg-white scroll-mt-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            {/* Organization Structure */}
            {organizationStructure.length > 0 && (
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Struktur Organisasi Yayasan</h2>
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8">
                  {renderOrganizationStructure(organizationStructure, locale)}
                </div>
              </div>
            )}

            {/* Direktori Ketenagaan Section */}
            <div id="direktori-ketenagaan" className="mt-16 scroll-mt-32">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Direktori Ketenagaan</h2>
              <p className="text-xl text-gray-600 text-center mb-8">
                Ustadz, Ustadzah, dan Staff Pondok Pesantren Nizamuddin
              </p>

              {/* Filter */}
              <div className="mb-8 flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => setSelectedSpecialization('')}
                  className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                    selectedSpecialization === '' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Semua
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedSpecialization(cat.name)}
                    className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                      selectedSpecialization === cat.name
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Staff Grid */}
            {staff.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {staff.map((person) => (
                  <div key={person.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="text-center mb-4">
                      <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mb-4">
                        {person.photo ? (
                          <img 
                            src={person.photo.startsWith('http') 
                              ? person.photo 
                              : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/storage/${person.photo}`} 
                            alt={person.name} 
                            className="w-full h-full rounded-full object-cover" 
                          />
                        ) : (
                          <span className="text-white text-4xl font-bold">
                            {person.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{person.name}</h3>
                      <p className="text-primary-600 font-semibold">{person.position}</p>
                      {person.specialization && (
                        <p className="text-sm text-gray-600 mt-1">{person.specialization}</p>
                      )}
                    </div>
                    {person.bio && (
                      <p className="text-gray-600 text-sm text-center mb-4 line-clamp-3">{person.bio}</p>
                    )}
                    <div className="flex justify-center space-x-4 text-sm text-gray-600">
                      {person.email && (
                        <div className="flex items-center">
                          <EnvelopeIcon className="h-4 w-4 mr-1" />
                          <span className="text-xs">{person.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <AcademicCapIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Data ketenagaan sedang dimuat...</p>
              </div>
            )}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}

// Helper function to render organization structure by level
function renderOrganizationStructure(structures: any[], locale: string = 'id'): JSX.Element {
  // Group structures by level
  const level0 = structures.filter(s => {
    const sParentId = s.parent_id
    return sParentId === null || sParentId === undefined || sParentId === ''
  })
  
  const level1 = structures.filter(s => {
    const sParentId = s.parent_id
    return sParentId !== null && sParentId !== undefined && level0.some(l0 => Number(l0.id) === Number(sParentId))
  })
  
  const level2 = structures.filter(s => {
    const sParentId = s.parent_id
    return sParentId !== null && sParentId !== undefined && level1.some(l1 => Number(l1.id) === Number(sParentId))
  })

  const renderCard = (item: any) => {
    const bio = locale === 'en' ? item.bio_en : locale === 'ar' ? item.bio_ar : item.bio_id
    
    return (
      <div key={item.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div className="text-center mb-4">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mb-4">
            {item.photo ? (
              <img 
                src={item.photo.startsWith('http') 
                  ? item.photo 
                  : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/storage/${item.photo}`} 
                alt={item.name} 
                className="w-full h-full rounded-full object-cover" 
              />
            ) : (
              <span className="text-white text-2xl font-bold">
                {item.name.charAt(0)}
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
          <p className="text-primary-600 font-semibold text-sm mt-1">{item.position}</p>
          {item.email && (
            <p className="text-xs text-gray-600 mt-1 break-words">{item.email}</p>
          )}
        </div>
        {bio && (
          <p className="text-gray-600 text-xs text-center line-clamp-3">{bio}</p>
        )}
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Level 0: Pimpinan */}
      {level0.length > 0 && (
        <div className="grid grid-cols-1 gap-6 mb-8">
          {level0.map(renderCard)}
        </div>
      )}

      {/* Level 1: Wakil Pimpinan */}
      {level1.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {level1.map(renderCard)}
        </div>
      )}

      {/* Level 2+: Kepala Divisi - semua dalam 1 grid */}
      {level2.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {level2.map(renderCard)}
        </div>
      )}
    </div>
  )
}

