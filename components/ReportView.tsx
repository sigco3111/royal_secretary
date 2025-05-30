
import React from 'react';
import { Report, ReportItem as ReportItemType } from '../types';
import { ScrollIcon } from './icons/ScrollIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';

interface ReportViewProps {
  reports: Report[];
  selectedReport: Report | null;
  onSelectReport: (report: Report) => void;
  isDisabled?: boolean;
}

const ReportItem: React.FC<{item: ReportItemType}> = ({ item }) => (
  <div className="mb-4 p-3 bg-parchment rounded border border-ink-light/30">
    <h4 className="font-bold text-md text-ink-DEFAULT">{item.title}</h4>
    <p className="text-sm text-ink-light whitespace-pre-wrap">{item.text}</p>
    {item.category && <p className="text-xs mt-1 text-ink-light/70 italic">분류: {item.category}</p>}
  </div>
);

const ReportView: React.FC<ReportViewProps> = ({ reports, selectedReport, onSelectReport, isDisabled }) => {
  if (reports.length === 0 && !selectedReport && !isDisabled) {
    return (
      <div className="bg-parchment-dark p-6 rounded-lg shadow-md text-center">
        <ScrollIcon className="w-12 h-12 mx-auto text-ink-light mb-3" />
        <h3 className="text-xl font-display text-ink-DEFAULT">보고서 없음</h3>
        <p className="text-ink-light">왕실 서기관 에델바이스의 첫 보고서를 기다리고 있습니다.</p>
      </div>
    );
  }
   if (isDisabled && reports.length === 0) {
     return (
      <div className="bg-parchment-dark p-6 rounded-lg shadow-md text-center opacity-70">
        <ScrollIcon className="w-12 h-12 mx-auto text-ink-light mb-3" />
        <h3 className="text-xl font-display text-red-700">왕국 기록 마감</h3>
        <p className="text-ink-light">더 이상 보고서가 발행되지 않습니다.</p>
      </div>
    );
   }


  return (
    <div className={`bg-parchment-dark p-4 rounded-lg shadow-md ${isDisabled ? 'opacity-70' : ''}`}>
      <h2 className="text-2xl font-display text-ink-DEFAULT mb-4 border-b-2 border-ink-light pb-2">왕실 기록 보관소: 에델바이스의 보고서</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Report List */}
        <div className="md:col-span-1 h-96 overflow-y-auto pr-2 border-r border-ink-light/20">
          {reports.length === 0 && <p className="text-ink-light p-2">아직 제출된 보고서가 없습니다.</p>}
          {reports.map((report) => (
            <button
              key={report.id}
              onClick={() => !isDisabled && onSelectReport(report)}
              disabled={isDisabled}
              className={`w-full text-left p-3 mb-2 rounded transition-colors duration-150 ${isDisabled ? 'cursor-not-allowed opacity-60' : 'hover:bg-ink-light/10'} ${
                selectedReport?.id === report.id && !isDisabled ? 'bg-ink-light/20 border-l-4 border-seal-DEFAULT' : 'bg-parchment border border-ink-light/20'
              }`}
            >
              <h3 className="font-semibold text-sm text-ink-DEFAULT flex items-center">
                <DocumentTextIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                {report.title}
              </h3>
              <p className="text-xs text-ink-light">{report.date} - {report.type}</p>
            </button>
          ))}
        </div>

        {/* Selected Report Details */}
        <div className="md:col-span-2 h-96 overflow-y-auto pl-2">
          {selectedReport ? (
            <div className="p-3 bg-parchment rounded-md">
              <h3 className="text-xl font-bold font-display text-ink-DEFAULT mb-1">{selectedReport.title}</h3>
              <p className="text-sm text-ink-light mb-1">날짜: {selectedReport.date}</p>
              <p className="text-sm text-ink-light mb-3">종류: {selectedReport.type}</p>
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded">
                 <h4 className="font-semibold text-md text-ink-DEFAULT">에델바이스 요약:</h4>
                 <p className="text-sm text-ink-light italic whitespace-pre-wrap">{selectedReport.summary}</p>
              </div>
              {selectedReport.items.map((item, index) => (
                <ReportItem key={index} item={item} />
              ))}
              {selectedReport.urgentAlerts && selectedReport.urgentAlerts.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-bold text-md text-red-700">언급된 긴급 경보:</h4>
                  <ul className="list-disc list-inside pl-2">
                    {selectedReport.urgentAlerts.map(alert => (
                      <li key={alert.id} className="text-sm text-red-600">{alert.title}: {alert.description.substring(0,100)}...</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className={`flex flex-col items-center justify-center h-full text-ink-light p-4 ${isDisabled ? 'opacity-50' : ''}`}>
              <ScrollIcon className="w-16 h-16 mb-4 opacity-50" />
              <p>{isDisabled? "왕국의 역사는 여기까지입니다." : "기록 보관소에서 보고서를 선택하여 상세 내용을 확인하십시오."}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportView;
