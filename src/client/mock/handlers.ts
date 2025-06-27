import { delay, http, HttpResponse } from 'msw';

import { API_ENDPOINTS, getMSWPath } from '../../api/endpoint';
import { currentMockUserId } from './browser';

import type { UserActivityDTO } from '@/shared/types/dto';
import { mockAppSettingsData, mockHealthCheckData, mockUserData } from './data';

export const handlers = [
  // スプレッドシート名取得 API
  http.get(getMSWPath(API_ENDPOINTS.SHEET_NAME), async () => {
    console.info('--- mock api: speradsheet name ---');
    await delay(800);
    const data = mockUserData[currentMockUserId];
    if (!data) {
      return HttpResponse.json('データなし');
    }
    return HttpResponse.json('（スプレッドシート名）');
  }),

  // スプレッドシートURL取得 API
  http.get(getMSWPath(API_ENDPOINTS.SHEET_URL), async () => {
    console.info('--- mock api: speradsheet url ---');
    await delay(800);
    return HttpResponse.json('https://example.com/dev-spreadsheet');
  }),

  // アクセスしたときにdashboardに必要なデータをまとめて取得
  http.get(getMSWPath(API_ENDPOINTS.DASHBOARD), async () => {
    console.info('--- mock api: dashboard ---');
    await delay(1000);
    // simulate fetch error
    if (Math.random() > 0.9) {
      return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' });
    }
    const data = mockUserData[currentMockUserId];
    if (!data) {
      return new HttpResponse(null, { status: 404, statusText: 'Not Found' });
    }

    return HttpResponse.json(data);
  }),

  // ヘルスチェック API
  http.get(getMSWPath(API_ENDPOINTS.HEALTH), async () => {
    console.info('--- mock api: health check ---');
    await delay(2000);
    // const data = mockUserData[currentMockUserId];
    const data = mockHealthCheckData['1'];
    if (!data) {
      return HttpResponse.json('データなし');
    }
    return HttpResponse.json(data);
  }),

  // 設定データ取得 API
  http.get(getMSWPath(API_ENDPOINTS.SETTINGS), async () => {
    console.info('--- mock api: settings ---');
    await delay(500);

    const data = mockAppSettingsData['1'];

    if (!data) {
      return HttpResponse.json('データなし');
    }
    return HttpResponse.json(data);
  }),

  // post activity
  http.post(getMSWPath(API_ENDPOINTS.SAVE_ACTIVITY), async ({ request: req }) => {
    console.info('--- mock api: save activity ---');
    await delay(1200);

    // const newActivity: LearningActivity = (await req.json()) as LearningActivity; リクエストボディをそのまま返す
    if (Math.random() < 0.9) {
      console.info('Mock: Activity saved successfully');
      const result: UserActivityDTO = { success: true, data: null };
      return HttpResponse.json(result, { status: 201 });
    }
    console.info('Mock: Failed to save activity');
    const result: UserActivityDTO = {
      success: false,
      message: 'Mock error: Failed to save activity',
    };
    return HttpResponse.json(result, { status: 500 });
  }),

  // user
  http.get(getMSWPath(API_ENDPOINTS.USER), async () => {
    console.info('--- mock api: user ---');
    await delay(800);
    const user = mockUserData[currentMockUserId];
    if (!user) {
      return HttpResponse.json('データなし');
    }
    return HttpResponse.json(user);
  }),
];
