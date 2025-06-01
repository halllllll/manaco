import { useToast } from '@/client/context/ToastConterxt';
import type { FC } from 'react';
import { useRef, useState } from 'react';
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
import { useUserState } from '../hooks/useUserState'; // Added
import { useUserStats } from '../hooks/useUserStats'; // Added
import type { GraphProps } from '../types/props';

/**
 * 学習記録グラフコンポーネント
 */
export const Graph: FC<GraphProps> = ({ activities }) => {
  const maxScore = Math.max(...activities.map((a) => a.score));
  const orderedActivities = activities.toSorted((a, b) =>
    a.activityDate.localeCompare(b.activityDate),
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();
  const { userData } = useUserState(); // Added
  const userStats = useUserStats(activities); // Added

  // グラフを画像として保存する関数
  const saveAsImage = () => {
    try {
      if (!chartRef.current) return;

      const svgElement = chartRef.current.querySelector('svg');
      if (!svgElement) {
        addToast('error', 'グラフを見つけることができませんでした', 3000);
        return;
      }

      // SVGをクローンして修正（テキストの表示など）
      const clonedSvg = svgElement.cloneNode(true) as SVGElement;
      clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

      // SVG文字列に変換
      const svgString = new XMLSerializer().serializeToString(clonedSvg);

      // Base64エンコード
      const svgBase64 = btoa(unescape(encodeURIComponent(svgString)));

      // SVG URLを作成
      const svgUrl = `data:image/svg+xml;base64,${svgBase64}`;

      // キャンバスに描画してPNG変換
      const canvas = document.createElement('canvas');
      const bbox = svgElement.getBoundingClientRect();
      canvas.width = bbox.width;
      canvas.height = bbox.height;

      const context = canvas.getContext('2d');
      if (!context) {
        addToast('error', 'グラフの保存に失敗しました', 3000);
        return;
      }

      // 背景色を設定（透明にしたい場合は不要）
      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, canvas.width, canvas.height);

      const image = new Image();
      image.onload = () => {
        context.drawImage(image, 0, 0);

        // ダウンロード処理
        const link = document.createElement('a');
        link.download = `学習記録グラフ_${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        addToast('success', 'グラフを画像として保存しました', 3000);
      };
      image.onerror = () => {
        addToast('error', '画像の変換に失敗しました', 3000);
      };
      image.src = svgUrl;
    } catch (error) {
      console.error('グラフの保存中にエラーが発生しました:', error);
      addToast('error', 'グラフの保存中にエラーが発生しました', 3000);
    }
  };

  // グラフを表示するための共通コンポーネント
  const GraphChart = ({ height = 300, width = '95%' }) => (
    <ResponsiveContainer width={width} height={height}>
      <ComposedChart
        data={orderedActivities}
        margin={{
          top: 5,
          right: 5,
          left: 5,
          bottom: -5,
        }}
      >
        <XAxis dataKey="activityDate" />
        <YAxis
          label={{
            value: 'かかった時間（秒）',
            position: 'insideRight',
            style: {
              writingMode: 'vertical-rl',
              textAnchor: 'middle',
              fill: '#333',
            },
          }}
          dataKey={'duration'}
          orientation={'right'}
          yAxisId="bar"
        />
        <YAxis
          label={{
            value: '点数',
            position: 'insideLeft',
            style: {
              writingMode: 'vertical-rl',
              textAnchor: 'middle',
              fill: '#333',
            },
          }}
          dataKey={'score'}
          domain={['dataMin -10', 'dataMax']}
          orientation={'left'}
          yAxisId={'line'}
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
              const yPos = numValue >= maxScore - 10 ? numY + 20 : numY - 20;
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
  );

  return (
    <>
      <div className="card bg-base-100 w-full shadow-md border border-base-200">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h2 className="card-title text-xl flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>学習時間</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              これまでの記録
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="btn btn-sm btn-outline btn-primary"
                title="グラフを拡大表示"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <title>拡大表示</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                拡大
              </button>
              <button
                type="button"
                onClick={saveAsImage}
                className="btn btn-sm btn-outline btn-accent"
                title="グラフを画像として保存"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <title>画像として保存</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                保存
              </button>
            </div>
          </div>
          <div ref={chartRef}>
            <GraphChart />
          </div>
        </div>
      </div>

      {/* 拡大表示用モーダル */}
      <dialog className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box max-w-full w-11/12 max-h-screen h-4/5 flex flex-col">
          {' '}
          {/* Outer box defines overall size, now a flex column */}
          <h3 className="font-bold text-xl mb-4 flex-shrink-0">学習記録グラフ（拡大表示）</h3>
          {/* Graph Area */}
          {/* This div will grow to take up designated space, min-h-0 is important for flex children that might overflow */}
          <div className="flex-grow-[3] relative min-h-0" ref={chartRef}>
            {/* GraphChart's ResponsiveContainer will use 100% of this parent's dimensions */}
            <GraphChart width="100%" height={undefined} />{' '}
            {/* Corrected: height to undefined for default numeric value */}
          </div>
          {/* User Info and Stats Area */}
          {/* This div will take the remaining designated space, with scrolling if content overflows */}
          <div className="flex-grow-[1] p-4 border-t border-base-300 overflow-y-auto min-h-0">
            <h4 className="font-bold text-lg mb-3 text-primary">
              こんにちは、{userData?.name || 'がんばりや'}さん！
            </h4>
            <div className="space-y-2 text-base">
              <p>
                📝 <strong>がんばった回数:</strong> {userStats.totalActivities}回
              </p>
              <p>
                🌟 <strong>平均点:</strong> {userStats.averageScore.toFixed(1)}点
              </p>
              <p>
                ⏱️ <strong>合計時間:</strong> {(userStats.totalStudyTime / 60).toFixed(1)}分
              </p>
              <p>
                🏆 <strong>最高得点:</strong> {userStats.bestScore}点
              </p>
              <p>
                🎯 <strong>目標達成率:</strong> {userStats.completionRate}%{' '}
                <span className="text-xs">(60点以上で達成)</span>
              </p>
            </div>
          </div>
          {/* Modal Actions - pushed to the bottom */}
          <div className="modal-action mt-auto pt-4 flex-shrink-0">
            <button type="button" className="btn btn-outline btn-accent mr-2" onClick={saveAsImage}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>画像として保存</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              グラフを画像保存
            </button>
            <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>
              閉じる
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={() => setIsModalOpen(false)}>
            閉じる
          </button>
        </form>
      </dialog>
    </>
  );
};
