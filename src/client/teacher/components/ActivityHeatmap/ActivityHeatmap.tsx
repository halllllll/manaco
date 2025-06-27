import type { FC } from 'react';
import { useMemo } from 'react';
import { type HeatmapDay, useHeatmapData } from './useHeatmapData';

type ActivityHeatmapProps = {
  className?: string;
  onStudentSelect?: (studentId: string) => void;
  selectedClass?: string;
};

/**
 * 活動ヒートマップコンポーネント
 * 直近10日間の生徒の学習活動の有無を表示する
 */
export const ActivityHeatmap: FC<ActivityHeatmapProps> = ({
  className = '',
  onStudentSelect,
  selectedClass = 'all',
}) => {
  // ヒートマップデータを取得（カスタムフック）
  const { isLoading, error, heatmapData, sortOption, setSortOption, students } =
    useHeatmapData(selectedClass);

  // ソート済みの生徒リストを生成
  const sortedStudents = useMemo(() => {
    if (!heatmapData || !students) return [];

    const sorted = [...students];

    if (sortOption === 'name') {
      // 名前でソート
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'activity') {
      // 活動量でソート（多い順）
      sorted.sort((a, b) => {
        const aCount = heatmapData.reduce(
          (count: number, day: HeatmapDay) => count + (day.activities[a.id] ? 1 : 0),
          0,
        );
        const bCount = heatmapData.reduce(
          (count: number, day: HeatmapDay) => count + (day.activities[b.id] ? 1 : 0),
          0,
        );
        return bCount - aCount;
      });
    }

    return sorted;
  }, [heatmapData, students, sortOption]);

  if (isLoading) return <HeatmapSkeleton />;

  if (error)
    return (
      <div className="alert alert-error">
        <span>データの読み込みに失敗しました。</span>
      </div>
    );

  if (!heatmapData || heatmapData.length === 0)
    return (
      <div className="alert alert-info">
        <span>表示するデータがありません。</span>
      </div>
    );

  return (
    <div className={`card bg-base-100 shadow-lg ${className}`}>
      <div className="card-body">
        <div className="flex justify-between items-center">
          <h3 className="card-title">活動状況（直近10日間）</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm">並び順:</span>
            <div className="btn-group">
              <button
                type="button"
                className={`btn btn-sm ${sortOption === 'name' ? 'btn-active' : ''}`}
                onClick={() => setSortOption('name')}
              >
                名前順
              </button>
              <button
                type="button"
                className={`btn btn-sm ${sortOption === 'activity' ? 'btn-active' : ''}`}
                onClick={() => setSortOption('activity')}
              >
                活動数順
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-compact w-full">
            <thead>
              <tr>
                <th className="sticky left-0 bg-base-100 z-10">生徒名</th>
                {heatmapData.map((day: HeatmapDay) => (
                  <th key={day.date} className="text-center whitespace-nowrap">
                    {day.displayDate}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedStudents.map((student) => (
                <tr
                  key={student.id}
                  onClick={() => onStudentSelect?.(student.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onStudentSelect?.(student.id);
                    }
                  }}
                  tabIndex={onStudentSelect ? 0 : undefined}
                  role={onStudentSelect ? 'button' : undefined}
                  className={onStudentSelect ? 'cursor-pointer hover:bg-base-200' : ''}
                >
                  <td className="sticky left-0 bg-base-100 z-10 font-medium">
                    {student.name}
                    <span className="text-xs text-gray-500 ml-2">
                      {student.belonging || '未設定'}
                    </span>
                  </td>

                  {heatmapData.map((day: HeatmapDay) => {
                    const hasActivity = day.activities[student.id] || false;
                    return (
                      <td key={day.date} className="text-center p-2">
                        <div
                          className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center
                          ${
                            hasActivity
                              ? 'bg-primary/20 text-primary-content'
                              : 'bg-base-200 text-base-content/30'
                          }`}
                        >
                          {hasActivity ? '○' : '−'}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ローディング中のスケルトンUI
const HeatmapSkeleton: FC = () => {
  return (
    <div className="card bg-base-100 shadow-lg animate-pulse">
      <div className="card-body">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-8 bg-gray-200 rounded w-32" />
        </div>
        <div className="overflow-x-auto mt-4">
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};
