import useSWR from 'swr';
import { API_ENDPOINTS } from '../endpoint';
import { SettingsAPI } from './settings';

export const useSettings = () => {
  const { data, error, isLoading, mutate } = useSWR(API_ENDPOINTS.SETTINGS, SettingsAPI.get);
  if (!isLoading) {
    console.info('出たよsetting data');
    console.log(data);
  }
  return { data, error, isLoading, mutate };
};
