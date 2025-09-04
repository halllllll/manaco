/**
 * Constants used throughout the server application
 */

import type { Memo } from '@/shared/types/memo';

export const ss = SpreadsheetApp.getActive();

export type SHEET_NAME =
  | 'アプリ名'
  | 'ユーザー情報'
  | 'アプリ設定'
  | '学習ログ'
  | '取り組みリスト'
  | '自由記述欄リスト';

// Sheet headers
export const SETTINGS_SHEET_HEADERS: readonly string[] = ['設定項目', '値', '説明'] as const;

export const USER_SHEET_HEADERS: readonly string[] = [
  'アカウントID',
  '名前',
  'role',
  '所属（任意）',
] as const;
export const LEARNING_ACTIVITY_SHEET_HEADERS: readonly string[] = [
  'タイムスタンプ',
  'メールアドレス',
  '学習日',
  '点数',
  'かかった時間（秒）',
  'きもち',
  '取り組んだ内容',
  '自由記述欄',
] as const;

export const ACTIVITY_LIST_SHEET_HEADERS: readonly string[] = ['名前', '活動内容'] as const;

export const MEMO_LIST_SHEET_HEADERS: readonly string[] = [
  'ラベル名',
  'placeholder（任意）',
] as const;

// Settings types
export type SettingsItem =
  | '点数記録'
  | '点数下限'
  | '点数上限'
  | '学習時間を記録'
  | '秒表示'
  | 'きもち表示'
  | '自由記述欄表示'
  | '取り組み表示';
export type SettingsType = 'number' | 'boolean' | 'date';

export type SettingsSheetItem = {
  rowAt: number;
  name: SettingsItem;
  type: SettingsType;
};

export const DefaultSettingsItemValue: {
  name: SettingsItem;
  value: Date | number | boolean;
  desc: string;
}[] = [
  {
    name: '点数記録',
    value: true,
    desc: '点数を記録する（FALSEの場合、点数下限・上限の設定は無視されます）',
  },
  {
    name: '点数下限',
    value: 0,
    desc: 'フォームで受け入れる点数の下限',
  },
  {
    name: '点数上限',
    value: 100,
    desc: 'フォームで受け入れる点数の上限',
  },
  {
    name: '学習時間を記録',
    value: true,
    desc: '学習時間を記録する（FALSEの場合、「秒表示」の設定は無視されます）',
  },
  {
    name: '秒表示',
    value: false,
    desc: 'フォームで「秒」の表示切り替え',
  },
  {
    name: 'きもち表示',
    value: true,
    desc: 'フォームで「きもち」の表示切り替え',
  },
  {
    name: '自由記述欄表示',
    value: true,
    desc: 'フォームで「メモ」の表示切り替え（TRUEの場合、「自由記述欄リスト」の内容が反映されます）',
  },
  {
    name: '取り組み表示',
    value: false,
    desc: '「取り組みリスト」から選択するアイテムの表示切り替え',
  },
];

export type SettingsResult = {
  item: SettingsItem;
  value: Date | number | boolean;
};

export const DefaultActivityList: { name: string; color: string; desc: string }[] = [
  { name: 'こくご', color: '#ede266', desc: '国語' },
  { name: '漢字の書き取り', color: '#73f256', desc: '国語' },
  { name: 'English', color: '#36b7f7', desc: '英語' },
  { name: '算数', color: '#8843f7', desc: '算数（上）' },
  { name: '読書', color: '#ede266', desc: '読書' },
  { name: '塾', color: '#a4a4a4', desc: '習い事' },
  { name: '日記', color: '#FFF', desc: '宿題' },
];

export const DefaultMemoList: Memo[] = [
  {
    label: '📝 メモ',
    placeholder: 'メモや感想',
  },
];

export const SETTINGS_SHEET_LABEL: readonly SettingsSheetItem[] = [
  {
    name: '点数記録',
    rowAt: 2,
    type: 'boolean',
  },
  {
    name: '点数下限',
    rowAt: 3,
    type: 'number',
  },
  {
    name: '点数上限',
    rowAt: 4,
    type: 'number',
  },
  {
    name: '学習時間を記録',
    rowAt: 5,
    type: 'boolean',
  },
  {
    name: '秒表示',
    rowAt: 6,
    type: 'boolean',
  },
  {
    name: 'きもち表示',
    rowAt: 7,
    type: 'boolean',
  },
  {
    name: '自由記述欄表示',
    rowAt: 8,
    type: 'boolean',
  },
  {
    name: '取り組み表示',
    rowAt: 9,
    type: 'boolean',
  },
] as const;
