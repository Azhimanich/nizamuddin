'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CalendarIcon, ClockIcon, ArrowRightIcon, NewspaperIcon, BookOpenIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { PinnedAgenda } from '@/components/academic/PinnedAgenda'
import { AllPinnedAgenda } from '@/components/academic/AllPinnedAgenda'

export function NewsAgendaSection({ locale = 'id' }: { locale?: string }) {
  const [news, setNews] = useState<any[]>([])
  const [agenda, setAgenda] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
        
        // Fetch pinned news first (max 2)
        const pinnedResponse = await fetch(`${apiUrl}/news?pinned=true`)
        let pinnedNews: any[] = []
        if (pinnedResponse.ok) {
          const pinnedData = await pinnedResponse.json()
          pinnedNews = Array.isArray(pinnedData) ? pinnedData.slice(0, 2) : []
        }

        // If less than 2 pinned, fetch latest news to fill up to 2
        if (pinnedNews.length < 2) {
          const limit = 2 - pinnedNews.length
          const newsResponse = await fetch(`${apiUrl}/news?limit=${limit}`)
          if (newsResponse.ok) {
            const newsData = await newsResponse.json()
            let latestNews: any[] = []
            if (newsData.data && Array.isArray(newsData.data)) {
              latestNews = newsData.data
            } else if (Array.isArray(newsData)) {
              latestNews = newsData
            }
            // Combine pinned and latest, avoiding duplicates
            const combined = [...pinnedNews]
            latestNews.forEach((item: any) => {
              if (!combined.find(n => n.id === item.id) && combined.length < 2) {
                combined.push(item)
              }
            })
            setNews(combined.slice(0, 2))
          } else {
            setNews(pinnedNews.slice(0, 2))
          }
        } else {
          setNews(pinnedNews.slice(0, 2))
        }

        // Fetch upcoming agenda (5 terdekat)
        const agendaResponse = await fetch(`${apiUrl}/agenda?limit=5`)
        if (agendaResponse.ok) {
          const agendaData = await agendaResponse.json()
          const agendaArray = Array.isArray(agendaData) ? agendaData : (agendaData.data || [])
          // Sort by date: upcoming first, then ongoing, then recent past
          const sortedAgenda = agendaArray
            .sort((a: any, b: any) => {
              const now = new Date().getTime()
              const startDateA = new Date(a.date || a.start_date).getTime()
              const endDateA = a.end_date ? new Date(a.end_date).getTime() : startDateA
              const startDateB = new Date(b.date || b.start_date).getTime()
              const endDateB = b.end_date ? new Date(b.end_date).getTime() : startDateB
              
              // Event A is ongoing, Event B is upcoming: B comes first (sooner)
              if (startDateA <= now && endDateA >= now && startDateB > now) return 1
              // Event A is upcoming, Event B is ongoing: A comes first (sooner)
              if (startDateA > now && startDateB <= now && endDateB >= now) return -1
              
              // Both ongoing: sort by end date (soonest ending first)
              if (startDateA <= now && endDateA >= now && startDateB <= now && endDateB >= now) {
                return endDateA - endDateB
              }
              
              // Both upcoming: sort by start date (soonest starting first)
              if (startDateA > now && startDateB > now) {
                return startDateA - startDateB
              }
              
              // One upcoming, one past: upcoming first
              if (startDateA > now && endDateB < now) return -1
              if (endDateA < now && startDateB > now) return 1
              
              // Both past: sort by most recent first
              return endDateB - endDateA
            })
            .slice(0, 5)
          setAgenda(sortedAgenda)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: id })
    } catch {
      return dateString
    }
  }

  const getNewsTitle = (item: any) => {
    if (locale === 'en') return item.title_en || item.title_id || item.title
    if (locale === 'ar') return item.title_ar || item.title_id || item.title
    return item.title_id || item.title || item.title
  }

  const getNewsExcerpt = (item: any) => {
    if (item.excerpt) return item.excerpt
    const content = locale === 'en' ? item.content_en : locale === 'ar' ? item.content_ar : item.content_id
    if (!content) return ''
    const text = typeof content === 'string' ? content : content.text || ''
    // Remove HTML tags
    const plainText = text.replace(/<[^>]*>/g, '')
    return plainText.length > 120 ? plainText.substring(0, 120) + '...' : plainText
  }

  const getNewsImage = (item: any) => {
    if (item.featured_image) {
      return item.featured_image.startsWith('http') ? item.featured_image : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/storage/${item.featured_image}`
    }
    if (item.image) {
      return item.image.startsWith('http') ? item.image : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/storage/${item.image}`
    }
    return null
  }

  return (
    <section className="py-20 relative">
      {/* Section background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/90 to-white/80 backdrop-blur-md"></div>
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main News Section - Takes 2 columns */}
            <div className="lg:col-span-2">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <BookOpenIcon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Terbaru</h3>
                  </div>
                  <Link
                    href={`/${locale}/berita`}
                    className="text-primary-600 hover:text-primary-700 font-semibold flex items-center space-x-1 text-sm"
                  >
                    <span>Lihat Semua</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>

                {news.length > 0 ? (
                  <div className="space-y-6">
                    {/* Featured News - First item with image left, text right */}
                    {news[0] && (
                      <Link
                        href={`/${locale}/berita/${news[0].slug || news[0].id}`}
                        className="block group"
                      >
                        <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-primary-200">
                          {/* Gradient overlay on hover */}
                          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 via-transparent to-primary-800/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                            <div className="relative h-64 md:h-full min-h-[200px] overflow-hidden">
                              {getNewsImage(news[0]) ? (
                                <>
                                  <img
                                    src={getNewsImage(news[0])}
                                    alt={getNewsTitle(news[0])}
                                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                                  />
                                  {/* Image overlay gradient */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </>
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center transition-all duration-500 group-hover:from-primary-600 group-hover:via-primary-700 group-hover:to-primary-800">
                                  <NewspaperIcon className="w-16 h-16 text-white opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                                </div>
                              )}
                              <div className="absolute top-4 left-4 z-20">
                                <span className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-white/20">
                                  {news[0].category?.name || news[0].category || 'Berita'}
                                </span>
                              </div>
                              {/* Decorative corner accent */}
                              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                            <div className="p-7 flex flex-col justify-center relative z-10">
                              <div className="flex items-center text-sm text-gray-500 mb-3 font-medium">
                                <CalendarIcon className="w-4 h-4 mr-2 text-primary-500" />
                                <span className="group-hover:text-primary-600 transition-colors">{formatDate(news[0].published_at || news[0].created_at)}</span>
                              </div>
                              <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors line-clamp-2 leading-tight">
                                {getNewsTitle(news[0])}
                              </h4>
                              {news[0].author && (
                                <p className="text-sm text-gray-600 mb-3 font-medium flex items-center">
                                  <span className="w-2 h-2 bg-primary-400 rounded-full mr-2"></span>
                                  Oleh: {news[0].author}
                                </p>
                              )}
                              <p className="text-gray-600 text-sm line-clamp-3 mb-5 leading-relaxed">
                                {getNewsExcerpt(news[0])}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-primary-600 font-bold text-sm flex items-center group-hover:text-primary-700 transition-all duration-300 group-hover:translate-x-2">
                                  Baca Selengkapnya
                                  <ArrowRightIcon className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                                </span>
                                {/* Decorative dot pattern */}
                                <div className="flex space-x-1">
                                  <div className="w-1.5 h-1.5 bg-primary-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{animationDelay: '0.1s'}}></div>
                                  <div className="w-1.5 h-1.5 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{animationDelay: '0.2s'}}></div>
                                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{animationDelay: '0.3s'}}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )}

                    {/* Second News Item - Same layout as first */}
                    {news[1] && (
                      <Link
                        href={`/${locale}/berita/${news[1].slug || news[1].id}`}
                        className="block group"
                      >
                        <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-primary-200">
                          {/* Gradient overlay on hover */}
                          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 via-transparent to-primary-800/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                            <div className="relative h-64 md:h-full min-h-[200px] overflow-hidden">
                              {getNewsImage(news[1]) ? (
                                <>
                                  <img
                                    src={getNewsImage(news[1])}
                                    alt={getNewsTitle(news[1])}
                                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                                  />
                                  {/* Image overlay gradient */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </>
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center transition-all duration-500 group-hover:from-primary-600 group-hover:via-primary-700 group-hover:to-primary-800">
                                  <NewspaperIcon className="w-16 h-16 text-white opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                                </div>
                              )}
                              <div className="absolute top-4 left-4 z-20">
                                <span className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-white/20">
                                  {news[1].category?.name || news[1].category || 'Berita'}
                                </span>
                              </div>
                              {/* Decorative corner accent */}
                              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                            <div className="p-7 flex flex-col justify-center relative z-10">
                              <div className="flex items-center text-sm text-gray-500 mb-3 font-medium">
                                <CalendarIcon className="w-4 h-4 mr-2 text-primary-500" />
                                <span className="group-hover:text-primary-600 transition-colors">{formatDate(news[1].published_at || news[1].created_at)}</span>
                              </div>
                              <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors line-clamp-2 leading-tight">
                                {getNewsTitle(news[1])}
                              </h4>
                              {news[1].author && (
                                <p className="text-sm text-gray-600 mb-3 font-medium flex items-center">
                                  <span className="w-2 h-2 bg-primary-400 rounded-full mr-2"></span>
                                  Oleh: {news[1].author}
                                </p>
                              )}
                              <p className="text-gray-600 text-sm line-clamp-3 mb-5 leading-relaxed">
                                {getNewsExcerpt(news[1])}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-primary-600 font-bold text-sm flex items-center group-hover:text-primary-700 transition-all duration-300 group-hover:translate-x-2">
                                  Baca Selengkapnya
                                  <ArrowRightIcon className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                                </span>
                                {/* Decorative dot pattern */}
                                <div className="flex space-x-1">
                                  <div className="w-1.5 h-1.5 bg-primary-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{animationDelay: '0.1s'}}></div>
                                  <div className="w-1.5 h-1.5 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{animationDelay: '0.2s'}}></div>
                                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{animationDelay: '0.3s'}}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <NewspaperIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>Belum ada berita tersedia</p>
                  </div>
                )}
              </div>
            </div>

            {/* Agenda Sidebar - Takes 1 column */}
            <div className="lg:col-span-1">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 sticky top-24 relative overflow-hidden">
                {/* Animated background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/10 via-blue-400/10 to-emerald-400/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 via-green-400/10 to-teal-400/10 rounded-full blur-2xl animate-pulse"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-gray-200/50">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl flex items-center justify-center shadow-md">
                      <CalendarIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        <span className="text-green-600">Agenda</span>
                      </h3>
                      <p className="text-base text-gray-600 font-medium">Kegiatan Terkini</p>
                    </div>
                  </div>

                  <AllPinnedAgenda locale={locale} maxItems={3} />

                  <Link
                    href={`/${locale}/akademik#kalender-akademik`}
                    className="mt-8 block w-full bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 text-white text-center py-5 rounded-3xl font-bold hover:from-green-700 hover:via-emerald-700 hover:to-blue-700 transition-all duration-500 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 group relative overflow-hidden"
                  >
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    {/* Decorative elements */}
                    <div className="absolute top-2 left-2 w-4 h-4 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></div>
                    
                    <span className="relative z-10 flex items-center justify-center text-base">
                      Lihat Kalender Akademik
                      <ArrowRightIcon className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-2" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

