import React from 'react';
import { CButton } from '@coreui/react';
import { useAuth } from '../../auth/AuthContext';

const LogoutButton = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <CButton 
      color="danger" 
      className="px-4" 
      onClick={handleLogout}
    >
      Đăng xuất
    </CButton>
  );
};

export default LogoutButton;
