import React, { createContext, useState, useContext, useEffect } from 'react';
import { authApi } from '../../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        
        await fetchUserData();
      } catch (error) {
        console.error('Authentication check failed:', error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthentication();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const userData = await authApi.getCurrentUser();
      
      // Kiểm tra cấu trúc dữ liệu một cách linh hoạt hơn
      const userDataObj = userData.data || userData;
      
      if (!userDataObj || !userDataObj.id) {
        console.error('User data structure:', userData);
        throw new Error('Invalid user data received');
      }
      
      const userId = userDataObj.id;
      
      // Gọi API roles với include=permissions
      const rolesResponse = await authApi.getUserRoles(userId);
      
      // Kiểm tra đầy đủ cấu trúc dữ liệu trước khi truy cập
      if (!rolesResponse || !rolesResponse.data) {
        console.error('Invalid role response structure:', rolesResponse);
        throw new Error('Invalid role data received');
      }
      
      // Lấy role name từ response một cách an toàn
      const roleName = rolesResponse.data.name;
      
      
      if (!roleName) {
        console.error('Role name not found in:', rolesResponse.data);
        throw new Error('Role name not found');
      }
      
      // Kiểm tra xem có phải administrator không
      if (roleName.toLowerCase() !== 'administrator') {
        console.warn('User is not administrator. Role:', roleName);
        // Redirect to unauthorized
        window.location.href = '/unauthorized';
        throw new Error('Unauthorized: Administrator role required');
      }
            
      // Lấy permissions
      const permissions = rolesResponse.data.permissions || [];
      
      // Tạo đối tượng user với roles và permissions
      const userWithRoles = {
        ...userDataObj,
        roles: ['administrator'],
        permissions: permissions
      };
            
      // Cập nhật state một cách đồng bộ
      setUser(userWithRoles);
      setIsAuthenticated(true);
      setError(null);
      
      return userWithRoles;
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error.message || 'Failed to fetch user data');
      handleLogout();
      throw error;
    }
  };

  const login = async (username, password) => {
    setError(null);
    try {
      if (!username || !password) {
        throw new Error('Username and password are required');
      }
      
      console.log('Attempting login for:', username);
      
      const response = await authApi.login({ 
        username, 
        password,
        device_token: '123123213212343436565656',
        platform: 'web'
      });
      
      
      if (!response) {
        throw new Error('No response from server');
      }

      // Xử lý nhiều dạng response khác nhau
      const responseData = response.data || response;
      const access_token = responseData.access_token || responseData.token;
      
      if (!access_token) {
        console.error('Token not found in response:', response);
        throw new Error('Token not found in response');
      }
      
      console.log('Token received successfully');
      
      // Lưu token trước khi gọi các API khác
      localStorage.setItem('token', access_token);
      
      try {
        // Sử dụng phương thức fetchUserData
        const userWithRoles = await fetchUserData();
        return { 
          success: true,
          user: userWithRoles
        };
      } catch (userError) {
        // Nếu lỗi là do không phải administrator, không show message lỗi vì đã redirect
        if (userError.message.includes('Unauthorized: Administrator role required')) {
          return { success: false };
        }
        throw userError;
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Đăng nhập thất bại';
      setError(errorMsg);
      return { 
        success: false, 
        error: errorMsg
      };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await authApi.logout().catch(err => console.warn('Logout API call failed:', err));
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      handleLogout();
      window.location.href = '/login';
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    fetchUserData,
    token: localStorage.getItem('token')
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};