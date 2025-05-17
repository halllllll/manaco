import type { LearningActivity } from '@/shared/types/activity';
import type { User } from '@/shared/types/user';
import { isGASEnvironment, serverFunctions } from '../serverFunctions';

export const DashboardAPI = {
  // ダッシュボードデータ取得
  getDashboard: async (): Promise<User & { activity: LearningActivity }> => {
    if (isGASEnvironment()) {
      return await serverFunctions.getDashboard();
    }

    // DEV環境: モックデータ
    const response = await fetch('/mock/dashboard');
    return await response.json();
  },

  // // 活動記録
  // recordActivity: async (activity) => {
  //   if (isGASEnvironment()) {
  //     return await serverFunctions.recordActivity(activity);
  //   }

  //   // DEV環境: モックデータ
  //   const response = await fetch('/mock/activities', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(activity),
  //   });
  //   return await response.json();
  // },
};
