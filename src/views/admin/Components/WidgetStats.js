import React from 'react';
import { CCard, CCardBody, CCardHeader, CRow, CCol } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPeople, cilChartLine, cilMoney, cilUserPlus } from '@coreui/icons';

const WidgetStats = () => {
  const stats = [
    {
      title: 'Tổng thành viên',
      value: '1,234',
      icon: cilPeople,
      color: 'primary',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Giao dịch hôm nay',
      value: '89',
      icon: cilChartLine,
      color: 'success',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Doanh thu tháng',
      value: '₫45,678,000',
      icon: cilMoney,
      color: 'warning',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Thành viên mới',
      value: '23',
      icon: cilUserPlus,
      color: 'info',
      change: '+15%',
      changeType: 'positive'
    }
  ];

  return (
    <CRow>
      {stats.map((stat, index) => (
        <CCol sm={6} lg={3} key={index}>
          <CCard className="stats-card mb-4">
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-0">{stat.value}</h4>
                  <p className="text-muted mb-0">{stat.title}</p>
                  <small className={`text-${stat.changeType === 'positive' ? 'success' : 'danger'}`}>
                    {stat.change} so với tháng trước
                  </small>
                </div>
                <div className={`stats-icon bg-${stat.color} bg-opacity-10`}>
                  <CIcon icon={stat.icon} size="xl" className={`text-${stat.color}`} />
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      ))}
    </CRow>
  );
};

export default WidgetStats;
