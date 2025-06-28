import type { FC } from 'react';
import { useDashboardData } from './useDashboardData';

/**
 * ダッシュボードの概要パネルを表示するコンポーネント
 * 登録生徒数、今日の投稿数、今週の投稿数を表示する
 */
export const DashboardSummary: FC = () => {
  const { isLoading, error, totalStudents, todayActivities, weekActivities } = useDashboardData();

  if (isLoading) {
    return <DashboardSummarySkeleton />;
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>データの読み込みに失敗しました。</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="stats shadow bg-base-100">
        <div className="stat">
          <div className="stat-title">登録生徒数</div>
          <div className="stat-value text-primary">{totalStudents}</div>
          <div className="stat-desc">全クラス合計</div>
        </div>
      </div>

      <div className="stats shadow bg-base-100">
        <div className="stat">
          <div className="stat-title">今日の投稿数</div>
          <div className="stat-value text-secondary">{todayActivities}</div>
          <div className="stat-desc">全生徒の合計</div>
        </div>
      </div>

      <div className="stats shadow bg-base-100">
        <div className="stat">
          <div className="stat-title">今週の投稿数</div>
          <div className="stat-value text-accent">{weekActivities}</div>
          <div className="stat-desc">過去7日間の合計</div>
        </div>
      </div>
    </div>
  );
};

/**
 * ローディング中のスケルトンUI
 */
const DashboardSummarySkeleton: FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
      <div className="stats shadow bg-base-100">
        <div className="stat">
          <div className="stat-title">登録生徒数</div>
          <div className="h-8 bg-gray-200 rounded w-20 mt-1 mb-1" />
          <div className="stat-desc">全クラス合計</div>
        </div>
      </div>

      <div className="stats shadow bg-base-100">
        <div className="stat">
          <div className="stat-title">今日の投稿数</div>
          <div className="h-8 bg-gray-200 rounded w-20 mt-1 mb-1" />
          <div className="stat-desc">全生徒の合計</div>
        </div>
      </div>

      <div className="stats shadow bg-base-100">
        <div className="stat">
          <div className="stat-title">今週の投稿数</div>
          <div className="h-8 bg-gray-200 rounded w-20 mt-1 mb-1" />
          <div className="stat-desc">過去7日間の合計</div>
        </div>
      </div>
    </div>
  );
};
