import { delay, http, HttpResponse } from 'msw';

export const handlers = [
  // スプレッドシート名取得 API
  http.get('/mock/sheet-name', async () => {
    await delay(800);
    return HttpResponse.json('開発環境のスプレッドシート');
  }),

  // スプレッドシートURL取得 API
  http.get('/mock/spreadsheet-url', async () => {
    await delay(800);
    return HttpResponse.json('https://example.com/dev-spreadsheet');
  }),

  // // 学習活動一覧取得 API
  // http.get('/mock/learning-activities', async () => {
  //   await delay(1000);
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
