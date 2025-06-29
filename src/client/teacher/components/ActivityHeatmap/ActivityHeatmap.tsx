import type { User } from '@/shared/types/user';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { FC } from 'react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { type HeatmapDay, useHeatmapData } from './useHeatmapData';

type ActivityHeatmapProps = {
  className?: string;
  onStudentSelect?: (studentId: string) => void;
};

// カラムヘルパーを初期化
const columnHelper = createColumnHelper<User & { activities: Record<string, boolean> }>();

// デフォルトの列幅設定
const DEFAULT_STUDENT_NAME_WIDTH = 200;
const DEFAULT_DATE_COLUMN_WIDTH = 80;

/**
 * 活動ヒートマップコンポーネント
 * 直近10日間の生徒の学習活動の有無を表示する
 */
export const ActivityHeatmap: FC<ActivityHeatmapProps> = ({ className = '', onStudentSelect }) => {
  // ヒートマップデータを取得（カスタムフック）
  const { isLoading, error, heatmapData, sortOption, setSortOption, students } = useHeatmapData();

  // ヘッダーテーブル参照
  const headerRef = useRef<HTMLDivElement>(null);
  // 本体テーブル参照
  const bodyRef = useRef<HTMLDivElement>(null);
  // テーブルコンテナ参照
  const containerRef = useRef<HTMLDivElement>(null);

  // コンテナの幅を状態として管理（デフォルト値を設定）
  const [containerWidth, setContainerWidth] = useState(800); // デフォルト値を十分大きく設定

  // 画面サイズ変更を検知してコンテナ幅を更新
  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.getBoundingClientRect().width;
        if (newWidth > 0) {
          // 0幅の場合は更新しない
          setContainerWidth(newWidth);
        }
      }
    };

    // 初期化時に一度実行
    updateWidth();

    // リサイズイベントでコンテナ幅を更新
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(containerRef.current);

    // DOM読み込み完了後にも再計算
    setTimeout(updateWidth, 100);

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
      resizeObserver.disconnect();
    };
  }, []);

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

  // レスポンシブ対応のカラム幅設定 - 最小幅を保証
  const STUDENT_NAME_WIDTH = useMemo(() => {
    // 小さい画面なら名前列を広く、ただし最小値は保証
    if (containerWidth < 640) return Math.max(180, Math.min(200, containerWidth * 0.4));
    // 中くらいの画面
    if (containerWidth < 1024) return Math.max(180, containerWidth * 0.25);
    // 大きい画面
    return Math.max(200, containerWidth * 0.2);
  }, [containerWidth]);

  const DATE_COLUMN_WIDTH = useMemo(() => {
    // 小さい画面では日付列を小さく、ただし最小値は保証
    if (containerWidth < 640) return Math.max(60, containerWidth * 0.06);
    // 中くらいの画面
    if (containerWidth < 1024) return Math.max(70, containerWidth * 0.07);
    // 大きい画面
    return Math.max(80, containerWidth * 0.08);
  }, [containerWidth]);

  // React Tableのカラム定義
  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        id: 'studentName',
        header: () => <div className="sticky left-0 bg-base-100 z-10 p-2 w-full">生徒名</div>,
        cell: (info) => (
          <div className="sticky left-0 bg-base-100 z-10 font-medium p-2 w-full">
            {info.getValue()}
            <span className="text-xs text-gray-500 ml-2 hidden sm:inline">
              {info.row.original.belonging || '未設定'}
            </span>
          </div>
        ),
        size: STUDENT_NAME_WIDTH,
        minSize: DEFAULT_STUDENT_NAME_WIDTH,
      }),
      ...(heatmapData || [])
        .slice()
        // .reverse() を削除し、代わりに日付でソート
        .sort((a, b) => {
          // 日付文字列をDate型に変換してソート（昇順 - 古い日付から新しい日付へ）
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        })
        .map((day: HeatmapDay) =>
          columnHelper.display({
            id: day.date,
            header: () => (
              <div className="text-center whitespace-nowrap p-2 w-full">
                {/* スマホ表示では短い日付表示 */}
                <span className="sm:hidden">{day.displayDate.replace(/[月日]/g, '')}</span>
                <span className="hidden sm:inline">{day.displayDate}</span>
              </div>
            ),
            cell: (info) => {
              const hasActivity = day.activities[info.row.original.id] || false;
              return (
                <div className="text-center p-2 w-full">
                  <div
                    className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto rounded-full flex items-center justify-center
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
            size: DATE_COLUMN_WIDTH,
            minSize: DEFAULT_DATE_COLUMN_WIDTH,
          }),
        ),
    ],
    [heatmapData, STUDENT_NAME_WIDTH, DATE_COLUMN_WIDTH],
  );

  const table = useReactTable({
    data: sortedStudents,
    columns,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      minSize: 60, // すべてのカラムの最小サイズ
    },
  });

  const { rows } = table.getRowModel();

  // スクロール同期のためのイベントハンドラ
  useLayoutEffect(() => {
    if (!bodyRef.current || !headerRef.current) return;

    const handleScroll = () => {
      if (headerRef.current && bodyRef.current) {
        headerRef.current.scrollLeft = bodyRef.current.scrollLeft;
      }
    };

    const bodyElement = bodyRef.current;
    bodyElement.addEventListener('scroll', handleScroll);

    return () => {
      bodyElement.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => bodyRef.current,
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

  // ヘッダー行を取得
  const headerGroup = table.getHeaderGroups()[0];

  // 実際のテーブル幅を計算（各列の実際のサイズを合計）
  const actualTableWidth = headerGroup.headers.reduce(
    (total, header) => total + header.getSize(),
    0,
  );

  return (
    <div className={`card bg-base-100 shadow-lg ${className}`}>
      <div className="card-body">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
          <h3 className="card-title text-lg sm:text-xl">活動状況（直近10日間）</h3>
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

        {/* レスポンシブ対応のテーブル構造 */}
        <div className="w-full flex flex-col" ref={containerRef}>
          {/* ヘッダー部分 - 固定 */}
          <div
            ref={headerRef}
            className="w-full overflow-hidden bg-base-100 z-50 sticky top-0"
            style={{ overflowX: 'hidden' }}
          >
            <div
              className="flex"
              style={{ width: `${Math.max(actualTableWidth, containerWidth)}px`, minWidth: '100%' }}
            >
              {headerGroup.headers.map((header) => (
                <div
                  key={header.id}
                  style={{
                    width: `${Math.max(header.getSize(), header.column.columnDef.minSize || 0)}px`,
                    flex: `0 0 ${Math.max(header.getSize(), header.column.columnDef.minSize || 0)}px`,
                  }}
                  className="overflow-hidden"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </div>
              ))}
            </div>
          </div>

          {/* 本体部分 - スクロール可能 */}
          <div
            ref={bodyRef}
            className="w-full overflow-auto"
            style={{
              maxHeight: 'calc(100vh - 350px)',
              minHeight: containerWidth < 640 ? '300px' : '400px',
            }}
          >
            <div
              style={{
                position: 'relative',
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: `${Math.max(actualTableWidth, containerWidth)}px`,
                minWidth: '100%',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index];
                const { original: student } = row;

                return (
                  <div
                    key={row.id}
                    className={`absolute flex w-full ${
                      onStudentSelect ? 'cursor-pointer hover:bg-base-200' : ''
                    }`}
                    style={{
                      transform: `translateY(${virtualRow.start}px)`,
                      height: `${virtualRow.size}px`,
                    }}
                    onClick={() => onStudentSelect?.(student.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onStudentSelect?.(student.id);
                      }
                    }}
                    tabIndex={onStudentSelect ? 0 : undefined}
                    role={onStudentSelect ? 'button' : undefined}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <div
                        key={cell.id}
                        className="overflow-hidden"
                        style={{
                          width: `${Math.max(cell.column.getSize(), cell.column.columnDef.minSize || 0)}px`,
                          flex: `0 0 ${Math.max(cell.column.getSize(), cell.column.columnDef.minSize || 0)}px`,
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* モバイルでの説明 */}
        <div className="mt-2 text-xs text-gray-500 sm:hidden">
          ※ 横にスクロールすると過去の活動を確認できます
        </div>
      </div>
    </div>
  );
};

// ローディング中のスケルトンUI - レスポンシブ対応
const HeatmapSkeleton: FC = () => {
  return (
    <div className="card bg-base-100 shadow-lg animate-pulse">
      <div className="card-body">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-36 sm:w-48" />
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-28 sm:w-32" />
        </div>
        <div className="overflow-x-auto mt-4">
          <div className="h-48 sm:h-64 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};
