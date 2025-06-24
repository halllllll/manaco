import type { FC } from 'react';

/**
 * 学習記録が存在しない場合の表示コンポーネント
 */
export const EmptyActivityList: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <img
        src="https://img.icons8.com/clouds/100/000000/book.png"
        alt="本のイラスト"
        className="w-24 h-24 mb-4"
      />
      <p className="text-lg font-medium text-center">
        まだ学習記録がありません。
        <br />
        「学習を記録する」ボタンを押して始めましょう！
      </p>
    </div>
  );
};
