import { formatDate, formatDuration } from '@/shared/common/func';
import {
  ACTIVITY_COLUMNS,
  type ActivityColumnId,
  ActivityColumnIdEnum,
  isColumnVisible,
} from '@/shared/constants/activityConfig';
import { MOOD_OPTIONS, getMoodEmoji } from '@/shared/constants/mood';
import type { LearningActivity } from '@/shared/types/activity';
import type { AppSettings } from '@/shared/types/settings';
import type { FC } from 'react';

type ActivityTableProps = {
  activities: LearningActivity[];
  settings?: AppSettings;
  onSelectActivity: (activity: LearningActivity) => void;
};

/**
 * 列のスタイル情報を提供するヘルパー関数
 * IDE補完と型チェックが効くようにコンポーネント内で定義
 */
const getColumnStyles = (columnId: ActivityColumnId, isResponsive?: boolean) => {
  // 列のスタイル情報をオブジェクトで返す
  const styles = {
    // 列の表示/非表示のためのクラス名
    className: {
      // ヘッダーセル用のクラス名
      header: (): string => {
        switch (columnId) {
          case ActivityColumnIdEnum.activityDate:
            return '';
          case ActivityColumnIdEnum.score:
            return 'lg:text-center text-end';
          case ActivityColumnIdEnum.duration:
            return 'text-end';
          case ActivityColumnIdEnum.mood:
            return 'text-center';
          case ActivityColumnIdEnum.actions:
            return 'text-center';
          default:
            return '';
        }
      },

      // データセル用のクラス名
      cell: (): string => {
        switch (columnId) {
          case ActivityColumnIdEnum.activityDate:
            return 'font-medium';
          case ActivityColumnIdEnum.score:
          case ActivityColumnIdEnum.duration:
            return 'text-end';
          case ActivityColumnIdEnum.mood:
            return 'text-center';
          case ActivityColumnIdEnum.activityType:
            return 'overflow-hidden text-ellipsis';
          case ActivityColumnIdEnum.actions:
            return 'text-center';
          default:
            return '';
        }
      },

      // レスポンシブ表示制御用のクラス名
      responsive: (): string => {
        // 「きもち」と「取り組んだこと」は小画面で非表示
        if (
          columnId === ActivityColumnIdEnum.mood ||
          (columnId === ActivityColumnIdEnum.activityType && isResponsive)
        ) {
          return 'hidden lg:table-cell';
        }
        return '';
      },

      // 小画面での列幅調整用のクラス名
      width: (): string => {
        switch (columnId) {
          case ActivityColumnIdEnum.activityDate:
            return 'w-[45%] lg:w-auto';
          case ActivityColumnIdEnum.score:
            return 'w-[25%] lg:w-auto';
          case ActivityColumnIdEnum.duration:
            return 'w-[30%] lg:w-auto';
          default:
            return '';
        }
      },
    },

    // インラインスタイル
    style: {
      // 列の幅設定
      width: (): React.CSSProperties => {
        const widthValue =
          columnId === ActivityColumnIdEnum.activityDate
            ? '30%'
            : columnId === ActivityColumnIdEnum.activityType
              ? '40%'
              : columnId === ActivityColumnIdEnum.score
                ? '15%'
                : columnId === ActivityColumnIdEnum.duration
                  ? '15%'
                  : columnId === ActivityColumnIdEnum.mood
                    ? '10%'
                    : columnId === ActivityColumnIdEnum.actions
                      ? '5%'
                      : 'auto';

        return { width: widthValue };
      },
    },
  };

  return styles;
};

/**
 * 学習活動テーブルコンポーネント
 */
