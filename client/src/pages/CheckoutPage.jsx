import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  CreditCard, 
  Banknote, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Lock,
  ArrowLeft 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { cartItems, subtotal, deliveryFee, discountAmount, grandTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Address Form State
  const defaultAddress = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0] || {};
  const [address, setAddress] = useState({
    street: defaultAddress.street || '',
    city: defaultAddress.city || '',
    state: defaultAddress.state || 'California',
    zipCode: defaultAddress.zipCode || '',
    phone: user?.phone || ''
  });

  const handleAddressChange = (e) => {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectSavedAddress = (saved) => {
    setAddress({
      street: saved.street || '',
      city: saved.city || '',
      state: saved.state || 'California',
      zipCode: saved.zipCode || '',
      phone: user?.phone || address.phone
    });
    toast.success('Address auto-filled from your profile!');
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please sign in or create an account to complete your order.');
      openAuthModal('login');
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error('Your cart is empty');
      navigate('/menu');
      return;
    }

    if (!address.street || !address.city || !address.phone) {
      toast.error('Please fill in complete delivery address and phone number.');
      return;
    }

    try {
      setIsSubmitting(true);

      const orderPayload = {
        items: cartItems.map((item) => ({
          food: item.food?._id || item.food,
          name: item.food?.name,
          price: item.food?.price,
          quantity: item.quantity,
          image: item.food?.image
        })),
        deliveryAddress: address,
        paymentMethod,
        subtotal,
        deliveryFee,
        totalAmount: grandTotal
      };

      const res = await api.post('/orders', orderPayload);

      if (res.data?.success) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });

        const newOrder = res.data.order;
        setOrderSuccess(newOrder);
        clearCart();
        toast.success('Order placed successfully! Steaming hot food is on the way! 🚀');
      }
    } catch (err) {
      console.error('Order placement error:', err);
      toast.error(err.response?.data?.message || 'Failed to place order. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-100 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-4xl shadow-lg">
            🎉
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Order Confirmed!</h2>
            <p className="text-xs text-slate-500 mt-1">
              Order ID: <span className="font-mono font-bold text-slate-700">#{orderSuccess._id}</span>
            </p>
          </div>

          <div className="bg-orange-50/70 p-4 rounded-2xl border border-orange-100 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Delivering to:</span>
              <span className="font-bold text-slate-800">{orderSuccess.deliveryAddress?.street}, {orderSuccess.deliveryAddress?.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Amount:</span>
              <span className="font-extrabold text-orange-600 text-sm">₹{orderSuccess.totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment:</span>
              <span className="font-bold text-slate-800">{orderSuccess.paymentMethod}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate(`/orders/${orderSuccess._id}`)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold text-sm shadow-lg shadow-orange-500/25 hover:from-orange-700 hover:to-amber-600 transition"
            >
              Track Live Order 📍
            </button>
            <button
              onClick={() => navigate('/menu')}
              className="w-full py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
            >
              Continue Exploring Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-orange-600 hover:bg-orange-50 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-900">Checkout</h1>
            <p className="text-xs text-slate-500">
              Provide delivery details and choose your preferred payment method
            </p>
          </div>
        </div>

        {/* Not Logged In Warning Banner */}
        {!isAuthenticated && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
            <span className="text-amber-800 font-semibold">
              ⚠️ You are not signed in. Sign in now to auto-fill your saved addresses and track this order.
            </span>
            <button
              onClick={() => openAuthModal('login')}
              className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition self-start sm:self-auto"
            >
              Sign In to Continue
            </button>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Delivery Address & Payment Method */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Delivery Address Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">Delivery Address</h3>
                </div>

                {user?.addresses && user.addresses.length > 0 && (
                  <span className="text-xs font-semibold text-slate-400">
                    Saved Addresses Available
                  </span>
                )}
              </div>

              {/* Saved Address Pills if any */}
              {user?.addresses && user.addresses.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase text-slate-400">Choose from saved address:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {user.addresses.map((a, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectSavedAddress(a)}
                        className={`p-3 rounded-2xl border text-xs cursor-pointer transition ${
                          address.street === a.street
                            ? 'border-orange-500 bg-orange-50/50 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <p className="font-bold text-slate-800 truncate">{a.street}</p>
                        <p className="text-slate-500">{a.city}, {a.zipCode}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Manual Form Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Street Address & Apartment / Suite *
                  </label>
                  <input
                    type="text"
                    name="street"
                    required
                    placeholder="e.g. 123 Gourmet Lane, Apt 4B"
                    value={address.street}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="e.g. San Francisco"
                    value={address.city}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Zip / Postal Code *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    required
                    placeholder="e.g. 94105"
                    value={address.zipCode}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Contact Phone Number (For delivery driver) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="e.g. +1 (555) 782-9901"
                    value={address.phone}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Method Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">Payment Option</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Cash on Delivery */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                    paymentMethod === 'COD'
                      ? 'border-orange-500 bg-orange-50/50 shadow-sm ring-1 ring-orange-500'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="mt-1 text-orange-600 focus:ring-orange-500"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      <span>Cash on Delivery (COD)</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pay cash or scan UPI QR code upon arrival at your doorstep.
                    </p>
                  </div>
                </label>

                {/* Instant Online Mock Card */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                    paymentMethod === 'Stripe'
                      ? 'border-orange-500 bg-orange-50/50 shadow-sm ring-1 ring-orange-500'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Stripe"
                    checked={paymentMethod === 'Stripe'}
                    onChange={() => setPaymentMethod('Stripe')}
                    className="mt-1 text-orange-600 focus:ring-orange-500"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span>Online / Card / UPI</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Instant contactless online authorization (Mock test gateway).
                    </p>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Right Column: Order Review & Confirmation */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Order Items ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
            </h3>

            {/* Compact items list */}
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 text-xs">
              {cartItems.map((item) => (
                <div key={item.food?._id || item.food} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="font-bold text-slate-800">{item.quantity}x</span>
                    <span className="text-slate-700 truncate">{item.food?.name}</span>
                  </div>
                  <span className="font-extrabold text-slate-900">
                    ₹{(item.food?.price || 0) * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Fee</span>
                <span className="font-semibold text-slate-900">
                  {deliveryFee === 0 ? <span className="text-emerald-600 font-bold uppercase">FREE</span> : `₹${deliveryFee}`}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span>- ₹{discountAmount}</span>
                </div>
              )}
              <div className="border-t border-slate-200 pt-2 flex justify-between text-base font-black text-slate-900">
                <span>Total Amount</span>
                <span className="text-orange-600">₹{grandTotal}</span>
              </div>
            </div>

            {/* Submit Place Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-sm shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-75"
            >
              <span>{isSubmitting ? 'Placing Order...' : 'Confirm & Place Order'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>256-bit Encrypted Checkout</span>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

export default CheckoutPage;
