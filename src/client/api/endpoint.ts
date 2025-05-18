export const API_ENDPOINTS = {
  SHEET_NAME: 'sheet-name',
  SHEET_URL: 'sheet-url',
  DASHBOARD: 'dashboard',
  LEARNING_ACTIVITIES: 'learning-activities',
  // Add more endpoints as needed
} as const;

export type ApiEndpoint = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS];

export const getMSWPath = (endpoint: ApiEndpoint): string => `/mock/${endpoint}`;
