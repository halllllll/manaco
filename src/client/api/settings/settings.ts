import type { AppSettings } from '@/shared/types/settings';
import { API_ENDPOINTS, getMSWPath } from '../endpoint';
import { isGASEnvironment, serverFunctions } from '../serverFunctions';

export const SettingsAPI = {
  get: async (): Promise<AppSettings> => {
    if (isGASEnvironment()) {
      const ret = await serverFunctions.getSettingsData();
      if (ret.success) {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        return ret.data!;
      }
      throw new Error(`${ret.message}${ret.details ?? ` - ${ret.details}`}`);
    }
    /**
     * in dev, intercepted by MSW
     * @see src/client/mock/handlers.ts
     */
    const response = await fetch(getMSWPath(API_ENDPOINTS.SETTINGS));
    return await response.json();
  },
};
