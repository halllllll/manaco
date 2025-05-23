import type { LearningActivity } from '@/shared/types/activity';
import type { User } from '@/shared/types/user';
import {
  DefaultSettingsItemValue,
  LEARNING_ACTIVITY_SHEET_HEADERS,
  LEARNING_ACTIVITY_SHEET_NAME,
  SETTINGS_SHEET_HEADERS,
  SETTINGS_SHEET_NAME,
  type SettingsResult,
  type SettingsSheetItem,
  USER_SHEET_HEADERS,
  USER_SHEET_NAME,
  ss,
} from './Const';

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
      role: row[3] ?? 'student',
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

/**
 * 設定シートから設定を取得
 * MUST be called after validation
 */
export const getSettings = (sheet: GoogleAppsScript.Spreadsheet.Sheet): SettingsResult[] => {
  const settingValues = sheet.getDataRange().getValues().slice(1);

  let result: SettingsResult[] = [];

  for (const row of settingValues) {
    result = [...result, { item: row[0] as SettingsSheetItem['name'], value: row[1] }];
  }
  return result;
};

/**
 * Spreadsheetの初期化処理
 * シートが存在しない場合は作成し、ヘッダを設定する
 * すでに存在する場合は、データをクリアしてヘッダを設定する
 */

export const init = () => {
  // Check if sheets exist, create them if not
  let userSheet = ss.getSheetByName(USER_SHEET_NAME);
  let activitySheet = ss.getSheetByName(LEARNING_ACTIVITY_SHEET_NAME);
  let settingSheet = ss.getSheetByName(SETTINGS_SHEET_NAME);

  if (!userSheet) {
    // Create sheets if they don't exist
    userSheet = ss.insertSheet(USER_SHEET_NAME);
  }
  if (!activitySheet) {
    activitySheet = ss.insertSheet(LEARNING_ACTIVITY_SHEET_NAME);
  }
  if (!settingSheet) {
    settingSheet = ss.insertSheet(SETTINGS_SHEET_NAME);
  }

  // Clear existing data and formatting
  userSheet.clear();
  activitySheet.clear();
  settingSheet.clear();

  // Set headers for USER sheet
  userSheet
    .getRange(1, 1, 1, USER_SHEET_HEADERS.length)
    .setValues([[...USER_SHEET_HEADERS]])
    .setBorder(true, true, true, true, true, true, '#FF9AAA', SpreadsheetApp.BorderStyle.SOLID)
    .setBackground('#FFD1DC');
  userSheet.setColumnWidths(1, USER_SHEET_HEADERS.length, 100);

  // Set headers for ACTIVITY sheet
  activitySheet
    .getRange(1, 1, 1, LEARNING_ACTIVITY_SHEET_HEADERS.length)
    .setValues([[...LEARNING_ACTIVITY_SHEET_HEADERS]]);
  activitySheet.getRange(1, 1, 1, LEARNING_ACTIVITY_SHEET_HEADERS.length).setFontWeight('bold');
  activitySheet.setColumnWidths(1, LEARNING_ACTIVITY_SHEET_HEADERS.length, 100);

  // Set headers for SETTINGS sheet
  settingSheet
    .getRange(1, 1, 1, SETTINGS_SHEET_HEADERS.length)
    .setValues([[...SETTINGS_SHEET_HEADERS]]);
  settingSheet.getRange(1, 1, 1, SETTINGS_SHEET_HEADERS.length).setFontWeight('bold');
  settingSheet.setColumnWidths(1, SETTINGS_SHEET_HEADERS.length, 100);

  // Set the first row as frozen
  userSheet.setFrozenRows(1);
  activitySheet.setFrozenRows(1);
  settingSheet.setFrozenRows(1);

  // const defaultSettings
  const targetRange = settingSheet.getRange(2, 1, DefaultSettingsItemValue.length, 3);
  targetRange.setValues(DefaultSettingsItemValue.map((item) => [item.name, item.value, item.desc]));
};
