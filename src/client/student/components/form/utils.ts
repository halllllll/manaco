import type { FormData } from './types';

/**
 * フォームのデフォルト値を取得
 */
// toISOString()は常にUTCで返すため、ローカルタイムゾーンの日付を取得するための対応
// https://neos21.net/blog/2020/12/09-01.html

const dateTZOffset = () => {
  const t = new Date(Date.now() + (new Date().getTimezoneOffset() + 9 * 60) * 60 * 1000);
  const [year, month, day] = [t.getFullYear(), t.getMonth() + 1, t.getDate()];
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

export const getDefaultFormValues = (): FormData => ({
  'target-date-btn': dateTZOffset(),
  study_time: {
    hour: 0,
    minutes: 0,
    seconds: 0,
  },
  score: 0,
  mood: '',
  memo: '',
  activityType: [],
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
