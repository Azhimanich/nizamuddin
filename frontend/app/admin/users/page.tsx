'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { DataTable } from '@/components/admin/DataTable'
import { Modal } from '@/components/admin/Modal'
import { useToast } from '@/components/admin/Toast'
import { getAuthToken } from '@/lib/auth'

export default function UsersPage() {
  const router = useRouter()
  const { Toast, showSuccess, showError } = useToast()
  const [users, setUsers] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [passwordUser, setPasswordUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin_akademik'
  })
  const [passwordData, setPasswordData] = useState({
    password: '',
    password_confirmation: ''
  })

  useEffect(() => {
    fetchUsers()
    fetchRoles()
  }, [])

  const fetchUsers = async () => {
    const token = getAuthToken()
    console.log('Users page - Token:', token ? 'exists' : 'missing')
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      console.log('Users API response status:', res.status)
      const data = await res.json()
      console.log('Users API data:', data)
      setUsers(data.data || data)
    } catch (err) {
      console.error('Error fetching users:', err)
      showError('Gagal memuat users')
    } finally {
      setLoading(false)
    }
  }

  const fetchRoles = async () => {
    const token = getAuthToken()
    console.log('Users page - fetching roles, Token:', token ? 'exists' : 'missing')
    
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
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = getAuthToken()
    const url = editingUser
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/users/${editingUser.id}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/users`

    try {
      const res = await fetch(url, {
        method: editingUser ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setModalOpen(false)
        setEditingUser(null)
        setFormData({ name: '', email: '', password: '', role: 'admin_akademik' })
        fetchUsers()
        showSuccess('User berhasil disimpan')
      } else {
        const error = await res.json()
        showError(error.message || 'Gagal menyimpan user')
      }
    } catch (err) {
      console.error('Error saving user:', err)
      showError('Error: ' + err)
    }
  }

  const handleEdit = (user: any) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.roles?.[0]?.name || 'admin_akademik'
    })
    setModalOpen(true)
  }

  const handleDelete = async (user: any) => {
    if (user.email === 'admin@pesantren.com') {
      showError('Tidak bisa menghapus super admin')
      return
    }

    const token = getAuthToken()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/users/${user.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        fetchUsers()
        showSuccess('User berhasil dihapus')
      } else {
        const error = await res.json()
        showError(error.message || 'Gagal menghapus user')
      }
    } catch (err) {
      console.error('Error deleting user:', err)
      showError('Error: ' + err)
    }
  }

  const handleUpdatePassword = (user: any) => {
    setPasswordUser(user)
    setPasswordData({ password: '', password_confirmation: '' })
    setPasswordModalOpen(true)
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.password !== passwordData.password_confirmation) {
      showError('Konfirmasi password tidak cocok')
      return
    }
    
    if (passwordData.password.length < 8) {
      showError('Password minimal 8 karakter')
      return
    }

    const token = getAuthToken()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/users/${passwordUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: passwordData.password
        })
      })

      if (res.ok) {
        setPasswordModalOpen(false)
        setPasswordUser(null)
        setPasswordData({ password: '', password_confirmation: '' })
        showSuccess('Password berhasil diperbarui')
      } else {
        const error = await res.json()
        showError(error.message || 'Gagal memperbarui password')
      }
    } catch (err) {
      console.error('Error updating password:', err)
      showError('Error: ' + err)
    }
  }

  return (
    <AdminLayout>
      {Toast}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#111827' }}>Manajemen User</h1>
            <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
              Kelola akun admin dan role pengguna
            </p>
          </div>
          <button
            onClick={() => {
              setEditingUser(null)
              setFormData({ name: '', email: '', password: '', role: 'admin_akademik' })
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
            + Tambah User
          </button>
        </div>

        <DataTable
          columns={[
            { 
              key: 'name', 
              label: 'Nama',
              render: (value) => (
                <span style={{ 
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  {value}
                </span>
              )
            },
            { 
              key: 'email', 
              label: 'Email',
              render: (value) => (
                <span style={{ 
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  {value}
                </span>
              )
            },
            {
              key: 'roles',
              label: 'Role',
              render: (value) => {
                const role = value?.[0]?.name
                const roleColors = {
                  super_admin: { bg: '#fef2f2', color: '#dc2626', label: 'Super Admin' },
                  admin_akademik: { bg: '#eff6ff', color: '#2563eb', label: 'Admin Akademik' },
                  admin_humas: { bg: '#f0fdf4', color: '#16a34a', label: 'Admin Humas' }
                }
                const style = roleColors[role as keyof typeof roleColors] || { bg: '#f3f4f6', color: '#6b7280', label: role }
                
                return (
                  <span style={{
                    backgroundColor: style.bg,
                    color: style.color,
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {style.label}
                  </span>
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
          data={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onUpdatePassword={handleUpdatePassword}
          loading={loading}
        />

        <Modal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false)
            setEditingUser(null)
            setFormData({ name: '', email: '', password: '', role: 'admin_akademik' })
          }}
          title={editingUser ? 'Edit User' : 'Tambah User'}
          size="md"
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                Nama
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nama lengkap"
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
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
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
                Password {editingUser && <span style={{ fontWeight: '400', color: '#6b7280' }}>(kosongkan jika tidak diubah)</span>}
              </label>
              <input
                type="password"
                required={!editingUser}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Minimal 8 karakter"
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
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  transition: 'border-color 0.2s',
                  backgroundColor: 'white'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
              >
                {roles.map((role: any) => (
                  <option key={role.id} value={role.name}>
                    {role.name === 'super_admin' ? 'Super Admin' : 
                     role.name === 'admin_akademik' ? 'Admin Akademik' : 
                     role.name === 'admin_humas' ? 'Admin Humas' : role.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false)
                  setEditingUser(null)
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

        <Modal
          isOpen={passwordModalOpen}
          onClose={() => {
            setPasswordModalOpen(false)
            setPasswordUser(null)
            setPasswordData({ password: '', password_confirmation: '' })
          }}
          title="Update Password"
          size="sm"
        >
          <div style={{ marginBottom: '16px' }}>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
              Update password untuk: <strong>{passwordUser?.name} ({passwordUser?.email})</strong>
            </p>
          </div>
          
          <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                Password Baru
              </label>
              <input
                type="password"
                required
                value={passwordData.password}
                onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                placeholder="Minimal 8 karakter"
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
                Konfirmasi Password
              </label>
              <input
                type="password"
                required
                value={passwordData.password_confirmation}
                onChange={(e) => setPasswordData({ ...passwordData, password_confirmation: e.target.value })}
                placeholder="Ulangi password baru"
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

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  setPasswordModalOpen(false)
                  setPasswordUser(null)
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
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
              >
                Update Password
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  )
}

