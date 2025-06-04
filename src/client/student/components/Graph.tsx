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
  ({ data, maxScore, height = 300, width = '100%' }) => {
    // データ数に応じた動的なbarSizeとmarginの計算
    const getOptimalBarConfig = (dataLength: number) => {
      if (dataLength <= 5) {
        return { barSize: 40, bottomMargin: 20 };
      }
      if (dataLength <= 10) {
        return { barSize: 25, bottomMargin: 30 };
      }
      if (dataLength <= 20) {
        return { barSize: 20, bottomMargin: 40 };
      }
      if (dataLength <= 30) {
        return { barSize: 15, bottomMargin: 50 };
      }
      return { barSize: 12, bottomMargin: 60 };
    };
    const { barSize, bottomMargin } = getOptimalBarConfig(data.length);

    return (
      <ResponsiveContainer width={width} height={height} className="">
        <ComposedChart
          data={data}
          margin={{
            top: 20, // Increased top margin
            right: 50, // Increased right margin for YAxis label
            left: 10, // Increased left margin for YAxis label
            bottom: 20, // Changed to positive and increased bottom margin
          }}
        >
          <XAxis
            dataKey="activityDate"
            tickFormatter={(date) => {
              const dateObj = new Date(date);
              if (Number.isNaN(dateObj.getTime())) {
                return date;
              }
              return `${dateObj.getMonth() + 1}月${dateObj.getDate()}日`;
            }}
            angle={-30}
            dy={5}
          />
          <YAxis
            label={{
              value: 'かかった時間',
              position: 'right',
              offset: 30,
              style: {
                writingMode: 'vertical-rl',
                textAnchor: 'middle',
                fill: '#333',
              },
            }}
            dataKey={'duration'}
            orientation={'right'}
            yAxisId="bar"
            tickFormatter={(value) => {
              if (Number.isNaN(value)) {
                return value;
              }
              const numValue = Number.parseInt(value);
              const minutes = Math.floor(numValue / 60);
              const seconds = numValue % 60;
              return `${minutes ? `${minutes}分` : ''}${seconds ? `${seconds}秒` : ''}`;
            }}
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
            barSize={barSize}
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
          <Legend
            verticalAlign="top"
            align="center"
            wrapperStyle={{ paddingRight: 0, paddingTop: 0, paddingBottom: 14 }}
            iconSize={16}
            // iconType="circle"
          />
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
  }, [activities]); // Simplified dependency array

  const maxScore = useMemo(() => {
    if (activities.length === 0) {
      return 0;
    }
    return Math.max(...activities.map((a) => a.score));
  }, [activities]); // Simplified dependency array

  const [isModalOpen, setIsModalOpen] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null); // For the main card graph
  const modalContentRef = useRef<HTMLDivElement>(null); // For capturing modal content
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
    } catch (e) {
      const err = e as Error;
      addToast('error', `画像の保存中にエラーが発生しました\n${err.name} - ${err.message}`, 3000);
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
          className="modal-box max-w-full w-11/12 max-h-screen h-22/23 flex flex-col overflow-y-auto"
          ref={modalContentRef}
        >
          <h4 className="font-bold text-lg mb-3 text-primary-content flex-shrink-0">
            {`${
              // biome-ignore lint/style/noNonNullAssertion: <explanation>
              userData!.name
            } さんの学習記録`}
          </h4>

          {/* Graph Area - Fixed minimum height to ensure visibility */}
          <div className="h-[70dvh] max-h-3/5 mb-4">
            <MemoizedGraphChart
              data={orderedActivities}
              maxScore={maxScore}
              width="100%"
              height="100%"
            />
          </div>
          {/* User Info and Stats Area */}
          <div className="p-4 border-t border-base-300 overflow-y-auto">
            {/* Stats cards with child-friendly design */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Basic Stats - Activity Count and Best Score */}
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-4 shadow-sm border border-blue-200">
                <h5 className="text-lg font-bold mb-3 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <title>がんばったこと</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                  がんばったこと
                </h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700">がんばった回数</span>
                    <span className="text-xl font-bold text-blue-800">
                      {userStats.totalActivities}回
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700">さいこうてんすう</span>
                    <span className="text-xl font-bold text-blue-800">{userStats.bestScore}点</span>
                  </div>
                </div>
              </div>

              {/* Time and Average Stats */}
              <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl p-4 shadow-sm border border-purple-200">
                <h5 className="text-lg font-bold mb-3 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <title>べんきょうのきろく</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  べんきょうのきろく
                </h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-700">がくしゅうじかん</span>
                    <span className="text-xl font-bold text-purple-800">
                      {`
                      ${(userStats.totalStudyTime / 60).toFixed(0)} 分
                      `}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-700">へいきんてんすう</span>
                    <div className="flex items-center">
                      <span className="text-xl font-bold text-purple-800">
                        {`${userStats.averageScore.toFixed(1)} 点`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Period - Full width */}
            {orderedActivities.length > 0 && (
              <div className="mt-4 bg-gradient-to-br from-green-100 to-green-50 rounded-xl p-4 shadow-sm border border-green-200">
                <h5 className="text-lg font-bold mb-3 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <title>学習期間</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  がくしゅうきかん
                </h5>
                <div className="flex items-center justify-center gap-4">
                  <div className="bg-white rounded-lg p-3 text-center border border-green-200 flex-1">
                    <div className="text-sm text-green-700 mb-1">はじめたひ</div>
                    <div className="font-bold text-green-800">
                      {orderedActivities[0].activityDate}
                    </div>
                  </div>
                  <div className="text-green-600 font-bold text-xl">→</div>
                  <div className="bg-white rounded-lg p-3 text-center border border-green-200 flex-1">
                    <div className="text-sm text-green-700 mb-1">さいきんのひ</div>
                    <div className="font-bold text-green-800">
                      {orderedActivities[orderedActivities.length - 1].activityDate}
                    </div>
                  </div>
                </div>
              </div>
            )}
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
