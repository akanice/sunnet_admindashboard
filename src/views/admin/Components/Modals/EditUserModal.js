import React from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CAlert,
  CSpinner
} from '@coreui/react'
import { usersApi } from '../../../../services/api'

const EditUserModal = ({ visible, onClose, user, formData, onInputChange, onSave }) => {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user?.id) return

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      }

      await usersApi.updateUser(user.id, updateData)
      setSuccess('Cập nhật thông tin người dùng thành công!')
      
      // Call callback to refresh user list
      if (onSave) {
        onSave()
      }

      // Close modal after a short delay
      setTimeout(() => {
        onClose()
      }, 1500)

    } catch (err) {
      setError(err?.message || 'Có lỗi xảy ra khi cập nhật thông tin người dùng')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setError('')
    setSuccess('')
    onClose()
  }

  return (
    <CModal visible={visible} onClose={handleClose} size="lg">
      <CModalHeader>
        <CModalTitle>Xem thông tin người dùng</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm onSubmit={handleSubmit}>
          {error && (
            <CAlert color="danger" className="mb-3">
              {error}
            </CAlert>
          )}
          {success && (
            <CAlert color="success" className="mb-3">
              {success}
            </CAlert>
          )}

          <div className="mb-3">
            <CFormLabel htmlFor="name">Tên người dùng</CFormLabel>
            <CFormInput
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={onInputChange}
              readOnly
            />
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="email">Email</CFormLabel>
            <CFormInput
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              readOnly
            />
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="phone">Số điện thoại</CFormLabel>
            <CFormInput
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={onInputChange}
              readOnly
            />
          </div>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={handleClose} disabled={loading}>
          Đóng
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default EditUserModal