
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { HistoricalDataPoint } from '../types';

interface ChartComponentProps {
  data: HistoricalDataPoint[];
  dataKey: keyof HistoricalDataPoint;
  title: string;
  color: string;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ data, dataKey, title, color }) => {
  if (data.length < 2) { // Need at least 2 points to draw a line
    return (
      <div className="p-3 bg-parchment rounded border border-ink-light/20 text-center text-ink-light text-sm">
        <p className="font-semibold">{title}</p>
        동향을 표시할 데이터가 충분하지 않습니다.
      </div>
    );
  }
  
  return (
    <div className="p-3 bg-parchment rounded border border-ink-light/20">
      <h4 className="text-md font-semibold text-ink-DEFAULT mb-2 text-center">{title}</h4>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} stroke="#705c4f"/>
          <XAxis dataKey="day" name="일차" stroke="#705c4f" tick={{ fontSize: 10 }}/>
          <YAxis stroke="#705c4f" tick={{ fontSize: 10 }} domain={['auto', 'auto']}/>
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(251, 240, 217, 0.9)', border: '1px solid #EAE0C7', color: '#4A3B31' }}
            itemStyle={{ color: '#4A3B31' }}
            cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: "3 3" }}
            labelFormatter={(label) => `${label} 일차`}
          />
          <Legend wrapperStyle={{fontSize: "12px"}} formatter={(value) => value.split('(')[0].trim()}/>
          <Line type="monotone" dataKey={dataKey} name={title.split('(')[0].trim()} stroke={color} strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartComponent;