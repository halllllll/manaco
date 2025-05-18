import type { LearningActivity } from '@/shared/types/activity';
import type { User } from '@/shared/types/user';
import { ss } from './Const';
import { customMenu1, openDialog } from './Menu/Menu';

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
  return ss.getActiveSheet().getName();
};

const getSpreadSheetUrl = (): string => {
  return ss.getUrl();
};

// TODO: あとで実装する とりあえず呼び出せるか確認
const getDashboard = (): User & { activities: LearningActivity[] } => {
  console.log('---- getDashboard ----');
  return {
    id: '',
    name: '',
    belonging: '',
    activities: [],
  };
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

// Exposed to Frontend API
export { affectCountToA1, getDashboard, getSpreadSheetName, getSpreadSheetUrl };
