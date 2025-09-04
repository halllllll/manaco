import type { ActivityItem } from '@/shared/types/activity';
import type { Memo, MemoData } from '@/shared/types/memo';
import type { Mood } from '@/shared/types/mood';

export interface StudyTime {
  hour: number;
  minutes: number;
  seconds: number;
}

export interface StudentFormData {
  'target-date-btn': string;
  study_time: StudyTime;
  score: number;
  mood: Mood | '';
  memo: MemoData[];
  activityType: string[];
}

export interface FormSettings {
  showStudyTime: boolean;
  showSecond: boolean;
  showScore: boolean;
  showMood: boolean;
  showMemo: boolean;
  scoreMin?: number;
  scoreMax?: number;
  activityType?: ActivityItem[];
  memoFields?: Memo[];
}
