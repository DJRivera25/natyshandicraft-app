import React, { useEffect, useState } from 'react';
import SalesTrendChart, { SalesTrendDatum } from './charts/SalesTrendChart';
import TopProductsChart, {
  TopProductDatum,
  TopCategoryDatum,
} from './charts/TopProductsChart';
import OrderStatusPieChart, {
  OrderStatusDatum,
} from './charts/OrderStatusPieChart';
import UserGrowthChart, { UserGrowthDatum } from './charts/UserGrowthChart';
import { apiFetchAdminOrders } from '@/utils/api/order';
import { apiFetchAllProducts } from '@/utils/api/products';
import { apiFetchAllUsers } from '@/utils/api/user';
import type { Order } from '@/types/order';
import type { Product } from '@/types/product';
import type { UserWithMeta } from '@/types/user';

function ChartCard({
  title,
  children,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-amber-200/60 p-4 sm:p-6 flex flex-col min-h-[320px] hover:shadow-2xl transition-shadow ${className}`}
    >
      <h3 className="text-lg font-bold text-amber-900 mb-2 flex items-center gap-2">
        {title}
      </h3>
      <div className="flex-1 flex items-center justify-center">{children}</div>
    </div>
  );
}

export default function AnalyticsSection() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<UserWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError('');
      try {
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          apiFetchAdminOrders({ page: 1, limit: 1000 }),
          apiFetchAllProducts(1, 1000),
          apiFetchAllUsers(),
        ]);
        setOrders(ordersRes.orders || []);
        setProducts(productsRes.products || []);
        setUsers(usersRes.users || usersRes || []);
      } catch {
        setError('Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  // Loading and error states
  if (loading) {
    return (
      <section className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-6 space-y-6">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-amber-100 rounded-xl w-[120px] h-[90px] animate-pulse"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-amber-100 rounded-2xl h-[320px] animate-pulse" />
          </div>
          <div>
            <div className="bg-amber-100 rounded-2xl h-[320px] animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-amber-100 rounded-2xl h-[320px] animate-pulse" />
          </div>
          <div>
            <div className="bg-amber-100 rounded-2xl h-[320px] animate-pulse" />
          </div>
        </div>
      </section>
    );
  }
  if (error) {
    return (
      <section className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 font-semibold text-center">
          {error}
        </div>
      </section>
    );
  }

  // --- Data Processing for Charts ---
  // 1. SalesTrendChart: Aggregate orders by date
  const salesByDate: Record<string, { orders: number; revenue: number }> = {};
  orders.forEach((order) => {
    const date = new Date(order.createdAt).toISOString().slice(0, 10);
    if (!salesByDate[date]) salesByDate[date] = { orders: 0, revenue: 0 };
    salesByDate[date].orders += 1;
    salesByDate[date].revenue += order.totalAmount || 0;
  });
  const salesTrendData: SalesTrendDatum[] = Object.entries(salesByDate)
    .map(([date, val]) => ({ date, ...val }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // 2. TopProductsChart: Top 5 by soldQuantity
  const topProducts: TopProductDatum[] = [...products]
    .sort((a, b) => (b.soldQuantity || 0) - (a.soldQuantity || 0))
    .slice(0, 5)
    .map((p) => ({ name: p.name, sold: p.soldQuantity || 0 }));

  // Top Categories: Aggregate by category, sum soldQuantity, sort top 5
  const categoryMap: Record<string, number> = {};
  products.forEach((p) => {
    const cat = p.category || 'Uncategorized';
    categoryMap[cat] = (categoryMap[cat] || 0) + (p.soldQuantity || 0);
  });
  const topCategories: TopCategoryDatum[] = Object.entries(categoryMap)
    .map(([category, sold]) => ({ category, sold }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  // 3. OrderStatusPieChart: Count by status
  const statusCounts: Record<string, number> = {};
  orders.forEach((order) => {
    const status = order.status || 'Unknown';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });
  const orderStatusData: OrderStatusDatum[] = Object.entries(statusCounts).map(
    ([name, value]) => ({ name, value })
  );

  // 4. UserGrowthChart: Aggregate users by signup date
  const usersByDate: Record<string, number> = {};
  users.forEach((user) => {
    const date = new Date(user.createdAt).toISOString().slice(0, 10);
    usersByDate[date] = (usersByDate[date] || 0) + 1;
  });
  const userGrowthData: UserGrowthDatum[] = Object.entries(usersByDate)
    .map(([date, users]) => ({ date, users }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <section className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-6 space-y-8">
      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ChartCard title="Sales & Revenue Trend">
            <SalesTrendChart data={salesTrendData} />
          </ChartCard>
        </div>
        <div>
          <ChartCard title="Order Status Breakdown">
            <OrderStatusPieChart data={orderStatusData} />
          </ChartCard>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ChartCard title="Top-Selling Products / Categories">
            <TopProductsChart data={topProducts} categoryData={topCategories} />
          </ChartCard>
        </div>
        <div>
          <ChartCard title="User Growth">
            <UserGrowthChart data={userGrowthData} />
          </ChartCard>
        </div>
      </div>
    </section>
  );
}
