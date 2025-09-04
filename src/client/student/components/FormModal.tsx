import { useActivityPost } from '@/api/activity/hook';
import { useSettings } from '@/api/settings/hook';
import { useToast } from '@/client/context/ToastConterxt';
import type { LearningActivity } from '@/shared/types/activity';
import { useForm } from '@tanstack/react-form';
import type { FC, FormEvent } from 'react';
import { useCallback } from 'react';
import type { ModalProps } from '../types/props';

import { FormModalSkeleton } from './FormModalSkeleton';
import {
  ActivityTypeInput,
  DateInput,
  FormActions,
  MemoInput,
  MoodInput,
  ScoreInput,
  StudyTimeWrapper,
  calculateDuration,
  getDefaultDuration,
  getDefaultFormValues,
  useFormFields,
} from './form';

import { useDashboard } from '@/api/dashboard/hooks';
import { useGetUser } from '@/api/user/hook';
import type { Mood } from '@/shared/types/mood';
import type { FormSettings } from './form/types/FormTypes';

export const FormModal: FC<ModalProps> = ({ isModalOpen, setIsModalOpen }) => {
  // settings
  const { data: settingsData, error: settingsError, isLoading: settingsIsLoading } = useSettings();
  if (settingsError) {
    throw new Error(`Failed to fetch settings: ${settingsError.name} - ${settingsError.message}`);
  }

  // フォーム設定オブジェクトを作成
  const formSettings: FormSettings = {
    showStudyTime: settingsData?.showStudyTime ?? true, // AppSettingsから直接取得
    showSecond: settingsData?.showSecond ?? false,
    showScore: settingsData?.showScore ?? false,
    showMood: settingsData?.showMood ?? false,
    showMemo: settingsData?.showMemo ?? false,
    scoreMin: settingsData?.scoreMin,
    scoreMax: settingsData?.scoreMax,
    // 分岐が面倒なのでshowXXX のTFにかかわらず取得
    activityType:
      settingsData?.showActivity && settingsData?.activityItems
        ? settingsData.activityItems
        : undefined,
    memoFields:
      settingsData?.showMemo && settingsData?.memoFields ? settingsData.memoFields : undefined,
  };

  // dashboard (for update activity data)
  const { updateActivities } = useDashboard();

  // post api
  const { postActivity, isPosting } = useActivityPost();

  // user
  const { data: userData } = useGetUser();

  // toast
  const { addToast } = useToast();
  const form = useForm({
    defaultValues: getDefaultFormValues(),
    onSubmit: async (values) => {
      try {
        if (!userData) {
          throw new Error('User data is not available');
        }
        const data: LearningActivity & { userId: string } = {
          activityDate: values.value['target-date-btn'],
          duration: formSettings.showStudyTime
            ? calculateDuration(values.value.study_time)
            : getDefaultDuration(),
          memo: values.value.memo,
          mood: values.value.mood as Mood,
          score: values.value.score,
          activityType: values.value.activityType,
          userId: userData.id,
        };
        const res = await postActivity(data);
        if (!res.success) {
          addToast('error', `学習記録の保存に失敗しました: ${res.message}`, 10000);
        } else {
          updateActivities({
            activityDate: values.value['target-date-btn'],
            duration: formSettings.showStudyTime
              ? calculateDuration(values.value.study_time)
              : getDefaultDuration(),
            memo: values.value.memo,
            mood: values.value.mood as Mood,
            score: values.value.score,
            activityType: values.value.activityType,
          });
          addToast('success', '保存しました！学習をふりかえろう！');
          setIsModalOpen(false);
          form.reset();
        }
      } catch (e) {
        const err = e as Error;
        addToast('error', `学習記録の保存に失敗しました: ${err.name} - ${err.message}`);
      }
    },
  });

  // カスタムフックでフィールドを取得
  const fields = useFormFields(form);

  // モーダルを閉じる
  const handleClose = useCallback(() => {
    setIsModalOpen(false);
    form.reset();
  }, [setIsModalOpen, form]);

  return (
    <div>
      <dialog id="post_modal" className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box bg-base-100 max-w-2xl">
          <h3 className="font-bold text-2xl mb-6 text-center text-primary">
            今日の学習を記録しよう！
          </h3>
          {settingsIsLoading ? (
            <FormModalSkeleton />
          ) : !settingsData ? (
            <>
              <div className="text-center text-red-500 font-bold mb-4">
                設定の取得に失敗しました。
                <br />
              </div>
            </>
          ) : (
            <form
              className="relative"
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                // e.stopPropagation();
                form.handleSubmit();
              }}
            >
              {isPosting && (
                <div className="absolute inset-0 backdrop-blur-[4px] z-50 flex items-center justify-center">
                  <div className="bg-base-100 shadow-xl rounded-xl p-6 flex flex-col items-center gap-3">
                    <div className="loading loading-spinner loading-xl text-primary" />
                    <p className="text-4xl font-medium text-base-content">送信中...</p>
                  </div>
                </div>
              )}
              {/* 日付選択 */}
              <fields.DateField name="target-date-btn">
                {/* biome-ignore lint/suspicious/noExplicitAny: TanStack FormのFieldApi型は複雑すぎるためanyを使用（Claude Sonnet 4 (Preview)） */}
                {(field: any) => <DateInput field={field} />}
              </fields.DateField>

              {/* 学習時間 */}
              <StudyTimeWrapper
                MinutesFieldComponent={fields.MinutesField}
                SecondsFieldComponent={fields.SecondsField}
                settings={formSettings}
              />

              {/* 点数 */}
              {formSettings.showScore && (
                <fields.ScoreField name="score">
                  {/* biome-ignore lint/suspicious/noExplicitAny: TanStack FormのFieldApi型は複雑すぎるためanyを使用（Claude Sonnet 4 (Preview)） */}
                  {(field: any) => (
                    <ScoreInput
                      field={field}
                      scoreMin={formSettings.scoreMin ?? 0}
                      scoreMax={formSettings.scoreMax ?? 100}
                    />
                  )}
                </fields.ScoreField>
              )}

              {/* 気分 (オプション) */}
              {formSettings.showMood && (
                <fields.MoodField name="mood">
                  {/* biome-ignore lint/suspicious/noExplicitAny: TanStack FormのFieldApi型は複雑すぎるためanyを使用（Claude Sonnet 4 (Preview)） */}
                  {(field: any) => <MoodInput field={field} />}
                </fields.MoodField>
              )}

              {/* アクティビティタイプ */}
              {formSettings.activityType && formSettings.activityType.length > 0 && (
                <fields.ActivityTypeField name="activityType">
                  {/* biome-ignore lint/suspicious/noExplicitAny: TanStack FormのFieldApi型は複雑すぎるためanyを使用（Claude Sonnet 4 (Preview)） */}
                  {(field: any) => (
                    <ActivityTypeInput
                      field={field}
                      activityItems={formSettings.activityType || []}
                    />
                  )}
                </fields.ActivityTypeField>
              )}

              {/* memo */}
              {formSettings.showMemo &&
                formSettings.memoFields &&
                formSettings.memoFields
                  .filter((memo) => memo.label.trim() !== '')
                  .map((memoField, idx) => {
                    return (
                      <fields.MemoField
                        name={`memo.${idx}`}
                        key={`memo-${
                          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                          idx
                        }`}
                      >
                        {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                        {(field: any) => (
                          <MemoInput field={field} memoConfig={memoField} index={idx} />
                        )}
                      </fields.MemoField>
                    );
                  })}

              {/* 送信ボタン */}
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                // biome-ignore lint/correctness/noChildrenProp: <explanation>
                children={([canSubmit, isSubmitting]) => (
                  <FormActions
                    canSubmit={canSubmit}
                    isSubmitting={isSubmitting}
                    onCancel={handleClose}
                  />
                )}
              />
            </form>
          )}
        </div>
        {/* モーダルの背景をクリックしても閉じられるようにする */}
        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={handleClose}>
            閉じる
          </button>
        </form>
      </dialog>
    </div>
  );
};
