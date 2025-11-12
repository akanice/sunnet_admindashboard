import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CCard, CCardBody, CCardHeader, CRow, CCol, CButton, CSpinner } from "@coreui/react";

const UserDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API call
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return <CSpinner color="primary" />;
  }

  if (!user) {
    return <p>User not found.</p>;
  }

  return (
    <CRow>
      <CCol lg={8} className="mx-auto">
        <CCard>
          <CCardHeader>
            <h5>Thông tin chi tiết của {user.name}</h5>
          </CCardHeader>
          <CCardBody>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Website:</strong> {user.website}</p>
            <p><strong>Company:</strong> {user.company?.name}</p>
            <CButton color="primary" href="/users">
              Quay lại danh sách
            </CButton>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default UserDetail;