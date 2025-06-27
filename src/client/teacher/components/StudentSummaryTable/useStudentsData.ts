import { useEffect } from 'react';
import useSWR from 'swr';

// Student型定義
export type Student = {
  id: string;
  name: string;
  belonging?: string;
  role: string;
  // 学習活動データ（型の不整合を避けるため、ゆるく定義）
  activities?: Array<{
    activityDate: string;
    duration: number;
    score: number;
    mood?: number | string; // APIの型と合わせる
    memo?: string;
    activityType?: string[];
    [key: string]: any; // その他のプロパティを許容
  }>;
};

/**
 * 生徒データ取得フック
 * クラスフィルター指定でAPI経由で生徒リストを取得
 */
export function useStudentsData(classFilter = 'all') {
  // JSONを返すフェッチャーを明示的に定義
  const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'APIリクエストに失敗しました');
    }
    const result = await res.json();

    // success/dataフォーマットを処理
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error('Invalid API response format');
  };

  const { data, error, isLoading } = useSWR<Student[]>(
    `/api/teacher/students?class=${classFilter}`,
    fetcher,
    {
      suspense: false, // Suspenseは使わず、コンポーネント内でローディング状態を処理
      revalidateOnFocus: false,
      errorRetryCount: 2,
    },
  );

  // デバッグ情報
  useEffect(() => {
    if (data) {
      console.log(`[useStudentsData] 取得した生徒数: ${data.length}`, data);
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
