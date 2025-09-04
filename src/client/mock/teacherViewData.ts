import type { LearningActivity } from '@/shared/types/activity';
import type { ClassGroup } from '@/shared/types/teacher';
import type { User } from '@/shared/types/user';

// 教員データ
export const mockTeachers: User[] = [
  {
    id: 'teacher-1',
    name: '山田 太郎',
    belonging: '職員室',
    role: 'teacher',
  },
  {
    id: 'teacher-2',
    name: '鈴木 花子',
    belonging: '職員室',
    role: 'teacher',
  },
  {
    id: 'admin-1',
    name: '佐藤 校長',
    belonging: '校長室',
    role: 'teacher',
  },
];

// クラスデータ（14クラス）
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
  { id: 'class-10', name: '5年2組', grade: 5 },
  { id: 'class-11', name: '6年1組', grade: 6 },
  { id: 'class-12', name: '6年2組', grade: 6 },
  { id: 'class-13', name: '特別支援1組', grade: 0 }, // grade 0 for special classes
  { id: 'class-14', name: '帰国子女クラス', grade: 0 },
];

// 生徒データ（120名）
export const mockStudents: User[] = [
  // ... (Existing 80 students)
  { id: 'student-1', name: '佐藤 陽葵', belonging: 'class-1', role: 'student' },
  { id: 'student-2', name: '鈴木 湊', belonging: 'class-1', role: 'student' },
  { id: 'student-3', name: '高橋 凛', belonging: 'class-1', role: 'student' },
  { id: 'student-4', name: '田中 結衣', belonging: 'class-1', role: 'student' },
  { id: 'student-5', name: '伊藤 蓮', belonging: 'class-1', role: 'student' },
  { id: 'student-6', name: '渡辺 芽依', belonging: 'class-2', role: 'student' },
  { id: 'student-7', name: '山本 蒼', belonging: 'class-2', role: 'student' },
  { id: 'student-8', name: '中村 陽翔', belonging: 'class-2', role: 'student' },
  { id: 'student-9', name: '小林 莉子', belonging: 'class-2', role: 'student' },
  { id: 'student-10', name: '加藤 樹', belonging: 'class-2', role: 'student' },
  { id: 'student-11', name: '吉田 杏', belonging: 'class-3', role: 'student' },
  { id: 'student-12', name: '山田 大和', belonging: 'class-3', role: 'student' },
  { id: 'student-13', name: '佐々木 咲茉', belonging: 'class-3', role: 'student' },
  { id: 'student-14', name: '山口 朝陽', belonging: 'class-3', role: 'student' },
  { id: 'student-15', name: '松本 楓', belonging: 'class-3', role: 'student' },
  { id: 'student-16', name: '井上 陽菜', belonging: 'class-4', role: 'student' },
  { id: 'student-17', name: '木村 悠真', belonging: 'class-4', role: 'student' },
  { id: 'student-18', name: '林 美桜', belonging: 'class-4', role: 'student' },
  { id: 'student-19', name: '斎藤 新', belonging: 'class-4', role: 'student' },
  { id: 'student-20', name: '清水 結月', belonging: 'class-4', role: 'student' },
  { id: 'student-21', name: '山崎 伊織', belonging: 'class-5', role: 'student' },
  { id: 'student-22', name: '森 凪', belonging: 'class-5', role: 'student' },
  { id: 'student-23', name: '池田 律', belonging: 'class-5', role: 'student' },
  { id: 'student-24', name: '橋本 詩', belonging: 'class-5', role: 'student' },
  { id: 'student-25', name: '阿部 碧', belonging: 'class-5', role: 'student' },
  { id: 'student-26', name: '石川 湊斗', belonging: 'class-6', role: 'student' },
  { id: 'student-27', name: '中島 紬', belonging: 'class-6', role: 'student' },
  { id: 'student-28', name: '前田 蓮', belonging: 'class-6', role: 'student' },
  { id: 'student-29', name: '藤田 葵', belonging: 'class-6', role: 'student' },
  { id: 'student-30', name: '小川 陽向', belonging: 'class-6', role: 'student' },
  { id: 'student-31', name: '岡田 結菜', belonging: 'class-7', role: 'student' },
  { id: 'student-32', name: '後藤 暖', belonging: 'class-7', role: 'student' },
  { id: 'student-33', name: '長谷川 凛太郎', belonging: 'class-7', role: 'student' },
  { id: 'student-34', name: '村上 澪', belonging: 'class-7', role: 'student' },
  { id: 'student-35', name: '近藤 颯', belonging: 'class-7', role: 'student' },
  { id: 'student-36', name: '石井 結愛', belonging: 'class-8', role: 'student' },
  { id: 'student-37', name: '坂本 悠', belonging: 'class-8', role: 'student' },
  { id: 'student-38', name: '遠藤 翠', belonging: 'class-8', role: 'student' },
  { id: 'student-39', name: '青木 陽', belonging: 'class-8', role: 'student' },
  { id: 'student-40', name: '藤本 恵麻', belonging: 'class-8', role: 'student' },
  { id: 'student-41', name: '西村 悠人', belonging: 'class-9', role: 'student' },
  { id: 'student-42', name: '福田 莉緒', belonging: 'class-9', role: 'student' },
  { id: 'student-43', name: '太田 蒼大', belonging: 'class-9', role: 'student' },
  { id: 'student-44', name: '三浦 柑奈', belonging: 'class-9', role: 'student' },
  { id: 'student-45', name: '竹内 律', belonging: 'class-9', role: 'student' },
  { id: 'student-46', name: '中川 結翔', belonging: 'class-10', role: 'student' },
  { id: 'student-47', name: '岡本 紗奈', belonging: 'class-10', role: 'student' },
  { id: 'student-48', name: '松田 樹', belonging: 'class-10', role: 'student' },
  { id: 'student-49', name: '原田 唯', belonging: 'class-10', role: 'student' },
  { id: 'student-50', name: '小野 一颯', belonging: 'class-10', role: 'student' },
  { id: 'student-51', name: '田村 心春', belonging: 'class-11', role: 'student' },
  { id: 'student-52', name: '中山 瑛斗', belonging: 'class-11', role: 'student' },
  { id: 'student-53', name: '和田 莉愛', belonging: 'class-11', role: 'student' },
  { id: 'student-54', name: '森田 涼', belonging: 'class-11', role: 'student' },
  { id: 'student-55', name: '上野 柚葉', belonging: 'class-11', role: 'student' },
  { id: 'student-56', name: '千葉 蒼介', belonging: 'class-11', role: 'student' },
  { id: 'student-57', name: '岩崎 莉央', belonging: 'class-11', role: 'student' },
  { id: 'student-58', name: '宮崎 大輔', belonging: 'class-11', role: 'student' },
  { id: 'student-59', name: '桜井 美月', belonging: 'class-11', role: 'student' },
  { id: 'student-60', name: '高木 悠人', belonging: 'class-11', role: 'student' },
  { id: 'student-61', name: '安藤 咲希', belonging: 'class-12', role: 'student' },
  { id: 'student-62', name: '工藤 拓海', belonging: 'class-12', role: 'student' },
  { id: 'student-63', name: '大塚 菜々', belonging: 'class-12', role: 'student' },
  { id: 'student-64', name: '杉山 蓮', belonging: 'class-12', role: 'student' },
  { id: 'student-65', name: '丸山 結', belonging: 'class-12', role: 'student' },
  { id: 'student-66', name: '増田 健太', belonging: 'class-12', role: 'student' },
  { id: 'student-67', name: '小島 明里', belonging: 'class-12', role: 'student' },
  { id: 'student-68', name: '水野 颯太', belonging: 'class-12', role: 'student' },
  { id: 'student-69', name: '野村 優衣', belonging: 'class-12', role: 'student' },
  { id: 'student-70', name: '谷口 陽', belonging: 'class-12', role: 'student' },
  { id: 'student-71', name: '浜田 恵', belonging: 'class-1', role: 'student' },
  { id: 'student-72', name: '市川 陸', belonging: 'class-2', role: 'student' },
  { id: 'student-73', name: '菊地 玲奈', belonging: 'class-3', role: 'student' },
  { id: 'student-74', name: '久保田 翔', belonging: 'class-4', role: 'student' },
  { id: 'student-75', name: '川崎 乃愛', belonging: 'class-5', role: 'student' },
  { id: 'student-76', name: '横山 悠斗', belonging: 'class-6', role: 'student' },
  { id: 'student-77', name: '松井 琴音', belonging: 'class-7', role: 'student' },
  { id: 'student-78', name: '野口 航', belonging: 'class-8', role: 'student' },
  { id: 'student-79', name: '小山 栞', belonging: 'class-9', role: 'student' },
  { id: 'student-80', name: '今井 大雅', belonging: 'class-10', role: 'student' },
  { id: 'student-81', name: '藤井 美優', belonging: 'class-1', role: 'student' },
  { id: 'student-82', name: '岡田 大輝', belonging: 'class-2', role: 'student' },
  { id: 'student-83', name: '長田 結', belonging: 'class-3', role: 'student' },
  { id: 'student-84', name: '後藤 陸斗', belonging: 'class-4', role: 'student' },
  { id: 'student-85', name: '澤田 朱莉', belonging: 'class-5', role: 'student' },
  { id: 'student-86', name: '石田 涼介', belonging: 'class-6', role: 'student' },
  { id: 'student-87', name: '中山 莉緒', belonging: 'class-7', role: 'student' },
  { id: 'student-88', name: '岩田 蒼真', belonging: 'class-8', role: 'student' },
  { id: 'student-89', name: '上村 杏奈', belonging: 'class-9', role: 'student' },
  { id: 'student-90', name: '中田 翔', belonging: 'class-10', role: 'student' },
  { id: 'student-91', name: '小泉 楓', belonging: 'class-11', role: 'student' },
  { id: 'student-92', name: '渡部 陽菜', belonging: 'class-12', role: 'student' },
  { id: 'student-93', name: '大久保 蓮', belonging: 'class-1', role: 'student' },
  { id: 'student-94', name: '平井 結菜', belonging: 'class-2', role: 'student' },
  { id: 'student-95', name: '武田 悠', belonging: 'class-3', role: 'student' },
  { id: 'student-96', name: '桜田 美咲', belonging: 'class-4', role: 'student' },
  { id: 'student-97', name: '堀 颯真', belonging: 'class-5', role: 'student' },
  { id: 'student-98', name: '高山 芽生', belonging: 'class-6', role: 'student' },
  { id: 'student-99', name: '熊谷 湊', belonging: 'class-7', role: 'student' },
  { id: 'student-100', name: '河野 莉奈', belonging: 'class-8', role: 'student' },
  { id: 'student-101', name: '大橋 奏太', belonging: 'class-9', role: 'student' },
  { id: 'student-102', name: '吉村 葵', belonging: 'class-10', role: 'student' },
  { id: 'student-103', name: '鎌田 樹', belonging: 'class-11', role: 'student' },
  { id: 'student-104', name: '三宅 玲奈', belonging: 'class-12', role: 'student' },
  { id: 'student-105', name: '高田 陸', belonging: 'class-1', role: 'student' },
  { id: 'student-106', name: '望月 咲良', belonging: 'class-2', role: 'student' },
  { id: 'student-107', name: '永井 悠斗', belonging: 'class-3', role: 'student' },
  { id: 'student-108', name: '大島 杏', belonging: 'class-4', role: 'student' },
  { id: 'student-109', name: '荒井 陽翔', belonging: 'class-5', role: 'student' },
  { id: 'student-110', name: '平山 莉子', belonging: 'class-6', role: 'student' },
  // 特別支援クラス
  { id: 'student-111', name: '内藤 誠', belonging: 'class-13', role: 'student' },
  { id: 'student-112', name: '金沢 優', belonging: 'class-13', role: 'student' },
  { id: 'student-113', name: '篠原 望', belonging: 'class-13', role: 'student' },
  // 帰国子女クラス
  { id: 'student-114', name: 'Alex Smith', belonging: 'class-14', role: 'student' },
  { id: 'student-115', name: 'Emily Brown', belonging: 'class-14', role: 'student' },
  { id: 'student-116', name: 'Chris Green', belonging: 'class-14', role: 'student' },
  { id: 'student-117', name: 'Sophia Wang', belonging: 'class-14', role: 'student' },
  { id: 'student-118', name: 'Daniel Kim', belonging: 'class-14', role: 'student' },
  { id: 'student-119', name: 'Olivia Garcia', belonging: 'class-14', role: 'student' },
  { id: 'student-120', name: 'Noah Martinez', belonging: 'class-14', role: 'student' },
];

