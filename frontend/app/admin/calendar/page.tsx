'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { DataTable } from '@/components/admin/DataTable'
import { Modal } from '@/components/admin/Modal'
import { CalendarIcon, AcademicCapIcon, BookOpenIcon, SparklesIcon, MapPinIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'
import { getAuthToken, syncSessionStorage } from '@/lib/auth'

export default function CalendarPage() {
  const [calendars, setCalendars] = useState<any[]>([])
  const [allCalendars, setAllCalendars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'tk' | 'sd' | 'smp' | 'kepondokan' | 'yayasan'>('tk')
  const [formData, setFormData] = useState({ 
    title: '', 
    start_date: '', 
    end_date: '', 
    type: 'activity', 
    school_type: 'tk' as 'tk' | 'sd' | 'smp' | 'kepondokan' | 'yayasan',
    description: '', 
    order: 0,
    is_active: true 
  })

  // Update default type based on active tab
  useEffect(() => {
    if (activeTab === 'yayasan') {
      setFormData(prev => ({ ...prev, type: 'meeting' }))
    } else {
      setFormData(prev => ({ ...prev, type: 'activity' }))
    }
  }, [activeTab])

  const schoolTypes = [
    { id: 'tk', name: 'TK', icon: SparklesIcon, color: 'from-pink-500 to-rose-500' },
    { id: 'sd', name: 'SD', icon: BookOpenIcon, color: 'from-blue-500 to-cyan-500' },
    { id: 'smp', name: 'SMP', icon: AcademicCapIcon, color: 'from-purple-500 to-indigo-500' },
    { id: 'kepondokan', name: 'Kepondokan', icon: CalendarIcon, color: 'from-green-500 to-emerald-500' },
    { id: 'yayasan', name: 'Yayasan', icon: BuildingOfficeIcon, color: 'from-gray-500 to-slate-700' }
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
      
      // Fetch data from all school types
      const schoolTypes = ['tk', 'sd', 'smp', 'kepondokan', 'yayasan']
      
      for (const schoolType of schoolTypes) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/academic/calendar?school_type=${schoolType}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          if (res.ok) {
            const data = await res.json()
            const events = Array.isArray(data) ? data : (data.data || [])
            allData.push(...events)
            console.log(`✅ Fetched ${events.length} events for ${schoolType}`)
          } else {
            console.warn(`⚠️ Failed to fetch ${schoolType}: ${res.status}`)
          }
        } catch (err) {
          console.error(`❌ Error fetching ${schoolType}:`, err)
        }
      }
      
      console.log(`📊 Total events fetched: ${allData.length}`)
      setAllCalendars(allData)
    } catch (err) { 
      console.error('Fetch all error:', err)
    }
  }

  const fetchData = async () => {
    setLoading(true)
    const token = getAuthToken()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/academic/calendar?school_type=${activeTab}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setCalendars(Array.isArray(data) ? data : (data.data || []))
      setLoading(false)
    } catch (err) { 
      console.error('Fetch error:', err)
      setLoading(false) 
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = getAuthToken()
    
    const submitData = {
      ...formData,
      school_type: activeTab
    }

    const url = editing
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/academic/calendar/${editing.id}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/academic/calendar`

    try {
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      })
      if (res.ok) {
        setModalOpen(false)
        setEditing(null)
        setFormData({ 
          title: '', 
          start_date: '', 
          end_date: '', 
          type: 'activity', 
          school_type: activeTab,
          description: '', 
          order: 0,
          is_active: true 
        })
        fetchData()
        fetchAllData() // Refresh overview data
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'exam': return 'Ujian'
      case 'holiday': return 'Libur'
      case 'meeting': return 'Rapat'
      case 'audit': return 'Audit'
      case 'workshop': return 'Workshop'
      case 'evaluation': return 'Evaluasi'
      default: return 'Kegiatan'
    }
  }

  const handlePinToggle = async (item: any) => {
    const token = getAuthToken()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/academic/calendar/${item.id}/pin`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      })
      
      if (res.ok) {
        const result = await res.json()
        alert(result.message)
        fetchData()
        fetchAllData() // Refresh overview data
      } else {
        const errorData = await res.json()
        console.error('Pin Error:', errorData)
        
        let errorMessage = 'Gagal mengubah status pin'
        if (errorData.message) {
          errorMessage = errorData.message
        } else if (res.status === 401) {
          errorMessage = 'Authentication failed - please login again'
        } else if (res.status === 403) {
          errorMessage = 'Permission denied - you do not have access'
        } else if (res.status === 422) {
          errorMessage = errorData.error || 'Validation error'
        }
        
        alert(errorMessage)
      }
    } catch (err) {
      console.error('Pin Error:', err)
      alert('Error')
    }
  }

  return (
    <AdminLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Manajemen Kalender Akademik</h1>
          <button onClick={() => { 
            setEditing(null); 
            setFormData({ 
              title: '', 
              start_date: '', 
              end_date: '', 
              type: 'activity', 
              school_type: activeTab,
              description: '', 
              order: 0,
              is_active: true 
            }); 
            setModalOpen(true) 
          }}
            style={{ padding: '10px 20px', backgroundColor: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>
            + Tambah Event
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
              const schoolData = allCalendars.filter(item => item.school_type === type.id)
              const pinnedCount = schoolData.filter(item => item.is_pinned).length
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
                    background: `linear-gradient(90deg, ${
                      type.id === 'yayasan' ? 
                      '#6b7280, #475569' : 
                      type.color.replace('from-', '#').replace(' to-', ', #')
                    })`
                  }} />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: `linear-gradient(135deg, ${
                          type.id === 'yayasan' ? 
                          '#6b7280, #475569' : 
                          type.color.replace('from-', '#').replace(' to-', ', #')
                        })`,
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
                          Total Agenda
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                          fontSize: '28px', 
                          fontWeight: '700', 
                          lineHeight: 1,
                          color: pinnedCount > 0 ? '#059669' : '#6b7280',
                          marginBottom: '4px'
                        }}>
                          {pinnedCount}
                        </div>
                        <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>
                          Dipin
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
                <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Total Agenda: </span>
                <span style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', marginLeft: '8px' }}>{allCalendars.length}</span>
              </div>
              <div>
                <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Total Dipin: </span>
                <span style={{ 
                  fontSize: '20px', 
                  fontWeight: '700', 
                  color: allCalendars.filter(item => item.is_pinned).length >= 3 ? '#dc2626' : '#059669',
                  marginLeft: '8px'
                }}>
                  {allCalendars.filter(item => item.is_pinned).length}/3
                </span>
              </div>
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>
              {allCalendars.filter(item => item.is_pinned).length >= 3 ? (
                <span style={{ color: '#dc2626' }}>⚠️ Batas pin tercapai</span>
              ) : (
                <span style={{ color: '#059669' }}>✅ Masih bisa pin {3 - allCalendars.filter(item => item.is_pinned).length} agenda</span>
              )}
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
                      type.id === 'yayasan' ? 
                      'linear-gradient(to right, #6b7280, #475569)' : 
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
          <CalendarIcon style={{ width: '20px', height: '20px', color: '#0284c7' }} />
          <div>
            <span style={{ fontSize: '16px', color: '#0c4a6e', fontWeight: '600' }}>
              Manajemen Kalender: 
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
              {calendars.length}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
              Total Agenda
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
              {calendars.filter(item => item.is_pinned).length}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
              Agenda Dipin
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
              {calendars.filter(item => item.type === 'exam').length}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
              Ujian
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
              {calendars.filter(item => item.type === 'holiday').length}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
              Libur
            </div>
          </div>
        </div>

        {/* Pinned Events Section */}
        {calendars.filter(item => item.is_pinned).length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
              paddingBottom: '8px',
              borderBottom: '2px solid #10b981'
            }}>
              <MapPinIcon style={{ width: '20px', height: '20px', color: '#10b981' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#10b981', margin: 0 }}>
                Agenda Prioritas ({calendars.filter(item => item.is_pinned).length}/3)
              </h3>
            </div>
            <div style={{ display: 'grid', gap: '12px' }}>
              {calendars.filter(item => item.is_pinned).map((item) => (
                <div key={item.id} style={{
                  backgroundColor: 'white',
                  border: '1px solid #10b981',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    flexShrink: 0
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#064e3b', marginBottom: '4px' }}>
                      {item.title}
                    </div>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '14px', color: '#6b7280' }}>
                      <span style={{ 
                        backgroundColor: '#f0fdf4',
                        color: '#166534',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {getTypeLabel(item.type)}
                      </span>
                      <span>{new Date(item.start_date).toLocaleDateString('id-ID')}</span>
                      {item.end_date && item.end_date !== item.start_date && (
                        <>
                          <span>-</span>
                          <span>{new Date(item.end_date).toLocaleDateString('id-ID')}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handlePinToggle(item)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#059669'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#10b981'
                    }}
                  >
                    <MapPinIcon style={{ width: '16px', height: '16px' }} />
                    Unpin
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Events Section */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
            paddingBottom: '8px',
            borderBottom: '2px solid #e2e8f0'
          }}>
            <CalendarIcon style={{ width: '20px', height: '20px', color: '#64748b' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#374151', margin: 0 }}>
              Semua Agenda ({calendars.filter(item => !item.is_pinned).length})
            </h3>
          </div>

          <DataTable 
            columns={[
              { key: 'title', label: 'Judul' }, 
              { key: 'type', label: 'Tipe', render: (v) => getTypeLabel(v) }, 
              { key: 'start_date', label: 'Tanggal Mulai', render: (v) => new Date(v).toLocaleDateString('id-ID') },
              { key: 'end_date', label: 'Tanggal Selesai', render: (v) => v ? new Date(v).toLocaleDateString('id-ID') : '-' },
              { 
                key: 'is_pinned', 
                label: 'Pin', 
                render: (v, item) => (
                  <button
                    onClick={() => handlePinToggle(item)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: v ? '#10b981' : '#e5e7eb',
                      color: v ? 'white' : '#374151',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '14px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = v ? '#059669' : '#d1d5db'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = v ? '#10b981' : '#e5e7eb'
                    }}
                  >
                    <MapPinIcon style={{ width: '16px', height: '16px' }} />
                    {v ? 'Dipin' : 'Pin'}
                  </button>
                )
              }
            ]}
            data={calendars.filter(item => !item.is_pinned)} 
            onEdit={(item) => { 
              setEditing(item); 
              setFormData({ 
                title: item.title, 
                start_date: item.start_date, 
                end_date: item.end_date || '', 
                type: item.type, 
                school_type: item.school_type || activeTab,
                description: item.description || '', 
                order: item.order || 0,
                is_active: item.is_active !== undefined ? item.is_active : true 
              }); 
              setModalOpen(true) 
            }}
            onDelete={async (item) => {
              const token = getAuthToken()
              try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/academic/calendar/${item.id}`, {
                  method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
                })
                if (res.ok) { 
                  fetchData(); 
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
              } catch (err) { 
                console.error('Delete error:', err)
                alert('Error') 
              }
            }} 
            loading={loading} 
          />
        </div>
        
        <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditing(null) }} title={editing ? 'Edit Event' : `Tambah Event - ${schoolTypes.find(t => t.id === activeTab)?.name}`}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Judul</label>
              <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Tanggal Mulai</label>
                <input type="date" required value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Tanggal Selesai</label>
                <input type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Tipe</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}>
                {activeTab === 'yayasan' ? (
                  <>
                    <option value="meeting">Rapat</option>
                    <option value="audit">Audit</option>
                    <option value="workshop">Workshop</option>
                    <option value="evaluation">Evaluasi</option>
                    <option value="holiday">Libur</option>
                    <option value="activity">Kegiatan Lainnya</option>
                  </>
                ) : (
                  <>
                    <option value="exam">Ujian</option>
                    <option value="holiday">Libur</option>
                    <option value="activity">Kegiatan</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Deskripsi</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
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

