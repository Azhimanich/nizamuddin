'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { DataTable } from '@/components/admin/DataTable'
import { Modal } from '@/components/admin/Modal'
import { useToast, validateImage } from '@/components/admin/Toast'
import { getAuthToken } from '@/lib/auth'

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [editingNews, setEditingNews] = useState<any>(null)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [formData, setFormData] = useState({
    category_id: '',
    author: '',
    title: '',
    excerpt: '',
    content: '',
    image_caption: '',
    related_articles: [] as number[],
    is_published: false,
    is_pinned: false,
    allow_comments: true,
    tags: [] as string[]
  })
  const [tagInput, setTagInput] = useState('')
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    name_en: '',
    name_ar: '',
    icon: '',
    order: 0,
    is_active: true
  })
  const { showSuccess, showError } = useToast()

  useEffect(() => {
    fetchNews()
    fetchCategories()
  }, [])

  const fetchNews = async () => {
    const token = getAuthToken()
    console.log('News page - Token:', token ? 'exists' : 'missing')
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/news`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      console.log('News API response status:', res.status)
      const data = await res.json()
      console.log('News API data:', data)
      setNews(Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []))
      setLoading(false)
    } catch (err) {
      console.error('Error fetching news:', err)
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    const token = getAuthToken()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/categories`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setCategories(Array.isArray(data) ? data : [])
    } catch (err) {
      // Ignore
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = getAuthToken()
    const formDataToSend = new FormData()
    
    // Debug: Log form data
    console.log('Form data being sent:', formData)
    
    const fileInput = document.getElementById('featured_image') as HTMLInputElement
    if (fileInput?.files?.[0]) {
      const validation = validateImage(fileInput.files[0])
      if (!validation.valid) {
        showError(validation.message || 'Gambar tidak valid')
        return
      }
      formDataToSend.append('featured_image', fileInput.files[0])
    }

    Object.keys(formData).forEach(key => {
      const value = formData[key as keyof typeof formData]
      if (key === 'tags') {
        // Handle tags array
        if (Array.isArray(value) && value.length > 0) {
          value.forEach((tag, index) => {
            formDataToSend.append(`tags[${index}]`, tag.toString())
          })
        }
      } else if (key === 'related_articles') {
        // Handle related_articles array
        if (Array.isArray(value) && value.length > 0) {
          value.forEach((articleId, index) => {
            formDataToSend.append(`related_articles[${index}]`, articleId.toString())
          })
        }
      } else if (typeof value === 'boolean') {
        formDataToSend.append(key, value ? '1' : '0')
      } else if (value !== null && value !== undefined && value !== '') {
        formDataToSend.append(key, value as string)
      }
    })

    if (editingNews) {
      formDataToSend.append('_method', 'PUT')
    }

    const url = editingNews
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/news/${editingNews.id}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/news`

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      })

      const responseData = await res.json()

      if (res.ok) {
        setModalOpen(false)
        setEditingNews(null)
        setFormData({ category_id: '', author: '', title: '', excerpt: '', content: '', image_caption: '', related_articles: [], is_published: false, is_pinned: false, allow_comments: true, tags: [] })
        setTagInput('')
        const fileInputReset = document.getElementById('featured_image') as HTMLInputElement
        if (fileInputReset) fileInputReset.value = ''
        fetchNews()
        showSuccess('Berita berhasil disimpan!')
      } else {
        showError(responseData.message || 'Gagal menyimpan berita')
      }
    } catch (err: any) {
      showError('Error: ' + (err.message || 'Terjadi kesalahan'))
    }
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = getAuthToken()
    
    const url = editingCategory
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/categories/${editingCategory.id}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/categories`

    try {
      const res = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryFormData)
      })

      const responseData = await res.json()

      if (res.ok) {
        setCategoryModalOpen(false)
        setEditingCategory(null)
        setCategoryFormData({ name: '', name_en: '', name_ar: '', icon: '', order: 0, is_active: true })
        fetchCategories()
        showSuccess('Kategori berhasil disimpan!')
      } else {
        showError(responseData.message || 'Gagal menyimpan kategori')
      }
    } catch (err: any) {
      showError('Error: ' + (err.message || 'Terjadi kesalahan'))
    }
  }

  const handleEdit = (item: any) => {
    setEditingNews(item)
    setFormData({
      category_id: item.category_id?.toString() || '',
      author: item.author || '',
      title: item.title || '',
      excerpt: item.excerpt || '',
      content: item.content || '',
      image_caption: item.image_caption || '',
      related_articles: item.related_articles ? (Array.isArray(item.related_articles) ? item.related_articles : []) : [],
      is_published: item.is_published || false,
      is_pinned: item.is_pinned || false,
      allow_comments: item.allow_comments !== false,
      tags: item.tags ? item.tags.map((tag: any) => tag.name) : []
    })
    setTagInput('')
    setModalOpen(true)
  }

  const handleCategoryEdit = (item: any) => {
    setEditingCategory(item)
    setCategoryFormData({
      name: item.name || '',
      name_en: item.name_en || '',
      name_ar: item.name_ar || '',
      icon: item.icon || '',
      order: item.order || 0,
      is_active: item.is_active !== false
    })
    setCategoryModalOpen(true)
  }

  const handleDelete = async (item: any) => {
    if (!confirm('Yakin ingin menghapus berita ini?')) return
    
    const token = getAuthToken()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/news/${item.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        fetchNews()
        showSuccess('Berita berhasil dihapus!')
      } else {
        const data = await res.json()
        showError(data.message || 'Gagal menghapus berita')
      }
    } catch (err: any) {
      showError('Error: ' + (err.message || 'Terjadi kesalahan'))
    }
  }

  const handleCategoryDelete = async (item: any) => {
    if (!confirm('Yakin ingin menghapus kategori ini?')) return
    
    const token = getAuthToken()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/categories/${item.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        fetchCategories()
        showSuccess('Kategori berhasil dihapus!')
      } else {
        const data = await res.json()
        showError(data.message || 'Gagal menghapus kategori')
      }
    } catch (err: any) {
      showError('Error: ' + (err.message || 'Terjadi kesalahan'))
    }
  }

  return (
    <AdminLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Manajemen Berita</h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => {
                setCategoryModalOpen(true)
                setEditingCategory(null)
                setCategoryFormData({ name: '', name_en: '', name_ar: '', icon: '', order: 0, is_active: true })
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              + Tambah Kategori
            </button>
            <button
              onClick={() => {
                setEditingNews(null)
                setFormData({ category_id: '', author: '', title: '', excerpt: '', content: '', image_caption: '', related_articles: [], is_published: false, is_pinned: false, allow_comments: true, tags: [] })
        setTagInput('')
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
              + Tambah Berita
            </button>
          </div>
        </div>

        {/* Category Management Section */}
        <div style={{ marginBottom: '32px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Manajemen Kategori</h2>
          <DataTable
            columns={[
              { key: 'name', label: 'Nama' },
              { key: 'slug', label: 'Slug' },
              {
                key: 'is_active',
                label: 'Status',
                render: (value) => value ? '✅ Aktif' : '❌ Nonaktif'
              },
              {
                key: 'order',
                label: 'Urutan'
              }
            ]}
            data={categories}
            onEdit={handleCategoryEdit}
            onDelete={handleCategoryDelete}
            loading={false}
          />
        </div>

        {/* News Management Section */}
        <DataTable
          columns={[
            { key: 'title', label: 'Judul' },
            {
              key: 'category',
              label: 'Kategori',
              render: (value) => value?.name || '-'
            },
            {
              key: 'is_pinned',
              label: 'Pin',
              render: (value) => value ? '📌' : '-'
            },
            {
              key: 'is_published',
              label: 'Status',
              render: (value) => value ? '✅ Terbit' : '⏳ Draft'
            },
            {
              key: 'created_at',
              label: 'Dibuat',
              render: (value) => new Date(value).toLocaleDateString('id-ID')
            }
          ]}
          data={news}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />

        {/* News Modal */}
        <Modal isOpen={modalOpen} onClose={() => {
          setModalOpen(false)
          setEditingNews(null)
        }} title={editingNews ? 'Edit Berita' : 'Tambah Berita'} size="lg">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Kategori</label>
              <select
                required
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px'
                }}
              >
                <option value="">Pilih Kategori</option>
                {categories.filter(cat => cat.is_active).map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Penulis</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Nama penulis artikel"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Judul</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Ringkasan</label>
              <textarea
                required
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Konten</label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Tags</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      backgroundColor: '#e0f2fe',
                      color: '#0369a1',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => {
                        const newTags = formData.tags.filter((_, i) => i !== index)
                        setFormData({ ...formData, tags: newTags })
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#0369a1',
                        cursor: 'pointer',
                        fontSize: '16px',
                        padding: 0,
                        marginLeft: '4px'
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const tag = tagInput.trim()
                      if (tag && !formData.tags.includes(tag)) {
                        setFormData({ ...formData, tags: [...formData.tags, tag] })
                        setTagInput('')
                      }
                    }
                  }}
                  placeholder="Ketik tag dan tekan Enter"
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px'
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const tag = tagInput.trim()
                    if (tag && !formData.tags.includes(tag)) {
                      setFormData({ ...formData, tags: [...formData.tags, tag] })
                      setTagInput('')
                    }
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
                  Tambah
                </button>
              </div>
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                Tambahkan tag untuk membantu pengguna menemukan artikel ini
              </p>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Gambar Featured</label>
              <input
                id="featured_image"
                type="file"
                accept="image/*"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px'
                }}
              />
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                Maksimal 5MB. Format: JPG, PNG, GIF, WebP
              </p>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Keterangan Foto</label>
              <textarea
                value={formData.image_caption}
                onChange={(e) => setFormData({ ...formData, image_caption: e.target.value })}
                placeholder="Masukkan keterangan untuk foto featured"
                rows={2}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px'
                }}
              />
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                Keterangan akan ditampilkan di bawah foto featured
              </p>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Baca Juga (Related Articles)</label>
              <select
                multiple
                value={formData.related_articles.map(String)}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value))
                  setFormData({ ...formData, related_articles: selected })
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  minHeight: '120px'
                }}
              >
                {news.filter((item: any) => item.id !== editingNews?.id && item.is_published).map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                Pilih berita terkait yang akan ditampilkan di bagian "Baca Juga". Tahan Ctrl/Cmd untuk memilih multiple.
              </p>
              {formData.related_articles.length > 0 && (
                <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {formData.related_articles.map((articleId) => {
                    const article = news.find((n: any) => n.id === articleId)
                    return article ? (
                      <span
                        key={articleId}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          backgroundColor: '#f0f9ff',
                          color: '#0369a1',
                          borderRadius: '20px',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        {article.title}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              related_articles: formData.related_articles.filter(id => id !== articleId)
                            })
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#0369a1',
                            cursor: 'pointer',
                            fontSize: '16px',
                            padding: 0,
                            marginLeft: '4px'
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ) : null
                  })}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                />
                <span>Terbitkan</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.is_pinned}
                  onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
                />
                <span>📌 Pin (Tampilkan di Beranda)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.allow_comments}
                  onChange={(e) => setFormData({ ...formData, allow_comments: e.target.checked })}
                />
                <span>Izinkan Komentar</span>
              </label>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false)
                  setEditingNews(null)
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

        {/* Category Modal */}
        <Modal isOpen={categoryModalOpen} onClose={() => {
          setCategoryModalOpen(false)
          setEditingCategory(null)
        }} title={editingCategory ? 'Edit Kategori' : 'Tambah Kategori'} size="md">
          <form onSubmit={handleCategorySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Nama Kategori</label>
              <input
                type="text"
                required
                value={categoryFormData.name}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Nama (English)</label>
              <input
                type="text"
                value={categoryFormData.name_en}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, name_en: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Nama (Arabic)</label>
              <input
                type="text"
                value={categoryFormData.name_ar}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, name_ar: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Icon</label>
              <input
                type="text"
                value={categoryFormData.icon}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, icon: e.target.value })}
                placeholder="Contoh: 📰, 🎓, dll"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Urutan</label>
              <input
                type="number"
                value={categoryFormData.order}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, order: parseInt(e.target.value) || 0 })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={categoryFormData.is_active}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, is_active: e.target.checked })}
                />
                <span>Aktif</span>
              </label>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  setCategoryModalOpen(false)
                  setEditingCategory(null)
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
                  backgroundColor: '#10b981',
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
