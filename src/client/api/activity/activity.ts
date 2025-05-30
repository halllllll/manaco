import type { LearningActivityRequest } from '@/shared/types/activity';
import { API_ENDPOINTS, getMSWPath } from '../endpoint';

export const ActivityAPI = {
  postActivity: async (data: LearningActivityRequest) => {
    console.log('aho~~~~~~~');
    console.log(data);
    if (data === undefined) {
      throw new Error('Data is undefined');
    }
    console.log(`mock api: ${getMSWPath(API_ENDPOINTS.SAVE_ACTIVITY)}`);
    const response = await fetch(getMSWPath(API_ENDPOINTS.SAVE_ACTIVITY), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};
