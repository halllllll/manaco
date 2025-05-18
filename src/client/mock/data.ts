import type { LearningActivity } from '@/shared/types/activity';
import type { User } from '@shared/types/user';

// export type MockUserId = "user1@sample.com" | "user2@sample.com" | "admin@sample.com" | "alien@sample.com"

// 開発用ユーザープロファイル
export const mockUserData: Record<string, User & { activities: LearningActivity[] }> = {
  'dev-user-1': {
    id: 'user1@sample.com',
    name: '開発太郎',
    belonging: '3年1組',
    activities: [
      {
        score: 80,
        duration: 120,
        activityDate: '2025-05-15',
        userId: 'dev-user-1',
      },
      {
        score: 90,
        duration: 150,
        activityDate: '2025-05-14',
        userId: 'dev-user-1',
      },
      {
        score: 70,
        duration: 100,
        activityDate: '2025-05-10',
        userId: 'dev-user-1',
      },
    ],
  },
  'dev-user-2': {
    id: 'user2@sample.com',
    name: '初心者花子',
    belonging: '3年2組',
    activities: [
      {
        score: 60,
        duration: 90,
        activityDate: '2025-05-15',
        userId: 'dev-user-2',
      },
      {
        score: 70,
        duration: 110,
        activityDate: '2025-05-14',
        userId: 'dev-user-2',
      },
      {
        score: 50,
        duration: 80,
        activityDate: '2025-05-10',
        userId: 'dev-user-2',
      },
    ],
  },
  'dev-user-3': {
    id: 'admin@sample.com',
    name: '管理者次郎',
    belonging: '職員室',

    activities: [
      {
        score: 100,
        duration: 180,
        activityDate: '2025-05-15',
        userId: 'dev-user-3',
      },
      {
        score: 95,
        duration: 160,
        activityDate: '2025-05-14',
        userId: 'dev-user-3',
      },
      {
        score: 85,
        duration: 140,
        activityDate: '2025-05-10',
        userId: 'dev-user-3',
      },
    ],
  },
  'new-user': {
    id: 'alien@sample.com',
    name: '未登録ユーザー',
    belonging: '２ねん１くみ',
    activities: [],
  },
};
