export const API_ENDPOINTS = {
  USER: 'user',
  SHEET_NAME: 'sheet-name',
  SHEET_URL: 'sheet-url',
  DASHBOARD: 'dashboard',
  LEARNING_ACTIVITIES: 'learning-activities',
  HEALTH: 'health',
  SETTINGS: 'settings',
  SAVE_ACTIVITY: 'save-activity',
  // 教員ビュー用エンドポイント
  TEACHER_CURRENT: 'teacher-current',
  TEACHER_STUDENTS: 'teacher-students',
  TEACHER_CLASSES: 'teacher-classes',
  TEACHER_DASHBOARD: 'teacher-dashboard',
  TEACHER_STUDENT_DETAIL: 'teacher-student-detail',
} as const;

export type ApiEndpoint = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS];

export const getMSWPath = (endpoint: ApiEndpoint): string => `/mock/${endpoint}`;
