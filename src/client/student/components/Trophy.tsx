import { type FC, useMemo } from 'react';
import { useUserStats } from '../hooks/useUserStats';
import type { UserDashboardProps } from '../types/props';

/**
 * ユーザー統計（トロフィー）コンポーネント
 */
export const Trophy: FC<{ activities: UserDashboardProps['userData']['activities'] }> = ({
  activities,
}) => {
  const orderedActivities = useMemo(() => {
    return activities.toSorted((a, b) => {
      return a.activityDate.localeCompare(b.activityDate);
    });
  }, [activities]);
  const _stats = useUserStats(orderedActivities);

  return (
    <div className="card shadow-md lg:w-1/3 bg-base-100 border border-base-200">
      <div className="card-body">
        <h2 className="card-title text-xl flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-secondary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>ranking</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          統計データ
        </h2>
        <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px] md:max-h-[30vh]">
          {/* 成績履歴 */}
          <div className="bg-base-100 p-3 rounded-lg border border-base-300">
            <h3 className="font-bold text-sm mb-2">学習履歴</h3>
            <div className="overflow-y-auto max-h-[120px] pr-1">
              <ul className="space-y-1 text-sm">
                {orderedActivities.map((activity, index) => (
                  <li key={index} className="flex justify-between border-b border-base-300 pb-1">
                    <span>{activity.activityDate}</span>
                    <span className="font-semibold">
                      {activity.score}点 ({activity.duration}秒)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 統計表示 */}
          <div className="bg-base-100 border border-base-300 p-3 rounded-lg">
            <h3 className="font-bold text-sm mb-2">ハイライト</h3>
            <div className="overflow-x-auto">
              <table className="table table-sm  bg-base-100 w-full">
                <tbody>
                  <tr className="hover:bg-warning/20">
                    <td className="text-nowrap">
                      <div className="badge badge-warning gap-1 text-xs">TOP</div>
                      <span className="ml-1 text-sm">最高得点</span>
                    </td>
                    <td className="font-bold text-right">
                      {Math.max(...orderedActivities.map((a) => a.score))}点
                    </td>
                  </tr>
                  <tr className="hover:bg-info/20">
                    <td className="text-nowrap">
                      <div className="badge badge-info gap-1 text-xs">BEST</div>
                      <span className="ml-1 text-sm">最速回答</span>
                    </td>
                    <td className="font-bold text-right">
                      {Math.min(...orderedActivities.map((a) => a.duration))}秒
                    </td>
                  </tr>
                  <tr className="hover:bg-success/20">
                    <td className="text-nowrap">
                      <div className="badge badge-success gap-1 text-xs">TOTAL</div>
                      <span className="ml-1 text-sm">学習回数</span>
                    </td>
                    <td className="font-bold text-right">{orderedActivities.length}回</td>
                  </tr>
                  <tr className="hover:bg-primary/20">
                    <td className="text-nowrap">
                      <div className="badge badge-primary gap-1 text-xs">SUM</div>
                      <span className="ml-1 text-sm">総学習時間</span>
                    </td>
                    <td className="font-bold text-right">
                      {orderedActivities.reduce((total, a) => total + a.duration, 0)}秒
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 将来の拡張用コメント */}
          {/* <div className="bg-base-200 p-3 rounded-lg text-sm">
            <h3 className="font-bold text-sm mb-2">その他の統計</h3>
            <p>今後の予定:</p>
            <ol className="list-decimal pl-6">
              <li>点数top3</li>
              <li>時間top3</li>
              <li>学習した日数</li>
            </ol>
          </div> */}
        </div>
      </div>
    </div>
  );
};
