import type { LearningActivity } from '@/shared/types/activity';
import type { User } from '@/shared/types/user';
import { isGASEnvironment, serverFunctions } from '../../serverFunctions';
import { API_ENDPOINTS, getMSWPath } from '../endpoint';

export const DashboardAPI = {
  // ダッシュボードデータ取得
  getDashboard: async (): Promise<User & { activity: LearningActivity }> => {
    if (isGASEnvironment()) {
      return await serverFunctions.getDashboard();
    }

    /**
     * in dev, intercepted by MSW
     * @see src/client/mock/handlers.ts
     */
    const response = await fetch(getMSWPath(API_ENDPOINTS.DASHBOARD));
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
