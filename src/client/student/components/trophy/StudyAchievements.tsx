import type { FC } from 'react';
import type { TrophyStats } from './utils';

interface StudyAchievementsProps {
  stats: TrophyStats;
  showScore: boolean;
}

/**
 * 学習実績カードコンポーネント
 */
export const StudyAchievements: FC<StudyAchievementsProps> = ({ stats, showScore }) => {
  return (
    <div className="bg-base-200/50 border border-base-300 p-4 rounded-lg">
      <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-info"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <title>学習実績</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
        学習実績
      </h3>
      <div className="grid grid-cols-1 gap-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-base-content/70">総学習回数</span>
          <span className="font-bold text-primary">{stats.totalSessions}回</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-base-content/70">学習日数</span>
          <span className="font-bold text-secondary">{stats.studyDays}日</span>
        </div>
        {showScore && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-base-content/70">満点回数</span>
            <span className="font-bold text-warning">{stats.perfectScores}回</span>
          </div>
        )}
      </div>
    </div>
  );
};
