import type { FC } from 'react';
import React from 'react';
import { type Activity, ActivityCalendar } from 'react-activity-calendar';
import type { ChartComponentProps } from './types';
import { addDate } from './utils';

/**
 * 学習記録ヒートマップチャートコンポーネント
 */
export const HeatmapChart: FC<ChartComponentProps> = React.memo(
  ({ data, height = 300 }) => {
    // 見た目のために、データがないところも埋める
    const lastDate = addDate(100, data.at(-1)?.activityDate ?? new Date());

    const dateMap = new Map<string, Activity>();
    for (const d of data) {
      if (dateMap.has(d.activityDate)) {
        const updateData = dateMap.get(d.activityDate) as Activity;
        updateData.count += 1;
        dateMap.set(d.activityDate, updateData);
      } else {
        const newData: Activity = {
          date: d.activityDate,
          count: 1,
          level: 1,
        };
        dateMap.set(d.activityDate, newData);
      }
    }

    return (
      <div style={{ height }} className="overflow-auto">
        <div className="max-w-xl">
          <ActivityCalendar
            data={[...dateMap.values(), { date: lastDate, count: 1, level: 0 }]}
            blockSize={30}
            showWeekdayLabels={['sun', 'mon', 'thu', 'wed', 'tue', 'fri', 'sat']}
            hideMonthLabels={false}
            theme={{
              light: ['#fefefe', '#7ac7c4', '#384259'],
              dark: ['hsl(0, 0.00%, 85.10%)', '#7DB9B6', '#E96479'],
            }}
            maxLevel={2}
            weekStart={1}
            labels={{
              weekdays: ['日', '月', '火', '水', '木', '金', '土'],
              months: [
                '1月',
                '2月',
                '3月',
                '4月',
                '5月',
                '6月',
                '7月',
                '8月',
                '9月',
                '10月',
                '11月',
                '12月',
              ],
              totalCount: '',
            }}
            hideColorLegend={true}
            hideTotalCount={true}
          />
        </div>
      </div>
    );
  },
);
