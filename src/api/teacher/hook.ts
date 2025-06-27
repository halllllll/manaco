import type { ClassGroup, TeacherDashboardData } from '@/shared/types/teacher';
import type { User, UserWithActivities } from '@/shared/types/user';
import useSWR from 'swr';
import { getTeacherApiPath } from '../endpoint';
import { TeacherAPI } from './teacherApi';

/**
 * ログイン中の教員情報を取得するカスタムフック
 */
export const useCurrentTeacher = () => {
  const { data, error, isLoading } = useSWR('currentTeacher', TeacherAPI.getCurrentTeacher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1分間キャッシュ
  });

  const teacher: User | undefined = data?.success ? data.data : undefined;

  return { data: teacher, error, isLoading };
};

/**
 * 教師用ダッシュボードデータを取得するカスタムフック
 * @param classFilter 対象のクラス（省略時は全クラス）
 */
export const useTeacherDashboard = (classFilter?: string) => {
  const url = getTeacherApiPath('dashboard', { class: classFilter });

  const { data, error, isLoading, mutate } = useSWR(
    ['teacherDashboard', classFilter || 'all'],
    () => TeacherAPI.getDashboard(url),
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
export const useTeacherStudents = (classFilter?: string) => {
  const url = getTeacherApiPath('students', { class: classFilter });

  const { data, error, isLoading, mutate } = useSWR(
    ['teacherStudents', classFilter || 'all'],
    () => TeacherAPI.getStudents(url),
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
  const url = getTeacherApiPath('classes');

  const { data, error, isLoading } = useSWR('teacherClasses', () => TeacherAPI.getClasses(url), {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
  });

  const classes: ClassGroup[] | undefined = data?.success ? data.data : undefined;

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

  const student: UserWithActivities | undefined = data?.success ? data.data : undefined;

  return {
    data: student,
    error,
    isLoading,
    mutate,
  };
};
