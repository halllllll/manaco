import type { ClassGroup, TeacherDashboardData } from '@/shared/types/teacher';
import type { User, UserWithActivities } from '@/shared/types/user';
import useSWR from 'swr';
import { getApiPath } from '../endpoint';
import { TeacherAPI } from './teacherApi';

/**
 * ログイン中の教員情報を取得するカスタムフック
 */
export const useCurrentTeacher = () => {
  const url = getApiPath('TEACHER_CURRENT');
  const { data, error, isLoading } = useSWR(url, () => TeacherAPI.getCurrentTeacher(url), {
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
  const url = getApiPath('TEACHER_DASHBOARD', { class: classFilter });

  const { data, error, isLoading, mutate } = useSWR(url, () => TeacherAPI.getDashboard(url), {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  });

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
  const url = getApiPath('TEACHER_STUDENTS', { class: classFilter });

  const { data, error, isLoading, mutate } = useSWR(url, () => TeacherAPI.getStudents(url), {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  });

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
  const url = getApiPath('TEACHER_CLASSES');

  const { data, error, isLoading } = useSWR(url, () => TeacherAPI.getClasses(url), {
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
  const url = studentId ? getApiPath('TEACHER_STUDENTS', { studentId }) : null;

  const { data, error, isLoading, mutate } = useSWR(
    url,
    () => (url ? TeacherAPI.getStudentDetail(url) : null),
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
