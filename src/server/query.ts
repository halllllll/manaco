import type { LearningActivity } from '@/shared/types/activity';
import type { User } from '@/shared/types/user';
import { LEARNING_ACTIVITY_SHEET_NAME, USER_SHEET_NAME, ss } from './Const';

const getUsers = (): User[] => {
  const sheet = ss.getSheetByName(USER_SHEET_NAME);
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  const values = sheet!.getDataRange().getValues();
  const body = values.slice(1);
  let users: User[] = [];
  for (const row of body) {
    const user: User = {
      id: row[0] ?? '',
      name: row[1] ?? '',
      belonging: row[2] ?? '',
    };
    users = [...users, user];
  }

  return users;
};

const getActivityLogs = (): LearningActivity[] => {
  const sheet = ss.getSheetByName(LEARNING_ACTIVITY_SHEET_NAME);
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  const values = sheet!.getDataRange().getValues();
  const body = values.slice(1);
  let activities: LearningActivity[] = [];
  for (const row of body) {
    const activity: LearningActivity = {
      activityDate: row[1] ?? '',
      userId: row[2] ?? '',
      score: row[3] ?? '',
      duration: row[4] ?? '',
      mood: row[5],
      memo: row[6],
    };
    activities = [...activities, activity];
  }

  return activities;
};

export const getUser = (userId: string): User | null => {
  const users = getUsers();
  const user = users.find((user) => user.id === userId);
  return user ?? null;
};

export const getUserActivities = (userId: string): LearningActivity[] => {
  const activities = getActivityLogs();
  const userActivities = activities.filter((activity) => activity.userId === userId);
  return userActivities;
};
