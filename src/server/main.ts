import type {
  DashboardDTO,
  InitAppDTO,
  SettingsDTO,
  SpreadsheetValidateDTO,
} from '@/shared/types/dto';
import type { AppSettings } from '@/shared/types/settings';
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
import { customMenu1, initAppMenu, openDialog } from './Menu/Menu';
import { getSettings, getUser, getUserActivities, init } from './query';
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
  menu.addItem('初期化', 'initAppMenu_');
  menu.addItem('ダイアログ表示', 'openDialog_');
  menu.addItem('custom menu from html', 'customMenu1_');
  menu.addToUi();
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
/**
 * アプリの状態が正しく機能するかをSheetValidatorクラスで検証する
 * 各シートの名前とそれに対応する（正しくアプリが動くことを前提とした、想定としている）ヘッダの検証
 *データ自体に関しては検証しない
 */
const validateAll = (): SpreadsheetValidateDTO => {
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
    console.error('Validation failed');
    console.error(resultValidateUserSheet);
    console.error(resultValidateActivitySheet);
    console.error(resultValidateSettingsSheet);

    throw new Error(
      `Validation failed: \n
      ${resultValidateUserSheet.messages.join('\n')}\n${resultValidateActivitySheet.messages.join('\n')}\n${resultValidateSettingsSheet.messages.join('\n')}`,
    );
  }
  return {
    success: true,
    data: null,
  };
};

const initApp = (): InitAppDTO => {
  try {
    init();
    return {
      success: true,
      data: null,
    };
  } catch (e) {
    const err = e as Error;
    console.error(err);
    return {
      success: false,
      message: `Error: ${err.name}: ${err.message}`,
    };
  }
};

const getSettingsData = (): SettingsDTO => {
  try {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const sheet = ss.getSheetByName(SETTINGS_SHEET_NAME)!;
    const data = getSettings(sheet);
    console.info('getSeetingsData');
    console.log(data);
    const settings = data.reduce((o, item) => {
      const { item: label, value } = item;
      switch (label) {
        case '点数下限':
          o.scoreMin = value as number;
          break;
        case '点数上限':
          o.scoreMax = value as number;
          break;
        case 'きもち表示':
          o.showMood = value as boolean;
          break;
        case 'メモ表示':
          o.showMemo = value as boolean;
          break;
        default:
          break;
      }
      return o;
    }, {} as AppSettings);
    console.info('getSeetingsData');
    console.log(settings);
    return {
      data: settings,
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
// メニュー関連（アプリから呼び出されないようにする
global.openDialog_ = openDialog;
global.customMenu1_ = customMenu1;
global.initAppMenu_ = initAppMenu;

global.getSpreadSheetName = getSpreadSheetName; // 同上
global.getSpreadSheetUrl = getSpreadSheetUrl;

global.getDashboard = getDashboard; // TODO: あとで実装する

global._test_student_sheet = StudentSheetValidationTest;
global._test_learning_log_sheet = LearningLogSheetValidationTest;
global._test_app_setting_sheet = AppSettingSheetValidationTest;

global.validateAll = validateAll;
global.initApp = initApp;

global.getSettingsData = getSettingsData;

// Exposed to Frontend API
export { getDashboard, getSpreadSheetName, getSpreadSheetUrl, initApp, validateAll };
