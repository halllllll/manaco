import type { FC } from 'react';

interface ScoreInputProps {
  // biome-ignore lint/suspicious/noExplicitAny: TanStack FormのFieldApi型は複雑すぎるためanyを使用（Claude Sonnet 4 (Preview)）（Claude Sonnet 4 Preview）
  field: any;
  scoreMin: number;
  scoreMax: number;
}

export const ScoreInput: FC<ScoreInputProps> = ({ field, scoreMin, scoreMax }) => {
  const scoreValue = typeof field.state.value === 'number' ? field.state.value : 0;
  return (
    <div className="form-control w-full mb-6">
      <label className="label" htmlFor={field.name}>
        <span className="label-text text-lg font-medium flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>{'score'}</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          今日の点数は？
        </span>
      </label>
      <div className="flex flex-col gap-2">
        <div className="text-center inline-block">
          <input
            type="number"
            className={`${
              field.state.meta.isDefaultValue || !scoreValue
                ? 'placeholder:text-base text-md'
                : 'text-5xl'
            } text-primary focus:rounded-lg focus:border-b-base-100 border-base-300  w-48 border-b-primary border-b-2 text-center outline-none h-18 align-bottom font-bold`}
            value={scoreValue || ''}
            placeholder="タップして入力"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const newScoreValue = Math.min(
                Math.max(Number.parseInt(e.target.value), scoreMin),
                scoreMax,
              );
              field.handleChange(newScoreValue);
            }}
            required
          />
          <span className="text-lg"> 点</span>
        </div>
      </div>
    </div>
  );
};
