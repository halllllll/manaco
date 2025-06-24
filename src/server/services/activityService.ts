/**
 * Service layer for learning activity operations
 */
import { saveActivity } from '@/server/repositories/activityRepository';
import type { LearningActivityRequest } from '@/shared/types/activity';
import type { UserActivityDTO } from '@/shared/types/dto';

/**
 * Service function to save a learning activity
 * @param activity Activity data to save
 * @returns Result of the operation
 */
export function saveActivityService(activity: LearningActivityRequest): UserActivityDTO {
  console.info(`setActivity called with: ${JSON.stringify(activity)}`);

  const result = saveActivity(activity);

  if (!result.ok) {
    console.error(`Failed to save activity: ${result.message}`);
    return {
      success: false,
      message: `Error: ${result.message}`,
    };
  }

  return {
    success: true,
    data: null,
  };
}
