import type { LearningActivityRequest } from '@/shared/types/activity';
import type { UserActivityDTO } from '@/shared/types/dto';
import { getApiPath } from '../endpoint';
import { isGASEnvironment, serverFunctions } from '../serverFunctions';

export const ActivityAPI = {
  postActivity: async (data: LearningActivityRequest): Promise<UserActivityDTO> => {
    if (isGASEnvironment()) {
      const ret = await serverFunctions.setActivity(data);
      return ret;
    }
    if (data === undefined) {
      throw new Error('Data is undefined');
    }
    const response = await fetch(getApiPath('SAVE_ACTIVITY'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const res = response.clone();
    return res.json();
  },
};
