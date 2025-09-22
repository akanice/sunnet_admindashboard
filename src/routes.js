import React from 'react'

const Dashboard = React.lazy(() => import('./views/admin/Dashboard/index'))
const Users = React.lazy(() => import('./views/admin/Users'))

// Base

const routes = [
  { path: '/dashboard', exact: true, name: 'Dashboard', element: Dashboard },
  { path: '/users', exact: true, name: 'Users', element: Users },
  { path: '/', exact: true, name: 'Home', element: Dashboard },
]

export default routes
