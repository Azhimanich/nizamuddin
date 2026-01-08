'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { DataTable } from '@/components/admin/DataTable'
import { Modal } from '@/components/admin/Modal'
import { useToast } from '@/components/admin/Toast'
import { getAuthToken } from '@/lib/auth'

export default function DownloadsPage() {
  const { Toast, showSuccess, showError } = useToast()
  const [activeTab, setActiveTab] = useState<'files' | 'categories'>('files')
  
  // Files tab states
  const [downloads, setDownloads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [formData, setFormData] = useState({ title: '', description: '', category_id: '' })
  
  // Categories tab states
  const [categories, setCategories] = useState<any[]>([])
  const [categoryLoading, setCategoryLoading] = useState(true)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    slug: '',
    description: '',
    order: 0,
    is_active: true
  })

  useEffect(() => {
    fetchCategories() // Always fetch categories for dropdown
    if (activeTab === 'files') {
      fetchData()
    }
  }, [activeTab])

  const fetchData = async () => {
    const token = getAuthToken()
    console.log('Downloads page - Token:', token ? 'exists' : 'missing')
    
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/downloads`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      console.log('Downloads API response status:', res.status)
      const data = await res.json()
      console.log('Downloads API data:', data)
      setDownloads(Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []))
    } catch (err) {
      console.error('Downloads fetch error:', err)
      showError('Gagal memuat data download')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    const token = getAuthToken()
    console.log('Categories page - Token:', token ? 'exists' : 'missing')
    
    setCategoryLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/download-categories`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      console.log('Categories API response status:', res.status)
      const data = await res.json()
      console.log('Categories API data:', data)
      setCategories(Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []))
    } catch (err) {
      console.error('Categories fetch error:', err)
      showError('Gagal memuat data kategori')
    } finally {
      setCategoryLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = getAuthToken()
    const formDataToSend = new FormData()
    
    Object.keys(formData).forEach(key => {
      if (key !== 'file') {
        const value = formData[key as keyof typeof formData]
        if (value) {
          formDataToSend.append(key, value as string)
        }
      }
    })

    const fileInput = document.getElementById('file') as HTMLInputElement
    if (fileInput?.files?.[0]) {
      formDataToSend.append('file', fileInput.files[0])
    } else if (!editing) {
      showError('File wajib diisi')
      return
    }

    const url = editing
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/downloads/${editing.id}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/downloads`

    try {
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataToSend
      })
      if (res.ok) {
        setModalOpen(false)
        setEditing(null)
        setFormData({ title: '', description: '', category_id: '' })
        fetchData()
        showSuccess(editing ? 'File berhasil diperbarui' : 'File berhasil ditambahkan')
      } else {
        const errorData = await res.json().catch(() => ({ message: 'Unknown error' }))
        showError('Gagal menyimpan: ' + (errorData.message || 'Terjadi kesalahan'))
      }
    } catch (err) {
      showError('Terjadi kesalahan saat menyimpan file')
    }
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = getAuthToken()
    
    if (!categoryFormData.name || !categoryFormData.name.trim()) {
      showError('Nama kategori wajib diisi!')
      return
    }

    const url = editingCategory
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/download-categories/${editingCategory.id}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/download-categories`

    try {
      const res = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryFormData)
      })

      if (res.ok) {
        setCategoryModalOpen(false)
        setEditingCategory(null)
        setCategoryFormData({
          name: '',
          slug: '',
          description: '',
          order: 0,
          is_active: true
        })
        fetchCategories()
        showSuccess(editingCategory ? 'Kategori berhasil diperbarui' : 'Kategori berhasil ditambahkan')
      } else {
        const errorData = await res.json().catch(() => ({ message: 'Unknown error' }))
        showError('Gagal menyimpan: ' + (errorData.message || 'Terjadi kesalahan'))
      }
    } catch (err) {
      showError('Terjadi kesalahan saat menyimpan kategori')
    }
  }

  const handleCategoryEdit = (item: any) => {
    setEditingCategory(item)
    setCategoryFormData({
      name: item.name || '',
      slug: item.slug || '',
      description: item.description || '',
      order: item.order || 0,
      is_active: item.is_active !== undefined ? item.is_active : true
    })
    setCategoryModalOpen(true)
  }

  const handleCategoryDelete = async (item: any) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kategori "${item.name}"?`)) {
      return
    }

    const token = getAuthToken()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/download-categories/${item.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        fetchCategories()
        showSuccess('Kategori berhasil dihapus')
      } else {
        const errorData = await res.json().catch(() => ({ message: 'Unknown error' }))
        showError(errorData.message || 'Gagal menghapus kategori')
      }
    } catch (err) {
      showError('Terjadi kesalahan saat menghapus kategori')
    }
  }

  return (
    <AdminLayout>
      {Toast}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Download Center</h1>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '2px solid #e5e7eb' }}>
          <button
            onClick={() => setActiveTab('files')}
            style={{
              padding: '12px 24px',
              backgroundColor: activeTab === 'files' ? '#0284c7' : 'transparent',
              color: activeTab === 'files' ? 'white' : '#6b7280',
              border: 'none',
              borderBottom: activeTab === 'files' ? '2px solid #0284c7' : '2px solid transparent',
              cursor: 'pointer',
              fontWeight: activeTab === 'files' ? '600' : '500',
              marginBottom: '-2px',
              transition: 'all 0.2s'
            }}
          >
            📁 File Download
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            style={{
              padding: '12px 24px',
              backgroundColor: activeTab === 'categories' ? '#0284c7' : 'transparent',
              color: activeTab === 'categories' ? 'white' : '#6b7280',
              border: 'none',
              borderBottom: activeTab === 'categories' ? '2px solid #0284c7' : '2px solid transparent',
              cursor: 'pointer',
              fontWeight: activeTab === 'categories' ? '600' : '500',
              marginBottom: '-2px',
              transition: 'all 0.2s'
            }}
          >
            📂 Kategori
          </button>
        </div>

        {/* Files Tab */}
        {activeTab === 'files' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>Manajemen File Download</h2>
              <button
                onClick={() => {
                  setEditing(null)
                  setFormData({ title: '', description: '', category_id: '' })
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
                + Tambah File
              </button>
            </div>
            <DataTable
              columns={[
                { key: 'title', label: 'Judul' },
                {
                  key: 'category',
                  label: 'Kategori',
                  render: (value, row) => row.category?.name || row.category || '-'
                },
                { key: 'download_count', label: 'Download', render: (v) => v || 0 }
              ]}
              data={downloads}
              onEdit={(item) => {
                setEditing(item)
                setFormData({
                  title: item.title,
                  description: item.description || '',
                  category_id: item.category_id?.toString() || item.category_id || ''
                })
                setModalOpen(true)
              }}
              onDelete={async (item) => {
                const token = getAuthToken()
                try {
                  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/downloads/${item.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                  })
                  if (res.ok) {
                    fetchData()
                    showSuccess('File berhasil dihapus')
                  } else {
                    showError('Gagal menghapus file')
                  }
                } catch (err) {
                  showError('Terjadi kesalahan saat menghapus file')
                }
              }}
              loading={loading}
            />
            <Modal
              isOpen={modalOpen}
              onClose={() => {
                setModalOpen(false)
                setEditing(null)
                setFormData({ title: '', description: '', category_id: '' })
              }}
              title={editing ? 'Edit File' : 'Tambah File'}
            >
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Judul <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Kategori</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    File {!editing && <span style={{ color: 'red' }}>(Wajib)</span>}
                  </label>
                  <input
                    id="file"
                    type="file"
                    required={!editing}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setModalOpen(false)
                      setEditing(null)
                      setFormData({ title: '', description: '', category_id: '' })
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
          </>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>Manajemen Kategori</h2>
              <button
                onClick={() => {
                  setEditingCategory(null)
                  setCategoryFormData({
                    name: '',
                    slug: '',
                    description: '',
                    order: 0,
                    is_active: true
                  })
                  setCategoryModalOpen(true)
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
                { key: 'name', label: 'Nama' },
                { key: 'slug', label: 'Slug' },
                { key: 'description', label: 'Deskripsi', render: (v) => (v && v.length > 50 ? v.substring(0, 50) + '...' : v) || '-' },
                { key: 'order', label: 'Urutan' },
                { key: 'is_active', label: 'Aktif', render: (v) => v ? 'Ya' : 'Tidak' }
              ]}
              data={categories}
              onEdit={handleCategoryEdit}
              onDelete={handleCategoryDelete}
              loading={categoryLoading}
            />
            <Modal
              isOpen={categoryModalOpen}
              onClose={() => {
                setCategoryModalOpen(false)
                setEditingCategory(null)
                setCategoryFormData({
                  name: '',
                  slug: '',
                  description: '',
                  order: 0,
                  is_active: true
                })
              }}
              title={editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}
            >
              <form onSubmit={handleCategorySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Nama <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryFormData.name}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Slug</label>
                  <input
                    type="text"
                    value={categoryFormData.slug}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, slug: e.target.value })}
                    placeholder="Akan di-generate otomatis dari nama"
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Deskripsi</label>
                  <textarea
                    value={categoryFormData.description}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                    rows={3}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Urutan</label>
                  <input
                    type="number"
                    value={categoryFormData.order}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, order: parseInt(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={categoryFormData.is_active}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, is_active: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label style={{ fontWeight: '500', cursor: 'pointer' }}>Aktif (Akan muncul di filter)</label>
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryModalOpen(false)
                      setEditingCategory(null)
                      setCategoryFormData({
                        name: '',
                        slug: '',
                        description: '',
                        order: 0,
                        is_active: true
                      })
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
          </>
        )}
      </div>
    </AdminLayout>
  )
}

