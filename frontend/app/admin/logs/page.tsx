'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { DataTable } from '@/components/admin/DataTable'

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    const token = localStorage.getItem('auth_token')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/logs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setLogs(data.data || data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 24px 0' }}>Log Aktivitas</h1>
        <DataTable
          columns={[
            { key: 'user', label: 'User', render: (v) => v?.name || 'System' },
            { key: 'action', label: 'Aksi' },
            { key: 'description', label: 'Deskripsi' },
            { key: 'created_at', label: 'Waktu', render: (v) => new Date(v).toLocaleString('id-ID') }
          ]}
          data={logs}
          loading={loading}
        />
      </div>
    </AdminLayout>
  )
}

