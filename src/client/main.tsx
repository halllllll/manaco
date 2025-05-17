import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

async function enableMocking() {
  if (import.meta.env.DEV) {
    console.info('Mocking is enabled in development mode.');
    const { worker } = await import('./mock/browser');
    return worker.start({
      onUnhandledRequest: 'bypass', // 未処理のリクエストはそのまま通す
    });
  }
  return Promise.resolve();
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
