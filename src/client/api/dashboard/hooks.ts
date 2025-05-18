import useSWR from 'swr';
import { API_ENDPOINTS } from '../endpoint';
import { DashboardAPI } from './dashboard';

export const useDashboard = () => {
  const { data, error, isLoading } = useSWR(API_ENDPOINTS.DASHBOARD, DashboardAPI.getDashboard);
  return { data, error, isLoading };
};
