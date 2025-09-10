import axiosInstance from '../config/axiosConfig';
import { API_ENDPOINTS, API_ERROR_MESSAGES } from '../constants/api';

// Auth API
export const authApi = {
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, {
        ...credentials,
        device_token: '12312321321234343656565',
        platform: 'web'
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  logout: async () => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.LOGOUT);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  refreshToken: async (refreshToken) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.REFRESH_TOKEN, { refreshToken });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get('/api/user');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getUserRoles: async (userId) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.USER_ROLES(userId));
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

// Users API
export const usersApi = {
  getAll: async (params = {}) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.USERS, { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  updateUser: async (id, params = {}) => {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.USER_DETAIL(id), { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  updateUserReport: async (id, params = {}) => {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.USER_ISSUE_REPORT_DETAIL(id), {}, { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Error handler
const handleApiError = (error) => {
  if (error.response) {
    // Server trả về response với status code nằm ngoài range 2xx
    const status = error.response.status;
    const message = error.response.data?.message || API_ERROR_MESSAGES.SERVER_ERROR;

    switch (status) {
      case 400:
        return new Error(API_ERROR_MESSAGES.VALIDATION_ERROR);
      case 401:
        return new Error(API_ERROR_MESSAGES.UNAUTHORIZED);
      case 403:
        return new Error(API_ERROR_MESSAGES.FORBIDDEN);
      case 404:
        return new Error(API_ERROR_MESSAGES.NOT_FOUND);
      case 500:
        return new Error(API_ERROR_MESSAGES.SERVER_ERROR);
      default:
        return new Error(message);
    }
  } else if (error.request) {
    // Request được gửi nhưng không nhận được response
    return new Error(API_ERROR_MESSAGES.NETWORK_ERROR);
  } else {
    // Có lỗi khi setting up request
    return new Error(error.message);
  }
}; 