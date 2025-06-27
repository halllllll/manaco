import { type FC, Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '../components/ErrorFallback';
import { Toast } from '../components/Toast/toast';
import { ActivityHeatmap } from './components/ActivityHeatmap';
import { StudentDetailModal } from './components/StudentDetail';
import { StudentSummaryTable } from './components/StudentSummaryTable/StudentSummaryTable';
import { TeacherDevTools } from './components/TeacherDevTools';

export const App: FC = () => {
  // 選択中のクラス（all = すべてのクラス）
  const [selectedClass, setSelectedClass] = useState('all');

  // 選択された生徒のID（詳細表示モーダル用）
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  // 現在表示中の画面（'dashboard': ダッシュボード, 'students': 生徒一覧）
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students'>('dashboard');

  // 生徒が選択された時の処理
  const handleStudentSelect = (studentId: string) => {
    setSelectedStudent(studentId);
    console.log(`生徒が選択されました: ${studentId}`);
  };

  return (
    <>
      {/* 開発ツール（開発環境のみ表示） */}
      {import.meta.env.DEV && <TeacherDevTools />}

      <Toast />

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<div>Loading...</div>}>
          <div className="flex flex-col min-h-screen bg-base-100">
            <header className="bg-primary text-primary-content p-4 shadow-md">
              <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">教員ダッシュボード</h1>

                <div className="flex items-center gap-4">
                  {/* クラス選択ドロップダウン */}
                  <div className="dropdown dropdown-end">
                    <button type="button" className="btn btn-sm m-1">
                      {selectedClass === 'all' ? 'すべてのクラス' : selectedClass}
                    </button>
                    <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                      <li>
                        <button type="button" onClick={() => setSelectedClass('all')}>
                          すべてのクラス
                        </button>
                      </li>
                      <li>
                        <button type="button" onClick={() => setSelectedClass('class-1')}>
                          1年1組
                        </button>
                      </li>
                      <li>
                        <button type="button" onClick={() => setSelectedClass('class-2')}>
                          1年2組
                        </button>
                      </li>
                      <li>
                        <button type="button" onClick={() => setSelectedClass('class-3')}>
                          2年1組
                        </button>
                      </li>
                    </ul>
                  </div>

                  <div className="text-sm">ユーザー: 山田先生</div>
                </div>
              </div>
            </header>

            <main className="container mx-auto p-4 flex-1">
              {/* タブナビゲーション */}
              <div className="tabs tabs-boxed mb-6" role="tablist">
                <button
                  role="tab"
                  aria-selected={activeTab === 'dashboard'}
                  type="button"
                  className={`tab ${activeTab === 'dashboard' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  活動ダッシュボード
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === 'students'}
                  type="button"
                  className={`tab ${activeTab === 'students' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('students')}
                >
                  生徒一覧
                </button>
              </div>

              {/* ダッシュボード画面 */}
              {activeTab === 'dashboard' && (
                <div
                  role="tabpanel"
                  aria-label="活動ダッシュボード"
                  className="grid grid-cols-1 gap-6"
                >
                  {/* 概要パネル */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="stats shadow bg-base-100">
                      <div className="stat">
                        <div className="stat-title">登録生徒数</div>
                        <div className="stat-value text-primary">25</div>
                        <div className="stat-desc">全クラス合計</div>
                      </div>
                    </div>

                    <div className="stats shadow bg-base-100">
                      <div className="stat">
                        <div className="stat-title">今日の投稿数</div>
                        <div className="stat-value text-secondary">12</div>
                        <div className="stat-desc">全生徒の合計</div>
                      </div>
                    </div>

                    <div className="stats shadow bg-base-100">
                      <div className="stat">
                        <div className="stat-title">今週の投稿数</div>
                        <div className="stat-value text-accent">89</div>
                        <div className="stat-desc">過去7日間の合計</div>
                      </div>
                    </div>
                  </div>

                  {/* ヒートマップ */}
                  <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                      <h2 className="card-title mb-4">クラス活動ヒートマップ</h2>
                      <ActivityHeatmap
                        selectedClass={selectedClass}
                        onStudentSelect={handleStudentSelect}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 生徒一覧画面 */}
              {activeTab === 'students' && (
                <div role="tabpanel" aria-label="生徒一覧">
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    {/* Suspenseを使わずに直接コンポーネントをレンダリング */}
                    <StudentSummaryTable
                      selectedClass={selectedClass}
                      onStudentSelect={handleStudentSelect}
                    />
                  </ErrorBoundary>
                </div>
              )}
            </main>
          </div>
        </Suspense>
      </ErrorBoundary>

      {/* 生徒詳細モーダル */}
      <StudentDetailModal studentId={selectedStudent} onClose={() => setSelectedStudent(null)} />
    </>
  );
};
