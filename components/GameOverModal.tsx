import React from 'react';
import { BrokenCrownIcon } from './icons/BrokenCrownIcon';
import { HistoricalDataPoint } from '../types';
import CombinedStatChart from './CombinedStatChart';

interface GameOverModalProps {
  onRestart: () => void;
  gameOverMessage?: string;
  historicalData: HistoricalDataPoint[];
  currentDay: number;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ onRestart, gameOverMessage, historicalData, currentDay }) => {
  const cleanMessage = gameOverMessage ? gameOverMessage.replace("게임 오버: ", "").replace(" 왕국의 통치가 막을 내렸습니다.", "") : "왕국의 운명이 다했습니다.";
  const daysSurvived = currentDay > 1 ? currentDay -1 : 0;
  const survivedMessage = daysSurvived > 0 ? `폐하께서는 총 ${daysSurvived}일 동안 왕국을 통치하셨습니다.` : "폐하께서는 즉위하시자마자 왕국의 종말을 맞이하셨습니다...";

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-[200] overflow-y-auto">
      <div className="bg-parchment p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg text-center border-4 border-red-700 my-auto">
        <BrokenCrownIcon className="w-20 h-20 text-red-600 mx-auto mb-4" />
        <h2 className="text-3xl font-display text-red-700 font-bold mb-3">게임 오버</h2>
        <p className="text-ink-DEFAULT mb-2 text-md">
          {cleanMessage}
        </p>
        <p className="text-ink-light mb-4 text-sm italic">
          {survivedMessage}
        </p>

        <CombinedStatChart data={historicalData} title="왕국의 마지막 기록" />
        
        <button
          onClick={onRestart}
          style={{backgroundColor: '#4A3B31'}}
          className="w-full !bg-ink-DEFAULT text-parchment font-display font-bold py-4 px-6 rounded-lg shadow-lg-dark transition-all duration-200 ease-in-out text-xl mt-8 focus:outline-none focus:ring-2 focus:ring-ink-DEFAULT focus:ring-opacity-75"
        >
          새로운 역사 시작하기
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;