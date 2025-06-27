// この型をexportしてadditionalStudentsのインポート前に型チェックができるようにする
export type UserRole = 'teacher' | 'student' | 'admin' | 'guest';

// additionalStudentsをインポートして正しい型に変換
import { additionalStudents as importedStudents } from './additionalStudents';
// 型キャストしてUserRole型を適用
const additionalStudents = importedStudents.map((student) => ({
  ...student,
  role: student.role as UserRole,
}));

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
  // 既存の生徒データ
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
    name: '高橋幸子',
    belonging: 'class-1',
    role: 'student',
  },
  {
    id: 'student-4',
    name: '田中誠',
    belonging: 'class-1',
    role: 'student',
  },
  {
    id: 'student-5',
    name: '渡辺涼太',
    belonging: 'class-1',
    role: 'student',
  },
  {
    id: 'student-6',
    name: '伊藤美穂',
    belonging: 'class-1',
    role: 'student',
  },
  {
    id: 'student-7',
    name: '小林翔太',
    belonging: 'class-1',
    role: 'student',
  },
  {
    id: 'student-8',
    name: '加藤春香',
    belonging: 'class-1',
    role: 'student',
  },
  // 1年2組の生徒
  {
    id: 'student-9',
    name: '吉田拓也',
    belonging: 'class-2',
    role: 'student',
  },
  {
    id: 'student-10',
    name: '山田里奈',
    belonging: 'class-2',
    role: 'student',
  },
  {
    id: 'student-11',
    name: '佐々木健',
    belonging: 'class-2',
    role: 'student',
  },
  {
    id: 'student-12',
    name: '山本真由',
    belonging: 'class-2',
    role: 'student',
  },
  {
    id: 'student-13',
    name: '中村大輔',
    belonging: 'class-2',
    role: 'student',
  },
  {
    id: 'student-14',
    name: '小川愛',
    belonging: 'class-2',
    role: 'student',
  },
  {
    id: 'student-15',
    name: '松本勇気',
    belonging: 'class-2',
    role: 'student',
  },
  // 2年1組の生徒
  {
    id: 'student-16',
    name: '井上和也',
    belonging: 'class-3',
    role: 'student',
  },
  {
    id: 'student-17',
    name: '木村美咲',
    belonging: 'class-3',
    role: 'student',
  },
  {
    id: 'student-18',
    name: '林健太',
    belonging: 'class-3',
    role: 'student',
  },
  {
    id: 'student-19',
    name: '清水美優',
    belonging: 'class-3',
    role: 'student',
  },
  {
    id: 'student-20',
    name: '山崎拓真',
    belonging: 'class-3',
    role: 'student',
  },
  {
    id: 'student-21',
    name: '中島さくら',
    belonging: 'class-3',
    role: 'student',
  },
  {
    id: 'student-22',
    name: '前田竜也',
    belonging: 'class-3',
    role: 'student',
  },
  // 2年2組の生徒
  {
    id: 'student-23',
    name: '藤田明日香',
    belonging: 'class-4',
    role: 'student',
  },
  {
    id: 'student-24',
    name: '斎藤雄大',
    belonging: 'class-4',
    role: 'student',
  },
  {
    id: 'student-25',
    name: '岡田真紀',
    belonging: 'class-4',
    role: 'student',
  },
  // 追加の生徒データをインポート
  ...additionalStudents,
];

// モックのクラスデータ
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

// 科目リスト（拡充）
const subjects = [
  '国語',
  '算数',
  '理科',
  '社会',
  '英語',
  '図工',
  '体育',
  '音楽',
  '道徳',
  '総合',
  'プログラミング',
  '外国語活動',
  '生活',
  '自由研究',
  '読書活動',
];

const feelings = [
  '楽しかったです。',
  '難しかったです。',
  'よく理解できました。',
  'もっと練習が必要です。',
  '自信がつきました。',
  '先生に質問したいことがあります。',
  'とても興味深かったです。',
  '次回も頑張りたいです。',
  'もっと学びたいと思いました。',
];

