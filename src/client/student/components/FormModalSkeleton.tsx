import type { FC } from 'react';

/**
 * フォームモーダルローディング時のスケルトンコンポーネント
 */
export const FormModalSkeleton: FC = () => {
  return (
    <div className="animate-pulse">
      {/* タイトルスケルトン */}
      <div className="skeleton h-8 w-2/3 mx-auto mb-6" />

      {/* 日付選択スケルトン */}
      <div className="form-control w-full mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="skeleton rounded-full h-5 w-5" />
          <div className="skeleton h-6 w-1/3" />
        </div>
        <div className="skeleton h-12 w-full rounded-lg" />
      </div>

      {/* 学習時間スケルトン */}
      <div className="form-control w-full mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="skeleton rounded-full h-5 w-5" />
          <div className="skeleton h-6 w-1/3" />
        </div>

        <div className="rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 分の設定スケルトン */}
            <div className="flex flex-col items-center space-y-4">
              <div className="text-center">
                <div className="skeleton h-6 w-8 mx-auto mb-1" />
                <div className="skeleton h-12 w-16 mx-auto" />
              </div>

              <div className="flex items-center gap-4">
                {Array.from({ length: 4 }, (_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  <div key={i} className="skeleton rounded-full h-12 w-12" />
                ))}
              </div>

              {/* クイック設定ボタンスケルトン */}
              <div className="flex gap-1 flex-wrap justify-center">
                {Array.from({ length: 4 }, (_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  <div key={i} className="skeleton h-6 w-12 rounded-full" />
                ))}
              </div>
            </div>

            {/* 秒の設定スケルトン */}
            <div className="flex flex-col items-center space-y-4">
              <div className="text-center">
                <div className="skeleton h-6 w-8 mx-auto mb-1" />
                <div className="skeleton h-12 w-16 mx-auto" />
              </div>

              <div className="flex items-center gap-4">
                {Array.from({ length: 4 }, (_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  <div key={i} className="skeleton rounded-full h-12 w-12" />
                ))}
              </div>

              {/* クイック設定ボタンスケルトン */}
              <div className="flex gap-1 flex-wrap justify-center">
                {Array.from({ length: 3 }, (_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  <div key={i} className="skeleton h-6 w-12 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 点数スケルトン */}
      <div className="form-control w-full mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="skeleton rounded-full h-5 w-5" />
          <div className="skeleton h-6 w-1/4" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-center">
            <div className="skeleton h-16 w-48 mx-auto" />
          </div>
        </div>
      </div>

      {/* 気分選択スケルトン */}
      <div className="form-control w-full mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="skeleton rounded-full h-5 w-5" />
          <div className="skeleton h-6 w-1/3" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Array.from({ length: 4 }, (_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <div key={i} className="skeleton h-20 w-full rounded-lg" />
          ))}
        </div>
      </div>

      {/* コメントスケルトン */}
      <div className="form-control w-full mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="skeleton rounded-full h-5 w-5" />
          <div className="skeleton h-6 w-1/6" />
        </div>
        <div className="skeleton h-24 w-full rounded-lg" />
      </div>

      {/* 送信ボタンスケルトン */}
      <div className="modal-action flex justify-center gap-4">
        <div className="skeleton h-12 w-24 rounded-lg" />
        <div className="skeleton h-12 w-32 rounded-lg" />
      </div>

      {/* ローディングインジケーター */}
      <div className="flex justify-center items-center mt-6 gap-2">
        <div className="loading loading-spinner loading-md text-primary" />
        <p className="text-sm font-medium text-primary">フォームを読み込み中...</p>
      </div>
    </div>
  );
};
