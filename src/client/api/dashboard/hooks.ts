import useSWR from 'swr';
import { API_ENDPOINTS } from '../endpoint';
import { DashboardAPI } from './dashboard';

export const useDashboard = () => {
  const { data, error, isLoading, mutate } = useSWR(
    API_ENDPOINTS.DASHBOARD,
    DashboardAPI.getDashboard,
  );
  console.log('user dashboard data:', data);
  console.log(data);
  return { data, error, isLoading, mutate };
};
