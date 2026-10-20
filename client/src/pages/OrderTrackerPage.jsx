import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  Bike, 
  Home, 
  MapPin, 
  Phone, 
  Calendar, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import api, { getImageUrl } from '../services/api';

const ORDER_STEPS = [
  { status: 'Order Placed', label: 'Order Placed', icon: Clock, desc: 'We received your order' },
  { status: 'Confirmed', label: 'Confirmed', icon: CheckCircle2, desc: 'Restaurant confirmed your order' },
  { status: 'Preparing', label: 'Preparing', icon: ChefHat, desc: 'Chef is preparing your meal' },
  { status: 'Out for Delivery', label: 'Out for Delivery', icon: Bike, desc: 'Delivery partner is on the way' },
  { status: 'Delivered', label: 'Delivered', icon: Home, desc: 'Enjoy your hot meal!' }
];

const OrderTrackerPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrder = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    try {
      const res = await api.get(`/orders/${id}`);
      if (res.data?.success) {
        setOrder(res.data.order);
        setError(null);
      }
    } catch (err) {
      console.error('Failed to fetch order status:', err);
      setError(err.response?.data?.message || 'Could not load order details');
    } finally {
      setLoading(false);
      if (showRefreshIndicator) setIsRefreshing(false);
    }
  };

  // Initial fetch and auto-refresh every 6 seconds for live tracker sync
  useEffect(() => {
    fetchOrder();

    const interval = setInterval(() => {
      fetchOrder();
    }, 6000);

    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-orange-600 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-700">Connecting to live order tracker...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-16 h-16 text-rose-500" />
        <h2 className="text-2xl font-black text-slate-900">Order Not Found</h2>
        <p className="text-sm text-slate-500 max-w-sm">
          {error || "We couldn't retrieve the details for this order."}
        </p>
        <Link
          to="/my-orders"
          className="px-6 py-3 rounded-2xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-700 transition"
        >
          Back to My Orders
        </Link>
      </div>
    );
  }

  // Determine current step index
  const currentStepIndex = ORDER_STEPS.findIndex((s) => s.status === order.orderStatus);
  const isCancelled = order.orderStatus === 'Cancelled';

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/my-orders"
              className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-orange-600 hover:bg-orange-50 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Live Order Tracker
                </h1>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Order ID: #{order._id}
              </p>
            </div>
          </div>

          <button
            onClick={() => fetchOrder(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-orange-50 hover:text-orange-600 text-xs font-bold transition shadow-xs"
            title="Refresh Status"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>

        {/* Cancelled Banner if applicable */}
        {isCancelled && (
          <div className="p-5 rounded-3xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-rose-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm">This order has been cancelled.</p>
              <p className="text-xs text-rose-600">If you were charged, your refund will be credited back automatically.</p>
            </div>
          </div>
        )}

        {/* 1. VISUAL STEPPER TRACKER */}
        {!isCancelled && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm space-y-8">
            <div className="text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                Current Status
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                {order.orderStatus === 'Delivered'
                  ? 'Delivered & Enjoyed! 🎉'
                  : ORDER_STEPS[currentStepIndex]?.desc || order.orderStatus}
              </h2>
            </div>

            {/* Stepper Progress Bar */}
            <div className="relative">
              {/* Desktop Stepper Bar */}
              <div className="hidden md:flex items-center justify-between relative">
                {/* Connecting Line */}
                <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-slate-100 z-0" />
                <div
                  className="absolute left-8 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-orange-500 to-amber-500 z-0 transition-all duration-500"
                  style={{
                    width: `${Math.max(0, (currentStepIndex / (ORDER_STEPS.length - 1)) * 92)}%`
                  }}
                />

                {ORDER_STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isCompleted = idx < currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div key={step.status} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          isCompleted
                            ? 'bg-emerald-500 text-white shadow-md'
                            : isCurrent
                            ? 'bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-xl shadow-orange-500/30 scale-110 ring-4 ring-orange-100'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span
                        className={`text-xs font-bold mt-3 text-center max-w-[90px] ${
                          isCurrent
                            ? 'text-orange-600 font-black'
                            : isCompleted
                            ? 'text-slate-800'
                            : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Mobile Vertical Stepper */}
              <div className="md:hidden space-y-6">
                {ORDER_STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isCompleted = idx < currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div key={step.status} className="flex items-start gap-4">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : isCurrent
                            ? 'bg-orange-600 text-white shadow-md ring-4 ring-orange-100 scale-105'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p
                          className={`text-sm font-bold ${
                            isCurrent
                              ? 'text-orange-600'
                              : isCompleted
                              ? 'text-slate-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status Timeline History Logs */}
            {order.statusTimeline && order.statusTimeline.length > 0 && (
              <div className="border-t border-slate-100 pt-6">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                  Status Activity Log
                </h4>
                <div className="space-y-2">
                  {order.statusTimeline.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs text-slate-600">
                      <span className="font-semibold text-slate-800 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                        {item.status}
                      </span>
                      <span className="text-slate-400">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* 2. ORDER DETAILS & DELIVERY ADDRESS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Delivery Address Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin className="w-4 h-4 text-orange-600" />
              <h3 className="text-sm font-bold text-slate-900">Destination Address</h3>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <p className="font-bold text-slate-800 text-sm">{order.deliveryAddress?.street}</p>
              <p>{order.deliveryAddress?.city}, {order.deliveryAddress?.state} {order.deliveryAddress?.zipCode}</p>
              <div className="flex items-center gap-1.5 text-slate-700 pt-2 font-medium">
                <Phone className="w-3.5 h-3.5 text-orange-500" />
                <span>Contact: {order.deliveryAddress?.phone}</span>
              </div>
            </div>
          </div>

          {/* Payment & Breakdown Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Payment & Bill Details</h3>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {order.paymentMethod} • {order.paymentStatus}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Delivery Fee</span>
                <span className="font-semibold text-slate-800">
                  {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
                </span>
              </div>
              <div className="border-t border-slate-100 pt-2 flex justify-between text-sm font-black text-slate-900">
                <span>Total Paid</span>
                <span className="text-orange-600">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>

        </div>

        {/* 3. ORDERED ITEMS ITEMIZED */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
            Itemized Order ({order.items.length})
          </h3>

          <div className="divide-y divide-slate-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{item.name}</h4>
                    <p className="text-[11px] text-slate-400">Quantity: {item.quantity}</p>
                  </div>
                </div>

                <span className="text-xs font-extrabold text-slate-900">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderTrackerPage;
