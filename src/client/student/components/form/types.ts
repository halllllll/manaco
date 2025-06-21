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
  memo: string;
}

export const getDefaultFormValues = (): FormData => ({
  'target-date-btn': new Date().toISOString().split('T')[0],
  study_time: {
    hour: 0,
    minutes: 0,
    seconds: 0,
  },
  score: 0,
  mood: '',
  memo: '',
});

export const calculateDuration = (studyTime: FormData['study_time']) => {
  return studyTime.hour * 3600 + studyTime.minutes * 60 + studyTime.seconds;
};
