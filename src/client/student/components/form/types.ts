import type { MemoData } from '@/shared/types/memo';
import type { Mood } from '@/shared/types/mood';

export interface FormData {
  'target-date-btn': string;
  study_time: {
    hour: number;
    minutes: number;
    seconds: number;
  };
  score: number;
  mood: Mood | '';
  memo: MemoData[];
  activityType: string[];
}
