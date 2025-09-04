import type { Memo } from '@/shared/types/memo';
import type { FC } from 'react';

interface MemoInputProps {
  // biome-ignore lint/suspicious/noExplicitAny: TanStack FormのFieldApi型は複雑すぎるためanyを使用（Claude Sonnet 4 (Preview)）
  field: any;
  memoConfig: Memo;
  index: number;
}

export const MemoInput: FC<MemoInputProps> = ({ field, memoConfig }) => {
  const memoValue = field.state.value?.value ?? '';
  return (
    <div className="form-control w-full mb-6">
      <label className="label" htmlFor={field.name}>
        <span className="label-text text-lg font-medium flex items-center gap-2">
          <title>{'comment'}</title>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            {
              '<!-- Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE -->'
            }
            <g
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            >
              <path d="M8 2v4m4-4v4m4-4v4" />
              <rect width="16" height="18" x="4" y="4" rx="2" />
              <path d="M8 10h6m-6 4h8m-8 4h5" />
            </g>{' '}
            <title>{'comment'}</title>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
          </svg>
          {memoConfig.label}
        </span>
      </label>
      <div>
        <textarea
          className="textarea textarea-bordered h-24 w-full"
          placeholder={memoConfig.placeholder}
          name={field.name}
          id={field.name}
          value={memoValue}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            field.handleChange({ label: memoConfig.label, value: e.target.value });
          }}
        />
      </div>
    </div>
  );
};
