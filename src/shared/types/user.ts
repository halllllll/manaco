export type UserRole = 'teacher' | 'student';

export type User = {
  id: string;
  name: string;
  belonging: string;
  role: UserRole;
};
