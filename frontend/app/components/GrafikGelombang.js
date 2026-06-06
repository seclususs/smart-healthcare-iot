'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function GrafikGelombang({
  data,
  dataKey,
  warna,
}) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          {/* Grid Halus */}
          <CartesianGrid
            stroke="#e5e7eb"
            vertical={false}
            strokeDasharray="3 3"
          />

          {/* Sumbu X */}
          <XAxis
            dataKey="waktu"
            tick={{
              fill: '#64748b',
              fontSize: 12,
            }}
            axisLine={false}
            tickLine={false}
          />

          {/* Sumbu Y */}
          <YAxis
            tick={{
              fill: '#64748b',
              fontSize: 12,
            }}
            axisLine={false}
            tickLine={false}
            domain={['dataMin - 5', 'dataMax + 5']}
          />

          {/* Tooltip */}
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              boxShadow:
                '0 10px 25px rgba(0,0,0,0.08)',
            }}
          />

          {/* Area + Garis */}
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={warna}
            strokeWidth={3}
            fill={warna}
            fillOpacity={0.12}
            dot={false}
            activeDot={{
              r: 6,
              strokeWidth: 0,
              fill: warna,
            }}
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}