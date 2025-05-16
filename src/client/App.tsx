import 'cally';

import { GASClient } from 'gas-client';
import { isGASEnvironment } from 'gas-client/src/utils/is-gas-environment';
import { type FC, type FormEvent, useEffect, useState } from 'react';
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type * as server from '../server/main';
import { SheetNameAPI, SheetUrlAPI } from './stubs/getSheetInfo';

const { serverFunctions } = new GASClient<typeof server>();

const App: FC = () => {
  const [count, setCount] = useState(0);
  // communicate to spreadsheet
  const handleButtonClick = async () => {
    console.log(`affect value ${count} to SpreadSheet A1 cell!`);
    await serverFunctions.affectCountToA1(count);
  };

  const [title, setTitle] = useState<string | null>('');
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
      const [spreadsheettitle, spreadsheeturl] = await Promise.all([SheetNameAPI(), SheetUrlAPI()]);
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

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <header className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-bold text-pink-700">まいにちの記録</h1>
          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center rounded-full text-pink-500 hover:bg-pink-100 transition-colors"
            // onClick={() => setShowSettings(true)}
            aria-label="設定"
          >
            記録だよ
          </button>
        </header>
        <div className="container mx-auto p-4 bg-gray">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="card bg-base-100 w-full shadow-sm">
              <div className="card-body">
                <h2 className="card-title">これまでの記録</h2>
                <ResponsiveContainer width={'100%'} height={300}>
                  <LineChart data={pseudoData}>
                    <Line
                      type={'monotone'}
                      dataKey={'uv'}
                      stroke="#333444"
                      strokeWidth={2}
                      activeDot={{ r: -8 }}
                    />
                    <XAxis dataKey="pv" />
                    <YAxis />
                    <Legend />
                    <Tooltip />
                  </LineChart>
                </ResponsiveContainer>
                <div className="justify-end card-actions">
                  <button type="button" className="btn btn-primary">
                    本来はボタンとかがここにくるぽい
                  </button>
                </div>
              </div>
            </div>
            <div className="card shadow-sm lg:w-1/3 bg-base-100">
              <div className="card-body">
                <div>aaa</div>
                <table className="table border border-base-content/5">
                  <tbody className="">
                    {/* row 1 */}
                    <tr>
                      <th className="text-nowrap">最高得点！</th>
                      <td>99点</td>
                      <td>{'2025-05-21'}</td>
                    </tr>
                    {/* row 2 */}
                    <tr>
                      <th className="text-nowrap">最速回答！</th>
                      <td>148秒</td>
                      <td>{'2025-04-11'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <a href="/src/server/Menu/menu.html">（カスタムメニューのhtmlサンプル）</a>
          <h1>{title !== '' ? title : 'Vite + React on GAS'}</h1>
          <div className="flex justify-center">
            <calendar-date
              className="cally bg-base-100 border border-base-300 shadow-lg rounded-box w-xl"
              isDateDisallowed={(date) => {
                const disabledDates = ['2025-05-20', '2025-05-24'];
                return disabledDates.includes(date.toISOString().split('T')[0]);
              }}
            >
              <button
                type={'button'}
                slot={'previous'}
                aria-label={'previous'}
                className="btn btn-secondary"
              >
                <span className="flex items-center">
                  <svg
                    className="fill-current size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <title>{''}</title>
                    <path d="M15.75 19.5 8.25 12l7.5-7.5" />
                  </svg>
                  前の月
                </span>
              </button>
              <calendar-month />
            </calendar-date>
          </div>
          <div className="card">
            <button
              className="btn btn-primary"
              type={'button'}
              onClick={() => {
                setCount((count: number) => count + 1);
              }}
            >
              count is {count}
            </button>
            <div className="card">
              <div className="card-body">
                <button
                  type={'button'}
                  onClick={async () => {
                    await handleButtonClick();
                  }}
                >
                  SpreadSheetにカウントを反映する
                </button>
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
        <footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content mt-auto p-4">
          <aside>
            <p>Copyright © {new Date().getFullYear()} - GIG SCHOOL</p>
          </aside>
        </footer>
        {/* 右下に固定された投稿ボタン */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="btn btn-circle btn-primary btn-lg fixed bottom-20 right-6 shadow-lg"
          aria-label="新規投稿"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>{'新規投稿'}</title>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>

        {/* 投稿用モーダル */}
        <dialog id="post_modal" className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
          <div className="modal-box">
            <h3 className="font-bold text-lg">新規投稿</h3>

            <form onSubmit={handleSubmitPost}>
              <div className="form-control w-full">
                <label className="label" htmlFor="post_title">
                  <span className="label-text">タイトル</span>
                </label>
                <input
                  id="post_title"
                  type="text"
                  placeholder="タイトルを入力"
                  className="input input-bordered w-full"
                  // value={postTitle}
                  onChange={(e) => console.log(e.target.value)}
                  required
                />
              </div>

              <div className="form-control w-full mt-4">
                <label className="label" htmlFor="post_content">
                  <span className="label-text">内容</span>
                </label>
                <textarea
                  id="post_content"
                  className="textarea textarea-bordered h-24"
                  placeholder="投稿内容を入力"
                  onChange={(e) => console.log(e.target.value)}
                  required
                />
              </div>

              <div className="modal-action">
                <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>
                  キャンセル
                </button>
                <button type="submit" className="btn btn-primary">
                  投稿する
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
