'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { getAuthToken, getUserData, syncSessionStorage } from '@/lib/auth'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('Dashboard useEffect started')
    
    // Sync sessionStorage dari localStorage backup
    syncSessionStorage()
    
    // Cek auth menggunakan helper functions
    const token = getAuthToken()
    const userData = getUserData()
    
    console.log('Token:', token ? 'exists' : 'missing')
    console.log('User data:', userData ? 'exists' : 'missing')

    if (!token || !userData) {
      console.log('No auth data, redirecting to login')
      router.push('/admin/login')
      return
    }

    console.log('User data:', userData)
    setUser(userData)

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [router])

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid #e5e7eb',
              borderTopColor: '#0284c7',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p style={{ color: '#6b7280' }}>Memuat dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const statCards = [
    {
      title: 'Total Berita',
      value: stats.total_news || 0,
      icon: '📰',
      color: '#0284c7',
      bgColor: '#dbeafe'
    },
    {
      title: 'Berita Terbit',
      value: stats.published_news || 0,
      icon: '✅',
      color: '#16a34a',
      bgColor: '#dcfce7'
    },
    {
      title: 'Total Download',
      value: stats.total_downloads || 0,
      icon: '📥',
      color: '#2563eb',
      bgColor: '#dbeafe'
    },
    {
      title: 'Pesan Baru',
      value: stats.unread_contacts || 0,
      icon: '💬',
      color: '#ea580c',
      bgColor: '#ffedd5'
    }
  ]

  return (
    <AdminLayout>
      <div>
        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {statCards.map((card, index) => (
            <div
              key={index}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0' }}>
                    {card.title}
                  </p>
                  <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                    {card.value}
                  </p>
                </div>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  backgroundColor: card.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px'
                }}>
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          marginBottom: '32px'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 20px 0', color: '#111827' }}>
            Quick Actions
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px'
          }}>
            <a
              href="/admin/news"
              onClick={(e) => {
                e.preventDefault()
                router.push('/admin/news')
              }}
              style={{
                display: 'block',
                padding: '16px',
                backgroundColor: '#f3f4f6',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#111827',
                fontWeight: '500',
                transition: 'background-color 0.2s',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            >
              ➕ Buat Berita Baru
            </a>
            <a
              href="/admin/gallery"
              onClick={(e) => {
                e.preventDefault()
                router.push('/admin/gallery')
              }}
              style={{
                display: 'block',
                padding: '16px',
                backgroundColor: '#f3f4f6',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#111827',
                fontWeight: '500',
                transition: 'background-color 0.2s',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            >
              📸 Upload Foto
            </a>
            <a
              href="/admin/downloads"
              onClick={(e) => {
                e.preventDefault()
                router.push('/admin/downloads')
              }}
              style={{
                display: 'block',
                padding: '16px',
                backgroundColor: '#f3f4f6',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#111827',
                fontWeight: '500',
                transition: 'background-color 0.2s',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            >
              📄 Upload File
            </a>
          </div>
        </div>

        {/* Recent Activities */}
        {stats.recent_activities && stats.recent_activities.length > 0 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 20px 0', color: '#111827' }}>
              Aktivitas Terkini
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {stats.recent_activities.slice(0, 5).map((activity: any, index: number) => (
                <div
                  key={index}
                  style={{
                    padding: '12px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <p style={{ margin: 0, fontSize: '14px', color: '#111827' }}>
                    <strong>{activity.user_name || 'System'}</strong> - {activity.description || activity.action}
                  </p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
                    {new Date(activity.created_at).toLocaleString('id-ID')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </AdminLayout>
  )
}
