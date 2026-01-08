'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/layout/Layout'
import Link from 'next/link'
import { CalendarIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export default function BeritaPage({ params }: { params: { locale: string } }) {
  const locale = params?.locale || 'id'
  const [news, setNews] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pagination, setPagination] = useState<any>({
    current_page: 1,
    last_page: 1,
    per_page: 9,
    total: 0
  })
  const [loading, setLoading] = useState<boolean>(false)

  // Fetch categories
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/categories`)
      .then(res => res.json())
      .then(data => {
        const cats = Array.isArray(data) ? data : (data.data || [])
        setCategories(cats)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const url = selectedCategory
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/news?category=${selectedCategory}&page=${currentPage}&limit=9`
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/news?page=${currentPage}&limit=9`
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.data && data.current_page !== undefined) {
          // Paginated response
          setNews(data.data)
          setPagination({
            current_page: data.current_page || 1,
            last_page: data.last_page || 1,
            per_page: data.per_page || 9,
            total: data.total || 0
          })
        } else if (Array.isArray(data)) {
          // Direct array response (no pagination)
          setNews(data)
          setPagination({
            current_page: 1,
            last_page: Math.ceil(data.length / 9),
            per_page: 9,
            total: data.length
          })
        } else if (data.data && Array.isArray(data.data)) {
          // Response with data property but no pagination info
          setNews(data.data)
          setPagination({
            current_page: 1,
            last_page: Math.ceil(data.data.length / 9),
            per_page: 9,
            total: data.data.length
          })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [selectedCategory, currentPage])

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.last_page) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const renderPagination = () => {
    const pages = []
    const maxVisible = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let endPage = Math.min(pagination.last_page, startPage + maxVisible - 1)
    
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1)
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${
          currentPage === 1
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 shadow-md hover:shadow-lg'
        }`}
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>
    )

    // First page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-4 py-2 rounded-lg font-semibold bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 shadow-md hover:shadow-lg transition-all duration-200"
        >
          1
        </button>
      )
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="px-2 text-gray-500">
            ...
          </span>
        )
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
            i === currentPage
              ? 'bg-primary-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 shadow-md hover:shadow-lg'
          }`}
        >
          {i}
        </button>
      )
    }

    // Last page
    if (endPage < pagination.last_page) {
      if (endPage < pagination.last_page - 1) {
        pages.push(
          <span key="ellipsis2" className="px-2 text-gray-500">
            ...
          </span>
        )
      }
      pages.push(
        <button
          key={pagination.last_page}
          onClick={() => handlePageChange(pagination.last_page)}
          className="px-4 py-2 rounded-lg font-semibold bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 shadow-md hover:shadow-lg transition-all duration-200"
        >
          {pagination.last_page}
        </button>
      )
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === pagination.last_page}
        className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${
          currentPage === pagination.last_page
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 shadow-md hover:shadow-lg'
        }`}
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    )

    return pages
  }

  return (
    <Layout locale={locale}>
      <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 text-center">Berita & Artikel</h1>
            <p className="text-xl text-gray-600 text-center mb-12">
              Update terbaru dari kegiatan dan informasi pesantren
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
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 ${
                    selectedCategory === cat.slug
                      ? 'bg-primary-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* News Grid */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Memuat berita...</p>
              </div>
            ) : news.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {news.map((item) => (
                    <Link
                      key={item.id}
                      href={`/${locale}/berita/${item.slug}`}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                    >
                      <div className="aspect-video bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                        {item.featured_image ? (
                          <img 
                            src={item.featured_image.startsWith('http') 
                              ? item.featured_image 
                              : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/storage/${item.featured_image}`} 
                            alt={item.title} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <span className="text-white text-6xl">📰</span>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          <span>
                            {format(new Date(item.published_at || item.created_at), 'dd MMMM yyyy', { locale: id })}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        {item.author && (
                          <p className="text-sm text-gray-600 mb-2 font-medium">
                            Oleh: {item.author}
                          </p>
                        )}
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">{item.excerpt}</p>
                        <div className="flex items-center text-primary-600 font-semibold">
                          <span>Baca Selengkapnya</span>
                          <ArrowRightIcon className="h-5 w-5 ml-2" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.last_page > 1 && (
                  <div className="mt-12 flex flex-col items-center">
                    <div className="flex items-center space-x-2 flex-wrap justify-center">
                      {renderPagination()}
                    </div>
                    <p className="mt-4 text-sm text-gray-600">
                      Halaman {pagination.current_page} dari {pagination.last_page} 
                      {' '}(Total {pagination.total} berita)
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">Belum ada berita tersedia</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  )
}

