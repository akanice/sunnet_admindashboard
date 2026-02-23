import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilNotes,
  cilPencil,
  cilUser,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Bảng điều khiển',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} className="nav-icon" />,
    badge: {
      color: 'info',
      // text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'Quản lý',
  },
  {
    component: CNavGroup,
    name: 'Thành viên',
    to: '/users',
    icon: <CIcon icon={cilUser} className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Quản trị viên',
        to: '/users',
      },
      {
        component: CNavItem,
        name: 'Danh sách user',
        to: '/users/list',
      },
      {
        component: CNavItem,
        name: 'Phân quyền & Vai trò',
        to: '/users/roles',
      },
      {
        component: CNavItem,
        name: 'Hoạt động gần đây',
        to: '/users/activities',
      },
    ]
  },
  {
    component: CNavGroup,
    name: 'Bài đăng/Post',
    to: '/posts',
    icon: <CIcon icon={cilDescription} className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Danh sách post',
        to: '/posts/list',
      },
    ]
  },
]

export default _nav
