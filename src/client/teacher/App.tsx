import { useSheetName } from '@/api/sheet/hooks';
import { type FC, Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '../components/ErrorFallback';
import { Toast } from '../components/Toast/toast';
import { Footer } from '../components/parts/footer';
import { ActivityHeatmap } from './components/ActivityHeatmap';
import { CurrentTeacherName } from './components/CurrentTeacherName';
import { DashboardSummary } from './components/DashboardSummary';
import { StudentDetailModal } from './components/StudentDetail';
import { StudentSummaryTable } from './components/StudentSummaryTable/StudentSummaryTable';
import { TeacherDevTools } from './components/TeacherDevTools';

export const App: FC = () => {
  // 選択された生徒のID（詳細表示モーダル用）
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  // 現在表示中の画面（'heatmap': ヒートマップ, 'students': 生徒一覧）
  const [activeTab, setActiveTab] = useState<'heatmap' | 'students'>('heatmap');

  const { data: title, isLoading: isLoadingSheetName } = useSheetName();

  // 生徒が選択された時の処理
  const handleStudentSelect = (studentId: string) => {
    setSelectedStudent(studentId);
    console.log(`selected student: ${studentId}`);
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
                <h1 className="text-2xl font-bold">{`教員用画面 ${isLoadingSheetName ? '' : title}`}</h1>

                <div className="flex items-center gap-4">
                  <CurrentTeacherName />
                </div>
              </div>
            </header>

            <main className="container mx-auto p-4 flex-1">
              {/* タブナビゲーション */}
              <div className="tabs tabs-boxed mb-6" role="tablist">
                <button
                  role="tab"
                  aria-selected={activeTab === 'heatmap'}
                  type="button"
                  className={`tab ${activeTab === 'heatmap' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('heatmap')}
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

              {activeTab === 'heatmap' && (
                <div
                  role="tabpanel"
                  aria-label="活動ダッシュボード"
                  className="grid grid-cols-1 gap-6"
                >
                  {/* 概要パネル */}
                  <DashboardSummary />

                  {/* ヒートマップ */}
                  <div className="card bg-base-100 shadow-lg">
                    <ActivityHeatmap onStudentSelect={handleStudentSelect} />
                  </div>
                </div>
              )}

              {/* 生徒一覧画面 */}
              {activeTab === 'students' && (
                <div role="tabpanel" aria-label="生徒一覧">
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    {/* Suspenseを使わずに直接コンポーネントをレンダリング */}
                    <StudentSummaryTable onStudentSelect={handleStudentSelect} />
                  </ErrorBoundary>
                </div>
              )}
            </main>

            <Footer />
          </div>
        </Suspense>
      </ErrorBoundary>
      <StudentDetailModal studentId={selectedStudent} onClose={() => setSelectedStudent(null)} />
    </>
  );
};
