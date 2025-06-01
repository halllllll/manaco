import type { FC } from 'react';

/**
 * ダッシュボードローディング時のスケルトンコンポーネント (新レイアウト版)
 */
export const DashboardSkeleton: FC = () => {
  return (
    <div className="card bg-base-100 shadow-xl border border-base-200 w-full max-w-full mx-auto p-4 sm:p-6 animate-pulse space-y-4 sm:space-y-6">
      {/* ヘッダー部分のスケルトン */}
      <div className="flex justify-between items-center">
        <div className="skeleton h-7 sm:h-8 w-1/2 sm:w-1/3" />
        <div className="skeleton rounded-full h-10 w-10 sm:h-12 sm:w-12" />
      </div>

      {/* グラフと統計データ表示部分のスケルトン */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* グラフスケルトン */}
        <div className="card bg-base-200/50 shadow-sm border border-base-300/50 w-full lg:flex-1">
          <div className="card-body p-3 sm:p-4">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <div className="skeleton h-5 sm:h-6 w-3/5 sm:w-1/2" /> {/* Title: "これまでの記録" */}
              <div className="skeleton h-7 sm:h-8 w-16 sm:w-20 rounded" /> {/* Button: "拡大" */}
            </div>
            {/* Chart Area Placeholder */}
            <div className="skeleton h-48 sm:h-56 w-full rounded" />
          </div>
        </div>

        {/* 統計データ（トロフィー）スケルトン */}
        <div className="card bg-base-200/50 shadow-sm border border-base-300/50 w-full lg:w-1/3">
          <div className="card-body p-3 sm:p-4">
            <div className="skeleton h-5 sm:h-6 w-3/4 sm:w-2/3 mb-3 sm:mb-4" />{' '}
            {/* Title: "統計データ" */}
            <div className="space-y-2 sm:space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton items
                <div key={i} className="flex items-center gap-2">
                  <div className="skeleton h-3 sm:h-4 w-1/3" />
                  <div className="skeleton h-3 sm:h-4 w-2/3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 学習ログテーブルスケルトン */}
      <div className="card bg-base-200/50 shadow-sm border border-base-300/50 w-full">
        <div className="card-body p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <div className="skeleton h-5 sm:h-6 w-2/5 sm:w-1/3" /> {/* Title: "学習履歴" */}
            <div className="skeleton h-4 sm:h-5 w-10 sm:w-12 rounded" /> {/* Badge for count */}
          </div>
          <div className="overflow-x-auto">
            <table className="table w-full table-xs sm:table-sm">
              <thead>
                <tr>
                  <th className="p-1 sm:p-2">
                    <div className="skeleton h-4 sm:h-5 w-20 sm:w-24" />
                  </th>{' '}
                  {/* 日付 */}
                  <th className="p-1 sm:p-2">
                    <div className="skeleton h-4 sm:h-5 w-12 sm:w-16" />
                  </th>{' '}
                  {/* 点数 */}
                  <th className="hidden md:table-cell p-1 sm:p-2">
                    <div className="skeleton h-4 sm:h-5 w-24 sm:w-28" />
                  </th>{' '}
                  {/* かかった時間 */}
                  <th className="hidden md:table-cell p-1 sm:p-2">
                    <div className="skeleton h-4 sm:h-5 w-16 sm:w-20" />
                  </th>{' '}
                  {/* きもち */}
                  <th className="p-1 sm:p-2">
                    <div className="skeleton h-4 sm:h-5 w-10 sm:w-12" />
                  </th>{' '}
                  {/* Actions */}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 3 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton items
                  <tr key={i}>
                    <td className="p-1 sm:p-2">
                      <div className="skeleton h-3 sm:h-4 w-full" />
                    </td>
                    <td className="p-1 sm:p-2">
                      <div className="skeleton h-3 sm:h-4 w-3/4" />
                    </td>
                    <td className="hidden md:table-cell p-1 sm:p-2">
                      <div className="skeleton h-3 sm:h-4 w-full" />
                    </td>
                    <td className="hidden md:table-cell p-1 sm:p-2">
                      <div className="skeleton h-3 sm:h-4 w-8 sm:w-10 mx-auto" />
                    </td>
                    <td className="p-1 sm:p-2">
                      <div className="skeleton h-5 sm:h-6 w-5 sm:w-6 rounded-full mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ローディングインジケーター */}
      <div className="flex justify-center items-center pt-2 sm:pt-4 gap-2">
        <div className="loading loading-spinner loading-xs sm:loading-sm text-base-content/50" />
        <p className="text-xs sm:text-sm font-medium text-base-content/50">データを読み込み中...</p>
      </div>
    </div>
  );
};
