'use client'

import { useEffect, useState } from 'react'

import { getAuthToken } from '@/lib/auth'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { useToast } from '@/components/admin/Toast'

export default function PsbHeaderPage() {
  const { Toast, showSuccess, showError } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [academicYear, setAcademicYear] = useState('2024/2025')

  useEffect(() => {
    fetchSetting()
  }, [])

  const fetchSetting = async () => {
    try {
      setLoading(true)
      const token = getAuthToken()

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/psb-header`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const json = await res.json()
      if (json.success) {
        setAcademicYear(json.data?.academic_year || '2024/2025')
      } else {
        showError(json.message || 'Gagal memuat setting PSB header')
      }
    } catch (e) {
      showError('Terjadi kesalahan saat memuat setting')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const token = getAuthToken()

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/psb-header`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ academic_year: academicYear })
      })

      const json = await res.json()
      if (json.success) {
        showSuccess('Tahun ajaran PSB berhasil diperbarui')
        setAcademicYear(json.data?.academic_year || academicYear)
      } else {
        const msg = json?.errors?.academic_year?.[0] || json.message || 'Gagal menyimpan'
        showError(msg)
      }
    } catch (e) {
      showError('Terjadi kesalahan saat menyimpan')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        {Toast}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', color: '#6b7280' }}>
          Memuat...
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      {Toast}
      <div style={{ maxWidth: '720px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0, color: '#111827' }}>Header PSB</h1>
          <p style={{ margin: '6px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
            Atur tahun ajaran yang tampil di header PSB (tagline & badge).
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '18px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '6px' }}>
            Tahun Ajaran (format: 2024/2025)
          </label>
          <input
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            placeholder="2026/2027"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '10px',
              fontSize: '14px'
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                backgroundColor: saving ? '#93c5fd' : '#0284c7',
                color: 'white',
                padding: '10px 14px',
                borderRadius: '10px',
                border: 'none',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 700
              }}
            >
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>

          <div style={{ marginTop: '14px', color: '#6b7280', fontSize: '13px' }}>
            Preview:
            <div style={{ marginTop: '6px', fontWeight: 700, color: '#111827' }}>
              Pendaftaran Santri Baru Tahun Ajaran {academicYear}
            </div>
            <div style={{ marginTop: '4px', fontWeight: 700, color: '#047857' }}>
              PSB {academicYear}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}


