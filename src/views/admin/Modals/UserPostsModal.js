/**
 * ============================================================================
 * Tệp `src/views/admin/Modals/UserPostsModal.js`
 * ----------------------------------------------------------------------------
 * Mục đích:
 *   - Modal hiển thị danh sách bài viết của một user, gọi API với search user.id.
 *   - Bảng gồm: id, media, nội dung, ngày đăng, loại (privacy), tương tác, trạng thái, bình luận, nút Xoá.
 *   - Hỗ trợ xóa bài viết và làm mới danh sách sau khi xóa.
 * ----------------------------------------------------------------------------
 * Sử dụng: Truyền visible, onClose, user (có id); modal tự gọi API khi mở.
 * ============================================================================
 */

import React, { useState, useEffect } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CSpinner,
  CAlert,
} from '@coreui/react'
import { postsApi } from '../../../services/api'

/** Giới hạn số ký tự hiển thị cho cột nội dung. */
const CONTENT_MAX_LENGTH = 55

/**
 * Rút gọn chuỗi, thêm "..." nếu dài hơn maxLength.
 * @param {string} str - Chuỗi gốc.
 * @param {number} maxLength - Số ký tự tối đa.
 * @returns {string} Chuỗi đã rút gọn.
 */
const truncateContent = (str, maxLength = CONTENT_MAX_LENGTH) => {
  if (str == null || typeof str !== 'string') return ''
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '...'
}

/**
 * Lấy chuỗi ngày đăng từ bài viết (ưu tiên created_at, published_at, date), kèm giờ:phút:giây.
 * @param {Object} post - Một object bài viết từ API.
 * @returns {string} Chuỗi ngày và giờ hiển thị (dd/mm/yyyy, hh:mm:ss).
 */
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
    second: '2-digit',
    hour12: false,
  })
}

/**
 * Lấy loại bài viết (public/private) từ post.privacy.
 * @param {Object} post - Bài viết từ API.
 * @returns {string} 'public' | 'private' | '—'
 */
const getPrivacy = (post) => {
  const p = post?.privacy
  if (p == null || p === '') return '—'
  const s = String(p).toLowerCase()
  return s === 'public' || s === 'private' ? s : String(p)
}

/**
 * Lấy chuỗi tương tác: like, love, dislike từ post.reaction_count.
 * @param {Object} post - Bài viết từ API.
 * @returns {string} Ví dụ "👍 1 ❤ 2 👎 0"
 */
const getReactionSummary = (post) => {
  const rc = post?.reaction_count
  if (!rc || typeof rc !== 'object') return '—'
  const like = rc.like ?? rc.likes ?? 0
  const love = rc.love ?? rc.loves ?? 0
  const dislike = rc.dislike ?? rc.dislikes ?? 0
  return `👍 ${like}  ❤ ${love}  👎 ${dislike}`
}

/**
 * Lấy trạng thái hiển thị từ post.status.display_name (Published, Deleted).
 * @param {Object} post - Bài viết từ API.
 * @returns {string}
 */
const getStatusDisplay = (post) => {
  const name = post?.status?.display_name
  if (name != null && name !== '') return String(name)
  return post?.status ?? '—'
}

/**
 * Đếm số bình luận trong mảng post.comments.
 * @param {Object} post - Bài viết từ API.
 * @returns {number}
 */
const getCommentCount = (post) => {
  const comments = post?.comments
  if (!Array.isArray(comments)) return 0
  return comments.length
}

/**
 * Modal danh sách bài viết của user.
 * @param {Object} props
 * @param {boolean} props.visible - Modal đang mở/đóng.
 * @param {Function} props.onClose - Hàm đóng modal.
 * @param {Object} props.user - User đang xem bài viết (cần có user.id).
 */
const UserPostsModal = ({ visible, onClose, user }) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  /** Gọi API lấy danh sách bài viết theo user.id khi modal mở và có user. */
  const fetchPosts = async () => {
    if (!user?.id) {
      setPosts([])
      return
    }
    setLoading(true)
    setError('')
    try {
      const response = await postsApi.getByUserId(user.id)
      const list = Array.isArray(response?.data)
        ? response.data
        : response?.data?.data ?? []
      setPosts(Array.isArray(list) ? list : [])
    } catch (err) {
      setError(err?.message ?? 'Không tải được danh sách bài viết.')
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (visible && user?.id) {
      fetchPosts()
    } else if (!visible) {
      setPosts([])
      setError('')
      setDeletingId(null)
    }
  }, [visible, user?.id])

  /**
   * Xóa một bài viết theo id, sau đó làm mới danh sách.
   * @param {number|string} postId - ID bài viết cần xóa.
   */
  const handleDelete = async (postId) => {
    if (!postId) return
    setDeletingId(postId)
    setError('')
    try {
      await postsApi.deletePost(postId)
      await fetchPosts()
    } catch (err) {
      setError(err?.message ?? 'Không thể xóa bài viết.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <CModal visible={visible} onClose={onClose} size="xl" scrollable>
      <CModalHeader>
        <CModalTitle>Bài viết của user {user?.name ?? user?.id ?? ''}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {error && (
          <CAlert color="danger" className="mb-3" dismissible onClose={() => setError('')}>
            {error}
          </CAlert>
        )}
        {loading ? (
          <div className="text-center py-4">
            <CSpinner color="primary" />
          </div>
        ) : (
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                <CTableHeaderCell scope="col">Media</CTableHeaderCell>
                <CTableHeaderCell scope="col">Nội dung</CTableHeaderCell>
                <CTableHeaderCell scope="col">Ngày đăng</CTableHeaderCell>
                <CTableHeaderCell scope="col">Loại</CTableHeaderCell>
                <CTableHeaderCell scope="col">Tương tác</CTableHeaderCell>
                <CTableHeaderCell scope="col">Trạng thái</CTableHeaderCell>
                <CTableHeaderCell scope="col">Bình luận</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="text-end">
                  Thao tác
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {posts.length === 0 && !loading && (
                <CTableRow>
                  <CTableDataCell colSpan={9} className="text-center text-muted">
                    Chưa có bài viết nào.
                  </CTableDataCell>
                </CTableRow>
              )}
              {posts.map((post) => (
                <CTableRow key={post.id}>
                  <CTableDataCell>{post.id}</CTableDataCell>
                  <CTableDataCell>{post.title ?? post.name ?? '—'}</CTableDataCell>
                  <CTableDataCell>{truncateContent(post.content ?? post.body ?? '', CONTENT_MAX_LENGTH)}</CTableDataCell>
                  <CTableDataCell>{getPostDate(post)}</CTableDataCell>
                  <CTableDataCell>{getPrivacy(post)}</CTableDataCell>
                  <CTableDataCell>{getReactionSummary(post)}</CTableDataCell>
                  <CTableDataCell>{getStatusDisplay(post)}</CTableDataCell>
                  <CTableDataCell>{getCommentCount(post)}</CTableDataCell>
                  <CTableDataCell className="text-end">
                    <CButton
                      color="danger"
                      size="sm"
                      disabled={deletingId === post.id}
                      onClick={() => handleDelete(post.id)}
                    >
                      {deletingId === post.id ? 'Đang xóa...' : 'Xoá'}
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Đóng
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default UserPostsModal
