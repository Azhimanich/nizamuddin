'use client'

import { useState, useEffect } from 'react'

import { getAuthToken } from '@/lib/auth'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { DataTable } from '@/components/admin/DataTable'
import { Modal } from '@/components/admin/Modal'
import { useToast, validateImage } from '@/components/admin/Toast'

const PROFILE_TYPES = [
  { value: 'welcome', label: 'Welcome/Sekapur Sirih' },
  { value: 'vision', label: 'Visi' },
  { value: 'mission', label: 'Misi' },
  { value: 'identity', label: 'Identitas Sekolah' },
  { value: 'facility', label: 'Fasilitas' },
  { value: 'video', label: 'Video Profil' },
]

const TYPE_LABELS: { [key: string]: string } = {
  'welcome': 'Sekapur Sirih',
  'vision': 'Visi',
  'mission': 'Misi',
  'identity': 'Identitas Sekolah',
  'facility': 'Fasilitas',
  'video': 'Video Profil'
}

export default function ProfilesPage() {
  const { Toast, showSuccess, showError, showWarning } = useToast()
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [selectedType, setSelectedType] = useState<string>('welcome')
  const [identityKeys, setIdentityKeys] = useState<Array<{key: string, label: string}>>([])
  const [videoKeys, setVideoKeys] = useState<Array<{key: string, label: string}>>([])
  const [formData, setFormData] = useState({
    type: 'welcome',
    key: '',
    content: {
      id: { text: '', title: '', value: '', name: '', description: '', youtube_url: '' },
      en: { text: '', title: '', value: '', name: '', description: '', youtube_url: '' },
      ar: { text: '', title: '', value: '', name: '', description: '', youtube_url: '' },
    },
    order: 0,
    is_active: true,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => { 
    fetchData()
    fetchIdentityKeys()
    fetchVideoKeys()
  }, [])

  const fetchVideoKeys = async () => {
    const token = getAuthToken()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/video-keys`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setVideoKeys(data)
    } catch (err) {
      console.error('Failed to fetch video keys:', err)
    }
  }

  const fetchIdentityKeys = async () => {
    const token = getAuthToken()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/identity-keys`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setIdentityKeys(data)
    } catch (err) {
      console.error('Failed to fetch identity keys:', err)
    }
  }

  const fetchData = async () => {
    const token = getAuthToken()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/profiles`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setProfiles(data.data || data)
      setLoading(false)
    } catch (err) { setLoading(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.key || !formData.key.trim()) {
      showError('Key wajib diisi!')
      return
    }
    
    if (!formData.content) {
      showError('Konten wajib diisi!')
      return
    }

    const token = getAuthToken()
    if (!token) {
      showError('Token tidak ditemukan. Silakan login ulang.')
      return
    }

    const url = editing
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/profiles/${editing.id}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/profiles`

    const formDataToSend = new FormData()
    
    // Always send required fields
    formDataToSend.append('type', formData.type)
    formDataToSend.append('key', formData.key.trim())
    formDataToSend.append('content', JSON.stringify(formData.content))
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
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: formDataToSend
      })
      if (res.ok) {
        const responseData = await res.json()
        if (responseData.image) {
          setImagePreview(responseData.image)
        }
        setModalOpen(false)
        setEditing(null)
        setFormData({
          type: selectedType,
          key: '',
          content: {
            id: { text: '', title: '', value: '', name: '', description: '', youtube_url: '' },
            en: { text: '', title: '', value: '', name: '', description: '', youtube_url: '' },
            ar: { text: '', title: '', value: '', name: '', description: '', youtube_url: '' },
          },
          order: 0,
          is_active: true,
        })
        setImageFile(null)
        setImagePreview(null)
        fetchData()
        showSuccess(editing ? 'Profil berhasil diperbarui' : 'Profil berhasil ditambahkan')
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
        
        showError('Gagal menyimpan profil: ' + errorMessage)
        console.error('Error details:', errorData)
      }
    } catch (err) { 
      showError('Terjadi kesalahan saat menyimpan profil')
    }
  }

  const handleEdit = (item: any) => {
    setEditing(item)
    setSelectedType(item.type || 'welcome')
    
    // Ensure content structure is complete
    const defaultContent = {
      id: { text: '', title: '', value: '', name: '', description: '' },
      en: { text: '', title: '', value: '', name: '', description: '' },
      ar: { text: '', title: '', value: '', name: '', description: '' },
    }
    
    // Merge existing content with default to ensure all fields exist
    const mergedContent = item.content ? {
      id: { ...defaultContent.id, ...(item.content.id || {}) },
      en: { ...defaultContent.en, ...(item.content.en || {}) },
      ar: { ...defaultContent.ar, ...(item.content.ar || {}) },
    } : defaultContent
    
    setFormData({
      type: item.type || 'welcome',
      key: item.key || '',
      content: mergedContent,
      order: item.order || 0,
      is_active: item.is_active !== undefined ? item.is_active : true,
    })
    
    // Set image preview for welcome and facility types
    if (item.type === 'welcome' || item.type === 'facility') {
      const imageUrl = item.image?.startsWith('http') 
        ? item.image 
        : item.image 
          ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/storage/${item.image}`
          : null
      setImagePreview(imageUrl)
    } else {
      setImagePreview(null)
    }
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
    } else {
      // If no file selected, reset to original image
      setImageFile(null)
      if (editing && editing.image) {
        setImagePreview(editing.image)
      } else {
        setImagePreview(null)
      }
    }
  }

  const updateContent = (locale: string, field: string, value: string) => {
    setFormData({
      ...formData,
      content: {
        ...formData.content,
        [locale]: {
          ...formData.content[locale as keyof typeof formData.content],
          [field]: value,
        },
      },
    })
  }

  // Group profiles by type
  const groupedProfiles = profiles.reduce((acc: any, profile: any) => {
    if (!acc[profile.type]) {
      acc[profile.type] = []
    }
    acc[profile.type].push(profile)
    return acc
  }, {})

  // Get profiles for selected type
  const filteredProfiles = groupedProfiles[selectedType] || []

  return (
    <AdminLayout>
      {Toast}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Manajemen Profil</h1>
          <button onClick={() => {
            setEditing(null)
            setFormData({
              type: selectedType,
              key: '',
              content: {
                id: { text: '', title: '', value: '', name: '', description: '', youtube_url: '' },
                en: { text: '', title: '', value: '', name: '', description: '', youtube_url: '' },
                ar: { text: '', title: '', value: '', name: '', description: '', youtube_url: '' },
              },
              order: 0,
              is_active: true,
            })
            setImageFile(null)
            setImagePreview(null)
            setModalOpen(true)
          }}
            style={{ padding: '10px 20px', backgroundColor: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>
            + Tambah {TYPE_LABELS[selectedType]}
          </button>
        </div>

        {/* Type Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '2px solid #e5e7eb' }}>
          {PROFILE_TYPES.map(type => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              style={{
                padding: '12px 24px',
                backgroundColor: selectedType === type.value ? '#0284c7' : 'transparent',
                color: selectedType === type.value ? 'white' : '#6b7280',
                border: 'none',
                borderBottom: selectedType === type.value ? '2px solid #0284c7' : '2px solid transparent',
                cursor: 'pointer',
                fontWeight: selectedType === type.value ? '600' : '500',
                marginBottom: '-2px',
                transition: 'all 0.2s'
              }}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Table for selected type */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
            {TYPE_LABELS[selectedType]}
          </h2>
          <DataTable
            columns={[
              ...(selectedType === 'facility' ? [{
                key: 'image',
                label: 'Gambar',
                render: (value: any, row: any) => {
                  const imageUrl = row.image?.startsWith('http') 
                    ? row.image 
                    : row.image 
                      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/storage/${row.image}`
                      : null
                  return imageUrl ? (
                    <button
                      type="button"
                      onClick={() => {
                        const fullscreenDiv = document.createElement('div')
                        fullscreenDiv.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:9999;display:flex;align-items:center;justify-center;padding:20px;cursor:pointer'
                        fullscreenDiv.onclick = () => fullscreenDiv.remove()
                        const img = document.createElement('img')
                        img.src = imageUrl
                        img.style.cssText = 'max-width:90vw;max-height:90vh;object-fit:contain;border-radius:8px'
                        img.onclick = (e) => e.stopPropagation()
                        fullscreenDiv.appendChild(img)
                        document.body.appendChild(fullscreenDiv)
                      }}
                      style={{
                        width: '60px',
                        height: '60px',
                        padding: 0,
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        background: 'transparent'
                      }}
                      title="Klik untuk melihat gambar penuh"
                    >
                      <img 
                        src={imageUrl} 
                        alt={row.key} 
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                        draggable={false}
                      />
                    </button>
                  ) : (
                    <div style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#9ca3af',
                      fontSize: '20px'
                    }}>
                      ðŸ“·
                    </div>
                  )
                }
              }] : []),
              { key: 'key', label: 'Key' },
              { 
                key: 'order', 
                label: 'Urutan',
                render: (v) => v || 0
              },
              { key: 'is_active', label: 'Aktif', render: (v) => v ? 'Ya' : 'Tidak' }
            ]}
            data={filteredProfiles}
            onEdit={handleEdit}
            onDelete={async (item) => {
              const token = getAuthToken()
              try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/profiles/${item.id}`, {
                  method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
                })
                if (res.ok) { 
                  fetchData()
                  showSuccess('Profil berhasil dihapus')
                } else {
                  showError('Gagal menghapus profil')
                }
              } catch (err) { 
                showError('Terjadi kesalahan saat menghapus profil')
              }
            }}
            loading={loading}
          />
        </div>

        <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); setImageFile(null); setImagePreview(null) }} title={editing ? `Edit ${TYPE_LABELS[formData.type]}` : `Tambah ${TYPE_LABELS[formData.type]}`}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Tipe <span style={{ color: 'red' }}>*</span></label>
              <select required value={formData.type} onChange={(e) => {
                const newType = e.target.value
                setFormData({ ...formData, type: newType })
                setSelectedType(newType)
                // Clear image if changing from welcome/facility to other type
                if (newType !== 'welcome' && newType !== 'facility') {
                  setImageFile(null)
                  setImagePreview(null)
                }
              }}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}>
                {PROFILE_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Key (Unique) <span style={{ color: 'red' }}>*</span></label>
              {formData.type === 'identity' ? (
                <select 
                  required 
                  value={formData.key} 
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                >
                  <option value="">Pilih Key Identitas</option>
                  {identityKeys.map(key => (
                    <option key={key.key} value={key.key}>{key.label}</option>
                  ))}
                </select>
              ) : formData.type === 'video' ? (
                <select 
                  required 
                  value={formData.key} 
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                >
                  <option value="">Pilih Key Video</option>
                  {videoKeys.map(key => (
                    <option key={key.key} value={key.key}>{key.label}</option>
                  ))}
                </select>
              ) : (
                <input 
                  type="text" 
                  required 
                  value={formData.key} 
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  placeholder="sekapur_sirih, visi, misi, etc" 
                  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} 
                />
              )}
            </div>

            {/* Content ID */}
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Konten (Indonesia) <span style={{ color: 'red' }}>*</span></h3>
              {formData.type === 'identity' ? (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Value</label>
                  <input type="text" required value={formData.content.id.value} onChange={(e) => updateContent('id', 'value', e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
                </div>
              ) : formData.type === 'facility' ? (
                <>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Nama</label>
                    <input type="text" required value={formData.content.id.name} onChange={(e) => updateContent('id', 'name', e.target.value)}
                      style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Deskripsi</label>
                    <textarea required value={formData.content.id.description} onChange={(e) => updateContent('id', 'description', e.target.value)}
                      rows={3} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
                  </div>
                </>
              ) : formData.type === 'video' ? (
                <>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Judul Video</label>
                    <input type="text" required value={formData.content.id.title || ''} onChange={(e) => updateContent('id', 'title', e.target.value)}
                      placeholder="Video Profil Pondok Pesantren Nizamuddin"
                      style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Deskripsi Video</label>
                    <textarea value={formData.content.id.description || ''} onChange={(e) => updateContent('id', 'description', e.target.value)}
                      placeholder="Video pengenalan singkat tentang pesantren..."
                      rows={3} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>YouTube URL <span style={{ color: 'red' }}>*</span></label>
                    <input type="url" required value={formData.content.id.youtube_url || ''} onChange={(e) => updateContent('id', 'youtube_url', e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      Masukkan link YouTube (contoh: https://youtube.com/watch?v=VIDEO_ID)
                    </p>
                  </div>
                </>
              ) : (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Text</label>
                  <textarea required value={formData.content.id.text} onChange={(e) => updateContent('id', 'text', e.target.value)}
                    rows={6} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
                </div>
              )}
            </div>

            {/* Content EN */}
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Konten (English)</h3>
              {formData.type === 'identity' ? (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Value</label>
                  <input type="text" value={formData.content.en.value} onChange={(e) => updateContent('en', 'value', e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
                </div>
              ) : formData.type === 'facility' ? (
                <>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Name</label>
                    <input type="text" value={formData.content.en.name} onChange={(e) => updateContent('en', 'name', e.target.value)}
                      style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Description</label>
                    <textarea value={formData.content.en.description} onChange={(e) => updateContent('en', 'description', e.target.value)}
                      rows={3} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
                  </div>
                </>
              ) : formData.type === 'video' ? (
                <>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Video Title</label>
                    <input type="text" value={formData.content.en.title || ''} onChange={(e) => updateContent('en', 'title', e.target.value)}
                      placeholder="School Profile Video"
                      style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Video Description</label>
                    <textarea value={formData.content.en.description || ''} onChange={(e) => updateContent('en', 'description', e.target.value)}
                      placeholder="Brief introduction video about the school..."
                      rows={3} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>YouTube URL</label>
                    <input type="url" value={formData.content.en.youtube_url || ''} onChange={(e) => updateContent('en', 'youtube_url', e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      Enter YouTube link (e.g: https://youtube.com/watch?v=VIDEO_ID)
                    </p>
                  </div>
                </>
              ) : (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Text</label>
                  <textarea value={formData.content.en.text} onChange={(e) => updateContent('en', 'text', e.target.value)}
                    rows={6} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
                </div>
              )}
            </div>

            {/* Content AR */}
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Konten (Arabic)</h3>
              {formData.type === 'identity' ? (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Value</label>
                  <input type="text" value={formData.content.ar.value} onChange={(e) => updateContent('ar', 'value', e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
                </div>
              ) : formData.type === 'facility' ? (
                <>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Name</label>
                    <input type="text" value={formData.content.ar.name} onChange={(e) => updateContent('ar', 'name', e.target.value)}
                      style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Description</label>
                    <textarea value={formData.content.ar.description} onChange={(e) => updateContent('ar', 'description', e.target.value)}
                      rows={3} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
                  </div>
                </>
              ) : formData.type === 'video' ? (
                <>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Ø¹Ù†ÙˆØ§Ù† Ø§Ù„ÙÙŠØ¯ÙŠÙˆ</label>
                    <input type="text" value={formData.content.ar.title || ''} onChange={(e) => updateContent('ar', 'title', e.target.value)}
                      placeholder="ÙÙŠØ¯ÙŠÙˆ ØªØ¹Ø±ÙŠÙÙŠ Ø§Ù„Ù…Ø¯Ø±Ø³Ø©"
                      style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>ÙˆØµÙ Ø§Ù„ÙÙŠØ¯ÙŠÙˆ</label>
                    <textarea value={formData.content.ar.description || ''} onChange={(e) => updateContent('ar', 'description', e.target.value)}
                      placeholder="ÙÙŠØ¯ÙŠÙˆ ØªØ¹Ø±ÙŠÙÙŠ Ù‚ØµÙŠØ± Ø¹Ù† Ø§Ù„Ù…Ø¯Ø±Ø³Ø©..."
                      rows={3} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Ø±Ø§Ø¨Ø· ÙŠÙˆØªÙŠÙˆØ¨</label>
                    <input type="url" value={formData.content.ar.youtube_url || ''} onChange={(e) => updateContent('ar', 'youtube_url', e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      Ø£Ø¯Ø®Ù„ Ø±Ø§Ø¨Ø· ÙŠÙˆØªÙŠÙˆØ¨ (Ù…Ø«Ø§Ù„: https://youtube.com/watch?v=VIDEO_ID)
                    </p>
                  </div>
                </>
              ) : (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Text</label>
                  <textarea value={formData.content.ar.text} onChange={(e) => updateContent('ar', 'text', e.target.value)}
                    rows={6} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
                </div>
              )}
            </div>

            {/* Show image upload for welcome and facility types */}
            {(formData.type === 'welcome' || formData.type === 'facility') && (
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Gambar {formData.type === 'facility' && <span style={{ color: '#6b7280', fontSize: '12px' }}>(Opsional)</span>}
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
                      Ã—
                    </button>
                  </div>
                )}
              </div>
            )}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Urutan</label>
              <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
              <label style={{ fontWeight: '500', cursor: 'pointer' }}>Aktif (Akan muncul di halaman profil)</label>
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


