import type { FC } from 'react';
import { useUserStats } from '../hooks/useUserStats';
import type { UserDashboardProps } from '../types/props';

/**
 * ユーザー統計（トロフィー）コンポーネント
 */
export const Trophy: FC<{ activities: UserDashboardProps['userData']['activities'] }> = ({
  activities,
}) => {
  const _stats = useUserStats(activities);

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
        <div className="overflow-x-auto">
          <table className="table border border-base-content/5">
            <tbody>
              <p>なにがしかの統計データをここに表示する予定</p>
              <ol className="list-decimal pl-6">
                <li>点数top3とか</li>
                <li>時間top3とか</li>
                <li>学習時間の合計とか</li>
                <li>学習回数の合計とか</li>
                <li>学習した日数とか</li>
              </ol>
              {/* <tr className="hover bg-warning/10">
                <th className="text-nowrap">
                  <div className="badge badge-warning gap-2">1位</div>
                  <span className="ml-2">最高得点！</span>
                </th>
                <td className="font-bold text-lg">{stats.bestScore}点</td>
                <td>
                  {stats.recentActivities.find((a) => a.score === stats.bestScore)?.activityDate ||
                    '-'}
                </td>
              </tr>
              <tr className="hover bg-info/10">
                <th className="text-nowrap">
                  <div className="badge badge-info gap-2">2位</div>
                  <span className="ml-2">最速回答！</span>
                </th>
                <td className="font-bold text-lg">{formatDuration(stats.bestTime)}</td>
                <td>
                  {stats.recentActivities.find((a) => a.duration === stats.bestTime)
                    ?.activityDate || '-'}
                </td>
              </tr>
              <tr className="hover bg-success/10">
                <th className="text-nowrap">
                  <div className="badge badge-success gap-2">3位</div>
                  <span className="ml-2">総学習時間！</span>
                </th>
                <td className="font-bold text-lg">{formatDuration(stats.totalStudyTime)}</td>
                <td>{stats.totalActivities}回分</td>
              </tr> */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
