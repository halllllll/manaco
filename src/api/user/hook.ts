import useSWR from 'swr';
import { API_ENDPOINTS } from '../endpoint';
import { UserAPI } from './user';

export const useGetUser = () => {
  const { data, error, isLoading } = useSWR(API_ENDPOINTS.USER, UserAPI.getUserData);

  return { data, error, isLoading };
};