const difficulties = [
  'とても簡単でした。',
  '少し難しかったです。',
  'がんばりました。',
  '友達と一緒に解きました。',
  '何度も間違えましたが、最後までやりました。',
  '時間内に終わらせることができました。',
  '理解するのに時間がかかりましたが、最後はできました。',
];

const progress = [
  '半分終わりました。',
  '全部終わりました。',
  'まだ不安なところがあります。',
  '自信を持って解けるようになりました。',
  '明日も続きをやります。',
  '今日はよく集中できました。',
  '前回よりも理解度が上がりました。',
];

const activities = [
  '問題集',
  'ドリル',
  '課題',
  '発表準備',
  'グループワーク',
  '調べ学習',
  '実験',
  '読書',
  'タブレット学習',
  'プレゼンテーション',
  'ポスター作り',
  'オンライン学習',
  'パソコン演習',
];

const chapters = [
  '第1章',
  '第2章',
  '第3章',
  '単元1',
  '単元2',
  '今週の範囲',
  '前回の続き',
  '応用問題',
  '基礎演習',
  '総合問題',
];

const comments = [
  'とても勉強になりました。',
  'もう少し頑張る必要があります。',
  '次回も頑張ります。',
  '友達に教えてもらいました。',
  '先生に質問したいことが出てきました。',
  '難しかったけど楽しかったです。',
  '家でも続けて勉強したいです。',
  '前回より良くできました。',
  '自分のペースで進められました。',
];

// 学習成果
const results = [
  '良い成績を取る',
  '完成させる',
  '発表する',
  '理解を深める',
  '苦戦する',
  '楽しく取り組む',
  '協力して完成させる',
];

