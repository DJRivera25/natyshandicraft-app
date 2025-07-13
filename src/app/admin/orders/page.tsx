'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchOrdersThunk } from '@/features/order/orderThunk';
import { format } from 'date-fns';
import { useHasMounted } from '@/utils/useHasMounted';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  ArrowLeft,
  AlertCircle,
  Calendar,
  MapPin,
  RefreshCw,
  Users,
  TrendingUp,
  Search,
  ChevronRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import PageWrapper from '@/components/PageWrapper';
import OrderLocationMap from '@/components/OrderLocationMap';

export default function AdminOrdersPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const hasMounted = useHasMounted();

  const { orders, loading, error } = useAppSelector((state) => state.order);
  const user = useAppSelector((state) => state.auth.user);

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (user?.isAdmin) {
      dispatch(fetchOrdersThunk());
    }
  }, [dispatch, user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-3 h-3 text-green-600" />;
      case 'pending':
        return <Clock className="w-3 h-3 text-amber-600" />;
      case 'cancelled':
        return <XCircle className="w-3 h-3 text-red-600" />;
      default:
        return <Package className="w-3 h-3 text-gray-600" />;
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

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Payment received, preparing for delivery';
      case 'pending':
        return 'Awaiting payment confirmation';
      case 'cancelled':
        return 'Order has been cancelled';
      default:
        return 'Processing your order';
    }
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Filter orders based on status and search
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch =
      searchTerm === '' ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      (order.address?.city &&
        order.address.city.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  // Calculate stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const paidOrders = orders.filter((o) => o.status === 'paid').length;
  const ordersWithLocation = orders.filter((o) => o.location).length;

  // 💡 Prevent hydration mismatch
  if (!hasMounted) return null;

  if (!user?.isAdmin) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-gradient-to-br from-amber-50/30 to-white flex items-center justify-center p-4">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600">
              You don&apos;t have permission to view this page.
            </p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-amber-50/30 to-white">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-amber-200/60 shadow-sm">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/admin')}
                  className="p-2 rounded-xl hover:bg-amber-50 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-amber-600" />
                </motion.button>
                <div>
                  <h1 className="text-lg font-bold text-amber-900">
                    Order Management
                  </h1>
                  <p className="text-xs text-amber-600">
                    {totalOrders} total orders • {ordersWithLocation} with
                    location
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-3 border border-amber-200/40 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-600" />
                <span className="text-xs text-gray-600">Total</span>
              </div>
              <p className="text-lg font-bold text-amber-900">{totalOrders}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-3 border border-amber-200/40 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="text-xs text-gray-600">Pending</span>
              </div>
              <p className="text-lg font-bold text-amber-900">
                {pendingOrders}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-3 border border-green-200/40 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-xs text-gray-600">Paid</span>
              </div>
              <p className="text-lg font-bold text-green-900">{paidOrders}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-3 border border-blue-200/40 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-gray-600">With Location</span>
              </div>
              <p className="text-lg font-bold text-blue-900">
                {ordersWithLocation}
              </p>
            </motion.div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders, products, or cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="p-4 space-y-3">
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-2 border-amber-200 border-t-amber-600 rounded-full mb-3"
              />
              <p className="text-sm text-gray-600">Loading orders...</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-xl p-4"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 mb-2">
                    Something went wrong
                  </p>
                  <p className="text-xs text-red-700 mb-3">{error}</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => dispatch(fetchOrdersThunk())}
                    className="flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-700 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Try Again
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {!loading && !error && filteredOrders.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
              >
                <Package className="w-8 h-8 text-amber-600" />
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-sm text-gray-600 text-center mb-6 max-w-xs">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your filters to find more orders.'
                  : 'No orders have been placed yet.'}
              </p>
            </motion.div>
          )}

          {!loading && !error && filteredOrders.length > 0 && (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredOrders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.05,
                    }}
                    className="bg-white rounded-2xl border border-amber-200/40 shadow-sm overflow-hidden"
                  >
                    {/* Order Header */}
                    <motion.div
                      whileHover={{ backgroundColor: '#fafafa' }}
                      whileTap={{ backgroundColor: '#f5f5f5' }}
                      onClick={() => toggleOrderExpansion(order._id)}
                      className="p-4 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-amber-900">
                              #{order._id.slice(-6)}
                            </span>
                            <span
                              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}
                            >
                              {getStatusIcon(order.status)}
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </span>
                            {order.location && (
                              <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                                <MapPin className="w-3 h-3" />
                                Location
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(
                                new Date(order.createdAt),
                                'MMM d, h:mm a'
                              )}
                            </span>
                            <span className="flex items-center gap-1 font-medium text-amber-700">
                              <TrendingUp className="w-3 h-3" />
                              {order.totalAmount.toFixed(2)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              Customer
                            </span>
                          </div>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 text-gray-400 transition-transform ${
                            expandedOrder === order._id ? 'rotate-90' : ''
                          }`}
                        />
                      </div>
                    </motion.div>

                    {/* Expandable Content */}
                    <AnimatePresence>
                      {expandedOrder === order._id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-amber-100"
                        >
                          <div className="p-4 space-y-4">
                            {/* Status Description */}
                            <div className="flex items-center gap-2 text-xs text-gray-600 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-3 border border-amber-200/40">
                              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                              {getStatusDescription(order.status)}
                            </div>

                            {/* Order Items */}
                            <div className="space-y-2">
                              {order.items.map((item, itemIndex) => (
                                <motion.div
                                  key={`${order._id}-${item.productId || itemIndex}`}
                                  initial={{ opacity: 0, x: -5 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: itemIndex * 0.05 }}
                                  className="flex justify-between items-center p-3 bg-gray-50 rounded-xl"
                                >
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {item.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Qty: {item.quantity}
                                    </p>
                                  </div>
                                  <p className="text-sm font-semibold text-amber-700 ml-2">
                                    {(item.price * item.quantity).toFixed(2)}
                                  </p>
                                </motion.div>
                              ))}
                            </div>

                            {/* Order Details */}
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              {order.paymentMethod && (
                                <div className="flex items-center gap-2 text-gray-600 bg-gray-50 rounded-lg p-2">
                                  <CreditCard className="w-3 h-3" />
                                  <span className="capitalize">
                                    {order.paymentMethod}
                                  </span>
                                </div>
                              )}
                              {order.address && (
                                <div className="flex items-center gap-2 text-gray-600 bg-gray-50 rounded-lg p-2">
                                  <MapPin className="w-3 h-3" />
                                  <span className="truncate">
                                    {order.address.city}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Location Map */}
                            {order.location && (
                              <OrderLocationMap
                                location={order.location}
                                address={order.address}
                                orderId={order._id}
                              />
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
