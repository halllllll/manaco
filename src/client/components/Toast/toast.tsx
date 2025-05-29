import type { FC } from 'react';
import { type ToastType, useToast } from '../../context/ToastConterxt';

const getAlertClass = (type: ToastType): string => {
  switch (type) {
    case 'info':
      return 'alert-info';
    case 'success':
      return 'alert-success';
    case 'error':
      return 'alert-error';
    case 'warning':
      return 'alert-warning';
    default:
      return 'alert-info';
  }
};

export const Toast: FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return (
    // <div className="toast toast-top toast-center z-50">
    <div className="toast toast-top toast-center fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className={`alert ${getAlertClass(toast.type)} z-50`}>
          <div>
            <span>{toast.message}</span>
          </div>
          <div className="flex-none">
            <button
              type="button"
              className="btn btn-sm btn-ghost"
              onClick={() => removeToast(toast.id)}
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
