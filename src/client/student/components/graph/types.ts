import type { LearningActivity } from '@/shared/types/activity';

export interface ChartComponentProps {
  data: LearningActivity[];
  maxScore: number;
  isShowScore: boolean | undefined;
  height?: number | string;
  width?: number | string;
}

export type TabType = 'graph' | 'heatmap';

export interface TabConfig {
  id: TabType;
  label: string;
  displayName: string;
  // icon: JSX.Element;
  // showStats: boolean; // 統計情報を表示するかどうか
}
