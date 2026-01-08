'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { DataTable } from '@/components/admin/DataTable'
import { Modal } from '@/components/admin/Modal'
import { useToast } from '@/components/admin/Toast'
import { getAuthToken } from '@/lib/auth'

export default function PermissionsPage() {
  const { Toast, showSuccess, showError } = useToast()
  const [permissions, setPermissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: ''
  })

  useEffect(() => {
    fetchPermissions()
  }, [])

  const fetchPermissions = async () => {
    const token = getAuthToken()
    console.log('Permissions page - Token:', token ? 'exists' : 'missing')
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/permissions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      console.log('Permissions API response status:', res.status)
      const data = await res.json()
      console.log('Permissions API data:', data)
      setPermissions(data.data || data)
    } catch (err) {
      console.error('Error fetching permissions:', err)
      showError('Gagal memuat permissions')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = getAuthToken()
    const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/permissions`

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setModalOpen(false)
        setFormData({ name: '' })
        fetchPermissions()
        showSuccess('Permission berhasil dibuat')
      } else {
        const error = await res.json()
        showError(error.message || 'Gagal membuat permission')
      }
    } catch (err) {
      console.error('Error creating permission:', err)
      showError('Error: ' + err)
    }
  }

  const handleDelete = async (permission: any) => {
    const token = getAuthToken()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/permissions/${permission.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        fetchPermissions()
        showSuccess('Permission berhasil dihapus')
      } else {
        const error = await res.json()
        showError(error.message || 'Gagal menghapus permission')
      }
    } catch (err) {
      console.error('Error deleting permission:', err)
      showError('Error: ' + err)
    }
  }

  return (
    <AdminLayout>
      {Toast}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#111827' }}>Manajemen Permission</h1>
            <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
              Kelola permission akses untuk sistem
            </p>
          </div>
          <button
            onClick={() => {
              setFormData({ name: '' })
              setModalOpen(true)
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0284c7',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0369a1'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0284c7'}
          >
            + Tambah Permission
          </button>
        </div>

        <DataTable
          columns={[
            { 
              key: 'name', 
              label: 'Nama Permission',
              render: (value) => (
                <div>
                  <span style={{ 
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '14px'
                  }}>
                    {value}
                  </span>
                </div>
              )
            },
            {
              key: 'guard_name',
              label: 'Guard',
              render: (value) => (
                <span style={{
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {value || 'web'}
                </span>
              )
            },
            {
              key: 'created_at',
              label: 'Dibuat',
              render: (value) => (
                <span style={{ color: '#6b7280', fontSize: '13px' }}>
                  {new Date(value).toLocaleDateString('id-ID')}
                </span>
              )
            }
          ]}
          data={permissions}
          onDelete={handleDelete}
          loading={loading}
        />

        <Modal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false)
            setFormData({ name: '' })
          }}
          title="Tambah Permission"
          size="sm"
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                Nama Permission
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                placeholder="Contoh: manage_news"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
              />
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px', lineHeight: '1.4' }}>
                Gunakan format: <strong>action_resource</strong><br />
                Contoh: manage_news, view_users, create_agenda
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false)
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              >
                Batal
              </button>
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#0284c7',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0369a1'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0284c7'}
              >
                Simpan
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  )
}
