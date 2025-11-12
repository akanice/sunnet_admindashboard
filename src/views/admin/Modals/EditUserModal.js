/**
 * ============================================================================
 * Tệp `src/views/admin/Modals/EditUserModal.js`
 * ----------------------------------------------------------------------------
 * Mục đích:
 *   - Hiển thị modal cho phép quản trị viên chỉnh sửa thông tin chi tiết của người dùng.
 *   - Nhận dữ liệu đã chuẩn hóa từ `Users/index.js` và hỗ trợ nhập liệu, hiển thị
 *     trạng thái tải/lưu, cũng như phản hồi thành công hoặc lỗi.
 * ----------------------------------------------------------------------------
 * Quy tắc sử dụng:
 *   - Thành phần không trực tiếp gọi API mà ủy quyền cho hàm `onSave` từ cha.
 *   - Các trường dữ liệu được gán `name` tương ứng với state `formData`.
 *   - Khi `isFetchingDetail` = true, hiển thị spinner để thông báo đang tải dữ liệu.
 * ============================================================================
 */

import React from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CRow,
  CCol,
  CButton,
  CAlert,
  CSpinner,
} from '@coreui/react'

/**
 * Thành phần modal chỉnh sửa thông tin người dùng.
 * @param {Object} props - Các thuộc tính truyền vào component.
 * @param {boolean} props.visible - Trạng thái hiển thị modal.
 * @param {Function} props.onClose - Hàm đóng modal.
 * @param {Object} props.user - Thông tin người dùng đầy đủ (sau khi gọi API).
 * @param {Object} props.formData - Dữ liệu form đã chuẩn hóa để binding.
 * @param {Function} props.onInputChange - Hàm xử lý thay đổi giá trị input.
 * @param {Function} props.onSave - Hàm lưu dữ liệu do component cha cung cấp.
 * @param {boolean} props.isSaving - Cờ trạng thái đang lưu dữ liệu.
 * @param {boolean} props.isFetchingDetail - Cờ trạng thái đang tải dữ liệu chi tiết.
 * @param {string} props.errorMessage - Thông báo lỗi cần hiển thị.
 * @param {string} props.successMessage - Thông báo thành công cần hiển thị.
 * @returns {JSX.Element} Modal chỉnh sửa người dùng.
 */
