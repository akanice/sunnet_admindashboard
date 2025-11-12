/**
 * ============================================================================
 * Tệp `src/views/admin/Users/index.js`
 * ----------------------------------------------------------------------------
 * Mục đích:
 *   - Hiển thị danh sách người dùng trong khu vực quản trị.
 *   - Cho phép quản trị viên xem và chỉnh sửa thông tin chi tiết của từng người dùng
 *     thông qua modal `EditUserModal`.
 *   - Hỗ trợ gọi API `/api/users/:id?include=profile,roles,friends,usersRequested,myRequestFriend`
 *     để lấy dữ liệu đầy đủ của người dùng phục vụ việc chỉnh sửa.
 * ----------------------------------------------------------------------------
 * Luồng xử lý chính:
 *   1. Lấy danh sách người dùng bằng `usersApi.getAll`.
 *   2. Khi nhấn nút "Xem", gọi `usersApi.updateUser` (PUT) với payload rỗng
 *      và tham số `include` để lấy dữ liệu chi tiết hiện tại từ backend.
 *   3. Hiển thị dữ liệu trong modal dưới dạng form cho phép chỉnh sửa.
 *   4. Khi nhấn lưu, tiếp tục gọi `usersApi.updateUser` với payload đã chỉnh sửa
 *      và tham số `include` nhằm nhận lại dữ liệu cập nhật mới nhất.
 * ----------------------------------------------------------------------------
 * Ví dụ request cập nhật:
 *   PUT /api/users/66?include=profile,roles,friends,usersRequested,myRequestFriend
 *   {
 *     "name": "THUỲ TRANG",
 *     "email": "doanthithuytrang2032003@gmail.com",
 *     "phone": "+84889930615",
 *     "alias": "mira20.3",
 *     "profile": {
 *       "full_name": "THUỲ TRANG",
 *       "gender": null,
 *       "birthday": "2025-10-15",
 *       "address": "273 Trần Cung, Hà Nội",
 *       "additional_data": {
 *         "cover": "https://dev.sunnetwork.io.vn/api/media/24214/download",
 *         "avatar": "https://dev.sunnetwork.io.vn/api/media/24213/download",
 *         "history": "Cho đi là còn mãi"
 *       }
 *     }
 *   }
 * ----------------------------------------------------------------------------
 * Ví dụ response (rút gọn):
 *   {
 *     "data": {
 *       "id": 66,
 *       "name": "THUỲ TRANG",
 *       "profile": {
 *         "full_name": "THUỲ TRANG",
 *         "additional_data": {
 *           "history": "Cho đi là còn mãi"
 *         }
 *       }
 *     }
 *   }
 * ============================================================================
 */

import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CSpinner,
} from '@coreui/react'
import AppHorizontalBar from 'src/components/AppHorizontalBar'
import EditUserModal from '../Modals/EditUserModal'
import ChangePasswordModal from '../Modals/ChangePasswordModal'
import useApi from '../../../hooks/useApi'
import { usersApi } from '../../../services/api'

/**
 * Hằng số trạng thái form mặc định phục vụ chỉnh sửa người dùng.
 * @type {Object}
 */
const defaultUserFormState = {
  name: '',
  email: '',
  phone: '',
  alias: '',
  profileFullName: '',
  profileGender: '',
  profileBirthday: '',
  profileAddress: '',
  profileCity: '',
  profileState: '',
  profileZipcode: '',
  profileHistory: '',
  profileCover: '',
  profileAvatar: '',
}

