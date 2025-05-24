import { useHealthCheck } from '@/client/api/health/hooks';
import { Header } from '@/client/components/parts/header';
import React, { type FC } from 'react';
import ReactDOM from 'react-dom/client';
import { SWRConfig } from 'swr';
import { Footer } from '../components/parts/footer';

const PanicPage: FC = () => {
  const { data, error, isLoading } = useHealthCheck();
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white-50 to-purple-100">
      <Header>
        <span className="text-4xl font-bold text-yellow-300">Panic! </span>
      </Header>
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-red-500">エラーはっせい！</h1>
        <p className="mt-4 text-lg text-gray-700">Something went wrong.</p>

        {isLoading ? (
          <div className="loading loading-xl loading-bars" />
        ) : (
          <div>
            <p className="mt-4 text-lg text-gray-700">{error?.message}</p>
            <div className="card p-4 bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">app health check</h2>
                <h3 className="text-md">messages:</h3>
                <ul className="list-disc list-inside">
                  {data?.messages.map((message: string, index: number) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    <li key={index} className="text-gray-700">
                      {message}
                    </li>
                  ))}
                </ul>
                <div className="divider" />
                <h3>details:</h3>
                <ul className="list-disc list-inside">
                  {/* {data?.details?.map((detail: string, index: number) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    <li key={index} className="text-gray-700">
                      {JSON.stringify(detail)}
                    </li>
                  ))} */}
                  {data?.details &&
                    Object.entries(data.details).map(([key, value], index) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      <li key={index} className="text-gray-700">
                        <strong>{key}:</strong> {JSON.stringify(value)}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

async function enableMocking() {
  if (import.meta.env.DEV) {
    console.info('Mocking is enabled in development mode.');
    const { worker } = await import('@/client/mock/browser');
    return worker.start({
      onUnhandledRequest: 'bypass', // 未処理のリクエストはそのまま通す
    });
  }
  return Promise.resolve();
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <SWRConfig
        value={{
          refreshInterval: 0,
          dedupingInterval: 45000,
          revalidateOnFocus: false,
          revalidateOnReconnect: false,
          shouldRetryOnError: false,
          errorRetryCount: 3,
          errorRetryInterval: 0,
        }}
      >
        <PanicPage />
      </SWRConfig>
    </React.StrictMode>,
  );
});
