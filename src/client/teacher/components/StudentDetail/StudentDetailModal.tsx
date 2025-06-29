import { useSettings } from '@/api/settings/hook';
import { formatDate } from '@/shared/common/func';
import type { LearningActivity } from '@/shared/types/activity';
import { type FC, useEffect, useState } from 'react';
import { ActivityDetailModal } from '../../../student/components/learningLogs/ActivityDetailModal';
import { ActivityTable } from '../../../student/components/learningLogs/ActivityTable';
import { useStudentDetail } from './useStudentDetail';

type StudentDetailModalProps = {
  studentId: string | null;
  onClose: () => void;
};

/**
 * 生徒詳細モーダルコンポーネント
 * 生徒の基本情報と学習活動の履歴を表示
 */
export const StudentDetailModal: FC<StudentDetailModalProps> = ({ studentId, onClose }) => {
  const { student, isLoading: studentIsLoading, error: studentError } = useStudentDetail(studentId);
  const { data: settings, isLoading: settingsIsLoading, error: settingsError } = useSettings();
  const [selectedActivity, setSelectedActivity] = useState<LearningActivity | null>(null);

  useEffect(() => {
    if (studentId) {
      console.log(`open detailed student info modal: ${studentId}`);
    }
  }, [studentId]);

  // 学習記録選択時の処理
  const handleSelectActivity = (activity: any) => {
    setSelectedActivity(activity as unknown as LearningActivity);
  };

  // アクティビティ詳細モーダルを閉じる処理
  const handleCloseActivityDetail = () => {
    setSelectedActivity(null);
  };

  const isLoading = studentIsLoading || settingsIsLoading;
  const error = studentError || settingsError;

  if (!studentId) return null;

  return (
    // daisyUIのモーダルコンポーネント
    <dialog id="student_detail_modal" className={`modal ${studentId ? 'modal-open' : ''}`}>
      <div className="modal-box max-w-4xl">
        {/* ローディング中の表示 */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="loading loading-spinner loading-lg text-primary" />
          </div>
        )}

        {/* エラー表示 */}
        {error && (
          <div className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>生徒または設定情報の取得中にエラーが発生しました。</span>
          </div>
        )}

        {/* 生徒情報表示 */}
        {student && settings && (
          <>
            <h3 className="font-bold text-2xl text-primary mb-4 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-user"
                aria-hidden="true"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {student.name} さんの詳細情報
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="card bg-base-200 shadow-sm">
                <div className="card-body p-4">
                  <h4 className="card-title text-lg mb-2">基本情報</h4>
                  <table className="table table-sm">
                    <tbody>
                      <tr>
                        <th>学生ID</th>
                        <td>{student.id}</td>
                      </tr>
                      <tr>
                        <th>クラス/グループ</th>
                        <td>{student.belonging || '未設定'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card bg-base-200 shadow-sm">
                <div className="card-body p-4">
                  <h4 className="card-title text-lg mb-2">学習活動サマリー</h4>
                  <div className="stats stats-vertical shadow w-full">
                    <div className="stat">
                      <div className="stat-title">総学習記録数</div>
                      <div className="stat-value text-primary">
                        {student.activities?.length || 0}
                      </div>
                    </div>

                    <div className="stat">
                      <div className="stat-title">最終学習日</div>
                      <div className="stat-value text-accent text-lg">
                        {student.activities && student.activities.length > 0
                          ? formatDate(
                              student.activities
                                .map((a) => a.activityDate)
                                .sort()
                                .reverse()[0],
                            )
                          : '記録なし'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 学習活動履歴 */}
            <div className="divider mb-6">学習活動履歴</div>

            {student.activities && student.activities.length > 0 ? (
              <ActivityTable
                activities={student.activities as unknown as LearningActivity[]}
                onSelectActivity={handleSelectActivity}
                settings={settings}
              />
            ) : (
              <div className="alert">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-info shrink-0 w-6 h-6"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>この生徒の学習記録はまだありません。</span>
              </div>
            )}
          </>
        )}

        <div className="modal-action">
          <button type="button" className="btn" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>

      <form
        method="dialog"
        className="modal-backdrop"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
      >
        <button type="button">閉じる</button>
      </form>

      {/* 学習活動詳細モーダル */}
      {selectedActivity && settings && (
        <ActivityDetailModal
          selectedActivity={selectedActivity}
          onClose={handleCloseActivityDetail}
          settings={settings}
        />
      )}
    </dialog>
  );
};
