'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { DataTable } from '@/components/admin/DataTable'
import { Modal } from '@/components/admin/Modal'
import { getAuthToken } from '@/lib/auth'

export default function AgendaPage() {
  const [agendas, setAgendas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    const token = getAuthToken()
    try {
      // Fetch from calendar instead of agenda
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/calendar`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      // Filter only active calendars and map to agenda format
      const calendarData = (data.data || data).filter((item: any) => item.is_active)
      setAgendas(calendarData.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        date: item.start_date,
        time: item.start_date ? new Date(item.start_date).toTimeString().slice(0, 5) : '',
        location: '',
        type: item.type
      })))
      setLoading(false)
    } catch (err) { setLoading(false) }
  }

  return (
    <AdminLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Manajemen Agenda</h1>
          <a
            href="/admin/calendar"
            style={{ padding: '10px 20px', backgroundColor: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', textDecoration: 'none' }}
          >
            📅 Kelola Kalender Akademik
          </a>
        </div>
        <DataTable 
          columns={[
            { key: 'title', label: 'Judul' }, 
            { key: 'date', label: 'Tanggal', render: (v) => v ? new Date(v).toLocaleDateString('id-ID') : '-' }, 
            { key: 'type', label: 'Tipe', render: (v) => v === 'activity' ? 'Kegiatan' : v === 'exam' ? 'Ujian' : v === 'holiday' ? 'Libur' : v }
          ]}
          data={agendas} 
          onEdit={undefined}
          onDelete={undefined}
          loading={loading} 
        />
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Catatan:</strong> Agenda diambil dari Kalender Akademik. Untuk mengelola agenda, silakan buka menu <strong>Kalender Akademik</strong>.
          </p>
        </div>
      </div>
    </AdminLayout>
  )
}

