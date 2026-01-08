'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AcademicCapIcon, BookOpenIcon, SparklesIcon, UserGroupIcon, TrophyIcon } from '@heroicons/react/24/outline'

export function Programs() {
  const [programs, setPrograms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
    fetch(`${apiUrl}/academic`)
      .then((res) => res.json())
      .then((data) => {
        if (data.programs && data.programs.length > 0) {
          setPrograms(data.programs)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  const getProgramIcon = (index: number) => {
    const icons = [AcademicCapIcon, BookOpenIcon, SparklesIcon, UserGroupIcon, TrophyIcon]
    return icons[index % icons.length]
  }

  const getProgramColor = (index: number) => {
    const colors = [
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-red-500 to-red-600',
      'from-yellow-500 to-yellow-600',
      'from-indigo-500 to-indigo-600',
      'from-pink-500 to-pink-600'
    ]
    return colors[index % colors.length]
  }

  if (loading) {
    return (
      <section className="py-12 relative">
        {/* Section background with subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/90 to-white/80 backdrop-blur-md"></div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center pb-12" style={{ padding: '20px 0 48px 0', minHeight: '80px' }}>
            <h2 className="text-5xl font-extrabold text-gray-900 mb-3 bg-gray-400 pb-0 leading-none overflow-visible w-full break-words" style={{ backgroundColor: '#e5e7eb', color: '#111827', padding: '16px 24px', borderRadius: '12px', display: 'inline-block' }}>
              Program Unggulan
            </h2>
          </div>
          
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,theme(colors.amber.100/0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,theme(colors.blue.100/0.3),transparent_50%)]"></div>
      </div>
      
      <div className="relative z-10 w-full">
        {/* Animated section header */}
        <div className="text-center mb-16 animate-fade-in-up px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4">
            Program Unggulan
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-6 lg:px-8">
          {programs.length > 0 ? (
            programs.map((program, index) => {
              const imageUrl = program.image || null
              const Icon = getProgramIcon(index)
              const color = getProgramColor(index)
              
              return (
                <div
                  key={program.id}
                  className="group animate-fade-in-up h-full"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative preserve-3d transition-all duration-1000 transform-gpu group-hover:rotate-y-12 group-hover:rotate-x-6 h-full">
                    {/* Animated border glow */}
                    <div className={`absolute -inset-1 bg-gradient-to-r ${color} rounded-3xl opacity-0 group-hover:opacity-60 blur-xl transition-all duration-700 animate-pulse`}></div>
                    
                    <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-3xl transition-all duration-700 overflow-hidden border border-white/20 h-full flex flex-col">
                      {/* 3D-like image section with parallax */}
                      <div className="relative h-56 md:h-64 overflow-hidden">
                        {imageUrl ? (
                          <>
                            <img 
                              src={imageUrl} 
                              alt={program.name} 
                              className="w-full h-full object-cover transition-all duration-1500 group-hover:scale-125 group-hover:brightness-110"
                            />
                            {/* Dynamic gradient overlays */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-all duration-700"></div>
                            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-20 transition-all duration-1000 mix-blend-overlay`}></div>
                            
                            {/* Floating elements */}
                            <div className="absolute top-4 right-4 w-16 h-16 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-8 rotate-45 group-hover:translate-y-0 group-hover:rotate-0 transition-all duration-700 shadow-2xl">
                              <Icon className={`h-8 w-8 bg-gradient-to-br ${color} bg-clip-text text-transparent`} />
                            </div>
                            
                            {/* Animated corner decorations */}
                            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-white/50 opacity-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-150"></div>
                            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-white/50 opacity-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-150"></div>
                            
                            {/* Program title overlay on image */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-all duration-700">
                              <h3 className="text-white text-2xl font-bold drop-shadow-lg">{program.name}</h3>
                            </div>
                          </>
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${color} relative overflow-hidden`}>
                            {/* Animated geometric patterns */}
                            <div className="absolute inset-0">
                              <div className="absolute top-4 right-4 w-24 h-24 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0.6s' }}></div>
                              <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/10 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ping" style={{ animationDuration: '3s' }}></div>
                            </div>
                            
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Icon className="h-24 w-24 text-white opacity-90 animate-pulse" />
                            </div>
                            
                            {/* Program title overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/30 backdrop-blur-sm">
                              <h3 className="text-white text-xl font-bold">{program.name}</h3>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Enhanced content section */}
                      <div className="p-5 relative flex-1 flex flex-col">
                        {/* Background pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white/50 rounded-b-3xl"></div>
                        
                        <div className="relative z-10 flex-1 flex flex-col">
                          <div className="flex items-center mb-3">
                            <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mr-3 shadow-lg transform group-hover:rotate-180 transition-transform duration-700`}>
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 group-hover:bg-clip-text transition-all duration-500">
                                {program.name}
                              </h3>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-4 flex-1">
                            {program.description ? program.description.substring(0, 80) + (program.description.length > 80 ? '...' : '') : 'Program unggulan kami'}
                          </p>
                          
                          {/* Enhanced hover indicator */}
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center text-amber-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                              <span>Eksplorasi</span>
                              <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </div>
                            
                            {/* Animated dots */}
                            <div className="flex space-x-1">
                              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${color} opacity-30 group-hover:opacity-100 transition-opacity duration-300`}></div>
                              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${color} opacity-30 group-hover:opacity-100 transition-opacity duration-300`} style={{ transitionDelay: '100ms' }}></div>
                              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${color} opacity-30 group-hover:opacity-100 transition-opacity duration-300`} style={{ transitionDelay: '200ms' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1500"></div>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="col-span-full text-center py-16 animate-fade-in-up">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-16 max-w-2xl mx-auto border border-white/20 shadow-xl">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                  <BookOpenIcon className="h-12 w-12 text-white opacity-80" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4">Belum Ada Program</h3>
                <p className="text-gray-600">Program unggulan akan segera tersedia</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(50px) rotateX(-10deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotateX(0deg);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
        
        .preserve-3d {
          transform-style: preserve-3d;
          perspective: 1000px;
        }
        
        .group:hover .group-hover\:rotate-y-12 {
          transform: rotateY(12deg);
        }
        
        .group:hover .group-hover\:rotate-x-6 {
          transform: rotateX(-6deg);
        }
        
        .transform-gpu {
          transform: translateZ(0);
          will-change: transform;
        }
      `}</style>
    </section>
  )
}

