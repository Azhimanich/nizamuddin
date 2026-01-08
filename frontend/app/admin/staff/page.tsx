'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { DataTable } from '@/components/admin/DataTable'
import { Modal } from '@/components/admin/Modal'
import { useToast, validateImage } from '@/components/admin/Toast'
import { getAuthToken } from '@/lib/auth'

export default function StaffPage() {
  const { Toast, showSuccess, showError } = useToast()
  const [activeTab, setActiveTab] = useState<'staff' | 'organization' | 'categories'>('staff')
  
  // Staff states
  const [staff, setStaff] = useState<any[]>([])
  const [allStaff, setAllStaff] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [staffLoading, setStaffLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [staffModalOpen, setStaffModalOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<any>(null)
  const [staffFormData, setStaffFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    specialization: '',
    bio_id: '',
    order: 0
  })

  // Organization states
  const [structures, setStructures] = useState<any[]>([])
  const [orgLoading, setOrgLoading] = useState(true)
  const [orgModalOpen, setOrgModalOpen] = useState(false)
  const [editingOrg, setEditingOrg] = useState<any>(null)
  const [orgFormData, setOrgFormData] = useState({
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

  // Categories states
  const [specCategories, setSpecCategories] = useState<any[]>([])
  const [catLoading, setCatLoading] = useState(true)
  const [catModalOpen, setCatModalOpen] = useState(false)
  const [editingCat, setEditingCat] = useState<any>(null)
  const [catFormData, setCatFormData] = useState({ name: '', description: '', order: 0 })

  // Always fetch categories on mount for staff filter
  useEffect(() => {
    fetchCategories()
  }, [])

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === 'staff') {
      fetchStaff()
    } else if (activeTab === 'organization') {
      fetchOrganization()
    } else if (activeTab === 'categories') {
      fetchSpecCategories()
    }
  }, [activeTab])

  useEffect(() => {
    if (selectedCategory === '') {
      setStaff(allStaff)
    } else {
      setStaff(allStaff.filter((s) => s.specialization === selectedCategory))
    }
  }, [selectedCategory, allStaff])

  // Staff functions
  const fetchStaff = async () => {
    const token = getAuthToken()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/staff`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      const staffData = data.data || data
      setAllStaff(staffData)
      setStaff(staffData)
      setStaffLoading(false)
    } catch (err) {
      setStaffLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/specialization-categories`)
      const data = await res.json()
      setCategories(data.data || data)
    } catch (err) {
      // Ignore
    }
  }

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!staffFormData.name || !staffFormData.email || !staffFormData.phone || !staffFormData.position || !staffFormData.specialization) {
      showError('Mohon lengkapi semua field yang wajib diisi')
      return
    }

    if (!editingStaff) {
      const fileInput = document.getElementById('photo') as HTMLInputElement
      if (!fileInput?.files?.[0]) {
        showError('Foto wajib diisi')
        return
      }
    }

    const token = getAuthToken()
    const formDataToSend = new FormData()
    
    formDataToSend.append('name', staffFormData.name)
    formDataToSend.append('email', staffFormData.email)
    formDataToSend.append('phone', staffFormData.phone)
    formDataToSend.append('position', staffFormData.position)
    formDataToSend.append('specialization', staffFormData.specialization)
    if (staffFormData.bio_id) {
      formDataToSend.append('bio_id', staffFormData.bio_id)
    }
    formDataToSend.append('order', staffFormData.order.toString())

    const fileInput = document.getElementById('photo') as HTMLInputElement
    if (fileInput?.files?.[0]) {
      const file = fileInput.files[0]
      const validation = validateImage(file)
      
      if (!validation.valid) {
        showError(validation.message || 'Gambar tidak valid')
        fileInput.value = ''
        return
      }
      
      formDataToSend.append('photo', file)
    }

    const url = editingStaff
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/staff/${editingStaff.id}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/staff`

    if (editingStaff) {
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
        setStaffModalOpen(false)
        setEditingStaff(null)
        setStaffFormData({ name: '', email: '', phone: '', position: '', specialization: '', bio_id: '', order: 0 })
        fetchStaff()
        showSuccess(editingStaff ? 'Staff berhasil diperbarui' : 'Staff berhasil ditambahkan')
      } else {
        const errorData = await res.json().catch(() => ({ message: 'Unknown error' }))
        showError('Gagal menyimpan staff: ' + (errorData.message || 'Terjadi kesalahan'))
      }
    } catch (err) {
      showError('Terjadi kesalahan saat menyimpan staff')
    }
  }

  const handleStaffEdit = (item: any) => {
    setEditingStaff(item)
    setStaffFormData({
      name: item.name || '',
      email: item.email || '',
      phone: item.phone || '',
      position: item.position || '',
      specialization: item.specialization || '',
      bio_id: item.bio_id || '',
      order: item.order || 0
    })
    setStaffModalOpen(true)
  }

  const handleStaffDelete = async (item: any) => {
    const token = getAuthToken()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/staff/${item.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        fetchStaff()
        showSuccess('Staff berhasil dihapus')
      } else {
        showError('Gagal menghapus staff')
      }
    } catch (err) {
      showError('Terjadi kesalahan saat menghapus staff')
    }
  }

  // Organization functions
  const fetchOrganization = async () => {
    const token = getAuthToken()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/organization-structure`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setStructures(data.data || data)
      setOrgLoading(false)
    } catch (err) {
      setOrgLoading(false)
    }
  }

  const handleOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!orgFormData.name || !orgFormData.position) {
      showError('Nama dan Jabatan wajib diisi')
      return
    }

    const token = getAuthToken()
    const formDataToSend = new FormData()
    
    formDataToSend.append('name', orgFormData.name)
    formDataToSend.append('position', orgFormData.position)
    formDataToSend.append('level', orgFormData.level.toString())
    formDataToSend.append('order', orgFormData.order.toString())
    if (orgFormData.parent_id) {
      formDataToSend.append('parent_id', orgFormData.parent_id)
    }
    if (orgFormData.bio_id) {
      formDataToSend.append('bio_id', orgFormData.bio_id)
    }
    if (orgFormData.bio_en) {
      formDataToSend.append('bio_en', orgFormData.bio_en)
    }
    if (orgFormData.bio_ar) {
      formDataToSend.append('bio_ar', orgFormData.bio_ar)
    }
    if (orgFormData.email) {
      formDataToSend.append('email', orgFormData.email)
    }
    if (orgFormData.phone) {
      formDataToSend.append('phone', orgFormData.phone)
    }
    formDataToSend.append('is_active', orgFormData.is_active ? '1' : '0')

    if (imageFile) {
      formDataToSend.append('photo', imageFile)
    }

    const url = editingOrg
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/organization-structure/${editingOrg.id}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/organization-structure`

    if (editingOrg) {
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
        setOrgModalOpen(false)
        setEditingOrg(null)
        setOrgFormData({
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
        fetchOrganization()
        showSuccess(editingOrg ? 'Struktur organisasi berhasil diperbarui' : 'Struktur organisasi berhasil ditambahkan')
      } else {
        const errorData = await res.json().catch(() => ({ message: 'Unknown error' }))
        showError('Gagal menyimpan: ' + (errorData.message || 'Terjadi kesalahan'))
      }
    } catch (err) {
      showError('Terjadi kesalahan saat menyimpan')
    }
  }

  const handleOrgEdit = (item: any) => {
    setEditingOrg(item)
    setOrgFormData({
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
    setOrgModalOpen(true)
  }

  const handleOrgDelete = async (item: any) => {
    if (!confirm('Apakah Anda yakin ingin menghapus struktur organisasi ini?')) {
      return
    }

    const token = getAuthToken()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/organization-structure/${item.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        fetchOrganization()
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

  const getParentOptions = () => {
    if (editingOrg) {
      return structures.filter(s => s.id !== editingOrg.id && s.level < orgFormData.level)
    }
    return structures.filter(s => s.level < orgFormData.level)
  }

  // Categories functions
  const fetchSpecCategories = async () => {
    const token = getAuthToken()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/specialization-categories`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setSpecCategories(data.data || data)
      setCatLoading(false)
    } catch (err) {
      setCatLoading(false)
    }
  }

  const handleCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = getAuthToken()
    const url = editingCat
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/specialization-categories/${editingCat.id}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/specialization-categories`

    try {
      const res = await fetch(url, {
        method: editingCat ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(catFormData)
      })
      if (res.ok) {
        setCatModalOpen(false)
        setEditingCat(null)
        setCatFormData({ name: '', description: '', order: 0 })
        fetchSpecCategories()
        showSuccess(editingCat ? 'Kategori berhasil diperbarui' : 'Kategori berhasil ditambahkan')
      } else {
        showError('Gagal menyimpan kategori')
      }
    } catch (err) {
      showError('Terjadi kesalahan saat menyimpan kategori')
    }
  }

  const handleCatDelete = async (item: any) => {
    const token = getAuthToken()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/specialization-categories/${item.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        fetchSpecCategories()
        showSuccess('Kategori berhasil dihapus')
      } else {
        showError('Gagal menghapus kategori')
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
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Manajemen SDM</h1>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '2px solid #e5e7eb' }}>
          {(['staff', 'organization', 'categories'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px',
                backgroundColor: activeTab === tab ? '#0284c7' : 'transparent',
                color: activeTab === tab ? 'white' : '#6b7280',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500',
                borderBottom: activeTab === tab ? '2px solid #0284c7' : '2px solid transparent',
                marginBottom: '-2px'
              }}
            >
              {tab === 'staff' ? '👨‍🏫 Manajemen SDM' : tab === 'organization' ? '🏛️ Struktur Organisasi' : '🏷️ Kategori Spesialisasi'}
            </button>
          ))}
        </div>

        {/* Staff Tab */}
        {activeTab === 'staff' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <button
                onClick={() => {
                  setEditingStaff(null)
                  setStaffFormData({ name: '', email: '', phone: '', position: '', specialization: '', bio_id: '', order: 0 })
                  setStaffModalOpen(true)
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
                + Tambah Staff
              </button>
            </div>

            {/* Filter by Specialization */}
            {categories.length > 0 && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
                    Filter berdasarkan Spesialisasi:
                  </label>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <button
                    onClick={() => setSelectedCategory('')}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: selectedCategory === '' ? '#0284c7' : '#f3f4f6',
                      color: selectedCategory === '' ? 'white' : '#374151',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                  >
                    Semua ({allStaff.length})
                  </button>
                  {categories.map((cat) => {
                    const count = allStaff.filter((s) => s.specialization === cat.name).length
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.name)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: selectedCategory === cat.name ? '#0284c7' : '#f3f4f6',
                          color: selectedCategory === cat.name ? 'white' : '#374151',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500',
                          transition: 'all 0.2s'
                        }}
                      >
                        {cat.name} ({count})
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <DataTable
              columns={[
                { key: 'name', label: 'Nama' },
                { key: 'position', label: 'Jabatan' },
                { key: 'specialization', label: 'Spesialisasi' },
                { key: 'email', label: 'Email' }
              ]}
              data={staff}
              onEdit={handleStaffEdit}
              onDelete={handleStaffDelete}
              loading={staffLoading}
            />

            <Modal isOpen={staffModalOpen} onClose={() => {
              setStaffModalOpen(false)
              setEditingStaff(null)
            }} title={editingStaff ? 'Edit Staff' : 'Tambah Staff'} size="lg">
              <form onSubmit={handleStaffSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Nama</label>
                  <input
                    type="text"
                    required
                    value={staffFormData.name}
                    onChange={(e) => setStaffFormData({ ...staffFormData, name: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      Email <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={staffFormData.email}
                      onChange={(e) => setStaffFormData({ ...staffFormData, email: e.target.value })}
                      style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      Telepon <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={staffFormData.phone}
                      onChange={(e) => setStaffFormData({ ...staffFormData, phone: e.target.value })}
                      style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      Jabatan <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={staffFormData.position}
                      onChange={(e) => setStaffFormData({ ...staffFormData, position: e.target.value })}
                      style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      Spesialisasi <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select
                      required
                      value={staffFormData.specialization}
                      onChange={(e) => setStaffFormData({ ...staffFormData, specialization: e.target.value })}
                      style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                    >
                      <option value="">Pilih Spesialisasi</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Bio (ID) <span style={{ color: '#6b7280', fontSize: '12px' }}>(Opsional)</span>
                  </label>
                  <textarea
                    value={staffFormData.bio_id}
                    onChange={(e) => setStaffFormData({ ...staffFormData, bio_id: e.target.value })}
                    rows={4}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Foto <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="photo"
                    type="file"
                    accept="image/*"
                    required={!editingStaff}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0]
                        const validation = validateImage(file)
                        
                        if (!validation.valid) {
                          showError(validation.message || 'Gambar tidak valid')
                          e.target.value = ''
                          return
                        }
                        
                        showSuccess('Gambar berhasil dipilih')
                      }
                    }}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                  />
                  {editingStaff && (
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      Kosongkan jika tidak ingin mengubah foto
                    </p>
                  )}
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Urutan <span style={{ color: '#6b7280', fontSize: '12px' }}>(Opsional)</span>
                  </label>
                  <input
                    type="number"
                    value={staffFormData.order}
                    onChange={(e) => setStaffFormData({ ...staffFormData, order: parseInt(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setStaffModalOpen(false)
                      setEditingStaff(null)
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

        {/* Organization Tab */}
        {activeTab === 'organization' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <button
                onClick={() => {
                  setEditingOrg(null)
                  setOrgFormData({
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
                  setOrgModalOpen(true)
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
              onEdit={handleOrgEdit}
              onDelete={handleOrgDelete}
              loading={orgLoading}
            />

            <Modal isOpen={orgModalOpen} onClose={() => {
              setOrgModalOpen(false)
              setEditingOrg(null)
            }} title={editingOrg ? 'Edit Struktur Organisasi' : 'Tambah Struktur Organisasi'} size="lg">
              <form onSubmit={handleOrgSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      Nama <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={orgFormData.name}
                      onChange={(e) => setOrgFormData({ ...orgFormData, name: e.target.value })}
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
                      value={orgFormData.position}
                      onChange={(e) => setOrgFormData({ ...orgFormData, position: e.target.value })}
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
                      value={orgFormData.level}
                      onChange={(e) => setOrgFormData({ ...orgFormData, level: parseInt(e.target.value) || 1 })}
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
                      value={orgFormData.order}
                      onChange={(e) => setOrgFormData({ ...orgFormData, order: parseInt(e.target.value) || 0 })}
                      style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Atasan (Parent)
                  </label>
                  <select
                    value={orgFormData.parent_id}
                    onChange={(e) => setOrgFormData({ ...orgFormData, parent_id: e.target.value })}
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
                      value={orgFormData.email}
                      onChange={(e) => setOrgFormData({ ...orgFormData, email: e.target.value })}
                      style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Telepon</label>
                    <input
                      type="text"
                      value={orgFormData.phone}
                      onChange={(e) => setOrgFormData({ ...orgFormData, phone: e.target.value })}
                      style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Bio (ID)</label>
                  <textarea
                    value={orgFormData.bio_id}
                    onChange={(e) => setOrgFormData({ ...orgFormData, bio_id: e.target.value })}
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
                    checked={orgFormData.is_active}
                    onChange={(e) => setOrgFormData({ ...orgFormData, is_active: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label style={{ fontWeight: '500', cursor: 'pointer' }}>Aktif</label>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setOrgModalOpen(false)
                      setEditingOrg(null)
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
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <button
                onClick={() => {
                  setEditingCat(null)
                  setCatFormData({ name: '', description: '', order: 0 })
                  setCatModalOpen(true)
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
              data={specCategories}
              onEdit={(item) => {
                setEditingCat(item)
                setCatFormData({ name: item.name, description: item.description || '', order: item.order || 0 })
                setCatModalOpen(true)
              }}
              onDelete={handleCatDelete}
              loading={catLoading}
            />

            <Modal
              isOpen={catModalOpen}
              onClose={() => {
                setCatModalOpen(false)
                setEditingCat(null)
              }}
              title={editingCat ? 'Edit Kategori' : 'Tambah Kategori'}
            >
              <form onSubmit={handleCatSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Nama Kategori</label>
                  <input
                    type="text"
                    required
                    value={catFormData.name}
                    onChange={(e) => setCatFormData({ ...catFormData, name: e.target.value })}
                    placeholder="Contoh: Fikih, Nahwu, Matematika"
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Deskripsi</label>
                  <textarea
                    value={catFormData.description}
                    onChange={(e) => setCatFormData({ ...catFormData, description: e.target.value })}
                    rows={3}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Urutan</label>
                  <input
                    type="number"
                    value={catFormData.order}
                    onChange={(e) => setCatFormData({ ...catFormData, order: parseInt(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setCatModalOpen(false)
                      setEditingCat(null)
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
