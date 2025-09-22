import React from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CSpinner, CAlert, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CBadge } from '@coreui/react'
import { usersApi } from '../../../services/api'

const UsersPage = () => {
  const [users, setUsers] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  const formatDateTime = React.useCallback((value) => {
    if (!value) return '-'
    try {
      const normalized = typeof value === 'string' && value.includes(' ') && !value.includes('T')
        ? value.replace(' ', 'T')
        : value
      const date = new Date(normalized)
      if (isNaN(date.getTime())) return String(value)
      return date.toLocaleString('vi-VN', { hour12: false })
    } catch (e) {
      return String(value)
    }
  }, [])

  const fetchUsers = React.useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await usersApi.getAll()
      const list = res?.data || [];
      setUsers(list)
    } catch (err) {
      setError(err?.message || 'Không thể tải danh sách người dùng')
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Quản lý người dùng</strong>
          </CCardHeader>
          <CCardBody>
            {loading && (
              <div className="d-flex align-items-center gap-2">
                <CSpinner size="sm" />
                <span>Đang tải dữ liệu...</span>
              </div>
            )}
            {!!error && (
              <CAlert color="danger" className="mb-3">
                {error}
              </CAlert>
            )}

             {!loading && !error && (
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Tên</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Số điện thoại</CTableHeaderCell>
                     <CTableHeaderCell scope="col">Ngày tạo</CTableHeaderCell>
                     <CTableHeaderCell scope="col">Trạng thái</CTableHeaderCell>
                    <CTableHeaderCell scope="col" className="text-end">Hành động</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {users.map((u, idx) => (
                    <CTableRow key={u.id || idx}>
                      <CTableHeaderCell scope="row">{idx + 1}</CTableHeaderCell>
                      <CTableDataCell>{u.name || u.full_name || '-'}</CTableDataCell>
                      <CTableDataCell>{u.email || '-'}</CTableDataCell>
                      <CTableDataCell>{u.phone || '-'}</CTableDataCell>
                       <CTableDataCell>{formatDateTime(u.created_at)}</CTableDataCell>
                      <CTableDataCell>
                         <CBadge color={u && u.deleted_at !== null ? 'success' : 'secondary'}>
                           {u && u.deleted_at !== null ? 'Hoạt động' : 'Đã khoá'}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell className="text-end">
                        {/* Placeholder cho nút hành động sau này */}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                  {users.length === 0 && (
                    <CTableRow>
                       <CTableDataCell colSpan={7} className="text-center text-body-secondary">
                        Không có dữ liệu
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default UsersPage
