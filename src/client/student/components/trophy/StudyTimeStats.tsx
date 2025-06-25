import type { FC } from 'react';
import type { TrophyStats } from './utils';

interface StudyTimeStatsProps {
  stats: TrophyStats;
}

/**
 * 学習時間統計カードコンポーネント
 */
export const StudyTimeStats: FC<StudyTimeStatsProps> = ({ stats }) => {
  return (
    <div className="bg-base-200/50 border border-base-300 p-4 rounded-lg">
      <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-accent"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <title>学習時間</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        学習時間
      </h3>
      <div className="grid grid-cols-1 gap-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-base-content/70">総学習時間</span>
          <span className="font-bold text-primary">{Math.round(stats.totalDuration / 60)}分</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-base-content/70">平均学習時間</span>
          <span className="font-bold text-secondary">{Math.round(stats.avgDuration / 60)}分</span>
        </div>
      </div>
    </div>
  );
};
