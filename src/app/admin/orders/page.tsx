'use client';

import { useEffect, useState } from 'react';
import StatusBadge from '@/components/StatusBadge';
import AdminButton from '@/components/AdminButton';
import AdminModal from '@/components/AdminModal';
import AdminLoading from '@/components/AdminLoading';
import AdminError from '@/components/AdminError';
import OrderLocationMap from '@/components/OrderLocationMap';
import { format } from 'date-fns';
import type { Order } from '@/types/order';
import { Package } from 'lucide-react';
import Pagination from '@/components/Pagination';
import axios from 'axios';
import { useDebounce } from '@/hooks/useDebounce';
import { apiCancelOrder } from '@/utils/api/order';

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'cancelled', label: 'Cancelled' },
];

function getOrderUserName(user: unknown): string {
  if (
    user &&
    typeof user === 'object' &&
    'fullName' in user &&
    typeof (user as { fullName?: unknown }).fullName === 'string'
  ) {
    return (user as { fullName: string }).fullName;
  }
  if (typeof user === 'string') return user;
  return 'N/A';
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'pending' | 'paid' | 'cancelled'
  >('all');
  const limit = 20;
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, string | number> = {
        page,
        limit,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (statusFilter !== 'all') params.status = statusFilter;
      // Sorting can be added to the API if needed
      const res = await axios.get('/api/admin/orders', { params });
      setOrders(res.data.orders);
      setTotalPages(Math.ceil(res.data.total / limit));
    } catch {
      setError('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch, statusFilter]);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const handleCancelOrder = async (order: Order) => {
    setSelectedOrder(order);
    setShowCancelModal(true);
  };

  const confirmCancelOrder = async () => {
    if (!selectedOrder) return;
    setCancelLoading(true);
    try {
      await apiCancelOrder(selectedOrder._id);
      setShowCancelModal(false);
      setShowDetails(false);
      fetchOrders();
    } catch {
      setError('Failed to cancel order.');
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-yellow-50/20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-amber-900">Orders</h1>
          {/* Search/Filter Bar */}
          <div className="flex flex-wrap gap-2 items-center">
            <input
              type="text"
              placeholder="Search orders, customer, city, payment..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 border border-amber-200 rounded-lg text-sm focus:ring-amber-500 focus:border-amber-500 bg-white min-w-[180px]"
            />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(
                  e.target.value as 'all' | 'pending' | 'paid' | 'cancelled'
                );
                setPage(1);
              }}
              className="px-3 py-2 border border-amber-200 rounded-lg text-sm focus:ring-amber-500 focus:border-amber-500 bg-white"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Stats Bar */}
        <div className="flex flex-wrap gap-4 items-center mb-2 text-sm text-gray-700 font-medium">
          <span>Orders: {orders.length}</span>
          <span>
            Total Sales Value: ₱
            {orders
              .reduce((sum, o) => sum + (o.totalAmount || 0), 0)
              .toLocaleString()}
          </span>
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-amber-200/60 overflow-hidden">
          {loading ? (
            <AdminLoading message="Loading orders..." />
          ) : error ? (
            <AdminError error={error} />
          ) : orders.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              No orders found.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-amber-50">
                      <th className="px-4 py-2 text-left font-semibold text-amber-800">
                        Order ID
                      </th>
                      <th className="px-4 py-2 text-left font-semibold text-amber-800">
                        Customer
                      </th>
                      <th className="px-4 py-2 text-left font-semibold text-amber-800">
                        Amount
                      </th>
                      <th className="px-4 py-2 text-left font-semibold text-amber-800">
                        Status
                      </th>
                      <th className="px-4 py-2 text-left font-semibold text-amber-800">
                        Payment
                      </th>
                      <th className="px-4 py-2 text-left font-semibold text-amber-800">
                        Date
                      </th>
                      <th className="px-4 py-2 text-left font-semibold text-amber-800">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order._id}
                        className="border-b last:border-0 hover:bg-amber-50/40 transition-colors"
                      >
                        <td className="px-4 py-2 font-mono text-xs text-gray-900">
                          {order._id}
                        </td>
                        <td className="px-4 py-2">
                          {getOrderUserName(order.user)}
                        </td>
                        <td className="px-4 py-2">
                          ₱{order.totalAmount.toLocaleString()}
                        </td>
                        <td className="px-4 py-2">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-4 py-2">
                          {order.paymentMethod || 'N/A'}
                        </td>
                        <td className="px-4 py-2">
                          {format(
                            new Date(order.createdAt),
                            'yyyy-MM-dd HH:mm'
                          )}
                        </td>
                        <td className="px-4 py-2 flex gap-2 flex-wrap">
                          <AdminButton
                            variant="outline"
                            onClick={() => handleViewDetails(order)}
                          >
                            View
                          </AdminButton>
                          {order.status === 'pending' && (
                            <AdminButton
                              variant="danger"
                              onClick={() => handleCancelOrder(order)}
                            >
                              Cancel
                            </AdminButton>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
              <div className="flex justify-center items-center gap-2 mt-2 mb-1 text-xs text-gray-600 font-medium">
                Page {page} of {totalPages}
              </div>
            </>
          )}
        </div>
        {/* Order Details Modal */}
        <AdminModal
          open={showDetails && !!selectedOrder}
          title={`Order Details`}
          onClose={() => setShowDetails(false)}
          actions={
            selectedOrder && selectedOrder.status === 'pending' ? (
              <AdminButton
                variant="danger"
                className="w-full sm:w-auto"
                onClick={() => handleCancelOrder(selectedOrder!)}
              >
                Cancel Order
              </AdminButton>
            ) : null
          }
        >
          {selectedOrder && (
            <div className="space-y-3 text-sm max-h-[60vh] overflow-y-auto">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div>
                  <strong>Order ID:</strong> {selectedOrder._id}
                </div>
                <div>
                  <strong>Status:</strong>{' '}
                  <StatusBadge status={selectedOrder.status} />
                </div>
                <div>
                  <strong>Date:</strong>{' '}
                  {format(new Date(selectedOrder.createdAt), 'PPpp')}
                </div>
              </div>
              <div>
                <strong>Customer:</strong>{' '}
                {getOrderUserName(selectedOrder.user)}
              </div>
              <div>
                <strong>Address:</strong> {selectedOrder.address?.street},{' '}
                {selectedOrder.address?.city}, {selectedOrder.address?.province}
                , {selectedOrder.address?.postalCode},{' '}
                {selectedOrder.address?.country}
              </div>
              <div>
                <strong>Items:</strong>
                <ul className="list-disc ml-6 space-y-1">
                  {selectedOrder.items.map((item, index) => (
                    <li
                      key={`${item.productId}-${index}`}
                      className="flex items-center gap-2"
                    >
                      <span className="inline-block w-8 h-8 bg-gray-100 rounded overflow-hidden">
                        <Package className="w-6 h-6 text-amber-400 mx-auto my-1.5" />
                      </span>
                      <span className="font-medium">{item.name}</span> ×{' '}
                      {item.quantity}{' '}
                      <span className="text-gray-500">(₱{item.price})</span>
                    </li>
                  ))}
                </ul>
              </div>
              {selectedOrder.location && (
                <div className="mt-2">
                  <OrderLocationMap
                    location={selectedOrder.location}
                    address={selectedOrder.address}
                    orderId={selectedOrder._id}
                  />
                </div>
              )}
            </div>
          )}
        </AdminModal>
        {/* Cancel Order Modal */}
        <AdminModal
          open={showCancelModal}
          title="Cancel Order"
          onClose={() => setShowCancelModal(false)}
          actions={
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <AdminButton
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setShowCancelModal(false)}
                disabled={cancelLoading}
              >
                No, Keep Order
              </AdminButton>
              <AdminButton
                variant="danger"
                className="w-full sm:w-auto"
                onClick={confirmCancelOrder}
                loading={cancelLoading}
              >
                Yes, Cancel Order
              </AdminButton>
            </div>
          }
        >
          <div className="text-gray-700 text-sm">
            Are you sure you want to cancel this order? This action cannot be
            undone.
          </div>
        </AdminModal>
      </div>
    </div>
  );
}
