import type { Mood } from './mood';

export interface LearningActivity {
  // timestamp: string; TODO: Apps Script側でつける
  score: number;
  duration: number;
  activityDate: string;
  userId: string; // Apps Script側でやるとAPI呼び出しのオーバーヘッドがあるので
  memo?: string;
  mood?: Mood;
}
