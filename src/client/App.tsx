import 'cally';

import type { LearningActivity } from '@/shared/types/activity';
import type { User } from '@/shared/types/user';
import { QRCodeSVG } from 'qrcode.react';
import { type CSSProperties, type FC, type FormEvent, Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
  Bar,
  ComposedChart,
  LabelList,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ErrorFallback } from './ErrorFallback';
import { useDashboard } from './api/dashboard/hooks';
import { useSheetName, useSheetUrl } from './api/sheet/hooks';
import { DevTools } from './devtool';

// 感情アイコンの定義
const moodOptions = [
  { value: 'happy', label: '😄 たのしかった！', color: 'bg-success/20' },
  { value: 'normal', label: '😊 ふつう', color: 'bg-info/20' },
  { value: 'tired', label: '😓 つかれた', color: 'bg-warning/20' },
  { value: 'hard', label: '🤔 むずかしかった', color: 'bg-error/20' },
];

interface AppLayoutProps {
  setIsModalOpen: (isOpen: boolean) => void;
  isModalOpen: boolean;
}

const AppLayout: FC<AppLayoutProps> = ({ setIsModalOpen, isModalOpen: _isModalOpen }) => {
  const { data, error, isLoading } = useDashboard();
  const { data: sheetUrl } = useSheetUrl();
  const { data: sheetName } = useSheetName();

  // ユーザーの状態を確認
  const isRegistered = data?.id && data?.name && data?.belonging;
  const hasActivities = data?.activities && data.activities.length > 0;

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="container mx-auto p-4">
          {isLoading ? (
            <>
              {/** 本当は各コンポーネントでやったほうがデザインやレイアウトの変更耐性があるが面倒なので一旦全部スケルトンを受け持つ */}
              <DashboardSkelton />
            </>
          ) : error ? (
            <div className="alert alert-error">
              <div>
                <span>Error: {error.message}</span>
              </div>
            </div>
          ) : !isRegistered ? (
            <UnregisteredView
              sheetName={sheetName ?? '取得できませんでした'}
              sheetUrl={sheetUrl ?? '取得できませんでした'}
            />
          ) : !hasActivities ? (
            <EmptyDashboard openModal={() => setIsModalOpen(true)} />
          ) : (
            <UserDashboard userData={data} />
          )}
          <p>ここにはログがリストもしくはテーブルの形式で仮想テーブルで列挙される予定</p>
        </main>

        <footer className="footer footer-center p-4 bg-base-300 text-base-content mt-auto">
          <aside>
            <p>Copyright © {new Date().getFullYear()} - GIG SCHOOL</p>
          </aside>
        </footer>

        {isRegistered && hasActivities && (
          <LearningRecordButton
            openModal={() => setIsModalOpen(true)}
            variant="fixed"
            label="学習を記録する"
          />
        )}
      </div>
    </>
  );
};

const App: FC = () => {
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

  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      {/* 開発ツールを追加 */}
      {import.meta.env.DEV && <DevTools />}

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense>
          <AppLayout setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} />
        </Suspense>
      </ErrorBoundary>

      {/* 記録用モーダル */}
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
    </>
  );
};
export default App;