const EditUserModal = ({
  visible,
  onClose,
  user,
  formData,
  onInputChange,
  onSave,
  isSaving,
  isFetchingDetail,
  errorMessage,
  successMessage,
}) => {
  /**
   * Hàm xử lý khi submit form chỉnh sửa.
   * @param {React.FormEvent<HTMLFormElement>} event - Sự kiện submit form.
   * @description
   * - Ngăn chặn reload trang mặc định của form.
   * - Gọi hàm `onSave` được truyền từ component cha để thực thi cập nhật.
   * - Không truyền dữ liệu trực tiếp vì `formData` đã được quản lý ở cha.
   */
  const handleSubmit = (event) => {
    event.preventDefault()
    if (onSave) {
      onSave()
    }
  }

  const safeFormData = formData || {}
  const isDisabled = isSaving || isFetchingDetail

  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader>
        <CModalTitle>Chỉnh sửa thông tin người dùng</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {errorMessage && (
          <CAlert color="danger" className="mb-3">
            {errorMessage}
          </CAlert>
        )}

        {successMessage && (
          <CAlert color="success" className="mb-3">
            {successMessage}
          </CAlert>
        )}

        <CForm id="edit-user-form" onSubmit={handleSubmit}>
          {isFetchingDetail ? (
            <div className="d-flex justify-content-center py-4">
              <CSpinner color="primary" />
            </div>
          ) : (
            <>
              {/* Khối thông tin tài khoản cơ bản */}
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="name">Tên hiển thị</CFormLabel>
                  <CFormInput
                    id="name"
                    name="name"
                    type="text"
                    value={safeFormData.name || ''}
                    onChange={onInputChange}
                    disabled={isDisabled}
                    placeholder="Nhập tên hiển thị"
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="alias">Bí danh</CFormLabel>
                  <CFormInput
                    id="alias"
                    name="alias"
                    type="text"
                    value={safeFormData.alias || ''}
                    onChange={onInputChange}
                    disabled={isDisabled}
                    placeholder="Nhập bí danh"
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="email">Email</CFormLabel>
                  <CFormInput
                    id="email"
                    name="email"
                    type="email"
                    value={safeFormData.email || ''}
                    onChange={onInputChange}
                    disabled={isDisabled}
                    placeholder="Nhập email"
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="phone">Số điện thoại</CFormLabel>
                  <CFormInput
                    id="phone"
                    name="phone"
                    type="tel"
                    value={safeFormData.phone || ''}
                    onChange={onInputChange}
                    disabled={isDisabled}
                    placeholder="Nhập số điện thoại"
                  />
                </CCol>
              </CRow>

              {/* Khối thông tin hồ sơ cá nhân */}
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="profileFullName">Họ tên đầy đủ</CFormLabel>
                  <CFormInput
                    id="profileFullName"
                    name="profileFullName"
                    type="text"
                    value={safeFormData.profileFullName || ''}
                    onChange={onInputChange}
                    disabled={isDisabled}
                    placeholder="Nhập họ tên đầy đủ"
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="profileGender">Giới tính</CFormLabel>
                  <CFormSelect
                    id="profileGender"
                    name="profileGender"
                    value={safeFormData.profileGender ?? ''}
                    onChange={onInputChange}
                    disabled={isDisabled}
                  >
                    <option value="">-- Chọn giới tính --</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </CFormSelect>
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="profileBirthday">Ngày sinh</CFormLabel>
                  <CFormInput
                    id="profileBirthday"
                    name="profileBirthday"
                    type="date"
                    value={safeFormData.profileBirthday || ''}
                    onChange={onInputChange}
                    disabled={isDisabled}
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="profileAddress">Địa chỉ</CFormLabel>
                  <CFormInput
                    id="profileAddress"
                    name="profileAddress"
                    type="text"
                    value={safeFormData.profileAddress || ''}
                    onChange={onInputChange}
                    disabled={isDisabled}
                    placeholder="Nhập địa chỉ"
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="profileCity">Thành phố</CFormLabel>
                  <CFormInput
                    id="profileCity"
                    name="profileCity"
                    type="text"
                    value={safeFormData.profileCity || ''}
                    onChange={onInputChange}
                    disabled={isDisabled}
                    placeholder="Nhập thành phố"
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="profileState">Tỉnh/Bang</CFormLabel>
                  <CFormInput
                    id="profileState"
                    name="profileState"
                    type="text"
                    value={safeFormData.profileState || ''}
                    onChange={onInputChange}
                    disabled={isDisabled}
                    placeholder="Nhập tỉnh/bang"
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={4}>
                  <CFormLabel htmlFor="profileZipcode">Mã bưu chính</CFormLabel>
                  <CFormInput
                    id="profileZipcode"
                    name="profileZipcode"
                    type="text"
                    value={safeFormData.profileZipcode || ''}
                    onChange={onInputChange}
                    disabled={isDisabled}
                    placeholder="Nhập mã bưu chính"
                  />
                </CCol>
                <CCol md={4}>
                  <CFormLabel htmlFor="profileAvatar">Ảnh đại diện (URL)</CFormLabel>
                  <CFormInput
                    id="profileAvatar"
                    name="profileAvatar"
                    type="text"
                    value={safeFormData.profileAvatar || ''}
                    onChange={onInputChange}
                    disabled={isDisabled}
                    placeholder="Nhập URL ảnh đại diện"
                  />
                </CCol>
                <CCol md={4}>
                  <CFormLabel htmlFor="profileCover">Ảnh bìa (URL)</CFormLabel>
                  <CFormInput
                    id="profileCover"
                    name="profileCover"
                    type="text"
                    value={safeFormData.profileCover || ''}
                    onChange={onInputChange}
                    disabled={isDisabled}
                    placeholder="Nhập URL ảnh bìa"
                  />
                </CCol>
              </CRow>

              <div className="mb-3">
                <CFormLabel htmlFor="profileHistory">Tiểu sử</CFormLabel>
                <CFormTextarea
                  id="profileHistory"
                  name="profileHistory"
                  value={safeFormData.profileHistory || ''}
                  onChange={onInputChange}
                  disabled={isDisabled}
                  placeholder="Nhập tiểu sử / câu chuyện"
                  rows={4}
                />
              </div>

              {/* Khối thông tin hệ thống */}
              <CRow className="mb-2">
                <CCol>
                  <p className="text-medium-emphasis mb-0">
                    ID người dùng: <strong>{user?.id || 'N/A'}</strong>
                  </p>
                </CCol>
              </CRow>
            </>
          )}
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose} disabled={isSaving}>
          Đóng
        </CButton>
        <CButton color="primary" type="submit" form="edit-user-form" disabled={isDisabled}>
          {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default EditUserModal