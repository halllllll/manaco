import { formatDate } from '@/shared/common/func';
import {
  type SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import type { Student } from './useStudentsData';
import { useStudentsData } from './useStudentsData';

type StudentSummaryTableProps = {
  selectedClass?: string;
  onStudentSelect?: (studentId: string) => void;
  className?: string;
};

/**
 * 生徒一覧テーブルコンポーネント
 * @tanstack/react-tableを使用
 */
export const StudentSummaryTable: React.FC<StudentSummaryTableProps> = ({
  onStudentSelect,
  className = '',
}) => {
  // 生徒データ取得
  const { students, isLoading, error } = useStudentsData();

  // デバッグ用
  console.log('StudentSummaryTable rendered', {
    studentsCount: students.length,
    isLoading,
    hasError: !!error,
  });

  // 検索フィルター
  const [globalFilter, setGlobalFilter] = useState('');

  // ソート状態
  const [sorting, setSorting] = useState<SortingState>([]);

  // カラム定義
  const columnHelper = createColumnHelper<Student>();
  const columns = [
    columnHelper.accessor('id', {
      header: 'ID',
      cell: (info) => <span className="text-xs text-gray-500">{info.getValue()}</span>,
      size: 40,
    }),
    columnHelper.accessor('name', {
      header: '名前',
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor('belonging', {
      header: 'クラス/グループ',
      cell: (info) => info.getValue() || <span className="text-gray-400">未設定</span>,
    }),
    columnHelper.accessor((row) => row.activities?.length || 0, {
      id: 'activityCount',
      header: '学習記録数',
      cell: (info) => <span className="font-mono">{info.getValue()}</span>,
    }),
    columnHelper.accessor(
      (row) => {
        if (!row.activities || row.activities.length === 0) return '';

        // 最新の学習記録日を取得
        return row.activities
          .map((a) => a.activityDate)
          .sort()
          .reverse()[0];
      },
      {
        id: 'lastActivity',
        header: '最終学習日',
        cell: (info) => {
          const date = info.getValue();
          if (!date) return <span className="text-gray-400">なし</span>;

          // 共通のformatDate関数を使用して日付をフォーマット
          return <span className="whitespace-nowrap">{formatDate(date).substring(5, 13)}</span>;
        },
      },
    ),
    columnHelper.accessor((row) => row, {
      id: 'actions',
      header: '',
      cell: (info) => (
        <button
          type="button"
          onClick={() => onStudentSelect?.(info.getValue().id)}
          className="btn btn-xs btn-outline"
        >
          詳細
        </button>
      ),
    }),
  ];

  // テーブルインスタンス作成
  const table = useReactTable({
    data: students,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (isLoading) return <TableSkeleton />;

  if (error) {
    return (
      <div className="alert alert-error">
        <span>データの読み込みに失敗しました。</span>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="card-title">生徒一覧</h3>
          <div className="alert alert-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-info shrink-0 w-6 h-6"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>表示する生徒データがありません。クラス選択や検索条件を変更してください。</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`card bg-base-100 shadow-lg ${className}`}>
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h3 className="card-title">生徒一覧</h3>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="検索..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="input input-bordered input-sm w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-zebra table-compact w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted() as string] ?? ''}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ページネーション */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            全 {table.getFilteredRowModel().rows.length} 件中
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} -
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length,
            )}{' '}
            件を表示
          </div>
          <div className="join">
            <button
              type="button"
              className="join-item btn btn-sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {'<<'}
            </button>
            <button
              type="button"
              className="join-item btn btn-sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {'<'}
            </button>
            <button type="button" className="join-item btn btn-sm">
              {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
            </button>
            <button
              type="button"
              className="join-item btn btn-sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {'>'}
            </button>
            <button
              type="button"
              className="join-item btn btn-sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {'>>'}
            </button>
          </div>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="select select-sm select-bordered"
          >
            {[10, 20, 30, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}件表示
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

// テーブルのローディング中スケルトンUI
const TableSkeleton: React.FC = () => (
  <div className="card bg-base-100 shadow-lg animate-pulse">
    <div className="card-body">
      <div className="flex justify-between items-center mb-4">
        <div className="h-8 bg-gray-200 rounded w-40" />
        <div className="h-8 bg-gray-200 rounded w-64" />
      </div>
      <div className="space-y-3">
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>
      <div className="h-8 bg-gray-200 rounded w-full mt-4" />
    </div>
  </div>
);
