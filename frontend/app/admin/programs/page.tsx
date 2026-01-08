'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { DataTable } from '@/components/admin/DataTable'
import { Modal } from '@/components/admin/Modal'
import { getAuthToken } from '@/lib/auth'

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [formData, setFormData] = useState({ 
    name: '', 
    description_id: '', 
    description_en: '', 
    description_ar: '', 
    icon: '', 
    type: 'academic',
    order: 0 
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    const token = getAuthToken()
    console.log('Programs page - Token:', token ? 'exists' : 'missing')
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/programs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      console.log('Programs API response status:', res.status)
      const data = await res.json()
      console.log('Programs API data:', data)
      console.log('Programs API data type:', typeof data)
      console.log('Programs API data.data:', data.data)
      console.log('Programs API isArray:', Array.isArray(data))
      
      // Handle both array and object with data property
      const programsData = Array.isArray(data) ? data : (data.data || data)
      console.log('Programs after processing:', programsData)
      
      setPrograms(programsData)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching programs:', err)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = getAuthToken()
    console.log('Programs handleSubmit - Token:', token ? 'exists' : 'missing')
    console.log('Programs handleSubmit - Editing:', editing)
    console.log('Programs handleSubmit - FormData:', formData)
    
    const url = editing
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/programs/${editing.id}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/programs`

    let response: Response

    try {
      if (imageFile) {
        // Use FormData for file upload
        const formDataToSend = new FormData()
        
        Object.keys(formData).forEach(key => {
          if (formData[key as keyof typeof formData] !== '') {
            formDataToSend.append(key, formData[key as keyof typeof formData] as string)
          }
        })
        if (imageFile) {
          formDataToSend.append('image', imageFile)
        }

        console.log('Programs handleSubmit - Using FormData for file upload')
        console.log('Programs handleSubmit - FormDataToSend entries:', Array.from(formDataToSend.entries()))

        response = await fetch(url, {
          method: editing ? 'PUT' : 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formDataToSend
        })
      } else {
        // Use JSON for simple update
        console.log('Programs handleSubmit - Using JSON for update')
        
        response = await fetch(url, {
          method: editing ? 'PUT' : 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
      }

      console.log('Programs handleSubmit - Response status:', response.status)
      console.log('Programs handleSubmit - Response headers:', Object.fromEntries(response.headers.entries()))
      
      const responseText = await response.text()
      console.log('Programs handleSubmit - Response text:', responseText)
      
      if (response.ok) {
        console.log('Programs handleSubmit - Update successful, calling fetchData...')
        setModalOpen(false)
        setEditing(null)
        setFormData({ name: '', description_id: '', description_en: '', description_ar: '', icon: '', type: 'academic', order: 0 })
        setImageFile(null)
        setImagePreview(null)
        await fetchData()
        console.log('Programs handleSubmit - fetchData completed')
        alert('Berhasil!')
      } else {
        try {
          const error = JSON.parse(responseText)
          console.error('Programs handleSubmit - Error response:', error)
          alert('Error: ' + (error.message || 'Unknown error'))
        } catch (e: any) {
          console.error('Programs handleSubmit - Non-JSON error:', responseText)
          alert('Error: ' + responseText)
        }
      }
    } catch (err: any) { 
      console.error('Programs handleSubmit - Exception:', err)
      alert('Error: ' + (err.message || err.toString())) 
    }
  }

  const handleEdit = (item: any) => {
    setEditing(item)
    setFormData({ 
      name: item.name || '', 
      description_id: item.description_id || '', 
      description_en: item.description_en || '', 
      description_ar: item.description_ar || '', 
      icon: item.icon || '', 
      type: item.type || 'academic',
      order: item.order || 0 
    })
    setImagePreview(item.image || null)
    setImageFile(null)
    setModalOpen(true)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <AdminLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Manajemen Program Unggulan</h1>
          <button onClick={() => { 
            setEditing(null); 
            setFormData({ name: '', description_id: '', description_en: '', description_ar: '', icon: '', type: 'academic', order: 0 }); 
            setImageFile(null)
            setImagePreview(null)
            setModalOpen(true) 
          }}
            style={{ padding: '10px 20px', backgroundColor: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>
            + Tambah Program
          </button>
        </div>
        <DataTable 
          columns={[
            { key: 'name', label: 'Nama' }, 
            { 
              key: 'type', 
              label: 'Tipe',
              render: (value: string) => {
                const typeLabels: { [key: string]: string } = {
                  'academic': 'Akademik',
                  'extracurricular': 'Ekstrakurikuler', 
                  'character': 'Karakter'
                }
                return typeLabels[value] || value
              }
            },
            { key: 'order', label: 'Urutan' }
          ]}
          data={programs} 
          onEdit={handleEdit}
          onDelete={async (item) => {
            const token = getAuthToken()
            try {
              const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/programs/${item.id}`, {
                method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
              })
              if (res.ok) { fetchData(); alert('Berhasil dihapus') }
            } catch (err) { alert('Error') }
          }} 
          loading={loading} 
        />
        <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); setImageFile(null); setImagePreview(null) }} title={editing ? 'Edit Program' : 'Tambah Program'}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Nama <span style={{ color: 'red' }}>*</span></label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Deskripsi (ID) <span style={{ color: 'red' }}>*</span></label>
              <textarea required value={formData.description_id} onChange={(e) => setFormData({ ...formData, description_id: e.target.value })}
                rows={4} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Deskripsi (EN)</label>
              <textarea value={formData.description_en} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                rows={4} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Deskripsi (AR)</label>
              <textarea value={formData.description_ar} onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                rows={4} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Icon (Emoji)</label>
              <input type="text" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="📖" style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Tipe Program <span style={{ color: 'red' }}>*</span></label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}>
                <option value="academic">Akademik</option>
                <option value="extracurricular">Ekstrakurikuler</option>
                <option value="character">Karakter</option>
              </select>
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

