import { useSettings } from '@/api/settings/hook';
import type { LearningActivity } from '@/shared/types/activity';
import { type FC, useState } from 'react';
import type { LearningLogSectionProps } from '../types/props';
import { ActivityDetailModal, ActivityTable, EmptyActivityList } from './learningLogs';

/**
 * 学習記録セクションコンポーネント
 */
export const LearningLogSection: FC<LearningLogSectionProps> = ({ activities }) => {
  // アプリ設定を取得
  const { data, error } = useSettings();
  if (error) {
    throw new Error(`Failed to fetch settings: ${error.name} - ${error.message}`);
  }

  const [selectedActivity, setSelectedActivity] = useState<LearningActivity | null>(null);

  return (
    <div className="card bg-base-100 shadow-md border border-base-200 w-full">
      <div className="card-body">
        <h2 className="card-title text-xl flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>学習記録</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          学習履歴
          <span className="badge badge-md">{activities.length}件</span>
        </h2>

        {activities.length === 0 ? (
          <EmptyActivityList />
        ) : (
          <ActivityTable
            activities={activities}
            settings={data}
            onSelectActivity={setSelectedActivity}
          />
        )}
      </div>

      {/* 詳細モーダル */}
      <ActivityDetailModal
        selectedActivity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
        settings={data}
      />
    </div>
  );
};
