'use client'

import { useState, useEffect } from 'react'

import { getAuthToken } from '@/lib/auth'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { DataTable } from '@/components/admin/DataTable'
import { Modal } from '@/components/admin/Modal'

export default function SpecializationCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [formData, setFormData] = useState({ name: '', description: '', order: 0 })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const token = getAuthToken()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/specialization-categories`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setCategories(data.data || data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = getAuthToken()
    const url = editing
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/specialization-categories/${editing.id}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/specialization-categories`

    try {
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setModalOpen(false)
        setEditing(null)
        setFormData({ name: '', description: '', order: 0 })
        fetchData()
        alert('Berhasil!')
      }
    } catch (err) {
      alert('Error')
    }
  }

  const handleDelete = async (item: any) => {
    const token = getAuthToken()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/specialization-categories/${item.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        fetchData()
        alert('Berhasil dihapus')
      }
    } catch (err) {
      alert('Error')
    }
  }

  return (
    <AdminLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Kategori Spesialisasi</h1>
          <button
            onClick={() => {
              setEditing(null)
              setFormData({ name: '', description: '', order: 0 })
              setModalOpen(true)
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0284c7',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            + Tambah Kategori
          </button>
        </div>

        <DataTable
          columns={[
            { key: 'name', label: 'Nama Kategori' },
            { key: 'description', label: 'Deskripsi' },
            { key: 'order', label: 'Urutan' }
          ]}
          data={categories}
          onEdit={(item) => {
            setEditing(item)
            setFormData({ name: item.name, description: item.description || '', order: item.order || 0 })
            setModalOpen(true)
          }}
          onDelete={handleDelete}
          loading={loading}
        />

        <Modal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false)
            setEditing(null)
          }}
          title={editing ? 'Edit Kategori' : 'Tambah Kategori'}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Nama Kategori</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Fikih, Nahwu, Matematika"
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Deskripsi</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Urutan</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false)
                  setEditing(null)
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
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
                  fontWeight: '500'
                }}
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