const Users = () => {
  /**
   * Trạng thái quản lý danh sách và thao tác chỉnh sửa.
   */
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [editModalVisible, setEditModalVisible] = useState(false) // modal edit user info
  const [modalVisible, setModalVisible] = useState(false) // modal change password
  const [formData, setFormData] = useState({ ...defaultUserFormState })
  const [currentPage, setCurrentPage] = useState(1)
  const [detailError, setDetailError] = useState('')
  const [detailLoading, setDetailLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState('')

  // Fetch users list
  const {
    data: usersData,
    execute: fetchUsers,
  } = useApi(
    () => {
      const searchQuery = ''
      return usersApi.getAll({
        page: currentPage,
        limit: 60,
        orderBy: 'id',
        sortedBy: 'desc',
        include: 'roles',
        searchFields: 'roles.role_id:in',
        search: 'roles.role_id:1',
        ...(searchQuery ? { search: searchQuery } : {}),
      })
    },
    [currentPage],
    false,
  )

  // Fetch users when dependencies change
  useEffect(() => {
    fetchUsers()
    setLoading(false)
  }, [currentPage])

  const users = usersData?.data || []

  /**
   * Hàm chuẩn hóa dữ liệu trả về từ API để đưa vào form chỉnh sửa.
   * @param {Object} apiUserData - Đối tượng người dùng từ API.
   * @returns {Object} - Đối tượng dữ liệu form đã chuẩn hóa.
   */
  const buildFormStateFromApi = (apiUserData = {}) => {
    const profileData = apiUserData.profile || {}
    const additionalData = profileData.additional_data || {}
    const normalizedBirthday = profileData.birthday ? profileData.birthday.split(' ')[0] : ''

    return {
      name: apiUserData.name || '',
      email: apiUserData.email || '',
      phone: apiUserData.phone || '',
      alias: apiUserData.alias || '',
      profileFullName: profileData.full_name || '',
      profileGender: profileData.gender ?? '',
      profileBirthday: normalizedBirthday,
      profileAddress: profileData.address || '',
      profileCity: profileData.city || '',
      profileState: profileData.state || '',
      profileZipcode: profileData.zipcode || '',
      profileHistory: additionalData.history || '',
      profileCover: additionalData.cover || '',
      profileAvatar: additionalData.avatar || '',
    }
  }

  /**
   * Hàm xử lý khi nhấn nút "Xem" để mở modal chỉnh sửa người dùng.
   * @param {Object} user - Đối tượng người dùng được chọn từ bảng.
   * @description
   * 1. Thiết lập trạng thái modal hiển thị để người dùng thấy spinner tải dữ liệu.
   * 2. Gọi API `usersApi.updateUser` với payload rỗng và tham số include để lấy dữ liệu chi tiết.
   * 3. Khi thành công, lưu dữ liệu vào state `selectedUser` và `formData`.
   * 4. Nếu gặp lỗi, hiển thị thông báo lỗi trong modal để quản trị viên biết.
   */
  const handleEditUser = async (user) => {
    if (!user?.id) {
      return
    }

    setDetailError('')
    setSaveSuccess('')
    setSelectedUser(user)
    setFormData({ ...defaultUserFormState })
    setEditModalVisible(true)
    setDetailLoading(true)

    try {
      const response = await usersApi.updateUser(
        user.id,
        {},
        { include: 'profile,roles,friends,usersRequested,myRequestFriend' },
      )
      const apiUser = response?.data || {}
      setSelectedUser(apiUser)
      setFormData(buildFormStateFromApi(apiUser))
    } catch (error) {
      setDetailError(error?.message || 'Không thể tải thông tin người dùng để chỉnh sửa.')
    } finally {
      setDetailLoading(false)
    }
  }

  /**
   * Hàm xử lý thay đổi giá trị trong form chỉnh sửa người dùng.
   * @param {React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>} event - Sự kiện thay đổi input.
   * @description
   * - Sử dụng tên trường (`name`) để cập nhật giá trị tương ứng trong `formData`.
   * - Đảm bảo nguyên tắc bất biến bằng cách tạo object mới từ state cũ.
   */
  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  /**
   * Hàm xử lý lưu thông tin người dùng sau khi chỉnh sửa.
   * @description
   * 1. Kiểm tra đã chọn người dùng hợp lệ chưa.
   * 2. Chuẩn bị payload theo đúng cấu trúc API yêu cầu (bao gồm profile và additional_data).
   * 3. Gọi `usersApi.updateUser` để cập nhật và lấy dữ liệu mới nhất từ backend.
   * 4. Làm mới danh sách người dùng và hiển thị thông báo thành công cho quản trị viên.
   * 5. Bắt và hiển thị lỗi nếu quá trình cập nhật thất bại.
   */
  const handleSave = async () => {
    if (!selectedUser?.id) {
      setDetailError('Không xác định được người dùng cần cập nhật.')
      return
    }

    setSaveLoading(true)
    setDetailError('')
    setSaveSuccess('')

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      alias: formData.alias,
      profile: {
        full_name: formData.profileFullName,
        gender: formData.profileGender || null,
        birthday: formData.profileBirthday || null,
        address: formData.profileAddress || null,
        city: formData.profileCity || null,
        state: formData.profileState || null,
        zipcode: formData.profileZipcode || null,
        additional_data: {
          history: formData.profileHistory || null,
          cover: formData.profileCover || null,
          avatar: formData.profileAvatar || null,
        },
      },
    }

    try {
      const response = await usersApi.updateUser(
        selectedUser.id,
        payload,
        { include: 'profile,roles,friends,usersRequested,myRequestFriend' },
      )
      const updatedUser = response?.data || payload
      setSelectedUser(updatedUser)
      setFormData(buildFormStateFromApi(updatedUser))
      await fetchUsers()
      setSaveSuccess('Cập nhật thông tin người dùng thành công.')
    } catch (error) {
      setDetailError(error?.message || 'Có lỗi xảy ra khi cập nhật thông tin người dùng.')
    } finally {
      setSaveLoading(false)
    }
  }

  /**
   * Hàm đóng modal chỉnh sửa và đưa state về mặc định.
   */
  const handleCloseEditModal = () => {
    setEditModalVisible(false)
    setDetailError('')
    setSaveSuccess('')
    setSelectedUser(null)
    setFormData({ ...defaultUserFormState })
  }

  return (
    <>
      {loading ? (
        <CSpinner color="primary" />
      ) : (
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Danh sách thành viên</strong>
            </CCardHeader>
            <CCardBody>
              <div className="d-flex justify-content-start mb-3">
                <AppHorizontalBar url={'/users/add'} />
              </div>
              
              <CTable striped hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">No.</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Họ tên</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Số điện thoại</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                    <CTableHeaderCell scope="col">&nbsp;</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {users.map((user, index) => (
                    <CTableRow key={user.id}>
                      <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                      <CTableDataCell>{user.name}</CTableDataCell>
                      <CTableDataCell>{user.phone}</CTableDataCell>
                      <CTableDataCell>{user.email}</CTableDataCell>
                      <CTableDataCell>
                        <CButton color="warning" size="sm" className='me-2' onClick={() => handleEditUser(user)}>Xem</CButton>
                        <CButton
                          color="secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setModalVisible(true);
                          }}
                        >
                          Đổi Mật Khẩu
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
        
        {/* modal sửa thông tin user */}
        <EditUserModal
          visible={editModalVisible}
          onClose={handleCloseEditModal}
          user={selectedUser}
          formData={formData}
          onInputChange={handleInputChange}
          onSave={handleSave}
          isSaving={saveLoading}
          isFetchingDetail={detailLoading}
          errorMessage={detailError}
          successMessage={saveSuccess}
        />

        {selectedUser && (
          <ChangePasswordModal
            user={selectedUser}
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
          />
        )}
        
      </CRow>
      )}
    </>
  )
}

export default Users
