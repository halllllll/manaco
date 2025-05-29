import 'cally';

import { type FC, type FormEvent, Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '../components/ErrorFallback';

import { Toast } from '../components/Toast/toast';

import { DevTools } from '../devtool';
import { AppLayout } from './components/AppLayout';
import { FormModal } from './components/FormModal';

const App: FC = () => {
  // 投稿モーダル用のステート
  const [isModalOpen, setIsModalOpen] = useState(false);

  // フォーム送信処理 いったんテストでコメントアウト

  const handleSubmitPost = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('投稿内容:');
    console.log(e);
    // ここで実際の投稿処理（APIコールなど）

    // フォームリセットとモーダルを閉じる
    setIsModalOpen(false);
  };

  return (
    <>
      {/* 開発ツールを追加 */}
      {import.meta.env.DEV && <DevTools />}

      <Toast />

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense>
          <AppLayout setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} />
        </Suspense>
      </ErrorBoundary>
      <FormModal
        isModalOpen={isModalOpen}
        handleSubmitPost={handleSubmitPost}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};

export default App;
