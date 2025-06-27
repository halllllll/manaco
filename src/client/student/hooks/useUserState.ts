import { useDashboard } from '@/api/dashboard/hooks';
import { useSheetName, useSheetUrl } from '@/api/sheet/hooks';
import type { UserWithActivities } from '@/shared/types/user';
import { useMemo } from 'react';

export interface UserState {
  isLoading: boolean;
  error: Error | null;
  isRegistered: boolean;
  hasActivities: boolean;
  userData: UserWithActivities | null | undefined;
  sheetName: string | undefined;
  sheetUrl: string | undefined;
}

/**
 * ユーザーの状態を管理するカスタムフック
 */
export const useUserState = (): UserState => {
  const { data, error, isLoading } = useDashboard();
  const { data: sheetUrl } = useSheetUrl();
  const { data: sheetName } = useSheetName();

  const userState = useMemo(() => {
    const isRegistered = Boolean(data?.id && data?.name);
    const hasActivities = Boolean(data?.activities && data.activities.length > 0);

    return {
      isLoading,
      error,
      isRegistered,
      hasActivities,
      userData: data,
      sheetName,
      sheetUrl,
    };
  }, [data, error, isLoading, sheetName, sheetUrl]);

  return userState;
};
