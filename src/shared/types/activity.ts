import type { Mood } from './mood';

export interface LearningActivity {
  activityDate: string;
  duration: number; // 秒単位
  score: number;
  mood?: Mood;
  memo?: string;
}

export interface LearningActivityRequest extends LearningActivity {
  userId: string; // Apps Script側でやるとAPI呼び出しのオーバーヘッドがあるので
}

export interface ActivityItem {
  name: string;
  color: string;
}
