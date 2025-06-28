import type { User } from '@/shared/types/user';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { FC } from 'react';
import { useMemo, useRef } from 'react';
import { type HeatmapDay, useHeatmapData } from './useHeatmapData';

type ActivityHeatmapProps = {
  className?: string;
  onStudentSelect?: (studentId: string) => void;
};

// カラムヘルパーを初期化
const columnHelper = createColumnHelper<User & { activities: Record<string, boolean> }>();

/**
 * 活動ヒートマップコンポーネント
 * 直近10日間の生徒の学習活動の有無を表示する
 */
export const ActivityHeatmap: FC<ActivityHeatmapProps> = ({ className = '', onStudentSelect }) => {
  // ヒートマップデータを取得（カスタムフック）
  const { isLoading, error, heatmapData, sortOption, setSortOption, students } = useHeatmapData();

  // ソート済みの生徒リストを生成
  const sortedStudents = useMemo(() => {
    if (!heatmapData || !students) return [];

    const studentsWithHeatmapActivities = students.map((student) => {
      const activities: Record<string, boolean> = {};
      // biome-ignore lint/complexity/noForEach: <explanation>
      heatmapData.forEach((day) => {
        activities[day.date] = day.activities[student.id] || false;
      });
      return { ...student, activities };
    });

    const sorted = [...studentsWithHeatmapActivities];

    if (sortOption === 'name') {
      // 名前でソート
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'activity') {
      // 活動量でソート（多い順）
      sorted.sort((a, b) => {
        const aCount = Object.values(a.activities).filter(Boolean).length;
        const bCount = Object.values(b.activities).filter(Boolean).length;
        return bCount - aCount;
      });
    }

    return sorted;
  }, [heatmapData, students, sortOption]);

  // React Tableのカラム定義
  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        id: 'studentName',
        header: () => <div className="sticky left-0 bg-base-100 z-10 p-2">生徒名</div>,
        cell: (info) => (
          <div className="sticky left-0 bg-base-100 z-10 font-medium p-2">
            {info.getValue()}
            <span className="text-xs text-gray-500 ml-2">
              {info.row.original.belonging || '未設定'}
            </span>
          </div>
        ),
        minSize: 150,
        size: 200,
      }),
      ...(heatmapData || [])
        .slice()
        .reverse()
        .map((day: HeatmapDay) =>
          columnHelper.display({
            id: day.date,
            header: () => (
              <div className="text-center whitespace-nowrap p-2">{day.displayDate}</div>
            ),
            cell: (info) => {
              const hasActivity = day.activities[info.row.original.id] || false;
              return (
                <div className="text-center p-2">
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
                </div>
              );
            },
            minSize: 60,
            size: 80,
          }),
        ),
    ],
    [heatmapData],
  );

  const table = useReactTable({
    data: sortedStudents,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 50, // 各行の推定高さ (px)
    overscan: 5,
  });

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
        <div className="flex justify-between items-center mb-4">
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

        <div
          ref={tableContainerRef}
          className="overflow-auto"
          style={{ maxHeight: 'calc(100vh - 350px)' }} // 画面の高さに合わせて調整
        >
          <table className="table table-compact w-full relative">
            <thead
              className="bg-base-100" // Ensure opaque background
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
              }}
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        width: header.getSize(),
                      }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`, // 仮想化されたコンテンツの高さ
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                const row = rows[virtualItem.index];
                const { original: student } = row;
                return (
                  <tr
                    key={row.id}
                    data-index={virtualItem.index} // for debugging
                    ref={(node) => rowVirtualizer.measureElement(node)}
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
                    style={{
                      display: 'flex', // flexboxを使ってtdの幅を制御
                      position: 'absolute',
                      transform: `translateY(${virtualItem.start}px)`,
                      width: '100%',
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        style={{
                          width: cell.column.getSize(),
                          flexShrink: 0,
                          flexGrow: 0,
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })}
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
