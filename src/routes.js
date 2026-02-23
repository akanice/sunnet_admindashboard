import React from 'react'

const Dashboard = React.lazy(() => import('./views/admin/Dashboard/index'))
const Users = React.lazy(() => import('./views/admin/Users'))
const UserList = React.lazy(() => import('./views/admin/Users/UserList'))
const PostList = React.lazy(() => import('./views/admin/Posts/PostList'))

// Base

const routes = [
  { path: '/dashboard', exact: true, name: 'Dashboard', element: Dashboard },
  { path: '/users', exact: true, name: 'Users', element: Users },
  { path: '/users/list', exact: true, name: 'UserList', element: UserList },
  { path: '/posts/list', exact: true, name: 'PostList', element: PostList },
  { path: '/', exact: true, name: 'Home', element: Dashboard },
]

export default routes
