import { formatDate, formatDuration } from '@/shared/common/func';
import { ACTIVITY_DETAIL_ITEMS, isDetailItemVisible } from '@/shared/constants/activityConfig';
import { MOOD_OPTIONS, getMoodEmoji, getMoodLabel } from '@/shared/constants/mood';
import type { LearningActivity } from '@/shared/types/activity';
import type { AppSettings } from '@/shared/types/settings';
import type { FC } from 'react';

type ActivityDetailModalProps = {
  selectedActivity: LearningActivity | null;
  onClose: () => void;
  settings?: AppSettings;
};

/**
 * 学習記録詳細モーダル
 */
export const ActivityDetailModal: FC<ActivityDetailModalProps> = ({
  selectedActivity,
  onClose,
  settings,
}) => {
  if (!selectedActivity || !settings) {
    return null;
  }

  // 設定に基づいて表示する詳細項目を選択
  const visibleDetailItems = ACTIVITY_DETAIL_ITEMS.filter((item) =>
    isDetailItemVisible(item, selectedActivity, settings),
  );

  return (
    <dialog id="activity_detail_modal" className={`modal ${selectedActivity ? 'modal-open' : ''}`}>
      <div className="modal-box max-w-lg">
        {selectedActivity && (
          <>
            <h3 className="font-bold text-xl flex items-center gap-2 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>学習記録の詳細</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              {formatDate(selectedActivity.activityDate)}の記録
            </h3>

            <div className="divider" />

            {/* 詳細セクション - スコアと時間 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* スコア表示 */}
              {visibleDetailItems.some((item) => item.id === 'score') && (
                <div className="stats shadow bg-base-100">
                  <div className="stat">
                    <div className="stat-title flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <title>点数</title>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      今回の点数
                    </div>
                    <div className="stat-value text-primary">
                      {selectedActivity.score}
                      <span className="text-xs">点</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 学習時間表示 */}
              {visibleDetailItems.some((item) => item.id === 'duration') && (
                <div className="stats shadow bg-base-100">
                  <div className="stat">
                    <div className="stat-title flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-info"
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
                      学習時間
                    </div>
                    <div className="stat-value text-info text-3xl">
                      {formatDuration(selectedActivity.duration)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 取り組んだこと表示 */}
            {visibleDetailItems.some((item) => item.id === 'activityType') &&
              selectedActivity.activityType &&
              selectedActivity.activityType.length > 0 && (
                <div className="bg-base-200/60 rounded-lg p-4 mt-4 border-l-4 border-warning">
                  <div className="font-bold mb-2 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-warning"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <title>取り組んだこと</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    取り組んだこと
                  </div>
                  <div className="flex flex-wrap gap-2 bg-white/50 p-3 rounded-lg">
                    {selectedActivity.activityType.map((type) => (
                      <span
                        key={`activity-type-${type}`}
                        className="badge badge-neutral badge-outline p-3"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* 気分表示 */}
            {visibleDetailItems.some((item) => item.id === 'mood') && selectedActivity.mood && (
              <div className="bg-base-200/60 rounded-lg p-4 mt-4 border-l-4 border-secondary">
                <div className="font-bold mb-2 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-secondary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <title>気分</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  このときの気持ち
                </div>
                <div className="flex items-center gap-3 bg-white/50 p-3 rounded-lg">
                  <span className="text-2xl">{`${getMoodEmoji(selectedActivity.mood)}`}</span>
                  <span className="text-lg">{`${getMoodLabel(selectedActivity.mood)}`}</span>
                  <div>
                    <span className="text-lg font-medium">
                      {
                        MOOD_OPTIONS.find((m) => m.value === selectedActivity.mood)?.label.split(
                          ' ',
                        )[1]
                      }
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* メモ表示 */}
            {
              visibleDetailItems.some((item) => item.id === 'memo') &&
                selectedActivity.memo &&
                selectedActivity.memo.map((memo, idx) => {
                  return (
                    <>
                      <div
                        className="bg-base-200/60 rounded-lg p-4 mt-4 border-l-4 border-accent"
                        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                        key={idx}
                      >
                        <div className="font-bold mb-2 flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-accent"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <title>メモ</title>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          {memo.label}
                        </div>
                        <div className="bg-white/50 p-3 rounded-lg">
                          <p className="whitespace-pre-wrap">{memo.value}</p>
                        </div>
                      </div>{' '}
                    </>
                  );
                })
              // <div className="bg-base-200/60 rounded-lg p-4 mt-4 border-l-4 border-accent">
              //   <div className="font-bold mb-2 flex items-center gap-2">
              //     <svg
              //       xmlns="http://www.w3.org/2000/svg"
              //       className="h-5 w-5 text-accent"
              //       fill="none"
              //       viewBox="0 0 24 24"
              //       stroke="currentColor"
              //     >
              //       <title>メモ</title>
              //       <path
              //         strokeLinecap="round"
              //         strokeLinejoin="round"
              //         strokeWidth={2}
              //         d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              //       />
              //     </svg>
              //     メモ
              //   </div>
              //   <div className="bg-white/50 p-3 rounded-lg">
              //     <p className="whitespace-pre-wrap">{selectedActivity.memo}</p>
              //   </div>
              // </div>
            }
          </>
        )}

        <div className="modal-action">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            とじる
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={onClose}>
          close
        </button>
      </form>
    </dialog>
  );
};
