import type { ActivityItem } from '@/shared/types/activity';
import type { FC } from 'react';

interface ActivityTypeInputProps {
  field: {
    state: {
      value: string[];
    };
    handleChange: (value: string[]) => void;
  };
  activityItems: ActivityItem[];
}

export const ActivityTypeInput: FC<ActivityTypeInputProps> = ({ field, activityItems }) => {
  const selectedActivities = field.state.value || [];

  const toggleActivity = (name: string) => {
    const newSelectedActivities = selectedActivities.includes(name)
      ? selectedActivities.filter((item) => item !== name)
      : [...selectedActivities, name];

    field.handleChange(newSelectedActivities);
  };

  // 背景色と境界線の色のコントラストを計算する関数
  const getContrastBorder = (color: string) => {
    // カラーを明るい色か暗い色か判定するシンプルな方法
    // 色が十分に明るければ暗い枠線、そうでなければ明るい枠線
    const isLight =
      color.startsWith('#') && color.length >= 7
        ? // 16進数の色から明るさを計算
          Number.parseInt(color.slice(1, 3), 16) * 0.299 +
            Number.parseInt(color.slice(3, 5), 16) * 0.587 +
            Number.parseInt(color.slice(5, 7), 16) * 0.114 >
          150
        : true; // デフォルトは明るい色と仮定

    // コントラストを強調するための影を追加
    return isLight
      ? '0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(0, 0, 0, 0.1)'
      : '0 0 0 1px rgba(255, 255, 255, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.1)';
  };

  return (
    <div className="form-control w-full mb-6">
      <div className="label">
        <span className="label-text text-lg font-medium flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 "
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
            role="img"
          >
            <title>活動アイコン</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          今日のとりくみ
        </span>
      </div>
      <div className="flex flex-wrap gap-2 mt-1">
        {activityItems.map((item) => {
          const isSelected = selectedActivities.includes(item.name);
          return (
            <button
              key={item.name}
              type="button"
              className={`btn btn-md border-2 transition-all relative min-w-[80px] ${
                isSelected
                  ? 'bg-base-200 text-base-content font-medium'
                  : 'bg-base-100 text-base-content/80'
              }`}
              style={{
                borderColor: item.color,
                boxShadow: getContrastBorder(item.color),
              }}
              onClick={() => toggleActivity(item.name)}
            >
              <div className="flex items-center justify-center w-full">
                <span>{item.name}</span>
                <span
                  className={`absolute right-2 transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-0'}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                    role="img"
                  >
                    <title>選択済み</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
