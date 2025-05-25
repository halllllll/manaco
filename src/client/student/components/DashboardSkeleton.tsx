import type { FC } from 'react';

/**
 * ダッシュボードローディング時のスケルトンコンポーネント
 */
export const DashboardSkeleton: FC = () => {
  return (
    <div className="card bg-base-100 shadow-xl border border-base-200 w-full max-w-full mx-auto p-6 animate-pulse">
      {/* ヘッダー部分のスケルトン */}
      <div className="flex justify-between items-center mb-6">
        <div className="skeleton h-8 w-1/3" />
        <div className="skeleton rounded-full h-12 w-12" />
      </div>

      {/* グラフとデータ表示部分のスケルトン */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* グラフスケルトン */}
        <div className="card bg-base-100 shadow-sm border border-base-200 w-full">
          <div className="card-body">
            <div className="flex items-center gap-2 mb-4">
              <div className="skeleton rounded-full h-6 w-6" />
              <div className="skeleton h-6 w-1/4" />
            </div>

            {/* グラフスケルトン */}
            <div className="h-64 w-full">
              <div className="flex h-full items-end justify-between px-2">
                {Array.from({ length: 7 }, (_, i) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    key={i}
                    className={`skeleton w-8 ${
                      i % 4 === 0
                        ? 'h-1/3'
                        : i % 4 === 1
                          ? 'h-2/3'
                          : i % 4 === 2
                            ? 'h-1/2'
                            : 'h-3/4'
                    }`}
                  />
                ))}
              </div>
              <div className="skeleton h-0.5 w-full mt-2" />
              <div className="flex justify-between mt-2">
                {Array.from({ length: 3 }, (_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  <div key={i} className="skeleton h-4 w-16" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ランキングスケルトン */}
        <div className="card shadow-md lg:w-1/3 bg-base-100 border border-base-200">
          <div className="card-body">
            <div className="flex items-center gap-2 mb-4">
              <div className="skeleton rounded-full h-6 w-6" />
              <div className="skeleton h-6 w-2/3" />
            </div>

            <div className="space-y-4">
              {Array.from({ length: 2 }, (_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <div key={i}>
                  <div className="flex items-center justify-between">
                    <div className="skeleton h-6 w-1/3" />
                    <div className="skeleton h-6 w-1/4" />
                  </div>
                  <div className="skeleton h-0.5 w-full mt-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 学習ログテーブルスケルトン */}
      <div className="mt-6">
        <div className="skeleton h-8 w-1/4 mb-4" />
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                {Array.from({ length: 4 }, (_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  <th key={i}>
                    <div className="skeleton h-6 w-16" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 3 }, (_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <tr key={i}>
                  <td>
                    <div className="skeleton h-6 w-24" />
                  </td>
                  <td>
                    <div className="skeleton h-6 w-12" />
                  </td>
                  <td>
                    <div className="skeleton h-6 w-16" />
                  </td>
                  <td>
                    <div className="skeleton h-6 w-20" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ローディングインジケーター */}
      <div className="flex justify-center items-center mt-8 gap-2">
        <div className="loading loading-spinner loading-md text-primary" />
        <p className="text-base font-medium text-primary">データを読み込み中...</p>
      </div>
    </div>
  );
};
