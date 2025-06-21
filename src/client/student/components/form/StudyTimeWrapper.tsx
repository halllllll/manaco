import type { FC } from 'react';
import { StudyTimeInput } from './StudyTimeInput';
import type { FormSettings } from './types/FormTypes';

interface StudyTimeWrapperProps {
  // biome-ignore lint/suspicious/noExplicitAny: TanStack FormのField型は複雑すぎるためanyを使用（Claude Sonnet 4(Preview)）
  MinutesFieldComponent: any;
  // biome-ignore lint/suspicious/noExplicitAny: TanStack FormのField型は複雑すぎるためanyを使用（Claude Sonnet 4(Preview)）
  SecondsFieldComponent?: any;
  settings: FormSettings;
}

export const StudyTimeWrapper: FC<StudyTimeWrapperProps> = ({
  MinutesFieldComponent,
  SecondsFieldComponent,
  settings,
}) => {
  // 学習時間の記録が無効な場合は何も表示しない
  if (!settings.showStudyTime) {
    return null;
  }

  return (
    <>
      <MinutesFieldComponent name="study_time.minutes">
        {/* biome-ignore lint/suspicious/noExplicitAny: TanStack FormのFieldApi型は複雑すぎるためanyを使用（Claude Sonnet 4 (Preview)） */}
        {(minutesField: any) => (
          <>
            {settings.showSecond && SecondsFieldComponent ? (
              <SecondsFieldComponent name="study_time.seconds">
                {/* biome-ignore lint/suspicious/noExplicitAny: TanStack FormのFieldApi型は複雑すぎるためanyを使用（Claude Sonnet 4 (Preview)） */}
                {(secondsField: any) => (
                  <StudyTimeInput
                    minutesField={minutesField}
                    secondsField={secondsField}
                    showSeconds={settings.showSecond}
                  />
                )}
              </SecondsFieldComponent>
            ) : (
              <StudyTimeInput
                minutesField={minutesField}
                secondsField={undefined}
                showSeconds={false}
              />
            )}
          </>
        )}
      </MinutesFieldComponent>
    </>
  );
};
