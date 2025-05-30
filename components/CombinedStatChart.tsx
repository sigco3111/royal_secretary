import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { HistoricalDataPoint } from '../types';

interface CombinedStatChartProps {
  data: HistoricalDataPoint[];
  title: string;
}

const CombinedStatChart: React.FC<CombinedStatChartProps> = ({ data, title }) => {
  if (data.length < 2) {
    return (
      <div className="p-3 mt-4 bg-parchment rounded border border-ink-light/20 text-center text-ink-light text-sm">
        <p className="font-semibold">{title}</p>
        왕국의 역사가 너무 짧아 동향을 표시할 수 없습니다.
      </div>
    );
  }
  
  return (
    <div className="p-3 mt-2 bg-parchment rounded border border-ink-light/20">
      <h4 className="text-md font-semibold text-ink-DEFAULT mb-2 text-center">{title}</h4>
      <ResponsiveContainer width="100%" height={280}> {/* Adjusted height for better readability with 4 lines */}
        <LineChart data={data} margin={{ top: 5, right: 20, left: -5, bottom: 5 }}> {/* Adjusted left margin */}
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} stroke="#705c4f"/>
          <XAxis dataKey="day" name="일차" stroke="#705c4f" tick={{ fontSize: 10 }}/>
          <YAxis stroke="#705c4f" tick={{ fontSize: 10 }} domain={['auto', 'auto']} allowDataOverflow={true} />
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(251, 240, 217, 0.9)', border: '1px solid #EAE0C7', color: '#4A3B31' }}
            itemStyle={{ color: '#4A3B31' }}
            cursor={{ stroke: '#A03C3C', strokeWidth: 1, strokeDasharray: "3 3" }} // seal-DEFAULT color
            labelFormatter={(label) => `${label} 일차`}
          />
          <Legend wrapperStyle={{fontSize: "12px"}}/>
          <Line type="monotone" dataKey="gold" name="금" stroke="#eab308" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="food" name="식량" stroke="#84cc16" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="militaryStrength" name="군사력" stroke="#ef4444" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="population" name="인구" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CombinedStatChart;