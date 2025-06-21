import type { FC } from 'react';
import { StudyTimeInput } from './StudyTimeInput';
import type { FormSettings } from './types/FormTypes';

interface StudyTimeWrapperProps {
  // biome-ignore lint/suspicious/noExplicitAny: TanStack FormのFieldApi型は複雑すぎるためanyを使用（Claude Sonnet 4 Preview）
  minutesField: any;
  // biome-ignore lint/suspicious/noExplicitAny: TanStack FormのFieldApi型は複雑すぎるためanyを使用（Claude Sonnet 4 Preview）
  secondsField?: any;
  settings: FormSettings;
}

export const StudyTimeWrapper: FC<StudyTimeWrapperProps> = ({
  minutesField,
  secondsField,
  settings,
}) => {
  // 学習時間の記録が無効な場合は何も表示しない
  if (!settings.showStudyTime) {
    return null;
  }

  return (
    <StudyTimeInput
      minutesField={minutesField}
      secondsField={secondsField}
      showSeconds={settings.showSecond}
    />
  );
};
