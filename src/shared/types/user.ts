export const USER_ROLES = ['teacher', 'student'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export type User = {
  id: string;
  name: string;
  belonging: string;
  role: UserRole;
};
