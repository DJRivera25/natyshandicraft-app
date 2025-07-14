import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export interface SalesTrendDatum {
  date: string;
  orders: number;
  revenue: number;
}

export default function SalesTrendChart({ data }: { data: SalesTrendDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart
        data={data}
        margin={{ top: 16, right: 16, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e42" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#f3e8ff"
        />
        <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#a16207' }} />
        <YAxis tick={{ fontSize: 12, fill: '#a16207' }} />
        <Tooltip
          contentStyle={
            {
              background: 'white',
              borderRadius: 12,
              border: '1px solid #fbbf24',
              fontSize: 14,
            } as React.CSSProperties
          }
          labelStyle={{ color: '#f59e42', fontWeight: 600 }}
        />
        <Legend verticalAlign="top" height={36} iconType="circle" />
        <Area
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="#f59e42"
          fillOpacity={1}
          fill="url(#colorRevenue)"
          strokeWidth={3}
          dot={{ r: 3, fill: '#f59e42' }}
        />
        <Area
          type="monotone"
          dataKey="orders"
          name="Orders"
          stroke="#10b981"
          fillOpacity={0.3}
          fill="url(#colorOrders)"
          strokeWidth={2}
          dot={{ r: 2, fill: '#10b981' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
