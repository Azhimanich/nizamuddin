'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { DataTable } from '@/components/admin/DataTable'
import { Modal } from '@/components/admin/Modal'
import { useToast } from '@/components/admin/Toast'
import { getAuthToken } from '@/lib/auth'

export default function RolesPage() {
  const { Toast, showSuccess, showError } = useToast()
  const [roles, setRoles] = useState<any[]>([])
  const [permissions, setPermissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    permissions: [] as string[]
  })

  useEffect(() => {
    fetchRoles()
    fetchPermissions()
  }, [])

  const fetchRoles = async () => {
    const token = getAuthToken()
    console.log('Roles page - Token:', token ? 'exists' : 'missing')
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/roles`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      console.log('Roles API response status:', res.status)
      const data = await res.json()
      console.log('Roles API data:', data)
      setRoles(data.data || data)
    } catch (err) {
      console.error('Error fetching roles:', err)
      showError('Gagal memuat roles')
    } finally {
      setLoading(false)
    }
  }

  const fetchPermissions = async () => {
    const token = getAuthToken()
    console.log('Permissions page - Token:', token ? 'exists' : 'missing')
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/permissions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      console.log('Permissions API response status:', res.status)
      const data = await res.json()
      console.log('Permissions API data:', data)
      setPermissions(data.data || data)
    } catch (err) {
      console.error('Error fetching permissions:', err)
      showError('Gagal memuat permissions')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = getAuthToken()
    const url = editingRole
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/roles/${editingRole.id}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/roles`

    try {
      const res = await fetch(url, {
        method: editingRole ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setModalOpen(false)
        setEditingRole(null)
        setFormData({ name: '', permissions: [] })
        fetchRoles()
        showSuccess('Role berhasil disimpan')
      } else {
        const error = await res.json()
        showError(error.message || 'Gagal menyimpan role')
      }
    } catch (err) {
      console.error('Error saving role:', err)
      showError('Error: ' + err)
    }
  }

  const handleEdit = (role: any) => {
    setEditingRole(role)
    setFormData({
      name: role.name,
      permissions: role.permissions || []
    })
    setModalOpen(true)
  }

  const handleDelete = async (role: any) => {
    if (role.name === 'super_admin') {
      showError('Tidak bisa menghapus role super_admin')
      return
    }

    const token = getAuthToken()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/roles/${role.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        fetchRoles()
        showSuccess('Role berhasil dihapus')
      } else {
        const error = await res.json()
        showError(error.message || 'Gagal menghapus role')
      }
    } catch (err) {
      console.error('Error deleting role:', err)
      showError('Error: ' + err)
    }
  }

  const handlePermissionToggle = (permissionName: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionName)
        ? prev.permissions.filter(p => p !== permissionName)
        : [...prev.permissions, permissionName]
    }))
  }

  return (
    <AdminLayout>
      {Toast}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#111827' }}>Manajemen Role</h1>
            <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
              Kelola role dan permission akses pengguna
            </p>
          </div>
          <button
            onClick={() => {
              setEditingRole(null)
              setFormData({ name: '', permissions: [] })
              setModalOpen(true)
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0284c7',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0369a1'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0284c7'}
          >
            + Tambah Role
          </button>
        </div>

        <DataTable
          columns={[
            { 
              key: 'name', 
              label: 'Nama Role',
              render: (value) => (
                <span style={{ 
                  fontWeight: '600',
                  color: value === 'super_admin' ? '#dc2626' : '#374151'
                }}>
                  {value}
                </span>
              )
            },
            {
              key: 'permissions',
              label: 'Permissions',
              render: (value) => {
                const perms = Array.isArray(value) ? value : (value ? [value] : [])
                if (perms.length === 0) return <span style={{ color: '#9ca3af' }}>Tidak ada</span>
                
                return (
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '4px',
                    maxWidth: '300px'
                  }}>
                    {perms.slice(0, 3).map((perm: string, idx: number) => (
                      <span
                        key={idx}
                        style={{
                          backgroundColor: '#f3f4f6',
                          color: '#374151',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '500'
                        }}
                      >
                        {perm}
                      </span>
                    ))}
                    {perms.length > 3 && (
                      <span style={{
                        backgroundColor: '#e5e7eb',
                        color: '#6b7280',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '500'
                      }}>
                        +{perms.length - 3}
                      </span>
                    )}
                  </div>
                )
              }
            },
            {
              key: 'created_at',
              label: 'Dibuat',
              render: (value) => (
                <span style={{ color: '#6b7280', fontSize: '13px' }}>
                  {new Date(value).toLocaleDateString('id-ID')}
                </span>
              )
            }
          ]}
          data={roles}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />

        <Modal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false)
            setEditingRole(null)
            setFormData({ name: '', permissions: [] })
          }}
          title={editingRole ? 'Edit Role' : 'Tambah Role'}
          size="lg"
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                Nama Role
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: admin_keuangan"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                Permissions ({formData.permissions.length} dipilih)
              </label>
              <div style={{
                maxHeight: '300px',
                overflowY: 'auto',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                padding: '12px',
                backgroundColor: '#f9fafb'
              }}>
                {permissions.map((permission) => (
                  <label key={permission.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '8px',
                    cursor: 'pointer',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(permission.name)}
                      onChange={() => handlePermissionToggle(permission.name)}
                      style={{ 
                        marginRight: '10px',
                        width: '16px',
                        height: '16px'
                      }}
                    />
                    <span style={{ fontSize: '13px', color: '#374151' }}>
                      {permission.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false)
                  setEditingRole(null)
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
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
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0369a1'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0284c7'}
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
