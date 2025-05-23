import React, { type FC } from 'react';
import ReactDOM from 'react-dom/client';

const PanicPage: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600">Panic!</h1>
      <p className="mt-4 text-lg text-gray-700">Something went wrong.</p>
      <button
        type="button"
        onClick={() => window.close()}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Close
      </button>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <PanicPage />
  </React.StrictMode>,
);
