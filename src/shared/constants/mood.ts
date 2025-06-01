import type { Mood } from '../types/mood';

export interface MoodOption {
  value: Mood;
  emoji: string;
  label: string;
  color: string;
}

export const MOOD_OPTIONS: MoodOption[] = [
  { value: 'happy', emoji: '😄', label: 'たのしかった！', color: 'bg-success/20' },
  { value: 'normal', emoji: '😊', label: 'ふつう', color: 'bg-info/20' },
  { value: 'tired', emoji: '😓', label: 'つかれた', color: 'bg-warning/20' },
  { value: 'hard', emoji: '🤔', label: 'むずかしかった', color: 'bg-error/20' },
] as const;

/**
 * ムードに対応する絵文字を取得
 */
export const getMoodEmoji = (mood?: string): string => {
  if (!mood) return '';
  const moodOption = MOOD_OPTIONS.find((option) => option.value === mood);
  return moodOption ? moodOption.emoji : '';
};

/**
 * ムードのラベルを取得
 */
export const getMoodLabel = (mood?: string): string => {
  if (!mood) return '';
  const moodOption = MOOD_OPTIONS.find((option) => option.value === mood);
  return moodOption ? moodOption.label : '';
};
