'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { DataTable } from '@/components/admin/DataTable'
import { Modal } from '@/components/admin/Modal'
import { ClockIcon, AcademicCapIcon, BookOpenIcon, SparklesIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import { getAuthToken, syncSessionStorage } from '@/lib/auth'

export default function DailySchedulesPage() {
  const [schedules, setSchedules] = useState<any[]>([])
  const [allSchedules, setAllSchedules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'tk' | 'sd' | 'smp' | 'kepondokan'>('tk')
  const [formData, setFormData] = useState({ 
    school_type: 'tk' as 'tk' | 'sd' | 'smp' | 'kepondokan',
    start_time: '', 
    end_time: '', 
    activity_id: '', 
    activity_en: '', 
    activity_ar: '', 
    order: 0,
    is_active: true
  })

  const schoolTypes = [
    { id: 'tk', name: 'TK', icon: SparklesIcon, color: 'from-pink-500 to-rose-500' },
    { id: 'sd', name: 'SD', icon: BookOpenIcon, color: 'from-blue-500 to-cyan-500' },
    { id: 'smp', name: 'SMP', icon: AcademicCapIcon, color: 'from-purple-500 to-indigo-500' },
    { id: 'kepondokan', name: 'Kepondokan', icon: ClockIcon, color: 'from-green-500 to-emerald-500' }
  ]

  useEffect(() => { 
    syncSessionStorage() // Sync auth state between tabs
    fetchData() 
    fetchAllData() 
  }, [activeTab])

  const fetchAllData = async () => {
    const token = getAuthToken()
    try {
      const allData = []
      
      // Fetch data from all school types using PUBLIC API (no auth required)
      const schoolTypes = ['tk', 'sd', 'smp', 'kepondokan']
      
      for (const schoolType of schoolTypes) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/daily-schedules?school_type=${schoolType}`)
          if (res.ok) {
            const data = await res.json()
            const schedules = Array.isArray(data) ? data : []
            allData.push(...schedules)
            console.log(`✅ Fetched ${schedules.length} schedules for ${schoolType}`)
          } else {
            console.warn(`⚠️ Failed to fetch ${schoolType}: ${res.status}`)
          }
        } catch (err) {
          console.error(`❌ Error fetching ${schoolType}:`, err)
        }
      }
      
      console.log(`📊 Total schedules fetched: ${allData.length}`)
      setAllSchedules(allData)
    } catch (err) { 
      console.error('Fetch all error:', err)
    }
  }

  const fetchData = async () => {
    setLoading(true)
    const token = getAuthToken()
    try {
      // Use PUBLIC API for now to avoid auth issues
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/daily-schedules?school_type=${activeTab}`)
      
      if (!res.ok) {
        console.error('API Error:', res.status, res.statusText)
        setSchedules([])
        setLoading(false)
        return
      }
      
      const data = await res.json()
      console.log('Fetched data:', data)
      setSchedules(Array.isArray(data) ? data : [])
      setLoading(false)
    } catch (err) {
      console.error('Fetch error:', err)
      setSchedules([])
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = getAuthToken()
    const url = editing
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/daily-schedules/${editing.id}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/daily-schedules`

    try {
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setModalOpen(false)
        setEditing(null)
        setFormData({ 
          school_type: activeTab,
          start_time: '', 
          end_time: '', 
          activity_id: '', 
          activity_en: '', 
          activity_ar: '', 
          order: 0,
          is_active: true
        })
        fetchData()
        fetchAllData()
        alert('Berhasil!')
      } else {
        const errorData = await res.json()
        console.error('API Error:', errorData)
        
        // More specific error messages
        let errorMessage = 'Gagal menyimpan data'
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
          errorMessage = 'Validation error - please check your input'
        }
        
        alert(errorMessage)
      }
    } catch (err) { 
      console.error('Submit error:', err)
      alert('Error') 
    }
  }

  const formatTime = (time: string) => {
    if (!time) return ''
    // If time is in format "HH:MM:SS", extract just "HH:MM"
    if (time.includes(':')) {
      const parts = time.split(':')
      return `${parts[0]}:${parts[1]}`
    }
    return time
  }

  return (
    <AdminLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Jadwal Kegiatan Harian</h1>
          <button onClick={() => { 
            setEditing(null); 
            setFormData({ school_type: activeTab, start_time: '', end_time: '', activity_id: '', activity_en: '', activity_ar: '', order: 0, is_active: true }); 
            setModalOpen(true) 
          }}
            style={{ padding: '10px 20px', backgroundColor: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>
            + Tambah Jadwal {schoolTypes.find(t => t.id === activeTab)?.name}
          </button>
        </div>

        {/* Overview Section */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937', marginBottom: '16px' }}>
            📊 Overview Semua Sekolah
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '16px',
            marginBottom: '24px'
          }}>
            {schoolTypes.map((type) => {
              const schoolData = allSchedules.filter(item => item.school_type === type.id)
              const activeCount = schoolData.filter(item => item.is_active).length
              const Icon = type.icon
              
              return (
                <div key={type.id} style={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '20px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${type.color.replace('from-', '#').replace(' to-', ', #')})`
                  }} />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: `linear-gradient(135deg, ${type.color.replace('from-', '#').replace(' to-', ', #')})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icon style={{ width: '20px', height: '20px', color: 'white' }} />
                      </div>
                      <h3 style={{ fontSize: '20px', fontWeight: '700', margin: 0, color: '#1f2937' }}>
                        {type.name}
                      </h3>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                          fontSize: '28px', 
                          fontWeight: '700', 
                          lineHeight: 1,
                          color: '#1f2937',
                          marginBottom: '4px'
                        }}>
                          {schoolData.length}
                        </div>
                        <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>
                          Total Jadwal
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                          fontSize: '28px', 
                          fontWeight: '700', 
                          lineHeight: 1,
                          color: activeCount > 0 ? '#059669' : '#6b7280',
                          marginBottom: '4px'
                        }}>
                          {activeCount}
                        </div>
                        <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>
                          Aktif
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Global Statistics */}
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{ display: 'flex', gap: '40px' }}>
              <div>
                <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Total Jadwal: </span>
                <span style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', marginLeft: '8px' }}>{allSchedules.length}</span>
              </div>
              <div>
                <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Total Aktif: </span>
                <span style={{ 
                  fontSize: '20px', 
                  fontWeight: '700', 
                  color: '#059669',
                  marginLeft: '8px'
                }}>
                  {allSchedules.filter(item => item.is_active).length}
                </span>
              </div>
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>
              <span style={{ color: '#059669' }}>✅ Semua jadwal terorganisir dengan baik</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ 
            display: 'flex', 
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
            borderRadius: '12px 12px 0 0',
            overflow: 'hidden'
          }}>
            {schoolTypes.map((type) => {
              const Icon = type.icon
              const isActive = activeTab === type.id
              
              return (
                <button
                  key={type.id}
                  onClick={() => setActiveTab(type.id as any)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px 16px',
                    fontSize: '15px',
                    fontWeight: '800',
                    border: 'none',
                    backgroundColor: isActive ? (
                      `linear-gradient(to right, ${type.color.replace('from-', '#').replace(' to-', ', #')})`
                    ) : 'transparent',
                    color: isActive ? '#ffffff' : '#6b7280',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    textShadow: isActive ? '0 2px 4px rgba(0, 0, 0, 0.5)' : 'none',
                    letterSpacing: isActive ? '0.5px' : 'normal'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#f3f4f6'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  <Icon style={{ 
                    width: '20px', 
                    height: '20px', 
                    marginRight: '10px',
                    filter: isActive ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6))' : 'none'
                  }} />
                  {type.name}
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      backgroundColor: 'rgba(255, 255, 255, 0.3)'
                    }} />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Current School Type Indicator */}
        <div style={{ 
          marginBottom: '24px', 
          padding: '16px 20px', 
          backgroundColor: '#f0f9ff', 
          border: '1px solid #0284c7', 
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <ClockIcon style={{ width: '20px', height: '20px', color: '#0284c7' }} />
          <div>
            <span style={{ fontSize: '16px', color: '#0c4a6e', fontWeight: '600' }}>
              Manajemen Jadwal: 
            </span>
            <span style={{ fontSize: '16px', color: '#0284c7', fontWeight: '700' }}>
              {schoolTypes.find(t => t.id === activeTab)?.name}
            </span>
          </div>
        </div>

        {/* Statistics Cards */}
        <div style={{ 
          marginBottom: '24px', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px' 
        }}>
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#3b82f6', marginBottom: '8px' }}>
              {schedules.length}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
              Total Jadwal
            </div>
          </div>
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#10b981', marginBottom: '8px' }}>
              {schedules.filter(item => item.is_active).length}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
              Jadwal Aktif
            </div>
          </div>
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#f59e0b', marginBottom: '8px' }}>
              {schedules.filter(item => item.start_time < '12:00:00').length}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
              Jadwal Pagi
            </div>
          </div>
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#ef4444', marginBottom: '8px' }}>
              {schedules.filter(item => item.start_time >= '12:00:00').length}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
              Jadwal Sore
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
              Semua Jadwal ({schedules.length})
            </h3>
            <button
              onClick={() => { 
                setEditing(null); 
                setFormData({ school_type: activeTab, start_time: '', end_time: '', activity_id: '', activity_en: '', activity_ar: '', order: 0, is_active: true }); 
                setModalOpen(true) 
              }}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
            >
              <PlusCircleIcon style={{ width: '18px', height: '18px' }} />
              Tambah Jadwal
            </button>
          </div>

          <DataTable 
            columns={[
              { key: 'start_time', label: 'Waktu Mulai', render: (v) => formatTime(v) }, 
              { key: 'end_time', label: 'Waktu Selesai', render: (v) => formatTime(v) }, 
              { key: 'activity_id', label: 'Kegiatan (ID)' },
              { key: 'activity_en', label: 'Kegiatan (EN)' },
              { key: 'order', label: 'Urutan' }
            ]}
            data={schedules} 
            onEdit={(item) => { 
              setEditing(item); 
              setFormData({ 
                school_type: item.school_type || 'tk',
                start_time: formatTime(item.start_time), 
                end_time: formatTime(item.end_time), 
                activity_id: item.activity_id || '', 
                activity_en: item.activity_en || '', 
                activity_ar: item.activity_ar || '', 
                order: item.order || 0,
                is_active: item.is_active !== undefined ? item.is_active : true
              }); 
              setModalOpen(true) 
            }}
            onDelete={async (item) => {
              const token = getAuthToken()
              try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/daily-schedules/${item.id}`, {
                  method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
                })
                if (res.ok) { 
                  fetchData(); 
                  fetchAllData();
                  alert('Berhasil dihapus') 
                } else {
                  const errorData = await res.json()
                  console.error('Delete Error:', errorData)
                  
                  let errorMessage = 'Gagal menghapus data'
                  if (errorData.message) {
                    errorMessage = errorData.message
                  } else if (res.status === 401) {
                    errorMessage = 'Authentication failed - please login again'
                  } else if (res.status === 403) {
                    errorMessage = 'Permission denied - you do not have access'
                  } else if (res.status === 404) {
                    errorMessage = 'Data not found'
                  }
                  
                  alert(errorMessage)
                }
              } catch (err) { alert('Error') }
            }} 
            loading={loading} 
          />
        </div>
        <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditing(null) }} title={editing ? 'Edit Jadwal' : 'Tambah Jadwal'}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Tipe Sekolah <span style={{ color: 'red' }}>*</span></label>
              <select 
                value={formData.school_type} 
                onChange={(e) => setFormData({ ...formData, school_type: e.target.value as any })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
              >
                <option value="tk">TK</option>
                <option value="sd">SD</option>
                <option value="smp">SMP</option>
                <option value="kepondokan">Kepondokan</option>
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Waktu Mulai <span style={{ color: 'red' }}>*</span></label>
                <input type="time" required value={formData.start_time} onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Waktu Selesai</label>
                <input type="time" value={formData.end_time} onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Kegiatan (ID) <span style={{ color: 'red' }}>*</span></label>
              <input type="text" required value={formData.activity_id} onChange={(e) => setFormData({ ...formData, activity_id: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Kegiatan (EN)</label>
              <input type="text" value={formData.activity_en} onChange={(e) => setFormData({ ...formData, activity_en: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Kegiatan (AR)</label>
              <input type="text" value={formData.activity_ar} onChange={(e) => setFormData({ ...formData, activity_ar: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Urutan</label>
              <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
              <label style={{ fontWeight: '500', cursor: 'pointer' }}>Aktif (Data akan muncul di publik)</label>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button type="button" onClick={() => { setModalOpen(false); setEditing(null) }}
                style={{ padding: '10px 20px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Batal</button>
              <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Simpan</button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  )
}

