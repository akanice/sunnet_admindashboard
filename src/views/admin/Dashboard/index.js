import React, { useEffect, useState } from "react";
import { CCard, CCardBody, CCardHeader, CRow, CCol, CFormSelect, CButton, CFormInput } from "@coreui/react";
import { useAuth } from "../../auth/AuthContext";

const Dashboard = () => {
    const { user } = useAuth();
  
    const handleMemberViewChange = (view) => {
      setMemberView(view);
    };

  return (
    <>
        <CRow className="mb-4">
            <CCol md={12}>
                <CCard>
                    <CCardBody>
                        <h2>Chào mừng, {user?.name || 'Administrator'}!</h2>
                        <p>Đây là trang quản trị Sunnet Admin Dashboard</p>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>

        <CRow xs={{ gutter: 4 }} className="mb-4">
            <CCol md={12}>
                abc
            </CCol>
        </CRow>

        <CRow className="mb-4">
            <CCol md={8}>
                abc
            </CCol>
            {/* Biểu đồ % tổng giao dịch máy giặt, máy sấy */}
            <CCol md={4}>
                {/* <MachineTransactionRatioChart title={'Tỷ lệ sử dụng máy (tính theo lượt)'} /> */}
            </CCol>
        </CRow>

        <CRow>

            {/* Biểu đồ số thành viên mới */}
            <CCol md={6}>
                <CCard>
                <CCardHeader>
                    Thành viên mới
                    <CButton size="sm" color="primary" className="ms-2" onClick={() => handleMemberViewChange("day")}>
                    Ngày
                    </CButton>
                    <CButton size="sm" color="secondary" className="ms-2" onClick={() => handleMemberViewChange("week")}>
                    Tuần
                    </CButton>
                    <CButton size="sm" color="success" className="ms-2" onClick={() => handleMemberViewChange("month")}>
                    Tháng
                    </CButton>
                </CCardHeader>
                <CCardBody>
                    
                </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    </>
  );
};

export default Dashboard;