import axios from 'axios';

// Xác định môi trường
const isDevelopment = import.meta.env.VITE_APP_ENV === 'development';
const showErrorLog = 'false';
const baseURL = import.meta.env.VITE_APP_API_URL;

// Instance axios
const axiosInstance = axios.create({
  baseURL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Token from localStorage
const getLocalAccessToken = () => localStorage.getItem('token');
const getLocalRefreshToken = () => localStorage.getItem('refreshToken');

// Hàm lưu token mới
const setLocalAccessToken = (token) => localStorage.setItem('token', token);

// Logging interceptor
if (isDevelopment && showErrorLog === true) {
  axiosInstance.interceptors.request.use(
    (config) => {
      console.log('🚀 Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        headers: config.headers,
      });
      return config;
    },
    (error) => {
      console.error('❌ Request Error:', error);
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      console.log('✅ Response:', {
        status: response.status,
        data: response.data,
      });
      return response;
    },
    (error) => {
      console.error('❌ Response Error:', {
        status: error.response?.status,
        data: error.response?.data,
      });
      return Promise.reject(error);
    }
  );
}

// Thêm Authorization header cho mỗi request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getLocalAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor để xử lý khi token hết hạn
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Kiểm tra nếu lỗi là 401 và chưa từng retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Request for new access token
        const refreshToken = getLocalRefreshToken();
        const response = await axios.post(`${baseURL}/auth/refresh-token`, {
          refreshToken,
        });

        const newAccessToken = response.data.accessToken;
        setLocalAccessToken(newAccessToken);

        // Update token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        // Redirect when token expires
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Request cancellation
export const createCancelToken = () => {
  const source = axios.CancelToken.source();
  return source;
};

export default axiosInstance;
