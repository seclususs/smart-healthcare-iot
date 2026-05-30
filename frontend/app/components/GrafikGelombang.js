'use client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function GrafikGelombang({ data, dataKey, warna }) {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="waktu" hide={true} />

          <YAxis domain={['dataMin - 2', 'dataMax + 2']} hide={true} />

          <Tooltip
            contentStyle={{
              backgroundColor: '#0b0f19',
              border: '2px solid #1e293b',
              borderRadius: '0px',
              color: '#f8fafc',
              fontFamily: 'monospace',
            }}
            itemStyle={{ color: warna, fontWeight: 'bold' }}
          />

          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={warna}
            strokeWidth={3}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
