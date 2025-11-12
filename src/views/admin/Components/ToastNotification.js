import { CToast, CToastBody, CToastHeader, CToaster } from '@coreui/react';
import { useState, createContext, useContext } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    setToasts([...toasts, { id: Date.now(), message, type }]);
    setTimeout(() => {
      setToasts((toasts) => toasts.slice(1));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <CToaster position="top-end">
        {toasts.map((toast) => (
          <CToast key={toast.id} color={toast.type === 'success' ? 'success' : 'danger'}>
            <CToastHeader closeButton>{toast.type === 'success' ? 'Thành công' : 'Lỗi'}</CToastHeader>
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        ))}
      </CToaster>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
