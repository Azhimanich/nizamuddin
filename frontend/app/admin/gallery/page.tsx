'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { DataTable } from '@/components/admin/DataTable'
import { Modal } from '@/components/admin/Modal'
import { useToast, validateImage } from '@/components/admin/Toast'
import { getAuthToken, syncSessionStorage } from '@/lib/auth'

export default function GalleryPage() {
  const { Toast, showSuccess, showError, showWarning } = useToast()
  const [albums, setAlbums] = useState<any[]>([])
  const [photos, setPhotos] = useState<any[]>([])
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'albums' | 'photos' | 'videos'>('photos')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [formData, setFormData] = useState({ title: '', description: '', album_id: '', youtube_id: '' })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)

  useEffect(() => { 
    syncSessionStorage() // Sync auth state between tabs
    fetchData() 
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && fullscreenImage) {
        setFullscreenImage(null)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [fullscreenImage])

  const fetchData = async () => {
    const token = getAuthToken()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/gallery`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setAlbums(data.albums || [])
      setPhotos(data.photos || [])
      setVideos(data.videos || [])
      setLoading(false)
    } catch (err) { setLoading(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = getAuthToken()
    
    if (activeTab === 'photos') {
      const fileInput = document.getElementById('photo') as HTMLInputElement
      const hasFile = fileInput?.files?.[0]
      
      if (hasFile) {
        // Use FormData for file upload
        const formDataToSend = new FormData()
        formDataToSend.append('title', formData.title)
        formDataToSend.append('description', formData.description)
        if (formData.album_id) formDataToSend.append('album_id', formData.album_id)
        
        const file = fileInput.files[0]
        const validation = validateImage(file)
        
        if (!validation.valid) {
          showError(validation.message || 'Gambar tidak valid')
          fileInput.value = ''
          return
        }
        
        formDataToSend.append('image', file)

        const url = editing
          ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/gallery/photos/${editing.id}`
          : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/gallery/photos`

        try {
          const res = await fetch(url, {
            method: editing ? 'PUT' : 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formDataToSend
          })
          if (res.ok) {
            setModalOpen(false)
            setEditing(null)
            setFormData({ title: '', description: '', album_id: '', youtube_id: '' })
            fetchData()
            showSuccess(editing ? 'Foto berhasil diperbarui' : 'Foto berhasil ditambahkan')
          } else {
            const errorData = await res.json().catch(() => ({ message: 'Unknown error' }))
            console.error('Photo API Error:', errorData)
            
            let errorMessage = 'Gagal menyimpan foto'
            if (errorData.errors) {
              const validationErrors = Object.values(errorData.errors).flat()
              errorMessage = `Validasi gagal: ${validationErrors.join(', ')}`
            } else if (errorData.message) {
              errorMessage = errorData.message
            } else if (res.status === 401) {
              errorMessage = 'Authentication failed - please login again'
            } else if (res.status === 403) {
              errorMessage = 'Permission denied - you do not have access'
            } else if (res.status === 422) {
              errorMessage = errorData.error || 'Validation error - please check your input'
            } else if (res.status === 404) {
              errorMessage = 'Photo not found'
            }
            
            showError(errorMessage)
          }
        } catch (err) { 
          showError('Terjadi kesalahan saat menyimpan foto')
        }
      } else {
        // Use JSON for updates without file
        if (!editing) {
          showError('Gambar wajib diisi untuk foto baru')
          return
        }
        
        const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/gallery/photos/${editing.id}`

        try {
          const res = await fetch(url, {
            method: 'PUT',
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              title: formData.title,
              description: formData.description,
              album_id: formData.album_id || null
            })
          })
          if (res.ok) {
            setModalOpen(false)
            setEditing(null)
            setFormData({ title: '', description: '', album_id: '', youtube_id: '' })
            fetchData()
            showSuccess('Foto berhasil diperbarui')
          } else {
            const errorData = await res.json().catch(() => ({ message: 'Unknown error' }))
            console.error('Photo Update Error:', errorData)
            
            let errorMessage = 'Gagal memperbarui foto'
            if (errorData.errors) {
              const validationErrors = Object.values(errorData.errors).flat()
              errorMessage = `Validasi gagal: ${validationErrors.join(', ')}`
            } else if (errorData.message) {
              errorMessage = errorData.message
            } else if (res.status === 401) {
              errorMessage = 'Authentication failed - please login again'
            } else if (res.status === 403) {
              errorMessage = 'Permission denied - you do not have access'
            } else if (res.status === 422) {
              errorMessage = errorData.error || 'Validation error - please check your input'
            } else if (res.status === 404) {
              errorMessage = 'Photo not found'
            }
            
            showError(errorMessage)
          }
        } catch (err) { 
          showError('Terjadi kesalahan saat memperbarui foto')
        }
      }
    } else if (activeTab === 'videos') {
      // Extract YouTube ID from URL if full URL is provided
      let youtubeId = formData.youtube_id;
      if (youtubeId.includes('youtube.com/watch?v=')) {
        youtubeId = youtubeId.split('v=')[1]?.split('&')[0];
      } else if (youtubeId.includes('youtu.be/')) {
        youtubeId = youtubeId.split('youtu.be/')[1]?.split('?')[0];
      } else if (youtubeId.includes('youtube.com/embed/')) {
        youtubeId = youtubeId.split('embed/')[1]?.split('?')[0];
      }

      const url = editing
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/gallery/videos/${editing.id}`
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/gallery/videos`

      try {
        const res = await fetch(url, {
          method: editing ? 'PUT' : 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: formData.title, description: formData.description, youtube_id: youtubeId })
        })
        if (res.ok) {
          setModalOpen(false)
          setEditing(null)
          setFormData({ title: '', description: '', album_id: '', youtube_id: '' })
          fetchData()
          showSuccess(editing ? 'Video berhasil diperbarui' : 'Video berhasil ditambahkan')
        } else {
          const errorData = await res.json().catch(() => ({ message: 'Unknown error' }))
          console.error('Video API Error:', errorData)
          
          let errorMessage = 'Gagal menyimpan video'
          if (errorData.errors) {
            // Validation errors
            const validationErrors = Object.values(errorData.errors).flat()
            errorMessage = `Validasi gagal: ${validationErrors.join(', ')}`
          } else if (errorData.message) {
            errorMessage = errorData.message
          } else if (res.status === 401) {
            errorMessage = 'Authentication failed - please login again'
          } else if (res.status === 403) {
            errorMessage = 'Permission denied - you do not have access'
          } else if (res.status === 422) {
            errorMessage = errorData.error || 'Validation error - please check your input'
          } else if (res.status === 404) {
            errorMessage = 'Video not found'
          }
          
          showError(errorMessage)
        }
      } catch (err) { 
        showError('Terjadi kesalahan saat menyimpan video')
      }
    }
  }

  const handleDelete = async (item: any) => {
    const token = getAuthToken()
    const endpoint = activeTab === 'photos' ? 'photos' : 'videos'
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/gallery/${endpoint}/${item.id}`, {
        method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) { 
        fetchData()
        showSuccess(activeTab === 'photos' ? 'Foto berhasil dihapus' : 'Video berhasil dihapus')
      } else {
        const errorData = await res.json().catch(() => ({ message: 'Unknown error' }))
        console.error('Delete Error:', errorData)
        
        let errorMessage = 'Gagal menghapus ' + (activeTab === 'photos' ? 'foto' : 'video')
        if (errorData.message) {
          errorMessage = errorData.message
        } else if (res.status === 401) {
          errorMessage = 'Authentication failed - please login again'
        } else if (res.status === 403) {
          errorMessage = 'Permission denied - you do not have access'
        } else if (res.status === 404) {
          errorMessage = (activeTab === 'photos' ? 'Foto' : 'Video') + ' not found'
        }
        
        showError(errorMessage)
      }
    } catch (err) { 
      showError('Terjadi kesalahan saat menghapus')
    }
  }

  return (
    <AdminLayout>
      {Toast}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Manajemen Galeri</h1>
          <button onClick={() => { setEditing(null); setFormData({ title: '', description: '', album_id: '', youtube_id: '' }); setModalOpen(true) }}
            style={{ padding: '10px 20px', backgroundColor: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>
            + Tambah {activeTab === 'photos' ? 'Foto' : 'Video'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '2px solid #e5e7eb' }}>
          {(['photos', 'videos'] as const).map(tab => (
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
              {tab === 'photos' ? 'Foto' : 'Video'}
            </button>
          ))}
        </div>

        <DataTable
          columns={activeTab === 'photos' 
            ? [
                { 
                  key: 'image', 
                  label: 'Gambar', 
                  render: (value, row) => {
                    const imageUrl = row.image?.startsWith('http') 
                      ? row.image 
                      : row.image 
                        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/storage/${row.image}`
                        : null
                    return imageUrl ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setFullscreenImage(imageUrl)
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation()
                        }}
                        onMouseEnter={(e) => {
                          const img = e.currentTarget.querySelector('img')
                          if (img) {
                            img.style.transform = 'scale(1.05)'
                            img.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          const img = e.currentTarget.querySelector('img')
                          if (img) {
                            img.style.transform = 'scale(1)'
                            img.style.boxShadow = 'none'
                          }
                        }}
                        style={{
                          width: '80px',
                          height: '80px',
                          cursor: 'pointer',
                          display: 'inline-block',
                          userSelect: 'none',
                          padding: 0,
                          border: 'none',
                          background: 'transparent',
                          outline: 'none'
                        }}
                        title="Klik untuk melihat gambar penuh"
                      >
                        <img 
                          src={imageUrl} 
                          alt={row.title || 'Photo'} 
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '2px solid #e5e7eb',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            display: 'block',
                            pointerEvents: 'none'
                          }}
                          draggable={false}
                        />
                      </button>
                    ) : (
                      <div style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#9ca3af',
                        fontSize: '24px',
                        border: '2px solid #e5e7eb'
                      }}>
                        📷
                      </div>
                    )
                  }
                },
                { key: 'title', label: 'Judul' }, 
                { key: 'album', label: 'Album', render: (v, row) => row.album?.name || '-' }
              ]
            : [
                { key: 'title', label: 'Judul' }, 
                { key: 'youtube_id', label: 'YouTube ID' }
              ]
          }
          data={activeTab === 'photos' ? photos : videos}
          onEdit={(item) => {
            setEditing(item)
            setFormData({
              title: item.title || '',
              description: item.description || '',
              album_id: item.album_id?.toString() || '',
              youtube_id: item.youtube_id || ''
            })
            setModalOpen(true)
          }}
          onDelete={handleDelete}
          loading={loading}
        />

        <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditing(null) }} title={editing ? `Edit ${activeTab === 'photos' ? 'Foto' : 'Video'}` : `Tambah ${activeTab === 'photos' ? 'Foto' : 'Video'}`}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeTab === 'photos' && (
              <div><label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Album</label>
                <select value={formData.album_id} onChange={(e) => setFormData({ ...formData, album_id: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}>
                  <option value="">Tanpa Album</option>
                  {albums.map(album => (
                    <option key={album.id} value={album.id}>{album.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div><label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Judul</label>
              <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            </div>
            <div><label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Deskripsi</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            </div>
            {activeTab === 'photos' ? (
              <div><label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Gambar {!editing && '(Wajib)'}</label>
                <input 
                  id="photo" 
                  type="file" 
                  accept="image/*" 
                  required={!editing}
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
              </div>
            ) : (
              <div><label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>YouTube ID atau URL</label>
                <input type="text" required value={formData.youtube_id} onChange={(e) => setFormData({ ...formData, youtube_id: e.target.value })}
                  placeholder="dQw4w9WgXcQ atau https://youtube.com/watch?v=dQw4w9WgXcQ" style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Anda bisa memasukkan YouTube ID (dQw4w9WgXcQ) atau URL lengkap</p>
              </div>
            )}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button type="button" onClick={() => { setModalOpen(false); setEditing(null) }}
                style={{ padding: '10px 20px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Batal</button>
              <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Simpan</button>
            </div>
          </form>
        </Modal>

        {/* Fullscreen Image Modal */}
        {fullscreenImage && (
          <div
            onClick={() => setFullscreenImage(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: '20px'
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                maxWidth: '90vw',
                maxHeight: '90vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img
                src={fullscreenImage}
                alt="Fullscreen"
                style={{
                  maxWidth: '100%',
                  maxHeight: '90vh',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                }}
              />
              <button
                onClick={() => setFullscreenImage(null)}
                style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '0',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#374151',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'
                }}
                title="Tutup (ESC)"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

