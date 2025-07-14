'use client';

import { useEffect, useState } from 'react';
import AdminLoading from '@/components/AdminLoading';
import AdminError from '@/components/AdminError';
import { Package, Users, ShoppingCart, TrendingUp } from 'lucide-react';
import { apiFetchAllProducts } from '@/utils/api/products';
import { apiFetchAdminOrders } from '@/utils/api/order';
import { apiFetchAllUsers } from '@/utils/api/user';
import AnalyticsSection from './AnalyticsSection';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  loading?: boolean;
}

function SummaryCard({ title, value, icon, loading }: SummaryCardProps) {
  return (
    <div className="flex flex-col bg-white rounded-xl shadow p-6 border border-amber-200/60 min-w-[180px] min-h-[120px] justify-between">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="text-sm font-semibold text-amber-800">{title}</h3>
      </div>
      {loading ? (
        <AdminLoading message={`Loading ${title.toLowerCase()}...`} />
      ) : (
        <span className="text-2xl font-bold text-amber-900">{value}</span>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ordersCount, setOrdersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError('');
      try {
        const [ordersRes, products, usersRes] = await Promise.all([
          apiFetchAdminOrders({ page: 1, limit: 20 }),
          apiFetchAllProducts(1, 1),
          apiFetchAllUsers(),
        ]);
        setOrdersCount(ordersRes.total);
        setProductsCount(products.total);
        setUsersCount(usersRes.total || usersRes.length || 0);
        setRevenue(
          ordersRes.orders.reduce(
            (sum: number, o: { totalAmount?: number }) =>
              sum + (o.totalAmount || 0),
            0
          )
        );
      } catch {
        setError('Failed to fetch dashboard stats.');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-amber-900 mb-6">
        Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <SummaryCard
          title="Orders"
          value={ordersCount}
          icon={<ShoppingCart className="w-6 h-6 text-amber-600" />}
          loading={loading}
        />
        <SummaryCard
          title="Products"
          value={productsCount}
          icon={<Package className="w-6 h-6 text-amber-600" />}
          loading={loading}
        />
        <SummaryCard
          title="Users"
          value={usersCount}
          icon={<Users className="w-6 h-6 text-amber-600" />}
          loading={loading}
        />
        <SummaryCard
          title="Revenue"
          value={`₱${revenue.toLocaleString()}`}
          icon={<TrendingUp className="w-6 h-6 text-amber-600" />}
          loading={loading}
        />
      </div>
      {error && <AdminError error={error} />}

      <AnalyticsSection />
    </div>
  );
}
