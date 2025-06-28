import type { ValidationResult } from '@/server/utils/validation';
import { getApiPath } from '../endpoint';
import { isGASEnvironment, serverFunctions } from '../serverFunctions';

export const HealthAPI = {
  vaildate: async (): Promise<ValidationResult> => {
    if (isGASEnvironment()) {
      const ret = await serverFunctions.validateAll();
      if (ret.success) {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        return ret.data!;
      }
      throw new Error(`${ret.message}: ${ret.details ?? ` - ${ret.details}`}`);
    }
    /**
     * in dev, intercepted by MSW
     * @see src/client/mock/handlers.ts
     */
    const response = await fetch(getApiPath('HEALTH'));
    return await response.json();
  },
};
