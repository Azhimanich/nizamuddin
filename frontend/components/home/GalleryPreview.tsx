'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { OptimizedImage } from '@/components/ui/OptimizedImage'

export function GalleryPreview() {
  const [photos, setPhotos] = useState<any[]>([])
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/gallery/photos`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Set semua foto tanpa limit
          setPhotos(data)
        }
      })
      .catch(() => {})
  }, [])

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
    <section className="py-20 relative">
      {/* Section background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white/90 to-blue-50/50 backdrop-blur-md"></div>
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-extrabold mb-4" style={{ 
              background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              <span className="text-5xl mr-3">📸</span>
              Galeri Foto
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              Dokumentasi kegiatan dan momen berharga di pesantren
            </p>
          </div>
          <Link
            href="/galeri"
            className="hidden md:flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:-translate-y-1"
          >
            <span>Lihat Semua</span>
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>

        {/* Auto-scrolling Carousel */}
        <div 
          className="relative overflow-hidden w-full gallery-wrapper"
          style={{
            '--animation-duration': photos.length > 0 ? `${Math.max(photos.length * 2, 40)}s` : '60s'
          } as React.CSSProperties}
        >
          <div className="flex gap-4 gallery-scroll">
            {photos.length > 0 ? (
              <>
                {/* First set - all photos */}
                {photos.map((photo, index) => {
                  const imageUrl = photo.image?.startsWith('http') 
                    ? photo.image 
                    : photo.image 
                      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/storage/${photo.image}`
                      : null
                  return (
                    <div
                      key={`photo-${photo.id || index}-1`}
                      onClick={() => imageUrl && setFullscreenImage(imageUrl)}
                      className="flex-shrink-0 w-[260px] md:w-[280px] aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group relative"
                      title="Klik untuk melihat gambar penuh"
                    >
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                      
                      {/* View indicator */}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
                        <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                      
                      {imageUrl ? (
                        <OptimizedImage 
                          src={photo.image} 
                          alt={photo.title || 'Photo'} 
                          width={280}
                          height={280}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                          <span className="text-white text-4xl">📷</span>
                        </div>
                      )}
                    </div>
                  )
                })}
                {/* Duplicate set for seamless infinite loop */}
                {photos.map((photo, index) => {
                  const imageUrl = photo.image?.startsWith('http') 
                    ? photo.image 
                    : photo.image 
                      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/storage/${photo.image}`
                      : null
                  return (
                    <div
                      key={`photo-${photo.id || index}-2`}
                      onClick={() => imageUrl && setFullscreenImage(imageUrl)}
                      className="flex-shrink-0 w-[260px] md:w-[280px] aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group relative"
                      aria-hidden="true"
                      title="Klik untuk melihat gambar penuh"
                    >
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                      
                      {/* View indicator */}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
                        <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                      
                      {imageUrl ? (
                        <OptimizedImage 
                          src={photo.image} 
                          alt={photo.title || 'Photo'} 
                          width={280}
                          height={280}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                          <span className="text-white text-4xl">📷</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </>
            ) : (
              Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="flex-shrink-0 w-[260px] md:w-[280px] aspect-square rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-emerald-100 to-blue-100 animate-pulse"
                />
              ))
            )}
          </div>
        </div>

        <style jsx>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          
          .gallery-wrapper {
            mask-image: linear-gradient(
              to right,
              transparent 0%,
              black 5%,
              black 95%,
              transparent 100%
            );
            -webkit-mask-image: linear-gradient(
              to right,
              transparent 0%,
              black 5%,
              black 95%,
              transparent 100%
            );
          }
          
          .gallery-scroll {
            display: flex;
            gap: 1rem;
            width: fit-content;
            animation: scroll var(--animation-duration, 60s) linear infinite;
          }
          
          .gallery-wrapper:hover .gallery-scroll {
            animation-play-state: paused;
          }
        `}</style>
        
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/galeri"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
          >
            <span>Lihat Semua Foto</span>
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>

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
    </section>
  )
}
