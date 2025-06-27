import { useSettings } from '@/api/settings/hook';
import { type FC, useMemo } from 'react';
import type { UserDashboardProps } from '../../types/props';
import { EmptyTrophy } from './EmptyTrophy';
import { ScoreStats } from './ScoreStats';
import { StudyAchievements } from './StudyAchievements';
import { StudyStreak } from './StudyStreak';
import { StudyTimeStats } from './StudyTimeStats';
import { calculateTrophyStats } from './utils';

/**
 * ユーザー統計（トロフィー）コンポーネント
 */
export const Trophy: FC<{ activities: UserDashboardProps['userData']['activities'] }> = ({
  activities,
}) => {
  // 統計データを計算
  const stats = useMemo(() => calculateTrophyStats(activities), [activities]);

  // app settings
  const { data: settingsData } = useSettings();

  if (!stats) {
    return <EmptyTrophy />;
  }

  return (
    <div className="card shadow-md lg:w-1/3 bg-base-100 border border-base-200 flex flex-col">
      <div className="card-body flex flex-col overflow-hidden">
        <h2 className="card-title text-xl flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>統計データ</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          統計データ
        </h2>

        <div className="flex flex-col gap-4 overflow-y-auto">
          {/* 得点関連統計（設定で表示/非表示制御） */}
          {settingsData?.showScore && <ScoreStats stats={stats} />}

          {/* 学習実績 */}
          <StudyAchievements stats={stats} showScore={settingsData?.showScore ?? false} />

          {/* 学習時間（設定で表示/非表示制御） */}
          {settingsData?.showStudyTime && <StudyTimeStats stats={stats} />}

          {/* 学習記録（連続日数） */}
          <StudyStreak stats={stats} />
        </div>
      </div>
    </div>
  );
};
