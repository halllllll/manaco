import type { LearningActivity, LearningActivityRequest } from '@/shared/types/activity';
import { USER_ROLES, type User } from '@/shared/types/user';
import {
  ACTIVITY_LIST_SHEET_HEADERS,
  ACTIVITY_LIST_SHEET_NAME,
  DefaultActivityList,
  DefaultSettingsItemValue,
  LEARNING_ACTIVITY_SHEET_HEADERS,
  LEARNING_ACTIVITY_SHEET_NAME,
  SETTINGS_SHEET_HEADERS,
  SETTINGS_SHEET_LABEL,
  SETTINGS_SHEET_NAME,
  type SettingsResult,
  type SettingsSheetItem,
  USER_SHEET_HEADERS,
  USER_SHEET_NAME,
  ss,
} from './Const';
import { assertNever, columnToA1 } from './funcs';

/**
 * 登録されている全ユーザーを取得
 * roleは安全側に倒してsturdentがデフォルト（たぶん意味ないけど）
 */
const getUsers = (): User[] => {
  const sheet = ss.getSheetByName(USER_SHEET_NAME);
  const values =
    Sheets.Spreadsheets?.Values?.get(
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      sheet!
        .getParent()
        .getId(),
      `${USER_SHEET_NAME}!A:${
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        columnToA1(sheet!.getLastColumn())
      }`,
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
    ).values ?? sheet!.getDataRange().getValues();
  const body = values.slice(1);
  let users: User[] = [];
  for (const row of body) {
    const user: User = {
      id: row[0] ?? '',
      name: row[1] ?? '',
      role: row[2] ?? 'student',
      belonging: row[3] ?? '',
    };
    users = [...users, user];
  }

  return users;
};

const getActivityLogs = (): (LearningActivity & { userId: string })[] => {
  const sheet = ss.getSheetByName(LEARNING_ACTIVITY_SHEET_NAME);
  const values =
    Sheets.Spreadsheets?.Values?.get(
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      sheet!
        .getParent()
        .getId(),
      `${LEARNING_ACTIVITY_SHEET_NAME}!A:${
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        columnToA1(sheet!.getLastColumn())
      }`,
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
    ).values ?? sheet!.getDataRange().getValues();

  const body = values.slice(1);
  let activities: (LearningActivity & { userId: string })[] = [];
  for (const row of body) {
    const activity: LearningActivity & { userId: string } = {
      userId: row[1],
      activityDate: row[2],
      score: Number.parseInt(row[3]), // rechartで表示するために明示的に数値変換（フロント側ではうまく変換できなかった）
      duration: Number.parseInt(row[4]), // rechartで表示するために明示的に数値変換
      mood: row[5],
      memo: row[6],
    };
    activities = [...activities, activity];
  }

  return activities;
};

export const getUserById = (userId: string): User | null => {
  const users = getUsers();
  const user = users.find((user) => user.id === userId);
  return user ?? null;
};

export const getUserActivities = (userId: string): LearningActivity[] => {
  const activities = getActivityLogs();
  const userActivities = activities.filter((activity) => activity.userId.trim() === userId.trim());
  return userActivities;
};

/**
 * save activity to the learning activity sheet
 */
