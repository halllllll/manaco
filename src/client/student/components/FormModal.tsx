import { useActivityPost } from '@/client/api/activity/hook';
import { useSettings } from '@/client/api/settings/hook';
import { useToast } from '@/client/context/ToastConterxt';
import { MOOD_OPTIONS, type MoodOption } from '@/shared/constants/mood';
import type { LearningActivity } from '@/shared/types/activity';
import { useForm } from '@tanstack/react-form';
import type { CSSProperties, FC, FormEvent } from 'react';
import { useCallback, useMemo } from 'react';
import type { ModalProps } from '../types/props';

import { FormModalSkeleton } from './FormModalSkeleton';

import { useDashboard } from '@/client/api/dashboard/hooks';
import { useGetUser } from '@/client/api/user/hook';
import type { Mood } from '@/shared/types/mood';

export const FormModal: FC<ModalProps> = ({ isModalOpen, setIsModalOpen }) => {
  // settings
  const { data: settingsData, error: settingsError, isLoading: settingsIsLoading } = useSettings();
  if (settingsError) {
    throw new Error(`Failed to fetch settings: ${settingsError.name} - ${settingsError.message}`);
  }
  // dashboard (for update activity data)
  const { data: dashboardData, updateActivities } = useDashboard();

  // post api
  const { postActivity, error: postActivityError, isPosting } = useActivityPost();

  // user
  const { data: userData } = useGetUser();

  // toast
  const { addToast } = useToast();

  // tanstack form
  const form = useForm({
    defaultValues: {
      'target-date-btn': new Date().toISOString().split('T')[0], // ケバブケースなのは特に意味はない 最初idをstringで直打ちしてた名残
      study_time: {
        hour: 0,
        minutes: 0,
        seconds: 0,
      },
      score: 0,
      mood: '',
      memo: '',
    },
    onSubmit: async (values) => {
      try {
        if (!userData) {
          throw new Error('User data is not available');
        }
        const data: LearningActivity & { userId: string } = {
          // ...values.value,
          activityDate: values.value['target-date-btn'],
          duration:
            values.value.study_time.hour * 3600 +
            values.value.study_time.minutes * 60 +
            values.value.study_time.seconds,
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
            duration:
              values.value.study_time.hour * 3600 +
              values.value.study_time.minutes * 60 +
              values.value.study_time.seconds,
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

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

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
              <div className="form-control w-full mb-4">
                <form.Field
                  name="target-date-btn"
                  // biome-ignore lint/correctness/noChildrenProp: <explanation>
                  children={(field) => {
                    return (
                      <div>
                        <label className="label" htmlFor={field.name}>
                          <span className="label-text text-lg font-medium flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <title>{'calendar'}</title>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            どの日に勉強した？
                          </span>
                        </label>
                        <div>
                          <button
                            type="button"
                            name={field.name}
                            popoverTarget="date-popover"
                            className="input input-border text-xl"
                            id={field.name}
                            // style="anchorName:--target-date" // anchorpositioning関係はエディタ上では現状のルール,環境およびツールチェインだとエラーになる
                            style={{ anchorName: '--target-date' } as CSSProperties}
                          >
                            {today}
                          </button>
                          <div
                            popover="auto"
                            id="date-popover"
                            className="dropdown bg-base-100 rounded-box shadow-lg max-w-xl w-full"
                            // style="positionAnchor:--target-date" // anchorpositioning関係はエディタ上では現状のルール,環境およびツールチェインだとエラーになる
                            style={{ positionAnchor: '--target-date' } as CSSProperties}
                          >
                            <div className="card bg-base-100 shadow-md border border-base-200 w-full max-w-xl">
                              <div className="card-body">
                                <h2 className="card-title text-xl flex items-center gap-2">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-accent"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <title>{'calendar'}</title>
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                  カレンダー
                                </h2>
                                <calendar-date
                                  className="cally bg-base-100 p-2 shadow-none rounded-box w-full font-bold"
                                  value={field.state.value}
                                  formatWeekday="short"
                                  showOutsideDays={true}
                                  isDateDisallowed={(date) => {
                                    const disabledDates =
                                      dashboardData?.activities.map(
                                        (activity) => activity.activityDate,
                                      ) || [];
                                    return disabledDates.includes(date.toISOString().split('T')[0]);
                                  }}
                                  onchange={(e) => {
                                    const value = (e.target as HTMLInputElement).value;
                                    field.handleChange(value);
                                    const targetDateButton =
                                      document.getElementById('target-date-btn');
                                    if (targetDateButton) {
                                      targetDateButton.innerText = value;
                                    }
                                    // close popover
                                    const popover = document.getElementById('date-popover');
                                    if (popover && 'hidePopover' in popover) {
                                      (popover as HTMLElement).hidePopover();
                                    }
                                  }}
                                >
                                  <button
                                    type={'button'}
                                    slot={'previous'}
                                    aria-label={'previous'}
                                    className="btn btn-ghost btn-md btn-outline"
                                  >
                                    <span className="flex items-center">
                                      <svg
                                        className="fill-current size-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                      >
                                        <title>前の月</title>
                                        <path d="M15.75 19.5 8.25 12l7.5-7.5" />
                                      </svg>
                                      <span className="ml-1">前の月</span>
                                    </span>
                                  </button>
                                  <button
                                    type={'button'}
                                    slot={'next'}
                                    aria-label={'next'}
                                    className="btn btn-ghost btn-md btn-outline"
                                  >
                                    <span className="flex items-center">
                                      <span className="mr-1">次の月</span>
                                      <svg
                                        className="fill-current size-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                      >
                                        <title>次の月</title>
                                        <path d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                      </svg>
                                    </span>
                                  </button>
                                  <calendar-month />
                                </calendar-date>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
              </div>
              {/* 学習時間 */}
              {/* <div className="form-control w-full mb-4">
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
              <div className="flex gap-4">
                <div className="flex lg:flex-row flex-col lg: justify-around gap-4 items-center w-full">
                  <div className="flex flex-col items-center">
                    <span className="text-sm mb-1">分</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="btn btn-outline btn-md bg-neutral text-neutral-content"
                        onClick={() => setMinutes(Math.max(minutes - 10, 0))}
                      >
                        <span className="i-lucide-chevrons-left" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline btn-md"
                        onClick={() => setMinutes(Math.max(minutes - 1, 0))}
                      >
                        <span className="i-lucide-chevron-left" />
                      </button>
                      <div className="mx-2  text-center text-2xl font-semibold w-10">{minutes}</div>
                      <button
                        type="button"
                        className="btn btn-md btn-outline"
                        onClick={() => setMinutes(minutes + 1)}
                      >
                        <span className="i-lucide-chevron-right" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-md btn-outline bg-neutral text-neutral-content"
                        onClick={() => setMinutes(minutes + 10)}
                      >
                        <span className="i-lucide-chevrons-right" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-sm mb-1">秒</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="btn btn-outline btn-md bg-neutral text-neutral-content"
                        onClick={() => setSeconds(Math.max(seconds - 10, 0))}
                      >
                        <span className="i-lucide-chevrons-left" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline btn-md"
                        onClick={() => setSeconds(Math.max(seconds - 1, 0))}
                      >
                        <span className="i-lucide-chevron-left" />
                      </button>
                      <div className="mx-2  text-center text-2xl font-semibold w-10">{seconds}</div>
                      <button
                        type="button"
                        className="btn btn-md btn-outline"
                        onClick={() => setSeconds(seconds + 1)}
                      >
                        <span className="i-lucide-chevron-right" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-md btn-outline bg-neutral text-neutral-content"
                        onClick={() => setSeconds(seconds + 10)}
                      >
                        <span className="i-lucide-chevrons-right" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
              {/* 学習時間 */}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* 分の設定 */}
                    <form.Field
                      name="study_time.minutes"
                      // biome-ignore lint/correctness/noChildrenProp: <explanation>
                      children={(field) => {
                        return (
                          <div className="flex flex-col items-center space-y-4">
                            <div className="text-center">
                              <span className="text-lg font-medium text-base-content/70 uppercase tracking-wide">
                                分
                              </span>
                              <div className="text-4xl font-bold text-secondary mt-1">
                                {field.state.value}
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <button
                                type="button"
                                className="btn btn-lg btn-circle btn-outline hover:btn-secondary"
                                onClick={() => {
                                  field.handleChange(Math.max(field.state.value - 10, 0));
                                }}
                                title="10分減らす"
                              >
                                <span className="i-lucide-chevrons-left text-xs" />
                              </button>
                              <button
                                type="button"
                                className="btn btn-lg btn-circle btn-outline hover:btn-secondary"
                                onClick={() => {
                                  field.handleChange(Math.max(field.state.value - 1, 0));
                                }}
                                title="1分減らす"
                              >
                                <span className="i-lucide-chevron-left text-xs" />
                              </button>
                              <button
                                type="button"
                                className="btn btn-lg btn-circle btn-outline hover:btn-secondary"
                                onClick={() => {
                                  field.handleChange(field.state.value + 1);
                                }}
                                title="1分増やす"
                              >
                                <span className="i-lucide-chevron-right text-xs" />
                              </button>
                              <button
                                type="button"
                                className="btn btn-lg btn-circle btn-outline hover:btn-secondary"
                                onClick={() => {
                                  field.handleChange(field.state.value + 10);
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
                                    field.handleChange(minuteValue);
                                  }}
                                >
                                  {minuteValue}分
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      }}
                    />

                    {/* 秒の設定 */}
                    <form.Field
                      name="study_time.seconds"
                      // biome-ignore lint/correctness/noChildrenProp: <explanation>
                      children={(field) => {
                        return (
                          <div className="flex flex-col items-center space-y-4">
                            <div className="text-center">
                              <span className="text-lg font-medium text-base-content/70 uppercase tracking-wide">
                                秒
                              </span>
                              <div className="text-4xl font-bold text-secondary mt-1">
                                {field.state.value}
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <button
                                type="button"
                                className="btn btn-lg btn-circle btn-outline hover:btn-secondary"
                                onClick={() => {
                                  field.handleChange(Math.max(field.state.value - 10, 0));
                                }}
                                title="10秒減らす"
                              >
                                <span className="i-lucide-chevrons-left text-xs" />
                              </button>
                              <button
                                type="button"
                                className="btn btn-lg btn-circle btn-outline hover:btn-secondary"
                                onClick={() => {
                                  // setSeconds(Math.max(seconds - 1, 0));
                                  field.handleChange(Math.max(field.state.value - 1, 0));
                                }}
                                title="1秒減らす"
                              >
                                <span className="i-lucide-chevron-left text-xs" />
                              </button>
                              <button
                                type="button"
                                className="btn btn-lg btn-circle btn-outline hover:btn-secondary"
                                onClick={() => {
                                  // setSeconds(seconds + 1);
                                  field.handleChange(field.state.value + 1);
                                }}
                                title="1秒増やす"
                              >
                                <span className="i-lucide-chevron-right text-xs" />
                              </button>
                              <button
                                type="button"
                                className="btn btn-lg btn-circle btn-outline hover:btn-secondary"
                                onClick={() => {
                                  // setSeconds(seconds + 10);
                                  field.handleChange(field.state.value + 10);
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
                                    field.handleChange(sec);
                                  }}
                                >
                                  {sec}秒
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
              {/* 点数 */}
              <form.Field
                name="score"
                // biome-ignore lint/correctness/noChildrenProp: <explanation>
                children={(field) => {
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
                            className={`${field.state.meta.isDefaultValue || !field.state.value ? 'placeholder:text-base text-md' : 'text-5xl'} text-primary focus:rounded-lg focus:border-b-base-100 border-base-300  w-48 border-b-primary border-b-2 text-center outline-none h-18 align-bottom font-bold`}
                            value={field.state.value || ''}
                            placeholder="タップして入力"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const scoreValue = Math.min(
                                Math.max(
                                  Number.parseInt(e.target.value),
                                  settingsData.scoreMin ?? 0,
                                ),
                                settingsData.scoreMax ?? 100,
                              );

                              // setScore(e.target.value ? Number.parseInt(e.target.value) : null);
                              // setScore(scoreValue);
                              field.handleChange(scoreValue);
                            }}
                            required
                          />
                          <span className="text-lg"> 点</span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              {/* 気分 (オプション) */}
              {settingsData.showMood && (
                <form.Field
                  name="mood"
                  // biome-ignore lint/correctness/noChildrenProp: <explanation>
                  children={(field) => {
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
                            // <button
                            //   type="button"
                            //   key={option.value}
                            //   className={`card ${option.color} shadow-sm hover:shadow-md transition-all cursor-pointer`}
                            // >
                            //   <div className="card-body items-center text-center p-3">
                            //     <input
                            //       type="radio"
                            //       name={field.name}
                            //       value={option.value}

                            //       className="radio radio-primary hidden"
                            //       id={`mood_${option.value}`}
                            //     />
                            //     <label
                            //       htmlFor={`mood_${option.value}`}
                            //       className="cursor-pointer text-xl font-bold"
                            //     >
                            //       {option.label}
                            //     </label>
                            //   </div>
                            // </button>
                            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                            <div
                              key={option.value}
                              onClick={() =>
                                field.state.value === option.value
                                  ? field.handleChange('')
                                  : field.handleChange(option.value)
                              }
                              className={`relative card ${option.color} ${field.state.value === option.value ? 'ring-4 ring-primary ring-offset-2 scale-105' : ''} shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-102 active:scale-95`}
                            >
                              <div className="flex card-body items-center text-center p-2">
                                <div className="text-4xl mb-2">{option.emoji}</div>
                                <div className="text-xl font-bold">{option.label}</div>

                                {field.state.value === option.value && (
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
                                  checked={field.state.value === option.value}
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
                  }}
                />
              )}
              {/* コメント */}
              {settingsData.showMemo && (
                <form.Field
                  name="memo"
                  // biome-ignore lint/correctness/noChildrenProp: <explanation>
                  children={(field) => {
                    return (
                      <div className="form-control w-full mb-6">
                        <label className="label" htmlFor={field.name}>
                          <span className="label-text text-lg font-medium flex items-center gap-2">
                            <title>{'comment'}</title>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                            >
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
                            メモ
                          </span>
                        </label>
                        <div>
                          <textarea
                            className="textarea textarea-bordered h-24 w-full"
                            placeholder="メモや感想"
                            name={field.name}
                            id={field.name}
                            value={field.state.value}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                              field.handleChange(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                    );
                  }}
                />
              )}
              {/* 送信ボタン */}
              <div className="modal-action flex justify-center gap-4">
                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  // biome-ignore lint/correctness/noChildrenProp: <explanation>
                  children={([canSubmit, isSubmitting]) => (
                    <>
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={handleClose}
                        disabled={isSubmitting}
                      >
                        キャンセル
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg gap-2"
                        disabled={!canSubmit}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <title>{'check'}</title>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {isSubmitting ? '送信中...' : '記録する'}
                      </button>
                    </>
                  )}
                />
              </div>
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
