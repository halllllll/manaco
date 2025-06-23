import type { AppSettings } from '@/shared/types/settings';
import type { TabConfig, TabType } from './types';

export const TAB_CONFIGS: Record<TabType, TabConfig> = {
  graph: {
    id: 'graph',
    label: 'グラフ',
    displayName: 'グラフ',
  },
  heatmap: {
    id: 'heatmap',
    label: 'ヒートマップ',
    displayName: 'ヒートマップ',
  },
};

/**
 * 日付に指定日数を追加する
 */
export const addDate = (days: number, anchor: string | Date): string => {
  const difDate = new Date(anchor);
  difDate.setDate(difDate.getDate() + days);
  return difDate.toISOString().split('T')[0];
};

/**
 * データ数に応じた動的なbarSizeとmarginの計算
 */
export const getOptimalBarConfig = (dataLength: number) => {
  if (dataLength <= 5) {
    return { barSize: 40, bottomMargin: 20 };
  }
  if (dataLength <= 10) {
    return { barSize: 25, bottomMargin: 30 };
  }
  if (dataLength <= 20) {
    return { barSize: 20, bottomMargin: 40 };
  }
  if (dataLength <= 30) {
    return { barSize: 15, bottomMargin: 50 };
  }
  return { barSize: 12, bottomMargin: 60 };
};

/**
 * 設定に基づいて表示可能なタブを取得
 */
export const getAvailableTabs = (settings: AppSettings): TabType[] => {
  const tabs: TabType[] = [];

  // 時間設定がある場合のみグラフタブを表示
  if (settings.showStudyTime) {
    tabs.push('graph');
  }

  // ヒートマップは常に表示
  tabs.push('heatmap');

  return tabs;
};
