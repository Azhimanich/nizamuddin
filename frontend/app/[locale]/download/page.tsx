'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/layout/Layout'
import { ArrowDownTrayIcon, DocumentIcon } from '@heroicons/react/24/outline'

export default function DownloadPage({ params }: { params: { locale: string } }) {
  const locale = params?.locale || 'id'
  const [downloads, setDownloads] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/download-categories`)
        const data = await res.json()
        setCategories(Array.isArray(data) ? data : [])
      } catch (err) {
        // Ignore
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    setLoading(true)
    const url = selectedCategory
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/downloads?category=${selectedCategory}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/downloads`
    
    fetch(url)
      .then(res => res.json())
      .then(data => setDownloads(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [selectedCategory])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long', 
      year: 'numeric'
    })
  }

  return (
    <Layout locale={locale}>
      <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 text-center">Download Center</h1>
            <p className="text-xl text-gray-600 text-center mb-12">
              Download file-file penting dari pesantren
            </p>

            {/* Category Filter */}
            <div className="mb-8 flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 ${
                  selectedCategory === '' 
                    ? 'bg-primary-600 text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Semua
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug || cat.id.toString())}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 ${
                    selectedCategory === (cat.slug || cat.id.toString())
                      ? 'bg-primary-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Downloads Table */}
            {loading ? (
              <div className="text-center py-12">
                <svg className="animate-spin h-8 w-8 text-gray-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600">Memuat file...</p>
              </div>
            ) : downloads.length > 0 ? (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">File</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Kategori</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ukuran</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Update</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Download</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {downloads.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <DocumentIcon className="h-8 w-8 text-primary-600 mr-3" />
                            <div>
                              <div className="font-semibold text-gray-900">{item.title}</div>
                              {item.description && (
                                <div className="text-sm text-gray-600">{item.description}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{item.category?.name || item.category || '-'}</td>
                        <td className="px-6 py-4 text-gray-600">{formatFileSize(item.file_size || 0)}</td>
                        <td className="px-6 py-4 text-gray-600">{formatDate(item.updated_at)}</td>
                        <td className="px-6 py-4">
                          <a
                            href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/downloads/${item.id}/download`}
                            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                          >
                            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                            Download
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <DocumentIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Belum ada file tersedia untuk diunduh</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  )
}

