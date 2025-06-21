import type { FormData } from './types';

/**
 * フォームのデフォルト値を取得
 */
export const getDefaultFormValues = (): FormData => ({
  'target-date-btn': new Date().toISOString().split('T')[0],
  study_time: {
    hour: 0,
    minutes: 0,
    seconds: 0,
  },
  score: 0,
  mood: '',
  memo: '',
});

/**
 * 学習時間を秒数に変換
 */
export const calculateDuration = (studyTime: FormData['study_time']): number => {
  return studyTime.hour * 3600 + studyTime.minutes * 60 + studyTime.seconds;
};

/**
 * 学習時間記録が無効の場合のデフォルト値を取得
 */
export const getDefaultDuration = (): number => 0;
