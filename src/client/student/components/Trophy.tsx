import { useSettings } from '@/client/api/settings/hook';
import { type FC, useMemo } from 'react';
import type { UserDashboardProps } from '../types/props';

/**
 * ユーザー統計（トロフィー）コンポーネント
 */
export const Trophy: FC<{ activities: UserDashboardProps['userData']['activities'] }> = ({
  activities,
}) => {
  const orderedActivities = useMemo(() => {
    return activities.toSorted((a, b) => {
      return a.activityDate.localeCompare(b.activityDate);
    });
  }, [activities]);

  // 統計データを計算
  const stats = useMemo(() => {
    if (orderedActivities.length === 0) return null;

    const scores = orderedActivities.map((a) => a.score);
    const durations = orderedActivities.map((a) => a.duration);
    const maxScore = Math.max(...scores);
    const avgScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
    const totalDuration = durations.reduce((sum, duration) => sum + duration, 0);
    const avgDuration = Math.round(totalDuration / durations.length);

    // 学習日数を計算
    const uniqueDates = new Set(orderedActivities.map((a) => a.activityDate.split('T')[0]));
    const studyDays = uniqueDates.size;

    // 連続学習記録を計算
    const calculateStreak = () => {
      const sortedDates = Array.from(uniqueDates).sort();
      let currentStreak = 0;
      let maxStreak = 0;
      let previousDate = null;

      for (const dateStr of sortedDates.reverse()) {
        const currentDate = new Date(dateStr);
        if (previousDate) {
          const dayDiff = Math.floor(
            (previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24),
          );
          if (dayDiff === 1) {
            currentStreak++;
          } else {
            maxStreak = Math.max(maxStreak, currentStreak);
            currentStreak = 1;
          }
        } else {
          currentStreak = 1;
        }
        previousDate = currentDate;
      }
      return {
        currentStreak: Math.max(currentStreak, 1),
        maxStreak: Math.max(maxStreak, currentStreak),
      };
    };

    const { currentStreak, maxStreak } = calculateStreak();

    // 今週の活動を計算
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const thisWeekActivities = orderedActivities.filter((a) => {
      const activityDate = new Date(a.activityDate);
      return activityDate >= weekStart;
    });

    return {
      maxScore,
      avgScore,
      totalSessions: orderedActivities.length,
      totalDuration,
      avgDuration,
      studyDays,
      currentStreak,
      maxStreak,
      perfectScores: scores.filter((s) => s === 100).length,
      thisWeekSessions: thisWeekActivities.length,
    };
  }, [orderedActivities]);

  // app settings
  const { data: settingsData, error: settingsError, isLoading: settingsIsLoading } = useSettings();

  if (!stats) {
    return (
      <div className="card shadow-md lg:w-1/3 bg-base-100 border border-base-200">
        <div className="card-body">
          <h2 className="card-title text-xl flex items-center gap-2 flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-secondary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <title>statistics</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            学習統計
          </h2>
          <div className="text-center py-8">
            <p className="text-base-content/60">まだ学習データがありません</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-md lg:w-1/3 bg-base-100 border border-base-200 flex flex-col">
      <div className="card-body flex flex-col overflow-hidden">
        <h2 className="card-title text-xl flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-secondary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>statistics</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          学習統計
        </h2>

        <div className="flex flex-col gap-4 overflow-y-auto">
          {/* 主要指標 */}

          {settingsData?.showScore && (
            <>
              {/** 得点関連 */}
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
                      <title> </title>
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs font-medium text-success">平均得点</span>
                  </div>
                  <div className="text-2xl font-bold text-success">{stats.avgScore}</div>
                  <div className="text-xs text-base-content/60">点</div>
                </div>
              </div>
            </>
          )}

          {/* 学習実績 */}
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
              {settingsData?.showScore && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-base-content/70">満点回数</span>
                  <span className="font-bold text-warning">{stats.perfectScores}回</span>
                </div>
              )}
            </div>
          </div>

          {/* 学習時間 */}
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
                <span className="font-bold text-primary">
                  {Math.round(stats.totalDuration / 60)}分
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-base-content/70">平均学習時間</span>
                <span className="font-bold text-secondary">
                  {Math.round(stats.avgDuration / 60)}分
                </span>
              </div>
            </div>
          </div>

          {/* 成長指標 */}
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
        </div>
      </div>
    </div>
  );
};
