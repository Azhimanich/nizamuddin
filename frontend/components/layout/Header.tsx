'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bars3Icon, XMarkIcon, ChevronDownIcon, ChevronRightIcon, ArrowRightIcon, DocumentTextIcon, AcademicCapIcon, BuildingOfficeIcon, TrophyIcon, UsersIcon, BriefcaseIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline'
import { FaInstagram, FaFacebook, FaYoutube, FaWhatsapp, FaTwitter, FaTiktok, FaLinkedin } from 'react-icons/fa'

const navigation = [
  { name: 'Beranda', href: '', id: 'home' },
  { name: 'Profil', href: '/profil', id: 'profile', hasDropdown: true },
  { name: 'Akademik', href: '/akademik', id: 'academic', hasDropdown: true },
  { name: 'Ketenagaan', href: '/ketenagaan', id: 'staff', hasDropdown: true },
  { name: 'Berita', href: '/berita', id: 'news' },
  { name: 'Galeri', href: '/galeri', id: 'gallery' },
  { name: 'Download', href: '/download', id: 'download' },
  { name: 'Kontak', href: '/kontak', id: 'contact' },
]

const profileDropdown = [
  { name: 'Sekapur Sirih', href: '/profil#sekapur-sirih', id: 'sekapur-sirih' },
  { name: 'Visi Misi', href: '/profil#visi-misi', id: 'visi-misi' },
  { name: 'Identitas Sekolah', href: '/profil#identitas-sekolah', id: 'identitas-sekolah' },
  { name: 'Fasilitas', href: '/profil#fasilitas', id: 'fasilitas' },
]

const academicDropdown = [
  { name: 'Program Unggulan', href: '/akademik#program-unggulan', id: 'program-unggulan' },
  { name: 'Kalender Akademik', href: '/akademik#kalender-akademik', id: 'kalender-akademik' },
  { name: 'Jadwal Harian', href: '/akademik#jadwal-harian', id: 'jadwal-harian' },
]

const staffDropdown = [
  { name: 'Struktur Organisasi', href: '/ketenagaan#struktur-organisasi', id: 'struktur-organisasi' },
  { name: 'Direktori Ketenagaan', href: '/ketenagaan#direktori-ketenagaan', id: 'direktori-ketenagaan' },
]

