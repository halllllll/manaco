import { useTeacherDashboard, useTeacherStudents } from '@/api/teacher/hook';
import type { HeatmapDay } from '@/shared/types/teacher';
import { useMemo, useState } from 'react';

// ソートオプションの型
type SortOption = 'name' | 'activity';

/**
 * ヒートマップデータを取得するカスタムフック
 * SWRを使用して全データを一度に取得し、クライアント側で処理する
 */
export const useHeatmapData = () => {
  // ダッシュボードデータと生徒データをSWRで取得
  const {
    data: dashboardData,
    error: dashboardError,
    isLoading: isDashboardLoading,
  } = useTeacherDashboard();
  const {
    data: studentsData,
    error: studentsError,
    isLoading: isStudentsLoading,
  } = useTeacherStudents();

  const [sortOption, setSortOption] = useState<SortOption>('name');

  // エラーとローディング状態の統合
  const error = dashboardError || studentsError || null;
  const isLoading = isDashboardLoading || isStudentsLoading;

  // データの加工
  const students = useMemo(() => {
    return studentsData || [];
  }, [studentsData]);

  // 合計値の計算（フィルタリング済みデータから）
  const totalStudents = dashboardData?.totalStudents || 0;
  const todayActivities = dashboardData?.todayActivities || 0;
  const weekActivities = dashboardData?.weekActivities || 0;
  const heatmapData = dashboardData?.activityHeatmap || [];

  // デバッグログ
  useMemo(() => {
    if (dashboardData) {
      console.log('[useHeatmapData] Dashboard data processed:', {
        totalStudents,
        todayActivities,
        weekActivities,
        heatmapDays: heatmapData.length,
      });
      console.info('Client (Heatmap Hook): heatmapData content:', JSON.stringify(heatmapData));
    }
    if (studentsData) {
      console.log('[useHeatmapData] Students data processed:', { count: students.length });
    }
  }, [
    dashboardData,
    studentsData,
    totalStudents,
    todayActivities,
    weekActivities,
    heatmapData,
    students,
  ]);

  return {
    isLoading,
    error: error ? new Error(error.message) : null,
    heatmapData,
    totalStudents,
    todayActivities,
    weekActivities,
    sortOption,
    setSortOption,
    students,
  };
};

export type { HeatmapDay };
