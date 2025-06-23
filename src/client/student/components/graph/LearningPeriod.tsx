import type { LearningActivity } from '@/shared/types/activity';
import type { FC } from 'react';

interface LearningPeriodProps {
  activities: LearningActivity[];
}

/**
 * 学習期間情報コンポーネント
 */
export const LearningPeriod: FC<LearningPeriodProps> = ({ activities }) => {
  if (activities.length === 0) {
    return null;
  }

  const orderedActivities = activities.toSorted((a, b) =>
    a.activityDate.localeCompare(b.activityDate),
  );

  return (
    <div className="mt-4 bg-gradient-to-br from-green-100 to-green-50 rounded-xl p-4 shadow-sm border border-green-200">
      <h5 className="text-lg font-bold mb-3 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-2 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <title>学習期間</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        がくしゅうきかん
      </h5>
      <div className="flex items-center justify-center gap-4">
        <div className="bg-white rounded-lg p-3 text-center border border-green-200 flex-1">
          <div className="text-sm text-green-700 mb-1">はじめたひ</div>
          <div className="font-bold text-green-800">{orderedActivities[0].activityDate}</div>
        </div>
        <div className="text-green-600 font-bold text-xl">→</div>
        <div className="bg-white rounded-lg p-3 text-center border border-green-200 flex-1">
          <div className="text-sm text-green-700 mb-1">さいきんのひ</div>
          <div className="font-bold text-green-800">
            {orderedActivities[orderedActivities.length - 1].activityDate}
          </div>
        </div>
      </div>
    </div>
  );
};
