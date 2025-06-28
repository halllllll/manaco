import { useTeacherStudents } from '@/api/teacher/hook';
import type { UserWithActivities } from '@/shared/types/user';
import { useMemo } from 'react';

// 型をエクスポート
export type Student = UserWithActivities;

/**
 * 生徒データ取得フック
 * クラスフィルター指定でAPI経由で生徒リストを取得
 * SWRを使用して効率的にデータを取得・キャッシュする
 */
export function useStudentsData() {
  // 共通のSWRフックを使用
  const { data, error, isLoading } = useTeacherStudents();

  // デバッグ情報
  useMemo(() => {
    if (data) {
      console.log(`[useStudentsData] 取得した生徒数: ${data.length}`);
    }
    if (error) {
      console.error('[useStudentsData] エラー:', error);
    }
  }, [data, error]);

  return {
    students: data || [],
    isLoading,
    error,
  };
}
