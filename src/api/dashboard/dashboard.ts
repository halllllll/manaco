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
     * @see src/client/mock/studentHandlers.ts
     */
    const response = await fetch(getApiPath('DASHBOARD'));
    return await response.json();
  },
};
