import type { Mood } from './mood';

// export interface StudyTimeInput {
//   hour: number;
//   minute: number;
//   second: number;
// }

export interface LearningActivity {
  activityDate: string;
  // studyTime: StudyTimeInput;
  duration: number; // 秒単位
  score: number;
  mood?: Mood;
  memo?: string;
}

export interface LearningActivityRequest {
  // timestamp: string; TODO: Apps Script側でつける
  score: number;
  duration: number;
  activityDate: string;
  userId: string; // Apps Script側でやるとAPI呼び出しのオーバーヘッドがあるので
  mood?: Mood;
  memo?: string;
}

// export type LearningActivityLog = Omit<LearningActivity, 'userId'> & {
//   timestamp: string;
//   mail_adress: string;
// };
