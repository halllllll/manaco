import { useTeacherStudentDetail } from '@/api/teacher/hook';
import { useMemo } from 'react';

/**
 * 生徒詳細情報取得フック
 * 指定したIDの生徒の詳細情報を取得する
 * SWRを使用して効率的にデータを取得・キャッシュする
 */
export function useStudentDetail(studentId: string | null) {
  // 共通のSWRフックを使用
  const { data, error, isLoading, mutate } = useTeacherStudentDetail(studentId);

  // デバッグ情報
  useMemo(() => {
    if (studentId) {
      console.log(`[useStudentDetail] 生徒ID: ${studentId}`);
    }
    if (data) {
      console.log('[useStudentDetail] 生徒データ:', {
        id: data.id,
        name: data.name,
        activitiesCount: data.activities?.length || 0,
      });
    }
    if (error) {
      console.error('[useStudentDetail] エラー:', error);
    }
  }, [studentId, data, error]);

  return {
    student: data,
    isLoading,
    error,
    mutate,
  };
}
