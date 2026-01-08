'use client'

import { useEffect, useState, type CSSProperties, type FormEvent } from 'react'

import { getAuthToken } from '@/lib/auth'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { 
  QuestionMarkCircleIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  ChevronUpIcon,
  ChevronDownIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline'

interface Faq {
  id: number
  question: string
  answer: string
  locale: string
  order: number
  is_active: boolean
  category?: string
  created_at: string
  updated_at: string
}

export default function PSBFAQManagement() {
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [locale, setLocale] = useState('id')
  const [category, setCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null)
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    locale: 'id',
    category: '',
    order: 0,
    is_active: true
  })
  const [expandedFaqs, setExpandedFaqs] = useState<Set<number>>(new Set())

  const iconSm = { width: 18, height: 18 }
  const iconMd = { width: 20, height: 20 }
  const iconLg = { width: 48, height: 48 }

  const inputStyle: CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px'
  }

  const labelStyle: CSSProperties = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    color: '#6b7280',
    marginBottom: '6px'
  }

  const categories = [
    { value: '', label: 'Semua Kategori' },
    { value: 'Pendaftaran', label: 'Pendaftaran' },
    { value: 'Biaya', label: 'Biaya' },
    { value: 'Akademik', label: 'Akademik' },
    { value: 'Asrama', label: 'Asrama' },
    { value: 'Lainnya', label: 'Lainnya' }
  ]

  useEffect(() => {
    fetchFaqs()
  }, [locale, category])

  const fetchFaqs = async () => {
    try {
      setLoading(true)
      const token = getAuthToken()
      const params = new URLSearchParams({ locale })
      if (category) params.append('category', category)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/psb-faqs?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const result = await response.json()
      
      if (result.success) {
        setFaqs(result.data)
      } else {
        setError(result.message || 'Gagal memuat FAQ')
      }
    } catch (err) {
      setError('Terjadi kesalahan saat memuat FAQ')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    try {
      const token = getAuthToken()
      const url = editingFaq 
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/psb-faqs/${editingFaq.id}`
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/psb-faqs`
      
      const response = await fetch(url, {
        method: editingFaq ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      const result = await response.json()
      
      if (result.success) {
        fetchFaqs()
        resetForm()
        setShowForm(false)
      } else {
        setError(result.message || 'Gagal menyimpan FAQ')
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menyimpan FAQ')
    }
  }

  const handleEdit = (faq: Faq) => {
    setEditingFaq(faq)
    setFormData({
      question: faq.question,
      answer: faq.answer,
      locale: faq.locale,
      category: faq.category || '',
      order: faq.order,
      is_active: faq.is_active
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus FAQ ini?')) return
    
    try {
      const token = getAuthToken()
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/psb-faqs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const result = await response.json()
      
      if (result.success) {
        fetchFaqs()
      } else {
        setError(result.message || 'Gagal menghapus FAQ')
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menghapus FAQ')
    }
  }

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const token = getAuthToken()
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/psb-faqs/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...faqs.find(f => f.id === id),
          is_active: !currentStatus
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        fetchFaqs()
      } else {
        setError(result.message || 'Gagal mengubah status FAQ')
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengubah status FAQ')
    }
  }

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedFaqs)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedFaqs(newExpanded)
  }

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      locale: locale,
      category: '',
      order: faqs.length,
      is_active: true
    })
    setEditingFaq(null)
  }

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '320px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '44px',
              height: '44px',
              border: '4px solid #e5e7eb',
              borderTopColor: '#0284c7',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 12px'
            }} />
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Memuat FAQ...</div>
          </div>
          <style jsx>{`
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0, color: '#111827' }}>Manajemen FAQ PSB</h1>
            <p style={{ margin: '6px 0 0 0', color: '#6b7280', fontSize: '14px' }}>Kelola Frequently Asked Questions untuk Penerimaan Santri Baru</p>
          </div>

          <button
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
            style={{
              backgroundColor: '#0284c7',
              color: 'white',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <PlusIcon style={iconMd} />
            Tambah FAQ
          </button>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'end' }}>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <label style={labelStyle}>Cari</label>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari pertanyaan/jawaban..."
                style={inputStyle}
              />
            </div>

            <div style={{ width: '180px' }}>
              <label style={labelStyle}>Bahasa</label>
              <select value={locale} onChange={(e) => setLocale(e.target.value)} style={inputStyle}>
                <option value="id">Indonesia</option>
                <option value="en">English</option>
              </select>
            </div>

            <div style={{ width: '220px' }}>
              <label style={labelStyle}>Kategori</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            padding: '12px 14px',
            borderRadius: '12px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {showForm && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}
            onClick={() => {
              setShowForm(false)
              resetForm()
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '14px',
                width: '100%',
                maxWidth: '800px',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{
                padding: '16px 18px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#111827' }}>
                  {editingFaq ? 'Edit FAQ' : 'Tambah FAQ'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '22px',
                    cursor: 'pointer',
                    color: '#6b7280',
                    width: '32px',
                    height: '32px'
                  }}
                >
                  Ã—
                </button>
              </div>

              <div style={{ padding: '18px' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>Pertanyaan</label>
                    <input
                      type="text"
                      value={formData.question}
                      onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                      style={inputStyle}
                      required
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Jawaban</label>
                    <textarea
                      value={formData.answer}
                      onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                      rows={6}
                      style={{ ...inputStyle, resize: 'vertical' }}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={labelStyle}>Bahasa</label>
                      <select
                        value={formData.locale}
                        onChange={(e) => setFormData({ ...formData, locale: e.target.value })}
                        style={inputStyle}
                      >
                        <option value="id">Indonesia</option>
                        <option value="en">English</option>
                      </select>
                    </div>

                    <div>
                      <label style={labelStyle}>Kategori</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        style={inputStyle}
                      >
                        <option value="">Tanpa Kategori</option>
                        {categories.slice(1).map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <label htmlFor="is_active" style={{ fontSize: '14px', color: '#111827', cursor: 'pointer' }}>
                      Aktif
                    </label>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false)
                        resetForm()
                      }}
                      style={{
                        padding: '10px 14px',
                        border: '1px solid #d1d5db',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      style={{
                        padding: '10px 14px',
                        border: 'none',
                        backgroundColor: '#0284c7',
                        color: 'white',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 700
                      }}
                    >
                      {editingFaq ? 'Update' : 'Simpan'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          {faqs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 16px', color: '#6b7280' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px', color: '#9ca3af' }}>
                <QuestionMarkCircleIcon style={iconLg} />
              </div>
              <div style={{ fontSize: '14px' }}>Belum ada FAQ untuk ditampilkan</div>
            </div>
          ) : (
            <div>
              {faqs
                .filter((f) => {
                  const t = searchTerm.trim().toLowerCase()
                  if (!t) return true
                  return (
                    f.question.toLowerCase().includes(t) ||
                    f.answer.toLowerCase().includes(t) ||
                    (f.category || '').toLowerCase().includes(t)
                  )
                })
                .map((faq, index) => (
                  <div key={faq.id} style={{ padding: '14px 16px', borderTop: index === 0 ? 'none' : '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '12px', color: '#6b7280' }}>#{index + 1}</span>
                          {faq.category && (
                            <span style={{
                              padding: '2px 10px',
                              backgroundColor: '#dbeafe',
                              color: '#1e40af',
                              fontSize: '12px',
                              borderRadius: '999px',
                              fontWeight: 700
                            }}>
                              {faq.category}
                            </span>
                          )}
                          <span style={{
                            padding: '2px 10px',
                            backgroundColor: '#f3f4f6',
                            color: '#374151',
                            fontSize: '12px',
                            borderRadius: '999px',
                            fontWeight: 700
                          }}>
                            {faq.locale.toUpperCase()}
                          </span>
                          <span style={{
                            padding: '2px 10px',
                            backgroundColor: faq.is_active ? '#dcfce7' : '#f3f4f6',
                            color: faq.is_active ? '#166534' : '#6b7280',
                            fontSize: '12px',
                            borderRadius: '999px',
                            fontWeight: 700
                          }}>
                            {faq.is_active ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </div>

                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#111827', marginBottom: '6px' }}>{faq.question}</div>

                        <div>
                          <div
                            style={{
                              fontSize: '14px',
                              color: '#374151',
                              lineHeight: 1.6,
                              ...(expandedFaqs.has(faq.id)
                                ? {}
                                : {
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                  })
                            }}
                          >
                            {faq.answer}
                          </div>

                          {faq.answer.length > 120 && (
                            <button
                              onClick={() => toggleExpand(faq.id)}
                              style={{
                                marginTop: '8px',
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                cursor: 'pointer',
                                color: '#0284c7',
                                fontSize: '13px',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              {expandedFaqs.has(faq.id) ? (
                                <>
                                  <ChevronUpIcon style={iconSm} />
                                  Sembunyikan
                                </>
                              ) : (
                                <>
                                  <ChevronDownIcon style={iconSm} />
                                  Lihat selengkapnya
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end', flexShrink: 0 }}>
                        <button
                          onClick={() => toggleStatus(faq.id, faq.is_active)}
                          title={faq.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                          style={{
                            border: '1px solid #e5e7eb',
                            backgroundColor: 'white',
                            borderRadius: '10px',
                            padding: '8px 10px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '13px',
                            fontWeight: 700,
                            color: faq.is_active ? '#166534' : '#6b7280'
                          }}
                        >
                          {faq.is_active ? <EyeIcon style={iconMd} /> : <EyeSlashIcon style={iconMd} />}
                          {faq.is_active ? 'Aktif' : 'Nonaktif'}
                        </button>

                        <button
                          onClick={() => handleEdit(faq)}
                          style={{
                            border: '1px solid #e5e7eb',
                            backgroundColor: 'white',
                            borderRadius: '10px',
                            padding: '8px 10px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '13px',
                            fontWeight: 700,
                            color: '#1e40af'
                          }}
                        >
                          <PencilIcon style={iconMd} />
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(faq.id)}
                          style={{
                            border: '1px solid #e5e7eb',
                            backgroundColor: 'white',
                            borderRadius: '10px',
                            padding: '8px 10px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '13px',
                            fontWeight: 700,
                            color: '#b91c1c'
                          }}
                        >
                          <TrashIcon style={iconMd} />
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}


