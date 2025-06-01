import { delay, http, HttpResponse } from 'msw';

import type { LearningActivity } from '@/shared/types/activity';
import { API_ENDPOINTS, getMSWPath } from '../api/endpoint';
import { currentMockUserId } from './browser';

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
    await delay(1400);
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
    console.log('mockHealthCheckData');
    console.dir(data);
    if (!data) {
      return HttpResponse.json('データなし');
    }
    return HttpResponse.json(data);
  }),

  // 設定データ取得 API
  http.get(getMSWPath(API_ENDPOINTS.SETTINGS), async () => {
    console.info('--- mock api: settings ---');
    await delay(3000);

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

    // const newActivity = (await req.json()) as { id: string; name: string; date: string };
    const newActivity: LearningActivity = (await req.json()) as LearningActivity;

    return HttpResponse.json(newActivity);
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

  // // // 学習活動一覧取得 API
  // http.get('/mock/learning-activities', async () => {
  //   await delay(1000);
  //   const user = mockUsers[currentMockUserId];
  //   if (!user) {
  //     return HttpResponse.json('データなし');
  //   }

  //   return HttpResponse.json(mockActivities);
  // }),

  // // 学習活動追加 API
  // http.post('/mock/learning-activities', async ({ request }) => {
  //   const newActivity = (await request.json()) as LearningActivity;
  //   console.log('新規学習活動:', newActivity);
  //   await delay(1200);

  //   return HttpResponse.json(
  //     {
  //       success: true,
  //       message: '記録を保存しました',
  //       id: `mock-${Date.now()}`,
  //     },
  //     { status: 201 },
  //   );
  // }),
];
