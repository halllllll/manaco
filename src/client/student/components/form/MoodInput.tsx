import { MOOD_OPTIONS, type MoodOption } from '@/shared/constants/mood';
import type { FC } from 'react';

interface MoodInputProps {
  // biome-ignore lint/suspicious/noExplicitAny: TanStack FormのFieldApi型は複雑すぎるためanyを使用（Claude Sonnet 4 (Preview)）（Claude Sonnet 4 Preview）
  field: any;
}

export const MoodInput: FC<MoodInputProps> = ({ field }) => {
  const moodValue = typeof field.state.value === 'string' ? field.state.value : '';
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
            <title>{'mood'}</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          勉強してどうだった？
        </span>
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {MOOD_OPTIONS.map((option: MoodOption) => (
          // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
          <div
            key={option.value}
            onClick={() =>
              moodValue === option.value ? field.handleChange('') : field.handleChange(option.value)
            }
            className={`relative card ${option.color} ${
              moodValue === option.value ? 'ring-4 ring-primary ring-offset-2 scale-105' : ''
            } shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-102 active:scale-95`}
          >
            <div className="flex card-body items-center text-center p-2">
              <div className="text-4xl mb-2">{option.emoji}</div>
              <div className="text-xl font-bold">{option.label}</div>

              {moodValue === option.value && (
                <div className="absolute -top-2 -right-2 bg-primary text-primary-content rounded-full p-1 shadow-md ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <title>{'check'}</title>
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

              <input
                type="radio"
                name={field.name}
                value={option.value}
                checked={moodValue === option.value}
                onChange={() => field.handleChange(option.value)}
                className="hidden"
                id={`mood_${option.value}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
