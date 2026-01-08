'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/layout/Layout'
import { MapPinIcon, PhoneIcon, EnvelopeIcon, AcademicCapIcon, TrophyIcon, BuildingOfficeIcon, DocumentTextIcon, GlobeAltIcon } from '@heroicons/react/24/outline'

export default function ProfilPage({ params }: { params: { locale: string } }) {
  const locale = params?.locale || 'id'
  const [profileData, setProfileData] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
        console.log('Fetching profile from:', `${apiUrl}/profile?locale=${locale}`)
        
        const response = await fetch(`${apiUrl}/profile?locale=${locale}`)
        console.log('API Response status:', response.status, response.statusText)
        
        if (response.ok) {
          const data = await response.json()
          console.log('Raw API Response:', data)
          console.log('Video data structure:', JSON.stringify(data.video, null, 2))
          
          // Test API connectivity for video
          if (data.video && data.video.video_profil && data.video.video_profil.content && data.video.video_profil.content.youtube_url) {
            console.log('Testing YouTube URL:', data.video.video_profil.content.youtube_url)
            testYouTubeUrl(data.video.video_profil.content.youtube_url)
          }
          
          setProfileData(data)
        } else {
          console.error('Failed to fetch profile:', response.status, response.statusText)
          // Try to get error details
          try {
            const errorData = await response.json()
            console.error('Error details:', errorData)
          } catch (e) {
            console.error('Could not parse error response')
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [locale])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && fullscreenImage) {
        setFullscreenImage(null)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [fullscreenImage])

  const getContent = (type: string, key: string, field: string = 'text') => {
    if (!profileData[type] || !profileData[type][key]) return ''
    const content = profileData[type][key].content || {}
    const value = content[field] || content || ''
    
    // Ensure we return a string, not an object
    if (typeof value === 'string') return value
    if (typeof value === 'object' && value !== null) {
      // If it's an object, try to extract a string value
      return value.text || value.value || value.name || value.title || String(value)
    }
    return String(value || '')
  }

  const getIdentity = (key: string) => {
    if (!profileData.identity || !profileData.identity[key]) return ''
    const content = profileData.identity[key].content || {}
    const value = content.text || content.value || content || ''
    
    // Ensure we return a string, not an object
    if (typeof value === 'string') return value
    if (typeof value === 'object' && value !== null) {
      // If it's an object, try to extract a string value
      return value.text || value.value || value.name || value.title || String(value)
    }
    return String(value || '')
  }

  const getYoutubeEmbedUrl = (url: string) => {
    try {
      if (!url) return ''
      
      console.log('Original YouTube URL:', url)
      
      // Extract video ID from YouTube URL
      const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
      const match = url.match(regex)
      
      if (match && match[1]) {
        // Add autoplay and mute parameters for autoplay functionality
        const embedUrl = `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1`
        console.log('Generated embed URL:', embedUrl)
        return embedUrl
      }
      
      // If it's already an embed URL, add autoplay parameters
      if (url.includes('youtube.com/embed/')) {
        const separator = url.includes('?') ? '&' : '?'
        const autoplayUrl = `${url}${separator}autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1`
        console.log('URL is already embed format, adding autoplay:', autoplayUrl)
        return autoplayUrl
      }
      
      console.log('Could not extract video ID from:', url)
      return ''
    } catch (error) {
      console.error('Error parsing YouTube URL:', error)
      return ''
    }
  }

  // Safe wrapper for YouTube embed URL
  const safeGetYoutubeEmbedUrl = (url: string) => {
    try {
      return getYoutubeEmbedUrl(url) || ''
    } catch (error) {
      console.error('Error in safeGetYoutubeEmbedUrl:', error)
      return ''
    }
  }

  // Test YouTube API connectivity
  const testYouTubeUrl = (url: string) => {
    try {
      const embedUrl = getYoutubeEmbedUrl(url)
      if (embedUrl) {
        // Test if the embed URL is accessible
        fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`)
          .then(response => {
            if (response.ok) {
              console.log('YouTube URL is valid and accessible')
            } else {
              console.log('YouTube URL exists but oembed failed:', response.status)
            }
          })
          .catch(error => {
            console.log('YouTube API test failed:', error)
          })
      }
      return embedUrl
    } catch (error) {
      console.error('Error testing YouTube URL:', error)
      return ''
    }
  }

  const getImage = (type: string, key: string) => {
    if (!profileData[type] || !profileData[type][key]) return null
    const image = profileData[type][key].image
    if (!image) return null
    
    // If image is already a full URL, return as is
    if (image.startsWith('http')) {
      return image
    }
    
    // Otherwise, construct the full URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    return `${apiUrl}/storage/${image}`
  }

  const getIdentityValue = (key: string) => {
    return getContent('identity', key, 'value') || '-'
  }

  const getFacilities = () => {
    if (!profileData.facility) return []
    return Object.values(profileData.facility).map((item: any) => ({
      name: item.content?.name || '',
      desc: item.content?.description || '',
      image: item.image || null,
    })).filter((f: any) => f.name)
  }

  return (
    <Layout locale={locale} hideHeader={!!fullscreenImage}>
      <div style={{ paddingTop: '120px', minHeight: '100vh', overflowX: 'hidden' }}>
        {/* Sekapur Sirih */}
        <section id="sekapur-sirih" className="pt-8 pb-20 relative overflow-hidden scroll-mt-32">
          {/* Decorative background elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-emerald-50"></div>
          <div className="absolute top-10 right-10 w-32 h-32 bg-primary-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-emerald-200/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 bg-gradient-to-r from-primary-600 to-emerald-600 bg-clip-text text-transparent">
                Sekapur Sirih
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-medium">
                Sambutan Hangat dari Pimpinan Pondok Pesantren Nizamuddin
              </p>
            </div>
            
            {/* Combined Card for Image and Text */}
            {getImage('welcome', 'sekapur_sirih') ? (
              <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-8 md:p-10">
                  {/* Text Column - Left */}
                  <div className="order-2 lg:order-1">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">Sambutan Kepala Pesantren</h3>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full opacity-60"></div>
                      <p 
                        className="text-base md:text-lg text-gray-700 leading-relaxed whitespace-pre-line italic relative z-10"
                        style={{ 
                          textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                          lineHeight: '1.8'
                        }}
                      >
                        {getContent('welcome', 'sekapur_sirih', 'text') || 
                          "Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nDengan mengucap syukur Alhamdulillah, kami sambut kehadiran Anda di website resmi Pondok Pesantren Nizamuddin. Pesantren kami berkomitmen untuk mencetak generasi yang berakhlak mulia, berilmu, dan bermanfaat bagi umat melalui pendidikan Islam yang terpadu antara kurikulum modern dan tradisi pesantren."}
                      </p>
                    </div>
                    
                    <div className="mt-8 flex items-center space-x-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Pimpinan Pondok Pesantren</span>
                      </div>
                      <div className="w-px h-6 bg-gray-300"></div>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>2024</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Image Column - Right */}
                  <div className="order-1 lg:order-2">
                    <div className="relative group">
                      <div className="absolute -inset-2 bg-gradient-to-r from-primary-400 to-emerald-400 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg"></div>
                      <div className="relative overflow-hidden rounded-3xl shadow-lg transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-xl">
                        <img 
                          src={getImage('welcome', 'sekapur_sirih')} 
                          alt="Sekapur Sirih"
                          className="w-full h-auto object-cover"
                          style={{ minHeight: '450px' }}
                        />
                        
                        {/* Image overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Decorative corner accent */}
                        <div className="absolute top-4 right-4 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-white/30">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Sambutan Kepala Pesantren</h3>
                </div>
                
                <p className="text-base md:text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                  {getContent('welcome', 'sekapur_sirih', 'text') || 
                    "Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nDengan mengucap syukur Alhamdulillah, kami sambut kehadiran Anda di website resmi Pondok Pesantren Nizamuddin. Pesantren kami berkomitmen untuk mencetak generasi yang berakhlak mulia, berilmu, dan bermanfaat bagi umat melalui pendidikan Islam yang terpadu antara kurikulum modern dan tradisi pesantren."}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Identitas Sekolah */}
        <section id="identitas-sekolah" className="py-20 relative scroll-mt-32">
          {/* Section background with subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/90 to-white/80 backdrop-blur-md"></div>
          
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-5xl font-extrabold text-gray-900 mb-16 text-center bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Identitas Sekolah
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {/* Card Kiri - Identitas Sekolah (Tanpa Background) */}
              <div className="lg:col-span-1 flex flex-col">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  Data Identitas
                </h3>
                
                <div className="flex-1 grid grid-cols-1 gap-y-3">
                  {[
                    { label: 'Nama Pesantren', value: String(getIdentity('nama_pesantren') || 'Pondok Pesantren Nizamuddin'), icon: BuildingOfficeIcon, color: 'from-blue-500 to-blue-600' },
                    { label: 'NPSN', value: String(getIdentity('npsn') || '12012912'), icon: AcademicCapIcon, color: 'from-purple-500 to-purple-600' },
                    { label: 'Akreditasi', value: String(getIdentity('akreditasi') || 'A (Unggul)'), icon: TrophyIcon, color: 'from-yellow-500 to-orange-500' },
                    { label: 'No. SK Pendirian', value: String(getIdentity('no_sk_pendirian') || 'SK/001/NIZ/2005'), icon: DocumentTextIcon, color: 'from-green-500 to-green-600' },
                    { label: 'Alamat', value: String(getIdentity('alamat') || 'Jl. Pesantren No. 123, Jakarta'), icon: MapPinIcon, color: 'from-red-500 to-red-600' },
                    { label: 'Telepon', value: String(getIdentity('telepon') || '(021) 1234567'), icon: PhoneIcon, color: 'from-indigo-500 to-indigo-600' },
                    { label: 'Email', value: String(getIdentity('email') || 'info@nizamuddin.sch.id'), icon: EnvelopeIcon, color: 'from-pink-500 to-pink-600' },
                    { label: 'Website', value: String(getIdentity('website') || 'www.nizamuddin.sch.id'), icon: GlobeAltIcon, color: 'from-teal-500 to-teal-600' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-3 group/item p-3 rounded-xl hover:bg-gray-50/50 transition-all duration-300">
                      <div className={`flex-shrink-0 w-10 h-10 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center shadow-lg transform group-hover/item:scale-110 transition-all duration-300 group-hover/item:shadow-xl`}>
                        <item.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <dt className="text-sm font-bold text-gray-800 mb-1">{item.label}</dt>
                        <dd className="text-gray-600 text-xs leading-relaxed break-words">{item.value}</dd>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Kanan - Video YouTube (Dengan Background) */}
              <div className="lg:col-span-2 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl relative flex flex-col">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  Video Profil
                </h3>
                
                <div className="flex-1 flex flex-col">
                  <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100 shadow-inner flex-1">
                    {/* Fix: Use video_profil.content.youtube_url based on debug info */}
                    {(() => {
                      console.log('=== FINAL VIDEO DEBUG ===')
                      console.log('Profile data:', profileData)
                      console.log('Video profil object:', profileData?.video?.video_profil)
                      
                      if (profileData?.video?.video_profil?.content?.youtube_url) {
                        const videoUrl = profileData.video.video_profil.content.youtube_url
                        const embedUrl = safeGetYoutubeEmbedUrl(videoUrl)
                        
                        console.log('✅ Found YouTube URL:', videoUrl)
                        console.log('✅ Generated embed URL:', embedUrl)
                        console.log('=== END DEBUG ===')
                        
                        // Test YouTube API
                        testYouTubeUrl(videoUrl)
                        
                        return embedUrl
                      }
                      
                      console.log('❌ No YouTube URL found in video.video_profil.content.youtube_url')
                      console.log('=== END DEBUG ===')
                      return ''
                    })() ? (
                      <iframe
                        src={(() => {
                          const videoUrl = profileData?.video?.video_profil?.content?.youtube_url
                          const embedUrl = videoUrl ? safeGetYoutubeEmbedUrl(videoUrl) : ''
                          console.log('🎬 RENDERING IFRAME WITH:', embedUrl)
                          return embedUrl
                        })()}
                        title="Video Profil Pondok Pesantren Nizamuddin"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        onLoad={() => console.log('🎉✅ Iframe loaded successfully')}
                        onError={() => console.log('❌ Iframe failed to load')}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.245 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm1.344 9.653c-.286-.8-1.14-1.424-1.967-1.424-.827 0-1.681.624-1.967 1.424-.286.8-.286 2.864 0 3.664.286.8 1.14 1.424 1.967 1.424.827 0 1.681-.624 1.967-1.424.286-.8.286-2.864 0-3.664zm-3.977-2.847c-.447.226-.935.342-1.424.342s-.977-.116-1.424-.342c-.447-.226-.712-.566-.712-1.009 0-.443.265-.783.712-1.009.447-.226.935-.342 1.424-.342s.977.116 1.424.342c.447.226.712.566.712 1.009 0 .443-.265.783-.712 1.009z"/>
                            </svg>
                          </div>
                          <p className="text-gray-600 font-medium text-sm">Video profil akan segera tersedia</p>
                          <p className="text-gray-500 text-xs mt-1">Hubungi admin untuk menambahkan video</p>
                          
                          {/* Clean debug info */}
                          <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-left max-w-xs">
                            <p className="font-bold mb-2">🔍 FINAL DEBUG:</p>
                            <p>Profile exists: {profileData ? '✅ Yes' : '❌ No'}</p>
                            <p>Video profil exists: {profileData?.video?.video_profil ? '✅ Yes' : '❌ No'}</p>
                            <p>Content exists: {profileData?.video?.video_profil?.content ? '✅ Yes' : '❌ No'}</p>
                            <p>YouTube URL: {profileData?.video?.video_profil?.content?.youtube_url ? '✅ Yes' : '❌ No'}</p>
                            <p>URL value: {profileData?.video?.video_profil?.content?.youtube_url || '❌ Empty'}</p>
                            <p>Embed URL: {profileData?.video?.video_profil?.content?.youtube_url ? safeGetYoutubeEmbedUrl(profileData.video.video_profil.content.youtube_url) : '❌ Not generated'}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 text-center">
                    {/* Use video_profil for title and description */}
                    {profileData?.video?.video_profil?.content?.title && (
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {profileData.video.video_profil.content.title}
                      </h4>
                    )}
                    {profileData?.video?.video_profil?.content?.description && (
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {profileData.video.video_profil.content.description}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-red-200 to-pink-200 rounded-full opacity-30 blur-xl"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-pink-200 to-red-200 rounded-full opacity-30 blur-xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Visi & Misi */}
        <section id="visi-misi" className="py-20 relative scroll-mt-32">
          {/* Section background with subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/90 to-white/80 backdrop-blur-md"></div>
          
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Visi & Misi
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Pondok Pesantren Nizamuddin - Mencetak Generasi Unggul
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Visi Card */}
              <div className="group relative">
                {/* Gradient border effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                
                <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-10 border border-white/20 shadow-2xl transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-3xl">
                  {/* Icon with gradient background */}
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform duration-500 mx-auto">
                    <AcademicCapIcon className="w-12 h-12 text-white" />
                  </div>
                  
                  <h3 className="text-4xl font-bold text-gray-900 mb-6 text-center bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                    Visi
                  </h3>
                  
                  <p className="text-gray-700 leading-relaxed text-center text-lg">
                    {getContent('vision', 'visi', 'text') || 
                      'Menjadi pesantren terdepan dalam menghasilkan santri yang hafal Al-Quran, menguasai ilmu agama, berprestasi di bidang akademik, dan berakhlak mulia untuk kemaslahatan umat.'}
                  </p>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full opacity-50"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full opacity-50"></div>
                </div>
              </div>

              {/* Misi Card */}
              <div className="group relative">
                {/* Gradient border effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                
                <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-10 border border-white/20 shadow-2xl transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-3xl">
                  {/* Icon with gradient background */}
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform duration-500 mx-auto">
                    <TrophyIcon className="w-12 h-12 text-white" />
                  </div>
                  
                  <h3 className="text-4xl font-bold text-gray-900 mb-6 text-center bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
                    Misi
                  </h3>
                  
                  <div className="text-gray-700 leading-relaxed text-center text-lg">
                    {getContent('mission', 'misi', 'text') ? (
                      <ul className="space-y-4">
                        {getContent('mission', 'misi', 'text').split('\n').filter((item: string) => item.trim()).map((item: string, idx: number) => (
                          <li key={idx} className="flex items-start group/item">
                            <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-3 mt-0.5 group-hover/item:scale-125 transition-transform duration-300">
                              <span className="text-white text-xs font-bold">✓</span>
                            </span>
                            <span>{item.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="space-y-4">
                        <li className="flex items-start group/item">
                          <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-3 mt-0.5 group-hover/item:scale-125 transition-transform duration-300">
                            <span className="text-white text-xs font-bold">✓</span>
                          </span>
                          <span>Menyelenggarakan pendidikan Al-Quran dengan metode terbaik</span>
                        </li>
                        <li className="flex items-start group/item">
                          <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-3 mt-0.5 group-hover/item:scale-125 transition-transform duration-300">
                            <span className="text-white text-xs font-bold">✓</span>
                          </span>
                          <span>Mengembangkan kurikulum terpadu (Diknas & Kitab Kuning)</span>
                        </li>
                        <li className="flex items-start group/item">
                          <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-3 mt-0.5 group-hover/item:scale-125 transition-transform duration-300">
                            <span className="text-white text-xs font-bold">✓</span>
                          </span>
                          <span>Mencetak santri berakhlak mulia dan berprestasi</span>
                        </li>
                        <li className="flex items-start group/item">
                          <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-3 mt-0.5 group-hover/item:scale-125 transition-transform duration-300">
                            <span className="text-white text-xs font-bold">✓</span>
                          </span>
                          <span>Membangun lingkungan pendidikan yang kondusif</span>
                        </li>
                      </ul>
                    )}
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-green-200 to-emerald-300 rounded-full opacity-50"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 bg-gradient-to-br from-emerald-200 to-green-300 rounded-full opacity-50"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fasilitas */}
        <section id="fasilitas" className="py-20 relative scroll-mt-32">
          {/* Section background with subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/90 to-white/80 backdrop-blur-md"></div>
          
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                Fasilitas
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Sarana dan prasarana pendukung untuk kenyamanan belajar santri
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {getFacilities().length > 0 ? (
                getFacilities().map((facility: any, idx: number) => {
                  const imageUrl = facility.image?.startsWith('http') 
                    ? facility.image 
                    : facility.image 
                      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/storage/${facility.image}`
                      : null
                  
                  const colors = [
                    'from-blue-500 to-blue-600',
                    'from-green-500 to-green-600', 
                    'from-purple-500 to-purple-600',
                    'from-red-500 to-red-600',
                    'from-yellow-500 to-yellow-600',
                    'from-indigo-500 to-indigo-600'
                  ]
                  
                  return (
                    <div key={idx} className="group relative">
                      {/* Gradient border effect */}
                      <div className={`absolute -inset-1 bg-gradient-to-r ${colors[idx % colors.length]} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`}></div>
                      
                      <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 shadow-2xl transform transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-3xl h-full">
                        {imageUrl ? (
                          <div 
                            onClick={() => setFullscreenImage(imageUrl)}
                            className="w-full h-48 rounded-xl mb-6 overflow-hidden cursor-pointer group relative"
                          >
                            <img 
                              src={imageUrl} 
                              alt={facility.name}
                              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                              draggable={false}
                            />
                            {/* Image overlay with gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            {/* Hover text */}
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <span className="text-white text-sm font-semibold flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                                Klik untuk memperbesar
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className={`w-full h-48 rounded-xl mb-6 bg-gradient-to-br ${colors[idx % colors.length]} flex items-center justify-center`}>
                            <BuildingOfficeIcon className="h-16 w-16 text-white opacity-80" />
                          </div>
                        )}
                        
                        <div className="flex items-center mb-3">
                          <div className={`w-8 h-8 bg-gradient-to-br ${colors[idx % colors.length]} rounded-lg flex items-center justify-center mr-3`}>
                            <BuildingOfficeIcon className="h-4 w-4 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                            {facility.name}
                          </h3>
                        </div>
                        
                        <p className="text-gray-600 leading-relaxed flex-grow">
                          {facility.desc}
                        </p>
                        
                        {/* Decorative elements */}
                        <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full opacity-50"></div>
                        <div className="absolute bottom-3 left-3 w-4 h-4 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full opacity-30"></div>
                      </div>
                    </div>
                  )
                })
              ) : (
                [
                  { name: 'Masjid', desc: 'Masjid besar dengan kapasitas 1000 jamaah untuk kegiatan ibadah dan pembelajaran Al-Quran', icon: BuildingOfficeIcon },
                  { name: 'Asrama Santri', desc: 'Asrama modern dan nyaman untuk santri putra dan putri dengan fasilitas lengkap', icon: BuildingOfficeIcon },
                  { name: 'Laboratorium', desc: 'Lab komputer dan sains yang lengkap dengan peralatan modern', icon: BuildingOfficeIcon },
                  { name: 'Perpustakaan', desc: 'Perpustakaan dengan koleksi kitab klasik dan buku modern yang lengkap', icon: BuildingOfficeIcon },
                  { name: 'Kantin Sehat', desc: 'Kantin dengan makanan halal, bergizi, dan higienis', icon: BuildingOfficeIcon },
                  { name: 'Lapangan Olahraga', desc: 'Lapangan multifungsi untuk berbagai kegiatan olahraga dan ekstrakurikuler', icon: BuildingOfficeIcon },
                ].map((facility, idx) => {
                  const colors = [
                    'from-blue-500 to-blue-600',
                    'from-green-500 to-green-600', 
                    'from-purple-500 to-purple-600',
                    'from-red-500 to-red-600',
                    'from-yellow-500 to-yellow-600',
                    'from-indigo-500 to-indigo-600'
                  ]
                  
                  return (
                    <div key={idx} className="group relative">
                      {/* Gradient border effect */}
                      <div className={`absolute -inset-1 bg-gradient-to-r ${colors[idx % colors.length]} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`}></div>
                      
                      <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 shadow-2xl transform transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-3xl h-full">
                        <div className={`w-full h-48 rounded-xl mb-6 bg-gradient-to-br ${colors[idx % colors.length]} flex items-center justify-center relative overflow-hidden`}>
                          <facility.icon className="h-16 w-16 text-white opacity-80 relative z-10" />
                          {/* Pattern overlay */}
                          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                          {/* Decorative circles */}
                          <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 rounded-full"></div>
                          <div className="absolute bottom-4 left-4 w-8 h-8 bg-white/10 rounded-full"></div>
                        </div>
                        
                        <div className="flex items-center mb-3">
                          <div className={`w-8 h-8 bg-gradient-to-br ${colors[idx % colors.length]} rounded-lg flex items-center justify-center mr-3`}>
                            <facility.icon className="h-4 w-4 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                            {facility.name}
                          </h3>
                        </div>
                        
                        <p className="text-gray-600 leading-relaxed flex-grow">
                          {facility.desc}
                        </p>
                        
                        {/* Decorative elements */}
                        <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full opacity-50"></div>
                        <div className="absolute bottom-3 left-3 w-4 h-4 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full opacity-30"></div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </section>

        {/* Fullscreen Image Modal */}
        {fullscreenImage && (
          <div
            onClick={() => setFullscreenImage(null)}
            className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-5 cursor-pointer backdrop-blur-sm"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
            >
              <img
                src={fullscreenImage}
                alt="Fullscreen"
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                draggable={false}
              />
              <button
                onClick={() => setFullscreenImage(null)}
                className="absolute -top-12 right-0 bg-white/90 hover:bg-white text-gray-800 hover:text-gray-900 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
                title="Tutup (ESC)"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

