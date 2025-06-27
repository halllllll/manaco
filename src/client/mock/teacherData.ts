// 型定義
type UserRole = 'teacher' | 'student' | 'admin' | 'guest';

// 基本ユーザー型定義
type User = {
  id: string;
  name: string;
  belonging?: string;
  role: UserRole;
};

// 生徒データ型
type Student = {
  id: string;
  name: string;
  belonging: string; // クラス名やグループ名
  role: UserRole;
};

// Mood型
type Mood = 1 | 2 | 3 | 4 | 5;

// 学習活動型
type LearningActivity = {
  activityDate: string;
  duration: number; // 秒単位
  score: number;
  mood?: Mood;
  memo?: string;
  activityType?: string[]; // 取り組みの種類
};

// 生徒グループ型
type ClassGroup = {
  id: string;
  name: string;
  grade: number;
};

// モックの生徒データ
export const mockStudents: Student[] = [
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
    name: '田中一郎',
    belonging: 'class-2',
    role: 'student',
  },
  {
    id: 'student-4',
    name: '山本美咲',
    belonging: 'class-2',
    role: 'student',
  },
  {
    id: 'student-5',
    name: '伊藤健太',
    belonging: 'class-3',
    role: 'student',
  },
];

// モックのクラスデータ
export const mockClasses: ClassGroup[] = [
  { id: 'class-1', name: '1年1組', grade: 1 },
  { id: 'class-2', name: '1年2組', grade: 1 },
  { id: 'class-3', name: '2年1組', grade: 2 },
];

// モックの学習記録データ
export const generateMockLearningActivities = (): Record<string, LearningActivity[]> => {
  const activitiesByUser: Record<string, LearningActivity[]> = {};
  const now = new Date();

  // 各生徒のデータを初期化
  for (const student of mockStudents) {
    activitiesByUser[student.id] = [];
  }

  // 過去30日分のデータを生成
  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const isoDate = date.toISOString().split('T')[0];

    // 各生徒ごとにランダムな記録を生成
    for (const student of mockStudents) {
      // 70%の確率で記録を作成
      if (Math.random() < 0.7) {
        const activity: LearningActivity = {
          activityDate: isoDate,
          duration: (Math.floor(Math.random() * 60) + 30) * 60, // 30〜90分（秒単位）
          score: Math.floor(Math.random() * 5) + 1, // 1〜5
          mood: (Math.floor(Math.random() * 5) + 1) as Mood, // 1〜5
          memo: `${date.toLocaleDateString('ja-JP')}の学習内容です。`,
          activityType: [['国語', '算数', '理科', '社会', '英語'][Math.floor(Math.random() * 5)]],
        };

        activitiesByUser[student.id].push(activity);
      }
    }
  }

  return activitiesByUser;
};

// モックの教員データ
export const mockTeachers = [
  {
    id: 'teacher-1',
    name: '山田先生',
    belonging: '1年担任',
    role: 'teacher' as UserRole,
  },
  {
    id: 'teacher-2',
    name: '鈴木先生',
    belonging: '2年担任',
    role: 'teacher' as UserRole,
  },
  {
    id: 'admin-1',
    name: '校長先生',
    belonging: '管理者',
    role: 'admin' as UserRole,
  },
];

// モックデータをエクスポート
export const mockTeacherData = {
  students: mockStudents,
  activities: generateMockLearningActivities(),
  classes: mockClasses,
  teachers: mockTeachers,
};
