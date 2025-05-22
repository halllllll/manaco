import 'cally';

import { formatDate, formatDuration } from '@/shared/common/func';
import type { LearningActivity } from '@/shared/types/activity';
import type { User } from '@/shared/types/user';
import { QRCodeSVG } from 'qrcode.react';
import { type FC, type FormEvent, Suspense, useState } from 'react';
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
import { useDashboard } from './api/dashboard/hooks';
import { useSheetName, useSheetUrl } from './api/sheet/hooks';
import { ErrorFallback } from './components/ErrorFallback';
import { FormModal } from './components/FormModal';
import { Footer } from './components/parts/footer';
import { DevTools } from './devtool';

interface AppLayoutProps {
  setIsModalOpen: (isOpen: boolean) => void;
  isModalOpen: boolean;
}

// 感情アイコンの定義 TODO: データの実装をちゃんとやる
export const moodOptions = [
  { value: 'happy', label: '😄 たのしかった！', color: 'bg-success/20' },
  { value: 'normal', label: '😊 ふつう', color: 'bg-info/20' },
  { value: 'tired', label: '😓 つかれた', color: 'bg-warning/20' },
  { value: 'hard', label: '🤔 むずかしかった', color: 'bg-error/20' },
];

const AppLayout: FC<AppLayoutProps> = ({ setIsModalOpen, isModalOpen: _isModalOpen }) => {
  const { data, error, isLoading } = useDashboard();
  const { data: sheetUrl } = useSheetUrl();
  const { data: sheetName } = useSheetName();

  // ユーザーの状態を確認
  const isRegistered = data?.id && data?.name && data?.belonging;
  const hasActivities = data?.activities && data.activities.length > 0;

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-white-50 to-purple-100">
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
        </main>

        <Footer />

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

  // フォーム送信処理 いったんテストでコメントアウト
  const handleSubmitPost = (e: FormEvent) => {
    e.preventDefault();
    console.log('投稿内容:');
    console.log(e);
    // ここで実際の投稿処理（APIコールなど）

    // フォームリセットとモーダルを閉じる
    setIsModalOpen(false);
  };

  return (
    <>
      {/* 開発ツールを追加 */}
      {import.meta.env.DEV && <DevTools />}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense>
          <AppLayout setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} />
        </Suspense>
      </ErrorBoundary>
      <FormModal
        isModalOpen={isModalOpen}
        handleSubmitPost={handleSubmitPost}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};
export default App;

const Header: FC = () => {
  const { data: title, isLoading: isSheetLoading } = useSheetName();
  const { data: user, isLoading: isDashboardLoading } = useDashboard();
  return (
    <header className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg rounded-b-lg max-h-24">
      <div className="container mx-auto flex justify-between items-center gap-2">
        <h1 className="text-3xl font-bold">
          {isSheetLoading || isDashboardLoading ? (
            <>
              <span className="m-2">よみこみちゅう</span>
              <span className="loading loading-spinner loading-md" />
            </>
          ) : (
            title
          )}
        </h1>
        {user?.name && (
          <div className="flex flex-col items-end">
            <div className="flex flex-row items-center gap-2">
              {user?.belonging && (
                <div className="badge badge-outline badge-lg">{user.belonging}</div>
              )}
              <div className="text-lg font-semibold">{`${user.name} さん`}</div>
            </div>
            <div>{`${user?.id}`}</div>
          </div>
        )}
      </div>
    </header>
  );
};

