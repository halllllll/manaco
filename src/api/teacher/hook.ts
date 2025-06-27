import type { User } from '@/shared/types/user';
import useSWR from 'swr';

/**
 * ログイン中の教員情報を取得するカスタムフック
 */
export const useCurrentTeacher = () => {
  const fetcher = async (): Promise<User | null> => {
    const response = await fetch('/api/teacher/current');
    const data = await response.json();
    return data.success ? data.data : null;
  };

  const { data, error, isLoading } = useSWR('currentTeacher', fetcher);

  return { data, error, isLoading };
};
