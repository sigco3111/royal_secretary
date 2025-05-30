
import React from 'react';
import { EdelweissGoal } from '../types';
import { TargetIcon } from './icons/TargetIcon';

interface GoalSetterProps {
  currentGoal: EdelweissGoal;
  onSetGoal: (goal: EdelweissGoal) => void;
  isDisabled?: boolean;
}

const GoalSetter: React.FC<GoalSetterProps> = ({ currentGoal, onSetGoal, isDisabled }) => {
  const goals = Object.values(EdelweissGoal);

  return (
    <div className={`bg-parchment-dark p-4 rounded-lg shadow-md ${isDisabled ? 'opacity-70' : ''}`}>
      <h2 className="text-xl font-display text-ink-DEFAULT mb-3 border-b border-ink-light pb-2 flex items-center">
        <TargetIcon className="w-6 h-6 mr-2 text-seal-DEFAULT" />
        에델바이스를 위한 왕명
      </h2>
      <p className="text-sm text-ink-light mb-3">왕실 서기관에게 왕국의 주요 목표를 지시하십시오.</p>
      <div className="space-y-2">
        {goals.map((goal) => (
          <button
            key={goal}
            onClick={() => !isDisabled && onSetGoal(goal)}
            disabled={isDisabled}
            className={`w-full text-left p-3 rounded transition-colors duration-150 ${
              currentGoal === goal && !isDisabled
                ? 'bg-seal-DEFAULT text-parchment shadow-inner ring-2 ring-seal-dark'
                : 'bg-parchment hover:bg-ink-light/10 border border-ink-light/20'
            } ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <span className="font-medium text-sm">{goal}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GoalSetter;
