import { useSettings } from '@/client/api/settings/hook';
import type { FC } from 'react';
import { useMemo, useState } from 'react';
import type { GraphProps } from '../types/props';
import { GraphModal, GraphTabs, type TabType, getAvailableTabs } from './graph/index';

/**
 * 学習記録グラフコンポーネント
 */
export const Graph: FC<GraphProps> = ({ activities }) => {
  const { data: settings, isLoading, error } = useSettings();

  const orderedActivities = useMemo(() => {
    return activities.toSorted((a, b) => a.activityDate.localeCompare(b.activityDate));
  }, [activities]);

  const maxScore = useMemo(() => {
    if (activities.length === 0) {
      return 0;
    }
    return Math.max(...activities.map((a) => a.score ?? 0));
  }, [activities]);

  // デフォルトのアクティブタブを設定に基づいて決定
  const getDefaultTab = (): TabType => {
    if (!settings) return 'graph';
    const availableTabs = getAvailableTabs(settings);
    return availableTabs[0] || 'heatmap';
  };

  const [activeTab, setActiveTab] = useState<TabType>(getDefaultTab());
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 設定が読み込み中またはエラーの場合
  if (isLoading) {
    return (
      <div className="card bg-base-200/50 shadow-sm border border-base-300/50 w-full lg:flex-1">
        <div className="card-body p-3 sm:p-4">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <div className="skeleton h-5 sm:h-6 w-3/5 sm:w-1/2" /> {/* Title: "これまでの記録" */}
            <div className="skeleton h-7 sm:h-8 w-16 sm:w-20 rounded" /> {/* Button: "拡大" */}
          </div>
          {/* Chart Area Placeholder */}
          <div className="skeleton h-48 sm:h-56 w-full rounded" />
        </div>
      </div>
    );
  }

  if (error || !settings) {
    return (
      <div className="card bg-base-100 w-full shadow-md border border-base-200">
        <div className="card-body">
          <div className="alert alert-error">
            <span>設定の読み込みに失敗しました</span>
          </div>
        </div>
      </div>
    );
  }

  const availableTabs = getAvailableTabs(settings);
  const currentActiveTab = availableTabs.includes(activeTab) ? activeTab : availableTabs[0];

  return (
    <>
      <div className="card bg-base-100 w-full shadow-md border border-base-200">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h2 className="card-title text-xl flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>学習時間</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              これまでの記録
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="btn btn-sm btn-outline btn-primary"
                title="拡大表示"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <title>拡大表示</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                拡大
              </button>
            </div>
          </div>

          <GraphTabs
            activities={orderedActivities}
            maxScore={maxScore}
            settings={settings}
            activeTab={currentActiveTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>

      <GraphModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activeTab={currentActiveTab}
        activities={orderedActivities}
        maxScore={maxScore}
        settings={settings}
      />
    </>
  );
};
