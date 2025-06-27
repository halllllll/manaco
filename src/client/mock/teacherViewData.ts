import type { LearningActivity } from '@/shared/types/activity';
import type { Mood } from '@/shared/types/mood';
import type { ClassGroup } from '@/shared/types/teacher';
import type { User, UserRole } from '@/shared/types/user';

// additionalStudentsをインポートして正しい型に変換
import { additionalStudents as importedStudents } from './additionalStudents';

// 学習科目のリスト
const SUBJECTS = [
  '国語',
  '算数',
  '理科',
  '社会',
  '英語',
  '音楽',
  '図画工作',
  '体育',
  '総合',
  '読書',
  '自主学習',
  '宿題',
  'プログラミング',
  '漢字練習',
];

// 教員データ
export const mockTeachers: User[] = [
  {
    id: 'teacher-1',
    name: '山田先生',
    belonging: '職員室',
    role: 'teacher',
  },
  {
    id: 'teacher-2',
    name: '鈴木先生',
    belonging: '職員室',
    role: 'teacher',
  },
  {
    id: 'admin-1',
    name: '校長先生',
    belonging: '職員室',
    role: 'teacher',
  },
];

// クラスデータ
export const mockClasses: ClassGroup[] = [
  { id: 'class-1', name: '1年1組', grade: 1 },
  { id: 'class-2', name: '1年2組', grade: 1 },
  { id: 'class-3', name: '2年1組', grade: 2 },
  { id: 'class-4', name: '2年2組', grade: 2 },
  { id: 'class-5', name: '3年1組', grade: 3 },
  { id: 'class-6', name: '3年2組', grade: 3 },
  { id: 'class-7', name: '4年1組', grade: 4 },
  { id: 'class-8', name: '4年2組', grade: 4 },
  { id: 'class-9', name: '5年1組', grade: 5 },
  { id: 'class-10', name: '6年1組', grade: 6 },
];

// 既存の生徒データを正しい型にマッピング
const baseStudents: User[] = [
  // 1年1組の生徒
  {
    id: 'student-1',
    name: '佐藤太郎',
    belonging: 'class-1',
    role: 'student',
  },
  {
    id: 'student-2',
    name: '鈴木花子',
    belonging: 'class-1',
    role: 'student',
  },
  {
    id: 'student-3',
    name: '高橋次郎',
    belonging: 'class-1',
    role: 'student',
  },
  // 1年2組の生徒
  {
    id: 'student-4',
    name: '田中美咲',
    belonging: 'class-2',
    role: 'student',
  },
  {
    id: 'student-5',
    name: '伊藤大輔',
    belonging: 'class-2',
    role: 'student',
  },
  // 2年1組の生徒
  {
    id: 'student-6',
    name: '山本和樹',
    belonging: 'class-3',
    role: 'student',
  },
  {
    id: 'student-7',
    name: '小林さくら',
    belonging: 'class-3',
    role: 'student',
  },
];

// 追加の生徒データを正しい型に変換
const typedAdditionalStudents: User[] = importedStudents.map((student) => ({
  ...student,
  role: student.role as UserRole,
}));

// すべての生徒データを結合
export const mockStudents: User[] = [...baseStudents, ...typedAdditionalStudents];

// 学習活動データを生成する関数
const generateActivities = (): Record<string, LearningActivity[]> => {
  const activities: Record<string, LearningActivity[]> = {};

  // 現在の日付
  const now = new Date();

  // モック生徒の各々に学習活動を生成
  for (const student of mockStudents) {
    // この生徒の活動配列を初期化
    activities[student.id] = [];

    // 過去2ヶ月分のデータを生成
    for (let i = 0; i < 60; i++) {
      // 一部の日はデータを作らない（ランダムな欠損）
      if (Math.random() > 0.7) {
        continue;
      }

      // 日付を計算（今日から過去i日）
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // 一日に複数の活動を生成する可能性
      const activityCount = Math.random() > 0.8 ? Math.floor(Math.random() * 3) + 1 : 1;

      for (let j = 0; j < activityCount; j++) {
        // 教科をランダムに選択
        const subject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];

        // 学習活動データを生成
        const activity: LearningActivity = {
          activityDate: dateStr,
          duration: Math.floor(Math.random() * 3600) + 600, // 10分〜70分
          memo: Math.random() > 0.6 ? `${subject}の学習をしました。` : '',
          score: Math.floor(Math.random() * 100),
          subject: subject, // カスタムプロパティ（元の型にない）
        };

        // 50%の確率で気分も追加
        if (Math.random() > 0.5) {
          const moods: Mood[] = ['happy', 'normal', 'tired', 'hard'];
          activity.mood = moods[Math.floor(Math.random() * moods.length)];
        }

        activities[student.id].push(activity);
      }
    }
  }

  return activities;
};

// 学習活動データを生成
export const mockActivities = generateActivities();

// 教員ビュー用のデータをまとめたオブジェクト
export const mockTeacherData = {
  teachers: mockTeachers,
  classes: mockClasses,
  students: mockStudents,
  activities: mockActivities,
};
