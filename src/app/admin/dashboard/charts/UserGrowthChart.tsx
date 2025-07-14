import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export interface UserGrowthDatum {
  date: string;
  users: number;
}

export default function UserGrowthChart({ data }: { data: UserGrowthDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart
        data={data}
        margin={{ top: 16, right: 16, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
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
          contentStyle={{
            background: 'white',
            borderRadius: 12,
            border: '1px solid #fbbf24',
            fontSize: 14,
          }}
          labelStyle={{ color: '#6366f1', fontWeight: 600 }}
        />
        <Legend verticalAlign="top" height={36} iconType="circle" />
        <Line
          type="monotone"
          dataKey="users"
          name="Signups"
          stroke="#6366f1"
          strokeWidth={3}
          dot={{ r: 3, fill: '#6366f1' }}
          activeDot={{ r: 6 }}
          fill="url(#colorUsers)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
