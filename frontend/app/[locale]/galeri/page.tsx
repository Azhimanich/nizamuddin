'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/layout/Layout'
import { PhotoIcon, VideoCameraIcon } from '@heroicons/react/24/outline'

export default function GaleriPage({ params }: { params: { locale: string } }) {
  const locale = params?.locale || 'id'
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos')
  const [photos, setPhotos] = useState<any[]>([])
  const [videos, setVideos] = useState<any[]>([])
  const [albums, setAlbums] = useState<any[]>([])
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)

  useEffect(() => {
    if (activeTab === 'photos') {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/gallery/photos`)
        .then(res => res.json())
        .then(data => setPhotos(Array.isArray(data) ? data : []))
        .catch(() => {})
      
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/gallery`)
        .then(res => res.json())
        .then(data => setAlbums(Array.isArray(data) ? data : []))
        .catch(() => {})
    } else {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/gallery/videos`)
        .then(res => res.json())
        .then(data => setVideos(Array.isArray(data) ? data : []))
        .catch(() => {})
    }
  }, [activeTab])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && fullscreenImage) {
        setFullscreenImage(null)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [fullscreenImage])

  return (
    <Layout locale={locale}>
      <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 text-center">Galeri</h1>
            <p className="text-xl text-gray-600 text-center mb-12">
              Dokumentasi kegiatan dan momen berharga di pesantren
            </p>

            {/* Tabs */}
            <div className="flex justify-center mb-12">
              <div className="bg-gray-100 rounded-lg p-1 inline-flex">
                <button
                  onClick={() => setActiveTab('photos')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 flex items-center ${
                    activeTab === 'photos'
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <PhotoIcon className="h-5 w-5 mr-2" />
                  Foto
                </button>
                <button
                  onClick={() => setActiveTab('videos')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 flex items-center ${
                    activeTab === 'videos'
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <VideoCameraIcon className="h-5 w-5 mr-2" />
                  Video
                </button>
              </div>
            </div>

            {/* Photos */}
            {activeTab === 'photos' && (
              <div>
                {albums.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Album Foto</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {albums.map((album) => (
                        <div key={album.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                          <div className="aspect-video bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                            <span className="text-white text-6xl">📷</span>
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{album.name}</h3>
                            {album.description && (
                              <p className="text-gray-600 text-sm">{album.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <h2 className="text-2xl font-bold text-gray-900 mb-6">Semua Foto</h2>
                {photos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {photos.map((photo, idx) => {
                      const imageUrl = photo.image?.startsWith('http') 
                        ? photo.image 
                        : photo.image 
                          ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/storage/${photo.image}`
                          : null
                      return (
                        <div
                          key={photo.id || idx}
                          onClick={() => imageUrl && setFullscreenImage(imageUrl)}
                          className="aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
                          title="Klik untuk melihat gambar penuh"
                        >
                          {imageUrl ? (
                            <img 
                              src={imageUrl} 
                              alt={photo.title || 'Photo'} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                              draggable={false}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                              <span className="text-white text-4xl">📷</span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <PhotoIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Belum ada foto tersedia</p>
                  </div>
                )}
              </div>
            )}

            {/* Videos */}
            {activeTab === 'videos' && (
              <div>
                {videos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {videos.map((video) => (
                      <div key={video.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                        <div className="aspect-video bg-gray-900 flex items-center justify-center">
                          {(() => {
                            let videoUrl = video.youtube_id;
                            
                            // Handle different YouTube URL formats
                            if (videoUrl.includes('youtube.com/watch?v=')) {
                              videoUrl = videoUrl.split('v=')[1]?.split('&')[0];
                            } else if (videoUrl.includes('youtu.be/')) {
                              videoUrl = videoUrl.split('youtu.be/')[1]?.split('?')[0];
                            } else if (videoUrl.includes('youtube.com/embed/')) {
                              videoUrl = videoUrl.split('embed/')[1]?.split('?')[0];
                            }
                            
                            // If we have a valid video ID, embed it
                            if (videoUrl && videoUrl.length > 0) {
                              return (
                                <iframe
                                  width="100%"
                                  height="100%"
                                  src={`https://www.youtube.com/embed/${videoUrl}`}
                                  title={video.title}
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              );
                            } else {
                              return (
                                <div className="text-white text-center p-4">
                                  <p className="text-red-400">Video URL tidak valid</p>
                                  <p className="text-sm text-gray-400 mt-2">ID: {video.youtube_id}</p>
                                </div>
                              );
                            }
                          })()}
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{video.title}</h3>
                          {video.description && (
                            <p className="text-gray-600 text-sm">{video.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <VideoCameraIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Belum ada video tersedia</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Fullscreen Image Modal */}
        {fullscreenImage && (
          <div
            onClick={() => setFullscreenImage(null)}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-5 cursor-pointer"
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
                className="absolute -top-12 right-0 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full w-9 h-9 flex items-center justify-center text-gray-700 font-bold text-xl shadow-lg transition-all"
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

