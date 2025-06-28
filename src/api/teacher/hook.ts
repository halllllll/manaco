import type { TeacherDashboardData } from '@/shared/types/teacher';
import type { User, UserWithActivities } from '@/shared/types/user';
import useSWR from 'swr';
import { serverFunctions } from '../serverFunctions';
import { TeacherAPI } from './teacherApi';

/**
 * ログイン中の教員情報を取得するカスタムフック
 */
export const useCurrentTeacher = () => {
  const { data, error, isLoading } = useSWR('currentTeacher', () => serverFunctions.getUser(), {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1分間キャッシュ
  });

  const teacher: User | null | undefined = data?.success ? data.data : undefined;

  return { data: teacher, error, isLoading };
};

/**
 * 教師用ダッシュボードデータを取得するカスタムフック
 */
export const useTeacherDashboard = () => {
  const { data, error, isLoading, mutate } = useSWR(
    ['teacherDashboard'],
    () => TeacherAPI.getDashboard(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    },
  );

  const dashboardData: TeacherDashboardData | undefined = data?.success ? data.data : undefined;

  return {
    data: dashboardData,
    error,
    isLoading,
    mutate,
  };
};

/**
 * 教師用生徒リストを取得するカスタムフック
 * @param classFilter 対象のクラス（省略時は全クラス）
 */
export const useTeacherStudents = () => {
  const { data, error, isLoading, mutate } = useSWR(
    ['teacherStudents'],
    () => TeacherAPI.getStudents(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    },
  );

  const students: UserWithActivities[] | undefined = data?.success ? data.data : undefined;

  return {
    data: students,
    error,
    isLoading,
    mutate,
  };
};

/**
 * 利用可能なクラス/グループリストを取得するカスタムフック
 */
export const useTeacherClasses = () => {
  const { data: students, isLoading, error } = useTeacherStudents();

  const classes = (
    students
      ? Array.from(new Set(students.map((student) => student.belonging))).map((belonging) => ({
          id: belonging,
          name: belonging,
        }))
      : []
  ).sort((a, b) => a.name.localeCompare(b.name));

  return {
    data: classes,
    error,
    isLoading,
  };
};

/**
 * 生徒詳細情報を取得するカスタムフック
 * @param studentId 生徒ID
 */
export const useTeacherStudentDetail = (studentId: string | null) => {
  const { data, error, isLoading, mutate } = useSWR(
    studentId ? ['teacherStudentDetail', studentId] : null,
    () => (studentId ? TeacherAPI.getStudentDetail(studentId) : null),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  );

  const student: UserWithActivities | null | undefined = data?.success ? data.data : undefined;

  return {
    data: student,
    error,
    isLoading,
    mutate,
  };
};
