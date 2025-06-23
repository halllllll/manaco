import { useToast } from '@/client/context/ToastConterxt';
import type { LearningActivity } from '@/shared/types/activity';
import type { AppSettings } from '@/shared/types/settings';
import * as htmlToImage from 'html-to-image';
import type { FC } from 'react';
import { useRef } from 'react';
import { useUserState } from '../../hooks/useUserState';
import { GraphChart } from './GraphChart';
import { HeatmapChart } from './HeatmapChart';
import { LearningPeriod } from './LearningPeriod';
import { UserStatsCards } from './UserStatsCards';
import type { ChartComponentProps, TabType } from './types';
import { TAB_CONFIGS } from './utils';

interface GraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabType;
  activities: LearningActivity[];
  maxScore: number;
  settings: AppSettings;
}

const CHART_COMPONENTS: Record<TabType, FC<ChartComponentProps>> = {
  graph: GraphChart,
  heatmap: HeatmapChart,
};

/**
 * グラフ拡大表示モーダルコンポーネント
 */
export const GraphModal: FC<GraphModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  activities,
  maxScore,
  settings,
}) => {
  const modalContentRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();
  const { userData } = useUserState();

  const activeTabConfig = TAB_CONFIGS[activeTab];
  const ActiveChartComponent = CHART_COMPONENTS[activeTab];

  const orderedActivities = activities.toSorted((a, b) =>
    a.activityDate.localeCompare(b.activityDate),
  );

  // グラフを画像として保存する関数
  const saveAsImage = async () => {
    if (!modalContentRef.current) {
      addToast('error', 'モーダルコンテンツが見つかりません', 3000);
      return;
    }

    try {
      // ボタンを除外するためのフィルター関数
      const filter = (node: HTMLElement) => {
        // モーダルアクションボタンを除外
        if (node.classList?.contains('modal-action')) {
          return false;
        }
        // フォームの閉じるボタンを除外
        if (node.tagName === 'BUTTON' && node.parentElement?.classList.contains('modal-backdrop')) {
          return false;
        }
        return true;
      };

      const dataUrl = await htmlToImage.toPng(modalContentRef.current, {
        quality: 0.95,
        backgroundColor: '#FFFFFF',
        filter: filter,
      });
      const link = document.createElement('a');
      link.download = `学習記録_${userData?.name || 'ユーザー'}_${activeTabConfig.displayName}_${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
      addToast('success', 'グラフと情報を画像として保存しました', 3000);
    } catch (e) {
      const err = e as Error;
      addToast('error', `画像の保存中にエラーが発生しました\n${err.name} - ${err.message}`, 3000);
    }
  };

  return (
    <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div
        className="modal-box max-w-full w-11/12 max-h-screen h-22/23 flex flex-col overflow-y-auto"
        ref={modalContentRef}
      >
        <h4 className="font-bold text-lg mb-3 text-primary-content flex-shrink-0">
          {`${userData?.name || 'ユーザー'} さんの学習記録`}
        </h4>

        {/* Graph Area */}
        <div className="mb-4">
          <ActiveChartComponent
            data={orderedActivities}
            maxScore={maxScore}
            isShowScore={settings.showScore}
            height={300}
            width={'100%'}
          />
        </div>

        {/* User Info and Stats Area */}
        <div className="p-4 border-t border-base-300 overflow-y-auto">
          <UserStatsCards activities={activities} settings={settings} />
          <LearningPeriod activities={orderedActivities} />
        </div>

        {/* Modal Actions */}
        <div className="modal-action mt-auto pt-4 flex-shrink-0">
          <button type="button" className="btn btn-outline btn-accent mr-2" onClick={saveAsImage}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <title>画像として保存</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            {`${activeTabConfig.displayName}を画像保存`}
          </button>
          <button type="button" className="btn" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={onClose}>
          閉じる
        </button>
      </form>
    </dialog>
  );
};
