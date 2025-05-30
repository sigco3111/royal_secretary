
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
  // Report 1 (Original)
  (stats, goal) => ({
    reportSummary: `제 ${stats.currentDay}일차 보고입니다, 폐하. 오늘은 세금 징수가 순조롭게 이루어졌고, 북부 농경지에서는 풍작이 예상됩니다. 백성들의 생활은 대체로 평온합니다. "${goal}" 목표에 따라 자원 배분에 신경 쓰고 있습니다.`,
    reportItems: [
      { title: "일일 세금 수입", text: `금일 국고로 50 골드가 징수되었습니다. 재정 안정에 기여할 것입니다.`, category: ReportItemCategory.FINANCE },
      { title: "농업 생산량 예측", text: "북부 농경지의 작황이 좋아, 다음 수확기에 150 단위의 식량 증가가 예상됩니다.", category: ReportItemCategory.AGRICULTURE },
      { title: "수도 치안 보고", text: "수도 엘도리아 시의 치안은 안정적이며, 백성들은 밤낮으로 안전하게 생활하고 있습니다.", category: ReportItemCategory.INTERNAL_AFFAIRS },
    ],
    statChanges: { gold: 50, food: -Math.floor(stats.population * 0.08), citizenHappiness: 1, publicOrder: 1 },
    logEntry: `${stats.currentDay}일차: 세금 징수 (+50금). 식량 소비. 백성들의 사기가 소폭 상승했습니다.`
  }),
  // Report 2 (Original)
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 보고입니다. 동부 교역로에서 소규모 상단이 도착하여 무역이 활성화될 조짐이 보입니다. 다만, 남부 광산 지대에서 광부들의 불만이 접수되었습니다. "${goal}" 목표 달성을 위해 자원 분배에 유의하고 있습니다.`,
    reportItems: [
      { title: "교역 활성화 조짐", text: "동부 교역로를 통해 소규모 상단이 도착했습니다. 향후 교역량이 증가할 것으로 기대됩니다.", category: ReportItemCategory.TRADE },
      { title: "광산 지대 불만", text: "남부 광산의 열악한 작업 환경에 대한 광부들의 불만이 제기되었습니다. 조치가 필요할 수 있습니다.", category: ReportItemCategory.SOCIAL },
      { title: "군사 훈련 진행", text: "수도 방위군의 정기 훈련이 계획대로 진행되어 군사력이 소폭 증강되었습니다.", category: ReportItemCategory.MILITARY },
    ],
    statChanges: { gold: 20, militaryStrength: 2, citizenHappiness: -1, food: -Math.floor(stats.population * 0.1) },
    newAlerts: Math.random() < 0.2 ? [{ 
        title: "희귀품 교역 제안",
        description: "한 외국 상인이 희귀한 장신구를 대량의 식량과 교환하자고 제안해왔습니다. 어떻게 하시겠습니까?",
        alertType: "TRADE_OPPORTUNITY" as UrgentAlert['alertType'],
        choices: [
            { id: "accept_trade_rare", text: "교역을 수락한다 (식량 +200, 금 -100)", tooltip:"식량을 확보하고 금을 지불합니다."},
            { id: "decline_trade_rare", text: "제안을 거절한다", tooltip:"현상 유지."},
        ]
    }] : [],
    logEntry: `${stats.currentDay}일차: 교역로 활기. 광산 불만 접수. 군사 훈련 실시.`
  }),
  // Report 3 (Original)
    (stats, goal) => ({
    reportSummary: `존경하는 폐하, ${stats.currentDay}일차 보고입니다. 최근 잦은 비로 인해 북부 농경지 일부가 침수되어 식량 생산에 차질이 우려됩니다. 백성들 사이에서는 작은 소문들이 돌고 있습니다. "${goal}" 목표에 따라 위기 관리에 힘쓰겠습니다.`,
    reportItems: [
      { title: "농경지 침수 피해", text: "잦은 강우로 북부 농경지 일부가 침수되어, 이번 수확량이 약 30% 감소할 것으로 예상됩니다.", category: ReportItemCategory.AGRICULTURE },
      { title: "민심 동요", text: "흉흉한 소문과 함께 백성들의 행복도가 소폭 하락했습니다. 민심을 다독일 방안이 필요합니다.", category: ReportItemCategory.SOCIAL },
      { title: "긴급 자금 확보", text: "비상 상황에 대비하여 예비 자금 20 골드를 확보했습니다.", category: ReportItemCategory.FINANCE },
    ],
    statChanges: { food: -Math.floor(stats.population * 0.1) - 50, citizenHappiness: -3, gold: 20 },
    newAlerts: stats.food < stats.population * 0.4 ? [{
        title: "식량 부족 심화",
        description: "계속되는 흉작과 재해로 인해 왕국의 식량 비축량이 위험 수준으로 떨어졌습니다. 즉각적인 대처가 없다면 대규모 기근이 발생할 수 있습니다!",
        alertType: "FOOD_SHORTAGE" as UrgentAlert['alertType'],
        choices: [
            { id: "import_food_emergency", text: "긴급 식량 수입 (-200 금, 식량 +300)", tooltip:"국고를 소모해 외국에서 식량을 들여옵니다."},
            { id: "ration_food", text: "식량 배급 통제 (행복도 -10, 식량 소모 감소)", tooltip:"백성들의 불만을 감수하고 식량 소비를 줄입니다."},
        ]
    }] : [],
    logEntry: `${stats.currentDay}일차: 농경지 침수. 민심 하락. 비상 자금 확보.`
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
  // --- Duplicated Reports Start Here ---
  // Report 1 (Duplicated)
  (stats, goal) => ({
    reportSummary: `제 ${stats.currentDay}일차 보고입니다, 폐하. (복제됨) 오늘은 세금 징수가 순조롭게 이루어졌고, 북부 농경지에서는 풍작이 예상됩니다. 백성들의 생활은 대체로 평온합니다. "${goal}" 목표에 따라 자원 배분에 신경 쓰고 있습니다.`,
    reportItems: [
      { title: "일일 세금 수입 (복제됨)", text: `금일 국고로 50 골드가 징수되었습니다. 재정 안정에 기여할 것입니다.`, category: ReportItemCategory.FINANCE },
      { title: "농업 생산량 예측 (복제됨)", text: "북부 농경지의 작황이 좋아, 다음 수확기에 150 단위의 식량 증가가 예상됩니다.", category: ReportItemCategory.AGRICULTURE },
      { title: "수도 치안 보고 (복제됨)", text: "수도 엘도리아 시의 치안은 안정적이며, 백성들은 밤낮으로 안전하게 생활하고 있습니다.", category: ReportItemCategory.INTERNAL_AFFAIRS },
    ],
    statChanges: { gold: 50, food: -Math.floor(stats.population * 0.08), citizenHappiness: 1, publicOrder: 1 },
    logEntry: `${stats.currentDay}일차 (복제됨): 세금 징수 (+50금). 식량 소비. 백성들의 사기가 소폭 상승했습니다.`
  }),
  // Report 2 (Duplicated)
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 보고입니다. (복제됨) 동부 교역로에서 소규모 상단이 도착하여 무역이 활성화될 조짐이 보입니다. 다만, 남부 광산 지대에서 광부들의 불만이 접수되었습니다. "${goal}" 목표 달성을 위해 자원 분배에 유의하고 있습니다.`,
    reportItems: [
      { title: "교역 활성화 조짐 (복제됨)", text: "동부 교역로를 통해 소규모 상단이 도착했습니다. 향후 교역량이 증가할 것으로 기대됩니다.", category: ReportItemCategory.TRADE },
      { title: "광산 지대 불만 (복제됨)", text: "남부 광산의 열악한 작업 환경에 대한 광부들의 불만이 제기되었습니다. 조치가 필요할 수 있습니다.", category: ReportItemCategory.SOCIAL },
      { title: "군사 훈련 진행 (복제됨)", text: "수도 방위군의 정기 훈련이 계획대로 진행되어 군사력이 소폭 증강되었습니다.", category: ReportItemCategory.MILITARY },
    ],
    statChanges: { gold: 20, militaryStrength: 2, citizenHappiness: -1, food: -Math.floor(stats.population * 0.1) },
    newAlerts: Math.random() < 0.2 ? [{ 
        title: "희귀품 교역 제안 (복제됨)",
        description: "한 외국 상인이 희귀한 장신구를 대량의 식량과 교환하자고 제안해왔습니다. 어떻게 하시겠습니까?",
        alertType: "TRADE_OPPORTUNITY" as UrgentAlert['alertType'],
        choices: [
            { id: "accept_trade_rare_dup", text: "교역을 수락한다 (식량 +200, 금 -100)", tooltip:"식량을 확보하고 금을 지불합니다."},
            { id: "decline_trade_rare_dup", text: "제안을 거절한다", tooltip:"현상 유지."},
        ]
    }] : [],
    logEntry: `${stats.currentDay}일차 (복제됨): 교역로 활기. 광산 불만 접수. 군사 훈련 실시.`
  }),
  // Report 3 (Duplicated)
    (stats, goal) => ({
    reportSummary: `존경하는 폐하, ${stats.currentDay}일차 보고입니다. (복제됨) 최근 잦은 비로 인해 북부 농경지 일부가 침수되어 식량 생산에 차질이 우려됩니다. 백성들 사이에서는 작은 소문들이 돌고 있습니다. "${goal}" 목표에 따라 위기 관리에 힘쓰겠습니다.`,
    reportItems: [
      { title: "농경지 침수 피해 (복제됨)", text: "잦은 강우로 북부 농경지 일부가 침수되어, 이번 수확량이 약 30% 감소할 것으로 예상됩니다.", category: ReportItemCategory.AGRICULTURE },
      { title: "민심 동요 (복제됨)", text: "흉흉한 소문과 함께 백성들의 행복도가 소폭 하락했습니다. 민심을 다독일 방안이 필요합니다.", category: ReportItemCategory.SOCIAL },
      { title: "긴급 자금 확보 (복제됨)", text: "비상 상황에 대비하여 예비 자금 20 골드를 확보했습니다.", category: ReportItemCategory.FINANCE },
    ],
    statChanges: { food: -Math.floor(stats.population * 0.1) - 50, citizenHappiness: -3, gold: 20 },
    newAlerts: stats.food < stats.population * 0.4 ? [{
        title: "식량 부족 심화 (복제됨)",
        description: "계속되는 흉작과 재해로 인해 왕국의 식량 비축량이 위험 수준으로 떨어졌습니다. 즉각적인 대처가 없다면 대규모 기근이 발생할 수 있습니다!",
        alertType: "FOOD_SHORTAGE" as UrgentAlert['alertType'],
        choices: [
            { id: "import_food_emergency_dup", text: "긴급 식량 수입 (-200 금, 식량 +300)", tooltip:"국고를 소모해 외국에서 식량을 들여옵니다."},
            { id: "ration_food_dup", text: "식량 배급 통제 (행복도 -10, 식량 소모 감소)", tooltip:"백성들의 불만을 감수하고 식량 소비를 줄입니다."},
        ]
    }] : [],
    logEntry: `${stats.currentDay}일차 (복제됨): 농경지 침수. 민심 하락. 비상 자금 확보.`
  }),
  // Report 4: Military Focus (Duplicated)
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 군사 보고입니다. (복제됨) 최근 국경 순찰 중 이웃 왕국과의 작은 마찰이 있었습니다. 또한, 새로운 훈련 방식 도입으로 병사들의 사기가 높습니다. "${goal}" 목표에 따라 국방력 강화에 힘쓰고 있습니다.`,
    reportItems: [
      { title: "국경 마찰 보고 (복제됨)", text: "동부 국경에서 이웃 왕국 순찰대와 작은 충돌이 있었으나, 외교적으로 해결되었습니다. 경계 강화가 필요합니다.", category: ReportItemCategory.MILITARY },
      { title: "신규 훈련 성과 (복제됨)", text: "새로운 검술 훈련 도입으로 병사들의 전투 기술이 향상되었습니다.", category: ReportItemCategory.MILITARY },
      { title: "무기 제작 현황 (복제됨)", text: "대장간에서 표준 무기 20세트 생산이 완료되었습니다.", category: ReportItemCategory.RESOURCES },
    ],
    statChanges: { militaryStrength: 3, gold: -30, publicOrder: -1 },
    newAlerts: Math.random() < 0.15 ? [{
      title: "국경 침입 경고 (복제됨)",
      description: "정찰병으로부터 동부 국경 너머에서 미확인 병력의 움직임이 포착되었다는 긴급 보고입니다. 단순 정찰일 수도 있으나, 침공의 전조일 가능성도 배제할 수 없습니다.",
      alertType: "BORDER_DISPUTE" as UrgentAlert['alertType'],
      choices: [
        { id: "reinforce_border_dup", text: "국경 수비대 증원 (-50 금, +5 군사력)", tooltip:"국경 방어를 강화합니다."},
        { id: "send_diplomat_border_dup", text: "외교관을 파견하여 의도 파악 (-20 금)", tooltip:"평화적 해결을 시도합니다."},
        { id: "prepare_for_war_dup", text: "전쟁 준비 태세 돌입 (-100 금, +10 군사력, -5 행복도)", tooltip:"최악의 상황에 대비합니다."}
      ]
    }] : [],
    logEntry: `${stats.currentDay}일차 (복제됨): 국경 긴장 고조. 군사 훈련 성과. 무기 생산 완료.`
  }),
  // Report 5: Economic Boom (Duplicated)
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 경제 보고입니다. (복제됨) 새로운 교역로가 개척되어 막대한 부가 유입되고 있습니다! 상인 조합은 축제를 열자고 제안하고 있습니다. "${goal}" 목표 달성에 청신호입니다.`,
    reportItems: [
      { title: "신규 교역로 수익 (복제됨)", text: "서쪽 바다 건너 새로운 교역로에서 첫 번째 상단이 도착하여 200 골드의 순이익을 가져왔습니다.", category: ReportItemCategory.TRADE },
      { title: "시장 활성화 (복제됨)", text: "수도 시장이 그 어느 때보다 활기찹니다. 다양한 상품이 거래되고 있습니다.", category: ReportItemCategory.ECONOMY },
      { title: "상인 조합의 제안 (복제됨)", text: "상인 조합에서 왕국의 번영을 축하하는 대규모 축제를 제안했습니다.", category: ReportItemCategory.SOCIAL },
    ],
    statChanges: { gold: 150, citizenHappiness: 5, food: -Math.floor(stats.population * 0.12) },
     newAlerts: Math.random() < 0.3 ? [{
      title: "번영 축제 개최 제안 (복제됨)",
      description: "상인 조합에서 왕국의 최근 번영을 기념하고 백성들의 사기를 높이기 위해 대규모 축제를 개최할 것을 공식적으로 제안했습니다. 축제에는 상당한 비용이 소요되지만, 백성들의 행복도를 크게 높일 수 있습니다.",
      alertType: "CULTURAL_FESTIVAL_REQUEST" as UrgentAlert['alertType'],
      choices: [
        { id: "approve_festival_grand_dup", text: "성대한 축제를 승인한다 (-150 금, +15 행복도)", tooltip:"큰 비용으로 최대의 효과를 노립니다."},
        { id: "approve_festival_modest_dup", text: "검소한 축제를 승인한다 (-70 금, +7 행복도)", tooltip:"적당한 비용으로 축제를 개최합니다."},
        { id: "reject_festival_dup", text: "축제 제안을 거절한다 (-3 행복도)", tooltip:"비용을 절약하지만, 실망감을 줄 수 있습니다."}
      ]
    }] : [],
    logEntry: `${stats.currentDay}일차 (복제됨): 교역 대성공! (+200금). 시장 활기. 축제 제안 접수.`
  }),
  // Report 6: Social Unrest (Duplicated)
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 사회 동향 보고입니다. (복제됨) 최근 시행된 세금 인상안에 대한 백성들의 불만이 커지고 있습니다. 일부 지역에서는 시위 조짐도 보입니다. "${goal}"을 추구하는 과정에서 민심을 잃지 않도록 주의해야 합니다.`,
    reportItems: [
      { title: "세금 인상 반발 (복제됨)", text: "새로운 세금 정책에 대한 반발로 일부 시민들이 공개적으로 불만을 표출하고 있습니다.", category: ReportItemCategory.SOCIAL },
      { title: "유언비어 확산 (복제됨)", text: "수도 내에 왕실에 대한 악의적인 유언비어가 퍼지고 있어 공공질서를 해치고 있습니다.", category: ReportItemCategory.INTERNAL_AFFAIRS },
      { title: "식량 가격 상승 (복제됨)", text: "최근 흉작의 여파로 시장의 식량 가격이 상승하여 저소득층의 부담이 커지고 있습니다.", category: ReportItemCategory.ECONOMY },
    ],
    statChanges: { citizenHappiness: -7, publicOrder: -5, food: -Math.floor(stats.population * 0.09) },
    newAlerts: [{
        title: "시민 불만 폭발 직전 (복제됨)",
        description: "세금 인상과 생활고에 지친 백성들의 분노가 극에 달했습니다. 이대로 방치하면 대규모 폭동으로 번질 수 있습니다!",
        alertType: "CITIZEN_UNREST" as UrgentAlert['alertType'],
        choices: [
            { id: "lower_taxes_temp_dup", text: "일시적으로 세금을 인하한다. (-100 금, +10 행복도, +5 질서)", tooltip:"재정 손실을 감수하고 민심을 수습합니다."},
            { id: "promise_reforms_dup", text: "개혁을 약속하고 시간을 번다. (+3 행복도, -3 질서)", tooltip:"구체적인 행동 없이 말로 달랩니다. 효과는 미지수."},
            { id: "forceful_suppression_dup", text: "주동자를 체포하고 강경 진압한다. (+10 질서, -15 행복도, 군사력 -5)", tooltip:"공포로 질서를 잡으려 하지만, 더 큰 반발을 살 수 있습니다."}
        ]
    }],
    logEntry: `${stats.currentDay}일차 (복제됨): 세금 인상 반발 심화. 유언비어 확산. 민심 불안.`
  }),
   // Report 7: Scientific Breakthrough (Duplicated)
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 기술 보고입니다. (복제됨) 왕립 학자들이 새로운 농업 기술을 개발하여 식량 생산량을 크게 늘릴 수 있는 가능성을 발견했습니다! 이 기술의 상용화에는 투자가 필요합니다. "${goal}" 목표와 왕국의 미래에 큰 영향을 줄 수 있습니다.`,
    reportItems: [
      { title: "신기술 개발 성공 (복제됨)", text: "왕립 학자들이 다년간의 연구 끝에 '마법 강화 비료' 제조법을 개발했습니다. 이는 토지 생산성을 50%까지 향상시킬 수 있습니다.", category: ReportItemCategory.AGRICULTURE },
      { title: "상용화 비용 (복제됨)", text: "이 기술을 왕국 전체 농경지에 적용하기 위해서는 초기 시설 투자 및 교육에 약 250골드가 필요합니다.", category: ReportItemCategory.FINANCE },
      { title: "학자들의 요청 (복제됨)", text: "학자들은 연구 지속 및 추가 기술 개발을 위한 연구 자금 지원을 간청하고 있습니다.", category: ReportItemCategory.SOCIAL },
    ],
    statChanges: { gold: 10, food: -Math.floor(stats.population * 0.1) },
    newAlerts: [{
        title: "신기술 투자 결정 (복제됨)",
        description: "왕립 학자들이 개발한 '마법 강화 비료' 기술에 투자하여 왕국의 농업 생산성을 혁신하시겠습니까? 막대한 초기 비용이 들지만, 장기적으로 식량 문제를 해결할 열쇠가 될 수 있습니다.",
        alertType: "SCIENTIFIC_BREAKTHROUGH" as UrgentAlert['alertType'],
        choices: [
            { id: "invest_new_tech_full_dup", text: "전폭적으로 투자한다 (-250 금, 향후 식량 생산 대폭 증가)", tooltip:"미래를 위한 과감한 투자."},
            { id: "invest_new_tech_partial_dup", text: "부분적으로 시범 도입한다 (-100 금, 향후 식량 생산 소폭 증가)", tooltip:"효과를 검증하며 점진적으로 도입합니다."},
            { id: "reject_new_tech_dup", text: "투자를 보류한다 (기회 상실)", tooltip:"현재 재정 상황을 고려하여 투자를 미룹니다."}
        ]
    }],
    logEntry: `${stats.currentDay}일차 (복제됨): 혁신적인 농업 기술 개발! 투자 결정 필요.`
  }),
  // Report 8: Natural Disaster - Earthquake (Duplicated)
  (stats, goal) => ({
    reportSummary: `폐하! ${stats.currentDay}일차 긴급 보고입니다. (복제됨) 오늘 새벽, 남부 광산 지대를 중심으로 강력한 지진이 발생했습니다! 인명 피해와 건물 붕괴가 보고되고 있으며, 여진의 공포가 계속되고 있습니다. "${goal}" 목표 달성에 큰 차질이 예상됩니다.`,
    reportItems: [
      { title: "지진 발생 및 피해 (복제됨)", text: "남부 광산 지대에 진도 5의 강진이 발생하여 광산 일부가 붕괴되고 주택 다수가 파손되었습니다. 최소 50명의 사상자가 발생한 것으로 추정됩니다.", category: ReportItemCategory.INTERNAL_AFFAIRS },
      { title: "구호 작업 필요 (복제됨)", text: "생존자 수색 및 부상자 치료, 이재민을 위한 임시 거처와 식량 공급이 시급합니다.", category: ReportItemCategory.RESOURCES },
      { title: "광산 생산 중단 (복제됨)", text: "남부 광산의 모든 작업이 중단되었습니다. 복구에는 상당한 시간과 비용이 소요될 것입니다.", category: ReportItemCategory.ECONOMY },
    ],
    statChanges: { population: -50, gold: -20, food: -Math.floor(stats.population * 0.15), publicOrder: -15, citizenHappiness: -20, militaryStrength: -5 },
    newAlerts: [{
        title: "지진 피해 복구 (복제됨)",
        description: "강력한 지진이 남부 광산 지대를 강타했습니다. 신속한 구호 및 복구 작업이 필요합니다. 어떻게 대처하시겠습니까?",
        alertType: "NATURAL_DISASTER" as UrgentAlert['alertType'],
        choices: [
            { id: "disaster_relief_full_dup", text: "총력을 다해 구호 및 복구 (-200 금, -50 식량, +10 행복도, +5 질서)", tooltip:"국고를 총동원하여 피해를 최소화합니다."},
            { id: "disaster_relief_limited_dup", text: "제한적인 지원 제공 (-100 금, -20 식량, +3 행복도)", tooltip:"최소한의 지원으로 재정을 아낍니다."},
            { id: "disaster_relief_minimal_dup", text: "자연에 맡긴다 (-10 행복도, -10 질서, 추가 인명피해 가능성)", tooltip:"피해 복구를 거의 포기합니다."}
        ]
    }],
    logEntry: `${stats.currentDay}일차 (복제됨): 남부 광산 지대 강진 발생! 막대한 피해.`
  }),
  // Report 9: Diplomatic Incident / Opportunity (Duplicated)
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 외교 보고입니다. (복제됨) 이웃나라 '실바니아 왕국'에서 사절단이 도착했습니다. 그들은 양국 간의 우호 증진을 위한 혼인 동맹을 제안하고 있습니다. 이는 왕국의 국제적 위상에 큰 영향을 미칠 수 있습니다. "${goal}"과 연계하여 신중히 고려해야 합니다.`,
    reportItems: [
      { title: "실바니아 왕국 사절단 도착 (복제됨)", text: "실바니아 왕국의 고위급 사절단이 수도에 도착하여 폐하와의 만남을 요청하고 있습니다.", category: ReportItemCategory.DIPLOMACY },
      { title: "혼인 동맹 제안 (복제됨)", text: "사절단은 실바니아의 공주와 폐하 (또는 왕족)와의 혼인을 통해 양국 간의 동맹을 공고히 할 것을 제안했습니다. 지참금으로 100 골드와 희귀 자원을 약속했습니다.", category: ReportItemCategory.DIPLOMACY },
      { title: "귀족들의 반응 (복제됨)", text: "왕국 내 일부 귀족들은 이 제안에 대해 각기 다른 의견을 보이고 있습니다. 어떤 이는 기회로, 어떤 이는 위협으로 간주합니다.", category: ReportItemCategory.SOCIAL },
    ],
    statChanges: { food: -Math.floor(stats.population * 0.1) },
    newAlerts: [{
        title: "실바니아 왕국의 혼인 동맹 제안 (복제됨)",
        description: "이웃나라 실바니아가 혼인 동맹을 제안해왔습니다. 수락 시 막대한 지참금과 군사적 지원을 약속했지만, 국내 정치에 파장을 일으킬 수 있고, 실바니아의 숨은 의도가 있을 수도 있습니다.",
        alertType: "DIPLOMATIC_ENVOY" as UrgentAlert['alertType'],
        choices: [
            { id: "accept_marriage_alliance_dup", text: "혼인 동맹을 수락한다 (+100 금, +5 군사력, +5 행복도, 실바니아와 동맹)", tooltip:"지참금과 동맹을 얻습니다."},
            { id: "decline_marriage_alliance_politely_dup", text: "정중히 거절한다 (-3 행복도, 실바니아와 관계 악화 가능성)", tooltip:"동맹을 거절하지만 외교적 파국은 피하려 합니다."},
            { id: "decline_marriage_alliance_firmly_dup", text: "단호히 거절하고 사절단을 추방한다 (-10 행복도, -5 질서, 실바니아와 적대 관계 가능성)", tooltip:"강경한 태도를 보입니다."}
        ]
    }],
    logEntry: `${stats.currentDay}일차 (복제됨): 실바니아 왕국에서 혼인 동맹 제안.`
  }),
  // Report 10: Plague Outbreak (Duplicated)
  (stats, goal) => ({
    reportSummary: `폐하! ${stats.currentDay}일차 긴급 보건 보고입니다. (복제됨) 수도 엘도리아 시 외곽에서 정체불명의 역병이 발생했다는 보고입니다! 전염성이 매우 강하며 치사율도 높은 것으로 보입니다. 신속한 대처가 없다면 왕국 전체로 퍼질 수 있습니다. "${goal}"은 잠시 뒤로하고 이 위기를 극복해야 합니다.`,
    reportItems: [
      { title: "역병 발생 보고 (복제됨)", text: "수도 외곽 빈민가에서 시작된 것으로 추정되는 역병이 빠르게 확산되고 있습니다. 초기 증상은 고열과 발진입니다.", category: ReportItemCategory.INTERNAL_AFFAIRS },
      { title: "의료 자원 부족 (복제됨)", text: "왕국의 의료 시설과 약품이 턱없이 부족하여 환자들을 감당하기 어렵습니다.", category: ReportItemCategory.RESOURCES },
      { title: "백성들의 공포 (복제됨)", text: "역병에 대한 공포가 확산되면서 상점들이 문을 닫고 거리가 텅 비고 있습니다. 공공질서가 무너질 조짐입니다.", category: ReportItemCategory.SOCIAL },
    ],
    statChanges: { population: -Math.floor(stats.population * 0.02), citizenHappiness: -15, publicOrder: -10, gold: -10, food: -Math.floor(stats.population * 0.1) },
    newAlerts: [{
        title: "역병 확산! 긴급 대처 필요 (복제됨)",
        description: "수도에서 시작된 정체불명의 역병이 걷잡을 수 없이 퍼지고 있습니다. 폐하의 결단에 왕국의 운명이 달렸습니다!",
        alertType: "PLAGUE_OUTBREAK" as UrgentAlert['alertType'],
        choices: [
            { id: "plague_quarantine_city_dup", text: "수도 봉쇄 및 감염자 격리 (-100 금, -10 행복도, +5 질서, 역병 확산 둔화)", tooltip:"강력한 조치로 확산을 막으려 합니다."},
            { id: "plague_research_cure_dup", text: "치료법 연구에 자금 투입 (-150 금, 성공 시 역병 종식 가능성, 실패 시 큰 손실)", tooltip:"장기적 해결책을 모색하지만 시간이 걸립니다."},
            { id: "plague_pray_and_wait_dup", text: "신께 기도하며 상황을 지켜본다 (-15 행복도, 역병 급속 확산 위험)", tooltip:"사실상 방관하는 것입니다."}
        ]
    }],
    logEntry: `${stats.currentDay}일차 (복제됨): 수도에 치명적인 역병 발생! 백성들이 죽어가고 있습니다.`
  }),
  // Report 11: Merchant Guild Demands (Duplicated)
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 상업 보고입니다. (복제됨) 최근 왕국의 경제 성장에 크게 기여한 상인 조합에서 그들의 영향력 확대를 요구하고 나섰습니다. 세금 감면과 특정 상품에 대한 독점권을 주장하고 있습니다. 이들의 요구를 어떻게 처리하느냐에 따라 왕국 경제의 미래가 달라질 수 있습니다.`,
    reportItems: [
      { title: "상인 조합의 요구 사항 (복제됨)", text: "상인 조합 대표들이 왕실에 정식으로 세금 20% 감면과 향신료 무역 독점권을 요구하는 청원서를 제출했습니다.", category: ReportItemCategory.TRADE },
      { title: "귀족들의 반발 (복제됨)", text: "상인 조합의 요구에 대해 일부 대귀족들이 강하게 반발하고 있습니다. 이는 전통적인 귀족 중심 경제 질서에 대한 도전으로 받아들여지고 있습니다.", category: ReportItemCategory.SOCIAL },
      { title: "경제적 파급 효과 분석 (복제됨)", text: "상인 조합의 요구를 수용할 경우 단기적으로는 세수 감소가 예상되나, 장기적으로는 교역 활성화로 이어질 수 있다는 분석과, 오히려 독점으로 인한 폐해가 클 것이라는 분석이 엇갈리고 있습니다.", category: ReportItemCategory.ECONOMY },
    ],
    statChanges: { food: -Math.floor(stats.population * 0.1) },
    newAlerts: [{
        title: "상인 조합의 압력 (복제됨)",
        description: "강력한 상인 조합이 세금 감면과 독점권을 요구하며 왕실을 압박하고 있습니다. 이들의 요구를 들어주면 경제에 큰 변화가 예상됩니다.",
        alertType: "MERCHANT_GUILD_DEMANDS" as UrgentAlert['alertType'],
        choices: [
            { id: "guild_accept_demands_dup", text: "요구를 전면 수용한다 (금 수입 일시적 -30%, 장기적 +?, 행복도 +3, 질서 -2)", tooltip:"상인들의 힘을 인정하고 미래를 도모합니다."},
            { id: "guild_negotiate_terms_dup", text: "협상을 통해 일부만 수용한다 (금 수입 일시적 -10%, 행복도 +1)", tooltip:"절충안을 모색합니다."},
            { id: "guild_reject_demands_firmly_dup", text: "요구를 단호히 거절한다 (금 수입 +0, 상인들과 관계 악화, 질서 -5, 교역 위축 가능성)", tooltip:"왕실의 권위를 지키려 합니다."}
        ]
    }],
    logEntry: `${stats.currentDay}일차 (복제됨): 상인 조합이 영향력 확대를 요구하고 있습니다.`
  }),
   // Report 12: Resource Depletion Scare (Duplicated)
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 자원 보고입니다. (복제됨) 남부 광산 지대의 주석 광맥이 거의 고갈되었다는 우려스러운 보고가 들어왔습니다. 주석은 청동 무기 제작에 필수적인 자원이라 군사력 유지에 차질이 예상됩니다. 대책 마련이 시급합니다.`,
    reportItems: [
      { title: "주석 광맥 고갈 위기 (복제됨)", text: "남부 광산의 광산 감독관이 주석 채굴량이 급감했으며, 현재 추세라면 1년 안에 완전히 고갈될 것이라고 보고했습니다.", category: ReportItemCategory.RESOURCES },
      { title: "군수품 생산 차질 우려 (복제됨)", text: "주석 부족은 청동 검과 갑옷 생산에 직접적인 영향을 미쳐, 군대의 무장 수준을 저하시킬 수 있습니다.", category: ReportItemCategory.MILITARY },
      { title: "대체 자원 탐색 필요 (복제됨)", text: "새로운 주석 광맥을 찾거나, 주석을 대체할 수 있는 새로운 합금 기술 개발이 필요합니다.", category: ReportItemCategory.ECONOMY },
    ],
    statChanges: { gold: -10, militaryStrength: -1, food: -Math.floor(stats.population * 0.09) },
    newAlerts: Math.random() < 0.25 ? [{
        title: "자원 고갈 위기: 주석 (복제됨)",
        description: "남부 광산의 주석이 바닥나고 있습니다. 이는 군수품 생산에 심각한 타격을 줄 것입니다. 어떻게 대처하시겠습니까?",
        alertType: "RESOURCE_DISCOVERY" as UrgentAlert['alertType'], 
        choices: [
            { id: "resource_search_expedition_dup", text: "새로운 광맥 탐사대 파견 (-100 금, 성공 시 신규 광산 발견)", tooltip:"미지의 땅으로 탐험대를 보냅니다."},
            { id: "resource_invest_alternative_tech_dup", text: "대체재 연구 투자 (-80 금, 성공 시 신소재 개발)", tooltip:"새로운 기술로 위기를 극복하려 합니다."},
            { id: "resource_import_metal_dup", text: "주석 긴급 수입 (-150 금, 군사력 유지)", tooltip:"비싼 값에 외국에서 수입합니다."}
        ]
    }] : [],
    logEntry: `${stats.currentDay}일차 (복제됨): 주석 광맥 고갈 위기. 군수품 생산 차질 우려.`
  }),
  // Report 13: Good Harvest & Surplus (Duplicated)
  (stats, goal) => ({
    reportSummary: `폐하! ${stats.currentDay}일차 농업 보고입니다. (복제됨) 올해 북부 농경지의 작황이 대풍년을 이루어 막대한 양의 식량이 수확되었습니다! 창고가 가득 차고 백성들의 얼굴에 웃음꽃이 피었습니다. "${goal}" 달성에도 긍정적인 소식입니다.`,
    reportItems: [
      { title: "역대급 풍년 (복제됨)", text: `북부 농경지에서 예상치를 50% 초과하는 ${Math.floor(stats.population * 0.5)} 단위의 식량이 추가로 수확되었습니다.`, category: ReportItemCategory.AGRICULTURE },
      { title: "식량 저장 공간 부족 (복제됨)", text: "수확량이 너무 많아 기존 식량 창고로는 모두 보관하기 어려운 상황입니다. 새로운 창고 건설이 필요할 수 있습니다.", category: ReportItemCategory.RESOURCES },
      { title: "백성들의 만족도 상승 (복제됨)", text: "풍족한 식량 덕분에 백성들의 행복도가 크게 상승했으며, 폐하를 향한 칭송이 자자합니다.", category: ReportItemCategory.SOCIAL },
    ],
    statChanges: { food: Math.floor(stats.population * 0.5) - Math.floor(stats.population * 0.1), citizenHappiness: 10, publicOrder: 3 },
    newAlerts: [{
        title: "식량 과잉! 처리 방안은? (복제됨)",
        description: "예상치 못한 대풍년으로 식량이 남아돕니다! 남는 식량을 어떻게 처리하시겠습니까? 현명한 결정은 왕국에 큰 이득을 가져올 수 있습니다.",
        alertType: "TRADE_OPPORTUNITY" as UrgentAlert['alertType'], 
        choices: [
            { id: "surplus_sell_abroad_dup", text: "이웃 나라에 판매한다 (+100 금, -100 식량, 외교 관계 개선)", tooltip:"잉여 자원으로 외화를 법니다."},
            { id: "surplus_distribute_people_dup", text: "백성들에게 무상 분배한다 (-50 식량, +7 행복도)", tooltip:"민심을 얻는 데 사용합니다."},
            { id: "surplus_store_emergency_dup", text: "비축하여 비상사태 대비 (-20 금 건설비, +100 식량 저장 가능)", tooltip:"미래의 위기에 대비합니다."}
        ]
    }],
    logEntry: `${stats.currentDay}일차 (복제됨): 대풍년! 식량 창고가 가득 찼습니다.`
  }),
  // Report 14: Border Tensions & Spy Activity (Duplicated)
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 정보 보고입니다. (복제됨) 서부 국경 너머 '어둠숲 부족'의 움직임이 심상치 않다는 첩보가 입수되었습니다. 또한, 수도에서 활동하던 그들의 첩자가 체포되었습니다. "${goal}"을 위한 안정적인 환경 조성이 중요합니다.`,
    reportItems: [
      { title: "어둠숲 부족 동향 (복제됨)", text: "어둠숲 부족이 최근 병력을 집결시키고 있으며, 약탈을 위한 소규모 침입이 잦아지고 있다는 보고입니다.", category: ReportItemCategory.MILITARY },
      { title: "첩자 체포 (복제됨)", text: "수도에서 암약하며 정보를 빼돌리던 어둠숲 부족의 첩자를 체포하여 심문 중입니다. 중요한 정보를 얻을 수 있을지도 모릅니다.", category: ReportItemCategory.INTERNAL_AFFAIRS },
      { title: "국경 방어 강화 필요 (복제됨)", text: "서부 삼림 지대의 방어선을 강화하고, 추가 병력 파견을 고려해야 할 시점입니다.", category: ReportItemCategory.MILITARY },
    ],
    statChanges: { publicOrder: 2, gold: -10, food: -Math.floor(stats.population * 0.1) },
    newAlerts: Math.random() < 0.4 ? [{
        title: "체포된 첩자 처리 (복제됨)",
        description: "수도에서 체포된 어둠숲 부족의 첩자를 어떻게 처리하시겠습니까? 그의 입에서 중요한 정보가 나올 수도, 혹은 본보기로 삼을 수도 있습니다.",
        alertType: "SPY_CAUGHT" as UrgentAlert['alertType'],
        choices: [
            { id: "spy_interrogate_execute_dup", text: "고문하여 정보 획득 후 처형 (+5 질서, -3 행복도, 정보 획득 가능성)", tooltip:"정보를 얻고 공포를 심어줍니다."},
            { id: "spy_ransom_exchange_dup", text: "어둠숲 부족과 몸값 협상/포로 교환 (-50 금 또는 + 병력, 외교적 선택)", tooltip:"실리를 추구하거나 외교적 해결을 시도합니다."},
            { id: "spy_turn_double_agent_dup", text: "회유하여 이중첩자로 활용 (성공 시 고급 정보, 실패 시 역정보 위험)", tooltip:"위험하지만 큰 이득을 노립니다."}
        ]
    }] : [],
    logEntry: `${stats.currentDay}일차 (복제됨): 어둠숲 부족의 수상한 움직임. 첩자 체포.`
  }),
  // Report 15: Philosophical Movement (Duplicated)
  (stats, goal) => ({
    reportSummary: `폐하, ${stats.currentDay}일차 문화 보고입니다. (복제됨) 수도를 중심으로 '만민 평등 사상'이라는 새로운 철학이 젊은이들 사이에서 빠르게 확산되고 있습니다. 이는 기존 사회 질서에 도전하는 급진적인 내용을 담고 있어, 귀족들의 우려를 사고 있습니다.`,
    reportItems: [
      { title: "신흥 사상 '만민 평등' (복제됨)", text: "모든 인간은 신분과 관계없이 평등하며, 능력에 따라 대우받아야 한다는 주장이 젊은 학자들과 시민들 사이에서 인기를 얻고 있습니다.", category: ReportItemCategory.SOCIAL },
      { title: "귀족들의 반발 (복제됨)", text: "이러한 사상은 신분 질서를 근간으로 하는 왕국의 체제를 위협한다고 여겨, 대다수 귀족이 강력한 반감을 드러내고 있습니다.", category: ReportItemCategory.SOCIAL },
      { title: "사상 탄압 논쟁 (복제됨)", text: "일부 강경파 신하들은 이 사상을 불온한 것으로 규정하고 즉각 탄압해야 한다고 주장하는 반면, 다른 이들은 사상의 자유를 존중해야 한다고 맞서고 있습니다.", category: ReportItemCategory.INTERNAL_AFFAIRS },
    ],
    statChanges: { citizenHappiness: goal === EdelweissGoal.CITIZEN_SATISFACTION ? 2: -2, publicOrder: -3, food: -Math.floor(stats.population * 0.1) },
    newAlerts: [{
        title: "신흥 사상 대처 방안 (복제됨)",
        description: "'만민 평등 사상'이 왕국에 빠르게 퍼지고 있습니다. 이 새로운 흐름에 어떻게 대처하시겠습니까?",
        alertType: "CITIZEN_UNREST" as UrgentAlert['alertType'],
        choices: [
            { id: "movement_suppress_dup", text: "사상을 금지하고 주동자를 처벌한다 (+5 질서, -10 행복도, 지식인층 반발)", tooltip:"강압적으로 억누릅니다."},
            { id: "movement_debate_dup", text: "공개 토론회를 열어 사상을 검증한다 (-2 질서, +5 행복도, 결과 불확실)", tooltip:"백성들의 의견을 듣고 판단합니다."},
            { id: "movement_partially_accept_dup", text: "사상의 일부 긍정적 측면을 수용하여 개혁에 반영한다 (+3 행복도, +2 질서, -50 금, 귀족 불만)", tooltip:"점진적 변화를 시도합니다."}
        ]
    }],
    logEntry: `${stats.currentDay}일차 (복제됨): '만민 평등 사상' 확산. 사회적 논쟁 가열.`
  })
  // --- Duplicated Reports End Here ---
];

