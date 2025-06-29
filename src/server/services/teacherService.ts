import { getAllActivityLogs } from '@/server/repositories/activityRepository';
import { getAllUsers, getUserById } from '@/server/repositories/userRepository';
import { HEATMAP_DAYS_COUNT } from '@/shared/constants/heatmap';
import type { LearningActivity } from '@/shared/types/activity';
import type { HeatmapDay, TeacherDashboardData } from '@/shared/types/teacher';
import type { UserWithActivities } from '@/shared/types/user'; // UserWithActivitiesをインポート

/**
 * 教師用ダッシュボードデータを取得するサービス関数
 */
export function getTeacherDashboardService(): TeacherDashboardData {
  const allUsers = getAllUsers();
  const students = allUsers.filter((user) => user.role === 'student');

  const totalStudents = students.length;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // 日の始まりに正規化

  // ヒートマップ期間の開始日を計算 (今日を含めてHEATMAP_DAYS_COUNT日間)
  const heatmapStartDate = new Date(today);
  heatmapStartDate.setDate(today.getDate() - (HEATMAP_DAYS_COUNT - 1));
  heatmapStartDate.setHours(0, 0, 0, 0); // 日の始まりに正規化

  let todayActivities = 0;
  let periodActivities = 0; // HEATMAP_DAYS_COUNT期間内の活動数

  // すべての活動データを一度に取得
  const allActivities = getAllActivityLogs();

  // ヒートマップのデータ構造を初期化
  const activityHeatmap: HeatmapDay[] = [];
  // 日付文字列をキーとしてHeatmapDayオブジェクトを素早く参照するためのマップ
  const heatmapDateMap = new Map<string, HeatmapDay>();

  for (let i = 0; i < HEATMAP_DAYS_COUNT; i++) {
    const currentDate = new Date(heatmapStartDate);
    currentDate.setDate(heatmapStartDate.getDate() + i);
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const dateString = `${year}-${month}-${day}`; // YYYY-MM-DD形式

    // 曜日を取得
    const dayOfWeekNames = ['日', '月', '火', '水', '木', '金', '土'];
    const dayOfWeek = dayOfWeekNames[currentDate.getDay()];

    const dayData: HeatmapDay = {
      date: dateString,
      displayDate: `${currentDate.getMonth() + 1}/${currentDate.getDate()}`,
      dayOfWeek,
      activities: {}, // 生徒IDをキーとして活動の有無を格納
    };
    activityHeatmap.push(dayData);
    heatmapDateMap.set(dateString, dayData);
  }  // 全ての活動を一度だけループして、カウンターとヒートマップを更新
  console.info('Processing activities for heatmap...');
  console.info(`Total activities to process: ${allActivities.length}`);
  console.info(`Students count: ${students.length}`);
  console.info(`Heatmap period: ${heatmapStartDate.toISOString().split('T')[0]} to ${today.toISOString().split('T')[0]}`);
  
  // biome-ignore lint/complexity/noForEach: <explanation>
  allActivities.forEach((activity) => {
    const activityDate = new Date(activity.activityDate);
    activityDate.setHours(0, 0, 0, 0); // 日の始まりに正規化

    // 今日の活動数をカウント
    if (activityDate.getTime() === today.getTime()) {
      todayActivities++;
    }

    // ヒートマップ期間内の活動数をカウントし、ヒートマップデータを更新
    if (activityDate >= heatmapStartDate && activityDate <= today) {
      periodActivities++;

      // activity.activityDateは文字列形式なので、そのまま使用
      const dateString = activity.activityDate;
      const dayData = heatmapDateMap.get(dateString);

      // その活動が学生のものであることを確認
      if (dayData && students.some((s) => s.id === activity.userId)) {
        dayData.activities[activity.userId] = true; // その日に生徒が活動したことをマーク
        console.info(`Activity marked: date=${dateString}, userId=${activity.userId}`);
      } else if (!dayData) {
        console.warn(`No dayData found for date: ${dateString}`);
      } else {
        console.warn(`User ${activity.userId} is not a student or not found`);
      }
    }
  });

  console.info('Final heatmap data:', JSON.stringify(activityHeatmap, null, 2));

  const result: TeacherDashboardData = {
    totalStudents,
    todayActivities,
    weekActivities: periodActivities, // TeacherDashboardDataの型に合わせてweekActivitiesを使用
    activityHeatmap,
  };

  console.info('Server: getTeacherDashboardService result:', JSON.stringify(result));

  return result;
}

/**
 * 教師用生徒リストを取得するサービス関数
 */
export function getTeacherStudentsService(): UserWithActivities[] {
  const allUsers = getAllUsers(); // 全ユーザーを一度取得
  const allActivities = getAllActivityLogs(); // 全活動ログを一度取得

  // 生徒の活動を生徒IDでグループ化
  const activitiesByStudentId = new Map<string, LearningActivity[]>();
  // biome-ignore lint/complexity/noForEach: <explanation>
  allActivities.forEach((activity) => {
    if (!activitiesByStudentId.has(activity.userId)) {
      activitiesByStudentId.set(activity.userId, []);
    }
    activitiesByStudentId.get(activity.userId)?.push(activity);
  });

  const students = allUsers.filter((user) => user.role === 'student');

  return students.map((student) => ({
    ...student,
    activities: activitiesByStudentId.get(student.id) || [], // マップから活動を取得
  }));
}

/**
 * 特定の生徒の詳細情報を取得するサービス関数
 * @param studentId 生徒ID
 */
export function getTeacherStudentDetailService(studentId: string): UserWithActivities | null {
  const student = getUserById(studentId);
  if (student && student.role === 'student') {
    // ここでは個々の生徒のアクティビティが必要なので、getActivitiesByUserIdを使用
    const allActivities = getAllActivityLogs();
    const studentActivities = allActivities.filter((activity) => activity.userId === studentId);

    return {
      ...student,
      activities: studentActivities,
    };
  }
  return null;
}
