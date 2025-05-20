import type { DashboardDTO, SpreadsheetValidateDTO } from '@/shared/types/dto';
import type { User } from '@/shared/types/user';
import {
  LEARNING_ACTIVITY_SHEET_HEADERS,
  LEARNING_ACTIVITY_SHEET_NAME,
  SETTINGS_SHEET_HEADERS,
  SETTINGS_SHEET_NAME,
  USER_SHEET_HEADERS,
  USER_SHEET_NAME,
  ss,
} from './Const';
import { customMenu1, openDialog } from './Menu/Menu';
import { getUser, getUserActivities } from './query';
import {
  AppSettingSheetValidationTest,
  LearningLogSheetValidationTest,
  StudentSheetValidationTest,
} from './test/test';
import { SheetValidator } from './validate';

export const doGet = (): GoogleAppsScript.HTML.HtmlOutput => {
  return HtmlService.createHtmlOutputFromFile('index.html')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setTitle(getSpreadSheetName() ?? 'Vite + React on GAS');
};

const onOpen = (e: GoogleAppsScript.Events.SheetsOnOpen): void => {
  console.log(e.user);
  const menu = SpreadsheetApp.getUi().createMenu('Custom menu');
  menu.addItem('ダイアログ表示', 'openDialog_');
  menu.addItem('custom menu from html', 'customMenu1_');
  menu.addToUi();
};

const affectCountToA1 = (count: number): void => {
  const sheet = ss.getActiveSheet();
  const range = sheet.getRange('A1');
  range.setValue(count);
};

const getSpreadSheetName = (): string => {
  // return ss.getActiveSheet().getName();
  return ss.getName();
};

const getSpreadSheetUrl = (): string => {
  return ss.getUrl();
};

const getAccessUser = (): User | null => {
  const accessedUser = Session.getActiveUser();
  const email = accessedUser.getEmail();
  return getUser(email);
};

const validateAll = (): SpreadsheetValidateDTO => {
  // アプリの状態が正しく機能するかをSheetValidatorクラスで検証する
  // 各シートの名前とそれに対応する（正しくアプリが動くことを前提とした、想定としている）ヘッダの検証
  const resultValidateUserSheet = SheetValidator.getAndValidateHeaders<User[]>(USER_SHEET_NAME, [
    ...USER_SHEET_HEADERS,
  ]);
  const resultValidateActivitySheet = SheetValidator.getAndValidateHeaders(
    LEARNING_ACTIVITY_SHEET_NAME,
    [...LEARNING_ACTIVITY_SHEET_HEADERS],
  );
  const resultValidateSettingsSheet = SheetValidator.getAndValidateHeaders(SETTINGS_SHEET_NAME, [
    ...SETTINGS_SHEET_HEADERS,
  ]);
  if (
    !resultValidateUserSheet.isValid ||
    !resultValidateActivitySheet.isValid ||
    !resultValidateSettingsSheet.isValid
  ) {
    // throw new Error(
    //   `Validation failed: \n
    //   ${resultValidateUserSheet.messages.join('\n')}\n${resultValidateActivitySheet.messages.join('\n')}\n${resultValidateSettingsSheet.messages.join('\n')}`,
    // );
    return {
      success: false,
      message: `Validation failed: \n
      ${resultValidateUserSheet.messages.join('\n')}\n${resultValidateActivitySheet.messages.join(
        '\n',
      )}\n${resultValidateSettingsSheet.messages.join('\n')}`,
    };
  }
  return {
    success: true,
    data: {},
  };
};

const getDashboard = (): DashboardDTO => {
  try {
    const user = getAccessUser();
    if (!user) {
      return {
        success: false,
        message: 'ユーザーが見つかりません',
      };
    }
    const activities = getUserActivities(user.id);

    return {
      data: {
        ...user,
        activities,
      },
      success: true,
    };
  } catch (e) {
    console.error(e);
    const err = e as Error;
    return {
      success: false,
      message: `Error: ${err.name}: ${err.message}`,
    };
  }
};

// Exposed to GAS global function
global.doGet = doGet;
global.onOpen = onOpen;
global.openDialog_ = openDialog;
global.customMenu1_ = customMenu1;
global.affectCountToA1 = affectCountToA1; // フロント側から呼ばれる関数もグローバルから叩けるようにしておく
global.getSpreadSheetName = getSpreadSheetName; // 同上
global.getSpreadSheetUrl = getSpreadSheetUrl;

global.getDashboard = getDashboard; // TODO: あとで実装する

global._test_student_sheet = StudentSheetValidationTest;
global._test_learning_log_sheet = LearningLogSheetValidationTest;
global._test_app_setting_sheet = AppSettingSheetValidationTest;

// Exposed to Frontend API
export { affectCountToA1, getDashboard, getSpreadSheetName, getSpreadSheetUrl };
