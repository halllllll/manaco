import type { LearningActivity } from '@/shared/types/activity';

export interface TrophyStats {
  maxScore: number;
  avgScore: number;
  totalSessions: number;
  totalDuration: number;
  avgDuration: number;
  studyDays: number;
  currentStreak: number;
  maxStreak: number;
  perfectScores: number;
  thisWeekSessions: number;
}

/**
 * 学習活動から統計情報を計算する
 * @param activities 学習活動の配列
 * @returns 統計情報またはnull（データがない場合）
 */
export const calculateTrophyStats = (activities: LearningActivity[]): TrophyStats | null => {
  if (activities.length === 0) return null;

  const orderedActivities = activities.toSorted((a, b) => {
    return a.activityDate.localeCompare(b.activityDate);
  });

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
};
