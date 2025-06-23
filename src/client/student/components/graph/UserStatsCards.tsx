import type { LearningActivity } from '@/shared/types/activity';
import type { AppSettings } from '@/shared/types/settings';
import type { FC } from 'react';
import { useUserStats } from '../../hooks/useUserStats';

interface UserStatsCardsProps {
  activities: LearningActivity[];
  settings: AppSettings;
}

/**
 * ユーザー統計情報カードコンポーネント
 */
export const UserStatsCards: FC<UserStatsCardsProps> = ({ activities, settings }) => {
  const userStats = useUserStats(activities);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Basic Stats - Activity Count and Best Score */}
      <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-4 shadow-sm border border-blue-200">
        <h5 className="text-lg font-bold mb-3 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>がんばったこと</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
          がんばったこと
        </h5>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-blue-700">がんばった回数</span>
            <span className="text-xl font-bold text-blue-800">
              {userStats.totalActivities}回
            </span>
          </div>
          {settings.showScore && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-700">さいこうてんすう</span>
              <span className="text-xl font-bold text-blue-800">
                {userStats.bestScore}点
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Time and Average Stats */}
      <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl p-4 shadow-sm border border-purple-200">
        <h5 className="text-lg font-bold mb-3 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2 text-purple-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>べんきょうのきろく</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          べんきょうのきろく
        </h5>
        <div className="space-y-2">
          {settings.showStudyTime && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-purple-700">がくしゅうじかん</span>
              <span className="text-xl font-bold text-purple-800">
                {`${(userStats.totalStudyTime / 60).toFixed(0)} 分`}
              </span>
            </div>
          )}
          {settings.showScore && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-purple-700">へいきんてんすう</span>
              <div className="flex items-center">
                <span className="text-xl font-bold text-purple-800">
                  {`${userStats.averageScore.toFixed(1)} 点`}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
