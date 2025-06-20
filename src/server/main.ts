import type {
  DashboardDTO,
  InitAppDTO,
  SettingsDTO,
  SpreadsheetValidateDTO,
  UserActivityDTO,
  UserDTO,
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
import { initAppMenu } from './Menu/Menu';

import type { LearningActivityRequest } from '@/shared/types/activity';
import { getSettings, getUserActivities, getUserById, init, saveActivity } from './query';

import { assertNever } from './funcs';
import {
  AppSettingSheetValidationTest,
  LearningLogSheetValidationTest,
  StudentSheetValidationTest,
} from './test/test';
import { SheetValidator } from './validate';

export const doGet = (): GoogleAppsScript.HTML.HtmlOutput => {
  console.log('validation check');
  const validateReuslt = validateAll();
  const user = getAccessUser();
  if (!validateReuslt.success) {
    return HtmlService.createHtmlOutputFromFile('panic.html');
  }
  if (user?.role !== 'teacher') {
    return HtmlService.createHtmlOutputFromFile('index.html')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setTitle(getSpreadSheetName() ?? 'manaco');
  }
  return HtmlService.createHtmlOutputFromFile('teacher.html')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setTitle(getSpreadSheetName() ?? 'manaco');
};

const onOpen = (e: GoogleAppsScript.Events.SheetsOnOpen): void => {
  console.log(e.user);
  const menu = SpreadsheetApp.getUi().createMenu('Custom menu');
  menu.addItem('初期化', 'initAppMenu_');
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
  const user = getUserById(email);
  if (!user) {
    console.warn(`No user found for email: ${email}`);
  }
  return user;
};

// 外部から読んで使う用
const getUser = (): UserDTO => {
  try {
    const user = getAccessUser();
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
  } catch (e) {
    console.error(e);
    const err = e as Error;
    return {
      success: false,
      message: `Error: ${err.name}: ${err.message}`,
    };
  }
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
    console.error(
      `Validation failed:\nuser sheet: ${resultValidateUserSheet}:\nactivity sheet: ${resultValidateActivitySheet}\nsetting sheet: ${resultValidateSettingsSheet}`,
    );

    return {
      success: false,
      message: 'Validation failed',
      details: [
        ...resultValidateUserSheet.messages,
        ...resultValidateActivitySheet.messages,
        ...resultValidateSettingsSheet.messages,
      ].join('\n'),
    };
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
        case '秒表示':
          o.showSecond = value as boolean;
          break;
        case '点数記録':
          o.showScore = value as boolean;
          break;
        default:
          assertNever(label);
          break;
      }
      return o;
    }, {} as AppSettings);
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

const setActivity = (data: LearningActivityRequest): UserActivityDTO => {
  console.info(`setActivity called with: ${JSON.stringify(data)}`);

  const ret = saveActivity(data);
  if (!ret.ok) {
    console.error(`Failed to save activity: ${ret.message}`);
    return {
      success: false,
      message: `Error: ${ret.message}`,
    };
  }

  return {
    success: true,
    data: null,
  };
};

const getDashboard = (): DashboardDTO => {
  try {
    const user = getAccessUser();
    if (!user) {
      console.info('getDashboard: No user found');
      return {
        success: true,
        data: null,
      };
    }
    console.info(
      `getDashboard for user: ${user.id} (${user.name}) - ${user.belonging} : ${user.role}`,
    );
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
global.initAppMenu_ = initAppMenu;

global.setActivity = setActivity; // 学習活動の登録

global.getSpreadSheetName = getSpreadSheetName; // 同上
global.getSpreadSheetUrl = getSpreadSheetUrl;

global.getDashboard = getDashboard;

global.setActivity = setActivity;

global._test_student_sheet = StudentSheetValidationTest;
global._test_learning_log_sheet = LearningLogSheetValidationTest;
global._test_app_setting_sheet = AppSettingSheetValidationTest;

global.getUser = getUser;

global.validateAll = validateAll;
global.initApp = initApp;

global.getSettingsData = getSettingsData;

// Exposed to Frontend API
export {
  getDashboard,
  getSpreadSheetName,
  getSpreadSheetUrl,
  getUser,
  initApp,
  setActivity,
  validateAll,
};
