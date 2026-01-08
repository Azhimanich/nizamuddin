'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Modal } from '@/components/admin/Modal'
import { useToast, validateImage } from '@/components/admin/Toast'

export default function AboutPage() {
  const { Toast, showSuccess, showError, showWarning } = useToast()
  const [about, setAbout] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    title_id: '',
    title_en: '',
    title_ar: '',
    content_id: '',
    content_en: '',
    content_ar: '',
    cta_text_id: '',
    cta_text_en: '',
    cta_text_ar: '',
    cta_link: '',
    video_url: '',
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/about`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        credentials: 'include'
      })
      if (res.ok) {
        const data = await res.json()
        if (data) {
          setAbout(data)
          // Ensure all fields have values, never null or undefined
          setFormData({
            title_id: data.title_id ?? '',
            title_en: data.title_en ?? '',
            title_ar: data.title_ar ?? '',
            content_id: data.content_id ?? '',
            content_en: data.content_en ?? '',
            content_ar: data.content_ar ?? '',
            cta_text_id: data.cta_text_id ?? '',
            cta_text_en: data.cta_text_en ?? '',
            cta_text_ar: data.cta_text_ar ?? '',
            cta_link: data.cta_link ?? '',
            video_url: data.video_url ?? '',
            is_active: data.is_active !== undefined && data.is_active !== null ? Boolean(data.is_active) : true,
          })
          setImagePreview(data.image || null)
        } else {
          // No data, reset form
          setAbout(null)
          setFormData({
            title_id: '',
            title_en: '',
            title_ar: '',
            content_id: '',
            content_en: '',
            content_ar: '',
            cta_text_id: '',
            cta_text_en: '',
            cta_text_ar: '',
            cta_link: '',
            video_url: '',
            is_active: true,
          })
          setImagePreview(null)
        }
      } else {
        // If 404 or other error, no data exists
        setAbout(null)
      }
      setLoading(false)
    } catch (err) {
      console.error('Error fetching about data:', err)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.title_id || !formData.title_id.trim()) {
      showError('Judul (ID) wajib diisi!')
      return
    }
    if (!formData.content_id || !formData.content_id.trim()) {
      showError('Konten (ID) wajib diisi!')
      return
    }

    const token = localStorage.getItem('auth_token')
    if (!token) {
      showError('Token tidak ditemukan. Silakan login ulang.')
      return
    }

    const isEdit = about && about.id
    const url = isEdit
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/about/${about.id}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/about`

    // Prepare data - always use FormData to ensure all fields are sent
    const titleIdValue = formData.title_id.trim()
    const contentIdValue = formData.content_id.trim()
    
    if (!titleIdValue) {
      showError('Judul (ID) wajib diisi!')
      return
    }
    if (!contentIdValue) {
      showError('Konten (ID) wajib diisi!')
      return
    }

    // Always use FormData - it works for both with and without image
    const formDataToSend = new FormData()
    
    // Required fields - MUST be sent
    formDataToSend.append('title_id', titleIdValue)
    formDataToSend.append('content_id', contentIdValue)
    
    // Optional fields - always send (even if empty)
    formDataToSend.append('title_en', (formData.title_en || '').trim())
    formDataToSend.append('title_ar', (formData.title_ar || '').trim())
    formDataToSend.append('content_en', (formData.content_en || '').trim())
    formDataToSend.append('content_ar', (formData.content_ar || '').trim())
    formDataToSend.append('cta_text_id', (formData.cta_text_id || '').trim())
    formDataToSend.append('cta_text_en', (formData.cta_text_en || '').trim())
    formDataToSend.append('cta_text_ar', (formData.cta_text_ar || '').trim())
    formDataToSend.append('cta_link', (formData.cta_link || '').trim())
    formDataToSend.append('video_url', (formData.video_url || '').trim())
    formDataToSend.append('is_active', formData.is_active ? '1' : '0')
    
    // Only append image if there's a new file selected
    // If no new file and editing, the existing image will be kept on backend
    if (imageFile) {
      formDataToSend.append('image', imageFile)
    }
    // Note: If editing and no new image file, backend will keep the existing image

    try {
      // For PUT requests with FormData, Laravel needs _method
      if (isEdit) {
        formDataToSend.append('_method', 'PUT')
      }

      const res = await fetch(url, {
        method: isEdit ? 'POST' : 'POST', // Use POST for both, Laravel will handle _method
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
          // Don't set Content-Type for FormData - browser will set it automatically with boundary
        },
        credentials: 'include',
        body: formDataToSend
      })

      if (res.ok) {
        const responseData = await res.json()
        setAbout(responseData)
        setFormData({
          title_id: responseData.title_id || '',
          title_en: responseData.title_en || '',
          title_ar: responseData.title_ar || '',
          content_id: responseData.content_id || '',
          content_en: responseData.content_en || '',
          content_ar: responseData.content_ar || '',
          cta_text_id: responseData.cta_text_id || '',
          cta_text_en: responseData.cta_text_en || '',
          cta_text_ar: responseData.cta_text_ar || '',
          cta_link: responseData.cta_link || '',
          video_url: responseData.video_url || '',
          is_active: responseData.is_active !== undefined ? responseData.is_active : true,
        })
        setImagePreview(responseData.image || null)
        setModalOpen(false)
        setImageFile(null)
        fetchData()
        showSuccess(isEdit ? 'Data berhasil diperbarui' : 'Data berhasil ditambahkan')
      } else {
        const errorData = await res.json().catch(() => ({ message: 'Unknown error' }))
        let errorMessage = 'Terjadi kesalahan saat menyimpan data.'
        
        if (errorData.message) {
          errorMessage = errorData.message
        } else if (errorData.errors) {
          // Handle validation errors
          const errorMessages = Object.values(errorData.errors).flat()
          errorMessage = errorMessages.join(', ')
        } else if (errorData.error) {
          errorMessage = errorData.error
        }
        
        showError('Gagal menyimpan data: ' + errorMessage)
        console.error('Error details:', errorData)
      }
    } catch (err: any) {
      showError('Terjadi kesalahan: ' + (err.message || 'Network error'))
    }
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
    } else {
      // If no file selected, reset to original image
      setImageFile(null)
      if (about && about.image) {
        setImagePreview(about.image)
      } else {
        setImagePreview(null)
      }
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div>Loading...</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      {Toast}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Tentang Kami</h1>
          <button
            onClick={() => {
              // Reset form data when opening modal
              if (about) {
                setFormData({
                  title_id: about.title_id || '',
                  title_en: about.title_en || '',
                  title_ar: about.title_ar || '',
                  content_id: about.content_id || '',
                  content_en: about.content_en || '',
                  content_ar: about.content_ar || '',
                  cta_text_id: about.cta_text_id || '',
                  cta_text_en: about.cta_text_en || '',
                  cta_text_ar: about.cta_text_ar || '',
                  cta_link: about.cta_link || '',
                  video_url: about.video_url || '',
                  is_active: about.is_active !== undefined ? about.is_active : true,
                })
                setImagePreview(about.image || null)
              } else {
                setFormData({
                  title_id: '',
                  title_en: '',
                  title_ar: '',
                  content_id: '',
                  content_en: '',
                  content_ar: '',
                  cta_text_id: '',
                  cta_text_en: '',
                  cta_text_ar: '',
                  cta_link: '',
                  video_url: '',
                  is_active: true,
                })
                setImagePreview(null)
              }
              setImageFile(null)
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
            {about ? 'Edit' : 'Tambah'} Tentang Kami
          </button>
        </div>

        {about ? (
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>{about.title_id}</h2>
            <p style={{ color: '#6b7280', marginBottom: '16px', whiteSpace: 'pre-line' }}>{about.content_id}</p>
            {about.image && (
              <img src={about.image} alt="About" style={{ maxWidth: '300px', borderRadius: '8px', marginTop: '16px' }} />
            )}
          </div>
        ) : (
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center', color: '#6b7280' }}>
            Belum ada data Tentang Kami. Klik tombol di atas untuk menambahkan.
          </div>
        )}

        <Modal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false)
            setImageFile(null)
            // Reset form data when closing
            if (about) {
              setFormData({
                title_id: about.title_id || '',
                title_en: about.title_en || '',
                title_ar: about.title_ar || '',
                content_id: about.content_id || '',
                content_en: about.content_en || '',
                content_ar: about.content_ar || '',
                cta_text_id: about.cta_text_id || '',
                cta_text_en: about.cta_text_en || '',
                cta_text_ar: about.cta_text_ar || '',
                cta_link: about.cta_link || '',
                video_url: about.video_url || '',
                is_active: about.is_active !== undefined ? about.is_active : true,
              })
              setImagePreview(about.image || null)
            }
          }}
          title={about ? 'Edit Tentang Kami' : 'Tambah Tentang Kami'}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Judul (ID) <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title_id}
                onChange={(e) => setFormData({ ...formData, title_id: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Judul (EN)
              </label>
              <input
                type="text"
                value={formData.title_en}
                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Judul (AR)
              </label>
              <input
                type="text"
                value={formData.title_ar}
                onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Konten (ID) <span style={{ color: 'red' }}>*</span>
              </label>
              <textarea
                required
                value={formData.content_id}
                onChange={(e) => setFormData({ ...formData, content_id: e.target.value })}
                rows={6}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Konten (EN)
              </label>
              <textarea
                value={formData.content_en}
                onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                rows={6}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Konten (AR)
              </label>
              <textarea
                value={formData.content_ar}
                onChange={(e) => setFormData({ ...formData, content_ar: e.target.value })}
                rows={6}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                CTA Text (ID)
              </label>
              <input
                type="text"
                value={formData.cta_text_id}
                onChange={(e) => setFormData({ ...formData, cta_text_id: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                CTA Link
              </label>
              <input
                type="text"
                value={formData.cta_link}
                onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                placeholder="/profil"
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Video URL (YouTube/embed)
              </label>
              <input
                type="url"
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                placeholder="https://www.youtube.com/embed/..."
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Gambar
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                key={imagePreview ? 'has-image' : 'no-image'} // Force re-render to clear file input
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
                      // Clear file input
                      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
                      if (fileInput) {
                        fileInput.value = ''
                      }
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
                    title="Hapus gambar"
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
              <label style={{ fontWeight: '500', cursor: 'pointer' }}>
                Aktif (Akan muncul di beranda)
              </label>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false)
                  setImageFile(null)
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
