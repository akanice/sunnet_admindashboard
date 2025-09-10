import React from 'react'

const Dashboard = React.lazy(() => import('./views/admin/Dashboard/index'))

// Base

const routes = [
  { path: '/dashboard', exact: true, name: 'Dashboard', element: Dashboard },
  { path: '/', exact: true, name: 'Home', element: Dashboard },
]

export default routes
