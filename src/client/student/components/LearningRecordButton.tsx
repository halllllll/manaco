import type { FC } from 'react';
import type { LearningRecordButtonProps } from '../types/props';

/**
 * 学習記録ボタンコンポーネント
 */
export const LearningRecordButton: FC<LearningRecordButtonProps> = ({
  openModal,
  variant = 'fixed',
  label = '',
}) => {
  const getButtonClasses = () => {
    const baseClasses = 'btn btn-primary gap-2';

    switch (variant) {
      case 'fixed':
        return `${baseClasses} btn-xl fixed bottom-8 right-8 shadow-lg rounded-full text-xl animate-pulse`;
      case 'inline':
        return `${baseClasses} btn-xl animate-bounce`;
      default:
        return baseClasses;
    }
  };

  return (
    <button type="button" className={getButtonClasses()} onClick={openModal} aria-label={label}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <title>add</title>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
      </svg>
      {label}
    </button>
  );
};
