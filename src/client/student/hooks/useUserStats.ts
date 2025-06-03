import type { LearningActivity } from '@/shared/types/activity';
import { useMemo } from 'react';

export interface ActivityRecord {
  activity: LearningActivity;
  rank: number;
}

export interface UserStats {
  averageScore: number;
  averageStudyTime: number;
  bestScore: number;
  bestTime: number;
  fastestTimeRecords: ActivityRecord[];
  recentActivities: LearningActivity[];
  topScoreRecords: ActivityRecord[];
  totalActivities: number;
  totalStudyTime: number;
}

/**
 * 学習統計を計算するカスタムフック
 */
export const useUserStats = (activities: LearningActivity[]): UserStats => {
  return useMemo(() => {
    if (!activities || activities.length === 0) {
      return {
        averageScore: 0,
        averageStudyTime: 0,
        bestScore: 0,
        bestTime: 0,
        fastestTimeRecords: [],
        recentActivities: [],
        topScoreRecords: [],
        totalActivities: 0,
        totalStudyTime: 0,
      };
    }

    const totalActivities = activities.length;
    const scores = activities.map((a) => a.score);
    const durations = activities.map((a) => a.duration);

    const averageScore = Math.round(
      scores.reduce((sum, score) => sum + score, 0) / totalActivities,
    );
    const bestScore = Math.max(...scores);
    const totalStudyTime = durations.reduce((sum, duration) => sum + duration, 0);
    const averageStudyTime = Math.round(totalStudyTime / totalActivities);
    const bestTime = Math.min(...durations);

    // 最新5件の活動
    const recentActivities = activities
      .toSorted((a, b) => new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime())
      .slice(0, 5);

    // 点数が高い順のベスト3
    const topScoreRecords = activities
      .toSorted((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((activity, index) => ({ activity, rank: index + 1 }));

    // 回答時間が早い順のベスト3
    const fastestTimeRecords = activities
      .toSorted((a, b) => a.duration - b.duration)
      .slice(0, 3)
      .map((activity, index) => ({ activity, rank: index + 1 }));

    return {
      averageScore,
      averageStudyTime,
      bestScore,
      bestTime,
      fastestTimeRecords,
      recentActivities,
      topScoreRecords,
      totalActivities,
      totalStudyTime,
    };
  }, [activities]);
};
