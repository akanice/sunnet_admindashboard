/**
 * Format số tiền theo định dạng tiền tệ Việt Nam
 * @param {number} amount - Số tiền cần format
 * @param {boolean} showSymbol - Hiển thị ký hiệu tiền tệ
 * @returns {string} - Số tiền đã được format
 */
export const formatCurrency = (amount, showSymbol = true) => {
  if (amount === null || amount === undefined) return '0';
  
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  return formatter.format(amount);
};

/**
 * Format ngày giờ theo định dạng Việt Nam
 * @param {string|Date} date - Ngày giờ cần format
 * @param {string} format - Định dạng hiển thị (date, time, datetime)
 * @returns {string} - Ngày giờ đã được format
 */
export const formatDateTime = (date, format = 'datetime') => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '';
  
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  const seconds = dateObj.getSeconds().toString().padStart(2, '0');
  
  switch (format) {
    case 'date':
      return `${day}/${month}/${year}`;
    case 'time':
      return `${hours}:${minutes}:${seconds}`;
    case 'datetime':
    default:
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
};

/**
 * Tạo URL với các tham số query
 * @param {string} baseUrl - URL cơ sở
 * @param {object} params - Các tham số query
 * @returns {string} - URL đã được tạo
 */
export const buildUrl = (baseUrl, params = {}) => {
  const url = new URL(baseUrl, window.location.origin);
  
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
      url.searchParams.append(key, params[key]);
    }
  });
  
  return url.toString();
};

/**
 * Kiểm tra xem một đối tượng có phải là rỗng không
 * @param {object} obj - Đối tượng cần kiểm tra
 * @returns {boolean} - true nếu đối tượng rỗng
 */
export const isEmptyObject = (obj) => {
  return obj && Object.keys(obj).length === 0;
};

/**
 * Lấy giá trị từ một đối tượng theo đường dẫn
 * @param {object} obj - Đối tượng cần lấy giá trị
 * @param {string} path - Đường dẫn đến giá trị (ví dụ: 'user.profile.name')
 * @param {any} defaultValue - Giá trị mặc định nếu không tìm thấy
 * @returns {any} - Giá trị tìm thấy hoặc giá trị mặc định
 */
export const getNestedValue = (obj, path, defaultValue = null) => {
  if (!obj || !path) return defaultValue;
  
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === null || result === undefined) return defaultValue;
    result = result[key];
  }
  
  return result === undefined ? defaultValue : result;
};

/**
 * Tạo một bản sao sâu của một đối tượng
 * @param {any} obj - Đối tượng cần sao chép
 * @returns {any} - Bản sao của đối tượng
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  
  if (obj instanceof Date) return new Date(obj.getTime());
  
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  
  if (obj instanceof Object) {
    const copy = {};
    Object.keys(obj).forEach(key => {
      copy[key] = deepClone(obj[key]);
    });
    return copy;
  }
  
  return obj;
};

/**
 * Tạo một ID ngẫu nhiên
 * @param {number} length - Độ dài của ID
 * @returns {string} - ID ngẫu nhiên
 */
export const generateRandomId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

/**
 * Kiểm tra xem một chuỗi có phải là email hợp lệ không
 * @param {string} email - Email cần kiểm tra
 * @returns {boolean} - true nếu email hợp lệ
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Kiểm tra xem một chuỗi có phải là số điện thoại hợp lệ không
 * @param {string} phone - Số điện thoại cần kiểm tra
 * @returns {boolean} - true nếu số điện thoại hợp lệ
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone);
};

/**
 * Cắt một chuỗi nếu quá dài
 * @param {string} str - Chuỗi cần cắt
 * @param {number} maxLength - Độ dài tối đa
 * @param {string} suffix - Hậu tố thêm vào sau khi cắt
 * @returns {string} - Chuỗi đã được cắt
 */
export const truncateString = (str, maxLength = 50, suffix = '...') => {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength) + suffix;
}; 

// Hàm xác định màu badge dựa trên trạng thái
export const getStatusBadgeColorOrder = (status) => {
  if (!status) return "secondary";
  
  switch (status) {
    case "Paid":
      return "success";
    case "Đang xử lý":
      return "warning";
    case "Thất bại":
      return "danger";
    default:
      return "secondary";
  }
};
