import React from "react";
import { CButton } from "@coreui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../auth/AuthContext'

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login"); // Chuyển về trang đăng nhập
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  return (
    <CButton color="secondary" onClick={handleLogout}>
      Đăng Xuất
    </CButton>
  );
};

export default LogoutButton;