const EmptyDashboard: FC<{ openModal: () => void }> = ({ openModal }) => {
  return (
    <>
      <div className="card bg-base-100 shadow-xl border border-base-200 w-full max-w-full mx-auto p-6">
        <figure className="pt-10">
          <img
            src="https://img.icons8.com/clouds/256/000000/school.png"
            alt="学校のイラスト"
            className="w-48 h-48 mx-auto"
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

type LearningRecordButtonProps = {
  openModal: () => void;
  variant?: 'fixed' | 'inline';
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
        return `${baseClasses} btn-xl fixed bottom-8 right-8 shadow-lg rounded-full text-xl animate-pulse`;
      case 'inline':
        return `${baseClasses} btn-xl animate-bounce`;
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
    <div className="flex flex-col">
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <Graph activities={userData.activities} />
        <Torophy />
      </div>
      <LearningLogSection activities={userData.activities} />
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
        <h2 className="card-title text-3xl font-bold text-primary mt-2">
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
            <li className="step step-primary">先生があなたのお名前とクラスを登録してくれるよ</li>
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
                <p>
                  このアプリの設定管理画面（Spreadsheet）で、生徒の基本情報の登録をお願いします。
                </p>

                <div className="flex justify-center">
                  <details className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box max-w-xl">
                    <summary className="collapse-title py-2 text-lg font-medium bg-base-100">
                      先生はここをクリック
                    </summary>
                    <div className="collapse-content">
                      <div className="divider divider-warning text-lg font-bold text-red-500">
                        ⚠️ 注意 ⚠️
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-sm font-extrabold bg-warning/25 p-4 rounded-lg text-left flex flex-col gap-2">
                          <p>SpreadSheetは適切なアクセス管理・共有権限管理をお願いします。</p>
                          <p>
                            <span
                              className="tooltip cursor-help border-b border-dashed border-primary inline-flex items-center gap-1"
                              data-tip="ワークシートや学習ドリル、アンケートなどの学習に関する、教職員や児童生徒自身が日々の学校における教育活動において活用する情報"
                            >
                              学習系データ
                            </span>
                            と、
                            <span
                              className="tooltip cursor-help border-b border-dashed border-primary inline-flex items-center gap-1"
                              data-tip="指導要録に記載のある成績情報・学習指導、生徒指導、生活指導等に活用する情報"
                            >
                              校務系データ
                            </span>
                            を認識し、適切に管理してください。
                          </p>
                          <p>
                            参考:{' '}
                            <a
                              href="https://www.mext.go.jp/content/20250328-mxt_syoto01-000028144_01.pdf"
                              className="text-blue-500 underline"
                            >
                              {'教育データの利活用に係る留意事項 第３版（文部科学省：R7.3）'}
                            </a>
                          </p>
                        </div>
                        <p className="">
                          {'アプリのSpreadsheet名: '}
                          <span className="font-bold">【{sheetName}】</span>
                        </p>
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

const LearningLogSection: FC<{ activities: LearningActivity[] }> = ({ activities }) => {
  const [selectedActivity, setSelectedActivity] = useState<LearningActivity | null>(null);

  // 点数に応じたスタイル
  const getScoreStyle = (score: number) => {
    if (score >= 95) return 'text-warning font-bold';
    if (score >= 80) return 'text-success font-bold';
    if (score >= 60) return 'text-info';
    return 'text-error';
  };

  // ムードに対応する絵文字を取得
  const getMoodEmoji = (mood?: string) => {
    if (!mood) return '';
    const moodOption = moodOptions.find((option) => option.value === mood);
    return moodOption ? moodOption.label.split(' ')[0] : '';
  };

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
            <title>{'学習記録'}</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          学習の記録
          <span className="badge badge-sm">{activities.length}件</span>
        </h2>

        <div className="overflow-x-auto max-h-[40vh] overflow-y-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th className="sticky top-0 bg-base-100">日付</th>
                <th className="sticky top-0 bg-base-100">点数</th>
                <th className="hidden md:table-cell sticky top-0 bg-base-100">かかった時間</th>
                <th className="hidden md:table-cell sticky top-0 bg-base-100">きもち</th>
                <th className="sticky top-0 bg-base-100">{''}</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                <tr
                  key={activity.activityDate}
                  className="hover cursor-pointer"
                  onClick={() => setSelectedActivity(activity)}
                >
                  <td>{formatDate(activity.activityDate)}</td>
                  <td>
                    <span className={getScoreStyle(activity.score)}>{activity.score}点</span>
                  </td>
                  <td className="hidden md:table-cell">{formatDuration(activity.duration)}</td>
                  <td className="hidden md:table-cell">
                    <span
                      className="text-xl"
                      title={moodOptions.find((m) => m.value === activity.mood)?.label}
                    >
                      {getMoodEmoji(activity.mood)}
                    </span>
                  </td>
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
      <dialog
        id="activity_detail_modal"
        className={`modal ${selectedActivity ? 'modal-open' : ''}`}
      >
        <div className="modal-box">
          {selectedActivity && (
            <>
              <h3 className="font-bold text-lg">
                {formatDate(selectedActivity.activityDate)}の記録
              </h3>

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
                        moodOptions
                          .find((m) => m.value === selectedActivity.mood)
                          ?.label.split(' ')[1]
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

              {/* 先生からのコメント (将来の機能として) */}

              {/* <div className="bg-primary/10 rounded-lg p-4 mt-4">
                <div className="font-bold mb-2 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <title>{'comment'}</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  <span>先生からのコメント</span>
                </div>
                <p className="italic">"{'先生からのコメント'}"</p>
              </div> */}

              {/* ごほうび機能 (将来の機能として) */}
              {/* {selectedActivity.score >= 90 && (
                <div className="bg-warning/20 rounded-lg p-4 mt-4 text-center animate-pulse">
                  <div className="text-2xl mb-2">🎉 すごい！ 🎉</div>
                  <div className="font-bold">高得点のごほうび</div>
                  <div className="badge badge-warning gap-2 mt-1">ゴールドメダル獲得！</div>
                </div>
              )} */}
              <p>{null}</p>
            </>
          )}

          <div className="modal-action">
            <button type="button" className="btn" onClick={() => setSelectedActivity(null)}>
              とじる
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type={'button'} onClick={() => setSelectedActivity(null)}>
            close
          </button>
        </form>
      </dialog>
    </div>
  );
};
