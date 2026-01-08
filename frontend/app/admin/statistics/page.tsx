'use client'

import { useState, useEffect } from 'react'

import { getAuthToken } from '@/lib/auth'
import { AdminLayout } from '@/components/admin/AdminLayout'

export default function StatisticsPage() {
  const [stats, setStats] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    const token = getAuthToken()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/statistics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setStats(data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Memuat statistik...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 24px 0' }}>Statistik Pengunjung</h1>
        
        {stats.visitors && stats.visitors.length > 0 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            border: '1px solid #e5e7eb'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Pengunjung 30 Hari Terakhir</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {stats.visitors.map((visitor: any, index: number) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px'
                }}>
                  <span>{new Date(visitor.date).toLocaleDateString('id-ID')}</span>
                  <span style={{ fontWeight: 'bold' }}>{visitor.count} kunjungan</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {stats.top_downloads && stats.top_downloads.length > 0 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e5e7eb'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>File Paling Banyak Diunduh</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {stats.top_downloads.map((download: any, index: number) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px'
                }}>
                  <span>{download.title}</span>
                  <span style={{ fontWeight: 'bold' }}>{download.download_count} download</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}



