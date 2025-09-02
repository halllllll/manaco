import type { UserWithActivities } from './user';

/**
 * 教員ダッシュボードで使用するヒートマップの日付データ型
 */
export type HeatmapDay = {
  date: string;
  // displayDate: string;
  activities: Record<string, boolean>;
};

/**
 * クラス/グループ型
 */
export type ClassGroup = {
  id: string;
  name: string;
  grade: number;
};

/**
 * 教員ダッシュボードの概要データ型
 */
export type TeacherDashboardData = {
  totalStudents: number;
  todayActivities: number;
  weekActivities: number;
  activityHeatmap: HeatmapDay[];
};

/**
 * 教員ダッシュボードレスポンス型
 */
export type TeacherDashboardDTO =
  | {
      success: true;
      data: TeacherDashboardData;
    }
  | {
      success: false;
      message: string;
      details?: string;
    };

/**
 * 生徒一覧レスポンス型
 */
export type TeacherStudentsDTO =
  | {
      success: true;
      data: UserWithActivities[];
    }
  | {
      success: false;
      message: string;
      details?: string;
    };

/**
 * 生徒詳細レスポンス型
 */
export type TeacherStudentDetailDTO =
  | {
      success: true;
      data: UserWithActivities | null;
    }
  | {
      success: false;
      message: string;
      details?: string;
    };
