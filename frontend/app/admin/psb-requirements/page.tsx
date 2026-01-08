'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { DataTable } from '@/components/admin/DataTable'
import { Modal } from '@/components/admin/Modal'
import { useToast } from '@/components/admin/Toast'
import { getAuthToken, getUserData } from '@/lib/auth'

interface Requirement {
  id: number
  category: string
  item: string
  locale: string
  order: number
  is_active: boolean
}

interface Cost {
  id: number
  item_name: string
  amount: string
  note: string
  locale: string
  order: number
  is_active: boolean
}

interface AdditionalRequirement {
  id: number
  requirement: string
  locale: string
  order: number
  is_active: boolean
}

export default function PSBRequirementsManagement() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'requirements' | 'costs' | 'additional'>('requirements')
  const [locale, setLocale] = useState<'id' | 'en'>('id')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [requirements, setRequirements] = useState<Requirement[]>([])
  const [costs, setCosts] = useState<Cost[]>([])
  const [additionalRequirements, setAdditionalRequirements] = useState<AdditionalRequirement[]>([])

  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)

  useEffect(() => {
    const token = getAuthToken()
    const userData = getUserData()

    if (!token || !userData) {
      router.push('/admin/login')
      return
    }

    setUser(userData)
    fetchData()
  }, [router, locale])

  const fetchData = async () => {
    try {
      const token = getAuthToken()
      
      const [reqRes, costRes, addReqRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/psb-requirements?locale=${locale}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/psb-costs?locale=${locale}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/psb-additional-requirements?locale=${locale}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      const reqData = await reqRes.json()
      const costData = await costRes.json()
      const addReqData = await addReqRes.json()

      if (reqData.success) {
        const flatRequirements = Object.values(reqData.data).flat() as Requirement[]
        setRequirements(flatRequirements)
      }

      if (costData.success) {
        setCosts(costData.data)
      }

      if (addReqData.success) {
        setAdditionalRequirements(addReqData.data)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (data: any) => {
    setSaving(true)
    try {
      const token = getAuthToken()
      const isEdit = editingItem && editingItem.id
      
      const endpoint = activeTab === 'requirements' 
        ? '/admin/psb-requirements'
        : activeTab === 'costs'
        ? '/admin/psb-costs'
        : '/admin/psb-additional-requirements'

      const url = isEdit 
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}${endpoint}/${editingItem.id}`
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}${endpoint}`

      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...data, locale })
      })

      const result = await response.json()
      
      if (result.success) {
        setShowForm(false)
        setEditingItem(null)
        fetchData()
        alert(isEdit ? 'Data updated successfully!' : 'Data created successfully!')
      } else {
        alert('Failed to save data: ' + result.message)
      }
    } catch (error) {
      alert('Error saving data: ' + error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const token = getAuthToken()
      
      const endpoint = activeTab === 'requirements' 
        ? '/admin/psb-requirements'
        : activeTab === 'costs'
        ? '/admin/psb-costs'
        : '/admin/psb-additional-requirements'

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}${endpoint}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      const result = await response.json()
      
      if (result.success) {
        fetchData()
        alert('Data deleted successfully!')
      } else {
        alert('Failed to delete data: ' + result.message)
      }
    } catch (error) {
      alert('Error deleting data: ' + error)
    }
  }

  const renderForm = () => {
    const isEdit = editingItem && editingItem.id
    
    if (activeTab === 'requirements') {
      return (
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 20px 0' }}>
            {isEdit ? 'Edit Requirement' : 'Add New Requirement'}
          </h3>
          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            handleSave({
              category: formData.get('category') as string,
              item: formData.get('item') as string,
              order: parseInt(formData.get('order') as string || '0'),
              is_active: formData.get('is_active') === 'on'
            })
          }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Category</label>
              <select 
                name="category" 
                required
                defaultValue={editingItem?.category || ''}
                style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
              >
                <option value="">Select Category</option>
                <option value="Dokumen Identitas">Dokumen Identitas</option>
                <option value="Dokumen Akademik">Dokumen Akademik</option>
                <option value="Dokumen Kesehatan">Dokumen Kesehatan</option>
              </select>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Item</label>
              <input 
                type="text" 
                name="item" 
                required
                defaultValue={editingItem?.item || ''}
                style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Order</label>
              <input 
                type="number" 
                name="order" 
                defaultValue={editingItem?.order || 0}
                style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label>
                <input 
                  type="checkbox" 
                  name="is_active" 
                  defaultChecked={editingItem?.is_active !== false}
                  style={{ marginRight: '8px' }}
                />
                Active
              </label>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                type="submit" 
                disabled={saving}
                style={{ 
                  padding: '8px 16px', 
                  backgroundColor: '#0284c7', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: saving ? 'not-allowed' : 'pointer'
                }}
              >
                {saving ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
              </button>
              <button 
                type="button" 
                onClick={() => { setShowForm(false); setEditingItem(null) }}
                style={{ 
                  padding: '8px 16px', 
                  backgroundColor: '#6b7280', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )
    }

    if (activeTab === 'costs') {
      return (
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 20px 0' }}>
            {isEdit ? 'Edit Cost' : 'Add New Cost'}
          </h3>
          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            handleSave({
              item_name: formData.get('item_name') as string,
              amount: formData.get('amount') as string,
              note: formData.get('note') as string,
              order: parseInt(formData.get('order') as string || '0'),
              is_active: formData.get('is_active') === 'on'
            })
          }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Item Name</label>
              <input 
                type="text" 
                name="item_name" 
                required
                defaultValue={editingItem?.item_name || ''}
                style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Amount</label>
              <input 
                type="text" 
                name="amount" 
                required
                defaultValue={editingItem?.amount || ''}
                style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Note</label>
              <textarea 
                name="note" 
                rows={3}
                defaultValue={editingItem?.note || ''}
                style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Order</label>
              <input 
                type="number" 
                name="order" 
                defaultValue={editingItem?.order || 0}
                style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label>
                <input 
                  type="checkbox" 
                  name="is_active" 
                  defaultChecked={editingItem?.is_active !== false}
                  style={{ marginRight: '8px' }}
                />
                Active
              </label>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                type="submit" 
                disabled={saving}
                style={{ 
                  padding: '8px 16px', 
                  backgroundColor: '#0284c7', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: saving ? 'not-allowed' : 'pointer'
                }}
              >
                {saving ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
              </button>
              <button 
                type="button" 
                onClick={() => { setShowForm(false); setEditingItem(null) }}
                style={{ 
                  padding: '8px 16px', 
                  backgroundColor: '#6b7280', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )
    }

    return (
      <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 20px 0' }}>
          {isEdit ? 'Edit Additional Requirement' : 'Add New Additional Requirement'}
        </h3>
        <form onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          handleSave({
            requirement: formData.get('requirement') as string,
            order: parseInt(formData.get('order') as string || '0'),
            is_active: formData.get('is_active') === 'on'
          })
        }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Requirement</label>
            <textarea 
              name="requirement" 
              required
              rows={3}
              defaultValue={editingItem?.requirement || ''}
              style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Order</label>
            <input 
              type="number" 
              name="order" 
              defaultValue={editingItem?.order || 0}
              style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label>
              <input 
                type="checkbox" 
                name="is_active" 
                defaultChecked={editingItem?.is_active !== false}
                style={{ marginRight: '8px' }}
              />
              Active
            </label>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              type="submit" 
              disabled={saving}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#0284c7', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: saving ? 'not-allowed' : 'pointer'
              }}
            >
              {saving ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
            </button>
            <button 
              type="button" 
              onClick={() => { setShowForm(false); setEditingItem(null) }}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#6b7280', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  }

  const renderTable = () => {
    const data = activeTab === 'requirements' ? requirements : 
                 activeTab === 'costs' ? costs : 
                 additionalRequirements

    return (
      <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb' }}>
            <tr>
              {activeTab === 'requirements' && <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Category</th>}
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                {activeTab === 'requirements' ? 'Item' : activeTab === 'costs' ? 'Item Name' : 'Requirement'}
              </th>
              {activeTab === 'costs' && <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Amount</th>}
              {activeTab === 'costs' && <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Note</th>}
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Order</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item: any) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                {activeTab === 'requirements' && <td style={{ padding: '12px' }}>{item.category}</td>}
                <td style={{ padding: '12px' }}>
                  {activeTab === 'requirements' ? item.item : 
                   activeTab === 'costs' ? item.item_name : 
                   item.requirement}
                </td>
                {activeTab === 'costs' && <td style={{ padding: '12px' }}>{item.amount}</td>}
                {activeTab === 'costs' && <td style={{ padding: '12px' }}>{item.note || '-'}</td>}
                <td style={{ padding: '12px' }}>{item.order}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px',
                    backgroundColor: item.is_active ? '#dcfce7' : '#fee2e2',
                    color: item.is_active ? '#16a34a' : '#dc2626'
                  }}>
                    {item.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <button 
                    onClick={() => { setEditingItem(item); setShowForm(true) }}
                    style={{ 
                      padding: '4px 8px', 
                      backgroundColor: '#0284c7', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px',
                      marginRight: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    style={{ 
                      padding: '4px 8px', 
                      backgroundColor: '#dc2626', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid #e5e7eb',
              borderTopColor: '#0284c7',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p style={{ color: '#6b7280' }}>Loading...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 24px 0' }}>
          PSB Requirements Management
        </h1>

        {/* Language Selector */}
        <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
          <label style={{ marginRight: '12px', fontWeight: '500' }}>Language:</label>
          <select 
            value={locale} 
            onChange={(e) => setLocale(e.target.value as 'id' | 'en')}
            style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
          >
            <option value="id">Bahasa Indonesia</option>
            <option value="en">English</option>
          </select>
        </div>

        {/* Tabs */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
            <button
              onClick={() => setActiveTab('requirements')}
              style={{
                padding: '12px 24px',
                backgroundColor: activeTab === 'requirements' ? '#0284c7' : 'transparent',
                color: activeTab === 'requirements' ? 'white' : '#374151',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Document Requirements
            </button>
            <button
              onClick={() => setActiveTab('costs')}
              style={{
                padding: '12px 24px',
                backgroundColor: activeTab === 'costs' ? '#0284c7' : 'transparent',
                color: activeTab === 'costs' ? 'white' : '#374151',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Costs
            </button>
            <button
              onClick={() => setActiveTab('additional')}
              style={{
                padding: '12px 24px',
                backgroundColor: activeTab === 'additional' ? '#0284c7' : 'transparent',
                color: activeTab === 'additional' ? 'white' : '#374151',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Additional Requirements
            </button>
          </div>
        </div>

        {/* Add Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '20px',
              fontWeight: '500'
            }}
          >
            + Add New {activeTab === 'requirements' ? 'Requirement' : activeTab === 'costs' ? 'Cost' : 'Additional Requirement'}
          </button>
        )}

        {/* Form */}
        {showForm && renderForm()}

        {/* Table */}
        {renderTable()}

        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </AdminLayout>
  )
}

