import type { LearningActivity } from '@/shared/types/activity';
import type { AppSettings } from '@/shared/types/settings';
import type { FC } from 'react';
import React, { useRef } from 'react';
import { GraphChart } from './GraphChart';
import { HeatmapChart } from './HeatmapChart';
import type { ChartComponentProps, TabType } from './types';
import { TAB_CONFIGS, getAvailableTabs } from './utils';

interface GraphTabsProps {
  activities: LearningActivity[];
  maxScore: number;
  settings: AppSettings;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const CHART_COMPONENTS: Record<TabType, FC<ChartComponentProps>> = {
  graph: GraphChart,
  heatmap: HeatmapChart,
};

/**
 * グラフタブコンポーネント
 */
export const GraphTabs: FC<GraphTabsProps> = ({
  activities,
  maxScore,
  settings,
  activeTab,
  onTabChange,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const orderedActivities = activities.toSorted((a, b) =>
    a.activityDate.localeCompare(b.activityDate),
  );
  const availableTabs = getAvailableTabs(settings);

  // 時間設定がない場合はヒートマップのみ表示
  if (!settings.showStudyTime && availableTabs.length === 1 && availableTabs[0] === 'heatmap') {
    return (
      <div>
        <HeatmapChart
          data={orderedActivities}
          maxScore={maxScore}
          isShowScore={settings.showScore}
        />
      </div>
    );
  }

  return (
    <div className="tabs tabs-border border border-gray-300 rounded-md pr-4 pl-4">
      {availableTabs.map((tabId) => {
        const tabConfig = TAB_CONFIGS[tabId];
        const ChartComponent = CHART_COMPONENTS[tabId];
        const isActive = activeTab === tabId;

        return (
          <React.Fragment key={tabConfig.id}>
            <input
              type="radio"
              name="tabs"
              className="tab"
              aria-label={tabConfig.label}
              checked={isActive}
              onChange={() => onTabChange(tabConfig.id)}
            />
            <div className="tab-content">
              <div ref={tabConfig.id === 'graph' ? chartRef : undefined}>
                <ChartComponent
                  data={orderedActivities}
                  maxScore={maxScore}
                  isShowScore={settings.showScore}
                />
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
