import { getActivitiesByUserId } from '@/server/repositories/activityRepository';
import { getAllUsers, getUserById } from '@/server/repositories/userRepository';
import type { HeatmapDay, TeacherDashboardData } from '@/shared/types/teacher';
import type { UserWithActivities } from '@/shared/types/user';

/**
 * 教師用ダッシュボードデータを取得するサービス関数
 * @param classFilter 対象のクラス（省略時は全クラス）
 */
export function getTeacherDashboardService(): TeacherDashboardData {
  const allUsers = getAllUsers();
  const students = allUsers.filter((user) => user.role === 'student');

  const totalStudents = students.length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6); // 過去7日間（今日を含む）

  let todayActivities = 0;
  let weekActivities = 0;
  const activityCountsByDate: { [date: string]: number } = {};

  // biome-ignore lint/complexity/noForEach: <explanation>
  students.forEach((student) => {
    const activities = getActivitiesByUserId(student.id);
    // biome-ignore lint/complexity/noForEach: <explanation>
    activities.forEach((activity) => {
      const activityDate = new Date(activity.activityDate);
      activityDate.setHours(0, 0, 0, 0);

      if (activityDate.getTime() === today.getTime()) {
        todayActivities++;
      }

      if (activityDate >= sevenDaysAgo && activityDate <= today) {
        weekActivities++;
        const dateString = activityDate.toISOString().split('T')[0];
        activityCountsByDate[dateString] = (activityCountsByDate[dateString] || 0) + 1;
      }
    });
  });

  const activityHeatmap: HeatmapDay[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(sevenDaysAgo);
    date.setDate(sevenDaysAgo.getDate() + i);
    const dateString = date.toISOString().split('T')[0];
    activityHeatmap.push({
      date: dateString,
      displayDate: `${date.getMonth() + 1}/${date.getDate()}`,
      activities: activityCountsByDate[dateString] > 0 ? { hasActivity: true } : {},
    });
  }

  return {
    totalStudents,
    todayActivities,
    weekActivities,
    activityHeatmap,
  };
}

/**
 * 教師用生徒リストを取得するサービス関数
 */
export function getTeacherStudentsService(): UserWithActivities[] {
  const allUsers = getAllUsers();
  const students = allUsers.filter((user) => user.role === 'student');
  console.log('students???');
  console.log(students);
  return students.map((student) => ({
    ...student,
    activities: getActivitiesByUserId(student.id),
  }));
}

/**
 * 特定の生徒の詳細情報を取得するサービス関数
 * @param studentId 生徒ID
 */
export function getTeacherStudentDetailService(studentId: string): UserWithActivities | null {
  const student = getUserById(studentId);
  if (student && student.role === 'student') {
    return {
      ...student,
      activities: getActivitiesByUserId(student.id),
    };
  }
  return null;
}
