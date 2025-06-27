import { useCurrentTeacher } from '@/api/teacher/hook';
import type { FC } from 'react';

/**
 * 現在のログイン教員名を表示するコンポーネント
 */
export const CurrentTeacherName: FC = () => {
  const { data: teacherData, isLoading } = useCurrentTeacher();

  if (isLoading) {
    return <div className="text-sm">読み込み中...</div>;
  }

  return <div className="text-sm">ユーザー: {teacherData?.name || '未設定'}</div>;
};
