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
import { useHeatmapData } from './useHeatmapData';

type ActivityHeatmapProps = {
  className?: string;
  onStudentSelect?: (studentId: string) => void;
};

type TableData = User & {
  activities: Record<string, boolean>;
  totalActivityCount: number;
};

const columnHelper = createColumnHelper<TableData>();

/**
 * @tanstack/react-table と @tanstack/react-virtual を使用して再実装された活動ヒートマップコンポーネント。
 * CSSのposition:stickyによる固定列と行の仮想化により、パフォーマンスとメンテナンス性を向上させています。
 */
export const ActivityHeatmap: FC<ActivityHeatmapProps> = ({ className = '', onStudentSelect }) => {
  const {
    isLoading,
    error,
    heatmapData,
    sortOption,
    setSortOption,
    students,
  } = useHeatmapData();

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const tableData = useMemo(() => {
    if (!heatmapData || !students) return [];

    return students.map((student) => {
      const activities: Record<string, boolean> = {};
      let totalActivityCount = 0;
      heatmapData.forEach((day) => {
        const hasActivity = day.activities[student.id] || false;
        activities[day.date] = hasActivity;
        if (hasActivity) {
          totalActivityCount++;
        }
      });
      return { ...student, activities, totalActivityCount };
    });
  }, [heatmapData, students]);

  const sortedData = useMemo(() => {
    const sorted = [...tableData];
    if (sortOption === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'activity') {
      sorted.sort((a, b) => b.totalActivityCount - a.totalActivityCount);
    }
    return sorted;
  }, [tableData, sortOption]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        id: 'studentName',
        header: '生徒名',
        size: 200,
        cell: (info) => (
          <>
            {info.getValue()}
            <span className="text-xs text-gray-500 ml-2 hidden sm:inline">
              {info.row.original.belonging || '未設定'}
            </span>
          </>
        ),
      }),
      ...(heatmapData || [])
        .slice()
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((day) =>
          columnHelper.accessor((row) => row.activities[day.date], {
            id: day.date,
            header: () => (
              <div className="text-center">
                <span className="sm:hidden">{day.displayDate.replace(/[月日]/g, '/')}</span>
                <span className="hidden sm:inline">{day.displayDate}</span>
                <div className="text-xs">{day.dayOfWeek}</div>
              </div>
            ),
            size: 70,
            cell: (info) => {
              const hasActivity = info.getValue();
              return (
                <div className="flex justify-center items-center h-full">
                  <div
                    className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto rounded-full flex items-center justify-center ${
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
          }),
        ),
    ],
    [heatmapData],
  );

  const table = useReactTable({
    data: sortedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 56, // row height
    overscan: 5,
  });

  const totalTableWidth = useMemo(() => {
    return columns.reduce((sum, column) => sum + (column.size || 0), 0);
  }, [columns]);


  if (isLoading) return <HeatmapSkeleton />;
  if (error) return <div className="alert alert-error">データの読み込みに失敗しました。</div>;
  if (!heatmapData || heatmapData.length === 0)
    return <div className="alert alert-info">表示するデータがありません。</div>;

  return (
    <div className={`card bg-base-100 shadow-lg ${className}`}>
      <div className="card-body">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <h3 className="card-title text-lg sm:text-xl">{`活動状況（直近14日間）`}</h3>
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm">並び順:</span>
              <div className="btn-group">
                <button
                  type="button"
                  className={`btn btn-xs sm:btn-sm ${sortOption === 'name' ? 'btn-active' : ''}`}
                  onClick={() => setSortOption('name')}
                >
                  名前順
                </button>
                <button
                  type="button"
                  className={`btn btn-xs sm:btn-sm ${sortOption === 'activity' ? 'btn-active' : ''}`}
                  onClick={() => setSortOption('activity')}
                >
                  活動数順
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={tableContainerRef}
          className="w-full overflow-auto"
          style={{ maxHeight: 'calc(100vh - 350px)', minHeight: '400px' }}
        >
          <table
            className="table border-collapse"
            style={{ width: `${totalTableWidth}px` }} // Set explicit width
          >
            <thead className="sticky top-0 bg-base-100 z-20" style={{ width: '100%' }}>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      style={{
                        width: header.getSize(),
                        minWidth: header.getSize(),
                      }}
                      className={`p-2 ${
                        header.id === 'studentName' ? 'sticky left-0 z-10 bg-base-100' : ''
                      } ${
                        // Add weekend background for header
                        heatmapData &&
                        heatmapData.find((d) => d.date === header.id)?.dayOfWeek === '土'
                          ? 'bg-blue-50'
                          : heatmapData &&
                              heatmapData.find((d) => d.date === header.id)?.dayOfWeek === '日'
                            ? 'bg-red-50'
                            : ''
                      }`}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                position: 'relative',
                width: '100%', // Explicitly set tbody width to 100%
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index];
                return (
                  <tr
                    key={row.id}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                      display: 'flex',
                    }}
                    className={`${onStudentSelect ? 'cursor-pointer hover:bg-base-100' : ''}`}
                    onClick={() => onStudentSelect?.(row.original.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        onStudentSelect?.(row.original.id);
                      }
                    }}
                    tabIndex={onStudentSelect ? 0 : -1}
                    role={onStudentSelect ? 'button' : undefined}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        style={{
                          width: cell.column.getSize(),
                          minWidth: cell.column.getSize(),
                          flexShrink: 0,
                          flexBasis: cell.column.getSize(),
                        }}
                        className={`p-2 flex items-center ${
                          cell.column.id === 'studentName'
                            ? 'sticky left-0 z-10 font-medium bg-base-100'
                            : 'justify-center'
                        } ${
                          // Add weekend background for cell
                          heatmapData &&
                          heatmapData.find((d) => d.date === cell.column.id)?.dayOfWeek === '土'
                            ? 'bg-blue-50'
                            : heatmapData &&
                                heatmapData.find((d) => d.date === cell.column.id)?.dayOfWeek === '日'
                              ? 'bg-red-50'
                              : ''
                        }`}
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
        <div className="mt-2 text-xs text-gray-500 sm:hidden">
          ※ 横にスクロールすると過去の活動を確認できます
        </div>
      </div>
    </div>
  );
};

const HeatmapSkeleton: FC = () => (
  <div className="card bg-base-100 shadow-lg animate-pulse">
    <div className="card-body">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="h-8 bg-gray-200 rounded w-56" />
      </div>
      <div className="overflow-x-auto mt-4">
        <div className="h-64 bg-gray-200 rounded" />
      </div>
    </div>
  </div>
);