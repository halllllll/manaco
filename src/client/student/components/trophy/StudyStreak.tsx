import type { FC } from 'react';
import type { TrophyStats } from './utils';

interface StudyStreakProps {
  stats: TrophyStats;
}

/**
 * 学習記録（連続日数）カードコンポーネント
 */
export const StudyStreak: FC<StudyStreakProps> = ({ stats }) => {
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
          <title>成長指標</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 1.657-2.657 1.657-2.657A8 8 0 1017.657 18.657z"
          />
        </svg>
        学習記録
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-base-content/70">現在の連続記録</span>
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-orange-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <title>現在の連続記録</title>
              <path d="M12 2C8.686 2 6 4.686 6 8c0 2.515 1.464 4.683 3.59 5.708L12 24l2.41-10.292C16.536 12.683 18 10.515 18 8c0-3.314-2.686-6-6-6z" />
            </svg>
            <span className="font-bold text-orange-500">{stats.currentStreak}日</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-base-content/70">最長連続記録</span>
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-purple-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <title>最長連続記録</title>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="font-bold text-purple-500">{stats.maxStreak}日</span>
          </div>
        </div>
      </div>
    </div>
  );
};
