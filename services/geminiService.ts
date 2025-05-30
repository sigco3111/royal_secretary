import { KingdomStats, EdelweissGoal, Report, PlayerChoice, ActiveEvent, GeneratedReportContent, GeneratedEventOutcome, ReportItemCategory, Territory, UrgentAlert } from '../types';
// import { GEMINI_MODEL_TEXT } from '../constants'; // No longer needed for mock data
import { INITIAL_KINGDOM_STATS } from '../constants'; // Used for some mock data generation

// --- Mock Data Definitions ---

const generateMockTerritories = (): Territory[] => [
    { id: 'eldoria_city', name: '엘도리아 시 (수도)', population: 450, description: "왕국의 심장부, 활기차지만 요구 사항도 많습니다." },
    { id: 'north_farms', name: '북부 농경지', population: 320, description: "비옥한 땅, 왕국의 주요 식량 공급원입니다." },
    { id: 'south_mines', name: '남부 광산 지대', population: 130, description: "귀중한 광물이 매장되어 있으나, 작업 환경이 위험합니다." },
    { id: 'west_forest', name: '서부 삼림 지대', population: 80, hasBandits: true, description: "울창한 숲, 목재 자원이 풍부하지만 산적들이 출몰합니다." },
    { id: 'east_trade', name: '동부 교역로', population: 60, description: "이웃 나라와의 교역이 이루어지는 중요한 길목입니다." },
    { id: 'whispering_hills', name: '속삭이는 언덕', population: 40, description: "신비로운 기운이 감도는 언덕, 고대 유적이 있다는 소문이 있습니다." },
    { id: 'frozen_peaks', name: '얼어붙은 봉우리', population: 10, description: "혹독한 환경의 산맥, 희귀 광물이 발견될 가능성이 있습니다."},
];

const getMockInitialReport = (stats: KingdomStats, goal: EdelweissGoal): GeneratedReportContent => ({
  reportSummary: `폐하, 엘도리아 왕국에 오신 것을 환영합니다. 새로운 시대가 밝았습니다! 현재 왕국은 ${stats.gold} 골드, ${stats.food} 식량, ${stats.population} 인구를 보유하고 있으며, 백성들의 행복도는 ${stats.citizenHappiness}% 입니다. 폐하의 목표이신 "${goal}"을 향해 나아갈 준비가 되었습니다. 초기 정세를 살피시고 위대한 왕국 건설의 첫걸음을 내딛으소서. 모든 영토가 폐하의 현명한 통치를 기다리고 있습니다.`,
  reportItems: [
    { title: "왕실 금고 현황", text: `현재 왕실 금고에는 ${stats.gold} 골드가 비축되어 있습니다. 이는 왕국의 초기 운영 및 발전에 사용될 귀중한 자산입니다. 현명하게 사용하소서.`, category: ReportItemCategory.FINANCE },
    { title: "식량 비축 상황", text: `식량 창고에는 ${stats.food} 단위의 식량이 보관되어 있습니다. 현재 인구 ${stats.population}명을 고려할 때, 단기적으로는 안정적이나 지속적인 수급 관리가 중요합니다.`, category: ReportItemCategory.RESOURCES },
    { title: "백성들의 목소리", text: `새로운 통치에 대한 백성들의 기대감이 높습니다. 전반적인 행복도는 ${stats.citizenHappiness}%로 양호한 편이지만, 일부 지역에서는 소소한 불만의 목소리도 들려오고 있습니다.`, category: ReportItemCategory.SOCIAL },
    { title: "군사력 보고", text: `왕국의 군사력은 현재 ${stats.militaryStrength} 수준입니다. 수도 방위대는 충성스럽지만, 국경 방어를 위해서는 추가적인 병력 증강이 필요할 수 있습니다.`, category: ReportItemCategory.MILITARY },
    { title: "영토 개관", text: `엘도리아는 수도를 포함하여 여러 영토로 구성되어 있습니다. 각 영토는 고유한 특성과 잠재력을 지니고 있으며, 균형 있는 발전이 요구됩니다.`, category: ReportItemCategory.OVERVIEW },
  ],
  newAlerts: INITIAL_KINGDOM_STATS.territories.find(t => t.id === 'west_forest' && t.hasBandits) ? [
    {
      title: "서부 삼림의 산적 출몰",
      description: "서부 삼림지대에 산적들이 나타나 행인들을 약탈하고 교역로를 위협하고 있다는 보고가 들어왔습니다. 이들을 방치하면 왕국의 질서와 경제에 악영향을 미칠 수 있습니다.",
      alertType: "BANDIT_ACTIVITY",
      choices: [
        { id: "dispatch_troops_bandits", text: "군대를 파견하여 토벌한다.", tooltip: "산적을 소탕하고 질서를 회복합니다. (비용과 병력 손실 가능성)" },
        { id: "pay_off_bandits", text: "협상가를 보내 매수한다.", tooltip: "금으로 임시적인 평화를 삽니다. (많은 금 소모)" },
        { id: "ignore_bandits", text: "일단 상황을 주시한다.", tooltip: "문제를 방치합니다. (행복도 및 질서 하락 위험)" }
      ]
    }
  ] : [],
  logEntry: "에델바이스가 새로운 국왕 폐하께 왕국의 초기 종합 보고서를 제출했습니다."
});

