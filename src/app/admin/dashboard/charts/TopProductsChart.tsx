import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export interface TopProductDatum {
  name: string;
  sold: number;
}

export interface TopCategoryDatum {
  category: string;
  sold: number;
}

const COLORS = ['#f59e42', '#fbbf24', '#10b981', '#6366f1', '#f472b6'];

interface Props {
  data: TopProductDatum[];
  categoryData?: TopCategoryDatum[];
}

export default function TopProductsChart({ data, categoryData = [] }: Props) {
  const [viewMode, setViewMode] = useState<'products' | 'categories'>(
    'products'
  );
  const chartData = viewMode === 'products' ? data : categoryData;
  const xKey = viewMode === 'products' ? 'sold' : 'sold';
  const yKey = viewMode === 'products' ? 'name' : 'category';

  return (
    <div className="w-full h-full flex flex-col">
      {/* Toggle */}
      <div className="flex gap-2 mb-4 self-end">
        <button
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${viewMode === 'products' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-amber-700 border-amber-200 hover:bg-amber-50'}`}
          onClick={() => setViewMode('products')}
        >
          Products
        </button>
        <button
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${viewMode === 'categories' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-amber-700 border-amber-200 hover:bg-amber-50'}`}
          onClick={() => setViewMode('categories')}
        >
          Categories
        </button>
      </div>
      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
          barCategoryGap={16}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
            stroke="#f3e8ff"
          />
          <XAxis
            type="number"
            tick={{ fontSize: 12, fill: '#a16207' }}
            hide={false}
          />
          <YAxis
            type="category"
            dataKey={yKey}
            tick={{ fontSize: 13, fill: '#92400e', fontWeight: 600 }}
            width={120}
          />
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
          <Bar dataKey={xKey} name="Sold" radius={[8, 8, 8, 8]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
