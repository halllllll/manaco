import type { FC } from 'react';

/**
 * データがない場合の表示コンポーネント
 */
export const EmptyTrophy: FC = () => {
  return (
    <div className="card shadow-md lg:w-1/3 bg-base-100 border border-base-200">
      <div className="card-body">
        <h2 className="card-title text-xl flex items-center gap-2 flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>統計データ</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          統計データ
        </h2>
        <div className="text-center py-8">
          <p className="text-base-content/60">まだ学習データがありません</p>
        </div>
      </div>
    </div>
  );
};
