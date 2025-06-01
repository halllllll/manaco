import { useToast } from '@/client/context/ToastConterxt';
import type { LearningActivity } from '@/shared/types/activity'; // Added
import * as htmlToImage from 'html-to-image';
import type { FC } from 'react';
import React, { useMemo, useRef, useState } from 'react'; // Added React, useMemo
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
import { useUserState } from '../hooks/useUserState';
import { useUserStats } from '../hooks/useUserStats';
import type { GraphProps } from '../types/props';

// Define GraphChartProps interface
interface GraphChartProps {
  data: LearningActivity[];
  maxScore: number;
  height?: number | string;
  width?: number | string;
}

// Define MemoizedGraphChart outside the Graph component and wrap with React.memo
const MemoizedGraphChart: FC<GraphChartProps> = React.memo(
  ({ data, maxScore, height = 300, width = '95%' }) => {
    return (
      <ResponsiveContainer width={width} height={height}>
        <ComposedChart
          data={data}
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
  },
);
MemoizedGraphChart.displayName = 'MemoizedGraphChart';

/**
 * 学習記録グラフコンポーネント
 */
export const Graph: FC<GraphProps> = ({ activities }) => {
  const orderedActivities = useMemo(() => {
    return activities.toSorted((a, b) => a.activityDate.localeCompare(b.activityDate));
  }, [activities]);

  const maxScore = useMemo(() => {
    if (activities.length === 0) {
      return 0;
    }
    return Math.max(...activities.map((a) => a.score));
  }, [activities]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();
  const { userData } = useUserState();
  const userStats = useUserStats(activities);

  // グラフを画像として保存する関数
  const saveAsImage = async () => {
    if (!modalContentRef.current) {
      addToast('error', 'モーダルコンテンツが見つかりません', 3000);
      return;
    }

    try {
      // ボタンを除外するためのフィルター関数
      const filter = (node: HTMLElement) => {
        // モーダルアクションボタンを除外
        if (node.classList?.contains('modal-action')) {
          return false;
        }
        // フォームの閉じるボタンを除外
        if (node.tagName === 'BUTTON' && node.parentElement?.classList.contains('modal-backdrop')) {
          return false;
        }
        return true;
      };

      const dataUrl = await htmlToImage.toPng(modalContentRef.current, {
        quality: 0.95,
        backgroundColor: '#FFFFFF',
        filter: filter, // フィルターを適用
      });
      const link = document.createElement('a');
      link.download = `学習記録_${userData?.name || 'ユーザー'}_${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
      addToast('success', 'グラフと情報を画像として保存しました', 3000);
    } catch (error) {
      console.error('画像のエクスポート中にエラーが発生しました:', error);
      addToast('error', '画像の保存中にエラーが発生しました', 3000);
    }
  };

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
            <MemoizedGraphChart data={orderedActivities} maxScore={maxScore} />
          </div>
        </div>
      </div>

      {/* 拡大表示用モーダル */}
      <dialog className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        {/* This is the element that will be captured for the image */}
        <div
          className="modal-box max-w-full w-11/12 max-h-screen h-4/5 flex flex-col"
          ref={modalContentRef}
        >
          <h3 className="font-bold text-xl mb-4 flex-shrink-0">学習記録グラフ（拡大表示）</h3>

          {/* Graph Area */}
          <div className="flex-grow-[3] relative min-h-0" ref={chartRef}>
            <MemoizedGraphChart
              data={orderedActivities}
              maxScore={maxScore}
              width="100%"
              height="100%"
            />
          </div>
          {/* User Info and Stats Area */}
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
