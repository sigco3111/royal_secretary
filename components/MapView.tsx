import React from 'react';
import { Territory } from '../types';
import { MapPinIcon } from './icons/MapPinIcon';
import { CastleIcon } from './icons/CastleIcon';
import { VillageIcon } from './icons/VillageIcon';
import { BanditIcon } from './icons/BanditIcon';
import { MineIcon } from './icons/MineIcon';
import { ForestIcon } from './icons/ForestIcon';
import { TradeIcon } from './icons/TradeIcon';


interface MapViewProps {
  territories: Territory[];
}

const getTerritoryIcon = (territory: Territory): React.ReactNode => {
    if (territory.id.includes('city')) return <CastleIcon className="w-5 h-5"/>;
    if (territory.id.includes('farms')) return <VillageIcon className="w-5 h-5"/>;
    if (territory.id.includes('mines')) return <MineIcon className="w-5 h-5"/>;
    if (territory.id.includes('forest')) return <ForestIcon className="w-5 h-5"/>;
    if (territory.id.includes('trade')) return <TradeIcon className="w-5 h-5"/>;
    return <MapPinIcon className="w-5 h-5"/>;
}


const MapView: React.FC<MapViewProps> = ({ territories }) => {
  return (
    <div className="bg-parchment-dark p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-display text-ink-DEFAULT mb-3 border-b border-ink-light pb-2">왕국 영토</h2>
      {/* 지도 표시 영역 제거 */}
      <ul className="space-y-2">
        {territories.map((territory) => (
          <li key={territory.id} className="p-2 bg-parchment rounded border border-ink-light/20 flex items-start text-sm">
            <span className="mr-2 pt-0.5 text-ink-light">{getTerritoryIcon(territory)}</span>
            <div>
                <strong className="text-ink-DEFAULT">{territory.name}</strong>
                {territory.hasBandits && <BanditIcon className="w-4 h-4 inline-block ml-2 text-red-600" title="산적 활동 보고됨"/>}
                <p className="text-xs text-ink-light italic">{territory.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MapView;