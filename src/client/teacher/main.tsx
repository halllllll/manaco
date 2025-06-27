import React from 'react';
import ReactDOM from 'react-dom/client';
import { SWRConfig } from 'swr';
import { ToastProvider } from '../context/ToastConterxt';
import { App } from './App';

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
        <ToastProvider>
          <App />
        </ToastProvider>
      </SWRConfig>
    </React.StrictMode>,
  );
});
