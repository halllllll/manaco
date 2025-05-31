import type { FC } from 'react';
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
import type { GraphProps } from '../types/props';

/**
 * 学習記録グラフコンポーネント
 */
export const Graph: FC<GraphProps> = ({ activities }) => {
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
            <YAxis
              label={{
                value: 'かかった時間（秒）',
                position: 'insideRight',
                style: {
                  writingMode: 'vertical-rl',
                  textAnchor: 'middle',
                  // fontSize: 16,
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
                  // fontSize: 16,
                  fill: '#333',
                },
              }}
              dataKey={'score'}
              domain={['dataMin -10', 'datamax']}
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
                  const yPos = numValue > 90 ? numY - 20 : numY + 20;
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
