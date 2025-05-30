
import React from 'react';
import { ActiveEvent, PlayerChoice, UrgentAlert } from '../types';
import { AlertIcon } from './icons/AlertIcon';
import { QuillIcon } from './icons/QuillIcon';

interface EventModalProps {
  event: ActiveEvent;
  onResolve: (choice: PlayerChoice) => void;
  isDisabled?: boolean;
}

const getKoreanAlertType = (alertType: UrgentAlert['alertType']): string => {
  switch (alertType) {
    case "FOOD_SHORTAGE": return "식량 부족";
    case "BANDIT_ACTIVITY": return "산적 출몰";
    case "DIPLOMATIC_ENVOY": return "외교 사절단";
    case "CITIZEN_UNREST": return "백성 불만";
    case "RESOURCE_DISCOVERY": return "자원 발견";
    case "TRADE_OPPORTUNITY": return "무역 기회";
    case "SCIENTIFIC_BREAKTHROUGH": return "과학적 발견";
    case "NATURAL_DISASTER": return "자연 재해";
    case "BORDER_DISPUTE": return "국경 분쟁";
    case "PLAGUE_OUTBREAK": return "역병 발생";
    case "MERCHANT_GUILD_DEMANDS": return "상인 조합 요구";
    case "CULTURAL_FESTIVAL_REQUEST": return "문화 축제 요청";
    case "SPY_CAUGHT": return "첩자 체포";
    case "FINANCE": return "재정 문제";
    case "SOCIAL": return "사회적 문제";
    case "ACKNOWLEDGE_ONLY_EVENT_TYPE_EXAMPLE": return "특이 사항 보고";
    default:
      const _exhaustiveCheck: never = alertType;
      const unknownValue = _exhaustiveCheck as string;
      return `알 수 없는 경보 (${unknownValue.replace(/_/g, ' ')})`;
  }
}

const EventModal: React.FC<EventModalProps> = ({ event, onResolve, isDisabled }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={`bg-parchment p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border-4 border-seal-dark ${isDisabled ? 'opacity-70' : ''}`}>
        <div className="flex items-center mb-4">
          <AlertIcon className="w-8 h-8 text-seal-DEFAULT mr-3" />
          <h2 className="text-2xl font-display text-ink-DEFAULT font-bold">{event.title}</h2>
        </div>
        <p className="text-ink-light mb-6 whitespace-pre-wrap">{event.description}</p>

        {event.location && (
            <p className="text-sm text-ink-light mb-1"><span className="font-semibold">장소:</span> {event.location}</p>
        )}
        <p className="text-sm text-ink-light mb-4"><span className="font-semibold">종류:</span> {getKoreanAlertType(event.alertType)}</p>


        {event.choices && event.choices.length > 0 ? (
          <div>
            <h3 className="text-lg font-semibold text-ink-DEFAULT mb-3">폐하의 결정:</h3>
            <div className="space-y-3">
              {event.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => !isDisabled && onResolve(choice)}
                  title={choice.tooltip}
                  disabled={isDisabled}
                  className={`w-full flex items-center justify-start bg-ink-light/10 text-ink-DEFAULT py-3 px-4 rounded-md border border-ink-light/30 transition-colors duration-150 ease-in-out group ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-ink-light/20 hover:border-ink-light'}`}
                >
                  <QuillIcon className={`w-5 h-5 mr-3 text-seal-DEFAULT flex-shrink-0 ${!isDisabled ? 'group-hover:text-seal-dark' : ''}`} />
                  <span className="flex-grow text-left">{choice.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <p className="text-ink-DEFAULT italic mb-4">에델바이스가 이 사건을 기록했습니다. {isDisabled ? "더 이상의 조치는 의미가 없습니다." : "폐하의 즉각적인 조치는 필요하지 않습니다."}</p>
            <button
               onClick={() => !isDisabled && onResolve({ id: 'acknowledge_event', text: '확인' })}
               disabled={isDisabled}
               className={`w-full bg-ink-light/10 text-ink-DEFAULT py-3 px-4 rounded-md border border-ink-light/30 transition-colors duration-150 ease-in-out group flex items-center justify-center ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-ink-light/20 hover:border-ink-light'}`}
             >
               <QuillIcon className={`w-5 h-5 mr-2 text-seal-DEFAULT flex-shrink-0 ${!isDisabled ? 'group-hover:text-seal-dark' : ''}`} />
               확인
             </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EventModal;
