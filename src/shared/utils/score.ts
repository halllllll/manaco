/**
 * 点数に応じたスタイルクラスを取得
 */
export const getScoreStyle = (score: number): string => {
  // if (score >= 95) return 'text-warning font-bold';
  // if (score >= 80) return 'text-success font-bold';
  // if (score >= 60) return 'text-info';
  // return 'text-error';
  if (score >= 90) return 'text-success font-bold';
  return 'text-grey-200 font-bold';
};
