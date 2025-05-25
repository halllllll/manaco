import type { LearningActivity } from '@/shared/types/activity';
import { useMemo } from 'react';

export interface ActivityRecord {
  activity: LearningActivity;
  rank: number;
}

export interface UserStats {
  totalActivities: number;
  averageScore: number;
  bestScore: number;
  totalStudyTime: number;
  averageStudyTime: number;
  bestTime: number;
  recentActivities: LearningActivity[];
  topScoreRecords: ActivityRecord[];
  fastestTimeRecords: ActivityRecord[];
  completionRate: number;
  scoreImprovement: number;
  consistencyScore: number;
  streakCount: number;
}

/**
 * 学習統計を計算するカスタムフック
 */
export const useUserStats = (activities: LearningActivity[]): UserStats => {
  return useMemo(() => {
    if (!activities || activities.length === 0) {
      return {
        totalActivities: 0,
        averageScore: 0,
        bestScore: 0,
        totalStudyTime: 0,
        averageStudyTime: 0,
        bestTime: 0,
        recentActivities: [],
        topScoreRecords: [],
        fastestTimeRecords: [],
        completionRate: 0,
        scoreImprovement: 0,
        consistencyScore: 0,
        streakCount: 0,
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

    // 完了率（合格点を60点と仮定）
    const passedActivities = activities.filter((a) => a.score >= 60).length;
    const completionRate = Math.round((passedActivities / totalActivities) * 100);

    // スコア向上度（最初の5回と最後の5回の平均を比較）
    let scoreImprovement = 0;
    if (totalActivities >= 10) {
      const firstFive = activities.slice(0, 5);
      const lastFive = activities.slice(-5);
      const firstAvg = firstFive.reduce((sum, a) => sum + a.score, 0) / 5;
      const lastAvg = lastFive.reduce((sum, a) => sum + a.score, 0) / 5;
      scoreImprovement = Math.round(lastAvg - firstAvg);
    }

    // 一貫性スコア（標準偏差から計算、低いほど一貫している）
    const variance =
      scores.reduce((sum, score) => sum + (score - averageScore) ** 2, 0) / totalActivities;
    const standardDeviation = Math.sqrt(variance);
    const consistencyScore = Math.max(0, Math.round(100 - standardDeviation));

    // 連続成功回数（合格点60点以上の連続回数）
    let streakCount = 0;
    const toSortededByDate = [...activities].toSorted(
      (a, b) => new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime(),
    );
    for (const activity of toSortededByDate) {
      if (activity.score >= 60) {
        streakCount++;
      } else {
        break;
      }
    }

    return {
      totalActivities,
      averageScore,
      bestScore,
      totalStudyTime,
      averageStudyTime,
      bestTime,
      recentActivities,
      topScoreRecords,
      fastestTimeRecords,
      completionRate,
      scoreImprovement,
      consistencyScore,
      streakCount,
    };
  }, [activities]);
};
