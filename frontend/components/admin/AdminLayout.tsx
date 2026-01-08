'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getAuthToken, getUserData, clearAuthData, syncSessionStorage } from '@/lib/auth'

interface AdminLayoutProps {
  children: React.ReactNode
}

const menuItems = [
  // Super Admin
  { name: 'Dashboard', href: '/admin/dashboard', icon: '📊', roles: ['super_admin', 'admin_akademik', 'admin_humas'] },
  { name: 'Manajemen User', href: '/admin/users', icon: '👥', roles: ['super_admin'] },
  { name: 'Manajemen Role', href: '/admin/roles', icon: '👑', roles: ['super_admin'] },
  { name: 'Manajemen Permission', href: '/admin/permissions', icon: '🔐', roles: ['super_admin'] },
  { name: 'Log Aktivitas', href: '/admin/logs', icon: '📝', roles: ['super_admin'] },
  { name: 'Statistik', href: '/admin/statistics', icon: '📈', roles: ['super_admin'] },
  { name: 'Pengaturan', href: '/admin/settings', icon: '⚙️', roles: ['super_admin'] },
  // Admin Humas - Homepage (dipindah ke atas)
  { name: 'Slider Beranda', href: '/admin/sliders', icon: '🖼️', roles: ['super_admin', 'admin_humas'] },
  { name: 'Social Media', href: '/admin/social-media', icon: '📱', roles: ['super_admin', 'admin_humas'] },
  { name: 'Manajemen Profil', href: '/admin/profiles', icon: '📋', roles: ['super_admin', 'admin_humas'] },
  // Admin Akademik
  { name: 'Manajemen SDM', href: '/admin/staff', icon: '👨‍🏫', roles: ['super_admin', 'admin_akademik'] },
  { name: 'Program Unggulan', href: '/admin/programs', icon: '⭐', roles: ['super_admin', 'admin_akademik'] },
  { name: 'Kalender Akademik', href: '/admin/calendar', icon: '📅', roles: ['super_admin', 'admin_akademik'] },
  { name: 'Jadwal Harian', href: '/admin/daily-schedules', icon: '⏰', roles: ['super_admin', 'admin_akademik'] },
  // Admin Humas
  { name: 'Manajemen Berita', href: '/admin/news', icon: '📰', roles: ['super_admin', 'admin_humas'] },
  { name: 'Agenda', href: '/admin/agenda', icon: '📋', roles: ['super_admin', 'admin_humas'] },
  { name: 'Galeri', href: '/admin/gallery', icon: '🖼️', roles: ['super_admin', 'admin_humas'] },
  { name: 'Download Center', href: '/admin/downloads', icon: '📥', roles: ['super_admin', 'admin_humas'] },
  { name: 'Manajemen Kontak', href: '/admin/contacts', icon: '📧', roles: ['super_admin'] },
  { name: 'Pendaftaran PSB', href: '/admin/psb-registrations', icon: '📝', roles: ['super_admin', 'admin_akademik'] },
  { name: 'PSB Requirements', href: '/admin/psb-requirements', icon: '📋', roles: ['super_admin', 'admin_akademik'] },
  { name: 'PSB Header', href: '/admin/psb-header', icon: '🏷️', roles: ['super_admin', 'admin_akademik'] },
  { name: 'PSB FAQ', href: '/admin/psb-faqs', icon: '❓', roles: ['super_admin', 'admin_akademik'] },
  { name: 'WhatsApp Blast', href: '/admin/whatsapp', icon: '💬', roles: ['super_admin', 'admin_humas'] },
]

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    console.log('AdminLayout useEffect started')
    
    // Sync sessionStorage dari localStorage backup
    syncSessionStorage()
    
    // Cek auth
    const token = getAuthToken()
    const userData = getUserData()
    
    console.log('AdminLayout - Token:', token ? 'exists' : 'missing')
    console.log('AdminLayout - User data:', userData ? 'exists' : 'missing')
    
    if (!token || !userData) {
      console.log('AdminLayout - No auth data, redirecting to login')
      router.push('/admin/login')
      return
    }

    console.log('AdminLayout - Setting user data:', userData)
    setUser(userData)
  }, [router])

  // Storage event listener untuk sync logout antar tab
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Jika auth_token_backup dihapus (logout dari tab lain)
      if (e.key === 'auth_token_backup' && !e.newValue) {
        clearAuthData()
        router.push('/admin/login')
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [router])

  const handleLogout = () => {
    clearAuthData()
    router.push('/admin/login')
  }

  const userRoles = user?.roles?.map((r: any) => {
    // Handle both string and object formats
    if (typeof r === 'string') return r
    if (typeof r === 'object' && r?.name) return r.name
    return r
  }).filter(Boolean) || []

  // Fallback: jika user tidak memiliki roles, berikan default role berdasarkan email
  if (userRoles.length === 0 && user?.email) {
    if (user.email === 'admin@pesantren.com') {
      userRoles.push('super_admin')
    } else if (user.email?.includes('humas') || user.email?.includes('komunikasi')) {
      userRoles.push('admin_humas')
    } else if (user.email?.includes('akademik') || user.email?.includes('pendidikan')) {
      userRoles.push('admin_akademik')
    }
  }

  // Last resort: jika masih tidak ada role, berikan dashboard saja
  if (userRoles.length === 0) {
    userRoles.push('admin_humas') // Default fallback
  }

  const filteredMenu = menuItems.filter(item => 
    item.roles.some(role => userRoles.includes(role))
  )

  // Debug: Log untuk mengecek user dan menu
  console.log('AdminLayout - User:', user)
  console.log('AdminLayout - User Roles:', userRoles)
  console.log('AdminLayout - Filtered Menu:', filteredMenu)

  if (!user) {
    return null
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '260px' : '80px',
        backgroundColor: '#1e293b',
        color: 'white',
        transition: 'width 0.3s',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto',
        zIndex: 1000,
        minWidth: sidebarOpen ? '260px' : '80px',
        borderRight: '1px solid #334155'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {sidebarOpen && (
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Admin Panel</h2>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '20px',
                padding: '4px'
              }}
            >
              {sidebarOpen ? '◀' : '▶'}
            </button>
          </div>
        </div>

        <nav style={{ padding: '10px 0' }}>
          {filteredMenu.length > 0 ? (
            filteredMenu.map((item) => {
              const isActive = pathname === item.href
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault()
                    router.push(item.href)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 20px',
                    color: isActive ? '#60a5fa' : '#cbd5e1',
                    backgroundColor: isActive ? '#1e3a8a' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    borderLeft: isActive ? '3px solid #60a5fa' : '3px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#334155'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  <span style={{ fontSize: '20px', marginRight: sidebarOpen ? '12px' : '0', minWidth: '24px' }}>
                    {item.icon}
                  </span>
                  {sidebarOpen && (
                    <span style={{ fontSize: '14px', fontWeight: isActive ? '600' : '400' }}>
                      {item.name}
                    </span>
                  )}
                </a>
              )
            })
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#cbd5e1' }}>
              <p style={{ fontSize: '14px', margin: 0 }}>Tidak ada menu tersedia</p>
              <p style={{ fontSize: '12px', margin: '4px 0 0 0', color: '#94a3b8' }}>
                Role: {userRoles.join(', ') || 'Tidak ada role'}
              </p>
            </div>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <div style={{
        marginLeft: sidebarOpen ? '260px' : '80px',
        flex: 1,
        transition: 'margin-left 0.3s'
      }}>
        {/* Header */}
        <header style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#111827' }}>
              {filteredMenu.find(m => m.href === pathname)?.name || 'Dashboard'}
            </h1>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
              Selamat datang, <strong>{user?.name}</strong>
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </header>

        {/* Page Content */}
        <main style={{ padding: '24px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}

