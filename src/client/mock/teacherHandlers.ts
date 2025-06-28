import { HttpResponse, delay, http } from 'msw';

import { getApiPath } from '../../api/endpoint';
import { currentClassFilter, currentTeacherId } from './browser';
import { mockActivities, mockClasses, mockStudents, mockTeachers } from './teacherViewData';

import type { LearningActivity } from '@/shared/types/activity';
import type {
  TeacherDashboardDTO,
  TeacherDashboardData,
  TeacherStudentDetailDTO,
  TeacherStudentsDTO,
} from '@/shared/types/teacher';
import type { User, UserWithActivities } from '@/shared/types/user';

// 教師用APIのハンドラ
export const teacherHandlers = [
  

  // 全生徒リスト取得
  http.get(getApiPath('TEACHER_STUDENTS'), async ({ request }) => {
    console.info('--- mock api: teacher students ---');
    await delay(500);
    const url = new URL(request.url);
    const classFilter = url.searchParams.get('class') || currentClassFilter;
    console.log('[MSW] Students API called. Class filter:', classFilter);

    let students = [...mockStudents]; // 配列をコピー

    // クラスでフィルタリング
    if (classFilter !== 'all') {
      students = students.filter((s: User) => s.belonging === classFilter);
    }

    // 学習活動データを付加した生徒リストを作成
    const studentsWithActivities: UserWithActivities[] = students.map((student: User) => {
      const activities = mockActivities[student.id] || [];
      return {
        ...student,
        activities,
      };
    });

    // ★ デバッグログを追加
    console.log('[MSW Teacher Students Response]', {
      classFilter,
      count: studentsWithActivities.length,
      responseData: studentsWithActivities,
    });

    return HttpResponse.json({
      success: true,
      data: studentsWithActivities,
    } as TeacherStudentsDTO);
  }),

  // 生徒の詳細情報取得（ID指定）
  http.get(getApiPath('TEACHER_STUDENTS', { studentId: ':id' }), async ({ params }) => {
    console.info('--- mock api: teacher student detail ---');
    await delay(400);

    const id = params.id;

    if (!id) {
      return HttpResponse.json(
        {
          success: false,
          message: 'Student ID is required',
        } as TeacherStudentDetailDTO,
        { status: 400 },
      );
    }

    const student = mockStudents.find((s: User) => s.id === id);

    if (!student) {
      return HttpResponse.json(
        {
          success: false,
          message: 'Student not found',
        } as TeacherStudentDetailDTO,
        { status: 404 },
      );
    }

    // 生徒の学習活動データを取得
    const activities = mockActivities[student.id] || [];

    // 生徒情報と学習活動データを結合
    const studentWithActivities: UserWithActivities = {
      ...student,
      activities,
    };

    return HttpResponse.json({
      success: true,
      data: studentWithActivities,
    } as TeacherStudentDetailDTO);
  }),

  

  // 学習活動の概要データ取得（ダッシュボード用）
  http.get(getApiPath('TEACHER_DASHBOARD'), async () => {
    console.info('--- mock api: teacher dashboard ---');
    await delay(600);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      .toISOString()
      .split('T')[0];

    // 今週の日曜日を計算
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    const startOfWeekStr = startOfWeek.toISOString().split('T')[0];

    // 対象の生徒をフィルタリング
    const targetStudents = mockStudents;

    console.log(`[MSW] Filtered students for dashboard: ${targetStudents.length} students`);

    let totalActivitiesToday = 0;
    let totalActivitiesThisWeek = 0;

    // 各生徒の活動を集計
    for (const student of targetStudents) {
      const studentActivities = mockActivities[student.id] || [];

      // 今日の活動
      const todayActivities = studentActivities.filter(
        (activity: LearningActivity) => activity.activityDate === today,
      );
      totalActivitiesToday += todayActivities.length;

      // 今週の活動
      const weekActivities = studentActivities.filter(
        (activity: LearningActivity) => activity.activityDate >= startOfWeekStr,
      );
      totalActivitiesThisWeek += weekActivities.length;
    }

    // 10日間の活動ヒートマップを作成
    const activityHeatmap = createActivityHeatmap(targetStudents, now);

    const dashboardData: TeacherDashboardData = {
      totalStudents: targetStudents.length,
      todayActivities: totalActivitiesToday,
      weekActivities: totalActivitiesThisWeek,
      activityHeatmap,
    };

    // ★ デバッグログを追加
    console.log('[MSW Teacher Dashboard Response]', {
      responseData: dashboardData,
    });

    return HttpResponse.json({
      success: true,
      data: dashboardData,
    } as TeacherDashboardDTO);
  }),
];

// --- ヘルパー関数 ---

/**
 * 指定された生徒リストと基準日から、過去10日間の活動ヒートマップデータを生成する
 * @param students 対象の生徒リスト
 * @param baseDate 基準日
 * @returns ヒートマップデータ
 */
const createActivityHeatmap = (students: User[], baseDate: Date) => {
  const heatmap = [];
  for (let i = 0; i < 10; i++) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const dayData = {
      date: dateStr,
      displayDate: `${date.getMonth() + 1}/${date.getDate()}`,
      activities: {} as Record<string, boolean>,
    };

    for (const student of students) {
      const studentActivities = mockActivities[student.id] || [];
      dayData.activities[student.id] = studentActivities.some(
        (activity) => activity.activityDate === dateStr,
      );
    }
    heatmap.push(dayData);
  }
  return heatmap;
};
