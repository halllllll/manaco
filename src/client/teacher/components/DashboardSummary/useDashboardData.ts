import { useEffect, useState } from 'react';

// ダッシュボードデータの型
type DashboardData = {
  totalStudents: number;
  todayActivities: number;
  weekActivities: number;
  activityHeatmap: Array<{
    date: string;
    displayDate: string;
    activities: Record<string, boolean>;
  }>;
};

/**
 * ダッシュボードデータを取得するカスタムフック
 */
export const useDashboardData = (selectedClass = 'all') => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // ダッシュボードデータをAPIから取得
        const dashboardUrl =
          selectedClass !== 'all'
            ? `/api/teacher/dashboard?class=${selectedClass}`
            : '/api/teacher/dashboard';

        const response = await fetch(dashboardUrl);

        if (!response.ok) {
          throw new Error('Dashboard data fetch failed');
        }

        const result = await response.json();

        // レスポンスの形式を確認して適切に取り出す
        if (result.success && result.data) {
          console.log('[Dashboard] API data received:', {
            totalStudents: result.data.totalStudents,
            todayActivities: result.data.todayActivities,
            weekActivities: result.data.weekActivities,
          });

          setDashboardData(result.data);
        } else {
          console.error('[Dashboard] Invalid response format:', result);
          throw new Error('Invalid dashboard data format');
        }
      } catch (err) {
        console.error('[Dashboard] Error fetching data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedClass]); // クラス選択が変わったらデータを再取得

  return {
    isLoading,
    error,
    totalStudents: dashboardData?.totalStudents || 0,
    todayActivities: dashboardData?.todayActivities || 0,
    weekActivities: dashboardData?.weekActivities || 0,
    activityHeatmap: dashboardData?.activityHeatmap || [],
  };
};
