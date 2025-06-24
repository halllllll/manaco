/**
 * Service layer for user-related operations
 */
import { getUserById } from '@/server/repositories/userRepository';
import type { UserDTO } from '@/shared/types/dto';
import type { User } from '@/shared/types/user';

/**
 * Get the current authenticated user
 * @returns The current user or null if not found/authenticated
 */
export function getCurrentUser(): User | null {
  const activeUser = Session.getActiveUser();
  const email = activeUser.getEmail();
  const user = getUserById(email);

  if (!user) {
    console.warn(`No user found for email: ${email}`);
  }

  return user;
}

/**
 * Service function to get user data
 * @returns Data transfer object with user data
 */
export function getUserService(): UserDTO {
  try {
    const user = getCurrentUser();

    if (!user) {
      return {
        success: false,
        message: 'No user found',
      };
    }

    return {
      success: true,
      data: user,
    };
  } catch (error) {
    const err = error as Error;
    console.error(err);
    return {
      success: false,
      message: `Error: ${err.name}: ${err.message}`,
    };
  }
}
