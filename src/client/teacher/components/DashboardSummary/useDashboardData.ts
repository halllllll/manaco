import { useTeacherDashboard } from '@/api/teacher/hook';
import { useMemo } from 'react';

/**
 * ダッシュボードデータを取得するカスタムフック
 * SWRを使用して効率的にデータを取得・キャッシュする
 */
export const useDashboardData = () => {
  // SWRを使ってダッシュボードデータを取得
  const { data: dashboardData, error, isLoading } = useTeacherDashboard();

  // デバッグログ
  useMemo(() => {
    if (dashboardData) {
      console.log('[Dashboard] API data processed:', {
        totalStudents: dashboardData.totalStudents,
        todayActivities: dashboardData.todayActivities,
        weekActivities: dashboardData.weekActivities,
      });
    }
  }, [dashboardData]);

  return {
    isLoading,
    error: error ? new Error(error.message) : null,
    totalStudents: dashboardData?.totalStudents || 0,
    todayActivities: dashboardData?.todayActivities || 0,
    weekActivities: dashboardData?.weekActivities || 0,
    activityHeatmap: dashboardData?.activityHeatmap || [],
  };
};
