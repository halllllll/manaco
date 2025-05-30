import useSWRMutation from 'swr/mutation';

import type { LearningActivity, LearningActivityRequest } from '@/shared/types/activity';
import { API_ENDPOINTS } from '../endpoint';
import { ActivityAPI } from './activity';

export const useActivityPost = () => {
  const { trigger, data, error, isMutating } = useSWRMutation(
    API_ENDPOINTS.SAVE_ACTIVITY,
    (_key: string, { arg: postData }: { arg: LearningActivity & { userId: string } }) => {
      const data: LearningActivityRequest = {
        ...postData,
      };
      ActivityAPI.postActivity(data);
    },
    {
      onError: (err) => {
        console.error('Error posting activity:', err);
      },
    },
  );

  return {
    postActivity: trigger,
    data,
    error,
    isPosting: isMutating,
  };
};