// 日付生成ヘルパー（ランダムに現時点の月と前2ヶ月分の日付を生成）
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth(); // 0-based

/**
 * ランダムに現時点の月と前2ヶ月分の日付を生成する関数
 * @returns YYYY-MM-DD形式の日付文字列
 */
const generateRandomDate = (): string => {
  // 月オフセットをランダムに選択（0: 現在の月, -1: 1ヶ月前, -2: 2ヶ月前）
  const monthOffsets = [0, -1, -2];
  const randomOffset = monthOffsets[Math.floor(Math.random() * monthOffsets.length)];

  const targetDate = new Date(currentYear, currentMonth + randomOffset, 1);
  const targetYear = targetDate.getFullYear();
  const targetMonth = targetDate.getMonth() + 1; // 1-based

  // 対象月の日数を計算（例: 2月は28/29日など）
  const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
  const randomDay = Math.floor(Math.random() * daysInMonth) + 1; // 1からdaysInMonthまで

  return `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(randomDay).padStart(2, '0')}`;
};

// 学習活動データ
export const mockActivities: Record<string, LearningActivity[]> = {
  // ... (Existing activities for students 1-80)
  'student-1': [
    {
      activityDate: generateRandomDate(), // Random date within 3 months
      duration: 5400,
      score: 98,
      subject: '算数',
      memo: [{ label: '感想', value: '期末テストの復習。応用問題が解けた！' }],
      mood: 'happy',
    },
    {
      activityDate: generateRandomDate(), // Random date within 3 months
      duration: 4800,
      score: 92,
      subject: '国語',
      memo: [{ label: '感想', value: '漢字の書き取りと、長文読解' }],
    },
    {
      activityDate: generateRandomDate(), // Random date within 3 months
      duration: 5000,
      score: 95,
      subject: '理科',
      memo: [{ label: '感想', value: '実験レポートの清書。' }],
    },
    {
      activityDate: generateRandomDate(), // Random date within 3 months
      duration: 4500,
      score: 90,
      subject: '社会',
      memo: [{ label: '感想', value: '歴史の年号を暗記した。' }],
    },
    {
      activityDate: generateRandomDate(), // Random date within 3 months
      duration: 5200,
      score: 96,
      subject: '英語',
      memo: [{ label: '感想', value: '新しい文法の予習。' }],
    },
    {
      activityDate: generateRandomDate(), // Random date within 3 months
      duration: 3600,
      score: 88,
      subject: '読書',
      memo: [{ label: '感想', value: '偉人の伝記を読んだ。' }],
    },
    { activityDate: generateRandomDate(), duration: 4000, score: 91, subject: 'プログラミング' },
    { activityDate: generateRandomDate(), duration: 4800, score: 93, subject: '算数' },
  ],
  'student-2': [
    {
      activityDate: generateRandomDate(), // Random date within 3 months
      duration: 7200,
      score: 95,
      subject: '図画工作',
      memo: [{ label: '感想', value: 'コンクールの絵が完成！' }],
      mood: 'happy',
    },
    {
      activityDate: generateRandomDate(), // Random date within 3 months
      duration: 6800,
      score: 90,
      subject: '図画工作',
      memo: [{ label: '感想', value: '背景の色塗り' }],
    },
    { activityDate: generateRandomDate(), duration: 2200, score: 80, subject: '算数' },
    { activityDate: generateRandomDate(), duration: 3000, score: 85, subject: '読書' },
    {
      activityDate: generateRandomDate(),
      duration: 1800,
      score: 75,
      subject: '国語',
      mood: 'normal',
    },
  ],
  'student-15': [
    {
      activityDate: generateRandomDate(), // Random date within 3 months
      duration: 10800,
      score: 92,
      subject: '自主学習',
      memo: [{ label: '感想', value: '1週間の復習。苦手なところを重点的に。' }],
    },
    {
      activityDate: generateRandomDate(), // Random date within 3 months
      duration: 9000,
      score: 88,
      subject: 'プログラミング',
      memo: [{ label: '感想', value: '新しいゲーム作りに挑戦' }],
    },
    { activityDate: generateRandomDate(), duration: 12000, score: 95, subject: '自主学習' },
    { activityDate: generateRandomDate(), duration: 9500, score: 90, subject: '自主学習' },
  ],
  'student-20': [
    {
      activityDate: generateRandomDate(),
      duration: 1500,
      score: 70,
      subject: '宿題',
      mood: 'tired',
    },
    { activityDate: generateRandomDate(), duration: 1800, score: 72, subject: '宿題' },
    {
      activityDate: generateRandomDate(),
      duration: 1300,
      score: 65,
      subject: '宿題',
      mood: 'hard',
    },
    { activityDate: generateRandomDate(), duration: 1200, score: 60, subject: '宿題' },
  ],
  'student-33': [
    {
      activityDate: generateRandomDate(), // Random date within 3 months
      duration: 4000,
      score: 99,
      subject: '英語',
      memo: [{ label: '感想', value: 'オンライン英会話' }],
    },
    {
      activityDate: generateRandomDate(), // Random date within 3 months
      duration: 6000,
      score: 95,
      subject: 'プログラミング',
      memo: [{ label: '感想', value: '作ったアプリのデバッグ' }],
    },
    { activityDate: generateRandomDate(), duration: 5500, score: 92, subject: 'プログラミング' },
    { activityDate: generateRandomDate(), duration: 3800, score: 98, subject: '英語' }, // Changed to 1 month ago
    { activityDate: generateRandomDate(), duration: 5800, score: 94, subject: 'プログラミング' },
  ],
  'student-45': [
    {
      activityDate: generateRandomDate(), // Random date within 3 months
      duration: 1200,
      score: 55,
      subject: '算数',
      memo: [{ label: '感想', value: '全然集中できなかった' }],
      mood: 'hard',
    },
    {
      activityDate: generateRandomDate(),
      duration: 1000,
      score: 52,
      subject: '国語',
      mood: 'tired',
    },
    { activityDate: generateRandomDate(), duration: 1500, score: 60, subject: '理科' }, // Changed to 1 month ago
  ],
  'student-50': [],
  'student-62': [
    {
      activityDate: generateRandomDate(), // Random date within 3 months
      duration: 3000,
      score: 100,
      subject: '音楽',
      memo: [{ label: '感想', value: '合唱コンクールの練習' }],
    },
    {
      activityDate: generateRandomDate(), // Random date within 3 months
      duration: 3600,
      score: 100,
      subject: '体育',
      mood: 'happy',
      memo: [{ label: '感想', value: 'サッカーの試合で活躍！' }],
    },
    { activityDate: generateRandomDate(), duration: 2800, score: 100, subject: '音楽' }, // Changed to 2 months ago
    { activityDate: generateRandomDate(), duration: 4000, score: 100, subject: '体育' },
  ],
  'student-70': [
    { activityDate: generateRandomDate(), duration: 2500, score: 85, subject: '社会' },
    { activityDate: generateRandomDate(), duration: 2800, score: 88, subject: '理科' },
    { activityDate: generateRandomDate(), duration: 2600, score: 82, subject: '国語' },
    { activityDate: generateRandomDate(), duration: 3000, score: 90, subject: '算数' },
    { activityDate: generateRandomDate(), duration: 2700, score: 86, subject: '英語' },
    { activityDate: generateRandomDate(), duration: 2400, score: 80, subject: '宿題' },
  ],
  'student-80': [
    {
      activityDate: generateRandomDate(), // Random date within 3 months
      duration: 2000,
      score: 78,
      subject: '自主学習',
      memo: [{ label: '感想', value: '少しずつ頑張る' }],
    },
    { activityDate: generateRandomDate(), duration: 1800, score: 75, subject: '自主学習' },
    {
      activityDate: generateRandomDate(),
      duration: 900,
      score: 60,
      subject: '宿題',
      mood: 'tired',
    },
    {
      activityDate: generateRandomDate(),
      duration: 1000,
      score: 62,
      subject: '宿題',
      mood: 'tired',
    },
  ],

  'student-85': [
    {
      activityDate: generateRandomDate(), // Random date within 3 months
      duration: 5000,
      score: 100,
      subject: '読書',
      memo: [{ label: '感想', value: 'シリーズ最新刊を読破！' }],
    },
    { activityDate: generateRandomDate(), duration: 4800, score: 100, subject: '読書' },
    { activityDate: generateRandomDate(), duration: 5200, score: 100, subject: '読書' }, // Changed to 1 month ago
    { activityDate: generateRandomDate(), duration: 1800, score: 80, subject: '国語' },
  ],

  'student-92': [
    { activityDate: generateRandomDate(), duration: 1800, score: 70, subject: '宿題' },
    { activityDate: generateRandomDate(), duration: 2000, score: 75, subject: '宿題' },
    { activityDate: generateRandomDate(), duration: 1900, score: 72, subject: '宿題' },
  ],

  'student-100': [
    { activityDate: generateRandomDate(), duration: 4000, score: 90, subject: '自主学習' },
    { activityDate: generateRandomDate(), duration: 3800, score: 88, subject: '自主学習' },
    { activityDate: generateRandomDate(), duration: 4200, score: 92, subject: '自主学習' },
  ],

  'student-111': [
    {
      activityDate: generateRandomDate(), // Random date within 3 months
      duration: 900,
      score: 80,
      subject: '漢字練習',
      memo: [{ label: '感想', value: 'ゆっくり丁寧に書いた' }],
    },
    { activityDate: generateRandomDate(), duration: 1000, score: 85, subject: '計算ドリル' },
    { activityDate: generateRandomDate(), duration: 800, score: 78, subject: '音読' }, // Changed to 1 month ago
  ],
  'student-114': [
    {
      activityDate: generateRandomDate(), // Random date within 3 months
      duration: 3600,
      score: 100,
      subject: '英語',
      memo: [{ label: '感想', value: 'Native speaker' }],
    },
    {
      activityDate: generateRandomDate(), // Random date within 3 months
      duration: 1800,
      score: 70,
      subject: '国語',
      memo: [{ label: '感想', value: '漢字が難しい' }],
      mood: 'hard',
    },
    { activityDate: generateRandomDate(), duration: 2000, score: 75, subject: '社会' }, // Changed to 2 months ago
  ],
  // student-120: 最近入ってきた転校生
  'student-120': [
    {
      activityDate: generateRandomDate(), // Random date within 3 months
      duration: 2200,
      score: 80,
      subject: '自主学習',
      memo: [{ label: '感想', value: '早く慣れたい' }],
    },
  ],
};

// 教員ビュー用のデータをまとめたオブジェクト
export const mockTeacherData = {
  teachers: mockTeachers,
  classes: mockClasses,
  students: mockStudents,
  activities: mockActivities,
};
