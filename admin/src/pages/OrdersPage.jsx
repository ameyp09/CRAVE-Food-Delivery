import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  MapPin, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  X, 
  RefreshCw,
  Clock
} from 'lucide-react';
import api, { getImageUrl } from '../services/api';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  'Order Placed',
  'Confirmed',
  'Preparing',
  'Out for Delivery',
  'Delivered',
  'Cancelled'
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Order Placed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'Confirmed': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'Preparing': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'Out for Delivery': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'Delivered': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'Cancelled': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    default: return 'bg-slate-700 text-slate-300 border-slate-600';
  }
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const res = await api.get('/admin/orders', { params });
      if (res.data?.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      toast.error('Could not load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      if (res.data?.success) {
        toast.success(`Order status updated to "${newStatus}"!`);
        // Update local list
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? res.data.order : o))
        );
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(res.data.order);
        }
      }
    } catch (err) {
      console.error('Status update failed:', err);
      toast.error(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Orders Manager 📦</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time status updater, dispatch manager, and customer fulfillment logs
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by phone, street, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </form>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              statusFilter === 'all'
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            All ({orders.length})
          </button>
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                statusFilter === status
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl bg-slate-800/80 border border-slate-700/60 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-700/80 bg-slate-900/60 text-slate-400 uppercase font-bold tracking-wider">
                <th className="py-4 px-4">Order ID & Date</th>
                <th className="py-4 px-4">Customer Details</th>
                <th className="py-4 px-4">Delivery Address</th>
                <th className="py-4 px-4">Amount & Payment</th>
                <th className="py-4 px-4">Live Status Controller</th>
                <th className="py-4 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-orange-500" />
                    <span>Loading platform orders...</span>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No orders found matching the filter.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <tr key={order._id} className="hover:bg-slate-700/30 transition">
                      {/* ID and Date */}
                      <td className="py-4 px-4">
                        <span className="font-mono font-bold text-white block">
                          #{order._id.substring(order._id.length - 8).toUpperCase()}
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5 block">
                          {formattedDate}
                        </span>
                      </td>

                      {/* Customer Info */}
                      <td className="py-4 px-4">
                        <span className="font-bold text-white block">
                          {order.user?.name || 'Guest User'}
                        </span>
                        <span className="text-[11px] text-slate-400 block truncate max-w-[150px]">
                          {order.user?.email}
                        </span>
                        <span className="text-[11px] text-orange-400 font-mono mt-0.5 block">
                          {order.deliveryAddress?.phone}
                        </span>
                      </td>

                      {/* Address */}
                      <td className="py-4 px-4 max-w-[200px]">
                        <span className="text-slate-300 font-medium block truncate">
                          {order.deliveryAddress?.street}
                        </span>
                        <span className="text-[11px] text-slate-400 block truncate">
                          {order.deliveryAddress?.city}, {order.deliveryAddress?.zipCode}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4">
                        <span className="text-base font-black text-orange-400 block">
                          ₹{order.totalAmount}
                        </span>
                        <span className="text-[11px] text-slate-400 block">
                          {order.paymentMethod} • <span className={order.paymentStatus === 'Completed' ? 'text-emerald-400 font-bold' : 'text-amber-400'}>{order.paymentStatus}</span>
                        </span>
                      </td>

                      {/* Instant Status Changer Dropdown */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={order.orderStatus}
                            disabled={updatingId === order._id}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer transition ${getStatusColor(order.orderStatus)}`}
                          >
                            {STATUS_OPTIONS.map((st) => (
                              <option key={st} value={st} className="bg-slate-900 text-white font-normal">
                                {st}
                              </option>
                            ))}
                          </select>
                          {updatingId === order._id && (
                            <RefreshCw className="w-3.5 h-3.5 text-orange-400 animate-spin" />
                          )}
                        </div>
                      </td>

                      {/* View Action */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 rounded-xl bg-slate-700/60 hover:bg-slate-600 text-slate-300 hover:text-white transition shadow-sm"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILED ORDER MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-white">Order Details</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(selectedOrder.orderStatus)}`}>
                    {selectedOrder.orderStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  ID: #{selectedOrder._id}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="overflow-y-auto space-y-6 flex-1 pr-1">
              
              {/* Customer & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs">
                <div>
                  <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-1">Customer</h4>
                  <p className="font-bold text-white text-sm">{selectedOrder.user?.name || 'Customer'}</p>
                  <p className="text-slate-400">{selectedOrder.user?.email}</p>
                  <p className="text-orange-400 font-mono mt-1">📞 {selectedOrder.deliveryAddress?.phone}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-1">Shipping Address</h4>
                  <p className="font-bold text-white">{selectedOrder.deliveryAddress?.street}</p>
                  <p className="text-slate-400">{selectedOrder.deliveryAddress?.city}, {selectedOrder.deliveryAddress?.state} {selectedOrder.deliveryAddress?.zipCode}</p>
                </div>
              </div>

              {/* Status Update Quick Bar */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-300">Update Fulfillment Step</p>
                  <p className="text-[11px] text-slate-400">Instantly pushes updates to customer's live tracker</p>
                </div>

                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${getStatusColor(selectedOrder.orderStatus)}`}
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st} className="bg-slate-900 text-white font-normal">
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ordered Items List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Ordered Items ({selectedOrder.items.length})
                </h4>
                <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl overflow-hidden bg-slate-800/40">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-700 flex-shrink-0"
                        />
                        <div>
                          <p className="text-xs font-bold text-white">{item.name}</p>
                          <p className="text-[11px] text-slate-400">
                            {item.quantity} x ₹{item.price}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-orange-400">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Timeline History */}
              {selectedOrder.statusTimeline && selectedOrder.statusTimeline.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Status History
                  </h4>
                  <div className="space-y-1.5 p-3 rounded-2xl bg-slate-800/40 border border-slate-800 text-xs">
                    {selectedOrder.statusTimeline.map((tl, i) => (
                      <div key={i} className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                          {tl.status}
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          {new Date(tl.timestamp).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Payment: <strong>{selectedOrder.paymentMethod}</strong> ({selectedOrder.paymentStatus})
              </span>
              <div className="text-right">
                <span className="text-xs text-slate-400 mr-2">Grand Total:</span>
                <span className="text-xl font-black text-orange-400">₹{selectedOrder.totalAmount}</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default OrdersPage;
