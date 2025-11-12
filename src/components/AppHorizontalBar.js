import React from 'react'
import { CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'
import { Link } from 'react-router-dom'

const AppHorizontalBar = ({ url }) => {
  return (
    <div>
      <Link to={`${url}`}><CButton color="primary" size="sm"><CIcon icon={cilPlus} size="sm"/> Thêm mới</CButton></Link>
    </div>
  )
}

export default React.memo(AppHorizontalBar)
