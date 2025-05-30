export const API_ENDPOINTS = {
  USER: 'user',
  SHEET_NAME: 'sheet-name',
  SHEET_URL: 'sheet-url',
  DASHBOARD: 'dashboard',
  LEARNING_ACTIVITIES: 'learning-activities',
  HEALTH: 'health',
  SETTINGS: 'settings',
  SAVE_ACTIVITY: 'save-activity',
} as const;

export type ApiEndpoint = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS];

export const getMSWPath = (endpoint: ApiEndpoint): string => `/mock/${endpoint}`;
