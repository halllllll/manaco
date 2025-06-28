import { useTeacherStudents } from '@/api/teacher/hook';
import type { UserWithActivities } from '@/shared/types/user';
import { useMemo } from 'react';

/**
 * 生徒詳細情報取得フック
 * SWRのキャッシュから指定したIDの生徒情報を効率的に取得する
 */
export function useStudentDetail(studentId: string | null) {
  // 全生徒リストのキャッシュデータを取得
  const { data: students, error, isLoading } = useTeacherStudents();

  // キャッシュから該当の生徒を検索
  const student = useMemo(() => {
    if (!studentId || !students) return null;
    return students.find((s: UserWithActivities) => s.id === studentId) || null;
  }, [studentId, students]);

  // デバッグ情報
  useMemo(() => {
    if (studentId) {
      console.log(`[useStudentDetail] 生徒ID: ${studentId}`);
    }
    if (student) {
      console.log('[useStudentDetail] 生徒データ (from cache):', {
        id: student.id,
        name: student.name,
        activitiesCount: student.activities?.length || 0,
      });
    }
    if (error) {
      console.error('[useStudentDetail] エラー:', error);
    }
  }, [studentId, student, error]);

  return {
    student,
    isLoading,
    error,
    // mutateは一旦削除（必要なら別途実装）
  };
}
