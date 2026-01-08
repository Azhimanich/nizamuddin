'use client'

interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  onEdit?: (row: any) => void
  onDelete?: (row: any) => void
  onUpdatePassword?: (row: any) => void
  loading?: boolean
}

export function DataTable({ columns, data, onEdit, onDelete, onUpdatePassword, loading }: DataTableProps) {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div style={{ 
          display: 'inline-block', 
          width: '40px', 
          height: '40px', 
          border: '4px solid #f3f4f6', 
          borderTop: '4px solid #3b82f6', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite',
          marginBottom: '16px'
        }}></div>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Memuat data...</p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          backgroundColor: '#f9fafb', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <svg style={{ width: '40px', height: '40px', color: '#d1d5db' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p style={{ color: '#6b7280', fontSize: '16px', marginBottom: '8px' }}>Tidak ada data</p>
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>Belum ada jadwal untuk tipe sekolah ini</p>
      </div>
    )
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}
                >
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete || onUpdatePassword) && (
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'right',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Aksi
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={row.id || index}
                style={{
                  borderBottom: '1px solid #e5e7eb',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{
                      padding: '12px 16px',
                      fontSize: '14px',
                      color: '#111827'
                    }}
                  >
                    {col.render
                      ? col.render(row[col.key], row)
                      : row[col.key] || '-'
                    }
                  </td>
                ))}
                {(onEdit || onDelete || onUpdatePassword) && (
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#0284c7',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}
                        >
                          Edit
                        </button>
                      )}
                      {onUpdatePassword && (
                        <button
                          onClick={() => onUpdatePassword(row)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}
                        >
                          Password
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => {
                            if (confirm('Yakin ingin menghapus?')) {
                              onDelete(row)
                            }
                          }}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

