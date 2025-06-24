import type { LearningActivity } from '../types/activity';
import type { AppSettings } from '../types/settings';

/**
 * 活動列IDの定義
 * 新しい列を追加するときは、この型も更新する必要がある
 */
export const ActivityColumnIdEnum = {
  activityDate: 'activityDate',
  score: 'score',
  duration: 'duration',
  mood: 'mood',
  activityType: 'activityType',
  actions: 'actions',
} as const;

// 列IDの型定義 (網羅性チェック用)
export type ActivityColumnId = (typeof ActivityColumnIdEnum)[keyof typeof ActivityColumnIdEnum];

export type ActivityColumn = {
  id: ActivityColumnId | keyof LearningActivity;
  label: string;
  settingKey?: keyof AppSettings;
  valueFormatter?: (value: unknown) => string;
  isVisible?: (settings: AppSettings) => boolean;
  responsive?: boolean; // trueの場合、モバイルでは非表示
  // UI/スタイルに関する情報は削除 - コンポーネント側で定義する
};

/**
 * 学習記録テーブルの列定義
 * - 新しい列を追加する場合はこの配列に追加するだけでよい
 * - 表示条件や特殊な表示方法が必要な場合は個別に定義できる
 */
export const ACTIVITY_COLUMNS: ActivityColumn[] = [
  {
    id: ActivityColumnIdEnum.activityDate,
    label: '日付',
    // 日付列は常に表示する（settingKeyは指定しない）
  },
  {
    id: ActivityColumnIdEnum.score,
    label: '点数',
    settingKey: 'showScore', // settings.showScoreがtrueの場合のみ表示
  },
  {
    id: ActivityColumnIdEnum.duration,
    label: '学習時間',
    settingKey: 'showStudyTime',
    responsive: true,
  },
  {
    id: ActivityColumnIdEnum.mood,
    label: 'きもち',
    settingKey: 'showMood',
    responsive: true,
  },
  {
    id: ActivityColumnIdEnum.activityType,
    label: '取り組んだこと',
    settingKey: 'showActivity',
    responsive: true,
  },
  {
    id: ActivityColumnIdEnum.actions,
    label: '',
    // アクション列は常に表示する
  },
];

/**
 * 列の表示条件をチェックする
 * @param column 列定義
 * @param settings アプリ設定
 * @returns 表示すべきかどうか
 */
export const isColumnVisible = (column: ActivityColumn, settings: AppSettings): boolean => {
  if (column.isVisible) {
    return column.isVisible(settings);
  }

  if (column.settingKey) {
    return settings[column.settingKey] === true;
  }

  // 設定キーがない場合は常に表示
  return true;
};

/**
 * 活動記録の詳細表示項目の定義
 */
export type ActivityDetailItem = {
  id: keyof LearningActivity | string;
  settingKey?: keyof AppSettings;
  title: string;
  icon: string;
  isVisible: (activity: LearningActivity, settings: AppSettings) => boolean;
  borderColor: string;
};

/**
 * 詳細項目の表示条件をチェックする
 * @param item 項目定義
 * @param activity アクティビティデータ
 * @param settings アプリ設定
 * @returns 表示すべきかどうか
 */
export const isDetailItemVisible = (
  item: ActivityDetailItem,
  activity: LearningActivity,
  settings: AppSettings,
): boolean => {
  if (!item.isVisible(activity, settings)) {
    return false;
  }

  if (item.settingKey) {
    return settings[item.settingKey] === true;
  }

  return true;
};

/**
 * 活動記録の詳細項目
 */
export const ACTIVITY_DETAIL_ITEMS: ActivityDetailItem[] = [
  {
    id: 'score',
    title: '今回の点数',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    settingKey: 'showScore',
    borderColor: 'border-primary',
    isVisible: (activity) => activity.score !== undefined && activity.score !== null,
  },
  {
    id: 'duration',
    title: '学習時間',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    settingKey: 'showStudyTime',
    borderColor: 'border-info',
    isVisible: () => true, // 学習時間は必須項目なのでチェックは不要
  },
  {
    id: 'mood',
    title: 'このときの気持ち',
    icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    settingKey: 'showMood',
    borderColor: 'border-secondary',
    isVisible: (activity) => activity.mood !== undefined,
  },
  {
    id: 'activityType',
    title: '取り組んだこと',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    borderColor: 'border-warning',
    isVisible: (activity) =>
      Array.isArray(activity.activityType) && activity.activityType.length > 0,
  },
  {
    id: 'memo',
    title: 'メモ',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    settingKey: 'showMemo',
    borderColor: 'border-accent',
    isVisible: (activity) => activity.memo !== undefined && activity.memo !== '',
  },
];