const mockPeriodicReports: ((stats: KingdomStats, goal: EdelweissGoal) => GeneratedReportContent)[] = [
  // Report 1 (Balance adjusted)
  (stats, goal) => ({
    reportSummary: `제 ${stats.currentDay}일차 보고입니다, 폐하. 오늘은 세금 징수가 순조롭게 이루어졌고, 북부 농경지에서는 풍작이 예상됩니다. 백성들의 생활은 대체로 평온합니다. "${goal}" 목표에 따라 자원 배분에 신경 쓰고 있습니다.`,
    reportItems: [
      { title: "일일 세금 수입", text: `금일 국고로 ${Math.floor(stats.population * 0.02) + 30} 골드가 징수되었습니다. 재정 안정에 기여할 것입니다.`, category: ReportItemCategory.FINANCE },
      { title: "농업 생산량 예측", text: "북부 농경지의 작황이 좋아, 다음 수확기에 150 단위의 식량 증가가 예상됩니다.", category: ReportItemCategory.AGRICULTURE },
      { title: "수도 치안 보고", text: "수도 엘도리아 시의 치안은 안정적이며, 백성들은 밤낮으로 안전하게 생활하고 있습니다.", category: ReportItemCategory.INTERNAL_AFFAIRS },
    ],
    statChanges: { food: 30, citizenHappiness: 1, publicOrder: 1 }, // 식량 소비는 Dashboard.tsx에서 이미 처리됨, 추가 보상으로 식량 30 추가
    logEntry: `${stats.currentDay}일차: 세금 수입. 북부 농경지에서 작은 풍작 (+30 식량). 백성들의 사기가 소폭 상승했습니다.`
  }),
  // Report 2 (Balance adjusted)
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 보고입니다. 동부 교역로에서 소규모 상단이 도착하여 무역이 활성화될 조짐이 보입니다. 다만, 남부 광산 지대에서 광부들의 불만이 접수되었습니다. "${goal}" 목표 달성을 위해 자원 분배에 유의하고 있습니다.`,
    reportItems: [
      { title: "교역 활성화 조짐", text: "동부 교역로를 통해 소규모 상단이 도착했습니다. 향후 교역량이 증가할 것으로 기대됩니다.", category: ReportItemCategory.TRADE },
      { title: "광산 지대 불만", text: "남부 광산의 열악한 작업 환경에 대한 광부들의 불만이 제기되었습니다. 조치가 필요할 수 있습니다.", category: ReportItemCategory.SOCIAL },
      { title: "군사 훈련 진행", text: "수도 방위군의 정기 훈련이 계획대로 진행되어 군사력이 소폭 증강되었습니다.", category: ReportItemCategory.MILITARY },
    ],
    statChanges: { gold: 40, militaryStrength: 2, citizenHappiness: -1, food: 20 }, // 금 증가 및 식량 추가
    newAlerts: Math.random() < 0.2 ? [{ 
        title: "희귀품 교역 제안",
        description: "한 외국 상인이 희귀한 장신구를 대량의 식량과 교환하자고 제안해왔습니다. 어떻게 하시겠습니까?",
        alertType: "TRADE_OPPORTUNITY" as UrgentAlert['alertType'],
        choices: [
            { id: "accept_trade_rare", text: "교역을 수락한다 (식량 +300, 금 -100)", tooltip:"식량을 확보하고 금을 지불합니다."}, // 식량 보상 증가
            { id: "decline_trade_rare", text: "제안을 거절한다", tooltip:"현상 유지."},
        ]
    }] : [],
    logEntry: `${stats.currentDay}일차: 교역로 활기 (+40 금). 광산 불만 접수. 군사 훈련 실시. 추가 식량 획득 (+20).`
  }),
  // Report 3 (Balance adjusted)
  (stats, goal) => ({
    reportSummary: `존경하는 폐하, ${stats.currentDay}일차 보고입니다. 최근 잦은 비로 인해 북부 농경지 일부가 침수되어 식량 생산에 차질이 우려됩니다. 백성들 사이에서는 작은 소문들이 돌고 있습니다. "${goal}" 목표에 따라 위기 관리에 힘쓰겠습니다.`,
    reportItems: [
      { title: "농경지 침수 피해", text: "잦은 강우로 북부 농경지 일부가 침수되어, 이번 수확량이 약 30% 감소할 것으로 예상됩니다.", category: ReportItemCategory.AGRICULTURE },
      { title: "민심 동요", text: "흉흉한 소문과 함께 백성들의 행복도가 소폭 하락했습니다. 민심을 다독일 방안이 필요합니다.", category: ReportItemCategory.SOCIAL },
      { title: "긴급 자금 확보", text: "비상 상황에 대비하여 예비 자금 50 골드를 확보했습니다.", category: ReportItemCategory.FINANCE },
    ],
    statChanges: { food: -30, citizenHappiness: -3, gold: 50 }, // 식량 손실 완화, 금 증가
    newAlerts: stats.food < stats.population * 0.3 ? [{ // 더 낮은 기준점
        title: "식량 부족 심화",
        description: "계속되는 흉작과 재해로 인해 왕국의 식량 비축량이 위험 수준으로 떨어졌습니다. 즉각적인 대처가 없다면 대규모 기근이 발생할 수 있습니다!",
        alertType: "FOOD_SHORTAGE" as UrgentAlert['alertType'],
        choices: [
            { id: "import_food_emergency", text: "긴급 식량 수입 (-150 금, 식량 +400)", tooltip:"국고를 소모해 외국에서 식량을 들여옵니다."}, // 비용 감소, 보상 증가
            { id: "ration_food", text: "식량 배급 통제 (행복도 -10, 식량 소모 감소)", tooltip:"백성들의 불만을 감수하고 식량 소비를 줄입니다."},
        ]
    }] : [],
    logEntry: `${stats.currentDay}일차: 농경지 침수 (-30 식량). 민심 하락. 비상 자금 확보 (+50 금).`
  }),
  // Report 4: Military Focus
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 군사 보고입니다. 최근 국경 순찰 중 이웃 왕국과의 작은 마찰이 있었습니다. 또한, 새로운 훈련 방식 도입으로 병사들의 사기가 높습니다. "${goal}" 목표에 따라 국방력 강화에 힘쓰고 있습니다.`,
    reportItems: [
      { title: "국경 마찰 보고", text: "동부 국경에서 이웃 왕국 순찰대와 작은 충돌이 있었으나, 외교적으로 해결되었습니다. 경계 강화가 필요합니다.", category: ReportItemCategory.MILITARY },
      { title: "신규 훈련 성과", text: "새로운 검술 훈련 도입으로 병사들의 전투 기술이 향상되었습니다.", category: ReportItemCategory.MILITARY },
      { title: "무기 제작 현황", text: "대장간에서 표준 무기 20세트 생산이 완료되었습니다.", category: ReportItemCategory.RESOURCES },
    ],
    statChanges: { militaryStrength: 3, gold: -30, publicOrder: -1 },
    newAlerts: Math.random() < 0.15 ? [{
      title: "국경 침입 경고",
      description: "정찰병으로부터 동부 국경 너머에서 미확인 병력의 움직임이 포착되었다는 긴급 보고입니다. 단순 정찰일 수도 있으나, 침공의 전조일 가능성도 배제할 수 없습니다.",
      alertType: "BORDER_DISPUTE" as UrgentAlert['alertType'],
      choices: [
        { id: "reinforce_border", text: "국경 수비대 증원 (-50 금, +5 군사력)", tooltip:"국경 방어를 강화합니다."},
        { id: "send_diplomat_border", text: "외교관을 파견하여 의도 파악 (-20 금)", tooltip:"평화적 해결을 시도합니다."},
        { id: "prepare_for_war", text: "전쟁 준비 태세 돌입 (-100 금, +10 군사력, -5 행복도)", tooltip:"최악의 상황에 대비합니다."}
      ]
    }] : [],
    logEntry: `${stats.currentDay}일차: 국경 긴장 고조. 군사 훈련 성과. 무기 생산 완료.`
  }),
  // Report 5: Economic Boom
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 경제 보고입니다. 새로운 교역로가 개척되어 막대한 부가 유입되고 있습니다! 상인 조합은 축제를 열자고 제안하고 있습니다. "${goal}" 목표 달성에 청신호입니다.`,
    reportItems: [
      { title: "신규 교역로 수익", text: "서쪽 바다 건너 새로운 교역로에서 첫 번째 상단이 도착하여 200 골드의 순이익을 가져왔습니다.", category: ReportItemCategory.TRADE },
      { title: "시장 활성화", text: "수도 시장이 그 어느 때보다 활기찹니다. 다양한 상품이 거래되고 있습니다.", category: ReportItemCategory.ECONOMY },
      { title: "상인 조합의 제안", text: "상인 조합에서 왕국의 번영을 축하하는 대규모 축제를 제안했습니다.", category: ReportItemCategory.SOCIAL },
    ],
    statChanges: { gold: 150, citizenHappiness: 5, food: -Math.floor(stats.population * 0.12) }, // Increased food consumption due to prosperity
     newAlerts: Math.random() < 0.3 ? [{
      title: "번영 축제 개최 제안",
      description: "상인 조합에서 왕국의 최근 번영을 기념하고 백성들의 사기를 높이기 위해 대규모 축제를 개최할 것을 공식적으로 제안했습니다. 축제에는 상당한 비용이 소요되지만, 백성들의 행복도를 크게 높일 수 있습니다.",
      alertType: "CULTURAL_FESTIVAL_REQUEST" as UrgentAlert['alertType'],
      choices: [
        { id: "approve_festival_grand", text: "성대한 축제를 승인한다 (-150 금, +15 행복도)", tooltip:"큰 비용으로 최대의 효과를 노립니다."},
        { id: "approve_festival_modest", text: "검소한 축제를 승인한다 (-70 금, +7 행복도)", tooltip:"적당한 비용으로 축제를 개최합니다."},
        { id: "reject_festival", text: "축제 제안을 거절한다 (-3 행복도)", tooltip:"비용을 절약하지만, 실망감을 줄 수 있습니다."}
      ]
    }] : [],
    logEntry: `${stats.currentDay}일차: 교역 대성공! (+200금). 시장 활기. 축제 제안 접수.`
  }),
  // Report 6: Social Unrest
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 사회 동향 보고입니다. 최근 시행된 세금 인상안에 대한 백성들의 불만이 커지고 있습니다. 일부 지역에서는 시위 조짐도 보입니다. "${goal}"을 추구하는 과정에서 민심을 잃지 않도록 주의해야 합니다.`,
    reportItems: [
      { title: "세금 인상 반발", text: "새로운 세금 정책에 대한 반발로 일부 시민들이 공개적으로 불만을 표출하고 있습니다.", category: ReportItemCategory.SOCIAL },
      { title: "유언비어 확산", text: "수도 내에 왕실에 대한 악의적인 유언비어가 퍼지고 있어 공공질서를 해치고 있습니다.", category: ReportItemCategory.INTERNAL_AFFAIRS },
      { title: "식량 가격 상승", text: "최근 흉작의 여파로 시장의 식량 가격이 상승하여 저소득층의 부담이 커지고 있습니다.", category: ReportItemCategory.ECONOMY },
    ],
    statChanges: { citizenHappiness: -7, publicOrder: -5, food: -Math.floor(stats.population * 0.09) },
    newAlerts: [{
        title: "시민 불만 폭발 직전",
        description: "세금 인상과 생활고에 지친 백성들의 분노가 극에 달했습니다. 이대로 방치하면 대규모 폭동으로 번질 수 있습니다!",
        alertType: "CITIZEN_UNREST" as UrgentAlert['alertType'],
        choices: [
            { id: "lower_taxes_temp", text: "일시적으로 세금을 인하한다. (-100 금, +10 행복도, +5 질서)", tooltip:"재정 손실을 감수하고 민심을 수습합니다."},
            { id: "promise_reforms", text: "개혁을 약속하고 시간을 번다. (+3 행복도, -3 질서)", tooltip:"구체적인 행동 없이 말로 달랩니다. 효과는 미지수."},
            { id: "forceful_suppression", text: "주동자를 체포하고 강경 진압한다. (+10 질서, -15 행복도, 군사력 -5)", tooltip:"공포로 질서를 잡으려 하지만, 더 큰 반발을 살 수 있습니다."}
        ]
    }],
    logEntry: `${stats.currentDay}일차: 세금 인상 반발 심화. 유언비어 확산. 민심 불안.`
  }),
   // Report 7: Scientific Breakthrough
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 기술 보고입니다. 왕립 학자들이 새로운 농업 기술을 개발하여 식량 생산량을 크게 늘릴 수 있는 가능성을 발견했습니다! 이 기술의 상용화에는 투자가 필요합니다. "${goal}" 목표와 왕국의 미래에 큰 영향을 줄 수 있습니다.`,
    reportItems: [
      { title: "신기술 개발 성공", text: "왕립 학자들이 다년간의 연구 끝에 '마법 강화 비료' 제조법을 개발했습니다. 이는 토지 생산성을 50%까지 향상시킬 수 있습니다.", category: ReportItemCategory.AGRICULTURE },
      { title: "상용화 비용", text: "이 기술을 왕국 전체 농경지에 적용하기 위해서는 초기 시설 투자 및 교육에 약 250골드가 필요합니다.", category: ReportItemCategory.FINANCE },
      { title: "학자들의 요청", text: "학자들은 연구 지속 및 추가 기술 개발을 위한 연구 자금 지원을 간청하고 있습니다.", category: ReportItemCategory.SOCIAL },
    ],
    statChanges: { gold: 10, food: -Math.floor(stats.population * 0.1) }, // Small gold for patent or initial findings
    newAlerts: [{
        title: "신기술 투자 결정",
        description: "왕립 학자들이 개발한 '마법 강화 비료' 기술에 투자하여 왕국의 농업 생산성을 혁신하시겠습니까? 막대한 초기 비용이 들지만, 장기적으로 식량 문제를 해결할 열쇠가 될 수 있습니다.",
        alertType: "SCIENTIFIC_BREAKTHROUGH" as UrgentAlert['alertType'],
        choices: [
            { id: "invest_new_tech_full", text: "전폭적으로 투자한다 (-250 금, 향후 식량 생산 대폭 증가)", tooltip:"미래를 위한 과감한 투자."},
            { id: "invest_new_tech_partial", text: "부분적으로 시범 도입한다 (-100 금, 향후 식량 생산 소폭 증가)", tooltip:"효과를 검증하며 점진적으로 도입합니다."},
            { id: "reject_new_tech", text: "투자를 보류한다 (기회 상실)", tooltip:"현재 재정 상황을 고려하여 투자를 미룹니다."}
        ]
    }],
    logEntry: `${stats.currentDay}일차: 혁신적인 농업 기술 개발! 투자 결정 필요.`
  }),
  // Report 8: Natural Disaster - Earthquake
  (stats, goal) => ({
    reportSummary: `폐하! ${stats.currentDay}일차 긴급 보고입니다. 오늘 새벽, 남부 광산 지대를 중심으로 강력한 지진이 발생했습니다! 인명 피해와 건물 붕괴가 보고되고 있으며, 여진의 공포가 계속되고 있습니다. "${goal}" 목표 달성에 큰 차질이 예상됩니다.`,
    reportItems: [
      { title: "지진 발생 및 피해", text: "남부 광산 지대에 진도 5의 강진이 발생하여 광산 일부가 붕괴되고 주택 다수가 파손되었습니다. 최소 50명의 사상자가 발생한 것으로 추정됩니다.", category: ReportItemCategory.INTERNAL_AFFAIRS },
      { title: "구호 작업 필요", text: "생존자 수색 및 부상자 치료, 이재민을 위한 임시 거처와 식량 공급이 시급합니다.", category: ReportItemCategory.RESOURCES },
      { title: "광산 생산 중단", text: "남부 광산의 모든 작업이 중단되었습니다. 복구에는 상당한 시간과 비용이 소요될 것입니다.", category: ReportItemCategory.ECONOMY },
    ],
    statChanges: { population: -50, gold: -20, food: -Math.floor(stats.population * 0.15), publicOrder: -15, citizenHappiness: -20, militaryStrength: -5 }, // Military used for rescue
    newAlerts: [{
        title: "지진 피해 복구",
        description: "강력한 지진이 남부 광산 지대를 강타했습니다. 신속한 구호 및 복구 작업이 필요합니다. 어떻게 대처하시겠습니까?",
        alertType: "NATURAL_DISASTER" as UrgentAlert['alertType'],
        choices: [
            { id: "disaster_relief_full", text: "총력을 다해 구호 및 복구 (-200 금, -50 식량, +10 행복도, +5 질서)", tooltip:"국고를 총동원하여 피해를 최소화합니다."},
            { id: "disaster_relief_limited", text: "제한적인 지원 제공 (-100 금, -20 식량, +3 행복도)", tooltip:"최소한의 지원으로 재정을 아낍니다."},
            { id: "disaster_relief_minimal", text: "자연에 맡긴다 (-10 행복도, -10 질서, 추가 인명피해 가능성)", tooltip:"피해 복구를 거의 포기합니다."}
        ]
    }],
    logEntry: `${stats.currentDay}일차: 남부 광산 지대 강진 발생! 막대한 피해.`
  }),
  // Report 9: Diplomatic Incident / Opportunity
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 외교 보고입니다. 이웃나라 '실바니아 왕국'에서 사절단이 도착했습니다. 그들은 양국 간의 우호 증진을 위한 혼인 동맹을 제안하고 있습니다. 이는 왕국의 국제적 위상에 큰 영향을 미칠 수 있습니다. "${goal}"과 연계하여 신중히 고려해야 합니다.`,
    reportItems: [
      { title: "실바니아 왕국 사절단 도착", text: "실바니아 왕국의 고위급 사절단이 수도에 도착하여 폐하와의 만남을 요청하고 있습니다.", category: ReportItemCategory.DIPLOMACY },
      { title: "혼인 동맹 제안", text: "사절단은 실바니아의 공주와 폐하 (또는 왕족)와의 혼인을 통해 양국 간의 동맹을 공고히 할 것을 제안했습니다. 지참금으로 100 골드와 희귀 자원을 약속했습니다.", category: ReportItemCategory.DIPLOMACY },
      { title: "귀족들의 반응", text: "왕국 내 일부 귀족들은 이 제안에 대해 각기 다른 의견을 보이고 있습니다. 어떤 이는 기회로, 어떤 이는 위협으로 간주합니다.", category: ReportItemCategory.SOCIAL },
    ],
    statChanges: { food: -Math.floor(stats.population * 0.1) },
    newAlerts: [{
        title: "실바니아 왕국의 혼인 동맹 제안",
        description: "이웃나라 실바니아가 혼인 동맹을 제안해왔습니다. 수락 시 막대한 지참금과 군사적 지원을 약속했지만, 국내 정치에 파장을 일으킬 수 있고, 실바니아의 숨은 의도가 있을 수도 있습니다.",
        alertType: "DIPLOMATIC_ENVOY" as UrgentAlert['alertType'], // Re-using for marriage proposal
        choices: [
            { id: "accept_marriage_alliance", text: "혼인 동맹을 수락한다 (+100 금, +5 군사력, +5 행복도, 실바니아와 동맹)", tooltip:"지참금과 동맹을 얻습니다."},
            { id: "decline_marriage_alliance_politely", text: "정중히 거절한다 (-3 행복도, 실바니아와 관계 악화 가능성)", tooltip:"동맹을 거절하지만 외교적 파국은 피하려 합니다."},
            { id: "decline_marriage_alliance_firmly", text: "단호히 거절하고 사절단을 추방한다 (-10 행복도, -5 질서, 실바니아와 적대 관계 가능성)", tooltip:"강경한 태도를 보입니다."}
        ]
    }],
    logEntry: `${stats.currentDay}일차: 실바니아 왕국에서 혼인 동맹 제안.`
  }),
  // Report 10: Plague Outbreak
  (stats, goal) => ({
    reportSummary: `폐하! ${stats.currentDay}일차 긴급 보건 보고입니다. 수도 엘도리아 시 외곽에서 정체불명의 역병이 발생했다는 보고입니다! 전염성이 매우 강하며 치사율도 높은 것으로 보입니다. 신속한 대처가 없다면 왕국 전체로 퍼질 수 있습니다. "${goal}"은 잠시 뒤로하고 이 위기를 극복해야 합니다.`,
    reportItems: [
      { title: "역병 발생 보고", text: "수도 외곽 빈민가에서 시작된 것으로 추정되는 역병이 빠르게 확산되고 있습니다. 초기 증상은 고열과 발진입니다.", category: ReportItemCategory.INTERNAL_AFFAIRS }, // Using INTERNAL_AFFAIRS as Health category isn't present
      { title: "의료 자원 부족", text: "왕국의 의료 시설과 약품이 턱없이 부족하여 환자들을 감당하기 어렵습니다.", category: ReportItemCategory.RESOURCES },
      { title: "백성들의 공포", text: "역병에 대한 공포가 확산되면서 상점들이 문을 닫고 거리가 텅 비고 있습니다. 공공질서가 무너질 조짐입니다.", category: ReportItemCategory.SOCIAL },
    ],
    statChanges: { population: -Math.floor(stats.population * 0.02), citizenHappiness: -15, publicOrder: -10, gold: -10, food: -Math.floor(stats.population * 0.1) },
    newAlerts: [{
        title: "역병 확산! 긴급 대처 필요",
        description: "수도에서 시작된 정체불명의 역병이 걷잡을 수 없이 퍼지고 있습니다. 폐하의 결단에 왕국의 운명이 달렸습니다!",
        alertType: "PLAGUE_OUTBREAK" as UrgentAlert['alertType'],
        choices: [
            { id: "plague_quarantine_city", text: "수도 봉쇄 및 감염자 격리 (-100 금, -10 행복도, +5 질서, 역병 확산 둔화)", tooltip:"강력한 조치로 확산을 막으려 합니다."},
            { id: "plague_research_cure", text: "치료법 연구에 자금 투입 (-150 금, 성공 시 역병 종식 가능성, 실패 시 큰 손실)", tooltip:"장기적 해결책을 모색하지만 시간이 걸립니다."},
            { id: "plague_pray_and_wait", text: "신께 기도하며 상황을 지켜본다 (-15 행복도, 역병 급속 확산 위험)", tooltip:"사실상 방관하는 것입니다."}
        ]
    }],
    logEntry: `${stats.currentDay}일차: 수도에 치명적인 역병 발생! 백성들이 죽어가고 있습니다.`
  }),
  // Report 11: Merchant Guild Demands
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 상업 보고입니다. 최근 왕국의 경제 성장에 크게 기여한 상인 조합에서 그들의 영향력 확대를 요구하고 나섰습니다. 세금 감면과 특정 상품에 대한 독점권을 주장하고 있습니다. 이들의 요구를 어떻게 처리하느냐에 따라 왕국 경제의 미래가 달라질 수 있습니다.`,
    reportItems: [
      { title: "상인 조합의 요구 사항", text: "상인 조합 대표들이 왕실에 정식으로 세금 20% 감면과 향신료 무역 독점권을 요구하는 청원서를 제출했습니다.", category: ReportItemCategory.TRADE },
      { title: "귀족들의 반발", text: "상인 조합의 요구에 대해 일부 대귀족들이 강하게 반발하고 있습니다. 이는 전통적인 귀족 중심 경제 질서에 대한 도전으로 받아들여지고 있습니다.", category: ReportItemCategory.SOCIAL },
      { title: "경제적 파급 효과 분석", text: "상인 조합의 요구를 수용할 경우 단기적으로는 세수 감소가 예상되나, 장기적으로는 교역 활성화로 이어질 수 있다는 분석과, 오히려 독점으로 인한 폐해가 클 것이라는 분석이 엇갈리고 있습니다.", category: ReportItemCategory.ECONOMY },
    ],
    statChanges: { food: -Math.floor(stats.population * 0.1) },
    newAlerts: [{
        title: "상인 조합의 압력",
        description: "강력한 상인 조합이 세금 감면과 독점권을 요구하며 왕실을 압박하고 있습니다. 이들의 요구를 들어주면 경제에 큰 변화가 예상됩니다.",
        alertType: "MERCHANT_GUILD_DEMANDS" as UrgentAlert['alertType'],
        choices: [
            { id: "guild_accept_demands", text: "요구를 전면 수용한다 (금 수입 일시적 -30%, 장기적 +?, 행복도 +3, 질서 -2)", tooltip:"상인들의 힘을 인정하고 미래를 도모합니다."},
            { id: "guild_negotiate_terms", text: "협상을 통해 일부만 수용한다 (금 수입 일시적 -10%, 행복도 +1)", tooltip:"절충안을 모색합니다."},
            { id: "guild_reject_demands_firmly", text: "요구를 단호히 거절한다 (금 수입 +0, 상인들과 관계 악화, 질서 -5, 교역 위축 가능성)", tooltip:"왕실의 권위를 지키려 합니다."}
        ]
    }],
    logEntry: `${stats.currentDay}일차: 상인 조합이 영향력 확대를 요구하고 있습니다.`
  }),
   // Report 12: Resource Depletion Scare
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 자원 보고입니다. 남부 광산 지대의 주석 광맥이 거의 고갈되었다는 우려스러운 보고가 들어왔습니다. 주석은 청동 무기 제작에 필수적인 자원이라 군사력 유지에 차질이 예상됩니다. 대책 마련이 시급합니다.`,
    reportItems: [
      { title: "주석 광맥 고갈 위기", text: "남부 광산의 광산 감독관이 주석 채굴량이 급감했으며, 현재 추세라면 1년 안에 완전히 고갈될 것이라고 보고했습니다.", category: ReportItemCategory.RESOURCES },
      { title: "군수품 생산 차질 우려", text: "주석 부족은 청동 검과 갑옷 생산에 직접적인 영향을 미쳐, 군대의 무장 수준을 저하시킬 수 있습니다.", category: ReportItemCategory.MILITARY },
      { title: "대체 자원 탐색 필요", text: "새로운 주석 광맥을 찾거나, 주석을 대체할 수 있는 새로운 합금 기술 개발이 필요합니다.", category: ReportItemCategory.ECONOMY },
    ],
    statChanges: { gold: -10, militaryStrength: -1, food: -Math.floor(stats.population * 0.09) },
    newAlerts: Math.random() < 0.25 ? [{
        title: "자원 고갈 위기: 주석",
        description: "남부 광산의 주석이 바닥나고 있습니다. 이는 군수품 생산에 심각한 타격을 줄 것입니다. 어떻게 대처하시겠습니까?",
        alertType: "RESOURCE_DISCOVERY" as UrgentAlert['alertType'], // Using this, framing as "need to discover new source"
        choices: [
            { id: "resource_search_expedition", text: "새로운 광맥 탐사대 파견 (-100 금, 성공 시 신규 광산 발견)", tooltip:"미지의 땅으로 탐험대를 보냅니다."},
            { id: "resource_invest_alternative_tech", text: "대체재 연구 투자 (-80 금, 성공 시 신소재 개발)", tooltip:"새로운 기술로 위기를 극복하려 합니다."},
            { id: "resource_import_metal", text: "주석 긴급 수입 (-150 금, 군사력 유지)", tooltip:"비싼 값에 외국에서 수입합니다."}
        ]
    }] : [],
    logEntry: `${stats.currentDay}일차: 주석 광맥 고갈 위기. 군수품 생산 차질 우려.`
  }),
  // Report 13: Good Harvest & Surplus
  (stats, goal) => ({
    reportSummary: `폐하! ${stats.currentDay}일차 농업 보고입니다. 올해 북부 농경지의 작황이 대풍년을 이루어 막대한 양의 식량이 수확되었습니다! 창고가 가득 차고 백성들의 얼굴에 웃음꽃이 피었습니다. "${goal}" 달성에도 긍정적인 소식입니다.`,
    reportItems: [
      { title: "역대급 풍년", text: `북부 농경지에서 예상치를 50% 초과하는 ${Math.floor(stats.population * 0.5)} 단위의 식량이 추가로 수확되었습니다.`, category: ReportItemCategory.AGRICULTURE },
      { title: "식량 저장 공간 부족", text: "수확량이 너무 많아 기존 식량 창고로는 모두 보관하기 어려운 상황입니다. 새로운 창고 건설이 필요할 수 있습니다.", category: ReportItemCategory.RESOURCES },
      { title: "백성들의 만족도 상승", text: "풍족한 식량 덕분에 백성들의 행복도가 크게 상승했으며, 폐하를 향한 칭송이 자자합니다.", category: ReportItemCategory.SOCIAL },
    ],
    statChanges: { food: Math.floor(stats.population * 0.5) - Math.floor(stats.population * 0.1), citizenHappiness: 10, publicOrder: 3 },
    newAlerts: [{
        title: "식량 과잉! 처리 방안은?",
        description: "예상치 못한 대풍년으로 식량이 남아돕니다! 남는 식량을 어떻게 처리하시겠습니까? 현명한 결정은 왕국에 큰 이득을 가져올 수 있습니다.",
        alertType: "TRADE_OPPORTUNITY" as UrgentAlert['alertType'], // Re-using for selling surplus
        choices: [
            { id: "surplus_sell_abroad", text: "이웃 나라에 판매한다 (+100 금, -100 식량, 외교 관계 개선)", tooltip:"잉여 자원으로 외화를 법니다."},
            { id: "surplus_distribute_people", text: "백성들에게 무상 분배한다 (-50 식량, +7 행복도)", tooltip:"민심을 얻는 데 사용합니다."},
            { id: "surplus_store_emergency", text: "비축하여 비상사태 대비 (-20 금 건설비, +100 식량 저장 가능)", tooltip:"미래의 위기에 대비합니다."}
        ]
    }],
    logEntry: `${stats.currentDay}일차: 대풍년! 식량 창고가 가득 찼습니다.`
  }),
  // Report 14: Border Tensions & Spy Activity
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 정보 보고입니다. 서부 국경 너머 '어둠숲 부족'의 움직임이 심상치 않다는 첩보가 입수되었습니다. 또한, 수도에서 활동하던 그들의 첩자가 체포되었습니다. "${goal}"을 위한 안정적인 환경 조성이 중요합니다.`,
    reportItems: [
      { title: "어둠숲 부족 동향", text: "어둠숲 부족이 최근 병력을 집결시키고 있으며, 약탈을 위한 소규모 침입이 잦아지고 있다는 보고입니다.", category: ReportItemCategory.MILITARY },
      { title: "첩자 체포", text: "수도에서 암약하며 정보를 빼돌리던 어둠숲 부족의 첩자를 체포하여 심문 중입니다. 중요한 정보를 얻을 수 있을지도 모릅니다.", category: ReportItemCategory.INTERNAL_AFFAIRS }, // Or a new ESPIONAGE category
      { title: "국경 방어 강화 필요", text: "서부 삼림 지대의 방어선을 강화하고, 추가 병력 파견을 고려해야 할 시점입니다.", category: ReportItemCategory.MILITARY },
    ],
    statChanges: { publicOrder: 2, gold: -10, food: -Math.floor(stats.population * 0.1) },
    newAlerts: Math.random() < 0.4 ? [{
        title: "체포된 첩자 처리",
        description: "수도에서 체포된 어둠숲 부족의 첩자를 어떻게 처리하시겠습니까? 그의 입에서 중요한 정보가 나올 수도, 혹은 본보기로 삼을 수도 있습니다.",
        alertType: "SPY_CAUGHT" as UrgentAlert['alertType'],
        choices: [
            { id: "spy_interrogate_execute", text: "고문하여 정보 획득 후 처형 (+5 질서, -3 행복도, 정보 획득 가능성)", tooltip:"정보를 얻고 공포를 심어줍니다."},
            { id: "spy_ransom_exchange", text: "어둠숲 부족과 몸값 협상/포로 교환 (-50 금 또는 + 병력, 외교적 선택)", tooltip:"실리를 추구하거나 외교적 해결을 시도합니다."},
            { id: "spy_turn_double_agent", text: "회유하여 이중첩자로 활용 (성공 시 고급 정보, 실패 시 역정보 위험)", tooltip:"위험하지만 큰 이득을 노립니다."}
        ]
    }] : [],
    logEntry: `${stats.currentDay}일차: 어둠숲 부족의 수상한 움직임. 첩자 체포.`
  }),
  // Report 15: Philosophical Movement
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 문화 보고입니다. 수도를 중심으로 '만민 평등 사상'이라는 새로운 철학이 젊은이들 사이에서 빠르게 확산되고 있습니다. 이는 기존 사회 질서에 도전하는 급진적인 내용을 담고 있어, 귀족들의 우려를 사고 있습니다.`,
    reportItems: [
      { title: "신흥 사상 '만민 평등'", text: "모든 인간은 신분과 관계없이 평등하며, 능력에 따라 대우받아야 한다는 주장이 젊은 학자들과 시민들 사이에서 인기를 얻고 있습니다.", category: ReportItemCategory.SOCIAL },
      { title: "귀족들의 반발", text: "이러한 사상은 신분 질서를 근간으로 하는 왕국의 체제를 위협한다고 여겨, 대다수 귀족이 강력한 반감을 드러내고 있습니다.", category: ReportItemCategory.SOCIAL },
      { title: "사상 탄압 논쟁", text: "일부 강경파 신하들은 이 사상을 불온한 것으로 규정하고 즉각 탄압해야 한다고 주장하는 반면, 다른 이들은 사상의 자유를 존중해야 한다고 맞서고 있습니다.", category: ReportItemCategory.INTERNAL_AFFAIRS },
    ],
    statChanges: { citizenHappiness: goal === EdelweissGoal.CITIZEN_SATISFACTION ? 2: -2, publicOrder: -3, food: -Math.floor(stats.population * 0.1) },
    newAlerts: [{
        title: "신흥 사상 대처 방안",
        description: "'만민 평등 사상'이 왕국에 빠르게 퍼지고 있습니다. 이 새로운 흐름에 어떻게 대처하시겠습니까?",
        alertType: "CITIZEN_UNREST" as UrgentAlert['alertType'], // Re-using, as it can lead to unrest
        choices: [
            { id: "movement_suppress", text: "사상을 금지하고 주동자를 처벌한다 (+5 질서, -10 행복도, 지식인층 반발)", tooltip:"강압적으로 억누릅니다."},
            { id: "movement_debate", text: "공개 토론회를 열어 사상을 검증한다 (-2 질서, +5 행복도, 결과 불확실)", tooltip:"백성들의 의견을 듣고 판단합니다."},
            { id: "movement_partially_accept", text: "사상의 일부 긍정적 측면을 수용하여 개혁에 반영한다 (+3 행복도, +2 질서, -50 금, 귀족 불만)", tooltip:"점진적 변화를 시도합니다."}
        ]
    }],
    logEntry: `${stats.currentDay}일차: '만민 평등 사상' 확산. 사회적 논쟁 가열.`
  }),
  // --- NEW UNIQUE REPORTS START HERE ---
  // New Report 1 (Urban Development: Grand Library)
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 도시 보고입니다. 왕립 건축가들이 '엘도리아 대도서관' 건설 계획을 제출했습니다. 이는 왕국의 학문과 명예를 드높일 기념비적인 건축물이 될 것입니다. "${goal}" 달성에도 긍정적인 영향을 줄 수 있습니다.`,
    reportItems: [
      { title: "대도서관 건설 계획", text: "지식의 보고가 될 거대한 도서관 건설 계획안이 제출되었습니다. 완공 시 왕국의 지적 수준을 크게 향상시킬 것입니다.", category: ReportItemCategory.INTERNAL_AFFAIRS },
      { title: "건설 비용 및 기간", text: "건설에는 300 골드의 초기 비용과 약 1년의 시간이 소요될 것으로 예상됩니다. 장기적인 안목이 필요합니다.", category: ReportItemCategory.FINANCE },
      { title: "학자들의 기대", text: "왕립 학자들은 대도서관 건설에 대한 기대감으로 가득 차 있으며, 새로운 연구와 발견의 가능성을 열어줄 것이라 믿고 있습니다.", category: ReportItemCategory.MILITARY }, // Misleading category, but keeping for example structure, maybe change to SOCIAL or ECONOMY
    ],
    statChanges: { food: -Math.floor(stats.population * 0.08) },
    newAlerts: [{
        title: "엘도리아 대도서관 건설",
        description: "왕국의 학문적 명예를 드높일 대도서관 건설 계획이 제안되었습니다. 막대한 비용이 들지만, 왕국의 위상을 크게 높일 수 있습니다.",
        alertType: "INFRASTRUCTURE_PROJECT" as UrgentAlert['alertType'],
        choices: [
            { id: "build_grand_library_full", text: "전폭적인 지원으로 건설한다 (-300 금, +10 행복도, +5 질서)", tooltip:"지식과 명예를 위해 과감히 투자합니다."},
            { id: "build_grand_library_delay", text: "재정 상황을 고려해 건설을 보류한다 (-3 행복도, +10 금 보존)", tooltip:"비용을 아끼지만, 학자들의 실망이 큽니다."},
            { id: "build_grand_library_reject", text: "건설 계획을 완전히 철회한다 (-7 행복도, -2 질서)", tooltip:"비용을 절약하지만, 학자들과 일부 백성들의 불만을 삽니다."}
        ]
    }],
    logEntry: `${stats.currentDay}일차: 엘도리아 대도서관 건설 계획 제안.`
  }),
  // New Report 2 (Cultural Event: Annual Harvest Festival)
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 문화 보고입니다. 북부 농경지 주민들이 수확의 기쁨을 나누는 '황금 이삭 축제'를 제안했습니다. 이 축제는 백성들의 사기를 높이고 단합을 다지는 좋은 기회가 될 것입니다.`,
    reportItems: [
      { title: "황금 이삭 축제 제안", text: "수확의 기쁨을 기념하고 풍요를 기원하는 전통적인 축제 '황금 이삭 축제'를 개최하자는 건의가 있었습니다.", category: ReportItemCategory.SOCIAL },
      { title: "축제 준비 비용", text: "성대한 축제를 위해서는 약 80 골드의 왕실 지원이 필요합니다. 식량과 물품도 상당량 소모될 것입니다.", category: ReportItemCategory.FINANCE },
      { title: "백성들의 기대", text: "백성들은 축제에 대한 기대감으로 들떠 있으며, 성공적인 축제는 폐하의 인자함을 널리 알릴 기회가 될 것입니다.", category: ReportItemCategory.SOCIAL },
    ],
    statChanges: { food: -Math.floor(stats.population * 0.09) },
    newAlerts: [{
        title: "황금 이삭 축제 개최 여부",
        description: "백성들의 사기를 높일 '황금 이삭 축제' 개최를 승인하시겠습니까? 비용이 들지만, 백성들의 행복도를 크게 높일 수 있습니다.",
        alertType: "CULTURAL_FESTIVAL_REQUEST" as UrgentAlert['alertType'],
        choices: [
            { id: "approve_harvest_festival", text: "축제를 성대히 개최한다 (-80 금, +10 행복도)", tooltip:"백성들의 사기를 최고로 끌어올립니다."},
            { id: "approve_harvest_festival_modest", text: "간소하게 개최한다 (-30 금, +5 행복도)", tooltip:"비용을 절약하며 백성들의 기분을 북돋아 줍니다."},
            { id: "reject_harvest_festival", text: "축제 개최를 거절한다 (-5 행복도)", tooltip:"비용을 아끼지만, 백성들의 실망감이 큽니다."}
        ]
    }],
    logEntry: `${stats.currentDay}일차: '황금 이삭 축제' 개최 제안.`
  }),
  // New Report 3 (Exploration: Whispering Woods Ruins)
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 탐험 보고입니다. 서부 삼림지대 외곽 '속삭이는 언덕' 근처에서 고대 유적의 흔적이 발견되었습니다! 탐험대는 추가 조사를 위한 지원을 요청하고 있습니다.`,
    reportItems: [
      { title: "고대 유적 발견", text: "오랜 전설로만 전해지던 고대 왕국의 유적이 속삭이는 언덕 깊은 곳에서 발견되었습니다. 미지의 지식과 보물이 잠들어 있을지도 모릅니다.", category: ReportItemCategory.RESOURCES },
      { title: "추가 탐사 요청", text: "탐험대장 '엘렌'은 유적의 심층 조사를 위해 추가적인 장비와 인력, 그리고 50 골드의 자금을 요청했습니다.", category: ReportItemCategory.FINANCE },
      { title: "유적의 위험성", text: "유적 내부에서는 수상한 마법적 기운이 감지되고 있으며, 함정이나 미지의 생명체가 있을 가능성이 있습니다.", category: ReportItemCategory.MILITARY },
    ],
    statChanges: { food: -Math.floor(stats.population * 0.1) },
    newAlerts: [{
        title: "고대 유적 탐사 결정",
        description: "속삭이는 언덕에서 고대 유적이 발견되었습니다. 심층 탐사를 지원하시겠습니까? 귀중한 것을 얻을 수도, 위험에 처할 수도 있습니다.",
        alertType: "EXPLORATION_DISCOVERY" as UrgentAlert['alertType'],
        choices: [
            { id: "explore_ancient_ruins_full", text: "전폭적으로 탐사를 지원한다 (-50 금, 성공 시 큰 이득, 실패 시 큰 손실)", tooltip:"위험을 감수하고 큰 보상을 노립니다."},
            { id: "explore_ancient_ruins_cautious", text: "제한된 자원만 지원하고 신중히 진행한다 (-20 금, 성공 시 소규모 이득, 실패 시 작은 손실)", tooltip:"위험을 줄이고 점진적으로 접근합니다."},
            { id: "abandon_ancient_ruins", text: "위험을 피해 탐사를 중단한다 (+0 금, 기회 상실)", tooltip:"안전을 우선시하고 기회를 포기합니다."}
        ]
    }],
    logEntry: `${stats.currentDay}일차: 속삭이는 언덕에서 고대 유적 발견!`
  }),
  // New Report 4 (Faction Conflict: Farmers vs. Merchants)
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 사회 동향 보고입니다. 북부 농경지의 농민들과 동부 교역로의 상인들 사이에 곡물 가격을 두고 갈등이 심화되고 있습니다. 양측 모두 왕실의 중재를 요청하고 있습니다.`,
    reportItems: [
      { title: "농민들의 불만", text: "농민들은 상인들이 곡물을 너무 낮은 가격에 사들여 자신들의 생계가 위협받고 있다고 주장합니다. 더 높은 가격을 요구하고 있습니다.", category: ReportItemCategory.SOCIAL },
      { title: "상인들의 입장", text: "상인들은 자신들 또한 높은 운송비와 위험을 감수하고 있으며, 현재 가격은 시장 논리에 따른 합당한 것이라고 반박합니다.", category: ReportItemCategory.ECONOMY },
      { title: "경제 불안정 우려", text: "이 갈등이 해결되지 않으면 농민들의 생산 의욕이 저하되거나, 상인들의 교역 활동이 위축되어 왕국 경제에 악영향을 줄 수 있습니다.", category: ReportItemCategory.ECONOMY },
    ],
    statChanges: { food: -Math.floor(stats.population * 0.1) },
    newAlerts: [{
        title: "농민-상인 갈등 중재",
        description: "농민과 상인 간의 곡물 가격 분쟁이 심화되고 있습니다. 폐하의 현명한 중재가 필요합니다.",
        alertType: "FACTION_CONFLICT" as UrgentAlert['alertType'],
        choices: [
            { id: "support_farmers", text: "농민 편을 들어 곡물 최저 가격을 보장한다 (-50 금, +5 행복도, 상인 불만)", tooltip:"농민들의 삶을 보장하지만, 상인들이 반발할 수 있습니다."},
            { id: "support_merchants", text: "상인들의 자유로운 시장 활동을 지지한다 (+20 금, -3 행복도, 농민 불만)", tooltip:"시장의 자유를 보장하지만, 농민들이 불만을 가질 수 있습니다."},
            { id: "mediate_compromise", text: "양측을 중재하여 타협점을 찾는다 (-30 금, +3 행복도, 양측 소폭 불만)", tooltip:"모두를 완전히 만족시키지는 못하지만, 갈등을 봉합합니다."}
        ]
    }],
    logEntry: `${stats.currentDay}일차: 농민과 상인 간 곡물 가격 갈등 심화.`
  }),
  // New Report 5 (Environmental: River Flooding)
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 환경 보고입니다. 연일 계속된 폭우로 인해 왕국을 가로지르는 '푸른 강'이 범람하여 주변 농경지와 마을이 침수되었습니다. 긴급한 구호와 복구 작업이 필요합니다.`,
    reportItems: [
      { title: "푸른 강 범람", text: "푸른 강이 범람하여 인근 농경지 20%가 침수되고, 여러 마을의 주택이 파손되었습니다. 예상치 못한 재해입니다.", category: ReportItemCategory.AGRICULTURE },
      { title: "이재민 발생 및 식량 손실", text: "수백 명의 이재민이 발생했으며, 침수된 농경지로 인해 다음 수확기에 막대한 식량 손실이 예상됩니다.", category: ReportItemCategory.RESOURCES },
      { title: "질병 확산 우려", text: "침수 지역의 위생 상태가 좋지 않아 수인성 질병의 확산이 우려됩니다. 보건 대책 마련이 시급합니다.", category: ReportItemCategory.INTERNAL_AFFAIRS },
    ],
    statChanges: { food: -Math.floor(stats.population * 0.15) - 80, publicOrder: -5, citizenHappiness: -7 },
    newAlerts: [{
        title: "푸른 강 범람 피해 복구",
        description: "강력한 홍수로 푸른 강 유역이 침수되어 막대한 피해를 입었습니다. 백성들을 구하고 왕국을 재건하기 위한 폐하의 지시가 필요합니다.",
        alertType: "NATURAL_DISASTER" as UrgentAlert['alertType'],
        choices: [
            { id: "flood_relief_full", text: "총력을 다해 구호 및 복구 (-180 금, -40 식량, +8 행복도, +4 질서)", tooltip:"국고를 총동원하여 피해를 최소화합니다."},
            { id: "flood_relief_limited", text: "제한적인 지원 제공 (-90 금, -20 식량, +2 행복도)", tooltip:"최소한의 지원으로 재정을 아낍니다."},
            { id: "flood_build_dams", text: "장기적으로 댐 건설 추진 (-250 금, 향후 홍수 예방)", tooltip:"막대한 비용으로 근본적인 해결책을 찾습니다."}
        ]
    }],
    logEntry: `${stats.currentDay}일차: 푸른 강 범람으로 인한 대규모 홍수 피해 발생.`
  }),
  // New Report 6 (Crime: Smuggling Ring Exposed)
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 치안 보고입니다. 수도의 지하에서 활동하던 대규모 밀수 조직이 왕국군에 의해 적발되었습니다! 이들은 귀중품과 밀주를 밀매하며 국고에 큰 손실을 입혔습니다.`,
    reportItems: [
      { title: "밀수 조직 적발", text: "수도 지하에서 오랫동안 암약해온 '검은 혀' 밀수 조직의 본거지가 발각되어 핵심 인물들이 체포되었습니다. 회수된 밀수품은 상당량입니다.", category: ReportItemCategory.INTERNAL_AFFAIRS },
      { title: "국고 손실 확인", text: "조사 결과, 이들의 밀수 활동으로 지난 몇 년간 왕국에 100 골드 이상의 세수 손실이 있었던 것으로 파악되었습니다.", category: ReportItemCategory.FINANCE },
      { title: "시장 안정화 기대", text: "밀수 조직의 척결로 불법 거래가 줄어들어 왕국 내 시장이 더욱 투명하고 안정적으로 운영될 것으로 기대됩니다.", category: ReportItemCategory.ECONOMY },
    ],
    statChanges: { gold: 30, publicOrder: 5, citizenHappiness: 2, food: -Math.floor(stats.population * 0.08) },
    newAlerts: [{
        title: "밀수 조직 잔당 처리",
        description: "대규모 밀수 조직은 소탕되었지만, 아직 잔당이 남아있을 가능성이 있습니다. 또한, 회수된 밀수품 처리 문제도 있습니다.",
        alertType: "CRIME_CORRUPTION" as UrgentAlert['alertType'],
        choices: [
            { id: "smuggling_hunt_remaining", text: "잔당을 끝까지 추적하여 소탕한다 (-40 금, +3 질서, 밀수 완전 근절)", tooltip:"남은 세력을 완전히 제거하여 재발을 막습니다."},
            { id: "smuggling_sell_recovered_goods", text: "회수된 밀수품을 시장에 공개 매각한다 (+70 금, -2 행복도)", tooltip:"재정을 확보하지만, 불법 상품이 시장에 풀리는 것에 대한 불만이 있을 수 있습니다."},
            { id: "smuggling_show_mercy", text: "남은 잔당들에게 자수를 권유하고 관용을 베푼다 (-1 질서, +1 행복도, 재범 위험)", tooltip:"인자함을 보이지만, 범죄 재발의 위험이 있습니다."}
        ]
    }],
    logEntry: `${stats.currentDay}일차: 대규모 밀수 조직 '검은 혀' 적발!`
  }),
   // New Report 7 (Technological Innovation: Gnomish Steam Engine)
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 기술 보고입니다. 남부 광산 지대의 한 재기 발랄한 그놈 기술자가 새로운 '증기 기관' 시제품을 완성했습니다! 이는 채굴, 운송, 심지어 군사 분야에도 혁명을 가져올 수 있는 잠재력을 지니고 있습니다.`,
    reportItems: [
      { title: "증기 기관 시제품 공개", text: "그놈 기술자 '스파클윙'이 소형 증기 기관 시제품을 선보였습니다. 석탄과 물로 움직이며 엄청난 동력을 자랑합니다.", category: ReportItemCategory.ECONOMY },
      { title: "잠재적 활용 분야", text: "이 기술은 광산 채굴 속도 증가, 물자 운송 효율 증대, 심지어 새로운 형태의 무기 개발에도 적용될 수 있습니다.", category: ReportItemCategory.MILITARY },
      { title: "대량 생산 비용", text: "증기 기관을 대량 생산하고 왕국 전역에 보급하기 위해서는 상당한 연구 개발 및 인프라 구축 비용(약 200 골드)이 필요합니다.", category: ReportItemCategory.FINANCE },
    ],
    statChanges: { food: -Math.floor(stats.population * 0.1) },
    newAlerts: [{
        title: "그놈 증기 기관 투자",
        description: "혁명적인 증기 기관 기술에 투자하여 왕국을 발전시키시겠습니까? 막대한 투자가 필요하지만, 장기적인 이득이 예상됩니다.",
        alertType: "SCIENTIFIC_BREAKTHROUGH" as UrgentAlert['alertType'], // Re-using alert type
        choices: [
            { id: "invest_steam_engine_full", text: "전폭적으로 투자하여 기술을 상용화한다 (-200 금, 향후 자원 생산/교역 대폭 증가)", tooltip:"산업 혁명의 선두 주자가 됩니다."},
            { id: "invest_steam_engine_partial", text: "부분적으로 기술 연구를 지원한다 (-80 금, 향후 소규모 발전 기대)", tooltip:"위험을 줄이고 점진적인 발전을 추구합니다."},
            { id: "reject_steam_engine", text: "위험 부담이 커 투자를 거절한다 (-3 행복도, 기술 발전 기회 상실)", tooltip:"기술 발전 기회를 놓치지만 재정을 아낍니다."}
        ]
    }],
    logEntry: `${stats.currentDay}일차: 그놈 기술자의 혁신적인 증기 기관 시제품 공개!`
  }),
  // New Report 8 (Social: Refugee Crisis)
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 국경 보고입니다. 동부 국경 너머 '붉은 사막 제국'의 내전으로 인해 수천 명의 난민들이 우리 왕국으로 피난 오고 있습니다. 그들은 음식과 거처가 절실합니다.`,
    reportItems: [
      { title: "난민 유입 상황", text: "붉은 사막 제국의 내전을 피해 수천 명의 난민들이 매일 동부 국경을 넘어오고 있습니다. 인도적인 지원이 시급합니다.", category: ReportItemCategory.SOCIAL },
      { title: "왕국 자원 압박", text: "갑작스러운 난민 유입으로 식량, 물, 주거지 등 왕국의 자원에 막대한 부담이 가해지고 있습니다.", category: ReportItemCategory.RESOURCES },
      { title: "여론 분열", text: "일부 백성들은 난민들에게 자비를 베풀어야 한다고 주장하는 반면, 다른 이들은 왕국의 안보와 자원 고갈을 우려하며 반대하고 있습니다.", category: ReportItemCategory.SOCIAL },
    ],
    statChanges: { food: -Math.floor(stats.population * 0.12) - 50, publicOrder: -3, citizenHappiness: -2 },
    newAlerts: [{
        title: "난민 위기 대처 방안",
        description: "동부 국경에서 대규모 난민이 유입되고 있습니다. 이들을 어떻게 처리하시겠습니까?",
        alertType: "REFUGEE_CRISIS" as UrgentAlert['alertType'],
        choices: [
            { id: "refugee_offer_shelter", text: "수용하고 인도적 지원 제공 (-100 금, -50 식량, +8 행복도, -5 질서)", tooltip:"인도주의적 책임을 다하지만, 재정과 질서에 부담이 됩니다."},
            { id: "refugee_temporary_camp", text: "임시 수용소를 설치하고 제한적으로 지원한다 (-50 금, -20 식량, +3 행복도, -2 질서)", tooltip:"부담을 줄이면서 최소한의 지원을 제공합니다."},
            { id: "refugee_turn_away", text: "국경을 봉쇄하고 난민 유입을 막는다 (+10 질서, -10 행복도, 국제적 비난 위험)", tooltip:"왕국의 안전을 우선시하지만, 백성들과 국제 사회의 비난을 받을 수 있습니다."}
        ]
    }],
    logEntry: `${stats.currentDay}일차: 붉은 사막 제국 내전으로 인한 대규모 난민 유입.`
  }),
  // New Report 9 (Royal Intrigue: Succession Dispute - Earl of Silverwood)
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 왕실 보고입니다. 실버우드 백작이 후사 없이 사망하여 그의 영지를 두고 두 조카인 '레이놀드'와 '베아트리스' 사이에 치열한 계승 분쟁이 발생했습니다. 이들의 다툼이 왕국의 안정에 위협이 될 수 있습니다.`,
    reportItems: [
      { title: "실버우드 백작 사망", text: "갑작스러운 실버우드 백작의 사망으로 비옥한 실버우드 영지에 대한 계승권 문제가 불거졌습니다.", category: ReportItemCategory.INTERNAL_AFFAIRS },
      { title: "두 계승권 주장자", text: "장남의 아들인 '레이놀드 경'은 전통적인 장자 계승을, 누이의 딸인 '베아트리스 숙녀'는 백작의 유언장을 내세우며 왕실의 인정을 요구하고 있습니다.", category: ReportItemCategory.SOCIAL },
      { title: "귀족들의 압력", text: "각 주장자를 지지하는 귀족들이 폐하께 자신의 지지자를 백작으로 인정해달라고 압력을 가하고 있습니다. 잘못된 판단은 왕국 귀족 사회의 분열을 야기할 수 있습니다.", category: ReportItemCategory.DIPLOMACY },
    ],
    statChanges: { food: -Math.floor(stats.population * 0.09) },
    newAlerts: [{
        title: "실버우드 백작 계승 분쟁",
        description: "실버우드 영지의 계승권을 두고 레이놀드 경과 베아트리스 숙녀가 다투고 있습니다. 누구의 손을 들어주시겠습니까?",
        alertType: "NOBILITY_DISPUTE" as UrgentAlert['alertType'],
        choices: [
            { id: "resolve_succession_raynold", text: "레이놀드 경의 손을 들어준다 (+5 군사력(레이놀드 가문 병력), -5 행복도(베아트리스 지지층))", tooltip:"전통과 군사력을 중시하는 선택입니다."},
            { id: "resolve_succession_beatrice", text: "베아트리스 숙녀의 손을 들어준다 (+5 행복도(개혁 지지층), -5 질서(보수 귀족층))", tooltip:"유언과 개혁적인 분위기를 중시하는 선택입니다."},
            { id: "resolve_succession_mediate", text: "양측을 중재하여 영지를 분할한다 (-20 금, +3 질서, 양측 소폭 불만)", tooltip:"분쟁을 종결시키지만, 모두를 만족시키지는 못합니다."}
        ]
    }],
    logEntry: `${stats.currentDay}일차: 실버우드 백작령 계승 분쟁 발생.`
  }),
  // New Report 10 (Mystical Event: Whispering Lake Anomaly)
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 신비 보고입니다. 멀리 떨어진 '속삭이는 호수'에서 기이한 현상이 보고되고 있습니다. 호수 물이 밤마다 푸른 빛을 내고, 이상한 소리가 들린다고 합니다. 백성들은 신비로운 기적이라며 경외심을 표하거나, 불길한 징조라며 공포에 떨고 있습니다.`,
    reportItems: [
      { title: "속삭이는 호수 이상 현상", text: "수 주 전부터 속삭이는 호수에서 신비로운 발광 현상과 함께 미지의 소리가 들려오고 있습니다. 원인 불명의 현상입니다.", category: ReportItemCategory.INTERNAL_AFFAIRS }, // Placeholder category
      { title: "백성들의 반응", text: "일부 백성들은 이를 신의 계시나 기적으로 여기며 호수를 찾아 경배하고 있지만, 다른 이들은 악마의 소행이라며 두려워하고 있습니다.", category: ReportItemCategory.SOCIAL },
      { title: "학자들의 관심", text: "왕립 마법 학자들은 이 현상에 큰 관심을 보이며, 마법적 원인을 밝히기 위한 조사를 요청하고 있습니다.", category: ReportItemCategory.MILITARY }, // Placeholder category
    ],
    statChanges: { food: -Math.floor(stats.population * 0.1) },
    newAlerts: [{
        title: "속삭이는 호수 현상 조사",
        description: "속삭이는 호수에서 미지의 현상이 발생하고 있습니다. 어떻게 대처하시겠습니까?",
        alertType: "MYSTICAL_PHENOMENON" as UrgentAlert['alertType'],
        choices: [
            { id: "investigate_whispering_lake", text: "학자들을 파견하여 심층 조사를 명한다 (-70 금, 성공 시 큰 지식 획득, 실패 시 위험)", tooltip:"진실을 파헤쳐 왕국의 지식을 확장합니다."},
            { id: "bless_whispering_lake", text: "성직자들을 파견하여 축복 의식을 진행한다 (+5 행복도, 질서 +2, 현상 유지)", tooltip:"백성들의 불안을 잠재우고 신앙심을 고취합니다."},
            { id: "seal_whispering_lake", text: "호수 주변을 봉쇄하고 접근을 금한다 (-3 행복도, -1 질서)", tooltip:"불확실한 위험을 차단하고, 백성들의 공포를 키울 수 있습니다."}
        ]
    }],
    logEntry: `${stats.currentDay}일차: 속삭이는 호수에서 미지의 현상 발생!`
  }),
  // New Report 11 (Economic: Merchant's New Trade Route)
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 경제 보고입니다. 유명 상인 '엘민'이 북부 산맥을 넘어 새로운 교역로를 개척했다고 보고했습니다! 이 루트는 희귀 광물과 비단이 풍부한 '운무의 땅'으로 연결됩니다.`,
    reportItems: [
      { title: "새로운 교역로 개척", text: "오랫동안 미지의 땅으로 여겨졌던 북부 산맥을 넘어 '운무의 땅'으로 향하는 새로운 교역로가 성공적으로 개척되었습니다.", category: ReportItemCategory.TRADE },
      { title: "막대한 잠재적 수익", text: "운무의 땅은 희귀한 마법 광물과 고급 비단 등 왕국에 없는 귀중한 자원이 풍부합니다. 정식 교역이 시작되면 막대한 수입을 기대할 수 있습니다.", category: ReportItemCategory.RESOURCES },
      { title: "안정성 문제", text: "새로운 교역로는 아직 안정적이지 못하며, 험준한 지형과 미지의 위협(괴물, 도적 등)이 도사리고 있어 보호가 필요합니다.", category: ReportItemCategory.MILITARY },
    ],
    statChanges: { gold: 10, food: -Math.floor(stats.population * 0.1) },
    newAlerts: [{
        title: "신규 교역로 보호 및 활용",
        description: "새롭게 개척된 '운무의 땅' 교역로를 어떻게 활용하시겠습니까? 큰 이득을 얻을 수 있지만, 보호를 위한 투자가 필요합니다.",
        alertType: "TRADE_OPPORTUNITY" as UrgentAlert['alertType'],
        choices: [
            { id: "secure_new_trade_route", text: "군대를 파견하여 교역로를 확보한다 (-80 금, +3 군사력, 향후 금 수입 대폭 증가)", tooltip:"안정적인 교역을 위해 초기 비용을 지불합니다."},
            { id: "tax_new_trade_route", text: "교역상들에게 높은 세금을 부과한다 (+50 금, -5 행복도(상인), 교역량 감소 위험)", tooltip:"단기적인 이득을 취하지만, 상인들의 불만을 살 수 있습니다."},
            { id: "ignore_new_trade_route", text: "교역로를 방치한다 (기회 상실, 잠재적 위험 증가)", tooltip:"투자를 회피하지만, 교역로의 가치가 하락할 수 있습니다."}
        ]
    }],
    logEntry: `${stats.currentDay}일차: '운무의 땅'으로 향하는 새로운 교역로 개척!`
  }),
   // New Report 12 (Social: Guild of Artisans' Demands)
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 사회 보고입니다. 왕국 최고의 장인들이 모인 '장인 조합'이 왕실에 여러 요구를 제출했습니다. 그들은 자신들의 숙련된 기술에 대한 정당한 대우와 작업 환경 개선을 주장하고 있습니다.`,
    reportItems: [
      { title: "장인 조합의 요구", text: "장인 조합은 왕실의 예술품 제작 주문에 대한 정당한 보상, 작업장 확장 지원, 그리고 장인 자녀들을 위한 특별 교육 프로그램 설립을 요구했습니다.", category: ReportItemCategory.SOCIAL },
      { title: "왕국의 기술력 상징", text: "장인들은 왕국의 기술력과 문화적 수준을 상징하는 중요한 존재입니다. 이들의 사기가 낮아지면 왕국의 명성에도 악영향을 미칠 수 있습니다.", category: ReportItemCategory.CULTURE },
      { title: "요구 수용 비용", text: "장인 조합의 요구를 모두 수용할 경우, 약 120 골드의 재정적 지원이 필요할 것으로 추산됩니다.", category: ReportItemCategory.FINANCE },
    ],
    statChanges: { food: -Math.floor(stats.population * 0.09) },
    newAlerts: [{
        title: "장인 조합의 요구 처리",
        description: "왕국의 장인들이 자신들의 권리를 주장하며 왕실에 요구를 제출했습니다. 어떻게 대처하시겠습니까?",
        alertType: "GUILD_DEMANDS" as UrgentAlert['alertType'],
        choices: [
            { id: "artisans_grant_full", text: "모든 요구를 수용하고 전폭 지원한다 (-120 금, +8 행복도, +2 질서)", tooltip:"왕국의 예술과 기술 발전에 기여합니다."},
            { id: "artisans_negotiate", text: "협상하여 일부 요구만 수용한다 (-60 금, +4 행복도)", tooltip:"재정을 절약하면서도 적절히 타협합니다."},
            { id: "artisans_reject", text: "요구를 거절한다 (-5 행복도, -2 질서, 장인들의 이탈 가능성)", tooltip:"재정을 아끼지만, 장인들의 불만이 커집니다."}
        ]
    }],
    logEntry: `${stats.currentDay}일차: 장인 조합이 왕실에 요구 제출.`
  }),
  // New Report 13 (Military: Training Accident)
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 군사 보고입니다. 수도 외곽 훈련장에서 불의의 사고가 발생하여 병사 수십 명이 부상당했습니다. 군대의 사기가 저하될 우려가 있습니다.`,
    reportItems: [
      { title: "훈련장 사고 발생", text: "새로운 공성 무기 훈련 중 예기치 못한 폭발로 훈련장이 파손되고 30명의 병사들이 중경상을 입었습니다.", category: ReportItemCategory.MILITARY },
      { title: "군 사기 저하 우려", text: "이번 사고로 인해 병사들 사이에서 불안감과 사기 저하가 감지되고 있습니다. 빠른 대책이 필요합니다.", category: ReportItemCategory.SOCIAL },
      { title: "부상병 치료 및 훈련장 복구", text: "부상당한 병사들의 치료와 파손된 훈련장 복구를 위해 50 골드의 추가 예산이 필요합니다.", category: ReportItemCategory.FINANCE },
    ],
    statChanges: { militaryStrength: -3, publicOrder: -1, food: -Math.floor(stats.population * 0.1) },
    newAlerts: [{
        title: "군사 훈련 사고 대처",
        description: "군 훈련 중 발생한 사고로 병사들이 부상당하고 사기가 저하되었습니다. 어떻게 대처하시겠습니까?",
        alertType: "MILITARY_AFFAIRS" as UrgentAlert['alertType'],
        choices: [
            { id: "military_full_support", text: "부상병 치료 및 훈련장 복구에 전폭 지원한다 (-50 금, +5 군사력, +3 행복도)", tooltip:"군대의 사기를 회복하고 충성심을 높입니다."},
            { id: "military_investigate_punish", text: "사고 원인을 철저히 조사하고 책임자를 처벌한다 (+3 질서, -2 행복도, 군사력 -1)", tooltip:"책임자를 밝혀내지만, 군대의 불만을 살 수 있습니다."},
            { id: "military_ignore_accident", text: "사고를 덮고 훈련을 강행한다 (-10 군사력, -5 행복도)", tooltip:"병사들의 사기를 완전히 꺾을 수 있습니다."}
        ]
    }],
    logEntry: `${stats.currentDay}일차: 군 훈련장 사고 발생, 병사들 부상.`
  }),
  // New Report 14 (Environmental: Mysterious Blight)
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 농업 보고입니다. 서부 삼림지대와 인접한 소규모 농지에서 정체불명의 '검은 역병'이 작물에 퍼지고 있다는 보고입니다. 이대로라면 농업 생산에 심각한 차질이 생길 수 있습니다.`,
    reportItems: [
      { title: "작물 역병 확산", text: "작물의 줄기가 검게 변하며 시들게 하는 정체불명의 역병이 서부 농경지 일부에서 발견되었습니다. 빠르게 확산되고 있습니다.", category: ReportItemCategory.AGRICULTURE },
      { title: "식량 생산량 감소 위협", text: "이 역병이 확산되면 다음 수확기의 식량 생산량이 크게 감소하여 왕국 전체의 식량 안보에 위협이 될 것입니다.", category: ReportItemCategory.RESOURCES },
      { title: "전문가들의 우려", text: "왕립 식물학자들은 역병의 원인을 알 수 없어 해결책을 찾기 어렵다고 보고했습니다. 긴급한 조치가 필요합니다.", category: ReportItemCategory.SOCIAL },
    ],
    statChanges: { food: -Math.floor(stats.population * 0.1) - 30, citizenHappiness: -3 },
    newAlerts: [{
        title: "정체불명 작물 역병 대처",
        description: "왕국 농지에 정체불명의 작물 역병이 퍼지고 있습니다. 즉각적인 대처가 없다면 대규모 식량 위기가 올 수 있습니다.",
        alertType: "BLIGHT_OUTBREAK" as UrgentAlert['alertType'],
        choices: [
            { id: "blight_research_cure", text: "연구 자금 투입하여 치료법 개발 (-80 금, 성공 시 역병 종식)", tooltip:"장기적인 해결책을 모색합니다."},
            { id: "blight_quarantine_destroy", text: "감염된 작물 격리 및 소각 (-20 금, -50 식량, 역병 확산 둔화)", tooltip:"강력한 조치로 확산을 막지만, 즉각적인 식량 손실이 있습니다."},
            { id: "blight_pray_wait", text: "신께 기도하며 상황을 지켜본다 (-7 행복도, 역병 급속 확산 위험)", tooltip:"사실상 방관하는 것입니다."}
        ]
    }],
    logEntry: `${stats.currentDay}일차: 작물에 정체불명 '검은 역병' 확산.`
  }),
  // New Report 15 (Cultural: Bardic Competition)
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 문화 보고입니다. 전국 각지의 음유시인들이 수도에 모여 '왕실 음유시인 경연대회'를 열 것을 청원했습니다. 백성들의 문화생활에 활력을 불어넣을 기회가 될 것입니다.`,
    reportItems: [
      { title: "왕실 음유시인 경연대회 제안", text: "유명 음유시인 '음유의 로제'가 왕국의 번영을 기리고 예술을 장려하기 위해 대규모 경연대회 개최를 건의했습니다.", category: ReportItemCategory.CULTURE },
      { title: "문화적 파급 효과", text: "경연대회는 백성들의 지친 일상에 활력을 불어넣고, 왕국의 문화적 수준을 대외적으로 과시할 수 있는 좋은 기회가 될 것입니다.", category: ReportItemCategory.SOCIAL },
      { title: "경연대회 비용", text: "성공적인 경연대회 개최를 위해서는 왕실 지원금 70 골드와 상당량의 식량이 필요합니다.", category: ReportItemCategory.FINANCE },
    ],
    statChanges: { food: -Math.floor(stats.population * 0.1) },
    newAlerts: [{
        title: "왕실 음유시인 경연대회 개최",
        description: "백성들의 문화생활과 왕국의 예술 발전을 위해 음유시인 경연대회 개최를 승인하시겠습니까?",
        alertType: "CULTURAL_EVENT" as UrgentAlert['alertType'],
        choices: [
            { id: "bardic_competition_approve", text: "경연대회 개최를 승인한다 (-70 금, +12 행복도)", tooltip:"문화 발전에 기여하고 백성들을 기쁘게 합니다."},
            { id: "bardic_competition_sponsor_small", text: "소규모로 후원하여 참가한다 (-30 금, +5 행복도)", tooltip:"비용을 절약하면서도 참여합니다."},
            { id: "bardic_competition_reject", text: "경연대회 개최를 거절한다 (-5 행복도, -2 질서)", tooltip:"재정을 아끼지만, 문화생활을 기대하던 백성들의 실망이 큽니다."}
        ]
    }],
    logEntry: `${stats.currentDay}일차: 왕실 음유시인 경연대회 개최 제안.`
  }),
  // --- NEW UNIQUE REPORTS END HERE ---
  // Add a new report with beneficial resources
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 보고입니다. 오늘은 모든 것이 순조롭게 진행되었습니다. 백성들은 평화롭게 일상을 영위하고 있으며, 왕국의 자원 관리가 안정적으로 이루어지고 있습니다. "${goal}" 목표를 향해 착실히 나아가고 있습니다.`,
    reportItems: [
      { title: "자원 관리 성과", text: "왕국의 자원 관리가 효율적으로 이루어져 금고와 식량 창고에 여유가 생겼습니다.", category: ReportItemCategory.RESOURCES },
      { title: "백성들의 일상", text: "백성들은 평화로운 일상을 보내고 있으며, 왕실에 대한 충성심이 돋보입니다.", category: ReportItemCategory.SOCIAL },
      { title: "안정적인 통치", text: "폐하의 현명한 결정으로 왕국은 안정적인 통치 체제를 유지하고 있습니다.", category: ReportItemCategory.INTERNAL_AFFAIRS },
    ],
    statChanges: { gold: 70, food: 80, citizenHappiness: 3, publicOrder: 2 },
    logEntry: `${stats.currentDay}일차: 자원 관리 개선 (+70 금, +80 식량). 백성들의 행복도와 질서가 향상되었습니다.`
  }),
];

