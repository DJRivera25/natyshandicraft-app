'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchOrdersThunk,
  cancelOrderThunk,
} from '@/features/order/orderThunk';
import { apiCreateXenditInvoice } from '@/utils/api/xendit';
import { useHasMounted } from '@/utils/useHasMounted';
import { motion } from 'framer-motion';
import {
  Clock,
  CheckCircle,
  XCircle,
  Package,
  TrendingUp,
  Shield,
  Truck,
  Star,
} from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';
import {
  OrdersHeader,
  OrdersLayout,
  OrdersLoading,
  OrdersError,
  EmptyOrders,
  CancelOrderModal,
} from '@/components/Orders';

export default function MyOrdersPage() {
  const dispatch = useAppDispatch();
  const hasMounted = useHasMounted();

  const { orders, loading, error } = useAppSelector((state) => state.order);
  const user = useAppSelector((state) => state.auth.user);

  const [cancellingOrder, setCancellingOrder] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState<string | null>(
    null
  );
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<
    'all' | 'pending' | 'paid' | 'cancelled'
  >('all');

  useEffect(() => {
    if (user) {
      dispatch(fetchOrdersThunk());
    }
  }, [dispatch, user]);

  const handlePayNow = useCallback(
    async (orderId: string, totalAmount: number) => {
      try {
        if (!user) {
          alert('You must be logged in to pay.');
          return;
        }

        const { invoiceURL } = await apiCreateXenditInvoice({
          orderId,
          userId: user.id,
          amount: totalAmount,
          customerName: user.fullName,
          customerEmail: user.email,
        });

        window.location.href = invoiceURL;
      } catch (err) {
        console.error('❌ Failed to initiate payment:', err);
        alert('Failed to initiate payment. Please try again.');
      }
    },
    [user]
  );

  const handleCancelOrder = useCallback(
    async (orderId: string) => {
      setCancellingOrder(orderId);
      setShowCancelConfirm(null);

      try {
        await dispatch(cancelOrderThunk(orderId));
      } catch (err) {
        console.error('❌ Failed to cancel order:', err);
      } finally {
        setCancellingOrder(null);
      }
    },
    [dispatch]
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Package className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const canCancelOrder = (order: {
    status: string;
    paymentMethod?: string;
  }) => {
    return order.status === 'pending';
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleShowCancelConfirm = useCallback((orderId: string) => {
    setShowCancelConfirm(orderId);
  }, []);

  // Filter orders based on selected filter
  const filteredOrders = orders.filter((order) => {
    if (selectedFilter === 'all') return true;
    return order.status === selectedFilter;
  });

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    paid: orders.filter((o) => o.status === 'paid').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };

  // 💡 Prevent hydration mismatch
  if (!hasMounted) return null;

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-yellow-50/20">
        {/* Enhanced Header */}
        <OrdersHeader
          ordersCount={orders.length}
          pendingCount={stats.pending}
        />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
          {loading ? (
            <OrdersLoading />
          ) : error ? (
            <OrdersError error={error} />
          ) : orders.length === 0 ? (
            <EmptyOrders />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Enhanced Stats Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4"
              >
                <div className="bg-white rounded-2xl p-4 border border-amber-200/40 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.total}
                      </p>
                      <p className="text-xs text-gray-600">Total Orders</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-amber-200/40 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.pending}
                      </p>
                      <p className="text-xs text-gray-600">Pending</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-amber-200/40 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.paid}
                      </p>
                      <p className="text-xs text-gray-600">Completed</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-amber-200/40 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.cancelled}
                      </p>
                      <p className="text-xs text-gray-600">Cancelled</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Enhanced Filter Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl border border-amber-200/40 shadow-sm p-2"
              >
                <div className="flex gap-2">
                  {[
                    { key: 'all', label: 'All Orders', count: stats.total },
                    { key: 'pending', label: 'Pending', count: stats.pending },
                    { key: 'paid', label: 'Completed', count: stats.paid },
                    {
                      key: 'cancelled',
                      label: 'Cancelled',
                      count: stats.cancelled,
                    },
                  ].map((filter) => (
                    <motion.button
                      key={filter.key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setSelectedFilter(
                          filter.key as 'all' | 'pending' | 'paid' | 'cancelled'
                        )
                      }
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                        selectedFilter === filter.key
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {filter.label}
                      <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                        {filter.count}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Enhanced Orders List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No {selectedFilter === 'all' ? '' : selectedFilter} orders
                      found
                    </h3>
                    <p className="text-gray-600">
                      {selectedFilter === 'all'
                        ? 'Start shopping to see your orders here.'
                        : `You don&apos;t have any ${selectedFilter} orders yet.`}
                    </p>
                  </div>
                ) : (
                  <OrdersLayout
                    orders={filteredOrders}
                    expandedOrder={expandedOrder}
                    onToggleExpansion={toggleOrderExpansion}
                    onPayNow={handlePayNow}
                    onCancelOrder={handleShowCancelConfirm}
                    canCancelOrder={canCancelOrder}
                    getStatusIcon={getStatusIcon}
                    getStatusColor={getStatusColor}
                  />
                )}
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl border border-amber-200/40 shadow-sm p-6"
              >
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Why Shop With Us?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    We&apos;re committed to providing you with the best shopping
                    experience
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-xs font-medium text-gray-700">
                      Secure Payments
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Truck className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-xs font-medium text-gray-700">
                      Free Shipping
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Star className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="text-xs font-medium text-gray-700">
                      Premium Quality
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <TrendingUp className="w-6 h-6 text-amber-600" />
                    </div>
                    <p className="text-xs font-medium text-gray-700">
                      Fast Delivery
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Cancel Confirmation Modal */}
          <CancelOrderModal
            isOpen={!!showCancelConfirm}
            orderId={showCancelConfirm}
            onConfirm={() =>
              showCancelConfirm && handleCancelOrder(showCancelConfirm)
            }
            onCancel={() => setShowCancelConfirm(null)}
            isCancelling={!!cancellingOrder}
          />
        </div>
      </div>
    </PageWrapper>
  );
}
