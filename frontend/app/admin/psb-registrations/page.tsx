'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { DataTable } from '@/components/admin/DataTable'
import { Modal } from '@/components/admin/Modal'
import { useToast } from '@/components/admin/Toast'
import { CheckIcon, XMarkIcon, TrashIcon, EyeIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline'

export default function PsbRegistrationsPage() {
  const { Toast, showSuccess, showError } = useToast()
  const [registrations, setRegistrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null)
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterEducation, setFilterEducation] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  })
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [statusFormData, setStatusFormData] = useState({
    status: 'pending',
    catatan: ''
  })
  const [statistics, setStatistics] = useState<any>({})

  useEffect(() => {
    fetchRegistrations()
    fetchStatistics()
  }, [filterStatus, filterEducation, searchTerm, dateRange])

  const fetchRegistrations = async () => {
    setLoading(true)
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/psb-registrations?per_page=50`
      
      if (filterStatus !== 'all') {
        url += `&status=${filterStatus}`
      }
      
      if (filterEducation !== 'all') {
        url += `&education=${encodeURIComponent(filterEducation)}`
      }
      
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`
      }
      
      // Add date range filters
      if (dateRange.start) {
        url += `&date_start=${encodeURIComponent(dateRange.start)}`
      }
      if (dateRange.end) {
        url += `&date_end=${encodeURIComponent(dateRange.end)}`
      }

      const res = await fetch(url)
      const data = await res.json()
      setRegistrations(Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []))
    } catch (err) {
      showError('Gagal memuat data pendaftaran')
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistics = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/psb-registrations/statistics`)
      const data = await res.json()
      if (data.success) {
        setStatistics(data.data)
      }
    } catch (err) {
      console.error('Failed to fetch statistics:', err)
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/psb-registrations/export`
      
      // Apply same filters as current view
      const params = new URLSearchParams()
      if (filterStatus !== 'all') {
        params.append('status', filterStatus)
      }
      if (filterEducation !== 'all') {
        params.append('education', filterEducation)
      }
      if (searchTerm) {
        params.append('search', searchTerm)
      }
      
      // Add date range filters
      if (dateRange.start) {
        params.append('date_start', dateRange.start)
      }
      if (dateRange.end) {
        params.append('date_end', dateRange.end)
      }
      
      const res = await fetch(`${url}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv'
        }
      })
      
      if (res.ok) {
        const blob = await res.blob()
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        
        // Generate filename with current date and filters
        const date = new Date().toISOString().split('T')[0]
        let filename = `psb_registrations_${date}`
        
        if (filterStatus !== 'all') {
          filename += `_status_${filterStatus}`
        }
        if (filterEducation !== 'all') {
          filename += `_education_${filterEducation}`
        }
        if (dateRange.start || dateRange.end) {
          const start = dateRange.start || 'all'
          const end = dateRange.end || 'all'
          filename += `_dates_${start}_to_${end}`
        }
        
        // Determine file extension from content type
        const contentType = res.headers.get('content-type')
        if (contentType?.includes('csv')) {
          filename += '.csv'
        } else {
          filename += '.xlsx'
        }
        
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(downloadUrl)
        
        const fileType = contentType?.includes('csv') ? 'CSV' : 'Excel'
        showSuccess(`Data berhasil diexport sebagai ${fileType}`)
      } else {
        // Try to get error message from response
        let errorMessage = 'Gagal mengexport data'
        try {
          const errorData = await res.json()
          errorMessage = errorData.message || errorMessage
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = `Gagal mengexport data (${res.status}: ${res.statusText})`
        }
        showError(errorMessage)
      }
    } catch (err) {
      console.error('Export error:', err)
      showError('Terjadi kesalahan saat export data. Silakan coba lagi.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleView = (registration: any) => {
    setSelectedRegistration(registration)
    setModalOpen(true)
  }

  const handleStatusUpdate = (registration: any) => {
    setSelectedRegistration(registration)
    setStatusFormData({
      status: registration.status,
      catatan: registration.catatan || ''
    })
    setStatusModalOpen(true)
  }

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/psb-registrations/${selectedRegistration.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(statusFormData)
      })

      if (res.ok) {
        setStatusModalOpen(false)
        setSelectedRegistration(null)
        fetchRegistrations()
        fetchStatistics()
        showSuccess('Status pendaftaran berhasil diperbarui')
      } else {
        showError('Gagal memperbarui status')
      }
    } catch (err) {
      showError('Terjadi kesalahan saat memperbarui status')
    }
  }

  const handleDelete = async (registration: any) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus pendaftaran dari ${registration.nama_lengkap}?`)) {
      return
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/psb-registrations/${registration.id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        fetchRegistrations()
        fetchStatistics()
        if (selectedRegistration?.id === registration.id) {
          setModalOpen(false)
          setSelectedRegistration(null)
        }
        showSuccess('Pendaftaran berhasil dihapus')
      } else {
        showError('Gagal menghapus pendaftaran')
      }
    } catch (err) {
      showError('Terjadi kesalahan saat menghapus pendaftaran')
    }
  }

  const handleBulkStatusUpdate = async () => {
    if (selectedIds.length === 0) {
      showError('Pilih pendaftaran terlebih dahulu')
      return
    }

    const status = prompt('Pilih status baru (pending/diproses/diterima/ditolak):')
    if (!status || !['pending', 'diproses', 'diterima', 'ditolak'].includes(status)) {
      return
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/psb-registrations/bulk-update-status`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: selectedIds, status })
      })
      if (res.ok) {
        fetchRegistrations()
        fetchStatistics()
        setSelectedIds([])
        showSuccess(`${selectedIds.length} pendaftaran berhasil diperbarui`)
      } else {
        showError('Gagal memperbarui status')
      }
    } catch (err) {
      showError('Terjadi kesalahan saat memperbarui status')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      showError('Pilih pendaftaran terlebih dahulu')
      return
    }

    if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} pendaftaran?`)) {
      return
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/psb-registrations/bulk-delete`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: selectedIds })
      })
      if (res.ok) {
        fetchRegistrations()
        fetchStatistics()
        setSelectedIds([])
        showSuccess(`${selectedIds.length} pendaftaran berhasil dihapus`)
      } else {
        showError('Gagal menghapus pendaftaran')
      }
    } catch (err) {
      showError('Terjadi kesalahan saat menghapus pendaftaran')
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { bg: '#fef3c7', color: '#92400e', label: '⏳ Pending' },
      diproses: { bg: '#dbeafe', color: '#1e40af', label: '🔄 Diproses' },
      diterima: { bg: '#d1fae5', color: '#065f46', label: '✅ Diterima' },
      ditolak: { bg: '#fee2e2', color: '#991b1b', label: '❌ Ditolak' }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        backgroundColor: config.bg,
        color: config.color
      }}>
        {config.label}
      </span>
    )
  }

  return (
    <AdminLayout>
      {Toast}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Pendaftaran PSB</h1>
        </div>

        {/* Statistics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Total Pendaftaran</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>{statistics.total || 0}</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Pending</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#d97706' }}>{statistics.pending || 0}</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Diproses</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2563eb' }}>{statistics.diproses || 0}</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Diterima</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#16a34a' }}>{statistics.diterima || 0}</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Ditolak</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc2626' }}>{statistics.ditolak || 0}</div>
          </div>
        </div>

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
              placeholder="Cari nama, email, atau telepon..."
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
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              placeholder="Dari tanggal"
              style={{
                padding: '10px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
            <span style={{ fontSize: '14px', color: '#6b7280' }}>s/d</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              placeholder="Sampai tanggal"
              style={{
                padding: '10px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
            {(dateRange.start || dateRange.end) && (
              <button
                onClick={() => setDateRange({ start: '', end: '' })}
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>
            )}
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="diproses">Diproses</option>
            <option value="diterima">Diterima</option>
            <option value="ditolak">Ditolak</option>
          </select>
          <select
            value={filterEducation}
            onChange={(e) => setFilterEducation(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="all">Semua Tingkat</option>
            <option value="Kepondokan">Kepondokan</option>
            <option value="TK">TK</option>
            <option value="SD">SD</option>
            <option value="SMP">SMP</option>
          </select>
          <button
            onClick={handleExport}
            disabled={isExporting || loading}
            style={{
              padding: '10px 16px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: isExporting || loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: isExporting || loading ? 0.6 : 1
            }}
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Exporting...
              </>
            ) : (
              <>
                <DocumentArrowDownIcon className="h-4 w-4" />
                Export
              </>
            )}
          </button>
          {selectedIds.length > 0 && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleBulkStatusUpdate}
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#3b82f6',
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
                Update Status ({selectedIds.length})
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
              render: (value: any, row: any) => (
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
              key: 'status',
              label: 'Status',
              render: (value: any) => getStatusBadge(value)
            },
            {
              key: 'nik',
              label: 'NIK',
              render: (value: any) => (
                <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{value}</span>
              )
            },
            {
              key: 'nama_lengkap',
              label: 'Nama',
              render: (value: any, row: any) => (
                <div>
                  <div style={{ fontWeight: '600', color: '#111827' }}>{value}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                    {row.email}
                  </div>
                </div>
              )
            },
            {
              key: 'nomor_telepon',
              label: 'Telepon',
              render: (value: any) => value || '-'
            },
            {
              key: 'tempat_lahir',
              label: 'Tempat Lahir',
              render: (value: any) => value || '-'
            },
            {
              key: 'tanggal_lahir',
              label: 'Tanggal Lahir',
              render: (value: any) => {
                if (!value) return '-'
                return new Date(value).toLocaleDateString('id-ID')
              }
            },
            {
              key: 'created_at',
              label: 'Tanggal Daftar',
              render: (value: any) => formatDate(value)
            },
            {
              key: 'actions',
              label: 'Aksi',
              render: (value: any, row: any) => (
                <button
                  onClick={() => handleStatusUpdate(row)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    marginRight: '8px'
                  }}
                >
                  Update Status
                </button>
              )
            }
          ]}
          data={registrations}
          onEdit={(registration) => handleView(registration)}
          onDelete={handleDelete}
          loading={loading}
        />

        {/* Detail Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false)
            setSelectedRegistration(null)
          }}
          title="Detail Pendaftaran PSB"
        >
          {selectedRegistration && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Status</div>
                  {getStatusBadge(selectedRegistration.status)}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleStatusUpdate(selectedRegistration)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#3b82f6',
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
                    Update Status
                  </button>
                  <button
                    onClick={() => handleDelete(selectedRegistration)}
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
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Nama Lengkap</div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{selectedRegistration.nama_lengkap}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>NIK</div>
                  <div style={{ fontSize: '14px', color: '#111827', fontFamily: 'monospace' }}>{selectedRegistration.nik}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Tempat Lahir</div>
                  <div style={{ fontSize: '14px', color: '#111827' }}>{selectedRegistration.tempat_lahir}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Tanggal Lahir</div>
                  <div style={{ fontSize: '14px', color: '#111827' }}>
                    {selectedRegistration.tanggal_lahir ? new Date(selectedRegistration.tanggal_lahir).toLocaleDateString('id-ID') : '-'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Jenis Kelamin</div>
                  <div style={{ fontSize: '14px', color: '#111827' }}>
                    {selectedRegistration.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Alamat Lengkap</div>
                <div style={{
                  fontSize: '14px',
                  color: '#374151',
                  lineHeight: '1.6',
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  whiteSpace: 'pre-wrap'
                }}>
                  {selectedRegistration.alamat_lengkap}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Nomor Telepon</div>
                  <div style={{ fontSize: '14px', color: '#111827' }}>
                    <a href={`tel:${selectedRegistration.nomor_telepon}`} style={{ color: '#0284c7', textDecoration: 'none' }}>
                      {selectedRegistration.nomor_telepon}
                    </a>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Email</div>
                  <div style={{ fontSize: '14px', color: '#111827' }}>
                    <a href={`mailto:${selectedRegistration.email}`} style={{ color: '#0284c7', textDecoration: 'none' }}>
                      {selectedRegistration.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Informasi Orang Tua */}
              {(selectedRegistration.nama_orang_tua || selectedRegistration.telepon_orang_tua || selectedRegistration.email_orang_tua) && (
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '12px', marginTop: '20px' }}>
                    Informasi Orang Tua/Wali
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Nama Orang Tua/Wali</div>
                      <div style={{ fontSize: '14px', color: '#111827' }}>
                        {selectedRegistration.nama_orang_tua || '-'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Telepon Orang Tua/Wali</div>
                      <div style={{ fontSize: '14px', color: '#111827' }}>
                        {selectedRegistration.telepon_orang_tua ? (
                          <a href={`tel:${selectedRegistration.telepon_orang_tua}`} style={{ color: '#0284c7', textDecoration: 'none' }}>
                            {selectedRegistration.telepon_orang_tua}
                          </a>
                        ) : '-'}
                      </div>
                    </div>
                  </div>
                  {selectedRegistration.email_orang_tua && (
                    <div style={{ marginTop: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Email Orang Tua/Wali</div>
                      <div style={{ fontSize: '14px', color: '#111827' }}>
                        <a href={`mailto:${selectedRegistration.email_orang_tua}`} style={{ color: '#0284c7', textDecoration: 'none' }}>
                          {selectedRegistration.email_orang_tua}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Informasi Pendidikan */}
              {(selectedRegistration.tingkat_pendidikan || selectedRegistration.sekolah_asal || selectedRegistration.tahun_lulus) && (
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '12px', marginTop: '20px' }}>
                    Informasi Pendidikan
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Tingkat Pendidikan</div>
                      <div style={{ fontSize: '14px', color: '#111827' }}>
                        {selectedRegistration.tingkat_pendidikan || '-'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Sekolah Asal</div>
                      <div style={{ fontSize: '14px', color: '#111827' }}>
                        {selectedRegistration.sekolah_asal || '-'}
                      </div>
                    </div>
                  </div>
                  {selectedRegistration.tahun_lulus && (
                    <div style={{ marginTop: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Tahun Lulus</div>
                      <div style={{ fontSize: '14px', color: '#111827' }}>
                        {selectedRegistration.tahun_lulus}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Informasi Tambahan */}
              {(selectedRegistration.kemampuan_quran || selectedRegistration.kebutuhan_khusus || selectedRegistration.motivasi) && (
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '12px', marginTop: '20px' }}>
                    Informasi Tambahan
                  </h4>
                  {selectedRegistration.kemampuan_quran && (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Kemampuan Membaca Al-Quran</div>
                      <div style={{ fontSize: '14px', color: '#111827' }}>
                        {selectedRegistration.kemampuan_quran}
                      </div>
                    </div>
                  )}
                  {selectedRegistration.kebutuhan_khusus && (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Kebutuhan Khusus</div>
                      <div style={{
                        fontSize: '14px',
                        color: '#374151',
                        lineHeight: '1.6',
                        padding: '12px',
                        backgroundColor: '#fef3c7',
                        borderRadius: '6px',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {selectedRegistration.kebutuhan_khusus}
                      </div>
                    </div>
                  )}
                  {selectedRegistration.motivasi && (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Motivasi Bergabung</div>
                      <div style={{
                        fontSize: '14px',
                        color: '#374151',
                        lineHeight: '1.6',
                        padding: '12px',
                        backgroundColor: '#f0f9ff',
                        borderRadius: '6px',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {selectedRegistration.motivasi}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedRegistration.catatan && (
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Catatan Admin</div>
                  <div style={{
                    fontSize: '14px',
                    color: '#374151',
                    lineHeight: '1.6',
                    padding: '16px',
                    backgroundColor: '#fef3c7',
                    borderRadius: '8px',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {selectedRegistration.catatan}
                  </div>
                </div>
              )}

              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Tanggal Pendaftaran</div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>{formatDate(selectedRegistration.created_at)}</div>
              </div>
            </div>
          )}
        </Modal>

        {/* Status Update Modal */}
        <Modal
          isOpen={statusModalOpen}
          onClose={() => {
            setStatusModalOpen(false)
            setSelectedRegistration(null)
            setStatusFormData({ status: 'pending', catatan: '' })
          }}
          title="Update Status Pendaftaran"
        >
          <form onSubmit={handleStatusSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Status
              </label>
              <select
                value={statusFormData.status}
                onChange={(e) => setStatusFormData({ ...statusFormData, status: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
                required
              >
                <option value="pending">Pending</option>
                <option value="diproses">Diproses</option>
                <option value="diterima">Diterima</option>
                <option value="ditolak">Ditolak</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Catatan (Opsional)
              </label>
              <textarea
                value={statusFormData.catatan}
                onChange={(e) => setStatusFormData({ ...statusFormData, catatan: e.target.value })}
                placeholder="Tambahkan catatan untuk pendaftar ini..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => {
                  setStatusModalOpen(false)
                  setSelectedRegistration(null)
                  setStatusFormData({ status: 'pending', catatan: '' })
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
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
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Update Status
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  )
}
