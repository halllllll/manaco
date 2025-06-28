export const API_ENDPOINTS = {
  // Student endpoints
  USER: '/mock/user',
  SHEET_NAME: '/mock/sheet-name',
  SHEET_URL: '/mock/sheet-url',
  DASHBOARD: '/mock/dashboard',
  LEARNING_ACTIVITIES: '/mock/learning-activities',
  HEALTH: '/mock/health',
  SETTINGS: '/mock/settings',
  SAVE_ACTIVITY: '/mock/save-activity',

  // Teacher endpoints
  TEACHER_CURRENT: '/mock/teacher/current',
  TEACHER_DASHBOARD: '/mock/teacher/dashboard',
  TEACHER_STUDENTS: '/mock/teacher/students',
  TEACHER_CLASSES: '/mock/teacher/classes',
} as const;

export type ApiEndpointKey = keyof typeof API_ENDPOINTS;

/**
 * APIのエンドポイントURLを生成する
 * @param endpointKey APIエンドポイントのキー
 * @param params パラメータ（studentId, classなど）
 * @returns 完全なAPIパス
 */
export const getApiPath = (
  endpointKey: ApiEndpointKey,
  params?: { studentId?: string; class?: string },
): string => {
  const path = API_ENDPOINTS[endpointKey];

  // クエリパラメータを追加
  if (params?.class && params.class !== 'all') {
    const url = new URL(path, 'http://localhost');
    url.searchParams.set('class', params.class);
    return `${url.pathname}${url.search}`;
  }

  return path;
};
