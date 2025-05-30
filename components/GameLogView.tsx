
import React from 'react';
import { BookOpenIcon } from './icons/BookOpenIcon';

interface GameLogViewProps {
  logEntries: string[];
}

export const GameLogView: React.FC<GameLogViewProps> = ({ logEntries }) => {
  return (
    <div className="bg-parchment-dark p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-display text-ink-DEFAULT mb-3 border-b border-ink-light pb-2 flex items-center">
        <BookOpenIcon className="w-6 h-6 mr-2 text-ink-light" />
        왕국 연대기
      </h2>
      {logEntries.length === 0 ? (
        <p className="text-sm text-ink-light italic">왕실 기록은 아직 작성되지 않았습니다.</p>
      ) : (
        <ul className="space-y-2 max-h-48 overflow-y-auto text-sm">
          {logEntries.map((entry, index) => (
            <li key={index} className={`p-2 rounded ${index === 0 ? 'bg-parchment text-ink-DEFAULT font-medium border border-ink-light/30' : 'bg-parchment/50 text-ink-light'}`}>
              {entry}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};