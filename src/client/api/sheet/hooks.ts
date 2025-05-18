import useSWR, { preload } from 'swr';
import { API_ENDPOINTS } from '../endpoint';
import { SheetApp } from './sheet';

// Individual hooks for specific data pieces

preload(API_ENDPOINTS.SHEET_NAME, SheetApp.getSpreadsheetName);
preload(API_ENDPOINTS.SHEET_URL, SheetApp.getSheetUrl);

export const useSheetName = () => {
  const { data, error, isLoading } = useSWR<string>(
    API_ENDPOINTS.SHEET_NAME,
    SheetApp.getSpreadsheetName,
  );
  return { data, error, isLoading };
};

export const useSheetUrl = () => {
  const { data, error, isLoading } = useSWR<string>(API_ENDPOINTS.SHEET_URL, SheetApp.getSheetUrl);
  return { data, error, isLoading };
};
