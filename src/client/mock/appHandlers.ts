import { getApiPath } from '@/api/endpoint';
import { delay, http, HttpResponse } from 'msw';
import { mockAppSettingsData, mockHealthCheckData } from './appViewData';
import { currentMockUserId } from './browser';
import { mockUserData } from './studentViewData'; // やむをえず（どこに置くのがふさわしいかよくわからなかったので）studentViewDataから取得

export const appHandlers = [
  // スプレッドシート名取得 API
  http.get(getApiPath('SHEET_NAME'), async () => {
    console.info('--- mock api: speradsheet name ---');
    await delay(800);
    const data = mockUserData[currentMockUserId];
    if (!data) {
      return HttpResponse.json('データなし');
    }
    return HttpResponse.json('（スプレッドシート名）');
  }),
  // スプレッドシートURL取得 API
  http.get(getApiPath('SHEET_URL'), async () => {
    console.info('--- mock api: speradsheet url ---');
    await delay(800);
    return HttpResponse.json('https://example.com/dev-spreadsheet');
  }),

  // 設定データ取得 API
  http.get(getApiPath('SETTINGS'), async () => {
    console.info('--- mock api: settings ---');
    await delay(500);

    const data = mockAppSettingsData['1'];

    if (!data) {
      return HttpResponse.json('データなし');
    }
    return HttpResponse.json(data);
  }),

  // ヘルスチェック API
  http.get(getApiPath('HEALTH'), async () => {
    console.info('--- mock api: health check ---');
    await delay(2000);
    // const data = mockUserData[currentMockUserId];
    const data = mockHealthCheckData['1'];
    if (!data) {
      return HttpResponse.json('データなし');
    }
    return HttpResponse.json(data);
  }),
];
