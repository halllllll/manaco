/**
 * API handler for activity-related endpoints
 */
import { saveActivityService } from '@/server/services/activityService';
import type { LearningActivityRequest } from '@/shared/types/activity';
import type { UserActivityDTO } from '@/shared/types/dto';

/**
 * Handler for saving a new activity
 * @param data Activity data to save
 * @returns Result of the operation
 */
export function saveActivityHandler(data: LearningActivityRequest): UserActivityDTO {
  return saveActivityService(data);
}
