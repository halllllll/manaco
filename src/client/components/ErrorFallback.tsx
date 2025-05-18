import type { FallbackProps } from 'react-error-boundary';

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div role={'alert'} className="alert alert-error m-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <title>{''}</title>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div>
        <h4 className="font-bold">エラーが発生しました</h4>
        <p className="text-sm">{error.message || 'データの取得に失敗しました'}</p>
        <div className="flex justify-center">
          <button
            type={'button'}
            onClick={resetErrorBoundary}
            className="btn btn-sm btn-outline btn-error mt-2 "
          >
            再試行
          </button>
        </div>
      </div>
    </div>
  );
};
