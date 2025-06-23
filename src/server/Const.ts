const ss = SpreadsheetApp.getActive();

export const SETTINGS_SHEET_NAME = 'アプリ設定';
export const SETTINGS_SHEET_HEADERS: readonly string[] = ['設定項目', '値', '説明'] as const;

export type SettingsItem =
  | '点数記録'
  | '点数下限'
  | '点数上限'
  | '学習時間を記録'
  | '秒表示'
  | 'きもち表示'
  | 'メモ表示';
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
    name: 'メモ表示',
    value: true,
    desc: 'フォームで「メモ」の表示切り替え',
  },
];
export type SettingsResult = {
  item: SettingsItem;
  value: Date | number | boolean;
};

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
    name: 'メモ表示',
    rowAt: 8,
    type: 'boolean',
  },
] as const;

export const USER_SHEET_NAME = 'ユーザー情報';
export const USER_SHEET_HEADERS: readonly string[] = [
  'アカウントID',
  '名前',
  'role',
  '所属（任意）',
] as const;

export const LEARNING_ACTIVITY_SHEET_NAME = '学習ログ';
export const LEARNING_ACTIVITY_SHEET_HEADERS: readonly string[] = [
  'タイムスタンプ',
  'メールアドレス',
  '学習日',
  '点数',
  'かかった時間（秒）',
  'きもち',
  'メモ',
] as const;

export { ss };
