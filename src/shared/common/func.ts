// 日付を「2025年5月21日（水）」のような形式に変換
export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
  return `${year}年${month}月${day}日（${weekday}）`;
};

// 時間表示の整形（秒を分秒に変換）
export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes === 0) return `${seconds}秒`;
  return `${minutes}分${remainingSeconds > 0 ? ` ${remainingSeconds}秒` : ''}`;
};

// export const transformFormDataToRequest = (
//   formData: LearningActivityFormData,
// ): Omit<LearningActivityRequest, 'userId'> => {
//   // idはapiに投げるときにつけることにする
//   const totalSeconds =
//     formData.studyTime.hour * 3600 + formData.studyTime.minute * 60 + formData.studyTime.second;

//   return {
//     activityDate: formData.targetDate,
//     duration: totalSeconds,
//     score: formData.score,
//     mood: formData.mood || undefined,
//     memo: formData.memo || undefined,
//   };
// };
