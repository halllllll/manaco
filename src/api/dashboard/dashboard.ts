import type { UserWithActivities } from '@/shared/types/user';
import { getApiPath } from '../endpoint';
import { isGASEnvironment, serverFunctions } from '../serverFunctions';

export const DashboardAPI = {
  // ダッシュボードデータ取得
  getDashboard: async (): Promise<UserWithActivities | null> => {
    if (isGASEnvironment()) {
      const ret = await serverFunctions.getDashboard();
      if (ret.success) {
        return ret.data;
      }
      throw new Error(`${ret.message}${ret.details ?? ` - ${ret.details}`}`);
    }

    /**
     * in dev, intercepted by MSW
     * @see src/client/mock/handlers.ts
     */
    const response = await fetch(getApiPath('DASHBOARD'));
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
