import useSWR from 'swr';
import { API_ENDPOINTS } from '../endpoint';
import { HealthAPI } from './health';

export const useHealthCheck = () => {
  const { data, error, isLoading, mutate } = useSWR(API_ENDPOINTS.HEALTH, HealthAPI.vaildate);
  return { data, error, isLoading, mutate };
};
