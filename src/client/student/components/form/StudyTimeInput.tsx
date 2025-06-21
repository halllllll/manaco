import type { FC } from 'react';

interface StudyTimeInputProps {
  // biome-ignore lint/suspicious/noExplicitAny: TanStack FormのFieldApi型は複雑すぎるためanyを使用（Claude Sonnet 4 Preview）
  minutesField: any;
  // biome-ignore lint/suspicious/noExplicitAny: TanStack FormのFieldApi型は複雑すぎるためanyを使用（Claude Sonnet 4 Preview）
  secondsField?: any;
  showSeconds: boolean;
}

export const StudyTimeInput: FC<StudyTimeInputProps> = ({
  minutesField,
  secondsField,
  showSeconds,
}) => {
  const minutesValue = typeof minutesField.state.value === 'number' ? minutesField.state.value : 0;
  const secondsValue = typeof secondsField?.state.value === 'number' ? secondsField.state.value : 0;
  return (
    <div className="form-control w-full mb-6">
      <label className="label" htmlFor="study_time">
        <span className="label-text text-lg font-medium flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>{'clock'}</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          どれくらい勉強した？
        </span>
      </label>

      <div className="rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 分の設定 */}
          <div className="flex flex-col items-center space-y-4 md:flex-1">
            <div className="text-center">
              <span className="text-lg font-medium text-base-content/70 uppercase tracking-wide">
                分
              </span>
              <div className="text-4xl font-bold text-secondary mt-1">{minutesValue}</div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                className="btn btn-lg btn-circle btn-outline hover:btn-secondary"
                onClick={() => {
                  minutesField.handleChange(Math.max(minutesValue - 10, 0));
                }}
                title="10分減らす"
              >
                <span className="i-lucide-chevrons-left text-xs" />
              </button>
              <button
                type="button"
                className="btn btn-lg btn-circle btn-outline hover:btn-secondary"
                onClick={() => {
                  minutesField.handleChange(Math.max(minutesValue - 1, 0));
                }}
                title="1分減らす"
              >
                <span className="i-lucide-chevron-left text-xs" />
              </button>
              <button
                type="button"
                className="btn btn-lg btn-circle btn-outline hover:btn-secondary"
                onClick={() => {
                  minutesField.handleChange(minutesValue + 1);
                }}
                title="1分増やす"
              >
                <span className="i-lucide-chevron-right text-xs" />
              </button>
              <button
                type="button"
                className="btn btn-lg btn-circle btn-outline hover:btn-secondary"
                onClick={() => {
                  minutesField.handleChange(minutesValue + 10);
                }}
                title="10分増やす"
              >
                <span className="i-lucide-chevrons-right text-xs" />
              </button>
            </div>

            {/* クイック設定ボタン */}
            <div className="flex gap-1 flex-wrap justify-center">
              {[15, 30, 60, 90].map((minuteValue) => (
                <button
                  key={minuteValue}
                  type="button"
                  className="btn btn-xs btn-ghost hover:btn-secondary"
                  onClick={() => {
                    minutesField.handleChange(minuteValue);
                  }}
                >
                  {minuteValue}分
                </button>
              ))}
            </div>
          </div>

          {/* 秒の設定 */}
          {showSeconds && secondsField && (
            <div className="flex flex-col items-center space-y-4 md:flex-1">
              <div className="text-center">
                <span className="text-lg font-medium text-base-content/70 uppercase tracking-wide">
                  秒
                </span>
                <div className="text-4xl font-bold text-secondary mt-1">{secondsValue}</div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="btn btn-lg btn-circle btn-outline hover:btn-secondary"
                  onClick={() => {
                    secondsField.handleChange(Math.max(secondsValue - 10, 0));
                  }}
                  title="10秒減らす"
                >
                  <span className="i-lucide-chevrons-left text-xs" />
                </button>
                <button
                  type="button"
                  className="btn btn-lg btn-circle btn-outline hover:btn-secondary"
                  onClick={() => {
                    secondsField.handleChange(Math.max(secondsValue - 1, 0));
                  }}
                  title="1秒減らす"
                >
                  <span className="i-lucide-chevron-left text-xs" />
                </button>
                <button
                  type="button"
                  className="btn btn-lg btn-circle btn-outline hover:btn-secondary"
                  onClick={() => {
                    secondsField.handleChange(secondsValue + 1);
                  }}
                  title="1秒増やす"
                >
                  <span className="i-lucide-chevron-right text-xs" />
                </button>
                <button
                  type="button"
                  className="btn btn-lg btn-circle btn-outline hover:btn-secondary"
                  onClick={() => {
                    secondsField.handleChange(secondsValue + 10);
                  }}
                  title="10秒増やす"
                >
                  <span className="i-lucide-chevrons-right text-xs" />
                </button>
              </div>

              {/* クイック設定ボタン */}
              <div className="flex gap-1 flex-wrap justify-center">
                {[15, 30, 45].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    className="btn btn-xs btn-ghost hover:btn-secondary"
                    onClick={() => {
                      secondsField.handleChange(sec);
                    }}
                  >
                    {sec}秒
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
