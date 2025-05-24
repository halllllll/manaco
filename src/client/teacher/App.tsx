import type { FC } from 'react';

export const App: FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white-50 to-purple-100">
      <header className="bg-purple-600 text-white p-4">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
      </header>
      <main className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold">Welcome to the Teacher Dashboard</h2>
        <p className="mt-4 text-lg text-gray-700">
          This is where you can manage your classes and students.
        </p>
      </main>
    </div>
  );
};
