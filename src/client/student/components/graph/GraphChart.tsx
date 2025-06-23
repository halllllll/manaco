import type { FC } from 'react';
import React from 'react';
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
import type { ChartComponentProps } from './types';
import { getOptimalBarConfig } from './utils';

/**
 * 学習記録グラフチャートコンポーネント
 */
export const GraphChart: FC<ChartComponentProps> = React.memo(
  ({ data, maxScore, isShowScore, width = '100%', height = 300 }) => {
    const { barSize } = getOptimalBarConfig(data.length);

    return (
      <ResponsiveContainer width={width} height={height} className="">
        <ComposedChart
          data={data}
          margin={{
            top: 20,
            right: 50,
            left: 10,
            bottom: 20,
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

          <Bar
            yAxisId={'bar'}
            dataKey={'duration'}
            fill="#82ca9d"
            barSize={barSize}
            name="かかった時間（秒）"
          >
            <LabelList />
          </Bar>
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
            dataKey={isShowScore ? 'score' : ''}
            domain={['dataMin -10', 'dataMax']}
            orientation={'left'}
            yAxisId={'line'}
          />
          {isShowScore && (
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
          )}

          <Tooltip />
          <Legend
            verticalAlign="top"
            align="center"
            wrapperStyle={{ paddingRight: 0, paddingTop: 0, paddingBottom: 14 }}
            iconSize={16}
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  },
);
