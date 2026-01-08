'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { DataTable } from '@/components/admin/DataTable'
import { Modal } from '@/components/admin/Modal'
import { useToast } from '@/components/admin/Toast'
import { getAuthToken, syncSessionStorage } from '@/lib/auth'
import { EnvelopeIcon, PhoneIcon, CheckIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/outline'

export default function ContactsPage() {
  const { Toast, showSuccess, showError } = useToast()
  const [activeTab, setActiveTab] = useState<'messages' | 'information' | 'map'>('messages')
  
  // Messages tab states
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<any>(null)
  const [filterRead, setFilterRead] = useState<string>('all') // 'all', 'read', 'unread'
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  
  // Information tab states
  const [contactInfo, setContactInfo] = useState<any[]>([])
  const [infoLoading, setInfoLoading] = useState(true)
  const [infoModalOpen, setInfoModalOpen] = useState(false)
  const [editingInfo, setEditingInfo] = useState<any>(null)
  const [infoFormData, setInfoFormData] = useState({
    type: '',
    value_id: '',
    value_en: '',
    value_ar: '',
    order: 0,
    is_active: true
  })
  
  // Map tab states
  const [maps, setMaps] = useState<any[]>([])
  const [mapLoading, setMapLoading] = useState(true)
  const [mapModalOpen, setMapModalOpen] = useState(false)
  const [editingMap, setEditingMap] = useState<any>(null)
  const [mapFormData, setMapFormData] = useState({
    name: '',
    address: '',
    embed_url: '',
    api_key: '',
    zoom_level: 15,
    map_type: 'roadmap',
    order: 0,
    is_active: true
  })

  useEffect(() => {
    syncSessionStorage() // Sync auth state between tabs
    if (activeTab === 'messages') {
      fetchContacts()
    } else if (activeTab === 'information') {
      fetchContactInfo()
    } else if (activeTab === 'map') {
      fetchMaps()
    }
  }, [activeTab, filterRead, searchTerm])

  const fetchContacts = async () => {
    const token = getAuthToken()
    setLoading(true)
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/contacts?per_page=50`
      
      if (filterRead !== 'all') {
        url += `&is_read=${filterRead === 'read'}`
      }
      
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`
      }

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setContacts(Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []))
    } catch (err) {
      showError('Gagal memuat data kontak')
    } finally {
      setLoading(false)
    }
  }

  const handleView = (contact: any) => {
    setSelectedContact(contact)
    setModalOpen(true)
    
    // Mark as read when viewing
    if (!contact.is_read) {
      markAsRead(contact.id)
    }
  }

  const markAsRead = async (id: number) => {
    const token = getAuthToken()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/contacts/${id}/mark-read`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        fetchContacts()
        if (selectedContact?.id === id) {
          setSelectedContact({ ...selectedContact, is_read: true })
        }
      }
    } catch (err) {
      showError('Gagal menandai sebagai sudah dibaca')
    }
  }

  const markAsUnread = async (id: number) => {
    const token = getAuthToken()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/contacts/${id}/mark-unread`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        fetchContacts()
        if (selectedContact?.id === id) {
          setSelectedContact({ ...selectedContact, is_read: false })
        }
      }
    } catch (err) {
      showError('Gagal menandai sebagai belum dibaca')
    }
  }

  const handleDelete = async (contact: any) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kontak dari ${contact.name}?`)) {
      return
    }

    const token = getAuthToken()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/contacts/${contact.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        fetchContacts()
        if (selectedContact?.id === contact.id) {
          setModalOpen(false)
          setSelectedContact(null)
        }
        showSuccess('Kontak berhasil dihapus')
      } else {
        showError('Gagal menghapus kontak')
      }
    } catch (err) {
      showError('Terjadi kesalahan saat menghapus kontak')
    }
  }

  const handleBulkMarkAsRead = async () => {
    if (selectedIds.length === 0) {
      showError('Pilih kontak terlebih dahulu')
      return
    }

    const token = getAuthToken()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/contacts/bulk-mark-read`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: selectedIds })
      })
      if (res.ok) {
        fetchContacts()
        setSelectedIds([])
        showSuccess(`${selectedIds.length} kontak berhasil ditandai sebagai sudah dibaca`)
      } else {
        showError('Gagal menandai kontak')
      }
    } catch (err) {
      showError('Terjadi kesalahan saat menandai kontak')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      showError('Pilih kontak terlebih dahulu')
      return
    }

    if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} kontak?`)) {
      return
    }

    const token = getAuthToken()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/contacts/bulk-delete`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: selectedIds })
      })
      if (res.ok) {
        fetchContacts()
        setSelectedIds([])
        showSuccess(`${selectedIds.length} kontak berhasil dihapus`)
      } else {
        showError('Gagal menghapus kontak')
      }
    } catch (err) {
      showError('Terjadi kesalahan saat menghapus kontak')
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Contact Information functions
  const fetchContactInfo = async () => {
    const token = getAuthToken()
    setInfoLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/contact-information`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setContactInfo(Array.isArray(data) ? data : [])
    } catch (err) {
      showError('Gagal memuat informasi kontak')
    } finally {
      setInfoLoading(false)
    }
  }

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = getAuthToken()
    
    if (!infoFormData.type || !infoFormData.type.trim()) {
      showError('Tipe wajib diisi!')
      return
    }

    const url = editingInfo
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/contact-information/${editingInfo.id}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/contact-information`

    try {
      const res = await fetch(url, {
        method: editingInfo ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(infoFormData)
      })

      if (res.ok) {
        setInfoModalOpen(false)
        setEditingInfo(null)
        setInfoFormData({
          type: '',
          value_id: '',
          value_en: '',
          value_ar: '',
          order: 0,
          is_active: true
        })
        fetchContactInfo()
        showSuccess(editingInfo ? 'Informasi kontak berhasil diperbarui' : 'Informasi kontak berhasil ditambahkan')
      } else {
        const errorData = await res.json().catch(() => ({ message: 'Unknown error' }))
        showError('Gagal menyimpan: ' + (errorData.message || 'Terjadi kesalahan'))
      }
    } catch (err) {
      showError('Terjadi kesalahan saat menyimpan informasi kontak')
    }
  }

  const handleInfoEdit = (item: any) => {
    setEditingInfo(item)
    setInfoFormData({
      type: item.type || '',
      value_id: item.value_id || '',
      value_en: item.value_en || '',
      value_ar: item.value_ar || '',
      order: item.order || 0,
      is_active: item.is_active !== undefined ? item.is_active : true
    })
    setInfoModalOpen(true)
  }

  const handleInfoDelete = async (item: any) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus informasi kontak "${item.type}"?`)) {
      return
    }

    const token = getAuthToken()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/contact-information/${item.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        fetchContactInfo()
        showSuccess('Informasi kontak berhasil dihapus')
      } else {
        showError('Gagal menghapus informasi kontak')
      }
    } catch (err) {
      showError('Terjadi kesalahan saat menghapus informasi kontak')
    }
  }

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'address': 'Alamat',
      'phone': 'Telepon',
      'email': 'Email',
      'google_maps_api_key': 'Google Maps API Key',
      'google_maps_embed_url': 'Google Maps Embed URL',
      'whatsapp': 'WhatsApp',
      'facebook': 'Facebook',
      'instagram': 'Instagram',
      'youtube': 'YouTube',
      'twitter': 'Twitter',
      'linkedin': 'LinkedIn'
    }
    return labels[type] || type
  }

  // Map functions
  const fetchMaps = async () => {
    const token = getAuthToken()
    setMapLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/maps`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setMaps(Array.isArray(data) ? data : [])
    } catch (err) {
      showError('Gagal memuat data peta')
    } finally {
      setMapLoading(false)
    }
  }

  const handleMapSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = getAuthToken()

    if (!mapFormData.embed_url || !mapFormData.embed_url.trim()) {
      showError('Google Maps Embed URL wajib diisi!')
      return
    }

    const url = editingMap
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/maps/${editingMap.id}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/maps`

    try {
      const res = await fetch(url, {
        method: editingMap ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...mapFormData,
          latitude: null,
          longitude: null,
          zoom_level: parseInt(mapFormData.zoom_level.toString())
        })
      })

      if (res.ok) {
        setMapModalOpen(false)
        setEditingMap(null)
        setMapFormData({
          name: '',
          address: '',
          embed_url: '',
          api_key: '',
          zoom_level: 15,
          map_type: 'roadmap',
          order: 0,
          is_active: true
        })
        fetchMaps()
        showSuccess(editingMap ? 'Peta berhasil diperbarui' : 'Peta berhasil ditambahkan')
      } else {
        const errorData = await res.json().catch(() => ({ message: 'Unknown error' }))
        showError('Gagal menyimpan: ' + (errorData.message || 'Terjadi kesalahan'))
      }
    } catch (err) {
      showError('Terjadi kesalahan saat menyimpan peta')
    }
  }

  const handleMapEdit = (item: any) => {
    setEditingMap(item)
    setMapFormData({
      name: item.name || '',
      address: item.address || '',
      embed_url: item.embed_url || '',
      api_key: item.api_key || '',
      zoom_level: item.zoom_level || 15,
      map_type: item.map_type || 'roadmap',
      order: item.order || 0,
      is_active: item.is_active !== undefined ? item.is_active : true
    })
    setMapModalOpen(true)
  }

  const handleMapDelete = async (item: any) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus peta "${item.name || 'Peta'}"?`)) {
      return
    }

    const token = getAuthToken()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/maps/${item.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        fetchMaps()
        showSuccess('Peta berhasil dihapus')
      } else {
        showError('Gagal menghapus peta')
      }
    } catch (err) {
      showError('Terjadi kesalahan saat menghapus peta')
    }
  }

  return (
    <AdminLayout>
      {Toast}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Manajemen Kontak</h1>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '2px solid #e5e7eb' }}>
          <button
            onClick={() => setActiveTab('messages')}
            style={{
              padding: '12px 24px',
              backgroundColor: activeTab === 'messages' ? '#0284c7' : 'transparent',
              color: activeTab === 'messages' ? 'white' : '#6b7280',
              border: 'none',
              borderBottom: activeTab === 'messages' ? '2px solid #0284c7' : '2px solid transparent',
              cursor: 'pointer',
              fontWeight: activeTab === 'messages' ? '600' : '500',
              marginBottom: '-2px',
              transition: 'all 0.2s'
            }}
          >
            📨 Manajemen Pesan
          </button>
          <button
            onClick={() => setActiveTab('information')}
            style={{
              padding: '12px 24px',
              backgroundColor: activeTab === 'information' ? '#0284c7' : 'transparent',
              color: activeTab === 'information' ? 'white' : '#6b7280',
              border: 'none',
              borderBottom: activeTab === 'information' ? '2px solid #0284c7' : '2px solid transparent',
              cursor: 'pointer',
              fontWeight: activeTab === 'information' ? '600' : '500',
              marginBottom: '-2px',
              transition: 'all 0.2s'
            }}
          >
            ℹ️ Informasi Kontak
          </button>
          <button
            onClick={() => setActiveTab('map')}
            style={{
              padding: '12px 24px',
              backgroundColor: activeTab === 'map' ? '#0284c7' : 'transparent',
              color: activeTab === 'map' ? 'white' : '#6b7280',
              border: 'none',
              borderBottom: activeTab === 'map' ? '2px solid #0284c7' : '2px solid transparent',
              cursor: 'pointer',
              fontWeight: activeTab === 'map' ? '600' : '500',
              marginBottom: '-2px',
              transition: 'all 0.2s'
            }}
          >
            🗺️ Peta
          </button>
        </div>

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <>

        {/* Filters and Search */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '24px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <input
              type="text"
              placeholder="Cari nama, email, subjek, atau pesan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
          <select
            value={filterRead}
            onChange={(e) => setFilterRead(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="all">Semua Status</option>
            <option value="unread">Belum Dibaca</option>
            <option value="read">Sudah Dibaca</option>
          </select>
          {selectedIds.length > 0 && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleBulkMarkAsRead}
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <CheckIcon style={{ width: '16px', height: '16px' }} />
                Tandai Dibaca ({selectedIds.length})
              </button>
              <button
                onClick={handleBulkDelete}
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <TrashIcon style={{ width: '16px', height: '16px' }} />
                Hapus ({selectedIds.length})
              </button>
            </div>
          )}
        </div>

        <DataTable
          columns={[
            {
              key: 'checkbox',
              label: '',
              render: (value, row) => (
                <input
                  type="checkbox"
                  checked={selectedIds.includes(row.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedIds([...selectedIds, row.id])
                    } else {
                      setSelectedIds(selectedIds.filter(id => id !== row.id))
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                />
              )
            },
            {
              key: 'is_read',
              label: 'Status',
              render: (value) => (
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  backgroundColor: value ? '#d1fae5' : '#fee2e2',
                  color: value ? '#065f46' : '#991b1b'
                }}>
                  {value ? '✓ Dibaca' : '● Belum Dibaca'}
                </span>
              )
            },
            {
              key: 'name',
              label: 'Nama',
              render: (value, row) => (
                <div>
                  <div style={{ fontWeight: '600', color: '#111827' }}>{value}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                    {row.email}
                  </div>
                </div>
              )
            },
            {
              key: 'phone',
              label: 'Telepon',
              render: (value) => value || '-'
            },
            {
              key: 'subject',
              label: 'Subjek',
              render: (value) => (
                <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {value}
                </div>
              )
            },
            {
              key: 'created_at',
              label: 'Tanggal',
              render: (value) => formatDate(value)
            }
          ]}
          data={contacts}
          onEdit={(contact) => handleView(contact)}
          onDelete={handleDelete}
          loading={loading}
        />

        {/* Detail Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false)
            setSelectedContact(null)
          }}
          title="Detail Kontak"
        >
          {selectedContact && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Status</div>
                  <span style={{
                    padding: '6px 16px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    backgroundColor: selectedContact.is_read ? '#d1fae5' : '#fee2e2',
                    color: selectedContact.is_read ? '#065f46' : '#991b1b'
                  }}>
                    {selectedContact.is_read ? '✓ Sudah Dibaca' : '● Belum Dibaca'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {selectedContact.is_read ? (
                    <button
                      onClick={() => {
                        markAsUnread(selectedContact.id)
                      }}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <XMarkIcon style={{ width: '16px', height: '16px' }} />
                      Tandai Belum Dibaca
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        markAsRead(selectedContact.id)
                      }}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <CheckIcon style={{ width: '16px', height: '16px' }} />
                      Tandai Dibaca
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(selectedContact)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <TrashIcon style={{ width: '16px', height: '16px' }} />
                    Hapus
                  </button>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Nama</div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{selectedContact.name}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <EnvelopeIcon style={{ width: '14px', height: '14px' }} />
                    Email
                  </div>
                  <div style={{ fontSize: '14px', color: '#111827' }}>
                    <a href={`mailto:${selectedContact.email}`} style={{ color: '#0284c7', textDecoration: 'none' }}>
                      {selectedContact.email}
                    </a>
                  </div>
                </div>
                {selectedContact.phone && (
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <PhoneIcon style={{ width: '14px', height: '14px' }} />
                      Telepon
                    </div>
                    <div style={{ fontSize: '14px', color: '#111827' }}>
                      <a href={`tel:${selectedContact.phone}`} style={{ color: '#0284c7', textDecoration: 'none' }}>
                        {selectedContact.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Subjek</div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{selectedContact.subject}</div>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Pesan</div>
                <div style={{
                  fontSize: '14px',
                  color: '#374151',
                  lineHeight: '1.6',
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  whiteSpace: 'pre-wrap',
                  maxHeight: '300px',
                  overflowY: 'auto'
                }}>
                  {selectedContact.message}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Tanggal Dikirim</div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>{formatDate(selectedContact.created_at)}</div>
              </div>
            </div>
          )}
        </Modal>
          </>
        )}

        {/* Information Tab */}
        {activeTab === 'information' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>Informasi Kontak Publik</h2>
              <button
                onClick={() => {
                  setEditingInfo(null)
                  setInfoFormData({
                    type: '',
                    value_id: '',
                    value_en: '',
                    value_ar: '',
                    order: 0,
                    is_active: true
                  })
                  setInfoModalOpen(true)
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
                + Tambah Informasi Kontak
              </button>
            </div>

            <DataTable
              columns={[
                { key: 'type', label: 'Tipe', render: (value) => getTypeLabel(value) },
                { 
                  key: 'value_id', 
                  label: 'Nilai (ID)', 
                  render: (value) => value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : '-'
                },
                { 
                  key: 'value_en', 
                  label: 'Nilai (EN)', 
                  render: (value) => value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : '-'
                },
                { 
                  key: 'value_ar', 
                  label: 'Nilai (AR)', 
                  render: (value) => value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : '-'
                },
                { key: 'order', label: 'Urutan' },
                { key: 'is_active', label: 'Aktif', render: (v) => v ? 'Ya' : 'Tidak' }
              ]}
              data={contactInfo}
              onEdit={handleInfoEdit}
              onDelete={handleInfoDelete}
              loading={infoLoading}
            />

            <Modal
              isOpen={infoModalOpen}
              onClose={() => {
                setInfoModalOpen(false)
                setEditingInfo(null)
                setInfoFormData({
                  type: '',
                  value_id: '',
                  value_en: '',
                  value_ar: '',
                  order: 0,
                  is_active: true
                })
              }}
              title={editingInfo ? 'Edit Informasi Kontak' : 'Tambah Informasi Kontak'}
            >
              <form onSubmit={handleInfoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Tipe <span style={{ color: 'red' }}>*</span>
                  </label>
                  <select
                    required
                    value={infoFormData.type}
                    onChange={(e) => setInfoFormData({ ...infoFormData, type: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                  >
                    <option value="">Pilih Tipe</option>
                    <option value="address">Alamat</option>
                    <option value="phone">Telepon</option>
                    <option value="email">Email</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="google_maps_api_key">Google Maps API Key</option>
                    <option value="google_maps_embed_url">Google Maps Embed URL</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="twitter">Twitter</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Nilai (Bahasa Indonesia)
                  </label>
                  <textarea
                    value={infoFormData.value_id}
                    onChange={(e) => setInfoFormData({ ...infoFormData, value_id: e.target.value })}
                    rows={3}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                    placeholder="Masukkan nilai untuk bahasa Indonesia"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Nilai (English)
                  </label>
                  <textarea
                    value={infoFormData.value_en}
                    onChange={(e) => setInfoFormData({ ...infoFormData, value_en: e.target.value })}
                    rows={3}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                    placeholder="Enter value for English"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Nilai (Arabic)
                  </label>
                  <textarea
                    value={infoFormData.value_ar}
                    onChange={(e) => setInfoFormData({ ...infoFormData, value_ar: e.target.value })}
                    rows={3}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                    placeholder="أدخل القيمة للعربية"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Urutan</label>
                  <input
                    type="number"
                    value={infoFormData.order}
                    onChange={(e) => setInfoFormData({ ...infoFormData, order: parseInt(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={infoFormData.is_active}
                    onChange={(e) => setInfoFormData({ ...infoFormData, is_active: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label style={{ fontWeight: '500', cursor: 'pointer' }}>Aktif (Akan muncul di halaman kontak)</label>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setInfoModalOpen(false)
                      setEditingInfo(null)
                      setInfoFormData({
                        type: '',
                        value_id: '',
                        value_en: '',
                        value_ar: '',
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

        {/* Map Tab */}
        {activeTab === 'map' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>Manajemen Peta</h2>
              <button
                onClick={() => {
                  setEditingMap(null)
                  setMapFormData({
                    name: '',
                    address: '',
                    embed_url: '',
                    api_key: '',
                    zoom_level: 15,
                    map_type: 'roadmap',
                    order: 0,
                    is_active: true
                  })
                  setMapModalOpen(true)
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
                + Tambah Peta
              </button>
            </div>

            <DataTable
              columns={[
                { key: 'name', label: 'Nama Lokasi', render: (value) => value || '-' },
                { 
                  key: 'address', 
                  label: 'Alamat', 
                  render: (value) => value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : '-'
                },
                { 
                  key: 'embed_url', 
                  label: 'Embed URL', 
                  render: (value) => value ? (value.length > 30 ? value.substring(0, 30) + '...' : value) : '-'
                },
                { key: 'zoom_level', label: 'Zoom' },
                { key: 'map_type', label: 'Tipe Peta' },
                { key: 'is_active', label: 'Aktif', render: (v) => v ? 'Ya' : 'Tidak' }
              ]}
              data={maps}
              onEdit={handleMapEdit}
              onDelete={handleMapDelete}
              loading={mapLoading}
            />

            <Modal
              isOpen={mapModalOpen}
              onClose={() => {
                setMapModalOpen(false)
                setEditingMap(null)
                setMapFormData({
                  name: '',
                  address: '',
                  embed_url: '',
                  api_key: '',
                  zoom_level: 15,
                  map_type: 'roadmap',
                  order: 0,
                  is_active: true
                })
              }}
              title={editingMap ? 'Edit Peta' : 'Tambah Peta'}
            >
              <form onSubmit={handleMapSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '80vh', overflowY: 'auto' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Nama Lokasi
                  </label>
                  <input
                    type="text"
                    value={mapFormData.name}
                    onChange={(e) => setMapFormData({ ...mapFormData, name: e.target.value })}
                    placeholder="Contoh: Pondok Pesantren Nizamuddin"
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Alamat Lengkap
                  </label>
                  <textarea
                    value={mapFormData.address}
                    onChange={(e) => setMapFormData({ ...mapFormData, address: e.target.value })}
                    rows={3}
                    placeholder="Jl. Pesantren Nizamuddin No. 123, Jakarta, Indonesia"
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                  />
                </div>


                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Google Maps Embed URL <span style={{ color: 'red' }}>*</span>
                  </label>
                  <textarea
                    value={mapFormData.embed_url}
                    onChange={(e) => setMapFormData({ ...mapFormData, embed_url: e.target.value })}
                    rows={3}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                    required
                  />
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    Dapatkan embed URL dari Google Maps: Buka lokasi di Google Maps → Bagikan → Sematkan peta → Salin URL
                  </p>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Google Maps API Key <span style={{ color: '#6b7280', fontSize: '12px' }}>(Opsional)</span>
                  </label>
                  <input
                    type="text"
                    value={mapFormData.api_key}
                    onChange={(e) => setMapFormData({ ...mapFormData, api_key: e.target.value })}
                    placeholder="AIzaSy..."
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      Zoom Level (1-20)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={mapFormData.zoom_level}
                      onChange={(e) => setMapFormData({ ...mapFormData, zoom_level: parseInt(e.target.value) || 15 })}
                      style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      Tipe Peta
                    </label>
                    <select
                      value={mapFormData.map_type}
                      onChange={(e) => setMapFormData({ ...mapFormData, map_type: e.target.value })}
                      style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                    >
                      <option value="roadmap">Roadmap</option>
                      <option value="satellite">Satellite</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="terrain">Terrain</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Urutan</label>
                  <input
                    type="number"
                    value={mapFormData.order}
                    onChange={(e) => setMapFormData({ ...mapFormData, order: parseInt(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={mapFormData.is_active}
                    onChange={(e) => setMapFormData({ ...mapFormData, is_active: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label style={{ fontWeight: '500', cursor: 'pointer' }}>Aktif (Akan muncul di halaman kontak)</label>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setMapModalOpen(false)
                      setEditingMap(null)
                      setMapFormData({
                        name: '',
                        address: '',
                        embed_url: '',
                        api_key: '',
                        zoom_level: 15,
                        map_type: 'roadmap',
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

