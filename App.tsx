import React from 'react';
import Dashboard from './components/Dashboard';
import { CrownIcon } from './components/icons/CrownIcon';

// API 키가 없어도 모의 데이터로 게임이 작동하도록 환경 변수 설정
if (!process.env.API_KEY) {
  process.env.API_KEY = 'MOCK_DATA_MODE';
}

const App: React.FC = () => {
  // 이전에 API 키 체크 부분이 있었으나 모의 데이터로 대체되어 삭제됨

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