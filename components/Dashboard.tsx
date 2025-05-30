import React, { useState, useEffect, useCallback, useRef } from 'react';
import { KingdomStats, Report, EdelweissGoal, ActiveEvent, PlayerChoice, HistoricalDataPoint, GeneratedReportContent, GeneratedEventOutcome, ReportType, ReportItemCategory, SavedGameState } from '../types';
import { INITIAL_KINGDOM_STATS, DEFAULT_EDELWEISS_GOAL, MAX_LOG_ENTRIES } from '../constants';
import StatsDisplay from './StatsDisplay';
import ReportView from './ReportView';
import EventModal from './EventModal';
import GoalSetter from './GoalSetter';
import MapView from './MapView';
import ChartComponent from './ChartComponent';
import LoadingSpinner from './LoadingSpinner';
import GameOverModal from './GameOverModal';
import { generateInitialReport, generatePeriodicReport, resolveEventChoice } from '../services/geminiService';
import { ScrollIcon } from './icons/ScrollIcon';
import { QuillIcon } from './icons/QuillIcon';
import { GameLogView } from './GameLogView';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import CombinedStatChart from './CombinedStatChart';


const GAME_STATE_KEY = 'royalScribeGameState_v1';

const selectBestChoiceForGoal = (choices: PlayerChoice[] | undefined, goal: EdelweissGoal): PlayerChoice => {
  if (!choices || choices.length === 0) {
    return { id: 'acknowledge_auto', text: '자동 확인' };
  }

  // 선택 전략 개선: 현재 왕국 상황을 고려한 선택
  const currentStats = window.localStorage.getItem('kingdomStats');
  let stats: KingdomStats | null = null;
  
  try {
    if (currentStats) {
      stats = JSON.parse(currentStats) as KingdomStats;
    }
  } catch (error) {
    console.error("상태 파싱 오류:", error);
  }

  // 긴급 상황 처리 플래그
  let isEmergency = false;
  let emergencyType = '';
  
  // 왕국 상태가 위급한지 확인
  if (stats) {
    if (stats.food < stats.population * 0.2) {
      isEmergency = true;
      emergencyType = '식량';
    } else if (stats.gold < 50) {
      isEmergency = true;
      emergencyType = '금';
    } else if (stats.militaryStrength < 10) {
      isEmergency = true;
      emergencyType = '군사력';
    } else if (stats.citizenHappiness < 25) {
      isEmergency = true;
      emergencyType = '행복도';
    } else if (stats.publicOrder < 25) {
      isEmergency = true;
      emergencyType = '공공질서';
    }
  }

  // 선택지 키워드 매핑 개선
  const keywords: Record<EdelweissGoal, string[]> = {
    [EdelweissGoal.CITIZEN_SATISFACTION]: ['행복도', '만족도', '민심', '백성', '인구'],
    [EdelweissGoal.MILITARY_STRENGTH]: ['군사력', '병력', '군대', '방어', '전투'],
    [EdelweissGoal.FINANCIAL_STABILITY]: ['금', '재정', '수입', '골드', '비용 절감', '예산', '자금'],
    [EdelweissGoal.BALANCED_GROWTH]: ['균형', '안정', '평화', '발전'],
  };

  // 긍정/부정 키워드 확장
  const positiveKeywords = ['상승', '증가', '획득', '개선', '안정', '성공', '강화', '이득', '회복', '발전', '보상', '구제', '지원'];
  const negativeKeywords = ['하락', '감소', '손실', '악화', '위험', '비용', '소모', '지출', '부담', '실패', '처벌', '위기', '약탈', '공격'];

  // 모든 선택지의 점수를 계산
  const choiceScores: { choice: PlayerChoice; score: number }[] = [];
  
  // 긴급 상황 관련 키워드
  const emergencyKeywords: Record<string, string[]> = {
    '식량': ['식량', '배급', '식료', '농사', '수확', '기근'],
    '금': ['금', '재정', '수입', '비용', '예산', '자금'],
    '군사력': ['군사력', '병력', '군대', '방어', '전투', '보호'],
    '행복도': ['행복도', '만족도', '민심', '백성'],
    '공공질서': ['질서', '평화', '안정', '법']
  };

  for (const choice of choices) {
    const searchText = `${choice.text} ${choice.tooltip || ''}`.toLowerCase();
    let score = 0;
    
    // 긴급 상황일 때 해당 자원 키워드가 있는 선택지 우선
    if (isEmergency && emergencyKeywords[emergencyType]) {
      for (const keyword of emergencyKeywords[emergencyType]) {
        if (searchText.includes(keyword)) {
          // 긍정적인 영향이 있는 경우 점수 크게 상승
          if (positiveKeywords.some(pk => searchText.includes(pk))) {
            score += 10;
          }
        }
      }
    }
    
    // 목표에 따른 키워드 점수 추가
    const goalKeywords = keywords[goal];
    if (goalKeywords.length > 0) {
      for (const kw of goalKeywords) {
        if (searchText.includes(kw)) {
          score += 3;
          // 긍정적 영향이 있으면 추가 점수
          if (positiveKeywords.some(pk => searchText.includes(pk))) {
            score += 2;
          }
        }
      }
    }
    
    // 일반적인 긍정/부정 키워드 영향
    positiveKeywords.forEach(kw => { if (searchText.includes(kw)) score += 1; });
    negativeKeywords.forEach(kw => { if (searchText.includes(kw)) score -= 1; });
    
    // 비용 대비 효과 고려
    if (searchText.includes('금') && /\-\d+/.test(searchText)) {
      const costMatch = searchText.match(/\-(\d+).*금/);
      if (costMatch && costMatch[1]) {
        const cost = parseInt(costMatch[1], 10);
        if (cost > 100) score -= 2; // 고비용 패널티
        else if (cost < 50) score += 1; // 저비용 보너스
      }
    }
    
    // 인구 손실 회피
    if (searchText.includes('인구') && searchText.includes('감소')) {
      score -= 3;
    }
    
    // 균형 성장 목표일 때는 과도한 변화 회피
    if (goal === EdelweissGoal.BALANCED_GROWTH) {
      if (searchText.includes('대규모') || searchText.includes('막대한')) {
        score -= 1;
      }
    }
    
    choiceScores.push({ choice, score });
  }
  
  // 점수로 정렬하고 최고 점수 선택
  choiceScores.sort((a, b) => b.score - a.score);
  
  // 최고 점수 선택지가 여러개면 랜덤 선택 (다양성 추가)
  const highestScore = choiceScores[0].score;
  const topChoices = choiceScores.filter(item => item.score === highestScore);
  
  if (topChoices.length > 1) {
    return topChoices[Math.floor(Math.random() * topChoices.length)].choice;
  }
  
  return choiceScores[0].choice;
};


