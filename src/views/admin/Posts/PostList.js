import React, { useState, useEffect, useCallback } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CSpinner,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert,
} from '@coreui/react'
import useApi from '../../../hooks/useApi'
import { postsApi } from '../../../services/api'
import Pagination from '../../components/Pagination'

const CONTENT_MAX_LENGTH = 50

const truncateContent = (str, maxLength = CONTENT_MAX_LENGTH) => {
  if (str == null || typeof str !== 'string') return ''
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '...'
}

const getPostDate = (post) => {
  const raw = post?.created_at ?? post?.published_at ?? post?.date ?? post?.createdAt
  if (!raw) return '—'
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return String(raw)
  return d.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

const getUserName = (post) => {
  const user = post?.user
  if (!user) return '—'
  return user.name ?? user.profile?.full_name ?? user.email ?? '—'
}

const getUserPhone = (post) => {
  const user = post?.user
  if (!user) return '—'
  return user.phone ?? '—'
}

const PostList = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [filterUser, setFilterUser] = useState('')
  const [filterPhone, setFilterPhone] = useState('')
  const [filterContent, setFilterContent] = useState('')
  const [commentPost, setCommentPost] = useState(null)
  const [deleteLoadingId, setDeleteLoadingId] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })

  const buildParams = useCallback(() => {
    const params = {
      page: currentPage,
      limit: 10, // api này bị khoá limit=10
      orderBy: 'created_at',
      sortedBy: 'desc',
      include: 'user',
    }
    if (filterUser?.trim()) params.searchUser = filterUser.trim()
    if (filterPhone?.trim()) params.searchPhone = filterPhone.trim()
    if (filterContent?.trim()) params.search = filterContent.trim()
    if (filterContent?.trim()) params.searchFields = 'content:like'
    return params
  }, [currentPage, filterUser, filterPhone, filterContent])

  // Hàm gọi API phải được useCallback để tham chiếu ổn định, tránh useApi + useEffect gọi API liên tục.
  const apiFunction = useCallback(() => postsApi.getAll(buildParams()), [buildParams])

  const {
    data: postsData,
    execute: fetchPosts,
    isLoading,
  } = useApi(apiFunction, [apiFunction], false)

  // Chỉ gọi lại khi apiFunction thay đổi (khi đổi page hoặc bộ lọc), không gọi mỗi lần render.
  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const posts = postsData?.data ?? []
  const pagination = postsData?.meta?.pagination ?? {}
  const totalPages = pagination?.total_pages ?? 1
  const totalItems = pagination?.total ?? posts.length

  const handleSearch = () => {
    setCurrentPage(1)
    fetchPosts()
  }

  const handleDelete = async (post) => {
    if (!post?.id) return
    const confirmed = window.confirm('Bạn có chắc muốn xóa bài đăng này?')
    if (!confirmed) return
    setDeleteLoadingId(post.id)
    setMessage({ type: '', text: '' })
    try {
      await postsApi.deletePost(post.id)
      setMessage({ type: 'success', text: 'Đã xóa bài đăng.' })
      await fetchPosts()
    } catch (err) {
      setMessage({ type: 'danger', text: err?.message ?? 'Không thể xóa bài đăng.' })
    } finally {
      setDeleteLoadingId(null)
    }
  }

  const openCommentModal = (post) => setCommentPost(post)
  const closeCommentModal = () => setCommentPost(null)

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Danh sách post</strong>
          </CCardHeader>
          <CCardBody>
            {/* Bộ lọc: user, phone, content */}
            <CRow className="mb-3 g-2">
              <CCol md={3}>
                <CInputGroup>
                  <CInputGroupText>User</CInputGroupText>
                  <CFormInput
                    placeholder="Tìm theo user..."
                    value={filterUser}
                    onChange={(e) => setFilterUser(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </CInputGroup>
              </CCol>
              <CCol md={3}>
                <CInputGroup>
                  <CInputGroupText>Phone</CInputGroupText>
                  <CFormInput
                    placeholder="Tìm theo SĐT..."
                    value={filterPhone}
                    onChange={(e) => setFilterPhone(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </CInputGroup>
              </CCol>
              <CCol md={3}>
                <CInputGroup>
                  <CInputGroupText>Nội dung</CInputGroupText>
                  <CFormInput
                    placeholder="Tìm theo nội dung..."
                    value={filterContent}
                    onChange={(e) => setFilterContent(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </CInputGroup>
              </CCol>
              <CCol md={3}>
                <CButton color="primary" onClick={handleSearch}>
                  Tìm kiếm
                </CButton>
              </CCol>
            </CRow>

            {message.text && (
              <CAlert color={message.type} className="mb-3" dismissible onClose={() => setMessage({ type: '', text: '' })}>
                {message.text}
              </CAlert>
            )}

            {isLoading ? (
              <div className="text-center py-4">
                <CSpinner color="primary" />
              </div>
            ) : (
              <>
                <CTable striped hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">No.</CTableHeaderCell>
                      <CTableHeaderCell scope="col">User</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Phone</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Nội dung</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Ngày đăng</CTableHeaderCell>
                      <CTableHeaderCell scope="col" className="text-end">Thao tác</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {posts.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan={6} className="text-center text-muted">
                          Chưa có bài đăng nào.
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      posts.map((post, index) => (
                        <CTableRow key={post.id}>
                          <CTableHeaderCell scope="row">{(currentPage - 1) * 10 + index + 1}</CTableHeaderCell>
                          <CTableDataCell>{getUserName(post)}</CTableDataCell>
                          <CTableDataCell>{getUserPhone(post)}</CTableDataCell>
                          <CTableDataCell title={post?.content ?? ''}>{truncateContent(post?.content)}</CTableDataCell>
                          <CTableDataCell>{getPostDate(post)}</CTableDataCell>
                          <CTableDataCell className="text-end">
                            <CButton
                              color="info"
                              size="sm"
                              className="me-2"
                              onClick={() => openCommentModal(post)}
                            >
                              Bình luận
                            </CButton>
                            <CButton
                              color="danger"
                              size="sm"
                              disabled={deleteLoadingId === post.id}
                              onClick={() => handleDelete(post)}
                            >
                              {deleteLoadingId === post.id ? <CSpinner size="sm" /> : 'Xoá'}
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    )}
                  </CTableBody>
                </CTable>
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  length={posts.length}
                  totalItems={totalItems}
                />
              </>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      {/* Modal Bình luận (placeholder – có thể gắn API comment sau) */}
      <CModal alignment="center" visible={!!commentPost} onClose={closeCommentModal}>
        <CModalHeader>
          <CModalTitle>Bình luận - Bài đăng #{commentPost?.id}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {commentPost && (
            <>
              <p className="text-muted small mb-2">Nội dung: {truncateContent(commentPost.content, 200)}</p>
              <p className="mb-0">Chức năng danh sách bình luận có thể gắn API comment tại đây.</p>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={closeCommentModal}>Đóng</CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default PostList
