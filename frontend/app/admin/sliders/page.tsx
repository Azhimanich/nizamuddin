'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { DataTable } from '@/components/admin/DataTable'
import { Modal } from '@/components/admin/Modal'
import { useToast, validateImage } from '@/components/admin/Toast'
import { getAuthToken } from '@/lib/auth'

export default function SlidersPage() {
  const { Toast, showSuccess, showError, showWarning } = useToast()
  const [sliders, setSliders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [formData, setFormData] = useState({
    title_id: '',
    title_en: '',
    title_ar: '',
    subtitle_id: '',
    subtitle_en: '',
    subtitle_ar: '',
    cta_text_id: '',
    cta_text_en: '',
    cta_text_ar: '',
    cta_link: '',
    order: 0,
    is_active: true,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    const token = getAuthToken()
    console.log('Sliders page - Token:', token ? 'exists' : 'missing')
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/sliders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      console.log('Sliders API response status:', res.status)
      const data = await res.json()
      console.log('Sliders API data:', data)
      setSliders(data.data || data)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching sliders:', err)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = getAuthToken()
    const url = editing
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/sliders/${editing.id}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/sliders`

    const formDataToSend = new FormData()
    
    // Always send required fields
    formDataToSend.append('title_id', formData.title_id || '')
    formDataToSend.append('subtitle_id', formData.subtitle_id || '')
    
    // Optional fields - send even if empty
    formDataToSend.append('title_en', formData.title_en || '')
    formDataToSend.append('title_ar', formData.title_ar || '')
    formDataToSend.append('subtitle_en', formData.subtitle_en || '')
    formDataToSend.append('subtitle_ar', formData.subtitle_ar || '')
    formDataToSend.append('cta_text_id', formData.cta_text_id || '')
    formDataToSend.append('cta_text_en', formData.cta_text_en || '')
    formDataToSend.append('cta_text_ar', formData.cta_text_ar || '')
    formDataToSend.append('cta_link', formData.cta_link || '')
    formDataToSend.append('order', formData.order.toString())
    formDataToSend.append('is_active', formData.is_active ? '1' : '0')
    
    // Only append image if there's a new file
    // If editing and no new image, backend will keep existing image
    if (imageFile) {
      formDataToSend.append('image', imageFile)
    }

    // For PUT requests with FormData, Laravel needs _method
    if (editing) {
      formDataToSend.append('_method', 'PUT')
    }

    try {
      const res = await fetch(url, {
        method: 'POST', // Use POST for both, Laravel will handle _method
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
          // Don't set Content-Type for FormData - browser will set it automatically
        },
        body: formDataToSend
      })
      if (res.ok) {
        const responseData = await res.json()
        // Update image preview with new URL from server
        if (responseData.image) {
          setImagePreview(responseData.image)
        }
        showSuccess(editing ? 'Slider berhasil diperbarui' : 'Slider berhasil ditambahkan')
        setModalOpen(false)
        setEditing(null)
        setFormData({
          title_id: '',
          title_en: '',
          title_ar: '',
          subtitle_id: '',
          subtitle_en: '',
          subtitle_ar: '',
          cta_text_id: '',
          cta_text_en: '',
          cta_text_ar: '',
          cta_link: '',
          order: 0,
          is_active: true,
        })
        setImageFile(null)
        setImagePreview(null)
        fetchData()
        alert('Berhasil!')
      } else {
        const errorData = await res.json().catch(() => ({ message: 'Unknown error' }))
        let errorMessage = 'Terjadi kesalahan saat menyimpan data.'
        
        if (errorData.message) {
          errorMessage = errorData.message
        } else if (errorData.errors) {
          const errorMessages = Object.values(errorData.errors).flat()
          errorMessage = errorMessages.join(', ')
        } else if (errorData.error) {
          errorMessage = errorData.error
        }
        
        showError('Gagal menyimpan slider: ' + errorMessage)
        console.error('Error details:', errorData)
      }
    } catch (err) { 
      showError('Terjadi kesalahan saat menyimpan slider')
    }
  }

  const handleEdit = (item: any) => {
    setEditing(item)
    setFormData({
      title_id: item.title_id || '',
      title_en: item.title_en || '',
      title_ar: item.title_ar || '',
      subtitle_id: item.subtitle_id || '',
      subtitle_en: item.subtitle_en || '',
      subtitle_ar: item.subtitle_ar || '',
      cta_text_id: item.cta_text_id || '',
      cta_text_en: item.cta_text_en || '',
      cta_text_ar: item.cta_text_ar || '',
      cta_link: item.cta_link || '',
      order: item.order || 0,
      is_active: item.is_active !== undefined ? item.is_active : true,
    })
    setImagePreview(item.image || null)
    setImageFile(null)
    setModalOpen(true)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const validation = validateImage(file)
      
      if (!validation.valid) {
        showError(validation.message || 'Gambar tidak valid')
        e.target.value = '' // Clear file input
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

  return (
    <AdminLayout>
      {Toast}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Manajemen Slider</h1>
          <button onClick={() => {
            setEditing(null)
            setFormData({
              title_id: '',
              title_en: '',
              title_ar: '',
              subtitle_id: '',
              subtitle_en: '',
              subtitle_ar: '',
              cta_text_id: '',
              cta_text_en: '',
              cta_text_ar: '',
              cta_link: '',
              order: 0,
              is_active: true,
            })
            setImageFile(null)
            setImagePreview(null)
            setModalOpen(true)
          }}
            style={{ padding: '10px 20px', backgroundColor: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>
            + Tambah Slider
          </button>
        </div>
        <DataTable
          columns={[
            { key: 'title_id', label: 'Judul (ID)' },
            { key: 'order', label: 'Urutan' },
            { key: 'is_active', label: 'Aktif', render: (v) => v ? 'Ya' : 'Tidak' }
          ]}
          data={sliders}
          onEdit={handleEdit}
          onDelete={async (item) => {
            const token = getAuthToken()
            try {
              const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/sliders/${item.id}`, {
                method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
              })
              if (res.ok) { fetchData(); alert('Berhasil dihapus') }
            } catch (err) { alert('Error') }
          }}
          loading={loading}
        />
        <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); setImageFile(null); setImagePreview(null) }} title={editing ? 'Edit Slider' : 'Tambah Slider'}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Judul (ID) <span style={{ color: 'red' }}>*</span></label>
              <input type="text" required value={formData.title_id} onChange={(e) => setFormData({ ...formData, title_id: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Judul (EN)</label>
              <input type="text" value={formData.title_en} onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Judul (AR)</label>
              <input type="text" value={formData.title_ar} onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Subtitle (ID) <span style={{ color: 'red' }}>*</span></label>
              <input type="text" required value={formData.subtitle_id} onChange={(e) => setFormData({ ...formData, subtitle_id: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Subtitle (EN)</label>
              <input type="text" value={formData.subtitle_en} onChange={(e) => setFormData({ ...formData, subtitle_en: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Subtitle (AR)</label>
              <input type="text" value={formData.subtitle_ar} onChange={(e) => setFormData({ ...formData, subtitle_ar: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>CTA Text (ID)</label>
              <input type="text" value={formData.cta_text_id} onChange={(e) => setFormData({ ...formData, cta_text_id: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>CTA Link</label>
              <input type="text" value={formData.cta_link} onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                placeholder="/profil" style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Gambar</label>
              <input type="file" accept="image/*" onChange={handleImageChange}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" style={{ marginTop: '8px', maxWidth: '200px', borderRadius: '8px' }} />
              )}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Urutan</label>
              <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
              <label style={{ fontWeight: '500', cursor: 'pointer' }}>Aktif (Slider akan muncul di beranda)</label>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button type="button" onClick={() => { setModalOpen(false); setEditing(null); setImageFile(null); setImagePreview(null) }}
                style={{ padding: '10px 20px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Batal</button>
              <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Simpan</button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  )
}

