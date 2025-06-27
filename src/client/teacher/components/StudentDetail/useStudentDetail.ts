import { useEffect } from 'react';
import useSWR from 'swr';
import type { Student } from '../StudentSummaryTable/useStudentsData';

/**
 * 生徒詳細情報取得フック
 * 指定したIDの生徒の詳細情報を取得する
 */
export function useStudentDetail(studentId: string | null) {
  // JSONを返すフェッチャーを明示的に定義
  const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'APIリクエストに失敗しました');
    }
    return res.json();
  };

  const { data, error, isLoading, mutate } = useSWR<Student>(
    studentId ? `/api/teacher/students/${studentId}` : null,
    fetcher,
    {
      suspense: false,
      revalidateOnFocus: false,
      errorRetryCount: 2,
    },
  );

  // デバッグ情報
  useEffect(() => {
    if (studentId) {
      console.log(`[useStudentDetail] 生徒ID: ${studentId}`);
    }
    if (data) {
      console.log('[useStudentDetail] 生徒データ:', data);
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
