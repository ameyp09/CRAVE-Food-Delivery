import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  Tag, 
  ShieldCheck, 
  Sparkles,
  ArrowLeft 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../services/api';

const CartPage = () => {
  const {
    cartItems,
    subtotal,
    deliveryFee,
    discountAmount,
    discountPercent,
    grandTotal,
    promoCode,
    applyPromoCode,
    removePromoCode,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();

  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');

  const freeDeliveryThreshold = 500;
  const neededForFree = Math.max(0, freeDeliveryThreshold - subtotal);

  const handleApplyCode = (e) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyPromoCode(promoInput);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
        <div className="w-24 h-24 rounded-full bg-orange-50 text-orange-400 flex items-center justify-center text-4xl mb-4">
          🛒
        </div>
        <h2 className="text-2xl font-black text-slate-900">Your Cart is Empty</h2>
        <p className="text-slate-500 text-sm mt-1 max-w-sm text-center">
          Looks like you haven't added anything to your cart yet. Discover hot cravings from our kitchen!
        </p>
        <Link
          to="/menu"
          className="mt-6 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold text-sm hover:from-orange-700 hover:to-amber-600 shadow-lg shadow-orange-500/25 transition active:scale-95"
        >
          Explore Delicious Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back and Page Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/menu"
              className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-orange-600 hover:bg-orange-50 transition"
              title="Continue Shopping"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-slate-900">Order Cart</h1>
              <p className="text-xs text-slate-500">
                Review your items before proceeding to instant delivery checkout
              </p>
            </div>
          </div>

          <button
            onClick={clearCart}
            className="text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-xl transition"
          >
            Clear Entire Cart
          </button>
        </div>

        {/* Free Delivery Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span>
              {neededForFree === 0
                ? '🎉 Congratulations! You unlocked FREE express delivery on this order!'
                : `Add ₹${neededForFree} more of delicious food to unlock FREE delivery!`}
            </span>
          </div>
          <Link to="/menu" className="text-orange-600 font-bold hover:underline whitespace-nowrap">
            + Add more dishes
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Cart Items ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
            </h3>

            <div className="divide-y divide-slate-100">
              {cartItems.map((item) => {
                const food = item.food;
                if (!food) return null;
                const foodId = food._id || food.id;

                return (
                  <div key={foodId} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={getImageUrl(food.image)}
                        alt={food.name}
                        className="w-20 h-20 rounded-2xl object-cover bg-slate-100 flex-shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              food.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          <h4 className="font-bold text-slate-900">{food.name}</h4>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{food.category}</p>
                        <p className="text-sm font-extrabold text-slate-800 mt-1">₹{food.price}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      {/* Counter */}
                      <div className="flex items-center bg-slate-100 rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(foodId, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg bg-white text-slate-700 flex items-center justify-center hover:bg-orange-50 hover:text-orange-600 shadow-xs transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-sm font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(foodId, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-white text-slate-700 flex items-center justify-center hover:bg-orange-50 hover:text-orange-600 shadow-xs transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Total */}
                      <span className="text-base font-black text-slate-900 min-w-[70px] text-right">
                        ₹{food.price * item.quantity}
                      </span>

                      {/* Delete */}
                      <button
                        onClick={() => removeFromCart(foodId)}
                        className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Promo Code Box */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-orange-600" />
                <h4 className="text-sm font-bold text-slate-900">Have a Promo Coupon?</h4>
              </div>

              {promoCode ? (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="text-xs">
                    <p className="font-bold text-emerald-800">Coupon applied: {promoCode}</p>
                    <p className="text-emerald-600">Saved {discountPercent}% off subtotal</p>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-xs text-red-600 hover:underline font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCode} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Enter CRAVE20"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold uppercase placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-orange-600 transition"
                  >
                    Apply
                  </button>
                </form>
              )}
              <p className="text-[11px] text-slate-400">Use promo code <strong>CRAVE20</strong> for 20% off.</p>
            </div>

            {/* Bill Summary */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
                Order Bill Summary
              </h3>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Item Subtotal</span>
                  <span className="font-semibold text-slate-900">₹{subtotal}</span>
                </div>
                
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-slate-900">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold uppercase text-xs">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount Coupon ({discountPercent}%)</span>
                    <span>- ₹{discountAmount}</span>
                  </div>
                )}

                <div className="border-t border-slate-100 pt-3 flex justify-between text-lg font-black text-slate-900">
                  <span>Total Payable</span>
                  <span className="text-orange-600">₹{grandTotal}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-sm shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 transition active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Safe & Secure Contactless Delivery</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default CartPage;
