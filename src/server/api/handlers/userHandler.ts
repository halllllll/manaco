/**
 * API handler for user-related endpoints
 */
import { getUserService } from '@/server/services/userService';
import type { UserDTO } from '@/shared/types/dto';

/**
 * Handler for getting the current user
 * @returns User data
 */
export function getUserHandler(): UserDTO {
  return getUserService();
}
