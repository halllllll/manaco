import type { FC } from 'react';
import type { UserDashboardProps } from '../types/props';
import { Graph } from './Graph';
import { LearningLogSection } from './LearningLogSection';
import { Trophy } from './trophy/Trophy';
/**
 * 登録済みユーザーのダッシュボードコンポーネント
 */
export const UserDashboard: FC<UserDashboardProps> = ({ userData }) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col lg:flex-row gap-4 mb-4 lg:max-h-[440px]">
        <Graph activities={userData.activities} />
        <Trophy activities={userData.activities} />
      </div>
      <LearningLogSection activities={userData.activities} />
    </div>
  );
};
