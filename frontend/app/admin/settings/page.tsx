'use client'

import { useState } from 'react'

import { getAuthToken } from '@/lib/auth'
import { AdminLayout } from '@/components/admin/AdminLayout'

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    app_name: '',
    default_language: 'id',
    google_maps_api_key: '',
    whatsapp_api_key: '',
    whatsapp_phone_number: ''
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const token = getAuthToken()
    const formDataToSend = new FormData()
    
    Object.keys(formData).forEach(key => {
      if (key !== 'logo') {
        formDataToSend.append(key, formData[key as keyof typeof formData] as string)
      }
    })

    const fileInput = document.getElementById('logo') as HTMLInputElement
    if (fileInput?.files?.[0]) {
      formDataToSend.append('logo', fileInput.files[0])
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/settings`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataToSend
      })
      if (res.ok) {
        alert('Pengaturan berhasil disimpan!')
      } else {
        alert('Gagal menyimpan pengaturan')
      }
    } catch (err) {
      alert('Error: ' + err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 24px 0' }}>Pengaturan Sistem</h1>
        
        <form onSubmit={handleSubmit} style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Nama Aplikasi</label>
              <input
                type="text"
                value={formData.app_name}
                onChange={(e) => setFormData({ ...formData, app_name: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Logo</label>
              <input
                id="logo"
                type="file"
                accept="image/*"
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Bahasa Default</label>
              <select
                value={formData.default_language}
                onChange={(e) => setFormData({ ...formData, default_language: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
              >
                <option value="id">Indonesia</option>
                <option value="en">English</option>
                <option value="ar">Arabic</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Google Maps API Key</label>
              <input
                type="text"
                value={formData.google_maps_api_key}
                onChange={(e) => setFormData({ ...formData, google_maps_api_key: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>WhatsApp API Key</label>
              <input
                type="text"
                value={formData.whatsapp_api_key}
                onChange={(e) => setFormData({ ...formData, whatsapp_api_key: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Nomor WhatsApp</label>
              <input
                type="text"
                value={formData.whatsapp_phone_number}
                onChange={(e) => setFormData({ ...formData, whatsapp_phone_number: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: '10px 20px',
                  backgroundColor: saving ? '#94a3b8' : '#0284c7',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontWeight: '500'
                }}
              >
                {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}



