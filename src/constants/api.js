// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/user/login',
  REFRESH_TOKEN: '/auth/refresh-token',
  LOGOUT: '/api/user/logout',
  USER_ROLES: (userId) => `/api/roles/${userId}?include=permissions`,
  
  // Users
  USERS: '/api/users',
  USER_DETAIL: (id) => `/api/users/${id}`,
  USER_ISSUE_REPORTS: '/api/user_issue_reports',
  USER_ISSUE_REPORT_DETAIL: (id) => `/api/user_issue_reports/${id}`,

  // Settings
  SETTINGS_PRICING: '/api/settings',
};

// API Response Status
export const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  LOADING: 'loading',
};

// API Error Messages
export const API_ERROR_MESSAGES = {
  NETWORK_ERROR: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.',
  UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  FORBIDDEN: 'Bạn không có quyền truy cập vào tài nguyên này.',
  NOT_FOUND: 'Không tìm thấy tài nguyên.',
  SERVER_ERROR: 'Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau.',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.',
};

// API Request Methods
export const API_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
};

// API Request Headers
export const API_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  ACCEPT: 'Accept',
};

// API Request Content Types
export const API_CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
}; 