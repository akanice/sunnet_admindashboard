import React from 'react';
import { CCard, CCardBody, CCardHeader } from '@coreui/react';
import { Line } from 'react-chartjs-2';

const DailyTransactionChart = ({ title = 'Giao dịch hàng ngày' }) => {
  const data = {
    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    datasets: [
      {
        label: 'Giao dịch',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Doanh thu (triệu)',
        data: [28, 48, 40, 19, 86, 27, 90],
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <CCard className="chart-card">
      <CCardHeader>
        {title}
      </CCardHeader>
      <CCardBody>
        <Line data={data} options={options} />
      </CCardBody>
    </CCard>
  );
};

export default DailyTransactionChart;
