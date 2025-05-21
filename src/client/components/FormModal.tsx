import type { CSSProperties, FC, FormEvent } from 'react';
import { moodOptions } from '../App';

export const FormModal: FC<{
  isModalOpen: boolean;
  handleSubmitPost: (e: FormEvent) => void;
  setIsModalOpen: (_: boolean) => void;
}> = ({ isModalOpen, handleSubmitPost, setIsModalOpen }) => {
  const today = new Date().toISOString().split('T')[0];
  return (
    <div>
      <dialog id="post_modal" className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box bg-base-100 max-w-3xl">
          <h3 className="font-bold text-2xl mb-6 text-center text-primary">
            今日の学習を記録しよう！
          </h3>
          <form onSubmit={handleSubmitPost}>
            {/* 日付選択 */}
            <div className="form-control w-full mb-4">
              <label className="label" htmlFor="target-date-btn">
                <span className="label-text text-lg font-medium flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <title>{'calendar'}</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  どの日に勉強した？
                </span>
              </label>
              <div>
                <button
                  type="button"
                  popoverTarget="date-popover"
                  className="input input-border"
                  id="target-date-btn"
                  // style="anchorName:--target-date" // anchorpositioning関係はエディタ上では現状のルール,環境およびツールチェインだとエラーになる
                  style={{ anchorName: '--target-date' } as CSSProperties}
                >
                  {today}
                </button>
                <div
                  popover="auto"
                  id="date-popover"
                  className="dropdown bg-base-100 rounded-box shadow-lg max-w-xl w-full"
                  // style="positionAnchor:--target-date" // anchorpositioning関係はエディタ上では現状のルール,環境およびツールチェインだとエラーになる
                  style={{ positionAnchor: '--target-date' } as CSSProperties}
                >
                  <div className="card bg-base-100 shadow-md border border-base-200 w-full max-w-xl">
                    <div className="card-body">
                      <h2 className="card-title text-xl flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-accent"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <title>{'calendar'}</title>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        カレンダー
                      </h2>
                      <calendar-date
                        className="cally bg-base-100 shadow-none rounded-box w-full"
                        isDateDisallowed={(date) => {
                          const disabledDates = ['2025-05-20', '2025-05-24'];
                          return disabledDates.includes(date.toISOString().split('T')[0]);
                        }}
                        onchange={(e) => {
                          const value = (e.target as HTMLInputElement).value;
                          console.log(`value: ${value}`);
                          const targetDateButton = document.getElementById('target-date-btn');
                          if (targetDateButton) {
                            targetDateButton.innerText = value;
                          }
                          // close popover
                          const popover = document.getElementById('date-popover');
                          if (popover && 'hidePopover' in popover) {
                            (popover as HTMLElement).hidePopover();
                          }
                        }}
                      >
                        <button
                          type={'button'}
                          slot={'previous'}
                          aria-label={'previous'}
                          className="btn btn-ghost btn-sm"
                        >
                          <span className="flex items-center">
                            <svg
                              className="fill-current size-4"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                            >
                              <title>前の月</title>
                              <path d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                            <span className="ml-1">前の月</span>
                          </span>
                        </button>
                        <button
                          type={'button'}
                          slot={'next'}
                          aria-label={'next'}
                          className="btn btn-ghost btn-sm"
                        >
                          <span className="flex items-center">
                            <span className="mr-1">次の月</span>
                            <svg
                              className="fill-current size-4"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                            >
                              <title>次の月</title>
                              <path d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                          </span>
                        </button>
                        <calendar-month />
                      </calendar-date>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* 学習時間 */}
            <div className="form-control w-full mb-4">
              <label className="label" htmlFor="study_time">
                <span className="label-text text-lg font-medium flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <title>{'clock'}</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  どれくらい勉強した？
                </span>
              </label>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <select
                    className="select select-bordered w-full"
                    id="study_time"
                    defaultValue="30"
                  >
                    <option value="15">15分</option>
                    <option value="30">30分</option>
                    <option value="45">45分</option>
                    <option value="60">1時間</option>
                    <option value="90">1時間30分</option>
                    <option value="120">2時間</option>
                    <option value="150">2時間30分</option>
                    <option value="180">3時間以上</option>
                  </select>
                </div>
                <div className="w-1/2">
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="15"
                      max="180"
                      defaultValue="30"
                      step="15"
                      className="range range-primary range-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* 点数 */}
            <div className="form-control w-full mb-6">
              <label className="label" htmlFor="score">
                <span className="label-text text-lg font-medium flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <title>{'score'}</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  今日の点数は？
                </span>
              </label>
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-5 gap-2">
                  <input
                    type="radio"
                    name="score"
                    value="20"
                    className="btn btn-xs"
                    aria-label="20点"
                  />
                  <input
                    type="radio"
                    name="score"
                    value="40"
                    className="btn btn-xs"
                    aria-label="40点"
                  />
                  <input
                    type="radio"
                    name="score"
                    value="60"
                    className="btn btn-xs"
                    aria-label="60点"
                  />
                  <input
                    type="radio"
                    name="score"
                    value="80"
                    className="btn btn-xs"
                    aria-label="80点"
                  />
                  <input
                    type="radio"
                    name="score"
                    value="100"
                    className="btn btn-xs btn-active"
                    aria-label="100点"
                    defaultChecked
                  />
                </div>
                <div className="text-center">
                  <span className="font-bold text-2xl text-primary">100</span>
                  <span className="text-lg"> 点</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="100"
                  step="5"
                  className="range range-primary"
                />
                <div className="flex justify-between text-xs px-2">
                  <span>0</span>
                  <span>25</span>
                  <span>50</span>
                  <span>75</span>
                  <span>100</span>
                </div>
              </div>
            </div>
            {/* 気分 (オプション) */}
            <div className="form-control w-full mb-6">
              <label className="label" htmlFor="mood">
                <span className="label-text text-lg font-medium flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <title>{'mood'}</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  勉強してどうだった？
                </span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {moodOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`card ${option.color} shadow-sm hover:shadow-md transition-all cursor-pointer`}
                  >
                    <div className="card-body items-center text-center p-3">
                      <input
                        type="radio"
                        name="mood"
                        value={option.value}
                        className="radio radio-primary hidden"
                        id={`mood_${option.value}`}
                      />
                      <label
                        htmlFor={`mood_${option.value}`}
                        className="cursor-pointer text-xl font-bold"
                      >
                        {option.label}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-action flex justify-center gap-4">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setIsModalOpen(false)}
              >
                キャンセル
              </button>
              <button type="submit" className="btn btn-primary btn-lg gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <title>{'check'}</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                記録する
              </button>
            </div>
          </form>
        </div>
        {/* モーダルの背景をクリックしても閉じられるようにする */}
        <form method="dialog" className="modal-backdrop">
          <button type={'button'} onClick={() => setIsModalOpen(false)}>
            閉じる
          </button>
        </form>
      </dialog>
    </div>
  );
};
