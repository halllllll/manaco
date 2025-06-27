import { type FC, useEffect, useState } from 'react';

/**
 * 現在のログイン教員名を表示するコンポーネント
 */
export const CurrentTeacherName: FC = () => {
  const [teacherName, setTeacherName] = useState<string>('ロード中...');

  useEffect(() => {
    const fetchCurrentTeacher = async () => {
      try {
        const response = await fetch('/api/teacher/current');
        if (!response.ok) {
          throw new Error('Failed to fetch current teacher');
        }
        const teacher = await response.json();
        setTeacherName(teacher.name);
      } catch (error) {
        console.error('Error fetching teacher:', error);
        setTeacherName('不明');
      }
    };

    fetchCurrentTeacher();
  }, []);

  return <div className="text-sm">ユーザー: {teacherName}</div>;
};
