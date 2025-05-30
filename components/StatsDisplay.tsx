
import React from 'react';
import { KingdomStats } from '../types';
import { CoinIcon } from './icons/CoinIcon';
import { FoodIcon } from './icons/FoodIcon';
import { MilitaryIcon } from './icons/MilitaryIcon';
import { HappinessIcon } from './icons/HappinessIcon';
import { PopulationIcon } from './icons/PopulationIcon';
import { OrderIcon } from './icons/OrderIcon';
import { CalendarIcon } from './icons/CalendarIcon';

interface StatsDisplayProps {
  stats: KingdomStats;
}

const StatItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number; colorClass: string; }> = ({ icon, label, value, colorClass }) => (
  <div className={`flex items-center p-3 bg-parchment rounded-md shadow-sm border-l-4 ${colorClass}`}>
    <div className="mr-3 text-ink-DEFAULT">{icon}</div>
    <div>
      <p className="text-xs text-ink-light font-medium">{label}</p>
      <p className="text-lg font-bold text-ink-DEFAULT">{value}</p>
    </div>
  </div>
);

const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats }) => {
  return (
    <div className="bg-parchment-dark p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-display text-ink-DEFAULT mb-4 border-b-2 border-ink-light pb-2">왕국 현황</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatItem icon={<CalendarIcon className="w-6 h-6"/>} label="현재 일차" value={stats.currentDay} colorClass="border-gray-400" />
        <StatItem icon={<CoinIcon className="w-6 h-6"/>} label="금" value={stats.gold.toLocaleString()} colorClass="border-yellow-500" />
        <StatItem icon={<FoodIcon className="w-6 h-6"/>} label="식량" value={stats.food.toLocaleString()} colorClass="border-lime-500" />
        <StatItem icon={<PopulationIcon className="w-6 h-6"/>} label="인구" value={stats.population.toLocaleString()} colorClass="border-blue-500" />
        <StatItem icon={<MilitaryIcon className="w-6 h-6"/>} label="군사력" value={stats.militaryStrength} colorClass="border-red-500" />
        <StatItem icon={<HappinessIcon className="w-6 h-6"/>} label="행복도" value={`${stats.citizenHappiness}%`} colorClass="border-green-500" />
        <StatItem icon={<OrderIcon className="w-6 h-6"/>} label="공공질서" value={`${stats.publicOrder}%`} colorClass="border-purple-500" />
      </div>
    </div>
  );
};

export default StatsDisplay;