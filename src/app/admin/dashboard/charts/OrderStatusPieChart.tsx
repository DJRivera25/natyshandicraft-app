import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export interface OrderStatusDatum {
  name: string;
  value: number;
}

const COLORS = ['#10b981', '#fbbf24', '#ef4444', '#6366f1'];

export default function OrderStatusPieChart({
  data,
}: {
  data: OrderStatusDatum[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          fill="#8884d8"
          paddingAngle={3}
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) =>
            `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
          }
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: 'white',
            borderRadius: 12,
            border: '1px solid #fbbf24',
            fontSize: 14,
          }}
          labelStyle={{ color: '#f59e42', fontWeight: 600 }}
        />
        <Legend verticalAlign="bottom" height={36} iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  );
}
