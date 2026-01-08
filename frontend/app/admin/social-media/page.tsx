'use client'

import { useState, useEffect } from 'react'
import { getAuthToken } from '@/lib/auth'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { DataTable } from '@/components/admin/DataTable'
import { Modal } from '@/components/admin/Modal'

export default function SocialMediaPage() {
  const [socialMedia, setSocialMedia] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    url: '',
    order: 0,
    is_active: true,
  })

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    const token = getAuthToken()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/social-media`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setSocialMedia(data.data || data)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching social media:', err)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = getAuthToken()
    const url = editing
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/social-media/${editing.id}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/social-media`

    try {
      const response = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setModalOpen(false)
        setEditing(null)
        setFormData({
          name: '',
          icon: '',
          url: '',
          order: 0,
          is_active: true,
        })
        fetchData()
      } else {
        const error = await response.json()
        alert(error.message || 'Terjadi kesalahan')
      }
    } catch (err) {
      console.error('Error saving social media:', err)
      alert('Terjadi kesalahan saat menyimpan')
    }
  }

  const handleEdit = (item: any) => {
    setEditing(item)
    setFormData({
      name: item.name || '',
      icon: item.icon || '',
      url: item.url || '',
      order: item.order || 0,
      is_active: item.is_active ?? true,
    })
    setModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus social media ini?')) return

    const token = getAuthToken()
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/social-media/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        fetchData()
      } else {
        alert('Gagal menghapus social media')
      }
    } catch (err) {
      console.error('Error deleting social media:', err)
      alert('Terjadi kesalahan saat menghapus')
    }
  }

  const columns = [
    { key: 'name', label: 'Nama' },
    { key: 'icon', label: 'Icon' },
    { key: 'url', label: 'URL' },
    { key: 'order', label: 'Urutan' },
    { 
      key: 'is_active', 
      label: 'Status',
      render: (value: boolean) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value ? 'Aktif' : 'Tidak Aktif'}
        </span>
      )
    },
  ]

  const commonIcons = [
    { value: 'fa-instagram', label: 'Instagram' },
    { value: 'fa-facebook', label: 'Facebook' },
    { value: 'fa-youtube', label: 'YouTube' },
    { value: 'fa-whatsapp', label: 'WhatsApp' },
    { value: 'fa-twitter', label: 'Twitter' },
    { value: 'fa-tiktok', label: 'TikTok' },
    { value: 'fa-linkedin', label: 'LinkedIn' },
  ]

  return (
    <AdminLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Manajemen Social Media</h1>
          <button
            onClick={() => {
              setEditing(null)
              setFormData({
                name: '',
                icon: '',
                url: '',
                order: 0,
                is_active: true,
              })
              setModalOpen(true)
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease-in-out',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            + Tambah Social Media
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Memuat data...</div>
        ) : (
          <DataTable
            data={socialMedia}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        <Modal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false)
            setEditing(null)
            setFormData({
              name: '',
              icon: '',
              url: '',
              order: 0,
              is_active: true,
            })
          }}
          title={editing ? 'Edit Social Media' : 'Tambah Social Media'}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Nama <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
                placeholder="Contoh: Instagram, Facebook, YouTube"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Icon (Font Awesome Class)
              </label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              >
                <option value="">Pilih Icon</option>
                {commonIcons.map((icon) => (
                  <option key={icon.value} value={icon.value}>
                    {icon.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="atau masukkan class icon manual (contoh: fa-instagram)"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  marginTop: '8px',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                URL <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
                placeholder="https://instagram.com/username"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Urutan
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
                min="0"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontWeight: '500' }}>Aktif (Tampilkan di frontend)</span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false)
                  setEditing(null)
                  setFormData({
                    name: '',
                    icon: '',
                    url: '',
                    order: 0,
                    is_active: true,
                  })
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Batal
              </button>
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                {editing ? 'Update' : 'Simpan'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  )
}


