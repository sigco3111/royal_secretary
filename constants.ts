import { KingdomStats, Territory, EdelweissGoal } from './types';

export const INITIAL_KINGDOM_STATS: KingdomStats = {
  gold: 1000,
  population: 1200,
  food: 1500,
  militaryStrength: 70,
  citizenHappiness: 70,
  publicOrder: 80,
  currentDay: 1,
  territories: [
    { id: 'eldoria_city', name: '엘도리아 시 (수도)', population: 480, description: "왕국의 심장부, 번화하지만 요구 사항이 많습니다." },
    { id: 'north_farms', name: '북부 농경지', population: 360, description: "비옥한 땅, 왕국의 곡창 지대입니다." },
    { id: 'south_mines', name: '남부 광산 지대', population: 180, description: "광물이 풍부하지만, 작업 환경이 열악할 수 있습니다." },
    { id: 'west_forest', name: '서부 삼림 지대', population: 120, hasBandits: true, description: "깊은 숲, 사냥감과 무법자들이 출몰합니다." },
    { id: 'east_trade', name: '동부 교역로', population: 60, description: "상인들에게 중요한 길목이지만, 안전 확보가 필요합니다." },
  ],
  gameLog: ["새로운 국왕 폐하의 통치가 시작되었습니다. 지혜로운 손길로 왕국을 이끄소서."],
};

export const GEMINI_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';
// export const GEMINI_MODEL_IMAGE = 'imagen-3.0-generate-002'; // If image generation was needed

export const DEFAULT_EDELWEISS_GOAL = EdelweissGoal.BALANCED_GROWTH;

export const MAX_LOG_ENTRIES = 10;