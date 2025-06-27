import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
import { teacherHandlers } from './teacherHandlers';

// 現在のモックユーザーコンテキスト
export let currentMockUserId = localStorage.getItem('dev-user-id') || 'dev-user-1';
// 現在の選択中の教員ID
export let currentTeacherId = localStorage.getItem('dev-teacher-id') || 'teacher-1';
// 現在のクラスフィルター
export let currentClassFilter = localStorage.getItem('dev-class-filter') || 'all';

// ユーザー切り替えメッセージのリスナー
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'MSW_SET_STUDENT') {
    currentMockUserId = event.data.userId;
    console.log(`MSW: User context switched to "${currentMockUserId}"`);
  } else if (event.data && event.data.type === 'MSW_SET_TEACHER') {
    currentTeacherId = event.data.teacherId;
    currentClassFilter = event.data.classFilter || 'all';
    console.log(
      `MSW: Teacher context switched to "${currentTeacherId}", Class filter: ${currentClassFilter}`,
    );
  }
});

// 全てのハンドラーを統合
const allHandlers = [...handlers, ...teacherHandlers];

export const worker = setupWorker(...allHandlers);
