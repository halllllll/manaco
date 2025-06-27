import { HttpResponse, delay, http } from 'msw';

import { currentClassFilter, currentTeacherId } from './browser';
import { mockActivities, mockClasses, mockStudents, mockTeachers } from './teacherData';

import type { LearningActivity } from '@/shared/types/activity';
import type {
  TeacherClassesDTO,
  TeacherCurrentDTO,
  TeacherDashboardDTO,
  TeacherDashboardData,
  TeacherStudentDetailDTO,
  TeacherStudentsDTO,
} from '@/shared/types/teacher';
import type { User, UserWithActivities } from '@/shared/types/user';

// 教師用APIのハンドラ
export const teacherHandlers = [
  // 現在のログイン中の教員情報取得
  http.get('/api/teacher/current', async () => {
    console.info('--- mock api: teacher current ---');
    await delay(300);
    const teacher = mockTeachers.find((t: User) => t.id === currentTeacherId);

    if (!teacher) {
      return HttpResponse.json({
        success: false,
        message: 'Teacher not found',
      } as TeacherCurrentDTO);
    }

    return HttpResponse.json({
      success: true,
      data: teacher,
    } as TeacherCurrentDTO);
  }),

  // 全生徒リスト取得
  http.get('/api/teacher/students', async ({ request }) => {
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

    console.log('[MSW] Returning students with activities:', studentsWithActivities.length);
    if (studentsWithActivities.length > 0) {
      console.log(
        '[MSW] First student activities:',
        studentsWithActivities[0].activities?.length || 0,
      );
    }

    return HttpResponse.json({
      success: true,
      data: studentsWithActivities,
    } as TeacherStudentsDTO);
  }),

  // 生徒の詳細情報取得（ID指定）
  http.get('/api/teacher/students/:id', async ({ params }) => {
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

  // クラス一覧取得
  http.get('/api/teacher/classes', async () => {
    console.info('--- mock api: teacher classes ---');
    await delay(300);

    return HttpResponse.json({
      success: true,
      data: mockClasses,
    } as TeacherClassesDTO);
  }),

  // 学習活動の概要データ取得（ダッシュボード用）
  http.get('/api/teacher/dashboard', async ({ request }) => {
    console.info('--- mock api: teacher dashboard ---');
    console.log('Request URL:', request.url);
    await delay(600);
    const url = new URL(request.url);
    const classFilter = url.searchParams.get('class') || currentClassFilter;

    console.log('[MSW] Dashboard API called. Class filter:', classFilter);

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
    const targetStudents =
      classFilter !== 'all'
        ? mockStudents.filter((s: User) => s.belonging === classFilter)
        : mockStudents;

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

    // 直近10日間の活動状況を集計
    const last10Days = [];
    for (let i = 0; i < 10; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayData = {
        date: dateStr,
        displayDate: `${date.getMonth() + 1}/${date.getDate()}`,
        activities: {} as Record<string, boolean>,
      };

      // 各生徒の活動状況
      for (const student of targetStudents) {
        const studentActivities = mockActivities[student.id] || [];
        const hasActivity = studentActivities.some(
          (activity: LearningActivity) => activity.activityDate === dateStr,
        );

        dayData.activities[student.id] = hasActivity;
      }

      last10Days.push(dayData);
    }

    const dashboardData: TeacherDashboardData = {
      totalStudents: targetStudents.length,
      todayActivities: totalActivitiesToday,
      weekActivities: totalActivitiesThisWeek,
      activityHeatmap: last10Days,
    };

    console.log('[MSW] Dashboard response data prepared:', {
      students: dashboardData.totalStudents,
      todayActivities: dashboardData.todayActivities,
      weekActivities: dashboardData.weekActivities,
      heatmapDays: dashboardData.activityHeatmap.length,
    });

    return HttpResponse.json({
      success: true,
      data: dashboardData,
    } as TeacherDashboardDTO);
  }),
];
