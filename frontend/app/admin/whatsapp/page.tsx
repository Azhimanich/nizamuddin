'use client'

import { useState } from 'react'

import { getAuthToken } from '@/lib/auth'
import { AdminLayout } from '@/components/admin/AdminLayout'

export default function WhatsAppPage() {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    const token = getAuthToken()
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/whatsapp/blast`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      })
      if (res.ok) {
        alert('Pesan berhasil dikirim!')
        setMessage('')
      } else {
        alert('Gagal mengirim pesan')
      }
    } catch (err) {
      alert('Error: ' + err)
    } finally {
      setSending(false)
    }
  }

  return (
    <AdminLayout>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 24px 0' }}>WhatsApp Blast</h1>
        
        <form onSubmit={handleSubmit} style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e5e7eb'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Pesan</label>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              placeholder="Tulis pesan yang akan dikirim ke semua subscriber..."
              style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button
              type="submit"
              disabled={sending}
              style={{
                padding: '10px 20px',
                backgroundColor: sending ? '#94a3b8' : '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: sending ? 'not-allowed' : 'pointer',
                fontWeight: '500'
              }}
            >
              {sending ? 'Mengirim...' : 'Kirim ke Semua Subscriber'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}



