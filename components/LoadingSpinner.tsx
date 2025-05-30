
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-parchment/50 backdrop-blur-sm flex flex-col items-center justify-center z-[100]">
      <div className="w-16 h-16 border-4 border-seal-DEFAULT border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-ink-DEFAULT text-lg font-display">에델바이스가 부지런히 작업 중입니다...</p>
    </div>
  );
};

export default LoadingSpinner;