const Dashboard: React.FC = () => {
  const [kingdomStats, setKingdomStats] = useState<KingdomStats>(INITIAL_KINGDOM_STATS);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [activeEvent, setActiveEvent] = useState<ActiveEvent | null>(null);
  const [edelweissGoal, setEdelweissGoal] = useState<EdelweissGoal>(DEFAULT_EDELWEISS_GOAL);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [apiKey] = useState(process.env.API_KEY || "MISSING_API_KEY");
  const [gameInitialized, setGameInitialized] = useState(false);
  const [isDelegating, setIsDelegating] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const delegationTimeoutRef = useRef<number | null>(null);


  const updateGameLog = useCallback((newEntry: string) => {
    setKingdomStats(prevStats => ({
      ...prevStats,
      gameLog: [newEntry, ...prevStats.gameLog].slice(0, MAX_LOG_ENTRIES)
    }));
  }, []);

  const applyStatChanges = useCallback((changes: Partial<KingdomStats>) => {
    setKingdomStats(prev => {
      const newStats = { ...prev };
      if (changes.gold !== undefined) newStats.gold = Math.max(0, prev.gold + changes.gold);
      if (changes.food !== undefined) newStats.food = Math.max(0, prev.food + changes.food);
      if (changes.militaryStrength !== undefined) newStats.militaryStrength = Math.max(0, prev.militaryStrength + changes.militaryStrength);
      if (changes.citizenHappiness !== undefined) newStats.citizenHappiness = Math.max(0, Math.min(100, prev.citizenHappiness + changes.citizenHappiness));
      if (changes.publicOrder !== undefined) newStats.publicOrder = Math.max(0, Math.min(100, prev.publicOrder + changes.publicOrder));
      if (changes.population !== undefined) newStats.population = Math.max(0, prev.population + changes.population);
      return newStats;
    });
  }, []);
  
  const processGeminiReport = useCallback((geminiData: GeneratedReportContent, reportType: ReportType) => {
    const newReport: Report = {
      id: `report-${Date.now()}`,
      date: `${kingdomStats.currentDay} 일차`,
      type: reportType,
      title: `${reportType} - ${kingdomStats.currentDay} 일차`,
      summary: geminiData.reportSummary,
      items: geminiData.reportItems.map(item => ({...item, chartData: [] })),
      statChanges: geminiData.statChanges,
    };

    if (geminiData.statChanges) {
      applyStatChanges(geminiData.statChanges);
    }
    if (geminiData.logEntry) {
      updateGameLog(geminiData.logEntry);
    }

    setReports(prev => [newReport, ...prev].slice(0, 5)); 
    setSelectedReport(newReport);

    if (geminiData.newAlerts && geminiData.newAlerts.length > 0 && !isGameOver) {
      const firstAlert = geminiData.newAlerts[0];
      setActiveEvent({
        id: `event-${Date.now()}`,
        title: firstAlert.title,
        description: firstAlert.description,
        alertType: firstAlert.alertType,
        choices: firstAlert.choices
      });
    }
  }, [kingdomStats.currentDay, applyStatChanges, updateGameLog, isGameOver]);

  const loadInitialReport = useCallback(async () => {
    if (apiKey === "MISSING_API_KEY") {
        updateGameLog("API 키가 없습니다. AI 기능을 사용할 수 없습니다.");
        // Still allow game to be playable with mock data if API key is missing after initial setup
        // So, don't return here if game is already initialized.
        // This check is more for the very first load.
        if (!gameInitialized) return; 
    }
    setIsLoading(true);
    try {
      // Pass initial stats to ensure the report reflects the actual starting state.
      const initialReportContent = await generateInitialReport(INITIAL_KINGDOM_STATS, edelweissGoal, apiKey);
      processGeminiReport(initialReportContent, ReportType.DAILY_ADMINISTRATION);
      updateGameLog("에델바이스가 첫 번째 왕실 보고서를 전달했습니다.");
    } catch (error) {
      console.error("초기 보고서 생성 실패:", error);
      updateGameLog(`오류: 왕실 서기관 에델바이스와 연락에 실패했습니다. ${error instanceof Error ? error.message : String(error)}`);
      const fallbackReport: Report = {
        id: 'fallback-initial',
        date: `${INITIAL_KINGDOM_STATS.currentDay} 일차`,
        type: ReportType.DAILY_ADMINISTRATION,
        title: '서기관 응답 없음 - 초기 평가',
        summary: '왕실 서기관 에델바이스와 연락이 두절된 것 같습니다. 기본적인 왕국 평가가 수동으로 준비되었습니다.',
        items: [{ title: '왕국 현황', text: '자원은 안정적입니다. 폐하의 명령을 기다립니다.', category: ReportItemCategory.OVERVIEW }],
      };
      setReports([fallbackReport]);
      setSelectedReport(fallbackReport);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, edelweissGoal, processGeminiReport, updateGameLog, gameInitialized]);


  const saveGameStateToLocalStorage = useCallback(() => {
    if (isGameOver && !reports.length) return; // Avoid saving an empty game over state if it's a fresh game over
    try {
      const stateToSave: SavedGameState = {
        kingdomStats,
        reports,
        selectedReportId: selectedReport ? selectedReport.id : null,
        activeEvent,
        edelweissGoal,
        historicalData,
        isGameOver, // Save game over state
      };
      localStorage.setItem(GAME_STATE_KEY, JSON.stringify(stateToSave));
      if (!isGameOver) { // Don't log saving if game is over, to keep game over message prominent
         setKingdomStats(prevStats => ({
            ...prevStats,
            gameLog: ["게임 상태가 성공적으로 자동 저장되었습니다.", ...prevStats.gameLog].slice(0, MAX_LOG_ENTRIES)
        }));
      }
    } catch (error) {
      console.error("게임 상태 저장 실패:", error);
       setKingdomStats(prevStats => ({
        ...prevStats,
        gameLog: ["오류: 게임 상태를 자동 저장하는 데 실패했습니다.", ...prevStats.gameLog].slice(0, MAX_LOG_ENTRIES)
      }));
    }
  }, [kingdomStats, reports, selectedReport, activeEvent, edelweissGoal, historicalData, isGameOver]);
  
  const loadGameStateFromLocalStorage = (): SavedGameState | null => {
    try {
      const savedStateJSON = localStorage.getItem(GAME_STATE_KEY);
      if (savedStateJSON) {
        return JSON.parse(savedStateJSON) as SavedGameState;
      }
    } catch (error)
     {
      console.error("저장된 게임 상태 불러오기 실패:", error);
      localStorage.removeItem(GAME_STATE_KEY); 
    }
    return null;
  };

  const handleRestartGame = useCallback(() => {
    localStorage.removeItem(GAME_STATE_KEY);
    setKingdomStats(INITIAL_KINGDOM_STATS);
    setReports([]);
    setSelectedReport(null);
    setActiveEvent(null);
    setEdelweissGoal(DEFAULT_EDELWEISS_GOAL);
    setHistoricalData([]);
    setIsGameOver(false);
    setIsDelegating(false);
    setGameInitialized(false); // This will trigger the initialization useEffect
    // updateGameLog("새로운 마음으로 왕국을 다시 시작합니다!"); // Log will be overwritten by initial report log
  }, []);
  
  useEffect(() => {
    if (gameInitialized) return;

    const loadedState = loadGameStateFromLocalStorage();
    if (loadedState) {
      setKingdomStats(loadedState.kingdomStats);
      setReports(loadedState.reports || []);
      
      if (loadedState.selectedReportId && loadedState.reports && loadedState.reports.length > 0) {
        const foundReport = loadedState.reports.find(r => r.id === loadedState.selectedReportId);
        setSelectedReport(foundReport || (loadedState.reports.length > 0 ? loadedState.reports[0] : null));
      } else if (loadedState.reports && loadedState.reports.length > 0) {
        setSelectedReport(loadedState.reports[0]);
      } else {
        setSelectedReport(null);
      }
      
      setActiveEvent(loadedState.isGameOver ? null : loadedState.activeEvent); // Don't load active event if game was over
      setEdelweissGoal(loadedState.edelweissGoal || DEFAULT_EDELWEISS_GOAL);
      setHistoricalData(loadedState.historicalData || []);
      setIsGameOver(loadedState.isGameOver || false);

      if (loadedState.isGameOver) {
        // Make sure the game log reflects the game over state if loaded
        if (!loadedState.kingdomStats.gameLog.some(log => log.startsWith("게임 오버"))) {
            updateGameLog("저장된 게임은 이미 종료된 상태입니다.");
        }
      } else {
        updateGameLog("저장된 게임을 성공적으로 불러왔습니다.");
      }
      setGameInitialized(true);
    } else {
      // No saved state, start fresh by calling loadInitialReport
      // Ensure kingdomStats are reset to initial before loading new report
      setKingdomStats(INITIAL_KINGDOM_STATS); 
      setReports([]);
      setSelectedReport(null);
      setActiveEvent(null);
      setEdelweissGoal(DEFAULT_EDELWEISS_GOAL);
      setHistoricalData([]);
      setIsGameOver(false);
      loadInitialReport().finally(() => {
        setGameInitialized(true);
      });
    }
  }, [gameInitialized, loadInitialReport, updateGameLog]); 


  useEffect(() => {
    if (!gameInitialized || isGameOver) return; // Don't record history if game over

    const currentDataPoint: HistoricalDataPoint = {
      day: kingdomStats.currentDay,
      gold: kingdomStats.gold,
      population: kingdomStats.population,
      food: kingdomStats.food,
      militaryStrength: kingdomStats.militaryStrength,
      citizenHappiness: kingdomStats.citizenHappiness,
      publicOrder: kingdomStats.publicOrder,
    };
    setHistoricalData(prev => {
        const existingIndex = prev.findIndex(p => p.day === currentDataPoint.day);
        if (existingIndex !== -1) {
            const updatedPrev = [...prev];
            updatedPrev[existingIndex] = currentDataPoint; 
            return updatedPrev;
        }
        return [...prev, currentDataPoint].slice(-30) // Keep last 30 days, or up to 30 for game over
    });
  }, [kingdomStats, gameInitialized, isGameOver]);

  // Game Over Check Effect
  useEffect(() => {
    if (!gameInitialized || isGameOver) return;

    const { gold, food, population, militaryStrength } = kingdomStats;
    let reason = "";

    if (population <= 0) {
      reason = "왕국의 모든 백성이 사라졌습니다...";
    } else if (food <= 0 && kingdomStats.citizenHappiness <= 10) {
      // 식량이 바닥나도 행복도가 아직 10 이상이면 즉시 게임 오버가 되지 않도록 조건 변경
      reason = "식량이 완전히 고갈되어 왕국이 굶주림에 휩싸였습니다...";
    } else if (militaryStrength <= 0 && kingdomStats.publicOrder <= 25) {
      // 군사력이 0이 되어도 공공질서가 25 이상이면 게임 오버가 되지 않도록 조건 변경
      reason = "군사력이 소멸하여 왕국을 지킬 힘이 없습니다...";
    } else if (gold <= -200 && kingdomStats.currentDay > 3) { // Gold -100 -> -200으로 더 완화, 초반 3일 간은 예외
      reason = "왕실 금고가 바닥나 국가 운영이 불가능해졌습니다...";
    }

    if (reason) {
      setIsGameOver(true);
      updateGameLog(`게임 오버: ${reason} 왕국의 통치가 막을 내렸습니다.`);
      if (delegationTimeoutRef.current) {
        clearTimeout(delegationTimeoutRef.current);
        delegationTimeoutRef.current = null;
      }
      setIsDelegating(false); 
    }
  }, [kingdomStats, gameInitialized, isGameOver, updateGameLog]);


  const handleAdvanceDay = useCallback(async () => {
    if (isLoading || activeEvent || isGameOver) return; 
    if (apiKey === "MISSING_API_KEY") {
        updateGameLog("다음 날로 진행할 수 없습니다: API 키가 없습니다.");
        if(isDelegating) setIsDelegating(false);
        return;
    }

    saveGameStateToLocalStorage(); 

    setIsLoading(true);
    updateGameLog(`${kingdomStats.currentDay} 일차 진행 중... 에델바이스가 보고서를 준비합니다.`);
    const nextDay = kingdomStats.currentDay + 1;
    
    // 식량 소비량을 8%에서 5%로 감소
    const foodConsumed = Math.floor(kingdomStats.population * 0.05); 
    
    // 기본 세금 수입 추가 (인구에 비례)
    const taxIncome = Math.floor(kingdomStats.population * 0.02) + 30; // 인구 1000명 기준 약 50골드의 기본 수입
    
    let updatedStatsBase = { 
      ...kingdomStats, 
      currentDay: nextDay, 
      food: Math.max(0, kingdomStats.food - foodConsumed),
      gold: kingdomStats.gold + taxIncome // 기본 세금 수입 추가
    };
    
    let dayLogEntries: string[] = [];

    if (updatedStatsBase.food === 0 && kingdomStats.food > 0) { // Check if food just ran out
      updatedStatsBase.citizenHappiness = Math.max(0, updatedStatsBase.citizenHappiness - 10);
      dayLogEntries.push(`${nextDay} 일차: 식량이 바닥났습니다! 백성들이 굶주리고 있습니다. 행복도가 감소했습니다.`);
    } else {
       dayLogEntries.push(`${nextDay} 일차: 엘도리아에 새로운 날이 밝았습니다. 식량 소비: ${foodConsumed}. 세금 수입: ${taxIncome} 골드.`);
    }
    
    setKingdomStats(prev => {
        const newLog = [...dayLogEntries, ...prev.gameLog].slice(0, MAX_LOG_ENTRIES);
        return {...updatedStatsBase, gameLog: newLog};
    });

    try {
      const reportContent = await generatePeriodicReport(updatedStatsBase, edelweissGoal, reports[0], apiKey);
      processGeminiReport(reportContent, ReportType.DAILY_ADMINISTRATION); 
    } catch (error) {
      console.error("정기 보고서 생성 실패:", error);
      updateGameLog(`오류: 에델바이스가 ${nextDay} 일차 보고서 작성에 어려움을 겪고 있습니다. ${error instanceof Error ? error.message : String(error)}`);
       const fallbackReport: Report = {
        id: `fallback-${nextDay}`,
        date: `${nextDay} 일차`,
        type: ReportType.DAILY_ADMINISTRATION,
        title: `서기관 통신 장애 - ${nextDay} 일차`,
        summary: '왕실 서기관 에델바이스와의 통신이 원활하지 않습니다. 필수적인 업데이트만 제공됩니다.',
        items: [{ title: '왕국 현황', text: `${nextDay} 일차 기본 자원 현황입니다. 폐하의 추가 지시를 기다립니다.`, category: ReportItemCategory.OVERVIEW }],
      };
      setReports(prev => [fallbackReport, ...prev].slice(0,5));
      setSelectedReport(fallbackReport);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, activeEvent, kingdomStats, edelweissGoal, reports, processGeminiReport, apiKey, updateGameLog, saveGameStateToLocalStorage, isDelegating, isGameOver]);

  const handleResolveEvent = useCallback(async (choice: PlayerChoice) => {
    if (!activeEvent || isGameOver) return;
     if (apiKey === "MISSING_API_KEY") {
        updateGameLog(`이벤트 ${activeEvent.title} 해결 불가: API 키가 없습니다.`);
        setActiveEvent(null);
        if(isDelegating) setIsDelegating(false);
        return;
    }

    setIsLoading(true);
    updateGameLog(`이벤트 "${activeEvent.title}"에 대해 "${choice.text}" 결정을 내리는 중...`);
    try {
      const outcome: GeneratedEventOutcome = await resolveEventChoice(kingdomStats, activeEvent, choice, apiKey);
      updateGameLog(outcome.logEntry || `이벤트 결정: ${activeEvent.title}. 결과: ${outcome.narrative}`);
      if (outcome.statChanges) {
        applyStatChanges(outcome.statChanges);
      }
      if(outcome.followUpAlert && !isGameOver){ // Don't trigger follow-up if game is already over
         setActiveEvent({
            id: `event-${Date.now()}-followup`,
            title: outcome.followUpAlert.title,
            description: outcome.followUpAlert.description,
            alertType: outcome.followUpAlert.alertType,
            choices: outcome.followUpAlert.choices
         });
      } else {
        setActiveEvent(null);
      }
    } catch (error) {
      console.error("이벤트 해결 실패:", error);
      updateGameLog(`오류: ${activeEvent.title}에 대한 결정 처리 중 오류 발생. 상황이 불분명합니다. ${error instanceof Error ? error.message : String(error)}`);
      setActiveEvent(null); 
    } finally {
      setIsLoading(false);
    }
  }, [activeEvent, kingdomStats, applyStatChanges, apiKey, updateGameLog, isDelegating, isGameOver]);

  const handleAutoResolveEvent = useCallback(async () => {
    if (!activeEvent || isLoading || !isDelegating || isGameOver) return;
    
    const bestChoice = selectBestChoiceForGoal(activeEvent.choices, edelweissGoal);
    updateGameLog(`위임 모드: 이벤트 "${activeEvent.title}" 자동 해결 위해 "${bestChoice.text}" 선택.`);
    await handleResolveEvent(bestChoice);

  }, [activeEvent, isLoading, isDelegating, edelweissGoal, handleResolveEvent, updateGameLog, isGameOver]);


  useEffect(() => {
    if (isGameOver || !isDelegating || isLoading || apiKey === "MISSING_API_KEY") {
      if (delegationTimeoutRef.current) {
        clearTimeout(delegationTimeoutRef.current);
        delegationTimeoutRef.current = null;
      }
      if (apiKey === "MISSING_API_KEY" && isDelegating && !isGameOver) {
        setIsDelegating(false); 
      }
      return;
    }

    if (delegationTimeoutRef.current) { 
      clearTimeout(delegationTimeoutRef.current);
    }
    if (activeEvent) {
      delegationTimeoutRef.current = window.setTimeout(
        handleAutoResolveEvent,
        1500 
      );
    } else {
      delegationTimeoutRef.current = window.setTimeout(
        handleAdvanceDay,
        1000 
      );
    }
    
    return () => {
      if (delegationTimeoutRef.current) {
        clearTimeout(delegationTimeoutRef.current);
        delegationTimeoutRef.current = null; 
      }
    };
  }, [isDelegating, isLoading, activeEvent, apiKey, handleAdvanceDay, handleAutoResolveEvent, isGameOver]);


  const toggleDelegation = () => {
    if (isGameOver) return;
    if (apiKey === "MISSING_API_KEY") {
      updateGameLog("API 키가 없어 위임 모드를 사용할 수 없습니다.");
      return;
    }
    const newDelegationState = !isDelegating;
    setIsDelegating(newDelegationState);
    if (newDelegationState) {
      updateGameLog("위임 모드가 활성화되었습니다. AI가 자동으로 왕국을 운영합니다.");
    } else {
      updateGameLog("위임 모드가 비활성화되었습니다. 폐하의 직접 통치가 재개됩니다.");
    }
  };


  if (apiKey === "MISSING_API_KEY" && !gameInitialized && !isLoading && !isGameOver) {
    return (
      <div className="bg-parchment p-6 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-seal-DEFAULT mb-3">왕실 기록 보관소 접근 불가</h2>
        <p className="text-ink-DEFAULT">
          존경하는 폐하, 왕실 서기관 에델바이스와의 연결을 설정할 수 없는 것 같습니다.
          이는 <strong className="text-seal-dark">제미니의 비전 열쇠</strong>(API 키) 문제일 가능성이 높습니다.
        </p>
        <p className="mt-2 text-ink-light">
          왕국의 서기관 중계기(환경 변수 <code className="bg-ink-light text-parchment px-1 rounded text-xs">process.env.API_KEY</code>)가 올바르게 설정되었는지 확인해 주십시오.
          이것 없이는 에델바이스가 중요한 보고서를 전달할 수 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
      {isLoading && <LoadingSpinner />}
      {activeEvent && !isGameOver && <EventModal event={activeEvent} onResolve={handleResolveEvent} isDisabled={isGameOver} />}
      {isGameOver && <GameOverModal onRestart={handleRestartGame} gameOverMessage={kingdomStats.gameLog[0]} historicalData={historicalData} currentDay={kingdomStats.currentDay} />}

      <div className="lg:col-span-1 space-y-6">
        <div className="bg-parchment-dark p-4 rounded-lg shadow-md space-y-3">
          <button
            onClick={handleAdvanceDay}
            disabled={isLoading || !!activeEvent || isDelegating || apiKey === "MISSING_API_KEY" || isGameOver}
            style={{backgroundColor: '#4A3B31'}}
            className="w-full !bg-ink-DEFAULT text-parchment font-display py-3 px-4 rounded-lg shadow-md transition-colors duration-150 ease-in-out hover:bg-ink-light disabled:bg-ink-light disabled:text-parchment/70 disabled:cursor-not-allowed flex items-center justify-center text-lg"
            aria-label={isGameOver ? "게임 오버" : (isDelegating ? "위임 모드 진행 중..." : "다음 날로 진행하고 보고서를 받으며, 현재 상태를 자동 저장합니다.")}
          >
            <QuillIcon className={`w-5 h-5 mr-2 ${isDelegating && !isGameOver ? 'text-parchment' : 'text-parchment'}`}/>
            {isDelegating && !isGameOver ? "위임 모드 진행 중..." : "다음 날로 진행 및 보고서 받기"}
          </button>
          
          <label htmlFor="delegation-toggle" className={`flex items-center justify-between p-3 rounded-md shadow-sm transition-colors ${isDelegating && !isGameOver ? 'bg-seal-DEFAULT hover:bg-seal-dark' : 'bg-parchment hover:bg-parchment/80'} ${isGameOver || apiKey === "MISSING_API_KEY" ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            title={isGameOver ? "게임 오버" : (apiKey === "MISSING_API_KEY" ? "API 키가 없어 위임 모드를 사용할 수 없습니다." : (isDelegating ? "위임 모드 활성 중" : "위임 모드 비활성"))}
          >
            <div className="flex items-center">
              {isDelegating && !isGameOver ? <PlayIcon className="w-5 h-5 mr-2 text-parchment" /> : <PauseIcon className="w-5 h-5 mr-2 text-red-600" />}
              <span className={`text-sm font-medium ${isDelegating && !isGameOver ? 'text-parchment' : (apiKey !== "MISSING_API_KEY" && !isGameOver ? 'text-red-700' : 'text-gray-500')}`}>
                {isGameOver ? "게임 종료됨" : (isDelegating ? '위임 모드 활성' : '위임 모드 비활성')}
              </span>
            </div>
            <div className="relative">
              <input 
                type="checkbox" 
                id="delegation-toggle" 
                className="sr-only" 
                checked={isDelegating && !isGameOver} 
                onChange={toggleDelegation} 
                disabled={isLoading || apiKey === "MISSING_API_KEY" || isGameOver}
              />
              <div className={`block w-12 h-6 rounded-full transition-colors ${isDelegating && apiKey !== "MISSING_API_KEY" && !isGameOver ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isDelegating && apiKey !== "MISSING_API_KEY" && !isGameOver ? 'transform translate-x-6' : ''}`}></div>
            </div>
          </label>
           {apiKey === "MISSING_API_KEY" && !isGameOver && <p className="text-xs text-red-600 text-center">API 키가 없어 위임 모드를 사용할 수 없습니다.</p>}
        </div>
        <StatsDisplay stats={kingdomStats} />
        <GoalSetter currentGoal={edelweissGoal} onSetGoal={setEdelweissGoal} isDisabled={isGameOver} />
        <MapView territories={kingdomStats.territories} />
        <GameLogView logEntries={kingdomStats.gameLog} />
      </div>

      <div className="lg:col-span-2 space-y-6">
        <ReportView
          reports={reports}
          selectedReport={selectedReport}
          onSelectReport={setSelectedReport}
          isDisabled={isGameOver}
        />

        {selectedReport && historicalData.length > 1 && !isGameOver && (
          <div className="bg-parchment-dark p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-display text-ink-DEFAULT mb-1">왕국 동향 (최근 30일)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <ChartComponent 
                data={historicalData} 
                dataKey="citizenHappiness" 
                title="백성 행복도" 
                color="#22c55e" 
              />
              <CombinedStatChart
                data={historicalData}
                title="주요 지표 동향"
              />
            </div>
          </div>
        )}
         {!selectedReport && !isLoading && reports.length === 0 && gameInitialized && !isGameOver && (
            <div className="bg-parchment-dark p-6 rounded-lg shadow-md text-center">
                <ScrollIcon className="w-16 h-16 mx-auto text-ink-light mb-4"/>
                <h3 className="text-2xl font-display text-ink-DEFAULT mb-2">에델바이스의 소식을 기다리는 중</h3>
                <p className="text-ink-light">왕실 서기관이 첫 보고서를 준비하고 있습니다. 잠시만 기다려 주십시오, 폐하.</p>
            </div>
        )}
        {isGameOver && (
             <div className="bg-parchment-dark p-6 rounded-lg shadow-md text-center">
                <ScrollIcon className="w-16 h-16 mx-auto text-ink-light mb-4 opacity-50"/>
                <h3 className="text-2xl font-display text-red-700 mb-2">왕국의 연대기는 여기서 끝납니다</h3>
                <p className="text-ink-light">새로운 역사를 시작하려면 상단의 게임 오버 창에서 '새로운 역사 시작하기'를 선택하십시오.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;