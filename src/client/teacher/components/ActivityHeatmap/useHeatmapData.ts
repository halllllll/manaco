import { useEffect, useState } from 'react';

// ヒートマップの日付データの型
export type HeatmapDay = {
  date: string;
  displayDate: string;
  activities: Record<string, boolean>;
};

// 生徒データの型
type Student = {
  id: string;
  name: string;
  belonging: string;
  role: string;
};

// ダッシュボードデータの型
type DashboardData = {
  totalStudents: number;
  todayActivities: number;
  weekActivities: number;
  activityHeatmap: HeatmapDay[];
};

// ソートオプションの型
type SortOption = 'name' | 'activity';

/**
 * ヒートマップデータを取得するカスタムフック
 */
export const useHeatmapData = (selectedClass = 'all') => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('name');

  // ダッシュボードデータとクラスに紐づく生徒データを取得
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // ダッシュボードデータを取得
        const dashboardResponse = await fetch('/api/teacher/dashboard');
        if (!dashboardResponse.ok) {
          throw new Error('Dashboard data fetch failed');
        }
        const dashboardResult = await dashboardResponse.json();

        // 生徒データを取得
        const studentsResponse = await fetch(
          `/api/teacher/students${selectedClass !== 'all' ? `?class=${selectedClass}` : ''}`,
        );
        if (!studentsResponse.ok) {
          throw new Error('Students data fetch failed');
        }
        const studentsResult = await studentsResponse.json();

        setDashboardData(dashboardResult);
        setStudents(studentsResult);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedClass]);

  return {
    isLoading,
    error,
    heatmapData: dashboardData?.activityHeatmap || [],
    totalStudents: dashboardData?.totalStudents || 0,
    todayActivities: dashboardData?.todayActivities || 0,
    weekActivities: dashboardData?.weekActivities || 0,
    sortOption,
    setSortOption,
    students,
  };
};
