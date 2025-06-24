/**
 * Service layer for dashboard operations
 */
import { getActivitiesByUserId } from '@/server/repositories/activityRepository';
import type { DashboardDTO } from '@/shared/types/dto';
import { getCurrentUser } from './userService';

/**
 * Service function to get dashboard data for the current user
 * @returns Dashboard data for the current user
 */
export function getDashboardService(): DashboardDTO {
  try {
    const user = getCurrentUser();

    if (!user) {
      console.info('getDashboard: No user found');
      return {
        success: true,
        data: null,
      };
    }

    console.info(
      `getDashboard for user: ${user.id} (${user.name}) - ${user.belonging} : ${user.role}`,
    );

    const activities = getActivitiesByUserId(user.id);

    return {
      data: {
        ...user,
        activities,
      },
      success: true,
    };
  } catch (error) {
    console.error(error);
    const err = error as Error;
    return {
      success: false,
      message: `Error: ${err.name}: ${err.message}`,
    };
  }
}
