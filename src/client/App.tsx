import 'cally';

import { type CSSProperties, type FC, type FormEvent, useEffect, useState } from 'react';
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { SheetApp } from './api/getSheetInfo';
import { isGASEnvironment } from './serverFunctions';

// const { serverFunctions } = new GASClient<typeof server>();

// 感情アイコンの定義
const moodOptions = [
  { value: 'happy', label: '😄 たのしかった！', color: 'bg-success/20' },
  { value: 'normal', label: '😊 ふつう', color: 'bg-info/20' },
  { value: 'tired', label: '😓 つかれた', color: 'bg-warning/20' },
  { value: 'hard', label: '🤔 むずかしかった', color: 'bg-error/20' },
];

const App: FC = () => {
  // const [count, setCount] = useState(0);
  // const handleButtonClick = async () => {
  //   console.log(`affect value ${count} to SpreadSheet A1 cell!`);
  //   await serverFunctions.affectCountToA1(count);
  // };

  const [title, setTitle] = useState<string | null>('学習記録');
  const [sheetUrl, setSheetUrl] = useState<string>('');

  // 投稿モーダル用のステート
  const [isModalOpen, setIsModalOpen] = useState(false);

  // フォーム送信処理
  const handleSubmitPost = (e: FormEvent) => {
    e.preventDefault();
    console.log('投稿内容:');
    // ここで実際の投稿処理（APIコールなど）

    // フォームリセットとモーダルを閉じる
    setIsModalOpen(false);
  };

  useEffect(() => {
    const getTitle = async () => {
      const [spreadsheettitle, spreadsheeturl] = await Promise.all([
        SheetApp.getSheetName(),
        SheetApp.getSheetUrl(),
      ]);
      console.log(`get spread sheet title: ${spreadsheettitle ?? '(null)'}`);
      setTitle(spreadsheettitle);
      setSheetUrl(spreadsheeturl);
    };
    void getTitle();
  }, []);

  const pseudoData = [
    {
      name: 'Page A',
      uv: 400,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 300,
      pv: 4567,
      amt: 2400,
    },
    {
      name: 'Page C',
      uv: 200,
      pv: 1398,
      amt: 2400,
    },
    {
      name: 'Page D',
      uv: 278,
      pv: 3908,
      amt: 2400,
    },
    {
      name: 'Page E',
      uv: 189,
      pv: 4800,
      amt: 2400,
    },
    {
      name: 'Page F',
      uv: 239,
      pv: 3800,
      amt: 2400,
    },
    {
      name: 'Page G',
      uv: 349,
      pv: 4300,
      amt: 877,
    },
  ];

  // 今日の日付を取得（フォームのデフォルト値用）
  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <header className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg rounded-b-lg">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="flex items-center gap-2">
            <span className="badge badge-outline badge-lg">レベル 5</span>
            <div className="avatar placeholder">
              <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                <span>Me</span>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto p-4">
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="card bg-base-100 w-full shadow-md border border-base-200">
              <div className="card-body">
                <h2 className="card-title text-xl flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <title>{'学習時間'}</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  これまでの記録
                </h2>
                <ResponsiveContainer width={'100%'} height={300}>
                  <LineChart data={pseudoData}>
                    <Line
                      type={'monotone'}
                      dataKey={'uv'}
                      stroke="#8884d8"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Legend />
                    <Tooltip />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card shadow-md lg:w-1/3 bg-base-100 border border-base-200">
              <div className="card-body">
                <h2 className="card-title text-xl flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-secondary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <title>{'ranking'}</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  がんばったよ！ランキング
                </h2>
                <div className="overflow-x-auto">
                  <table className="table border border-base-content/5">
                    <tbody>
                      {/* row 1 */}
                      <tr className="hover bg-warning/10">
                        <th className="text-nowrap">
                          <div className="badge badge-warning gap-2">1位</div>
                          <span className="ml-2">最高得点！</span>
                        </th>
                        <td className="font-bold text-lg">99点</td>
                        <td>{'2025-05-21'}</td>
                      </tr>
                      {/* row 2 */}
                      <tr className="hover bg-info/10">
                        <th className="text-nowrap">
                          <div className="badge badge-info gap-2">2位</div>
                          <span className="ml-2">最速回答！</span>
                        </th>
                        <td className="font-bold text-lg">148秒</td>
                        <td>{'2025-04-11'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          {'popoverを試したい始まり'}
          <div>
            <button
              type="button"
              popoverTarget="date-popover"
              className="input input-border"
              id="target-date-btn"
              // style="anchorName:--target-date" // anchorpositioning関係はエディタ上では現状のルール,環境およびツールチェインだとエラーになる
              style={{ anchorName: '--target-date' } as CSSProperties}
            >
              pick a date
            </button>
            <div
              popover="auto"
              id="date-popover"
              className="dropdown bg-base-100 rounded-box shadow-lg"
              // style="positionAnchor:--target-date" // anchorpositioning関係はエディタ上では現状のルール,環境およびツールチェインだとエラーになる
              style={{ positionAnchor: '--target-date' } as CSSProperties}
            >
              <calendar-date
                className="cally"
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
                <svg
                  aria-label="Previous"
                  className="fill-current size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <title>前の月</title>
                  <path d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                <svg
                  aria-label="Next"
                  className="fill-current size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <title>次の月</title>
                  <path d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
                <calendar-month />
              </calendar-date>
            </div>
          </div>
          {'popoverを試したい終わり'}
          <div className="flex justify-center mb-8">
            <div className="card bg-base-100 shadow-md border border-base-200 w-full max-w-md">
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
          {isGASEnvironment() ? (
            <>
              <div>here is PROD env</div>
              <div>
                Go to Sheet:{' '}
                <a href={sheetUrl} target="_blank" rel="noreferrer">
                  LINK
                </a>
              </div>
            </>
          ) : (
            <div>here is DEV env</div>
          )}
        </div>

        <footer className="footer footer-center p-4 bg-base-300 text-base-content mt-auto">
          <aside>
            <p>Copyright © {new Date().getFullYear()} - GIG SCHOOL</p>
          </aside>
        </footer>

        {/* 記録追加用のボタン - 固定位置 */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary btn-lg fixed bottom-8 right-8 shadow-lg rounded-full gap-2 text-lg animate-bounce"
          aria-label="今日の学習を記録する"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>{'新規投稿'}</title>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          学習を記録する
        </button>

        {/* 記録用モーダル */}
        <dialog id="post_modal" className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
          <div className="modal-box bg-base-100 max-w-3xl">
            <h3 className="font-bold text-2xl mb-6 text-center text-primary">
              今日の学習を記録しよう！
            </h3>

            <form onSubmit={handleSubmitPost}>
              {/* 日付選択 */}
              <div className="form-control w-full mb-4">
                <label className="label" htmlFor="study_date">
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
                <input
                  id="study_date"
                  type="date"
                  defaultValue={today}
                  className="input input-bordered w-full"
                  // value={postTitle}
                  onChange={(e) => console.log(e.target.value)}
                  required
                />
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
    </>
  );
};

export default App;
