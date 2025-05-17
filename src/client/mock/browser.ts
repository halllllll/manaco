import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// 現在のモックユーザーコンテキスト
export let currentMockUserId = localStorage.getItem('dev-user-id') || 'dev-user-1';

// ユーザー切り替えメッセージのリスナー
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'MSW_SET_USER') {
    currentMockUserId = event.data.userId;
    console.log(`MSW: User context switched to "${currentMockUserId}"`);
  }
});

export const worker = setupWorker(...handlers);
