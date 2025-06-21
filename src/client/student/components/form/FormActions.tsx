import type { FC } from 'react';

interface FormActionsProps {
  canSubmit: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const FormActions: FC<FormActionsProps> = ({ canSubmit, isSubmitting, onCancel }) => {
  return (
    <div className="modal-action flex justify-center gap-4">
      <button type="button" className="btn btn-outline" onClick={onCancel} disabled={isSubmitting}>
        キャンセル
      </button>
      <button type="submit" className="btn btn-primary btn-lg gap-2" disabled={!canSubmit}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <title>{'check'}</title>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        {isSubmitting ? '送信中...' : '記録する'}
      </button>
    </div>
  );
};
