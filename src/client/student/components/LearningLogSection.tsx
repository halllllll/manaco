import { formatDate, formatDuration } from '@/shared/common/func';
import { MOOD_OPTIONS, getMoodEmoji } from '@/shared/constants/mood';
import type { LearningActivity } from '@/shared/types/activity';
import { getScoreStyle } from '@/shared/utils/score';
import { type FC, useState } from 'react';
import type { LearningLogSectionProps } from '../types/props';

import { useSettings } from '@/client/api/settings/hook';

/**
 * 学習記録セクションコンポーネント
 */
export const LearningLogSection: FC<LearningLogSectionProps> = ({ activities }) => {
  // appsettings
  const { data, error, _isLoading } = useSettings();
  if (error) {
    throw new Error(`Failed to fetch settings: ${error.name} - ${error.message}`);
  }

  const [selectedActivity, setSelectedActivity] = useState<LearningActivity | null>(null);

  return (
    <div className="card bg-base-100 shadow-md border border-base-200 w-full">
      <div className="card-body">
        <h2 className="card-title text-xl flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>学習記録</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          学習履歴
          <span className="badge badge-sm">{activities.length}件</span>
        </h2>

        <div className="overflow-x-auto max-h-[40vh] overflow-y-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th className="sticky top-0 bg-base-100">日付</th>
                <th className="sticky top-0 bg-base-100 text-end">点数</th>
                <th className="hidden md:table-cell sticky top-0 bg-base-100 text-end">
                  かかった時間
                </th>
                {data?.showMood && (
                  <th className="hidden md:table-cell sticky top-0 bg-base-100 text-center">
                    きもち
                  </th>
                )}
                <th className="sticky top-0 bg-base-100">{''}</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr
                  key={activity.activityDate}
                  className="hover cursor-pointer"
                  onClick={() => setSelectedActivity(activity)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedActivity(activity);
                    }
                  }}
                  tabIndex={0}
                  aria-label={`View details for ${formatDate(activity.activityDate)}`}
                >
                  <td>{formatDate(activity.activityDate)}</td>
                  <td className="text-end">
                    <span className={`${getScoreStyle(activity.score)}`}>{activity.score}点</span>
                  </td>
                  <td className="text-end hidden md:table-cell">
                    {formatDuration(activity.duration)}
                  </td>
                  {data?.showMood && (
                    <td className="text-center hidden md:table-cell">
                      <span
                        className="text-xl"
                        title={MOOD_OPTIONS.find((m) => m.value === activity.mood)?.label}
                      >
                        {getMoodEmoji(activity.mood)}
                      </span>
                    </td>
                  )}
                  <td>
                    <button
                      type="button"
                      className="btn btn-xs btn-ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedActivity(activity);
                      }}
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 詳細モーダル */}
      <ActivityDetailModal
        selectedActivity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />
    </div>
  );
};

/**
 * 学習記録詳細モーダル
 */
const ActivityDetailModal: FC<{
  selectedActivity: LearningActivity | null;
  onClose: () => void;
}> = ({ selectedActivity, onClose }) => {
  return (
    <dialog id="activity_detail_modal" className={`modal ${selectedActivity ? 'modal-open' : ''}`}>
      <div className="modal-box">
        {selectedActivity && (
          <>
            <h3 className="font-bold text-lg">{formatDate(selectedActivity.activityDate)}の記録</h3>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-title">今回の点数</div>
                  <div className={`stat-value ${getScoreStyle(selectedActivity.score)}`}>
                    {selectedActivity.score}
                    <span className="text-xs">点</span>
                  </div>
                </div>
              </div>

              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-title">かかった時間</div>
                  <div className="stat-value text-lg">
                    {formatDuration(selectedActivity.duration)}
                  </div>
                </div>
              </div>
            </div>

            {/* 気分 */}
            {selectedActivity.mood && (
              <div className="bg-base-200/50 rounded-lg p-4 mt-4">
                <div className="font-bold mb-2">このときの気持ち</div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{getMoodEmoji(selectedActivity.mood)}</span>
                  <span className="text-lg">
                    {
                      MOOD_OPTIONS.find((m) => m.value === selectedActivity.mood)?.label.split(
                        ' ',
                      )[1]
                    }
                  </span>
                </div>
              </div>
            )}

            {/* メモ */}
            {selectedActivity.memo && (
              <div className="bg-base-200/50 rounded-lg p-4 mt-4">
                <div className="font-bold mb-2">メモ</div>
                <p className="whitespace-pre-wrap">{selectedActivity.memo}</p>
              </div>
            )}
          </>
        )}

        <div className="modal-action">
          <button type="button" className="btn" onClick={onClose}>
            とじる
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type={'button'} onClick={onClose}>
          close
        </button>
      </form>
    </dialog>
  );
};
