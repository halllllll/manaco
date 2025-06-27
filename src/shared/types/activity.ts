import type { Mood } from './mood';

export interface LearningActivity {
  activityDate: string;
  duration: number; // 秒単位
  score: number;
  mood?: Mood;
  memo?: string;
  activityType?: string[]; // 取り組みの種類
  subject?: string; // 教科
  studentId?: string; // 生徒ID（教師ビューでのみ使用）
}

export interface LearningActivityRequest extends LearningActivity {
  userId: string; // Apps Script側でやるとAPI呼び出しのオーバーヘッドがあるので
}

export interface ActivityItem {
  name: string;
  color: string;
}