const getMockEventOutcome = (stats: KingdomStats, event: ActiveEvent, choice: PlayerChoice): GeneratedEventOutcome => {
  let outcome: GeneratedEventOutcome = {
    narrative: "결정이 내려졌습니다...",
    statChanges: {},
    logEntry: `사건 "${event.title}"에 대해 "${choice.text}"를 선택했습니다.`
  };

  // Use a consistent ID suffix for duplicated choices if they exist, or original if not
  const choiceIdBase = choice.id.replace('_dup', '');


  switch (event.alertType) {
    case "BANDIT_ACTIVITY":
      if (choiceIdBase === "dispatch_troops_bandits") {
        outcome = {
          narrative: "폐하의 명으로 출정한 왕국군이 서부 삼림의 산적들을 성공적으로 토벌했습니다! 교역로가 안전해졌고 백성들이 환호하지만, 전투에서 약간의 금과 병력을 소모했습니다.",
          statChanges: { gold: -50, militaryStrength: Math.random() < 0.7 ? -5 : -8, citizenHappiness: 7, publicOrder: 5 },
          logEntry: "산적 토벌 성공! (금, 군사력 소모, 행복도/질서 상승). 서부 삼림지대 안전 확보."
        };
      } else if (choiceIdBase === "pay_off_bandits") {
        outcome = {
          narrative: "거액의 금을 지불하고 산적들과 임시 휴전을 맺었습니다. 당장의 위협은 사라졌지만, 산적들은 여전히 남아있으며 국고는 축났습니다. 그들이 약속을 지킬지는 미지수입니다.",
          statChanges: { gold: -150, citizenHappiness: -2, publicOrder: -1 },
          logEntry: "산적에게 몸값 지불. (금 -150, 행복도 -2, 질서 -1). 임시적인 평화.",
          followUpAlert: Math.random() < 0.3 ? {
             title: "산적의 배신!",
             description: "몸값을 받고 물러났던 산적들이 약속을 어기고 다시 마을을 약탈하기 시작했습니다! 이전보다 더욱 대담해진 그들의 행동에 백성들의 분노가 극에 달했습니다.",
             alertType: "BANDIT_ACTIVITY",
             choices: [ // Ensure these follow-up choices have unique IDs if necessary, or are handled generally
                { id: "dispatch_troops_bandits_again", text: "이번에야말로 뿌리 뽑는다! (-70금, -10 군사력)", tooltip: "더 큰 손실을 각오하고 토벌합니다."},
                { id: "ignore_bandits_betrayal", text: "속수무책으로 지켜본다. (-10 행복도, -7 질서)", tooltip: "더 이상 손 쓸 방법이 없습니다."}
             ]
          } : undefined
        };
      } else { // ignore_bandits
        outcome = {
          narrative: "산적 문제를 방관하기로 결정하셨습니다. 서부 삼림지대의 상황은 악화되고 있으며, 교역로가 마비되고 백성들의 불안감이 커지고 있습니다.",
          statChanges: { citizenHappiness: -8, publicOrder: -6, food: -50, gold: -30 }, // food/gold loss due to raids
          logEntry: "산적 문제 방치. (행복도/질서/식량/금 하락). 서부 삼림지대 불안정 심화."
        };
      }
      break;
    case "FOOD_SHORTAGE":
      if (choiceIdBase === "import_food_emergency" || choiceIdBase === "import_food_emergency_high_cost") {
        const cost = choiceIdBase === "import_food_emergency_high_cost" ? -300 : -200;
        const amount = choiceIdBase === "import_food_emergency_high_cost" ? 350 : 300;
        outcome = {
          narrative: `국고를 사용하여 이웃 나라에서 긴급 식량을 수입했습니다. 창고가 다시 채워졌지만, 재정에 큰 부담이 되었습니다. 백성들은 한숨 돌렸습니다. (비용: ${Math.abs(cost)} 금)`,
          statChanges: { gold: cost, food: amount, citizenHappiness: 5 },
          logEntry: `긴급 식량 수입. (금 ${cost}, 식량 +${amount}, 행복도 +5). 기근 위기 모면.`
        };
      } else if (choiceIdBase === "ration_food") {
        outcome = {
          narrative: "식량 배급제를 실시하여 소비를 줄였습니다. 백성들의 불만이 높아졌지만, 당장의 기근은 피할 수 있었습니다. 장기화될 경우 민심 이탈이 우려됩니다.",
          statChanges: { citizenHappiness: -12, publicOrder: -3 }, 
          logEntry: "식량 배급제 실시. (행복도 -12, 질서 -3). 식량 소비 감소, 민심 악화."
        };
      } else if (choiceIdBase === "military_forage_expedition") {
         outcome = {
            narrative: "군대를 동원해 주변 지역에서 식량을 강제로 징발했습니다. 단기적으로 식량은 확보했지만, 군대의 사기가 떨어지고 주변 지역과의 관계가 악화되었습니다.",
            statChanges: { militaryStrength: -10, food: 100, citizenHappiness: -5, publicOrder: -3},
            logEntry: "군대 동원 식량 징발 (군사력 -10, 식량 +100, 행복도/질서 하락).",
         };
      } else if (choiceIdBase === "pray_for_harvest") { 
        outcome = {
          narrative: "폐하께서 친히 하늘에 풍년을 기원하는 제사를 올렸습니다. 백성들은 폐하의 정성에 감복했으나, 실제 식량 사정은 나아지지 않았습니다.",
          statChanges: { citizenHappiness: 2, food: -10 }, 
          logEntry: "풍년 기원제 실시. (행복도 +2). 식량 문제는 여전함."
        };
      }
      break;
    case "TRADE_OPPORTUNITY":
       if (choiceIdBase === "accept_trade_rare") {
        outcome = {
          narrative: "외국 상인과의 교역이 성공적으로 이루어졌습니다. 희귀품을 얻지는 못했지만, 대신 왕국에 필요한 식량을 확보하고 금을 지불했습니다.",
          statChanges: { food: 200, gold: -100, citizenHappiness: 2 },
          logEntry: "희귀품 교역 성사 (식량 +200, 금 -100, 행복도 +2)."
        };
      } else if (choiceIdBase === "decline_trade_rare") {
        outcome = {
          narrative: "교역 제안을 거절하기로 결정했습니다. 현상 유지됩니다.",
          statChanges: {},
          logEntry: "교역 제안 거절."
        };
      } else if (choiceIdBase === "surplus_sell_abroad") { 
        outcome = {
          narrative: "남아도는 식량을 이웃 나라에 성공적으로 판매하여 상당한 금을 확보했습니다. 외교 관계도 소폭 개선되었습니다.",
          statChanges: { gold: 100, food: -100, citizenHappiness: 1 },
          logEntry: "잉여 식량 해외 판매 (금 +100, 식량 -100). 외교 관계 개선."
        };
      } else if (choiceIdBase === "surplus_distribute_people") {
        outcome = {
          narrative: "남는 식량을 백성들에게 무상으로 분배하니, 온 백성이 폐하의 은혜에 감사하며 환호했습니다.",
          statChanges: { food: -50, citizenHappiness: 7 },
          logEntry: "잉여 식량 백성 분배 (식량 -50, 행복도 +7)."
        };
      } else if (choiceIdBase === "surplus_store_emergency") {
        outcome = {
          narrative: "미래를 대비하여 새로운 비축 창고를 건설하고 잉여 식량을 저장했습니다. 약간의 건설 비용이 소요되었습니다.",
          statChanges: { gold: -20, food: 0 }, 
          logEntry: "비상 식량 비축 창고 건설 (금 -20). 미래 대비."
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
      } else { // reject_new_tech
         outcome = {
          narrative: "신기술 투자를 보류하기로 결정하셨습니다. 학자들은 실망했지만, 왕국의 재정 안정을 우선시한 폐하의 뜻을 따르기로 했습니다.",
          statChanges: { citizenHappiness: -2 },
          logEntry: "신기술 투자 보류. (행복도 -2). 기회비용 발생."
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
      } else { // disaster_relief_minimal
        outcome = {
          narrative: "폐하께서는 지진 피해 지역에 최소한의 지원만을 명하셨습니다. 많은 백성이 절망 속에 방치되었으며, 왕실에 대한 원성이 높아지고 있습니다. 추가적인 인명 피해와 질병 발생이 우려됩니다.",
          statChanges: { citizenHappiness: -15, publicOrder: -10, population: Math.random() < 0.8 ? -30: -20, food: -10 },
          logEntry: "지진 피해 최소 지원 (행복도 -15, 질서 -10, 인구 추가 감소). 민심 이반 심각."
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
                    {id: "diplomacy_stand_firm", text: "요구를 일축하고 국방 태세를 강화한다 (+5 군사력, -50 금, 전쟁 발발 가능성)", tooltip: "강대강으로 맞섭니다."}
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
      } else { // reject_festival
        outcome = {
          narrative: "축제 제안을 거절했습니다. 상인 조합과 백성들은 다소 실망했지만, 폐하의 결정을 존중하기로 했습니다. 절약된 예산은 다른 곳에 유용하게 쓰일 것입니다.",
          statChanges: { citizenHappiness: -3 },
          logEntry: "번영 축제 제안 거절 (행복도 -3)."
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

  const reportGenerator = mockPeriodicReports[ (stats.currentDay -1 + Math.floor(Math.random() * mockPeriodicReports.length)) % mockPeriodicReports.length]; 
  let mockReport = reportGenerator(stats, goal);
  
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