const _Dashboard: FC = () => {
  const { data, error, isLoading, mutate } = useDashboard();
  const { data: sheetUrl } = useSheetUrl();
  const { data: sheetName } = useSheetName();

  if (isLoading)
    return (
      <div>
        <div>Loading...</div>
        <div className="flex w-52 flex-col gap-4">
          <div className="skeleton h-32 w-full" />
          <div className="skeleton h-4 w-28" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-full" />
        </div>
      </div>
    );
  if (error) {
    return (
      <div className="alert alert-error">
        <div>
          <span>Error: {error.message}</span>
          <button type="button" className="btn btn-sm btn-outline ml-4" onClick={() => mutate()}>
            再試行
          </button>
        </div>
      </div>
    );
  }
  if (!data) return <div>No data</div>;
  // 登録自体されていない場合
  if (!data.id || !data.name || !data.belonging) {
    return (
      <div className="card bg-base-100 shadow-xl border border-base-200 w-full max-w-full mx-auto p-6">
        <div className="card-body items-center text-center">
          <div className="badge badge-warning gap-2 p-3 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <title>{'warning'}</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="text-base font-medium">まだ登録が完了していません</span>
          </div>

          <h2 className="card-title text-2xl font-bold text-primary mt-2">
            先生に登録してもらおう！
          </h2>

          <div className="bg-info/10 rounded-lg p-4 my-4 w-full">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-info"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>{''}</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              どうすればいいの？
            </h3>
            <ol className="steps steps-vertical">
              <li className="step step-primary">この画面を先生に見せよう</li>
              <li className="step step-primary">
                先生があなたのお名前と学年・クラスを登録してくれるよ
              </li>
              <li className="step step-primary">
                登録が終わったら、このページをもういちど開いてみよう
              </li>
              <li className="step step-primary">これで学習記録が使えるようになるよ！</li>
            </ol>
          </div>

          <div className="bg-warning/10 rounded-lg p-4 mb-4 w-full">
            <div className="flex gap-3 items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-warning mt-1 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>{'warning'}</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="flex-1">
                <h3 className="font-bold text-lg">先生へのおねがい</h3>
                <div className="text-sm mt-2 space-y-2">
                  <p>生徒の基本情報を登録するための管理画面（Spreadsheet）があります。</p>

                  <div className="flex justify-center">
                    <details className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box max-w-xl">
                      <summary className="collapse-title py-2 text-lg font-medium bg-base-100">
                        先生はここをクリック
                      </summary>
                      <div className="collapse-content">
                        <div className="divider divider-warning text-xs">注意</div>
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-xs bg-warning/10 p-2 rounded-lg">
                            SpreadSheetは適切なアクセス管理・共有権限管理をお願いします。
                          </p>
                          <p className="">{`このアプリのSpreadsheet名: ${sheetName}`}</p>
                          {/* biome-ignore lint/style/noNonNullAssertion: <explanation> */}
                          <QRCodeSVG value={sheetUrl!} className="w-80 h-100" />
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // 学習記録がない場合
  if (data.activities.length === 0)
    return (
      <>
        <div className="card bg-base-100 shadow-xl border border-base-200 w-full max-w-full mx-auto p-6">
          <figure className="px-10 pt-10">
            <img
              src="https://img.icons8.com/clouds/256/000000/school.png"
              alt="学校のイラスト"
              className="w-48 h-48 mx-auto animate-bounce-slow"
            />
          </figure>
          <div className="card-body items-center text-center">
            <h2 className="card-title text-2xl font-bold text-primary">
              はじめての学習記録をつけてみよう！
            </h2>

            <div className="bg-info/10 rounded-lg p-4 my-4 w-full">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-info"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <title>{''}</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                どうやって記録するの？
              </h3>
              <ol className="steps steps-vertical">
                <li className="step step-primary">
                  画面下の「学習を記録する」ボタンをタップしよう
                </li>
                <li className="step step-primary">勉強した日にち・時間・点数を入力しよう</li>
                <li className="step step-primary">どんな気持ちだったか選んでみよう</li>
                <li className="step step-primary">「記録する」ボタンを押して完成！</li>
              </ol>
            </div>

            <div className="bg-success/10 rounded-lg p-4 mb-4 w-full">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-success"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <title>{''}</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                記録すると何がいいの？
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                <div className="card bg-base-100 shadow-sm">
                  <div className="card-body p-3">
                    <div className="text-center mb-2">
                      <span className="text-2xl">📊</span>
                    </div>
                    <h4 className="font-bold text-center mb-1">自分の成長が見える</h4>
                    <p className="text-sm">これまでの勉強の記録がグラフで見られるよ</p>
                  </div>
                </div>
                <div className="card bg-base-100 shadow-sm">
                  <div className="card-body p-3">
                    <div className="text-center mb-2">
                      <span className="text-2xl">🏆</span>
                    </div>
                    <h4 className="font-bold text-center mb-1">自己ベストを知れる</h4>
                    <p className="text-sm">あなたの最高点や最長時間が記録されるよ</p>
                  </div>
                </div>
                <div className="card bg-base-100 shadow-sm">
                  <div className="card-body p-3">
                    <div className="text-center mb-2">
                      <span className="text-2xl">👨‍👩‍👧‍👦</span>
                    </div>
                    <h4 className="font-bold text-center mb-1">記録を振り返る</h4>
                    <p className="text-sm">勉強の習慣がついて、もっと上手になれるよ</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-actions">
              <button
                type="button"
                onClick={() => {
                  // モーダルを開くためのコード
                  const modalOpenButton = document.querySelector('.fixed.bottom-8.right-8');
                  if (modalOpenButton) {
                    (modalOpenButton as HTMLButtonElement).click();
                  }
                }}
                className="btn btn-primary btn-lg gap-2 animate-pulse"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <title>{'add'}</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                はじめての記録をつける
              </button>
            </div>
          </div>
        </div>
      </>
    );
  return (
    <>
      <div className="card bg-base-100 shadow-md border border-base-200 w-full max-w-xl p-4">
        <h1 className="text-2xl font-bold">ダッシュボード</h1>
        <div className="flex flex-col gap-4">
          <div>{`ID: ${data.id} - name: ${data.name}`}</div>
          <div>{`${data.belonging}`}</div>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>日付</th>
                  <th>点数</th>
                  <th>時間</th>
                  <th>感情</th>
                </tr>
              </thead>
              <tbody>
                {data.activities.map((activity) => (
                  <tr key={activity.activityDate}>
                    <td>{activity.activityDate}</td>
                    <td>{activity.score}</td>
                    <td>{activity.duration}</td>
                    <td>{activity.mood}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

const Header: FC = () => {
  const { data: title, isLoading: isSheetLoading } = useSheetName();

  return (
    <header className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg rounded-b-lg max-h-24">
      <h1 className="text-2xl font-bold">
        {isSheetLoading ? (
          <>
            <span className="m-2">よみこみちゅう</span>
            <span className="loading loading-spinner loading-md" />
          </>
        ) : (
          title
        )}
      </h1>
      <div className="flex items-center gap-2">
        <span className="badge badge-outline badge-lg">レベル 5</span>
        <div className="avatar placeholder">
          <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
            <span>Me</span>
          </div>
        </div>
      </div>
    </header>
  );
};

const EmptyDashboard: FC<{ openModal: () => void }> = ({ openModal }) => {
  return (
    <>
      <div className="card bg-base-100 shadow-xl border border-base-200 w-full max-w-full mx-auto p-6">
        <figure className="px-10 pt-10">
          <img
            src="https://img.icons8.com/clouds/256/000000/school.png"
            alt="学校のイラスト"
            className="w-48 h-48 mx-auto animate-bounce-slow"
          />
        </figure>
        <div className="card-body items-center text-center">
          <h2 className="card-title text-2xl font-bold text-primary">
            はじめての学習記録をつけてみよう！
          </h2>

          <div className="bg-info/10 rounded-lg p-4 my-4 w-full">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-info"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>{''}</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              どうやって記録するの？
            </h3>
            <ol className="steps steps-vertical">
              <li className="step step-primary">画面下の「学習を記録する」ボタンをタップしよう</li>
              <li className="step step-primary">勉強した日にち・時間・点数を入力しよう</li>
              <li className="step step-primary">どんな気持ちだったか選んでみよう</li>
              <li className="step step-primary">「記録する」ボタンを押して完成！</li>
            </ol>
          </div>

          <div className="bg-success/10 rounded-lg p-4 mb-4 w-full">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>{''}</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              記録すると何がいいの？
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body p-3">
                  <div className="text-center mb-2">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h4 className="font-bold text-center mb-1">自分の成長が見える</h4>
                  <p className="text-sm">これまでの勉強の記録がグラフで見られるよ</p>
                </div>
              </div>
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body p-3">
                  <div className="text-center mb-2">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <h4 className="font-bold text-center mb-1">自己ベストを知れる</h4>
                  <p className="text-sm">あなたの最高点や最長時間が記録されるよ</p>
                </div>
              </div>
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body p-3">
                  <div className="text-center mb-2">
                    <span className="text-2xl">👨‍👩‍👧‍👦</span>
                  </div>
                  <h4 className="font-bold text-center mb-1">記録を振り返る</h4>
                  <p className="text-sm">勉強の習慣がついて、もっと上手になれるよ</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card-actions">
            <LearningRecordButton
              openModal={openModal}
              variant="inline"
              label="はじめての記録をつける"
            />
          </div>
        </div>
      </div>
    </>
  );
};

type ButtonVariant = 'fixed' | 'inline';

type LearningRecordButtonProps = {
  openModal: () => void;
  variant?: ButtonVariant;
  label?: string;
};
const LearningRecordButton: FC<LearningRecordButtonProps> = ({
  openModal,
  variant = 'fixed',
  label = '',
}) => {
  const getButtonClasses = () => {
    const baseClasses = 'btn btn-primary gap-2';

    switch (variant) {
      case 'fixed':
        return `${baseClasses} btn-xl fixed bottom-8 right-8 shadow-lg rounded-full text-xl animate-bounce`;
      case 'inline':
        return `${baseClasses} btn-xl animate-pulse`;
      default:
        return baseClasses;
    }
  };

  return (
    <button type="button" className={getButtonClasses()} onClick={openModal} aria-label={label}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <title>{'add'}</title>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
      </svg>
      {label}
    </button>
  );
};

const UserDashboard: FC<{ userData: User & { activities: LearningActivity[] } }> = ({
  userData,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-8">
      <Graph activities={userData.activities} />
      <Torophy />
    </div>
  );
};

const Graph: FC<{ activities: Omit<LearningActivity, 'userId'>[] }> = ({ activities }) => {
  /** chart */
  return (
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
        <ResponsiveContainer width={'95%'} height={300}>
          <ComposedChart
            data={activities}
            margin={{
              top: 5,
              right: 5,
              left: 5,
              bottom: -5,
            }}
          >
            <XAxis dataKey="activityDate" />
            <YAxis yAxisId="bar" dataKey={'duration'} orientation={'right'} />
            <YAxis
              dataKey={'score'}
              domain={['dataMin -10', 'datamax']}
              yAxisId={'line'}
              orientation={'left'}
            />
            <Bar
              yAxisId={'bar'}
              dataKey={'duration'}
              fill="#82ca9d"
              barSize={'30'}
              name="かかった時間（秒）"
            >
              <LabelList />
            </Bar>

            <Line
              type={'monotone'}
              dataKey={'score'}
              stroke="#8884d8"
              strokeWidth={2}
              activeDot={{ r: 8 }}
              yAxisId={'line'}
              name="点数"
            >
              <LabelList
                position={'top'}
                content={(props) => {
                  const { x, y, value } = props;
                  const numValue = value !== undefined ? Number(value) : 0;
                  const numY = y !== undefined ? Number(y) : 0;
                  const yPos = numValue > 90 ? numY + 20 : numY - 10;
                  return (
                    <text x={x} y={yPos} fontSize={16} textAnchor="middle" className="text-primary">
                      {value}
                    </text>
                  );
                }}
              />
            </Line>
            <Tooltip />
            <Legend />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const Torophy: FC = () => {
  /** ranking */
  return (
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
  );
};

const UnregisteredView: FC<{ sheetName: string; sheetUrl: string }> = ({ sheetName, sheetUrl }) => {
  return (
    <div className="card bg-base-100 shadow-xl border border-base-200 w-full max-w-full mx-auto p-6">
      <div className="card-body items-center text-center">
        <div className="badge badge-warning gap-2 p-3 mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>{'warning'}</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span className="text-base font-medium">まだ登録が完了していません</span>
        </div>

        <h2 className="card-title text-2xl font-bold text-primary mt-2">
          先生に登録してもらおう！
        </h2>

        <div className="bg-info/10 rounded-lg p-4 my-4 w-full">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-info"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <title>{''}</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            どうすればいいの？
          </h3>
          <ol className="steps steps-vertical">
            <li className="step step-primary">この画面を先生に見せよう</li>
            <li className="step step-primary">
              先生があなたのお名前と学年・クラスを登録してくれるよ
            </li>
            <li className="step step-primary">
              登録が終わったら、このページをもういちど開いてみよう
            </li>
            <li className="step step-primary">これで学習記録が使えるようになるよ！</li>
          </ol>
        </div>

        <div className="bg-warning/10 rounded-lg p-4 mb-4 w-full">
          <div className="flex gap-3 items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-warning mt-1 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <title>{'warning'}</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <h3 className="font-bold text-lg">先生へのおねがい</h3>
              <div className="text-sm mt-2 space-y-2">
                <p>生徒の基本情報を登録するための管理画面（Spreadsheet）があります。</p>

                <div className="flex justify-center">
                  <details className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box max-w-xl">
                    <summary className="collapse-title py-2 text-lg font-medium bg-base-100">
                      先生はここをクリック
                    </summary>
                    <div className="collapse-content">
                      <div className="divider divider-warning text-xs">注意</div>
                      <div className="flex flex-col items-center gap-2">
                        <p className="text-xs bg-warning/10 p-2 rounded-lg">
                          SpreadSheetは適切なアクセス管理・共有権限管理をお願いします。
                        </p>
                        <p className="">{`このアプリのSpreadsheet名: ${sheetName}`}</p>
                        {/* biome-ignore lint/style/noNonNullAssertion: <explanation> */}
                        <QRCodeSVG value={sheetUrl!} className="w-80 h-100" />
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardSkelton: FC = () => {
  return (
    <div className="card bg-base-100 shadow-xl border border-base-200 w-full max-w-full mx-auto p-6 animate-pulse">
      {/* ヘッダー部分のスケルトン */}
      <div className="flex justify-between items-center mb-6">
        <div className="skeleton h-8 w-1/3" />
        <div className="skeleton rounded-full h-12 w-12" />
      </div>

      {/* グラフとデータ表示部分のスケルトン */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* グラフスケルトン */}
        <div className="card bg-base-100 shadow-sm border border-base-200 w-full">
          <div className="card-body">
            <div className="flex items-center gap-2 mb-4">
              <div className="skeleton rounded-full h-6 w-6" />
              <div className="skeleton h-6 w-1/4" />
            </div>

            {/* グラフスケルトン */}
            <div className="h-64 w-full">
              <div className="flex h-full items-end justify-between px-2">
                <div className="skeleton h-1/3 w-8" />
                <div className="skeleton h-2/3 w-8" />
                <div className="skeleton h-1/2 w-8" />
                <div className="skeleton h-3/4 w-8" />
                <div className="skeleton h-1/4 w-8" />
                <div className="skeleton h-2/5 w-8" />
                <div className="skeleton h-3/5 w-8" />
              </div>
              <div className="skeleton h-0.5 w-full mt-2" />
              <div className="flex justify-between mt-2">
                <div className="skeleton h-4 w-16" />
                <div className="skeleton h-4 w-16" />
                <div className="skeleton h-4 w-16" />
              </div>
            </div>
          </div>
        </div>

        {/* ランキングスケルトン */}
        <div className="card shadow-md lg:w-1/3 bg-base-100 border border-base-200">
          <div className="card-body">
            <div className="flex items-center gap-2 mb-4">
              <div className="skeleton rounded-full h-6 w-6" />
              <div className="skeleton h-6 w-2/3" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="skeleton h-6 w-1/3" />
                <div className="skeleton h-6 w-1/4" />
              </div>
              <div className="skeleton h-0.5 w-full" />
              <div className="flex items-center justify-between">
                <div className="skeleton h-6 w-1/3" />
                <div className="skeleton h-6 w-1/4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 学習ログテーブルスケルトン */}
      <div className="mt-6">
        <div className="skeleton h-8 w-1/4 mb-4" />
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>
                  <div className="skeleton h-6 w-16" />
                </th>
                <th>
                  <div className="skeleton h-6 w-16" />
                </th>
                <th>
                  <div className="skeleton h-6 w-16" />
                </th>
                <th>
                  <div className="skeleton h-6 w-16" />
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((i) => (
                <tr key={i}>
                  <td>
                    <div className="skeleton h-6 w-24" />
                  </td>
                  <td>
                    <div className="skeleton h-6 w-12" />
                  </td>
                  <td>
                    <div className="skeleton h-6 w-16" />
                  </td>
                  <td>
                    <div className="skeleton h-6 w-20" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ローディングインジケーター */}
      <div className="flex justify-center items-center mt-8 gap-2">
        <div className="loading loading-spinner loading-md text-primary" />
        <p className="text-base font-medium text-primary">データを読み込み中...</p>
      </div>
    </div>
  );
};