// ランダムメモ生成
const generateMemo = (subject: string): string => {
  // より多様なテンプレート
  const templates = [
    '今日は{subject}の{activity}に取り組みました。{feeling}',
    '{subject}の宿題を終わらせました。{difficulty}',
    '{subject}のテスト勉強をしました。{progress}',
    '{activity}をしながら{subject}を学びました。{comment}',
    '{subject}の{chapter}を復習しました。{feeling}',
    '{subject}のテストで{score}点取りました。{feeling}',
    '{subject}の{activity}で{result}しました。{comment}',
    '友達と{subject}の{activity}に取り組みました。{comment}',
    '{subject}の{chapter}を学びました。{difficulty}',
    '今日の{subject}の授業で学んだことをまとめました。{comment}',
  ];

  const template = templates[Math.floor(Math.random() * templates.length)];

  const result = results;

  return template
    .replace('{subject}', subject)
    .replace('{activity}', activities[Math.floor(Math.random() * activities.length)])
    .replace('{feeling}', feelings[Math.floor(Math.random() * feelings.length)])
    .replace('{difficulty}', difficulties[Math.floor(Math.random() * difficulties.length)])
    .replace('{progress}', progress[Math.floor(Math.random() * progress.length)])
    .replace('{chapter}', chapters[Math.floor(Math.random() * chapters.length)])
    .replace('{comment}', comments[Math.floor(Math.random() * comments.length)])
    .replace('{score}', String(Math.floor(Math.random() * 40) + 60))
    .replace('{result}', result[Math.floor(Math.random() * result.length)]);
};

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

    // 日によって活動確率を変える（休日は少なめ、平日は多め）
    const dayOfWeek = date.getDay(); // 0: 日, 1: 月, ..., 6: 土
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const activityProbability = isWeekend ? 0.4 : 0.75; // 休日は40%、平日は75%の確率で記録

    // 各生徒ごとにランダムな記録を生成
    for (const student of mockStudents) {
      // 科目数ランダム（1〜3科目）
      const subjectCount = Math.floor(Math.random() * 3) + 1;

      // ランダムに選んだ科目で活動を生成
      const selectedSubjects = [...subjects].sort(() => 0.5 - Math.random()).slice(0, subjectCount);

      // 確率に基づいて記録作成
      if (Math.random() < activityProbability) {
        // 生徒ごとの学習スタイルを反映
        const studentId = Number.parseInt(student.id.split('-')[1], 10);

        // 生徒IDに基づいて傾向を少し変える
        let baseDuration = 30; // 基本30分
        if (studentId % 3 === 0) baseDuration = 45; // より長めの勉強時間
        if (studentId % 4 === 0) baseDuration = 20; // より短めの勉強時間
        if (studentId % 7 === 0) baseDuration = 60; // かなり長めの勉強時間

        // 学年に応じて傾向を変える（学年が上がるほど勉強時間が長くなる）
        const classId = student.belonging;
        const gradeMatch = classId.match(/class-(\d+)/);
        if (gradeMatch) {
          const classNum = Number(gradeMatch[1]);
          // 3年生以上はベースの勉強時間を増やす
          if (classNum >= 5) {
            baseDuration += 15;
          }
          // 5年生以上はさらに増やす
          if (classNum >= 9) {
            baseDuration += 10;
          }
        }

        const activity: LearningActivity = {
          activityDate: isoDate,
          // 20〜90分の範囲でランダム（生徒の傾向を反映）
          duration: (Math.floor(Math.random() * 70) + baseDuration) * 60,
          // 1〜5のスコア（生徒ごとに偏りを持たせる）
          score: Math.min(
            5,
            Math.max(1, Math.floor(Math.random() * 4) + (studentId % 5 === 0 ? 1 : 2)),
          ),
          // ムード値（生徒によって傾向あり）
          mood: (Math.floor(Math.random() * 5) + 1) as Mood,
          // ランダム生成されたメモ
          memo: generateMemo(selectedSubjects[0]),
          // 選択された科目
          activityType: selectedSubjects,
        };

        activitiesByUser[student.id].push(activity);

        // より自然な学習パターン：
        // 1. 低学年(1-2年生): 10%の確率で2回目
        // 2. 中学年(3-4年生): 20%の確率で2回目、5%で3回目
        // 3. 高学年(5-6年生): 30%の確率で2回目、10%で3回目

        let secondActivityProbability = 0.1; // デフォルトは10%
        let thirdActivityProbability = 0; // デフォルトは0%

        // クラスに基づいて確率調整
        if (gradeMatch) {
          const classNum = Number(gradeMatch[1]);
          if (classNum >= 5 && classNum <= 8) {
            // 3-4年生
            secondActivityProbability = 0.2;
            thirdActivityProbability = 0.05;
          } else if (classNum >= 9) {
            // 5-6年生
            secondActivityProbability = 0.3;
            thirdActivityProbability = 0.1;
          }
        }

        // 2回目の活動
        if (Math.random() < secondActivityProbability && selectedSubjects.length > 1) {
          const secondActivity: LearningActivity = {
            activityDate: isoDate,
            duration: (Math.floor(Math.random() * 40) + 15) * 60, // 15〜55分
            score: Math.min(5, Math.max(1, activity.score + (Math.random() > 0.5 ? 1 : -1))),
            mood: (Math.floor(Math.random() * 5) + 1) as Mood,
            memo: generateMemo(selectedSubjects[1]),
            activityType: [selectedSubjects[1]],
          };

          activitiesByUser[student.id].push(secondActivity);

          // 3回目の活動
          if (Math.random() < thirdActivityProbability && selectedSubjects.length > 2) {
            const thirdActivity: LearningActivity = {
              activityDate: isoDate,
              duration: (Math.floor(Math.random() * 30) + 10) * 60, // 10〜40分
              score: Math.min(
                5,
                Math.max(1, secondActivity.score + (Math.random() > 0.5 ? 1 : -1)),
              ),
              mood: (Math.floor(Math.random() * 5) + 1) as Mood,
              memo: generateMemo(selectedSubjects[2]),
              activityType: [selectedSubjects[2]],
            };

            activitiesByUser[student.id].push(thirdActivity);
          }
        }
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
