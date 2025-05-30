export enum EdelweissGoal {
  CITIZEN_SATISFACTION = "백성 만족도 최우선",
  MILITARY_STRENGTH = "군사력 증강 집중",
  FINANCIAL_STABILITY = "재정 안정 확보",
  BALANCED_GROWTH = "균형 성장 유지"
}

export interface KingdomStats {
  gold: number;
  population: number;
  food: number;
  militaryStrength: number;
  citizenHappiness: number; // 0-100
  publicOrder: number; // 0-100
  currentDay: number;
  territories: Territory[];
  gameLog: string[]; // For simple textual log updates
}

export interface Territory {
  id: string;
  name: string;
  population: number;
  hasBandits?: boolean;
  specialBuilding?: string; 
  description: string;
}

export enum ReportType {
  DAILY_ADMINISTRATION = "일일 행정 보고서",
  WEEKLY_FINANCE = "주간 재정 요약",
  MONTHLY_HAPPINESS = "월간 백성 행복도 분석",
  SPECIAL_EVENT = "긴급 왕실 브리핑"
}

export enum ReportItemCategory {
  ECONOMY = "경제",
  RESOURCES = "자원",
  MILITARY = "군사",
  SOCIAL = "사회",
  AGRICULTURE = "농업",
  FINANCE = "재정",
  OVERVIEW = "개요",
  DIPLOMACY = "외교",
  INTERNAL_AFFAIRS = "내정",
  TRADE = "무역"
}

export interface ReportItem {
  title: string;
  text: string; // Detailed text for this item
  category: ReportItemCategory; 
  // Data for potential small charts or key figures within the item
  chartData?: { name: string; value: number }[]; 
}

export interface Report {
  id: string;
  date: string; // In-game date, e.g., "Day 5, Month of Harvest"
  type: ReportType;
  title: string; // Overall title of the report
  summary: string; // Edelweiss's overall summary of the report
  items: ReportItem[]; // Breakdown of report sections
  urgentAlerts?: UrgentAlert[]; // Alerts that might trigger events
  statChanges?: Partial<KingdomStats>; // Suggested stat changes from this report
}

export interface PlayerChoice {
  id: string;
  text: string;
  tooltip?: string; // Brief hint of outcome for player
}

export type AlertTypeStrings = 
  | "FOOD_SHORTAGE" 
  | "BANDIT_ACTIVITY" 
  | "DIPLOMATIC_ENVOY" 
  | "CITIZEN_UNREST" 
  | "RESOURCE_DISCOVERY" 
  | "TRADE_OPPORTUNITY"
  | "SCIENTIFIC_BREAKTHROUGH"
  | "NATURAL_DISASTER"
  | "BORDER_DISPUTE"
  | "PLAGUE_OUTBREAK"
  | "MERCHANT_GUILD_DEMANDS"
  | "CULTURAL_FESTIVAL_REQUEST"
  | "SPY_CAUGHT"
  | "FINANCE" // From dynamic alerts in geminiService
  | "SOCIAL"  // From dynamic alerts in geminiService
  | "DIPLOMATIC_OPPORTUNITY" // 새로 추가된 외교적 기회 이벤트
  | "ACKNOWLEDGE_ONLY_EVENT_TYPE_EXAMPLE"; // From mock event outcome

export interface UrgentAlert {
  id: string;
  title: string;
  description: string;
  location?: string; 
  choices?: PlayerChoice[];
  // Defines the type of alert, helps in processing player responses and generating outcomes.
  alertType: AlertTypeStrings;
}

export interface HistoricalDataPoint {
  day: number;
  gold: number;
  population: number;
  food: number;
  militaryStrength: number;
  citizenHappiness: number;
  publicOrder: number;
}

// For Gemini interaction
export interface GeneratedReportContent {
  reportSummary: string;
  reportItems: Array<{ title: string, text: string, category: ReportItemCategory }>;
  statChanges?: {
    gold?: number;
    food?: number;
    militaryStrength?: number;
    citizenHappiness?: number;
    publicOrder?: number;
    population?: number;
  };
  newAlerts?: Array<{
    title: string;
    description: string;
    alertType: UrgentAlert['alertType'];
    choices?: Array<{ id: string, text: string, tooltip?: string }>;
  }>;
  logEntry?: string;
}

export interface GeneratedEventOutcome {
    narrative: string;
    statChanges?: {
        gold?: number;
        food?: number;
        militaryStrength?: number;
        citizenHappiness?: number;
        publicOrder?: number;
        population?: number;
    };
    followUpAlert?: {
        title: string;
        description:string;
        alertType: UrgentAlert['alertType'];
        choices?: Array<{ id: string, text: string, tooltip?: string }>;
    };
    logEntry?: string;
}

export interface ActiveEvent extends UrgentAlert {
  // ActiveEvent inherits from UrgentAlert and adds any runtime specific properties if needed
}

// For saving and loading game state
export interface SavedGameState {
  kingdomStats: KingdomStats;
  reports: Report[];
  selectedReportId: string | null;
  activeEvent: ActiveEvent | null;
  edelweissGoal: EdelweissGoal;
  historicalData: HistoricalDataPoint[];
  isGameOver: boolean; // Added to save/load game over state
}
