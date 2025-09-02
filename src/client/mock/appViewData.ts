import type { ValidationResult } from '@/server/utils/validation';
import type { AppSettingResponseData } from '@/shared/types/dto';

// アプリ設定データ
export const mockAppSettingsData: Record<string, AppSettingResponseData> = {
  '1': {
    showScore: false,
    scoreMax: 100,
    scoreMin: 0,
    showMood: true,
    showMemo: true,
    showSecond: false,
    showStudyTime: false,
    showActivity: false,
  },
  '2': {
    showScore: true,
    scoreMax: 100,
    scoreMin: 0,
    showMood: false,
    showMemo: false,
    showSecond: true,
    showStudyTime: true,
    showActivity: true,
    activityItems: [
      { name: '授業', color: '#FF5733' },
      { name: '自習', color: '#33FF57' },
      { name: '課題', color: '#3357FF' },
      { name: '試験勉強', color: '#F1C40F' },
      { name: '読書', color: '#9B59B6' },
      { name: 'かんじのかきとり', color: '#8E44AD' },
      { name: '英語のリスニング', color: '#2ECC71' },
      { name: '数学の問題集', color: '#E67E22' },
      { name: '歴史の勉強', color: '#1ABC9C' },
      { name: '科学の実験', color: '#34495E' },
      { name: '音楽の練習', color: '#9B59B6' },
      { name: '体育のトレーニング', color: '#F39C12' },
      { name: '美術の作品制作', color: '#D35400' },
      { name: 'プログラミングの学習', color: '#2980B9' },
      { name: '地理の調査', color: '#8E44AD' },
      { name: '社会の研究', color: '#C0392B' },
    ],
  },
  '3': {
    showScore: false,
    scoreMax: 15,
    scoreMin: 0,
    showMood: true,
    showMemo: true,
    showSecond: true,
    showStudyTime: false,
    showActivity: true,
    activityItems: [
      { name: '授業', color: '#FF5733' },
      { name: '自習', color: '#33FF57' },
      { name: '課題', color: '#3357FF' },
      { name: '試験勉強', color: '#F1C40F' },
      { name: '読書', color: '#9B59B6' },
    ],
  },
  '4': {
    showScore: false,
    scoreMax: 50,
    scoreMin: 10,
    showMood: false,
    showMemo: true,
    showSecond: false,
    showStudyTime: true,
    showActivity: false,
  },
};

// health check用のデータ
export const mockHealthCheckData: Record<string, ValidationResult> = {
  '1': {
    isValid: false,
    messages: ['スプレッドシートが見つかりません。'],
    details: {
      sheetName: '（スプレッドシート名）',
      sheetId: '（スプレッドシートID）',
      sheetUrl: '（スプレッドシートURL）',
      sheetRange: '（スプレッドシートの範囲）',
      sheetHeaders: ['（スプレッドシートのヘッダー）'],
    },
  },
  '2': {
    isValid: true,
    messages: ['スプレッドシートが見つかりました。'],
    data: [[]],
  },
};
