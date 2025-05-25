import { Footer } from '@/client/components/parts/footer';
import { Header } from '@/client/components/parts/header';
import type { FC } from 'react';
import { useUserState } from '../hooks/useUserState';
import type { AppLayoutProps } from '../types/props';
import { DashboardSkeleton } from './DashboardSkeleton';
import { EmptyDashboard } from './EmptyDashboard';
import { LearningRecordButton } from './LearningRecordButton';
import { UnregisteredView } from './UnregisteredView';
import { UserDashboard } from './UserDashboard';

/**
 * アプリのメインレイアウトコンポーネント
 */
export const AppLayout: FC<AppLayoutProps> = ({ setIsModalOpen, isModalOpen: _isModalOpen }) => {
  const { isLoading, error, isRegistered, hasActivities, userData, sheetName, sheetUrl } =
    useUserState();

  const renderContent = () => {
    if (isLoading) {
      return <DashboardSkeleton />;
    }

    if (error) {
      return (
        <div className="alert alert-error">
          <div>
            <span>Error: {error.message}</span>
          </div>
        </div>
      );
    }

    if (!isRegistered) {
      return (
        <UnregisteredView
          sheetName={sheetName ?? '取得できませんでした'}
          sheetUrl={sheetUrl ?? '取得できませんでした'}
        />
      );
    }

    if (!hasActivities) {
      return <EmptyDashboard openModal={() => setIsModalOpen(true)} />;
    }

    return <UserDashboard userData={userData} />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white-50 to-purple-100">
      <Header />

      <main className="container mx-auto p-4">{renderContent()}</main>

      <Footer />

      {isRegistered && hasActivities && (
        <LearningRecordButton
          openModal={() => setIsModalOpen(true)}
          variant="fixed"
          label="学習を記録する"
        />
      )}
    </div>
  );
};
