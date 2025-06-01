import type { Mood } from './mood';

export interface LearningActivity {
  activityDate: string;
  duration: number; // 秒単位
  score: number;
  mood?: Mood;
  memo?: string;
}

export interface LearningActivityRequest extends LearningActivity {
  // timestamp: string; TODO: Apps Script側でつける
  userId: string; // Apps Script側でやるとAPI呼び出しのオーバーヘッドがあるので
}