const getMockEventOutcome = (stats: KingdomStats, event: ActiveEvent, choice: PlayerChoice): GeneratedEventOutcome => {
  let outcome: GeneratedEventOutcome = {
    narrative: "결정이 내려졌습니다...",
    statChanges: {},
    logEntry: `사건 "${event.title}"에 대해 "${choice.text}"를 선택했습니다.`
  };

  // Use a consistent ID suffix for duplicated choices if they exist, or original if not
  // The 'dup' suffix is removed as all previous 'dup' entries are now replaced by unique events.
  const choiceIdBase = choice.id; 

  switch (event.alertType) {
    case "BANDIT_ACTIVITY":
      if (choiceIdBase === "dispatch_troops_bandits") {
        outcome = {
          narrative: "폐하의 명령으로 출정한 왕국군이 '그림자 형제단'이라는 조직적인 도적 집단을 상대로 치열한 전투를 벌였습니다! 숨겨진 요새까지 찾아내 성공적으로 점령했으며, 탈취된 보물과 무기를 회수했습니다. 백성들은 환호하고 있지만, 전투에서 희생된 병사들도 있습니다.",
          statChanges: { gold: -10, militaryStrength: Math.random() < 0.7 ? -3 : -5, citizenHappiness: 12, publicOrder: 8 },
          logEntry: "그림자 형제단 토벌 성공! (금 -10, 군사력 소모, 행복도 +12, 질서 +8). 도적단 소탕 완료."
        };
      } else if (choiceIdBase === "pay_off_bandits") {
        outcome = {
          narrative: "왕국의 비밀 협상가를 통해 그림자 형제단의 두목과 접촉하여 거액의 금을 지불하고 일시적 평화 협정을 맺었습니다. 그들은 당분간 왕국 영토에서 약탈을 중단하기로 했지만, 그 대가로 국고가 상당히 축났습니다. 어둠 속에서 나눈 약속이 얼마나 지속될지는 미지수입니다.",
          statChanges: { gold: -130, citizenHappiness: -1, publicOrder: 0 },
          logEntry: "그림자 형제단과 비밀 협상 체결 (금 -130, 행복도 -1). 일시적 평화 확보.",
          followUpAlert: Math.random() < 0.2 ? {
             title: "배신의 그림자",
             description: "그림자 형제단이 약속을 어기고 은밀하게 국경 마을들을 습격하기 시작했습니다! 이전보다 더 교묘한 방식으로 약탈하고 있어 추적이 어렵습니다. 백성들은 왕실이 도적들과 거래했다는 소문에 분노하고 있습니다.",
             alertType: "BANDIT_ACTIVITY",
             choices: [
                { id: "dispatch_elite_troops", text: "정예부대를 파견하여 완전 소탕한다 (-80 금, -15 군사력)", tooltip: "더 큰 손실을 각오하고 완전 소탕합니다."},
                { id: "hire_mercenary_hunters", text: "용병 현상금 사냥꾼을 고용한다 (-120 금)", tooltip: "외부 전문가의 도움을 받아 은밀히 제거합니다."}
             ]
          } : undefined
        };
      } else { // ignore_bandits
        outcome = {
          narrative: "그림자 형제단의 위협을 방관하기로 결정하셨습니다. 도적들은 이를 약점으로 인식하여 더욱 대담해졌고, 마을들은 자체 민병대를 조직하기 시작했습니다. 세금 징수가 어려워지고 교역로가 위험해지면서 경제적 타격이 커지고 있습니다.",
          statChanges: { citizenHappiness: -8, publicOrder: -6, food: -40, gold: -35 },
          logEntry: "그림자 형제단 방치 (행복도 -8, 질서 -6, 식량/금 감소). 자체 방어에 나선 마을들."
        };
      }
      break;
    case "FOOD_SHORTAGE":
      if (choiceIdBase === "import_food_emergency") {
        outcome = {
          narrative: "폐하의 결단으로 긴급하게 수입된 식량이 배급되기 시작했습니다. 이웃 왕국의 상인들은 높은 가격을 요구했지만, 기근의 위기를 막는 것이 최우선이었습니다. 백성들은 식량이 도착하자 환호했고, 왕실의 배려에 감사해하고 있습니다.",
          statChanges: { gold: -150, food: 400, citizenHappiness: 10 }, // 식량 보상 증가, 행복도 보상 추가
          logEntry: "식량 위기: 외국에서 긴급 식량 수입 (-150 금, +400 식량). 백성들이 왕실의 신속한 대처에 감사하고 있습니다."
        };
      } else if (choiceIdBase === "ration_food") {
        outcome = {
          narrative: "엄격한 식량 배급 체계가 시행되었습니다. 모든 가정은 인원수에 따라 정해진 양만 받을 수 있으며, 군인들이 배급소를 지키고 있습니다. 백성들은 불만을 표하지만, 식량이 더 이상 줄어들지 않게 되었습니다.",
          statChanges: { citizenHappiness: -10, publicOrder: -5, food: 50 }, // 식량 보상 추가
          followUpAlert: Math.random() < 0.3 ? {
            title: "배급 체계 개선 제안",
            description: "식량 위원회에서 현재의 배급 체계를 개선할 수 있는 방안을 제시했습니다. 추가 비용이 들지만 백성들의 불만을 줄일 수 있습니다.",
            alertType: "SOCIAL",
            choices: [
              { id: "improve_ration", text: "배급 체계 개선 (-50 금, +5 행복도)", tooltip: "추가 비용을 들여 배급 효율을 높입니다." },
              { id: "maintain_ration", text: "현재 체계 유지", tooltip: "추가 비용 없이 현 상태를 유지합니다." }
            ]
          } : undefined,
          logEntry: "식량 위기: 엄격한 배급 체계 시행. 백성들의 불만이 커졌지만 식량 소비가 감소하고 비축분이 확보되었습니다 (+50 식량)."
        };
      }
      break;
    case "TRADE_OPPORTUNITY":
      if (choiceIdBase === "accept_trade_rare") {
        outcome = {
          narrative: "오래된 해상 무역로를 따라 온 '사파이어 함대'와의 교역이 성사되었습니다! 이국적인 향신료와 장인의 직물을 획득하고, 우리 왕국의 식량과 금을 교환했습니다. 이 교역으로 시장이 활기를 띠고 백성들은 새로운 상품에 열광하고 있습니다.",
          statChanges: { food: 180, gold: -120, citizenHappiness: 4 },
          logEntry: "사파이어 함대와 교역 성사 (식량 +180, 금 -120, 행복도 +4). 이국적 상품 유입."
        };
      } else if (choiceIdBase === "decline_trade_rare") {
        outcome = {
          narrative: "사파이어 함대의 교역 제안을 신중히 검토한 결과, 현 시점에서는 수용하지 않기로 결정했습니다. 제안된 조건이 왕국에 불리하다고 판단되었으며, 현 상태를 유지하는 것이 더 안전하다는 결론에 이르렀습니다.",
          statChanges: { citizenHappiness: -1 },
          logEntry: "사파이어 함대 교역 제안 거절 (행복도 -1). 신중한 경제 정책 유지."
        };
      } else if (choiceIdBase === "surplus_sell_abroad") { 
        outcome = {
          narrative: "풍요의 계절로 비축된 잉여 식량을 '황금길 카라반'에 매우 유리한 가격으로 판매했습니다! 국고가 윤택해졌고, 우리 왕국의 교역 명성이 높아졌습니다. 이웃 왕국들과의 외교 관계도 개선되어 추가적인 무역 협정 제안이 들어오고 있습니다.",
          statChanges: { gold: 120, food: -100, citizenHappiness: 2, publicOrder: 1 },
          logEntry: "잉여 식량 황금길 카라반 판매 (금 +120, 식량 -100, 행복도/질서 상승). 국제 교역 명성 상승."
        };
      } else if (choiceIdBase === "surplus_distribute_people") {
        outcome = {
          narrative: "'왕의 은혜 나눔'이라는 이름으로 풍년의 축복을 백성들과 나누었습니다. 각 마을 광장에서 식량을 무상으로 분배하고, 작은 축제가 자연스럽게 열렸습니다. 백성들은 환호하며 폐하의 자비로움을 찬양하고 있으며, 왕실에 대한 충성심이 크게 높아졌습니다.",
          statChanges: { food: -50, citizenHappiness: 8, publicOrder: 3 },
          logEntry: "왕의 은혜 나눔 행사 (식량 -50, 행복도 +8, 질서 +3). 백성들의 충성심 고취."
        };
      } else if (choiceIdBase === "surplus_store_emergency") {
        outcome = {
          narrative: "'백년 창고' 프로젝트가 시작되었습니다. 최신 보존 기술과 강화된 방어 시설을 갖춘 대규모 식량 저장고를 건설하여 미래의 위기에 대비했습니다. 비용이 소요되었지만, 이제 왕국은 어떤 재난에도 더 강한 회복력을 갖추게 되었습니다.",
          statChanges: { gold: -30, food: 0, publicOrder: 2 }, 
          logEntry: "백년 창고 프로젝트 시행 (금 -30, 질서 +2). 미래 위기 대비력 강화."
        };
      } else if (choiceIdBase === "secure_new_trade_route") {
          outcome = {
              narrative: "새로운 '운무의 땅' 교역로에 병력을 파견하여 도적떼와 괴물을 소탕하고 길을 확보했습니다. 이제 이 교역로를 통해 안정적으로 물자가 유입될 것입니다.",
              statChanges: { gold: -80, militaryStrength: 3, publicOrder: 2 },
              logEntry: "운무의 땅 교역로 보안 강화 (금 -80, 군사력 +3, 질서 +2). 새로운 무역 활성화."
          };
      } else if (choiceIdBase === "tax_new_trade_route") {
          outcome = {
              narrative: "새 교역로의 상인들에게 높은 세금을 부과했습니다. 즉각적인 재정 확보에는 성공했지만, 상인들의 불만이 커져 교역량이 기대만큼 증가하지 않을 수 있습니다.",
              statChanges: { gold: 50, citizenHappiness: -5, publicOrder: -1 },
              logEntry: "신규 교역로에 고세금 부과 (금 +50, 행복도 -5, 질서 -1). 상인 불만."
          };
      } else if (choiceIdBase === "ignore_new_trade_route") {
          outcome = {
              narrative: "새로운 교역로를 방치하기로 결정했습니다. 위험이 그대로 남아있어 상인들이 이용을 꺼리면서, 이 교역로의 잠재적 가치는 거의 실현되지 않을 것입니다.",
              statChanges: { citizenHappiness: -1, publicOrder: -1 },
              logEntry: "신규 교역로 방치 (행복도/질서 -1). 기회 상실."
          };
      }
      break;
     case "CITIZEN_UNREST":
      if (choiceIdBase === "deploy_guards" || choiceIdBase === "forceful_suppression" || choiceIdBase === "계엄령 선포 및 주동자 체포") {
        const severityMultiplier = (choiceIdBase === "forceful_suppression" || choiceIdBase === "계엄령 선포 및 주동자 체포") ? 1.5 : 1;
        outcome = {
          narrative: "수도에 경비병을 증강 배치하여 질서를 강제로 회복시켰습니다. 소요는 진정되었으나, 백성들의 불만은 여전히 남아있습니다. 일부 과격 시위대는 체포되었습니다.",
          statChanges: { publicOrder: Math.floor(15*severityMultiplier), citizenHappiness: Math.floor(-8*severityMultiplier), militaryStrength: Math.floor(-2*severityMultiplier), population: (choiceIdBase === "forceful_suppression" || choiceIdBase === "계엄령 선포 및 주동자 체포") ? -Math.floor(stats.population*0.005) : 0 },
          logEntry: `소요 진압 (공공질서 상승, 행복도 하락, 군사력 소모 ${(choiceIdBase === "forceful_suppression" || choiceIdBase === "계엄령 선포 및 주동자 체포") ? ", 인구 감소":""}).`
        };
      } else if (choiceIdBase === "address_grievances" || choiceIdBase === "lower_taxes_temp" || choiceIdBase === "긴급 구휼금 지급 및 세금 감면") {
         const goldCost = choiceIdBase === "긴급 구휼금 지급 및 세금 감면" ? -150 : -100;
         const happinessBoost = choiceIdBase === "긴급 구휼금 지급 및 세금 감면" ? 12 : 10;
         const orderBoost = choiceIdBase === "긴급 구휼금 지급 및 세금 감면" ? 6 : 5;
         outcome = {
          narrative: "폐하께서 직접 백성들의 목소리를 듣고 그들의 요구 일부를 수용하기로 하셨습니다. 국고가 소모되었지만, 민심이 크게 안정되었습니다.",
          statChanges: { gold: goldCost, citizenHappiness: happinessBoost, publicOrder: orderBoost },
          logEntry: `백성들의 요구 수용 (금 ${goldCost}, 행복도 +${happinessBoost}, 공공질서 +${orderBoost}).`
        };
      } else if (choiceIdBase === "promise_reforms") {
        outcome = {
          narrative: "폐하께서 대대적인 개혁을 약속하며 백성들을 달랬습니다. 당장의 위기는 넘겼지만, 약속이 지켜지지 않으면 더 큰 실망을 안겨줄 수 있습니다.",
          statChanges: { citizenHappiness: 3, publicOrder: -3 },
          logEntry: "개혁 약속으로 민심 수습 시도 (행복도 +3, 질서 -3).",
          followUpAlert: Math.random() < 0.5 ? {
            title: "개혁 요구 시위",
            description: "폐하께서 약속했던 개혁이 지지부진하자, 백성들이 다시 거리로 나와 약속 이행을 촉구하고 있습니다. 이번에는 더욱 조직적인 모습입니다.",
            alertType: "CITIZEN_UNREST",
            choices: [
              {id: "fulfill_promises_costly", text: "약속 이행 (대규모 비용 지출: -200금, 행복도 +15, 질서 +7)", tooltip:"큰 비용으로 신뢰를 회복합니다."},
              {id: "delay_again_suppress", text: "또다시 지연 및 강경 대응 (행복도 -10, 질서 -5, 군사력 -3)", tooltip:"신뢰를 완전히 잃을 수 있습니다."}
            ]
          } : undefined
        };
      } else if (choiceIdBase === "movement_suppress") {
        outcome = {
          narrative: "새로운 사상을 불온한 것으로 규정하고 강력히 탄압했습니다. 표면적인 질서는 회복되었으나, 지식인층과 젊은이들 사이에서 반감이 커지고 있습니다.",
          statChanges: { publicOrder: 5, citizenHappiness: -10, population: -Math.floor(stats.population*0.002) },
          logEntry: "신흥 사상 탄압 (질서 +5, 행복도 -10, 인구 소폭 감소)."
        };
      } else if (choiceIdBase === "movement_debate") {
        const debateSuccess = Math.random() < 0.5;
        outcome = {
          narrative: `공개 토론회가 열렸습니다. ${debateSuccess ? "왕당파 논객들의 활약으로 새로운 사상의 허점이 드러나고, 백성들은 다시 왕실의 현명함에 찬사를 보냈습니다." : "오히려 새로운 사상의 논리가 백성들에게 더 큰 설득력을 얻으며, 기존 체제에 대한 의구심만 커졌습니다."}`,
          statChanges: { publicOrder: debateSuccess? 2: -4, citizenHappiness: debateSuccess? 5: -5 },
          logEntry: `신흥 사상 공개 토론회 개최. ${debateSuccess ? "성공적으로 여론을 다독였습니다." : "오히려 역효과를 낳았습니다."}`
        };
      } else if (choiceIdBase === "movement_partially_accept") {
        outcome = {
          narrative: "새로운 사상의 일부 긍정적인 주장을 받아들여 점진적인 개혁을 추진하기로 했습니다. 귀족들의 일부 반발이 있지만, 백성들은 대체로 환영하는 분위기입니다.",
          statChanges: { citizenHappiness: 4, publicOrder: 2, gold: -50 },
          logEntry: "신흥 사상 일부 수용 및 개혁 추진 (행복도/질서 상승, 금 -50)."
        };
      }
      break;
    case "RESOURCE_DISCOVERY":
      if ((!event.choices || event.choices.length === 0)) { 
         outcome = {
          narrative: `새로운 ${event.title.includes("광맥") ? "광맥" : "자원"}이 발견되었다는 보고입니다! 즉시 개발에 착수하여 왕국의 부를 증진시킬 수 있습니다.`,
          statChanges: { gold: event.title.includes("금광") ? 150 : 80, food: event.title.includes("약초") ? 50: 10 },
          logEntry: `자원 발견: ${event.title}! (금/식량 증가).`,
           followUpAlert: {
            title: `신규 ${event.title.includes("광맥") ? "광산" : "자원지"} 개발`,
            description: `새롭게 발견된 ${event.title}을(를) 본격적으로 개발하시겠습니까? 개발에는 초기 투자 비용이 필요하지만, 장기적으로 왕국에 큰 이득을 가져다 줄 것입니다.`,
            alertType: "RESOURCE_DISCOVERY", 
            choices: [
              { id: "develop_resource_site_full", text: "전면 개발 착수 (-150 금, 향후 지속적 수입 기대)", tooltip: "장기적인 이득을 위해 투자합니다." },
              { id: "develop_resource_site_limited", text: "제한적/시험적 개발 (-70 금, 향후 소규모 수입 기대)", tooltip: "소규모로 시작하여 위험을 줄입니다." },
              { id: "delay_resource_development", text: "개발 보류 (기회 상실 위험)", tooltip: "지금은 투자하지 않습니다." }
            ]
          }
        };
      } else { 
          if (choiceIdBase === "develop_resource_site_full" || choiceIdBase === "develop_mine") {
              outcome = {
                  narrative: "새로운 자원지에 대한 전면 개발이 시작되었습니다. 막대한 초기 비용이 투입되었지만, 곧 왕국에 풍요를 가져다 줄 것입니다!",
                  statChanges: { gold: -150, publicOrder: 1 }, 
                  logEntry: "신규 자원지 전면 개발 착수 (금 -150). 미래를 위한 투자."
              };
          } else if (choiceIdBase === "develop_resource_site_limited") {
              outcome = {
                  narrative: "새로운 자원지에 대한 제한적인 개발이 시작되었습니다. 초기 비용은 절감했지만, 수확량도 그만큼 적을 것입니다.",
                  statChanges: { gold: -70, publicOrder: 1 },
                  logEntry: "신규 자원지 제한적 개발 (금 -70)."
              };
          } else if (choiceIdBase === "delay_resource_development" || choiceIdBase === "delay_mine_development") {
              outcome = {
                  narrative: "새로운 자원지 개발을 보류하기로 결정했습니다. 당장의 재정은 아꼈지만, 귀중한 기회를 놓쳤을 수도 있습니다.",
                  statChanges: { citizenHappiness: -1 },
                  logEntry: "신규 자원지 개발 보류. 기회비용 발생 가능성."
              };
          } else if (choiceIdBase === "resource_search_expedition") {
              const success = Math.random() < 0.6; 
              outcome = {
                  narrative: success ? "탐사대가 새로운 광맥을 발견했다는 낭보입니다! 왕국의 미래가 밝습니다." : "안타깝게도 탐사대는 빈손으로 돌아왔습니다. 국고만 낭비한 셈입니다.",
                  statChanges: { gold: -100 + (success ? 50 : 0) }, 
                  logEntry: success ? "광맥 탐사 성공! (금 -100, 즉시 소량 발견)" : "광맥 탐사 실패. (금 -100)",
                  followUpAlert: success ? {
                      title: "신규 광맥 개발",
                      description: "새롭게 발견된 광맥을 개발하시겠습니까?",
                      alertType: "RESOURCE_DISCOVERY",
                       choices: [
                          { id: "develop_mine", text: "광산 개발 착수 (-150 금)", tooltip: "장기적인 이득을 위해 투자합니다." },
                          { id: "delay_mine_development", text: "개발 보류", tooltip: "지금은 투자하지 않습니다." }
                       ]
                  } : undefined
              };
          } else if (choiceIdBase === "resource_invest_alternative_tech") {
               const success = Math.random() < 0.4; 
                outcome = {
                  narrative: success ? "수년간의 연구 끝에 마침내 주석을 대체할 수 있는 신소재 '왕실 강철' 개발에 성공했습니다! 군수품 생산이 정상화될 것입니다." : "신소재 연구는 별다른 성과 없이 예산만 탕진했습니다. 다른 방법을 찾아야 합니다.",
                  statChanges: { gold: -80, militaryStrength: success ? 3: -2 },
                  logEntry: success ? "대체 신소재 개발 성공! (금 -80, 군사력 +3)" : "대체 신소재 개발 실패. (금 -80, 군사력 -2)"
              };
          } else if (choiceIdBase === "resource_import_metal") {
              outcome = {
                  narrative: " 막대한 비용을 치르고 외국에서 주석을 긴급 수입했습니다. 군수품 생산은 계속될 수 있지만, 재정에 큰 부담입니다.",
                  statChanges: { gold: -150, militaryStrength: 1 }, 
                  logEntry: "주석 긴급 수입 (금 -150, 군사력 +1). 재정 압박."
              };
          }
      }
      break;
    case "SCIENTIFIC_BREAKTHROUGH":
      if (choiceIdBase === "invest_new_tech_full") {
        outcome = {
          narrative: "폐하의 현명한 결정으로 신기술에 대한 전폭적인 투자가 이루어졌습니다! 수년 내에 왕국은 이 기술의 혜택을 누리게 될 것입니다. 학자들이 폐하의 지원에 감사하고 있습니다.",
          statChanges: { gold: -250, citizenHappiness: 3 }, 
          logEntry: "신기술 전폭 투자 (금 -250, 행복도 +3). 미래 식량 생산량 대폭 증가 기대."
        };
      } else if (choiceIdBase === "invest_new_tech_partial") {
         outcome = {
          narrative: "신기술에 대한 부분적인 시범 도입이 결정되었습니다. 초기 비용은 줄였지만, 효과가 왕국 전체에 미치기까지는 더 오랜 시간이 걸릴 것입니다.",
          statChanges: { gold: -100, citizenHappiness: 1 },
          logEntry: "신기술 부분 투자 (금 -100, 행복도 +1). 향후 식량 생산 소폭 증가 기대."
        };
      } else if (choiceIdBase === "reject_new_tech") { 
         outcome = {
          narrative: "신기술 투자를 보류하기로 결정하셨습니다. 학자들은 실망했지만, 왕국의 재정 안정을 우선시한 폐하의 뜻을 따르기로 했습니다.",
          statChanges: { citizenHappiness: -2 },
          logEntry: "신기술 투자 보류. (행복도 -2). 기회비용 발생."
        };
      } else if (choiceIdBase === "invest_steam_engine_full") {
          outcome = {
              narrative: "그놈 기술자의 증기 기관 개발에 전폭적으로 투자했습니다. 왕국의 산업이 혁신을 맞이할 준비를 하고 있습니다!",
              statChanges: { gold: -200, citizenHappiness: 5, publicOrder: 3 },
              logEntry: "증기 기관 전폭 투자 (금 -200, 행복도 +5, 질서 +3). 산업 혁명 시작."
          };
      } else if (choiceIdBase === "invest_steam_engine_partial") {
          outcome = {
              narrative: "증기 기관 기술에 부분적으로 투자하여 소규모 연구를 지원했습니다. 점진적인 발전을 기대할 수 있을 것입니다.",
              statChanges: { gold: -80, citizenHappiness: 2 },
              logEntry: "증기 기관 부분 투자 (금 -80, 행복도 +2)."
          };
      } else if (choiceIdBase === "reject_steam_engine") {
          outcome = {
              narrative: "그놈 기술자의 증기 기관 기술에 대한 투자를 거절했습니다. 당장은 재정을 아꼈지만, 왕국은 잠재적인 기술 혁신 기회를 놓쳤습니다.",
              statChanges: { citizenHappiness: -3 },
              logEntry: "증기 기관 투자 거절 (행복도 -3). 기회 상실."
          };
      }
      break;
    case "NATURAL_DISASTER":
      if (choiceIdBase === "disaster_relief_full") {
        outcome = {
          narrative: "폐하의 명에 따라 왕국의 모든 자원이 총동원되어 지진 피해 지역에 지원되었습니다. 많은 생명을 구하고 복구 작업이 신속하게 진행되고 있지만, 국고는 바닥을 드러내고 있습니다.",
          statChanges: { gold: -200, food: -50, citizenHappiness: 10, publicOrder: 5, population: Math.random() < 0.3 ? -10: 0 }, 
          logEntry: "지진 피해 총력 지원 (금 -200, 식량 -50, 행복도 +10, 질서 +5). 추가 인명피해 최소화."
        };
      } else if (choiceIdBase === "disaster_relief_limited") {
        outcome = {
          narrative: "제한적인 구호 물품과 자금이 피해 지역에 전달되었습니다. 최악의 상황은 면했지만, 많은 이재민이 여전히 고통받고 있으며 복구는 더딜 것입니다.",
          statChanges: { gold: -100, food: -20, citizenHappiness: 3, publicOrder: 1, population: Math.random() < 0.6 ? -20: -10 },
          logEntry: "지진 피해 제한적 지원 (금 -100, 식량 -20, 행복도 +3). 복구 더딤."
        };
      } else if (choiceIdBase === "disaster_relief_minimal") {
        outcome = {
          narrative: "폐하께서는 지진 피해 지역에 최소한의 지원만을 명하셨습니다. 많은 백성이 절망 속에 방치되었으며, 왕실에 대한 원성이 높아지고 있습니다. 추가적인 인명 피해와 질병 발생이 우려됩니다.",
          statChanges: { citizenHappiness: -15, publicOrder: -10, population: Math.random() < 0.8 ? -30: -20, food: -10 },
          logEntry: "지진 피해 최소 지원 (행복도 -15, 질서 -10, 인구 추가 감소). 민심 이반 심각."
        };
      } else if (choiceIdBase === "flood_relief_full") {
          outcome = {
              narrative: "홍수 피해 지역에 왕국의 모든 역량을 집중하여 구호 및 복구 작업을 진행했습니다. 백성들은 폐하의 자비로운 통치에 감동하며, 빠른 복구에 힘을 모으고 있습니다.",
              statChanges: { gold: -180, food: -40, citizenHappiness: 8, publicOrder: 4 },
              logEntry: "홍수 피해 총력 지원 (금 -180, 식량 -40, 행복도 +8, 질서 +4)."
          };
      } else if (choiceIdBase === "flood_relief_limited") {
          outcome = {
              narrative: "제한적인 지원이 홍수 피해 지역에 전달되었습니다. 급한 불은 껐지만, 많은 백성들이 여전히 고통받고 있으며 복구는 더딜 것입니다.",
              statChanges: { gold: -90, food: -20, citizenHappiness: 2, publicOrder: 1 },
              logEntry: "홍수 피해 제한적 지원 (금 -90, 식량 -20, 행복도 +2, 질서 +1)."
          };
      } else if (choiceIdBase === "flood_build_dams") {
          outcome = {
              narrative: "장기적인 홍수 예방을 위해 댐 건설 프로젝트를 승인했습니다. 막대한 비용이 들지만, 미래의 재난으로부터 왕국을 보호할 것입니다.",
              statChanges: { gold: -250, publicOrder: 3, citizenHappiness: 1 },
              logEntry: "댐 건설 프로젝트 시작 (금 -250, 질서 +3, 행복도 +1). 장기적 홍수 예방."
          };
      }
      break;
    case "DIPLOMATIC_ENVOY": 
      if (choiceIdBase === "accept_marriage_alliance") {
         outcome = {
          narrative: "실바니아 왕국과의 혼인 동맹이 성사되었습니다! 막대한 지참금이 국고를 채우고, 양국 간의 우호 관계가 더욱 공고해졌습니다. 온 백성이 이 경사를 축하하고 있습니다.",
          statChanges: { gold: 100, militaryStrength: 5, citizenHappiness: 5, publicOrder: 2 }, 
          logEntry: "실바니아와 혼인 동맹 체결! (금 +100, 군사력 +5, 행복도 +5). 외교적 승리."
        };
      } else if (choiceIdBase === "decline_marriage_alliance_politely") {
        outcome = {
          narrative: "실바니아의 혼인 제안을 정중히 거절했습니다. 사절단은 아쉬움을 표했지만, 표면적으로는 우호적인 관계를 유지하기로 했습니다. 하지만 양국 사이에 미묘한 긴장감이 감돌고 있습니다.",
          statChanges: { citizenHappiness: -1, publicOrder: -1 },
          logEntry: "혼인 동맹 정중히 거절. 실바니아와 관계 소폭 냉각."
        };
      } else if (choiceIdBase === "decline_marriage_alliance_firmly") {
        outcome = {
          narrative: "실바니아의 혼인 제안을 단호히 거절하고 사절단을 사실상 추방했습니다. 실바니아 왕실은 이를 모욕으로 받아들였으며, 양국 관계는 급격히 악화되었습니다. 국경에 전운이 감돌고 있습니다.",
          statChanges: { citizenHappiness: -5, publicOrder: -3, militaryStrength: -2 }, 
          logEntry: "혼인 동맹 단호히 거절 및 사절단 추방. 실바니아와 관계 급랭, 전쟁 위기 고조.",
            followUpAlert: Math.random() < 0.6 ? {
                title: "실바니아의 보복 위협",
                description: "혼인 동맹 거절에 격분한 실바니아 왕국이 국경에 병력을 집결시키며 무력 시위를 벌이고 있다는 첩보입니다. 그들은 공식적으로 사과와 배상을 요구하고 있습니다.",
                alertType: "BORDER_DISPUTE",
                choices: [
                    {id: "diplomacy_appease", text: "사과하고 배상한다 (-100 금, 관계 정상화 시도)", tooltip: "굴욕을 감수하고 평화를 유지합니다."},
                    {id: "diplomacy_stand_firm", text: "요구를 일축하고 국방 태세를 강화한다 (+5 군사력, -50 금, 전쟁 발발 가능성)", tooltip: "강대강으로 맞섭."}
                ]
            } : undefined
        };
      } else if (choiceIdBase === "meet_traveler") { 
        const interestingInfo = Math.random() < 0.5;
        outcome = {
            narrative: interestingInfo ? "수수께끼의 여행자는 사실 이웃나라의 밀사였습니다! 그는 귀중한 정보와 함께 작은 선물을 전달했습니다." : "여행자는 단순히 길을 잃은 방랑객으로 밝혀졌습니다. 별다른 소득은 없었습니다.",
            statChanges: { gold: interestingInfo ? 20 : -5, citizenHappiness: interestingInfo ? 1 : 0 },
            logEntry: interestingInfo ? "여행자와의 만남: 유용한 정보 획득 (금 +20)" : "여행자와의 만남: 별다른 소득 없음 (금 -5)"
        };
      } else if (choiceIdBase === "ignore_traveler") {
         outcome = {
            narrative: "수수께끼의 여행자는 별다른 주목을 받지 못하고 며칠 뒤 수도를 떠났습니다.",
            statChanges: {},
            logEntry: "수수께끼의 여행자 무시."
        };
      }
      break;
    case "PLAGUE_OUTBREAK":
      if (choiceIdBase === "plague_quarantine_city") {
        const success = Math.random() < 0.7; 
        outcome = {
          narrative: `수도 엘도리아 시가 전면 봉쇄되고 감염자 격리 조치가 시행되었습니다. ${success ? "강력한 조치 덕분에 역병의 확산세가 눈에 띄게 줄었습니다." : "봉쇄에도 불구하고 역병은 계속해서 퍼져나가고 있으며, 봉쇄된 도시 내부에서는 폭동 직전의 상황입니다."}`,
          statChanges: { gold: -100, citizenHappiness: success ? -10 : -20, publicOrder: success ? 5 : -10, population: success ? -Math.floor(stats.population*0.03) : -Math.floor(stats.population*0.08) },
          logEntry: `역병 대응: 수도 봉쇄. ${success ? "확산 둔화 성공." : "봉쇄 실패, 상황 악화."}`
        };
      } else if (choiceIdBase === "plague_research_cure") {
        const success = Math.random() < 0.3; 
        outcome = {
          narrative: `왕실의 모든 지원이 치료법 연구에 투입되었습니다. ${success ? "몇 달간의 필사적인 연구 끝에 마침내 치료제가 개발되었습니다! 왕국은 구원받았습니다!" : "막대한 자금을 쏟아부었지만, 치료법 개발은 실패로 돌아갔습니다. 역병은 계속해서 희생자를 만들고 있습니다."}`,
          statChanges: { gold: -150, citizenHappiness: success ? 20 : -10, population: success ? -Math.floor(stats.population*0.05) : -Math.floor(stats.population*0.15) },
          logEntry: `역병 대응: 치료법 연구. ${success ? "치료제 개발 성공!" : "치료제 개발 실패."}`,
          followUpAlert: success ? {
            title: "역병 생존자 지원",
            description: "역병은 지나갔지만, 많은 이들이 가족과 건강을 잃었습니다. 생존자들을 위한 지원 정책이 필요합니다.",
            alertType: "SOCIAL" as UrgentAlert['alertType'], 
            choices: [
                {id: "survivor_support_full", text: "생존자 지원 기금 마련 (-100금, +10 행복도)", tooltip: "국가가 그들을 보살핍니다."},
                {id: "survivor_support_minimal", text: "최소한의 위로금 지급 (-30금, +3 행복도)", tooltip: "생색만 냅니다."}
            ]
          } : undefined
        };
      } else { // plague_pray_and_wait
        outcome = {
          narrative: "폐하께서는 신께 기도하며 역병이 물러가기만을 기다리기로 하셨습니다. 매일 수많은 백성이 죽어나가고 있으며, 왕국의 기반이 뿌리째 흔들리고 있습니다. 신은 응답하지 않는 것 같습니다.",
          statChanges: { citizenHappiness: -25, publicOrder: -15, population: -Math.floor(stats.population*0.20), gold: -50, food: -Math.floor(stats.food*0.2) },
          logEntry: "역병 대응: 기도와 방관. 왕국 붕괴 위기."
        };
      }
      break;
    case "MERCHANT_GUILD_DEMANDS":
      if (choiceIdBase === "guild_accept_demands") {
        outcome = {
          narrative: "상인 조합의 요구를 전면 수용했습니다. 단기적으로 세수 감소가 예상되지만, 상인들은 크게 만족하며 왕국 경제에 더욱 활발히 기여할 것을 약속했습니다. 일부 귀족들은 불만을 표합니다.",
          statChanges: { gold: -Math.floor(stats.gold*0.1), citizenHappiness: 3, publicOrder: -2, militaryStrength: 1 }, 
          logEntry: "상인 조합 요구 수용 (세수 감소, 행복도 +3, 질서 -2). 경제 구조 변화."
        };
      } else if (choiceIdBase === "guild_negotiate_terms") {
         outcome = {
          narrative: "상인 조합과의 힘겨운 협상 끝에 절충안을 마련했습니다. 양측 모두 완전히 만족하지는 못했지만, 파국은 피했습니다. 왕국 경제는 점진적인 변화를 맞이할 것입니다.",
          statChanges: { gold: -Math.floor(stats.gold*0.05), citizenHappiness: 1 },
          logEntry: "상인 조합과 협상 타결 (세수 소폭 감소, 행복도 +1)."
        };
      } else { // guild_reject_demands_firmly
         outcome = {
          narrative: "상인 조합의 요구를 단호히 거절했습니다. 왕실의 권위는 지켜냈지만, 상인들은 크게 반발하며 일부는 교역 활동을 중단하겠다고 선언했습니다. 경제에 한파가 몰아칠 수 있습니다.",
          statChanges: { publicOrder: -5, citizenHappiness: -3, gold: Math.floor(stats.gold*0.02) }, 
          logEntry: "상인 조합 요구 거절 (질서 -5, 행복도 -3). 교역 위축 우려."
        };
      }
      break;
    case "CULTURAL_FESTIVAL_REQUEST":
      if (choiceIdBase === "approve_festival_grand") {
        outcome = {
          narrative: "폐하의 명으로 온 왕국이 참여하는 성대한 축제가 열렸습니다! 며칠 밤낮으로 노랫소리가 끊이지 않았고, 백성들은 모든 시름을 잊고 폐하의 통치를 찬양했습니다.",
          statChanges: { gold: -150, citizenHappiness: 15, publicOrder: 3, food: -Math.floor(stats.population * 0.05) },
          logEntry: "성대한 번영 축제 개최! (금 -150, 행복도 +15, 질서 +3, 식량 소비)"
        };
      } else if (choiceIdBase === "approve_festival_modest") {
        outcome = {
          narrative: "검소하지만 의미있는 축제가 열렸습니다. 백성들은 잠시나마 즐거운 시간을 보냈고, 왕실에 감사함을 표했습니다.",
          statChanges: { gold: -70, citizenHappiness: 7, publicOrder: 1, food: -Math.floor(stats.population * 0.02) },
          logEntry: "검소한 번영 축제 개최 (금 -70, 행복도 +7, 식량 소비)."
        };
      } else if (choiceIdBase === "reject_festival") {
        outcome = {
          narrative: "축제 제안을 거절했습니다. 상인 조합과 백성들은 다소 실망했지만, 폐하의 결정을 존중하기로 했습니다. 절약된 예산은 다른 곳에 유용하게 쓰일 것입니다.",
          statChanges: { citizenHappiness: -3 },
          logEntry: "번영 축제 제안 거절 (행복도 -3)."
        };
      } else if (choiceIdBase === "approve_harvest_festival") {
          outcome = {
              narrative: "황금 이삭 축제가 성대하게 개최되었습니다. 백성들은 풍요와 폐하의 은혜에 감사하며 축제를 즐겼고, 왕국 전체에 활기가 넘쳤습니다.",
              statChanges: { gold: -80, citizenHappiness: 10, publicOrder: 3, food: -Math.floor(stats.population * 0.03) },
              logEntry: "황금 이삭 축제 성대히 개최 (금 -80, 행복도 +10, 질서 +3, 식량 소비)."
          };
      } else if (choiceIdBase === "approve_harvest_festival_modest") {
          outcome = {
              narrative: "황금 이삭 축제가 간소하게 개최되었습니다. 큰 비용 없이 백성들의 사기를 북돋아 주었습니다.",
              statChanges: { gold: -30, citizenHappiness: 5, publicOrder: 1, food: -Math.floor(stats.population * 0.01) },
              logEntry: "황금 이삭 축제 간소하게 개최 (금 -30, 행복도 +5, 질서 +1, 식량 소비)."
          };
      } else if (choiceIdBase === "reject_harvest_festival") {
          outcome = {
              narrative: "황금 이삭 축제 개최를 거절했습니다. 백성들은 실망했지만, 폐하의 재정적 판단을 이해하려 노력했습니다.",
              statChanges: { citizenHappiness: -5 },
              logEntry: "황금 이삭 축제 거절 (행복도 -5)."
          };
      }
      break;
    case "BORDER_DISPUTE":
        if(choiceIdBase === "reinforce_border"){
            outcome = {
                narrative: "국경 수비대를 즉시 증원하고 방어 태세를 강화했습니다. 적들이 감히 도발하지 못할 것입니다.",
                statChanges: { gold: -50, militaryStrength: 5, publicOrder: 1 },
                logEntry: "국경 수비 강화 (금 -50, 군사력 +5)."
            };
        } else if (choiceIdBase === "send_diplomat_border"){
            const success = Math.random() < 0.6;
            outcome = {
                narrative: success ? "파견된 외교관의 뛰어난 협상 능력으로 국경의 긴장이 완화되고, 오해가 풀렸습니다." : "외교관은 별다른 성과 없이 돌아왔습니다. 상대는 여전히 적대적입니다.",
                statChanges: { gold: -20, citizenHappiness: success ? 1 : -1 },
                logEntry: success ? "외교적 해결 성공 (금 -20)." : "외교적 해결 실패 (금 -20)."
            };
        } else if (choiceIdBase === "prepare_for_war") {
            outcome = {
                narrative: "왕국 전체에 전쟁 준비 태세가 선포되었습니다. 병사들이 훈련에 매진하고 군수품이 비축되고 있지만, 백성들은 전쟁의 공포에 떨고 있습니다.",
                statChanges: { gold: -100, militaryStrength: 10, citizenHappiness: -5, publicOrder: -2 },
                logEntry: "전쟁 준비 태세 돌입 (금 -100, 군사력 +10, 행복도 -5)."
            };
        } else if (choiceIdBase === "diplomacy_appease") { 
            outcome = {
                narrative: "실바니아 왕국에 공식적으로 사과하고 요구한 배상금을 지불했습니다. 굴욕적이지만, 일단 전쟁의 위협은 사라졌습니다.",
                statChanges: { gold: -100, citizenHappiness: -3, militaryStrength: -1 },
                logEntry: "실바니아에 사과 및 배상 (금 -100, 행복도 -3). 굴욕적인 평화."
            };
        } else if (choiceIdBase === "diplomacy_stand_firm") { 
             const warAvoided = Math.random() < 0.4;
             outcome = {
                narrative: warAvoided ? "우리의 단호한 태도에 실바니아 왕국이 결국 한발 물러섰습니다. 전쟁은 피했지만, 양국 관계는 최악으로 치달았습니다." : "실바니아 왕국이 최후통첩을 보내왔습니다. 이제 전쟁은 피할 수 없을 것 같습니다!",
                statChanges: { gold: -50, militaryStrength: 5, citizenHappiness: warAvoided? 2: -8, publicOrder: warAvoided? 1 : -5 },
                logEntry: warAvoided ? "강경 대응 성공, 전쟁 회피 (금 -50, 군사력 +5)" : "강경 대응, 실바니아 최후통첩. 전쟁 임박. (금 -50, 군사력 +5, 행복도/질서 하락)",
             };
        }
        break;
    case "SPY_CAUGHT":
        if (choiceIdBase === "spy_interrogate_execute") {
            const infoGained = Math.random() < 0.7;
            outcome = {
                narrative: `첩자는 고문 끝에 ${infoGained ? "중요한 군사 정보를 자백하고" : "별다른 정보를 내놓지 못하고"} 처형되었습니다. 그의 죽음은 다른 첩자들에게 경고가 될 것입니다.`,
                statChanges: { publicOrder: 5, citizenHappiness: -3, gold: infoGained? 20: 0 }, 
                logEntry: `첩자 처형 (질서 +5, 행복도 -3). ${infoGained? "중요 정보 획득.": "별 소득 없음."}`
            };
        } else if (choiceIdBase === "spy_ransom_exchange") {
             outcome = {
                narrative: "어둠숲 부족과의 협상 끝에 첩자의 몸값으로 상당한 금을 받거나, 우리 측 포로와 교환했습니다. 실리적인 선택이었지만, 첩자를 풀어준 것에 대한 비판도 있습니다.",
                statChanges: { gold: Math.random() < 0.5 ? 80: -30, militaryStrength: Math.random() < 0.3 ? 3: 0, citizenHappiness: -1 }, 
                logEntry: "첩자 몸값/포로 교환 협상. (금 변동, 행복도 -1)."
            };
        } else if (choiceIdBase === "spy_turn_double_agent") {
            const success = Math.random() < 0.3;
            outcome = {
                narrative: success ? "첩자를 성공적으로 회유하여 우리의 이중첩자로 만들었습니다! 이제 어둠숲 부족의 내부 정보를 손쉽게 얻을 수 있게 되었습니다." : "회유 시도는 실패로 돌아갔고, 첩자는 감옥에서 자결했습니다. 중요한 정보를 얻을 기회를 놓쳤습니다.",
                statChanges: { publicOrder: success? 2 : -1, gold: success? 50 : -10 },
                logEntry: success ? "이중첩자 확보 성공! (질서 +2, 금 +50)" : "이중첩자 확보 실패. (질서 -1, 금 -10)"
            };
        }
        break;
     case "FINANCE": // Generic finance alert from dynamic generation
        if(choiceIdBase === "sell_crown_jewels"){
            outcome = {
                narrative: "왕실의 권위를 상징하는 보물 일부가 매각되어 급한 재정 문제를 해결했습니다. 귀족들 사이에서는 불만의 목소리가 나옵니다.",
                statChanges: {gold: 100, citizenHappiness: -2, publicOrder: -1}, // Happiness drop mainly for nobles/image
                logEntry: "왕실 보물 매각으로 자금 확보 (+100 금, 행복도/질서 소폭 하락)."
            }
        } else if (choiceIdBase === "delay_payment_promise_bonus") {
            outcome = {
                narrative: "군인들과 관리들에게 봉급 지급을 연기하고 추후 보너스를 약속했습니다. 당장은 넘어갔지만, 약속이 지켜지지 않으면 큰 혼란이 올 수 있습니다.",
                statChanges: {militaryStrength: -1, publicOrder: -2, citizenHappiness: -1}, // Military 사기 = militaryStrength
                logEntry: "봉급 지급 연기 및 보너스 약속 (군사력/질서/행복도 하락)."
            }
        }
        break;

    // --- NEW EVENT OUTCOMES START HERE ---
    case "INFRASTRUCTURE_PROJECT":
        if (choiceIdBase === "build_grand_library_full") {
            outcome = {
                narrative: "폐하의 전폭적인 지원으로 엘도리아 대도서관 건설이 시작되었습니다! 수많은 장인과 학자들이 참여하며 왕국의 상징이 될 건축물을 만들고 있습니다.",
                statChanges: { gold: -300, citizenHappiness: 10, publicOrder: 5 },
                logEntry: "엘도리아 대도서관 건설 시작 (금 -300, 행복도 +10, 질서 +5)."
            };
        } else if (choiceIdBase === "build_grand_library_delay") {
            outcome = {
                narrative: "재정 상황을 고려해 대도서관 건설을 보류했습니다. 학자들은 실망했지만, 왕국의 안정적인 재정을 우선시한 폐하의 결정을 따르기로 했습니다.",
                statChanges: { citizenHappiness: -3, gold: 10 },
                logEntry: "엘도리아 대도서관 건설 보류 (행복도 -3, 금 +10)."
            };
        } else if (choiceIdBase === "build_grand_library_reject") {
            outcome = {
                narrative: "대도서관 건설 계획을 완전히 철회했습니다. 학자들과 지식인층이 크게 반발하고 있으며, 왕국의 문화적 명성에 타격이 있을 수 있습니다.",
                statChanges: { citizenHappiness: -7, publicOrder: -2 },
                logEntry: "엘도리아 대도서관 건설 철회 (행복도 -7, 질서 -2). 명성 하락."
            };
        }
        break;
    case "EXPLORATION_DISCOVERY":
        if (choiceIdBase === "explore_ancient_ruins_full") {
            const success = Math.random() < 0.6;
            outcome = {
                narrative: success ? "왕립 탐험대가 고대 유적의 심층부에서 마법이 깃든 유물과 귀중한 고대 지식을 발견했습니다! 이는 왕국의 기술 발전과 부에 큰 기여를 할 것입니다." : "탐사대는 고대 유적의 깊은 함정과 미지의 존재들로 인해 큰 피해를 입고 돌아왔습니다. 유물은커녕 많은 인력과 자금만 낭비했습니다.",
                statChanges: { gold: -50, militaryStrength: success ? 0 : -5, citizenHappiness: success ? 8 : -4, publicOrder: success ? 2 : -2 },
                logEntry: `고대 유적 전폭 탐사. ${success ? "성공적으로 유물/지식 획득 (군사력 소모 없음, 행복도 +8, 질서 +2)." : "실패, 큰 피해 (군사력 -5, 행복도 -4, 질서 -2)."}`
            };
        } else if (choiceIdBase === "explore_ancient_ruins_cautious") {
            const success = Math.random() < 0.8; // Cautious approach might have higher chance of minor success
            outcome = {
                narrative: success ? "신중한 탐사를 통해 고대 유적의 일부 비밀과 작은 보물을 발견했습니다. 큰 위험 없이 소기의 성과를 거두었습니다." : "유적의 입구에서 위험을 감지하고 더 이상의 진입은 포기했습니다. 큰 피해는 없었으나, 중요한 발견은 없었습니다.",
                statChanges: { gold: -20, citizenHappiness: success ? 3 : -1 },
                logEntry: `고대 유적 신중 탐사. ${success ? "소규모 이득 (행복도 +3)." : "큰 소득 없음 (행복도 -1)."}`
            };
        } else if (choiceIdBase === "abandon_ancient_ruins") {
            outcome = {
                narrative: "고대 유적의 위험성을 고려하여 탐사를 중단했습니다. 당장의 안전은 확보했지만, 잠재적인 보물과 지식을 놓쳤습니다.",
                statChanges: { citizenHappiness: -2 },
                logEntry: "고대 유적 탐사 중단 (행복도 -2). 기회 상실."
            };
        }
        break;
    case "FACTION_CONFLICT":
        if (choiceIdBase === "support_farmers") {
            outcome = {
                narrative: "폐하께서 농민들의 편을 들어 곡물 최저 가격을 보장하는 법안을 통과시켰습니다. 농민들은 크게 기뻐하며 다음 수확량 증대를 약속했지만, 상인 조합은 왕실의 결정에 불만을 표하고 있습니다.",
                statChanges: { gold: -50, citizenHappiness: 5, publicOrder: -1 },
                logEntry: "농민 편 지지 (금 -50, 행복도 +5, 질서 -1). 상인 불만."
            };
        } else if (choiceIdBase === "support_merchants") {
            outcome = {
                narrative: "상인들의 자유로운 시장 활동을 지지하고 왕실이 시장에 개입하지 않겠다는 뜻을 밝혔습니다. 상인들은 환호했지만, 농민들 사이에서는 폐하에 대한 불만이 커지고 있습니다.",
                statChanges: { gold: 20, citizenHappiness: -3, publicOrder: -1 },
                logEntry: "상인 편 지지 (금 +20, 행복도 -3, 질서 -1). 농민 불만."
            };
        } else if (choiceIdBase === "mediate_compromise") {
            outcome = {
                narrative: "폐하께서 양측을 중재하여 합의점을 찾았습니다. 곡물 가격은 소폭 상승하고, 상인들에게는 운송비 감면 혜택이 주어졌습니다. 양측 모두 완전히 만족하지는 못했지만, 큰 갈등은 피했습니다.",
                statChanges: { gold: -30, citizenHappiness: 3, publicOrder: 2 },
                logEntry: "농민-상인 갈등 중재 (금 -30, 행복도 +3, 질서 +2). 갈등 봉합."
            };
        }
        break;
    case "CRIME_CORRUPTION":
        if (choiceIdBase === "smuggling_hunt_remaining") {
            outcome = {
                narrative: "밀수 조직의 잔당을 끝까지 추적하여 완전히 소탕했습니다. 지하 경제가 정화되고 왕국의 치안이 더욱 공고해졌습니다.",
                statChanges: { gold: -40, publicOrder: 3, citizenHappiness: 1 },
                logEntry: "밀수 조직 잔당 완전 소탕 (금 -40, 질서 +3, 행복도 +1)."
            };
        } else if (choiceIdBase === "smuggling_sell_recovered_goods") {
            outcome = {
                narrative: "회수된 밀수품들이 왕실의 이름으로 시장에 공개 매각되었습니다. 상당한 금을 회수했지만, 일부 백성들은 불법 상품이 시장에 풀리는 것에 대한 불만을 표했습니다.",
                statChanges: { gold: 70, citizenHappiness: -2 },
                logEntry: "회수품 공개 매각 (금 +70, 행복도 -2)."
            };
        } else if (choiceIdBase === "smuggling_show_mercy") {
            outcome = {
                narrative: "남은 밀수 조직 잔당들에게 자수를 권유하고 관용을 베풀었습니다. 몇몇은 자수했지만, 나머지는 숨어들어 재범의 기회를 노리고 있습니다. 왕실의 자비심에 대한 평가는 엇갈립니다.",
                statChanges: { publicOrder: -1, citizenHappiness: 1 },
                logEntry: "밀수 조직 잔당에 관용 (질서 -1, 행복도 +1). 재범 위험 존재."
            };
        }
        break;
    case "REFUGEE_CRISIS":
        if (choiceIdBase === "refugee_offer_shelter") {
            outcome = {
                narrative: "왕국은 난민들에게 피난처와 식량을 제공했습니다. 막대한 비용이 들었지만, 백성들은 폐하의 인도주의적 결정에 감동했으며, 국제적인 명성도 높아졌습니다. 그러나 일부 지역에서는 자원 부족으로 인한 갈등이 발생하고 있습니다.",
                statChanges: { gold: -100, food: -50, citizenHappiness: 8, publicOrder: -5 },
                logEntry: "난민 전면 수용 및 지원 (금 -100, 식량 -50, 행복도 +8, 질서 -5). 국제 명성 상승."
            };
        } else if (choiceIdBase === "refugee_temporary_camp") {
            outcome = {
                narrative: "국경 인근에 임시 수용소를 설치하고 제한적인 지원을 제공했습니다. 최악의 상황은 면했지만, 난민들의 고통은 계속되고 있으며, 왕국의 대응에 대한 비판적인 시선도 있습니다.",
                statChanges: { gold: -50, food: -20, citizenHappiness: 3, publicOrder: -2 },
                logEntry: "난민 임시 수용소 설치 (금 -50, 식량 -20, 행복도 +3, 질서 -2)."
            };
        } else if (choiceIdBase === "refugee_turn_away") {
            outcome = {
                narrative: "국경을 봉쇄하고 난민 유입을 막았습니다. 왕국의 자원과 안보는 보호되었지만, 수많은 난민들이 국경 밖에서 죽거나 뿔뿔이 흩어졌습니다. 백성들 사이에서는 폐하의 비정함에 대한 불만이, 국제적으로는 비난이 쏟아지고 있습니다.",
                statChanges: { publicOrder: 10, citizenHappiness: -10 },
                logEntry: "난민 유입 전면 차단 (질서 +10, 행복도 -10). 국제적 비난."
            };
        }
        break;
    case "NOBILITY_DISPUTE":
        if (choiceIdBase === "resolve_succession_raynold") {
            outcome = {
                narrative: "레이놀드 경을 실버우드 백작으로 인정했습니다. 왕실의 전통적 권위가 강화되었고, 레이놀드 가문의 병력이 왕실에 대한 충성을 맹세했습니다. 그러나 베아트리스 지지층은 불만을 표합니다.",
                statChanges: { militaryStrength: 5, citizenHappiness: -5, publicOrder: 1 },
                logEntry: "실버우드 계승: 레이놀드 경 인정 (군사력 +5, 행복도 -5, 질서 +1)."
            };
        } else if (choiceIdBase === "resolve_succession_beatrice") {
            outcome = {
                narrative: "베아트리스 숙녀를 실버우드 백작으로 인정했습니다. 이는 왕실의 개혁적인 면모를 보여주었지만, 보수적인 귀족들 사이에서는 불만이 터져 나오고 있습니다.",
                statChanges: { citizenHappiness: 5, publicOrder: -5 },
                logEntry: "실버우드 계승: 베아트리스 숙녀 인정 (행복도 +5, 질서 -5)."
            };
        } else if (choiceIdBase === "resolve_succession_mediate") {
            outcome = {
                narrative: "양측을 중재하여 실버우드 영지를 분할 통치하는 것으로 합의를 이끌어냈습니다. 비용이 들었지만, 큰 분쟁을 피하고 귀족들의 관계를 유지했습니다. 모두가 완전히 만족하지는 못했습니다.",
                statChanges: { gold: -20, citizenHappiness: 3, publicOrder: 2 },
                logEntry: "실버우드 계승: 영지 분할 중재 (금 -20, 행복도 +3, 질서 +2)."
            };
        }
        break;
    case "MYSTICAL_PHENOMENON":
        if (choiceIdBase === "investigate_whispering_lake") {
            const success = Math.random() < 0.5;
            outcome = {
                narrative: success ? "학자들의 심층 조사 결과, 호수의 신비한 현상은 고대 마법 유물의 잔류 에너지가 발현된 것이었습니다. 유물을 안정화하고 그 에너지를 왕국에 유용하게 쓸 방안을 찾았습니다." : "학자들은 호수의 현상을 조사했지만, 원인을 밝히지 못하고 돌아왔습니다. 미지의 현상은 여전히 백성들의 불안을 자극하고 있습니다.",
                statChanges: { gold: -70, citizenHappiness: success ? 10 : -3, publicOrder: success ? 3 : -1, militaryStrength: success ? 2:0 },
                logEntry: `속삭이는 호수 조사: ${success ? "원인 규명 및 활용 방안 발견 (금 -70, 행복도 +10, 질서 +3, 군사력 +2)." : "원인 불명 (금 -70, 행복도 -3, 질서 -1)."}`
            };
        } else if (choiceIdBase === "bless_whispering_lake") {
            outcome = {
                narrative: "성직자들이 호수 주변에서 대규모 축복 의식을 진행했습니다. 백성들은 안도하며 신께 감사드렸고, 왕실에 대한 신앙심이 깊어졌습니다. 호수의 현상은 변함이 없었지만, 민심은 안정되었습니다.",
                statChanges: { citizenHappiness: 5, publicOrder: 2 },
                logEntry: "속삭이는 호수 축복 의식 (행복도 +5, 질서 +2). 민심 안정."
            };
        } else if (choiceIdBase === "seal_whispering_lake") {
            outcome = {
                narrative: "위험을 차단하기 위해 호수 주변을 봉쇄하고 접근을 금했습니다. 백성들의 공포는 줄었지만, 미지의 현상에 대한 궁금증과 왕실의 강경한 태도에 대한 불만도 생겼습니다.",
                statChanges: { citizenHappiness: -3, publicOrder: -1 },
                logEntry: "속삭이는 호수 봉쇄 (행복도 -3, 질서 -1)."
            };
        }
        break;
    case "GUILD_DEMANDS":
        if (choiceIdBase === "artisans_grant_full") {
            outcome = {
                narrative: "장인 조합의 모든 요구를 수용하고 전폭적인 지원을 약속했습니다. 장인들은 폐하의 통치에 깊이 감사하며, 왕국의 예술과 기술 발전에 매진할 것을 다짐했습니다. 왕국의 명성이 높아질 것입니다.",
                statChanges: { gold: -120, citizenHappiness: 8, publicOrder: 2 },
                logEntry: "장인 조합 요구 전면 수용 (금 -120, 행복도 +8, 질서 +2). 예술/기술 발전 기대."
            };
        } else if (choiceIdBase === "artisans_negotiate") {
            outcome = {
                narrative: "장인 조합과 협상하여 일부 요구만 수용하기로 했습니다. 재정적 부담을 줄이면서도 장인들의 사기를 어느 정도 유지했습니다. 모두가 만족하지는 못했지만, 갈등은 피했습니다.",
                statChanges: { gold: -60, citizenHappiness: 4 },
                logEntry: "장인 조합과 협상 타결 (금 -60, 행복도 +4)."
            };
        } else if (choiceIdBase === "artisans_reject") {
            outcome = {
                narrative: "장인 조합의 요구를 거절했습니다. 왕실의 재정은 보호되었지만, 장인들은 크게 실망하여 일부는 왕국을 떠나 다른 곳으로 이주하려 합니다. 왕국의 기술력과 예술적 명성에 타격이 예상됩니다.",
                statChanges: { citizenHappiness: -5, publicOrder: -2, gold: Math.random() < 0.3 ? -10:0 }, // Small gold loss from lost talent/projects
                logEntry: "장인 조합 요구 거절 (행복도 -5, 질서 -2). 장인 이탈 우려."
            };
        }
        break;
    case "MILITARY_AFFAIRS":
        if (choiceIdBase === "military_full_support") {
            outcome = {
                narrative: "사고를 당한 병사들에게 전폭적인 치료를 제공하고 훈련장을 신속하게 복구했습니다. 폐하의 인자함에 병사들은 감동했으며, 군대의 사기와 충성심이 크게 높아졌습니다.",
                statChanges: { gold: -50, militaryStrength: 5, citizenHappiness: 3 },
                logEntry: "군사 훈련 사고 전폭 지원 (금 -50, 군사력 +5, 행복도 +3). 군 사기 회복."
            };
        } else if (choiceIdBase === "military_investigate_punish") {
            outcome = {
                narrative: "사고 원인을 철저히 조사하여 책임자를 밝혀내고 엄중히 처벌했습니다. 질서는 회복되었지만, 군대 내부에선 폐하의 처사에 대한 불만이 작게 일고 있습니다.",
                statChanges: { publicOrder: 3, militaryStrength: -1, citizenHappiness: -2 },
                logEntry: "군사 훈련 사고 책임자 처벌 (질서 +3, 군사력 -1, 행복도 -2)."
            };
        } else if (choiceIdBase === "military_ignore_accident") {
            outcome = {
                narrative: "훈련 사고를 덮고 훈련을 강행했습니다. 병사들은 왕실의 무관심에 크게 실망했으며, 군대의 사기는 바닥으로 떨어졌습니다. 훈련 효율도 저하되었습니다.",
                statChanges: { militaryStrength: -10, citizenHappiness: -5, publicOrder: -2 },
                logEntry: "군사 훈련 사고 방치 (군사력 -10, 행복도 -5, 질서 -2). 군 사기 폭락."
            };
        }
        break;
    case "BLIGHT_OUTBREAK":
        if (choiceIdBase === "blight_research_cure") {
            const success = Math.random() < 0.4;
            outcome = {
                narrative: success ? "왕립 식물학자들이 필사적인 연구 끝에 작물 역병의 치료법을 개발했습니다! 이제 왕국은 식량 위기에서 벗어날 것입니다." : "역병 치료법 연구는 실패로 돌아갔습니다. 막대한 자금만 낭비했고, 역병은 계속해서 퍼져나가고 있습니다.",
                statChanges: { gold: -80, food: success ? 100 : -50, citizenHappiness: success ? 10 : -5, publicOrder: success ? 3 : -2 },
                logEntry: `작물 역병 연구: ${success ? "치료법 개발 성공 (금 -80, 식량 +100, 행복도 +10, 질서 +3)." : "치료법 개발 실패 (금 -80, 식량 -50, 행복도 -5, 질서 -2)."}`
            };
        } else if (choiceIdBase === "blight_quarantine_destroy") {
            outcome = {
                narrative: "감염된 작물들을 격리하고 소각하는 과감한 조치를 취했습니다. 당장 식량 손실이 발생했지만, 역병의 확산을 막아냈습니다.",
                statChanges: { gold: -20, food: -50, publicOrder: 2, citizenHappiness: -3 },
                logEntry: "감염 작물 격리 및 소각 (금 -20, 식량 -50, 질서 +2, 행복도 -3). 역병 확산 저지."
            };
        } else if (choiceIdBase === "blight_pray_wait") {
            outcome = {
                narrative: "폐하께서는 역병이 물러가기를 기도하며 기다리기로 했습니다. 하지만 역병은 멈추지 않고 왕국 전체로 빠르게 퍼져나가고 있습니다. 대규모 기근이 눈앞에 다가왔습니다.",
                statChanges: { food: -100, citizenHappiness: -7, publicOrder: -5 },
                logEntry: "작물 역병 방치 (식량 -100, 행복도 -7, 질서 -5). 기근 위기 심화."
            };
        }
        break;
    case "CULTURAL_EVENT":
        if (choiceIdBase === "bardic_competition_approve") {
            outcome = {
                narrative: "왕실 음유시인 경연대회가 성대하게 개최되었습니다. 전국 각지의 음유시인들이 모여 아름다운 노래와 이야기로 백성들을 즐겁게 했고, 왕국 전체에 활기가 넘쳤습니다.",
                statChanges: { gold: -70, citizenHappiness: 12, publicOrder: 3, food: -Math.floor(stats.population * 0.02) },
                logEntry: "왕실 음유시인 경연대회 개최 (금 -70, 행복도 +12, 질서 +3, 식량 소비)."
            };
        } else if (choiceIdBase === "bardic_competition_sponsor_small") {
            outcome = {
                narrative: "왕실의 소규모 후원 아래 음유시인 경연대회가 열렸습니다. 큰 부담 없이 백성들에게 즐거움을 선사했습니다.",
                statChanges: { gold: -30, citizenHappiness: 5, publicOrder: 1, food: -Math.floor(stats.population * 0.01) },
                logEntry: "음유시인 경연대회 소규모 후원 (금 -30, 행복도 +5, 질서 +1, 식량 소비)."
            };
        } else if (choiceIdBase === "bardic_competition_reject") {
            outcome = {
                narrative: "음유시인 경연대회 개최를 거절했습니다. 음유시인들과 백성들은 실망했지만, 폐하의 결정을 존중하기로 했습니다. 왕국의 문화적 활기는 다소 저하되었습니다.",
                statChanges: { citizenHappiness: -5, publicOrder: -2 },
                logEntry: "음유시인 경연대회 거절 (행복도 -5, 질서 -2)."
            };
        }
        break;

    default: 
      outcome = {
        narrative: `"${event.title}" 사건이 기록되었습니다. 폐하의 현명한 통치에 참고가 될 것입니다.`,
        statChanges: {},
        logEntry: `사건 "${event.title}"을 확인했습니다.`
      };
      if (event.alertType === "ACKNOWLEDGE_ONLY_EVENT_TYPE_EXAMPLE" as UrgentAlert['alertType']) { 
          outcome.statChanges = { citizenHappiness: 1, gold: 10 };
          outcome.narrative = "작은 행운이 왕국에 깃들었습니다.";
          outcome.logEntry = `${event.title}으로 인해 소소한 이득 발생.`
      }
      break;
  }
  return outcome;
};