export function Header({ locale = 'id' }: { locale?: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [showSocialMedia, setShowSocialMedia] = useState(true)
  const [socialMedia, setSocialMedia] = useState<any[]>([])
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [academicDropdownOpen, setAcademicDropdownOpen] = useState(false)
  const [staffDropdownOpen, setStaffDropdownOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
      setScrolled(currentScrollY > 20)
      // Hide social media bar when scrolled down
      setShowSocialMedia(currentScrollY < 50)
      // Close all dropdowns when scrolling
      setProfileDropdownOpen(false)
      setAcademicDropdownOpen(false)
      setStaffDropdownOpen(false)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const dropdownContainer = target.closest('.dropdown-container')
      
      if (!dropdownContainer) {
        setProfileDropdownOpen(false)
        setAcademicDropdownOpen(false)
        setStaffDropdownOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setProfileDropdownOpen(false)
        setAcademicDropdownOpen(false)
        setStaffDropdownOpen(false)
      }
    }

    if (profileDropdownOpen || academicDropdownOpen || staffDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [profileDropdownOpen, academicDropdownOpen, staffDropdownOpen])

  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
        const response = await fetch(`${apiUrl}/social-media`)
        if (response.ok) {
          const data = await response.json()
          setSocialMedia(data.data || data)
        }
      } catch (error) {
        console.error('Error fetching social media:', error)
      }
    }
    fetchSocialMedia()
  }, [])

  const getIconComponent = (icon: string, name: string) => {
    const iconKey = icon.toLowerCase()
    const nameLower = name.toLowerCase()
    
    // Check by icon class name
    if (iconKey.includes('instagram')) {
      return <FaInstagram className="w-5 h-5" />
    }
    if (iconKey.includes('facebook')) {
      return <FaFacebook className="w-5 h-5" />
    }
    if (iconKey.includes('youtube')) {
      return <FaYoutube className="w-5 h-5" />
    }
    if (iconKey.includes('whatsapp')) {
      return <FaWhatsapp className="w-5 h-5" />
    }
    if (iconKey.includes('twitter')) {
      return <FaTwitter className="w-5 h-5" />
    }
    if (iconKey.includes('tiktok')) {
      return <FaTiktok className="w-5 h-5" />
    }
    if (iconKey.includes('linkedin')) {
      return <FaLinkedin className="w-5 h-5" />
    }
    
    // Check by name if icon not found
    if (nameLower.includes('instagram')) {
      return <FaInstagram className="w-5 h-5" />
    }
    if (nameLower.includes('facebook')) {
      return <FaFacebook className="w-5 h-5" />
    }
    if (nameLower.includes('youtube')) {
      return <FaYoutube className="w-5 h-5" />
    }
    if (nameLower.includes('whatsapp')) {
      return <FaWhatsapp className="w-5 h-5" />
    }
    if (nameLower.includes('twitter')) {
      return <FaTwitter className="w-5 h-5" />
    }
    if (nameLower.includes('tiktok')) {
      return <FaTiktok className="w-5 h-5" />
    }
    if (nameLower.includes('linkedin')) {
      return <FaLinkedin className="w-5 h-5" />
    }
    
    // Fallback
    return <span className="w-5 h-5 flex items-center justify-center">{name.charAt(0).toUpperCase()}</span>
  }

  const getDropdownItems = (dropdownType: string) => {
    switch (dropdownType) {
      case 'profile':
        return profileDropdown
      case 'academic':
        return academicDropdown
      case 'staff':
        return staffDropdown
      default:
        return []
    }
  }

  const getDropdownIcons = (dropdownType: string) => {
    switch (dropdownType) {
      case 'profile':
        return [
          <DocumentTextIcon key="doc" className="w-4 h-4 text-gray-600" />,
          <AcademicCapIcon key="cap" className="w-4 h-4 text-gray-600" />,
          <BuildingOfficeIcon key="build" className="w-4 h-4 text-gray-600" />,
          <TrophyIcon key="trophy" className="w-4 h-4 text-gray-600" />
        ]
      case 'academic':
        return [
          <TrophyIcon key="trophy" className="w-4 h-4 text-gray-600" />,
          <CalendarIcon key="calendar" className="w-4 h-4 text-gray-600" />,
          <ClockIcon key="clock" className="w-4 h-4 text-gray-600" />
        ]
      case 'staff':
        return [
          <UsersIcon key="users" className="w-4 h-4 text-gray-600" />,
          <BriefcaseIcon key="briefcase" className="w-4 h-4 text-gray-600" />
        ]
      default:
        return []
    }
  }

  const getDropdownState = (dropdownType: string) => {
    switch (dropdownType) {
      case 'profile':
        return profileDropdownOpen
      case 'academic':
        return academicDropdownOpen
      case 'staff':
        return staffDropdownOpen
      default:
        return false
    }
  }

  const setDropdownState = (dropdownType: string, value: boolean) => {
    switch (dropdownType) {
      case 'profile':
        setProfileDropdownOpen(value)
        break
      case 'academic':
        setAcademicDropdownOpen(value)
        break
      case 'staff':
        setStaffDropdownOpen(value)
        break
    }
  }

  const getHref = (href: string) => {
    return `/${locale}${href}`
  }

  const isActive = (href: string) => {
    const fullPath = `/${locale}${href}`
    return pathname === fullPath || (href === '' && pathname === `/${locale}`)
  }

  return (
    <>
      {/* Social Media Bar */}
      {socialMedia.length > 0 && showSocialMedia && (
        <div 
          className="fixed top-0 left-0 right-0 z-50 text-white py-3 transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, #064e3b 0%, #065f46 25%, #10b981 50%, #14b8a6 75%, #0d9488 100%)',
            transform: showSocialMedia ? 'translateY(0)' : 'translateY(-100%)',
            opacity: showSocialMedia ? 1 : 0,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            backdropFilter: 'blur(8px) saturate(150%)'
          }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-4">
                {socialMedia.map((media) => (
                  <a
                    key={media.id}
                    href={media.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:opacity-80 transition-all duration-300 text-sm font-semibold hover:scale-105 hover:bg-white/10 px-3 py-1 rounded-lg"
                    title={media.name}
                  >
                    {getIconComponent(media.icon, media.name)}
                    <span className="hidden sm:inline lowercase">{media.name.toLowerCase()}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <header
        className="fixed left-0 right-0 z-40 transition-all duration-500 ease-in-out border-b border-gray-200/50"
        style={{
          top: (socialMedia.length > 0 && showSocialMedia) ? '44px' : '0',
          backgroundColor: scrolled 
            ? `rgba(255, 255, 255, ${Math.min(0.95, 0.70 + (scrollY / 200) * 0.25)})` 
            : `rgba(255, 255, 255, ${Math.max(0.60, 0.70 - (scrollY / 100) * 0.1)})`,
          backdropFilter: scrolled ? 'blur(16px) saturate(180%)' : 'blur(8px) saturate(150%)',
          boxShadow: scrolled 
            ? `0 20px 25px -5px rgba(0, 0, 0, ${Math.min(0.15, scrollY / 500)}), 0 10px 10px -5px rgba(0, 0, 0, 0.04)` 
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transform: scrolled ? 'translateY(0)' : 'translateY(0)',
          borderBottom: scrolled ? '1px solid rgba(6, 78, 59, 0.1)' : '1px solid rgba(6, 78, 59, 0.05)',
        }}
        onMouseEnter={(e) => {
          const currentOpacity = scrolled 
            ? Math.min(0.95, 0.70 + (scrollY / 200) * 0.25)
            : Math.max(0.60, 0.70 - (scrollY / 100) * 0.1)
          e.currentTarget.style.backgroundColor = `rgba(255, 255, 255, ${Math.max(0.55, currentOpacity - 0.15)})`
        }}
        onMouseLeave={(e) => {
          const currentOpacity = scrolled 
            ? Math.min(0.95, 0.70 + (scrollY / 200) * 0.25)
            : Math.max(0.60, 0.70 - (scrollY / 100) * 0.1)
          e.currentTarget.style.backgroundColor = `rgba(255, 255, 255, ${currentOpacity})`
        }}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between py-6 lg:py-4">
          <div className="flex items-center">
            <Link href={`/${locale}`} className="flex items-center space-x-3 group">
              <div className="h-14 w-14 relative flex-shrink-0 transition-all duration-300 group-hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-emerald-600 rounded-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <img
                  src="/logo.png"
                  alt="Logo Pesantren Nizamuddin"
                  className="h-full w-full object-contain relative z-10 p-2"
                  onError={(e) => {
                    // Fallback jika logo tidak ada
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent) {
                      parent.innerHTML = '<div class="h-14 w-14 bg-gradient-to-br from-teal-400 to-emerald-600 rounded-xl flex items-center justify-center"><span class="text-white font-bold text-xl">PN</span></div>'
                    }
                  }}
                />
              </div>
              <div className="flex flex-col" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
                <span className="text-sm font-bold leading-tight" style={{ 
                  background: 'linear-gradient(135deg, #0a0a0a 0%, #064e3b 50%, #065f46 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '1px',
                  fontWeight: '800',
                  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                }}>PONDOK PESANTREN</span>
                <span className="text-sm font-bold leading-tight" style={{ 
                  background: 'linear-gradient(135deg, #065f46 0%, #064e3b 50%, #0a0a0a 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '1px',
                  fontWeight: '800',
                  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                }}>NIZAMUDDIN</span>
              </div>
            </Link>
          </div>
          
          <div className="ml-10 space-x-6 hidden lg:block items-center">
            {navigation.map((item) => (
              <div key={item.name} className="relative dropdown-container inline-block">
                {item.hasDropdown ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setDropdownState(item.id, !getDropdownState(item.id))
                      }}
                      className={`relative text-base font-semibold transition-all duration-300 py-2 px-3 rounded-lg flex items-center gap-1 inline-block align-middle leading-none ${
                        isActive(item.href)
                          ? 'text-emerald-600 bg-emerald-50 shadow-sm'
                          : 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50'
                      }`}
                      style={{
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <span className="relative z-10">{item.name}</span>
                      <ChevronDownIcon 
                        className={`w-4 h-4 transition-transform duration-200 ${
                          getDropdownState(item.id) ? 'rotate-180' : ''
                        }`} 
                      />
                      {isActive(item.href) && (
                        <div 
                          className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-lg"
                          style={{ zIndex: -1 }}
                        />
                      )}
                    </button>
                    
                    {/* Dropdown Menu */}
                    {getDropdownState(item.id) && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-[70]">
                        <div className="py-2">
                          {getDropdownItems(item.id).map((dropdownItem, index) => {
                            const icons = getDropdownIcons(item.id)
                            
                            return (
                              <Link
                                key={dropdownItem.id}
                                href={getHref(dropdownItem.href)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-200"
                                onClick={() => setDropdownState(item.id, false)}
                              >
                                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                  {icons[index]}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-gray-900">
                                    {dropdownItem.name}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    {item.id === 'profile' && (
                                      <>
                                        {dropdownItem.id === 'sekapur-sirih' && 'Sambutan pimpinan'}
                                        {dropdownItem.id === 'visi-misi' && 'Tujuan dan target'}
                                        {dropdownItem.id === 'identitas-sekolah' && 'Data resmi sekolah'}
                                        {dropdownItem.id === 'fasilitas' && 'Sarana pendukung'}
                                      </>
                                    )}
                                    {item.id === 'academic' && (
                                      <>
                                        {dropdownItem.id === 'program-unggulan' && 'Program terbaik sekolah'}
                                        {dropdownItem.id === 'kalender-akademik' && 'Jadwal akademik tahunan'}
                                        {dropdownItem.id === 'jadwal-harian' && 'Rutinitas harian santri'}
                                      </>
                                    )}
                                    {item.id === 'staff' && (
                                      <>
                                        {dropdownItem.id === 'struktur-organisasi' && 'Struktur organisasi'}
                                        {dropdownItem.id === 'direktori-ketenagaan' && 'Daftar tenaga pendidik'}
                                      </>
                                    )}
                                  </div>
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={getHref(item.href)}
                    className={`relative text-base font-semibold transition-all duration-300 py-2 px-3 rounded-lg inline-block align-middle leading-none ${
                      isActive(item.href)
                        ? 'text-emerald-600 bg-emerald-50 shadow-sm'
                        : 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50'
                    }`}
                    style={{
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <span className="relative z-10">{item.name}</span>
                    {isActive(item.href) && (
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-lg"
                        style={{ zIndex: -1 }}
                      />
                    )}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="ml-6 lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl p-3 text-gray-700 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 transition-all duration-300 shadow-sm hover:shadow-md"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-emerald-100 relative z-[60] mobile-menu-container" style={{ pointerEvents: 'auto' }}>
            <div className="space-y-2 px-4 py-4">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.hasDropdown ? (
                    <div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setDropdownState(item.id, !getDropdownState(item.id))
                        }}
                        className={`w-full rounded-xl px-4 py-3 text-base font-semibold transition-all duration-300 flex items-center justify-between cursor-pointer hover:shadow-md ${
                          isActive(item.href)
                            ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-600 shadow-sm'
                            : 'text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-600'
                        }`}
                        style={{ pointerEvents: 'auto' }}
                      >
                        <span>{item.name}</span>
                        <ChevronDownIcon 
                          className={`w-4 h-4 transition-transform duration-200 ${
                            getDropdownState(item.id) ? 'rotate-180' : ''
                          }`} 
                        />
                      </button>
                      
                      {/* Mobile Dropdown */}
                      {getDropdownState(item.id) && (
                        <div className="mt-2 ml-4 space-y-1">
                          {getDropdownItems(item.id).map((dropdownItem, index) => {
                            const icons = getDropdownIcons(item.id)
                            
                            return (
                              <Link
                                key={dropdownItem.id}
                                href={getHref(dropdownItem.href)}
                                className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-200 cursor-pointer"
                                style={{ pointerEvents: 'auto' }}
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  setDropdownState(item.id, false)
                                  setMobileMenuOpen(false)
                                  // Navigate manually
                                  window.location.href = getHref(dropdownItem.href)
                                }}
                              >
                                <div className="w-6 h-6 bg-gray-50 rounded-md flex items-center justify-center flex-shrink-0">
                                  {icons[index]}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-gray-900 text-sm">
                                    {dropdownItem.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {item.id === 'profile' && (
                                      <>
                                        {dropdownItem.id === 'sekapur-sirih' && 'Sambutan pimpinan'}
                                        {dropdownItem.id === 'visi-misi' && 'Tujuan dan target'}
                                        {dropdownItem.id === 'identitas-sekolah' && 'Data resmi sekolah'}
                                        {dropdownItem.id === 'fasilitas' && 'Sarana pendukung'}
                                      </>
                                    )}
                                    {item.id === 'academic' && (
                                      <>
                                        {dropdownItem.id === 'program-unggulan' && 'Program terbaik sekolah'}
                                        {dropdownItem.id === 'kalender-akademik' && 'Jadwal akademik tahunan'}
                                        {dropdownItem.id === 'jadwal-harian' && 'Rutinitas harian santri'}
                                      </>
                                    )}
                                    {item.id === 'staff' && (
                                      <>
                                        {dropdownItem.id === 'struktur-organisasi' && 'Struktur organisasi'}
                                        {dropdownItem.id === 'direktori-ketenagaan' && 'Daftar tenaga pendidik'}
                                      </>
                                    )}
                                  </div>
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={getHref(item.href)}
                      className={`block rounded-xl px-4 py-3 text-base font-semibold transition-all duration-300 cursor-pointer ${
                        isActive(item.href)
                          ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-600 shadow-sm'
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-600'
                      }`}
                      style={{ pointerEvents: 'auto' }}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setMobileMenuOpen(false)
                        // Navigate manually
                        window.location.href = getHref(item.href)
                      }}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        </nav>
      </header>
    </>
  )
}

