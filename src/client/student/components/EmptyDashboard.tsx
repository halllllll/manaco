import type { FC } from 'react';
import type { EmptyDashboardProps } from '../types/props';
import { LearningRecordButton } from './LearningRecordButton';

/**
 * 空のダッシュボード（初回利用時）コンポーネント
 */
export const EmptyDashboard: FC<EmptyDashboardProps> = ({ openModal }) => {
  return (
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
              <title>{'guide'}</title>
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

        <BenefitsSection />

        <div className="card-actions">
          <LearningRecordButton
            openModal={openModal}
            variant="inline"
            label="はじめての記録をつける"
          />
        </div>
      </div>
    </div>
  );
};

/**
 * 学習記録のメリット説明セクション
 */
const BenefitsSection: FC = () => {
  const benefits = [
    {
      icon: '📊',
      title: '自分の成長が見える',
      description: 'これまでの勉強の記録がグラフで見られるよ',
    },
    {
      icon: '🏆',
      title: '自己ベストを知れる',
      description: 'あなたの最高点や最長時間が記録されるよ',
    },
    {
      icon: '👨‍👩‍👧‍👦',
      title: '記録を振り返る',
      description: '勉強の習慣がついて、もっと上手になれるよ',
    },
  ];

  return (
    <div className="bg-success/10 rounded-lg p-4 mb-4 w-full">
      <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-success"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <title>{'benefits'}</title>
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
        {benefits.map((benefit, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <div key={index} className="card bg-base-100 shadow-sm">
            <div className="card-body p-3">
              <div className="text-center mb-2">
                <span className="text-2xl">{benefit.icon}</span>
              </div>
              <h4 className="font-bold text-center mb-1">{benefit.title}</h4>
              <p className="text-sm">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