export const generateInitialReport = async (
  stats: KingdomStats,
  goal: EdelweissGoal,
  apiKey: string 
): Promise<GeneratedReportContent> => {
  console.log("Mocking initial report generation...");
  await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 300));
  
  const mockReport = getMockInitialReport(stats, goal);
  return Promise.resolve(mockReport);
};

export const generatePeriodicReport = async (
  stats: KingdomStats,
  goal: EdelweissGoal,
  previousReport: Report | null, 
  apiKey: string 
): Promise<GeneratedReportContent> => {
  console.log(`Mocking periodic report generation for day ${stats.currentDay}...`);
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

  // Ensure that the reports cycle through the full list of unique reports, then repeat.
  // Using (stats.currentDay - 1) to start from index 0 for Day 1
  const reportIndex = (stats.currentDay - 1) % mockPeriodicReports.length;
  let mockReport = mockPeriodicReports[reportIndex](stats, goal);
  
  // Dynamic alerts for low stats (can still apply to new reports)
  if (!mockReport.newAlerts || mockReport.newAlerts.length === 0) {
    if (stats.citizenHappiness < 25 && Math.random() < 0.4) {
         mockReport.newAlerts = (mockReport.newAlerts || []).concat([{
            title: "백성들의 극심한 불만 표출",
            description: `왕국의 행복도가 위험 수위(${stats.citizenHappiness}%)입니다! 곳곳에서 소규모 시위와 소요가 발생하고 있습니다. 즉각적인 조치가 없다면 걷잡을 수 없이 번질 것입니다.`,
            alertType: "CITIZEN_UNREST" as UrgentAlert['alertType'],
            choices: [
                { id: "긴급 구휼금 지급 및 세금 감면", text: "긴급 구휼금 지급 및 세금 감면 (-150 금, +12 행복도, +6 질서)", tooltip:"재정을 투입해 급한 불을 끕니다."},
                { id: "계엄령 선포 및 주동자 체포", text: "계엄령 선포 및 주동자 체포 (-10 군사력, +10 질서, -20 행복도, 인구 감소 위험)", tooltip:"극약 처방이지만, 반발이 클 수 있습니다."},
            ]
        }]);
        mockReport.logEntry += " 백성들의 불만이 극에 달했습니다!";
    } else if (stats.food < stats.population * 0.2 && Math.random() < 0.5) {
        mockReport.newAlerts = (mockReport.newAlerts || []).concat([{
            title: "기아 발생 직전!",
            description: `식량 비축량이 바닥을 보이고 있습니다 (${stats.food}). 당장 내일이면 굶주리는 백성들이 속출할 것입니다!`,
            alertType: "FOOD_SHORTAGE" as UrgentAlert['alertType'],
            choices: [
                 { id: "import_food_emergency_high_cost", text: "웃돈을 주고서라도 식량 긴급 수입 (-300 금, 식량 +350)", tooltip:"국고를 탕진해서라도 백성을 먹입니다."},
                 { id: "military_forage_expedition", text: "군대를 동원해 주변 지역 식량 징발 (-10 군사력, 식량 +100, 주변 지역 관계 악화)", tooltip:"군사력으로 약탈에 가깝게 식량을 확보합니다."}
            ]
        }]);
         mockReport.logEntry += " 기아 위기! 식량이 없습니다!";
    } else if (stats.gold < 50 && stats.militaryStrength > 30 && Math.random() < 0.2) {
        mockReport.newAlerts = (mockReport.newAlerts || []).concat([{
            title: "군인들의 봉급 체불 위기",
            description: "왕실 금고가 비어 군인들의 봉급을 지급하기 어렵게 되었습니다. 충성스러운 군인들이 동요하기 전에 해결책을 찾아야 합니다.",
            alertType: "FINANCE" as UrgentAlert['alertType'], 
            choices: [
                {id: "sell_crown_jewels", text: "왕실 보물을 매각하여 자금 마련 (+100 금, -5 행복도(귀족층))", tooltip:"왕실의 체면을 구기지만 급한 불을 끕니다."},
                {id: "delay_payment_promise_bonus", text: "봉급 지급을 연기하고 추후 보너스 약속 (-3 군사 사기, -2 질서)", tooltip:"병사들의 불만을 살 수 있습니다."}
            ]
        }]);
        mockReport.logEntry += " 군인 봉급 지급에 차질 발생.";
    }
  }


  return Promise.resolve(mockReport);
};

export const resolveEventChoice = async (
  stats: KingdomStats,
  event: ActiveEvent,
  choice: PlayerChoice,
  apiKey: string 
): Promise<GeneratedEventOutcome> => {
  console.log(`Mocking event resolution for event "${event.title}" with choice "${choice.text}"...`);
  await new Promise(resolve => setTimeout(resolve, 450 + Math.random() * 400));

  const mockOutcome = getMockEventOutcome(stats, event, choice);
  return Promise.resolve(mockOutcome);
};