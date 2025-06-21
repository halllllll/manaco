import type { Mood } from '@/shared/types/mood';

export interface StudyTime {
  hour: number;
  minutes: number;
  seconds: number;
}

export interface FormData {
  'target-date-btn': string;
  study_time: StudyTime;
  score: number;
  mood: Mood | '';
  memo: string;
}

export interface FormSettings {
  showStudyTime: boolean;
  showSecond: boolean;
  showScore: boolean;
  showMood: boolean;
  showMemo: boolean;
  scoreMin?: number;
  scoreMax?: number;
}