export const saveActivity = (
  activity: LearningActivityRequest,
): { ok: boolean; message: string } => {
  // spreadsheetを排他制御するために、ロックを取得
  const lock = LockService.getScriptLock();

  // ロックを取得するまで待機
  lock.waitLock(30000); // 30秒待機
  // ロックを取得できたら、ロックを解放するまで他のスクリプトは実行できない
  try {
    const sheet = ss.getSheetByName(LEARNING_ACTIVITY_SHEET_NAME);
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    sheet!.appendRow([
      Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss'),
      activity.userId,
      activity.activityDate,
      activity.score,
      activity.duration,
      activity.mood,
      activity.memo,
    ]);
  } catch (e) {
    const err = e as Error;
    console.error('Error while saving activity:', err);

    return { ok: false, message: `${err.name}: ${err.message}` };
  } finally {
    // ロックを解放
    lock.releaseLock();
  }

  return { ok: true, message: 'Activity saved successfully' };
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
 * create new sheet
 */
function newSheet(name: string): GoogleAppsScript.Spreadsheet.Sheet {
  const targetSheet = ss.getSheetByName(name);
  if (targetSheet) {
    ss.deleteSheet(targetSheet);
  }
  return ss.insertSheet(name);
}

/**
 * Spreadsheetの初期化処理
 * シートが存在しない場合は作成し、ヘッダを設定する
 * すでに存在する場合は削除して作り直す
 * シートが無になる場合があるので一時シートを作成して凌ぐ
 */

export const init = () => {
  const _tempSheet = newSheet(Utilities.getUuid()); // 一時シート
  const userSheet = newSheet(USER_SHEET_NAME);
  userSheet.setTabColor('#FFD1DC');
  const activitySheet = newSheet(LEARNING_ACTIVITY_SHEET_NAME);
  const settingSheet = newSheet(SETTINGS_SHEET_NAME);
  const activityListSheet = newSheet(ACTIVITY_LIST_SHEET_NAME);
  ss.deleteSheet(_tempSheet);

  // Set headers for USER sheet
  userSheet
    .getRange(1, 1, 1, USER_SHEET_HEADERS.length)
    .setValues([[...USER_SHEET_HEADERS]])
    .setBorder(true, true, true, true, true, true, '#FF9AAA', SpreadsheetApp.BorderStyle.SOLID)
    .setBackground('#FFD1DC');
  userSheet.setColumnWidths(1, USER_SHEET_HEADERS.length, 100);
  // roleには入力規則
  userSheet.getRange(2, 3, userSheet.getMaxRows() - 1, 1).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList([...USER_ROLES], true)
      .build(),
  );
  // Set headers for ACTIVITY sheet
  activitySheet
    .getRange(1, 1, 1, LEARNING_ACTIVITY_SHEET_HEADERS.length)
    .setValues([[...LEARNING_ACTIVITY_SHEET_HEADERS]]);
  activitySheet.getRange(1, 1, 1, LEARNING_ACTIVITY_SHEET_HEADERS.length).setFontWeight('bold');
  activitySheet.setColumnWidths(1, LEARNING_ACTIVITY_SHEET_HEADERS.length, 100);

  // Set headers for Activity List sheet
  activityListSheet
    .getRange(1, 1, 1, ACTIVITY_LIST_SHEET_HEADERS.length)
    .setValues([[...ACTIVITY_LIST_SHEET_HEADERS]]);
  activityListSheet.getRange(1, 1, 1, ACTIVITY_LIST_SHEET_HEADERS.length).setFontWeight('bold');
  activityListSheet.setColumnWidths(1, ACTIVITY_LIST_SHEET_HEADERS.length, 100);

  // Set headers for SETTINGS sheet
  settingSheet
    .getRange(1, 1, 1, SETTINGS_SHEET_HEADERS.length)
    .setValues([[...SETTINGS_SHEET_HEADERS]]);
  settingSheet.getRange(1, 1, 1, SETTINGS_SHEET_HEADERS.length).setFontWeight('bold');
  settingSheet.setColumnWidths(1, SETTINGS_SHEET_HEADERS.length, 100);
  // * add validation rule
  for (const label of SETTINGS_SHEET_LABEL) {
    const targetRange = settingSheet.getRange(label.rowAt, 2);
    switch (label.type) {
      case 'boolean':
        targetRange.setDataValidation(
          SpreadsheetApp.newDataValidation().requireValueInList(['FALSE', 'TRUE'], true).build(),
        );
        break;
      case 'number':
        targetRange.setDataValidation(
          SpreadsheetApp.newDataValidation().requireNumberBetween(0, 1000).build(),
        );
        break;
      case 'date':
        targetRange.setDataValidation(SpreadsheetApp.newDataValidation().requireDate().build());
        break;
      default:
        assertNever(label.type);
        break;
    }
  }

  // Set the first row as frozen
  userSheet.setFrozenRows(1);
  activitySheet.setFrozenRows(1);
  settingSheet.setFrozenRows(1);
  activityListSheet.setFrozenRows(1);

  // set default setting items
  settingSheet
    .getRange(2, 1, DefaultSettingsItemValue.length, 3)
    .setValues(DefaultSettingsItemValue.map((item) => [item.name, item.value, item.desc]));

  // set default activity subject values and background color

  activityListSheet
    .getRange(2, 1, DefaultActivityList.length, 2)
    .setValues(DefaultActivityList.map((item) => [item.name, item.desc]))
    .setBackgrounds(DefaultActivityList.map((item) => [item.color, '#fff']));
};
