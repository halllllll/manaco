import { formatDate, formatDuration } from '@/shared/common/func';
import { MOOD_OPTIONS, getMoodEmoji } from '@/shared/constants/mood';
import type { LearningActivity } from '@/shared/types/activity';
import { type FC, useState } from 'react';
import type { LearningLogSectionProps } from '../types/props';

import { useSettings } from '@/client/api/settings/hook';

/**
 * 学習記録セクションコンポーネント
 */
export const LearningLogSection: FC<LearningLogSectionProps> = ({ activities }) => {
  // appsettings
  const { data, error, isLoading } = useSettings();
  if (error) {
    throw new Error(`Failed to fetch settings: ${error.name} - ${error.message}`);
  }
  const orderedActivities = activities.toSorted((a, b) =>
    b.activityDate.localeCompare(a.activityDate),
  );

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
          <span className="badge badge-md">{activities.length}件</span>
        </h2>

        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <img
              src="https://img.icons8.com/clouds/100/000000/book.png"
              alt="本のイラスト"
              className="w-24 h-24 mb-4"
            />
            <p className="text-lg font-medium text-center">
              まだ学習記録がありません。
              <br />
              「学習を記録する」ボタンを押して始めましょう！
            </p>
          </div>
        ) : (
          <div className="rounded-lg bg-base-200/30 p-2 shadow-inner">
            <div className="overflow-x-auto max-h-[40vh] rounded-lg">
              <table className="table w-full">
                <thead className="">
                  <tr className="">
                    <th className="sticky top-0 bg-base-100 text-primary-content rounded-tl-lg font-bold z-10 shadow-sm">
                      日付
                    </th>
                    <th className="sticky top-0 bg-base-100 text-primary-content text-end font-bold z-10 shadow-sm">
                      点数
                    </th>
                    <th className="hidden md:table-cell sticky top-0 bg-base-100 text-primary-content text-end font-bold z-10 shadow-sm">
                      かかった時間
                    </th>

                    <th className="hidden md:table-cell sticky top-0 bg-base-100 text-primary-content text-center font-bold z-10 w-32 shadow-sm">
                      <span className={`${!data?.showMood ? 'opacity-0' : ''}`}>きもち</span>
                    </th>
                    <th className="sticky top-0 bg-base-100 rounded-tr-lg z-10 w-24 shadow-sm" />
                  </tr>
                </thead>
                <tbody className="">
                  {orderedActivities.map((activity, index) => (
                    <tr
                      key={activity.activityDate}
                      className={`hover:bg-base-200 cursor-pointer transition-colors h-16 ${
                        index % 2 === 0 ? 'bg-base-100' : 'bg-base-100/50'
                      }`}
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
                      <td className="font-medium">
                        <div className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-secondary"
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
                          {formatDate(activity.activityDate)}
                        </div>
                      </td>
                      <td className="text-end">
                        <div className="flex items-center justify-end">
                          <span
                            className="badge badge-lg border-primary  px-3 py-3"
                            title={`${activity.score}点`}
                          >
                            {activity.score}点
                          </span>
                        </div>
                      </td>
                      <td className="text-end hidden md:table-cell">
                        <div className="flex items-center justify-end gap-1">
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
                          <span className="font-medium">{formatDuration(activity.duration)}</span>
                        </div>
                      </td>
                      <td className="text-center hidden md:table-cell w-32">
                        {data?.showMood && (
                          <div
                            className="tooltip"
                            data-tip={MOOD_OPTIONS.find((m) => m.value === activity.mood)?.label}
                          >
                            <span className="text-2xl">{`${getMoodEmoji(activity.mood)}`}</span>
                          </div>
                        )}
                      </td>
                      <td className="w-24">
                        <button
                          type="button"
                          className="btn btn-xs btn-circle btn-ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedActivity(activity);
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
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

            <div className="grid grid-cols-2 gap-4 mt-4">
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
                    かかった時間
                  </div>
                  <div className="stat-value text-info text-lg">
                    {formatDuration(selectedActivity.duration)}
                  </div>
                </div>
              </div>
            </div>

            {/* 気分 */}
            {selectedActivity.mood && (
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
                  <span className="text-4xl">{getMoodEmoji(selectedActivity.mood)}</span>
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

            {/* メモ */}
            {selectedActivity.memo && (
              <div className="bg-base-200/60 rounded-lg p-4 mt-4 border-l-4 border-accent">
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
                  メモ
                </div>
                <div className="bg-white/50 p-3 rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedActivity.memo}</p>
                </div>
              </div>
            )}

            {/* ふりかえり */}
            {/** 未実装だが、あとで先生からのメッセージとかに利用できるかも */}
            {/* <div className="bg-success/10 rounded-lg p-4 mt-4 border-l-4 border-success">
              <div className="font-bold mb-2 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-success"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <title>ふりかえり</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                今日のふりかえり
              </div>
              <div className="bg-white/50 p-3 rounded-lg">
                <p>学習をふりかえると、次の学習がもっと楽しくなりますよ！</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>どんなことをがんばりましたか？</li>
                  <li>次はどんなことに挑戦したいですか？</li>
                </ul>
              </div>
            </div> */}
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

// /**
//  * 気分に応じたメッセージを取得
//  */
// const getMoodMessage = (mood: string): string => {
//   switch (mood) {
//     case 'happy':
//       return '楽しく勉強できると、頭にも入りやすいよ！';
//     case 'normal':
//       return '落ち着いて勉強できると、理解が深まるよ！';
//     case 'tired':
//       return '疲れたときは休憩も大切だよ！';
//     case 'frustrated':
//       return 'むずかしいときは先生や友だちに聞いてみよう！';
//     default:
//       return '自分の気持ちを知ることも大切だね！';
//   }
// };
