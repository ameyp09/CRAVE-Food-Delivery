import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Package, Calendar, MapPin, CheckCircle2, ChevronRight } from 'lucide-react';
import api, { getImageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';

const getStatusBadge = (status) => {
  switch (status) {
    case 'Order Placed':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Confirmed':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Preparing':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'Out for Delivery':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Delivered':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Cancelled':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

const MyOrdersPage = () => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await api.get('/orders/my-orders');
        if (res.data?.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error('Failed to fetch user orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-orange-50 text-orange-400 flex items-center justify-center text-3xl">
          🔒
        </div>
        <h2 className="text-2xl font-black text-slate-900">Sign in to view orders</h2>
        <p className="text-slate-500 text-sm max-w-sm">
          Please log in to track your active orders and see past culinary delivery receipts.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-8 py-3 rounded-2xl bg-orange-600 text-white font-bold text-sm hover:bg-orange-700 shadow-md transition"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-slate-900">My Orders 📦</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track real-time status of current shipments and review previous invoices
          </p>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-40 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8 space-y-4 shadow-sm">
            <div className="w-20 h-20 mx-auto rounded-full bg-orange-50 text-orange-400 flex items-center justify-center text-4xl">
              🍽️
            </div>
            <h3 className="text-xl font-bold text-slate-800">No Orders Placed Yet</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              Your tummy must be craving something special! Dive into our chef-curated menu now.
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-700 shadow-md transition"
            >
              <span>Explore Food Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              const isLive = order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled';

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm hover:shadow-md transition space-y-5"
                >
                  {/* Order Top Meta */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-slate-500">
                          #{order._id.substring(order._id.length - 8).toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                        {isLive && (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-orange-500" />
                            Live Active Order
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formattedDate}</span>
                      </div>
                    </div>

                    <Link
                      to={`/orders/${order._id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold transition self-start sm:self-auto"
                    >
                      <span>Track Order Progress</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Item Thumbnails & Description */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50/70 border border-slate-100">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-200 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                          <p className="text-[11px] text-slate-500">
                            {item.quantity} x ₹{item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer: Address + Total */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 border-t border-slate-100 gap-3">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
                      <span>{order.deliveryAddress?.street}, {order.deliveryAddress?.city}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span>Payment: <strong>{order.paymentMethod}</strong> ({order.paymentStatus})</span>
                      <span className="text-sm font-black text-slate-900">
                        Total: <span className="text-orange-600 font-extrabold text-base">₹{order.totalAmount}</span>
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyOrdersPage;
