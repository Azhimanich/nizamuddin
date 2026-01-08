'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { DataTable } from '@/components/admin/DataTable'
import { Modal } from '@/components/admin/Modal'
import { useToast, validateImage } from '@/components/admin/Toast'

export default function OrganizationStructurePage() {
  const { Toast, showSuccess, showError } = useToast()
  const [structures, setStructures] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    level: 1,
    order: 0,
    parent_id: '',
    bio_id: '',
    bio_en: '',
    bio_ar: '',
    email: '',
    phone: '',
    is_active: true,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const token = localStorage.getItem('auth_token')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/organization-structure`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setStructures(data.data || data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.position) {
      showError('Nama dan Jabatan wajib diisi')
      return
    }

    const token = localStorage.getItem('auth_token')
    const formDataToSend = new FormData()
    
    formDataToSend.append('name', formData.name)
    formDataToSend.append('position', formData.position)
    formDataToSend.append('level', formData.level.toString())
    formDataToSend.append('order', formData.order.toString())
    if (formData.parent_id) {
      formDataToSend.append('parent_id', formData.parent_id)
    }
    if (formData.bio_id) {
      formDataToSend.append('bio_id', formData.bio_id)
    }
    if (formData.bio_en) {
      formDataToSend.append('bio_en', formData.bio_en)
    }
    if (formData.bio_ar) {
      formDataToSend.append('bio_ar', formData.bio_ar)
    }
    if (formData.email) {
      formDataToSend.append('email', formData.email)
    }
    if (formData.phone) {
      formDataToSend.append('phone', formData.phone)
    }
    formDataToSend.append('is_active', formData.is_active ? '1' : '0')

    if (imageFile) {
      formDataToSend.append('photo', imageFile)
    }

    const url = editing
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/organization-structure/${editing.id}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/organization-structure`

    if (editing) {
      formDataToSend.append('_method', 'PUT')
    }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: formDataToSend
      })

      if (res.ok) {
        setModalOpen(false)
        setEditing(null)
        setFormData({
          name: '',
          position: '',
          level: 1,
          order: 0,
          parent_id: '',
          bio_id: '',
          bio_en: '',
          bio_ar: '',
          email: '',
          phone: '',
          is_active: true,
        })
        setImageFile(null)
        setImagePreview(null)
        fetchData()
        showSuccess(editing ? 'Struktur organisasi berhasil diperbarui' : 'Struktur organisasi berhasil ditambahkan')
      } else {
        const errorData = await res.json().catch(() => ({ message: 'Unknown error' }))
        showError('Gagal menyimpan: ' + (errorData.message || 'Terjadi kesalahan'))
      }
    } catch (err) {
      showError('Terjadi kesalahan saat menyimpan')
    }
  }

  const handleEdit = (item: any) => {
    setEditing(item)
    setFormData({
      name: item.name || '',
      position: item.position || '',
      level: item.level || 1,
      order: item.order || 0,
      parent_id: item.parent_id || '',
      bio_id: item.bio_id || '',
      bio_en: item.bio_en || '',
      bio_ar: item.bio_ar || '',
      email: item.email || '',
      phone: item.phone || '',
      is_active: item.is_active !== undefined ? item.is_active : true,
    })
    setImagePreview(item.photo || null)
    setImageFile(null)
    setModalOpen(true)
  }

  const handleDelete = async (item: any) => {
    if (!confirm('Apakah Anda yakin ingin menghapus struktur organisasi ini?')) {
      return
    }

    const token = localStorage.getItem('auth_token')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/organization-structure/${item.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        fetchData()
        showSuccess('Struktur organisasi berhasil dihapus')
      } else {
        const errorData = await res.json().catch(() => ({ message: 'Unknown error' }))
        showError('Gagal menghapus: ' + (errorData.message || 'Terjadi kesalahan'))
      }
    } catch (err) {
      showError('Terjadi kesalahan saat menghapus')
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const validation = validateImage(file)
      
      if (!validation.valid) {
        showError(validation.message || 'Gambar tidak valid')
        e.target.value = ''
        return
      }
      
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      showSuccess('Gambar berhasil dipilih')
    }
  }

  // Get parent options (structures with level less than current)
  const getParentOptions = () => {
    if (editing) {
      return structures.filter(s => s.id !== editing.id && s.level < formData.level)
    }
    return structures.filter(s => s.level < formData.level)
  }

  return (
    <AdminLayout>
      {Toast}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Struktur Organisasi Yayasan</h1>
          <button
            onClick={() => {
              setEditing(null)
              setFormData({
                name: '',
                position: '',
                level: 1,
                order: 0,
                parent_id: '',
                bio_id: '',
                bio_en: '',
                bio_ar: '',
                email: '',
                phone: '',
                is_active: true,
              })
              setImageFile(null)
              setImagePreview(null)
              setModalOpen(true)
            }}
            style={{ padding: '10px 20px', backgroundColor: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
          >
            + Tambah Struktur
          </button>
        </div>

        <DataTable
          columns={[
            { key: 'name', label: 'Nama' },
            { key: 'position', label: 'Jabatan' },
            { key: 'level', label: 'Level' },
            { key: 'order', label: 'Urutan' },
            { key: 'is_active', label: 'Aktif', render: (v) => v ? 'Ya' : 'Tidak' }
          ]}
          data={structures}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />

        <Modal isOpen={modalOpen} onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }} title={editing ? 'Edit Struktur Organisasi' : 'Tambah Struktur Organisasi'} size="lg">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Nama <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Jabatan <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Level <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 1 })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                />
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  1 = Pimpinan Tertinggi, 2 = Wakil, 3 = Kepala Divisi, dst
                </p>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Urutan
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Atasan (Parent)
              </label>
              <select
                value={formData.parent_id}
                onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
              >
                <option value="">Tidak Ada (Pimpinan Tertinggi)</option>
                {getParentOptions().map((s) => (
                  <option key={s.id} value={s.id}>
                    Level {s.level} - {s.position} ({s.name})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Telepon</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Bio (ID)</label>
              <textarea
                value={formData.bio_id}
                onChange={(e) => setFormData({ ...formData, bio_id: e.target.value })}
                rows={3}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Foto</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
              />
              {imagePreview && (
                <div style={{ marginTop: '8px', position: 'relative', display: 'inline-block' }}>
                  <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', borderRadius: '8px', display: 'block' }} />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null)
                      setImagePreview(null)
                    }}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px'
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label style={{ fontWeight: '500', cursor: 'pointer' }}>Aktif</label>
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

