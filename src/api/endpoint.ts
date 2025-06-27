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
  TEACHER_STUDENTS: 'teacher-students',
  TEACHER_CLASSES: 'teacher-classes',
  TEACHER_DASHBOARD: 'teacher-dashboard',
  TEACHER_STUDENT_DETAIL: 'teacher-student-detail',
  TEACHER_CURRENT: 'teacher-current',
} as const;

export type ApiEndpoint = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS];

export const getMSWPath = (endpoint: ApiEndpoint): string => `/mock/${endpoint}`;

/**
 * 教員APIのエンドポイントを生成する
 * @param endpoint APIエンドポイントの種類
 * @param params パラメータ（classフィルター、studentIdなど）
 * @returns 完全なAPIパス
 */
export const getTeacherApiPath = (
  endpoint: 'dashboard' | 'students' | 'classes' | 'current',
  params?: { class?: string; studentId?: string },
): string => {
  let path = `/api/teacher/${endpoint}`;

  if (params?.studentId && endpoint === 'students') {
    path = `${path}/${params.studentId}`;
  } else if (params?.class && params.class !== 'all') {
    path = `${path}?class=${params.class}`;
  }

  return path;
};
