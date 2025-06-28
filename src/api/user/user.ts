import type { User } from '@/shared/types/user';
import { getApiPath } from '../endpoint';

import { isGASEnvironment, serverFunctions } from '../serverFunctions';

export const UserAPI = {
  getUserData: async (): Promise<User | null> => {
    if (isGASEnvironment()) {
      const ret = await serverFunctions.getUser();
      if (ret.success) {
        return ret.data;
      }

      throw new Error(`${ret.message}${ret.details ? ` - ${ret.details}` : ''}`);
    }

    /**
     * In development, intercepted by MSW
     * @see src/client/mock/handlers.ts
     */
    const response = await fetch(getApiPath('USER'));
    return await response.json();
  },
};
