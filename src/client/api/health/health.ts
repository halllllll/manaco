import { API_ENDPOINTS, getMSWPath } from '../endpoint';
import { isGASEnvironment, serverFunctions } from '../serverFunctions';

export const HealthAPI = {
  vaildate: async () => {
    if (isGASEnvironment()) {
      const ret = await serverFunctions.validateAll();
      if (ret.success) {
        return ret.data;
      }
      throw new Error(`${ret.message}${ret.details ?? ` - ${ret.details}`}`);
    }
    /**
     * in dev, intercepted by MSW
     * @see src/client/mock/handlers.ts
     */
    const response = await fetch(getMSWPath(API_ENDPOINTS.HEALTH));
    return await response.json();
  },
};
