import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../services/api';

const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    subtotal,
    deliveryFee,
    discountAmount,
    grandTotal,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();

  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = 500;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const deliveryProgressPercent = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const handleViewCartClick = () => {
    setIsCartOpen(false);
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-extrabold text-slate-800">Your Crave Cart</h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)} items
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Goal Banner */}
          {cartItems.length > 0 && (
            <div className="px-6 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1 text-orange-700 font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  {amountNeededForFreeDelivery === 0
                    ? '🎉 You unlocked FREE Delivery!'
                    : `Add ₹${amountNeededForFreeDelivery} more for FREE Delivery!`}
                </span>
                <span className="text-slate-400 font-mono">₹{subtotal} / ₹{freeDeliveryThreshold}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-orange-200/50 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300 rounded-full"
                  style={{ width: `${deliveryProgressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-orange-50 text-orange-400 flex items-center justify-center text-3xl">
                  🛒
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Your cart is empty</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Explore our curated menu and add delicious food to satisfy your cravings!
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/menu');
                  }}
                  className="px-6 py-2.5 rounded-2xl bg-orange-600 text-white font-bold text-sm hover:bg-orange-700 shadow-md transition"
                >
                  Explore Delicious Menu
                </button>
              </div>
            ) : (
              cartItems.map((item) => {
                const food = item.food;
                if (!food) return null;
                const foodId = food._id || food.id;

                return (
                  <div
                    key={foodId}
                    className="flex items-center gap-4 p-3 rounded-2xl border border-slate-100 bg-white hover:border-orange-200 shadow-sm transition"
                  >
                    <img
                      src={getImageUrl(food.image)}
                      alt={food.name}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-slate-100"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            food.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                        <h4 className="font-bold text-sm text-slate-800 truncate">
                          {food.name}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">₹{food.price} each</p>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                          <button
                            onClick={() => updateQuantity(foodId, item.quantity - 1)}
                            className="w-6 h-6 rounded-md bg-white text-slate-600 flex items-center justify-center hover:bg-orange-50 hover:text-orange-600 shadow-xs transition"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(foodId, item.quantity + 1)}
                            className="w-6 h-6 rounded-md bg-white text-slate-600 flex items-center justify-center hover:bg-orange-50 hover:text-orange-600 shadow-xs transition"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Total per item & trash */}
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-sm text-slate-900">
                            ₹{food.price * item.quantity}
                          </span>
                          <button
                            onClick={() => removeFromCart(foodId)}
                            className="text-slate-400 hover:text-red-500 transition p-1"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer / Bill Summary */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-slate-800">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold uppercase text-xs">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>- ₹{discountAmount}</span>
                  </div>
                )}
                <div className="border-t border-slate-200/80 pt-2 flex justify-between text-base font-extrabold text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-orange-600 text-lg">₹{grandTotal}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleViewCartClick}
                  className="w-full py-3 px-4 rounded-2xl border border-slate-300 hover:bg-white text-slate-700 font-bold text-sm transition text-center"
                >
                  View Full Cart
                </button>
                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
