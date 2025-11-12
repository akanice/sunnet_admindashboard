import { useState, useEffect, useCallback } from 'react';
import { API_STATUS } from '../constants/api';

/**
 * Custom hook để gọi API và quản lý trạng thái
 * @param {Function} apiFunction - Hàm gọi API
 * @param {Array} dependencies - Các dependencies để trigger lại API call
 * @param {boolean} immediate - Gọi API ngay khi component mount
 * @returns {Object} - Trạng thái và các hàm để quản lý API call
 */
const useApi = (apiFunction, dependencies = [], immediate = true) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(API_STATUS.LOADING);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(async (...args) => {
    try {
      setIsLoading(true);
      setStatus(API_STATUS.LOADING);
      setError(null);
      
      const response = await apiFunction(...args);
      
      setData(response);
      setStatus(API_STATUS.SUCCESS);
      return response;
    } catch (err) {
      setError(err);
      setStatus(API_STATUS.ERROR);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [...dependencies, execute, immediate]);

  return {
    data,
    error,
    status,
    isLoading,
    execute,
    isSuccess: status === API_STATUS.SUCCESS,
    isError: status === API_STATUS.ERROR,
    isIdle: status === API_STATUS.LOADING && !isLoading,
  };
};

export default useApi; 