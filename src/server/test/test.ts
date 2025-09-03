import {
  LEARNING_ACTIVITY_SHEET_HEADERS,
  SETTINGS_SHEET_HEADERS,
  USER_SHEET_HEADERS,
} from '@/server/utils/constants';
import type { User } from '@/shared/types/user';
import { getAndValidateHeaders } from '../utils/validation';

const StudentSheetValidationTest = () => {
  console.log('-- ユーザー情報シート -- ');
  console.info('正しい情報');
  const result1 = getAndValidateHeaders<User[]>('ユーザー情報', [...USER_SHEET_HEADERS]);
  console.info(result1);
  if (!result1.isValid) {
    throw new Error(result1.messages.join('\n'));
  }
  console.info('シート名が異なる');
  const result2 = getAndValidateHeaders<User[]>('学習ログ', [
    'アカウントID',
    '名前',
    '所属（任意）',
    'role',
  ]);
  console.info(result2);
  if (result2.isValid) {
    throw new Error(result2.messages.join('\n'));
  }
  console.info('ヘッダが異なる');
  const result3 = getAndValidateHeaders<User[]>('ユーザー情報', [
    'メールアドレス',
    'タイムスタンプ',
    '学習日',
    '点数',
    'かかった時間',
    'きもち',
  ]);
  console.info(result3);
  if (result3.isValid) {
    throw new Error(result3.messages.join('\n'));
  }
};

const LearningLogSheetValidationTest = () => {
  console.log('-- 学習ログシート -- ');
  console.info('正しいデータ');
  const result1 = getAndValidateHeaders('学習ログ', [...LEARNING_ACTIVITY_SHEET_HEADERS]);
  console.info(result1);
  if (!result1.isValid) {
    throw new Error(result1.messages.join('\n'));
  }
  console.info('シート名が異なる');
  const result2 = getAndValidateHeaders('ユーザー情報', [...LEARNING_ACTIVITY_SHEET_HEADERS]);
  console.info(result2);
  if (result2.isValid) {
    throw new Error(result2.messages.join('\n'));
  }
  console.info('ヘッダが異なる');
  const result3 = getAndValidateHeaders('学習ログ', [
    'メールアドレス',
    'タイムスタンプ',
    '学習日',
    '点数',
    'かかった時間',
    'きもち',
    'メモ',
  ]);
  console.info(result3);
  if (result3.isValid) {
    throw new Error(result3.messages.join('\n'));
  }
};

const AppSettingSheetValidationTest = () => {
  console.log('-- アプリ設定シート -- ');
  console.info('正しいデータ');
  const result1 = getAndValidateHeaders('アプリ設定', [...SETTINGS_SHEET_HEADERS]);
  console.info(result1);
  if (!result1.isValid) {
    throw new Error(result1.messages.join('\n'));
  }
  console.info('シート名が異なる');
  const result2 = getAndValidateHeaders('ユーザー情報', [...SETTINGS_SHEET_HEADERS]);
  console.info(result2);
  if (result2.isValid) {
    throw new Error(result2.messages.join('\n'));
  }
  console.info('ヘッダが異なる');
  const result3 = getAndValidateHeaders('アプリ設定', [
    'メールアドレス',
    'タイムスタンプ',
    '学習日',
  ]);
  console.info(result3);
  if (result3.isValid) {
    throw new Error(result3.messages.join('\n'));
  }

  // console.info('設定項目が正しい');
  // const resutl4 = validateSettingSheetItems(SETTINGS_SHEET_NAME, [...SETTINGS_SHEET_LABEL]);
  // console.info(resutl4);
  // if (!resutl4.isValid) {
  //   throw new Error(resutl4.messages.join('\n'));
  // }
  // console.info('設定項目が異なる');
  // const result5 = validateSettingSheetItems(SETTINGS_SHEET_NAME, [
  //   {
  //     rowAt: 2,
  //     name: '点数下限',
  //     type: 'number',
  //   },
  //   {
  //     rowAt: 3,
  //     name: '点数上限',
  //     type: 'number',
  //   },
  //   {
  //     rowAt: 5,
  //     name: 'きもち表示',
  //     type: 'boolean',
  //   },
  //   {
  //     rowAt: 6,
  //     name: 'メモ表示',
  //     type: 'boolean',
  //   },
  //   {
  //     rowAt: 7,
  //     name: 'きもち表示',
  //     type: 'boolean',
  //   },
  // ]);
  // console.info(result5);
  // if (result5.isValid) {
  //   throw new Error(result5.messages.join('\n'));
  // }
  // console.info('設定項目の値が異なる');
  // const result6 = validateSettingSheetItems(SETTINGS_SHEET_NAME, [
  //   {
  //     rowAt: 2,
  //     name: '点数下限',
  //     type: 'number',
  //   },
  //   {
  //     rowAt: 3,
  //     name: '点数上限',
  //     type: 'number',
  //   },
  // ]);
  // console.info(result6);
  // if (result6.isValid) {
  //   throw new Error(result6.messages.join('\n'));
  // }
};
export {
  AppSettingSheetValidationTest,
  LearningLogSheetValidationTest,
  StudentSheetValidationTest,
};
