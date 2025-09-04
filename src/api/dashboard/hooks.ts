import type { LearningActivity } from '@/shared/types/activity';
import type { UserWithActivities } from '@/shared/types/user';
import useSWR from 'swr';
import { API_ENDPOINTS } from '../endpoint';
import { DashboardAPI } from './dashboard';

export const useDashboard = () => {
  const { data, error, isLoading, mutate } = useSWR(
    API_ENDPOINTS.DASHBOARD,
    DashboardAPI.getDashboard,
  );

  const updateActivities = (newActivity: LearningActivity) => {
    if (!data) return;
    mutate(
      {
        ...data,
        activities: [...(data.activities || []), newActivity],
      } as UserWithActivities,
      false,
    );
  };

  return { data, updateActivities, error, isLoading, mutate };
};
