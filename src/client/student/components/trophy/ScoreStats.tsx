import type { FC } from 'react';
import type { TrophyStats } from './utils';

interface ScoreStatsProps {
  stats: TrophyStats;
}

/**
 * 得点統計カードコンポーネント
 */
export const ScoreStats: FC<ScoreStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/** 最高得点 */}
      <div className="bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20 p-3 rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-warning"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <title>最高得点</title>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-xs font-medium text-warning">最高得点</span>
        </div>
        <div className="text-2xl font-bold text-warning">{stats.maxScore}</div>
        <div className="text-xs text-base-content/60">点</div>
      </div>

      {/** 平均得点 */}
      <div className="bg-gradient-to-br from-success/10 to-success/5 border border-success/20 p-3 rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-success"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <title>平均得点</title>
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs font-medium text-success">平均得点</span>
        </div>
        <div className="text-2xl font-bold text-success">{stats.avgScore}</div>
        <div className="text-xs text-base-content/60">点</div>
      </div>
    </div>
  );
};
