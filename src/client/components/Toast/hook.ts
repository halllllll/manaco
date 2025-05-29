import { useToast } from '@/client/context/ToastConterxt';

export const useToastHelper = () => {
  const { addToast } = useToast();

  return {
    showInfo: (message: string, duration?: number) => addToast('info', message, duration),
    showSuccess: (message: string, duration?: number) => addToast('success', message, duration),
    showError: (message: string, duration?: number) => addToast('error', message, duration),
    showWarning: (message: string, duration?: number) => addToast('warning', message, duration),
  };
};