export const ActivityTable: FC<ActivityTableProps> = ({
  activities,
  settings,
  onSelectActivity,
}) => {
  const orderedActivities = activities.toSorted((a, b) =>
    b.activityDate.localeCompare(a.activityDate),
  );

  // 設定に応じて表示する列を決定
  const visibleColumns = settings
    ? ACTIVITY_COLUMNS.filter((column) => isColumnVisible(column, settings))
    : ACTIVITY_COLUMNS;

  return (
    <div className="rounded-lg bg-base-200/30 p-2 shadow-inner w-full">
      <div className="overflow-x-auto max-h-[300px] lg:max-h-[50vh] min-h-full rounded-lg w-full">
        <table className="table table-compact table-zebra w-full">
          <colgroup>
            {/* 列の幅を明示的に指定 - 画面サイズに応じて異なる幅を設定 */}
            {visibleColumns.map((column) => {
              const columnId = column.id as ActivityColumnId;
              const styles = getColumnStyles(columnId, column.responsive);

              return (
                <col
                  key={`col-${String(columnId)}`}
                  className={styles.className.responsive()}
                  style={styles.style.width()}
                />
              );
            })}
          </colgroup>
          <thead>
            <tr>
              {/* 列ヘッダー - 設定に応じて動的に表示 */}
              {visibleColumns.map((column, index) => {
                const columnId = column.id as ActivityColumnId;
                const styles = getColumnStyles(columnId, column.responsive);

                const headerClassNames = [
                  'sticky top-0 bg-base-100 text-primary-content font-bold z-10 shadow-sm',
                  styles.className.header(),
                  styles.className.responsive(),
                  index === 0 ? 'rounded-tl-lg' : '',
                  index === visibleColumns.length - 1 ? 'rounded-tr-lg' : '',
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <th key={String(columnId)} className={headerClassNames}>
                    {column.label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {orderedActivities.map((activity) => (
              <tr
                key={activity.activityDate}
                className="hover:bg-base-200 cursor-pointer transition-colors"
                onClick={() => onSelectActivity(activity)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectActivity(activity);
                  }
                }}
                tabIndex={0}
                aria-label={`View details for ${formatDate(activity.activityDate)}`}
              >
                {/* 行データ - 設定に応じて動的に表示 */}
                {visibleColumns.map((column) => {
                  const columnId = column.id as ActivityColumnId;
                  const styles = getColumnStyles(columnId, column.responsive);

                  // インラインでクラス名を構築
                  const cellClassNames = [
                    styles.className.cell(),
                    styles.className.responsive(),
                    styles.className.width(),
                  ]
                    .filter(Boolean)
                    .join(' ');

                  return (
                    <td
                      key={`${activity.activityDate}-${String(columnId)}`}
                      className={cellClassNames}
                    >
                      {renderActivityCell(columnId, activity)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * セルの内容をレンダリングする (網羅性チェック付き)
 */
const renderActivityCell = (columnId: ActivityColumnId, activity: LearningActivity) => {
  // Exhaustive switch with type checking
  switch (columnId) {
    case ActivityColumnIdEnum.activityDate:
      return (
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-secondary flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>日付</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="whitespace-nowrap">{formatDate(activity.activityDate)}</span>
        </div>
      );

    case ActivityColumnIdEnum.score:
      return activity.score !== undefined ? (
        <div className="flex items-center justify-end">
          <span className="badge badge-md border-primary px-3 py-2" title={`${activity.score}点`}>
            {activity.score}点
          </span>
        </div>
      ) : null;

    case ActivityColumnIdEnum.duration:
      return (
        <div className="flex items-center justify-end gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-info flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>時間</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-medium truncate">{formatDuration(activity.duration)}</span>
        </div>
      );

    case ActivityColumnIdEnum.mood:
      return activity.mood ? (
        <div
          className="tooltip flex justify-center"
          data-tip={MOOD_OPTIONS.find((m) => m.value === activity.mood)?.label}
        >
          <span className="text-xl">{getMoodEmoji(activity.mood)}</span>
        </div>
      ) : null;

    case ActivityColumnIdEnum.activityType:
      return activity.activityType && activity.activityType.length > 0 ? (
        <div className="flex flex-wrap gap-1 max-w-full overflow-hidden">
          {activity.activityType.map((type) => (
            <span
              key={`type-${type}`}
              className="badge badge-sm badge-warning badge-outline truncate"
            >
              {type}
            </span>
          ))}
        </div>
      ) : (
        <span className="text-gray-400 text-sm">-</span>
      );

    case ActivityColumnIdEnum.actions:
      return (
        <div className="flex justify-center">
          <button
            type="button"
            className="btn btn-xs btn-circle btn-ghost"
            onClick={(e) => {
              e.stopPropagation();
            }}
            title="詳しく見る"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <title>詳細</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      );

    // This will ensure compile-time error if a new column ID is added but not handled
    default: {
      // Type assertion to check exhaustiveness
      const _exhaustiveCheck: never = columnId;
      return null;
    }
  }
};
