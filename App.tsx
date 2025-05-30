
import React from 'react';
import Dashboard from './components/Dashboard';
import { CrownIcon } from './components/icons/CrownIcon';

const App: React.FC = () => {
  // This check is a placeholder. In a real environment, process.env.API_KEY would be set.
  // For this exercise, we'll assume it's available and proceed.
  // if (!process.env.API_KEY) {
  //   return (
  //     <div className="min-h-screen bg-red-100 flex flex-col items-center justify-center p-4">
  //       <div className="bg-white p-8 rounded-lg shadow-xl text-center">
  //         <h1 className="text-2xl font-bold text-red-700 mb-4">API Key Missing</h1>
  //         <p className="text-gray-700">
  //           The Gemini API key is not configured. Please set the <code className="bg-red-200 px-1 rounded">process.env.API_KEY</code> environment variable.
  //         </p>
  //         <p className="mt-2 text-sm text-gray-500">
  //           (For this demonstration, functionality will be limited if the key is truly absent, but the UI will proceed assuming it's available in a deployed environment.)
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-parchment-dark p-4 md:p-8 flex flex-col items-center">
      <header className="mb-8 text-center">
        <h1 className="title-text text-4xl md:text-5xl font-bold text-ink-DEFAULT flex items-center justify-center">
          <CrownIcon className="w-10 h-10 md:w-12 md:h-12 mr-3 text-gold-DEFAULT" />
          왕실 서기관: AI 에델바이스 보고서
        </h1>
        <p className="text-ink-light italic mt-1">왕국의 운명이 당신의 지혜를 기다립니다</p>
      </header>
      <main className="w-full max-w-7xl bg-parchment shadow-lg-dark rounded-lg p-4 md:p-6">
        <Dashboard />
      </main>
      <footer className="mt-8 text-center text-sm text-ink-light">
        <p>&copy; {new Date().getFullYear()} 엘도리아 왕국. 모든 권리 보유 (아닐 수도 있음).</p>
      </footer>
    </div>
  );
};

export default App;