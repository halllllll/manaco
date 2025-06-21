import { useActivityPost } from '@/client/api/activity/hook';
import { useSettings } from '@/client/api/settings/hook';
import { useToast } from '@/client/context/ToastConterxt';
import type { LearningActivity } from '@/shared/types/activity';
import { useForm } from '@tanstack/react-form';
import type { FC, FormEvent } from 'react';
import { useCallback } from 'react';
import type { ModalProps } from '../types/props';

import { FormModalSkeleton } from './FormModalSkeleton';
import {
  DateInput,
  FormActions,
  type FormSettings,
  MemoInput,
  MoodInput,
  ScoreInput,
  StudyTimeWrapper,
  calculateDuration,
  getDefaultDuration,
  getDefaultFormValues,
  useFormFields,
} from './form';

import { useDashboard } from '@/client/api/dashboard/hooks';
import { useGetUser } from '@/client/api/user/hook';
import type { Mood } from '@/shared/types/mood';

export const FormModal: FC<ModalProps> = ({ isModalOpen, setIsModalOpen }) => {
  // settings
  const { data: settingsData, error: settingsError, isLoading: settingsIsLoading } = useSettings();
  if (settingsError) {
    throw new Error(`Failed to fetch settings: ${settingsError.name} - ${settingsError.message}`);
  }

  // 将来の拡張性のためのハードコード設定値（本番では settingsData に含まれる予定）
  const showStudyTime = true; // TODO: 将来的に settingsData.showStudyTime に置き換え

  // フォーム設定オブジェクトを作成
  const formSettings: FormSettings = {
    showStudyTime,
    showSecond: settingsData?.showSecond ?? false,
    showScore: settingsData?.showScore ?? false,
    showMood: settingsData?.showMood ?? false,
    showMemo: settingsData?.showMemo ?? false,
    scoreMin: settingsData?.scoreMin,
    scoreMax: settingsData?.scoreMax,
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

  // カスタムフックでフィールドを取得（入れ子構造を解消）
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

              {/* コメント */}
              {formSettings.showMemo && (
                <fields.MemoField name="memo">
                  {/* biome-ignore lint/suspicious/noExplicitAny: TanStack FormのFieldApi型は複雑すぎるためanyを使用（Claude Sonnet 4 (Preview)） */}
                  {(field: any) => <MemoInput field={field} />}
                </fields.MemoField>
              )}
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
