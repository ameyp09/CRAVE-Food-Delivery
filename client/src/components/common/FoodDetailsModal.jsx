import React, { useState } from 'react';
import { X, Star, Clock, Plus, Minus, ShoppingBag, ShieldCheck, Flame } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../services/api';

const FoodDetailsModal = ({ food, onClose }) => {
  const { addToCart, getItemQuantity } = useCart();
  const currentInCart = food ? getItemQuantity(food._id || food.id) : 0;
  const [quantity, setQuantity] = useState(currentInCart > 0 ? currentInCart : 1);

  if (!food) return null;

  const handleAdd = () => {
    addToCart(food, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/80 flex items-center justify-center transition shadow-lg"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Hero Image */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100 flex-shrink-0">
          <img
            src={getImageUrl(food.image)}
            alt={food.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

          {/* Badges on image */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-600 text-white shadow-md">
                {food.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 drop-shadow-md">
                {food.name}
              </h2>
            </div>
            
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-md text-slate-900 text-sm font-bold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{food.rating ? food.rating.toFixed(1) : '4.5'}</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
              food.isVeg ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${food.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              {food.isVeg ? 'Pure Vegetarian' : 'Non-Vegetarian'}
            </div>

            <div className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-orange-500" />
              <span>Prep Time: {food.prepTime || '20-30 mins'}</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-orange-50 text-orange-700 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>Freshly Cooked to Order</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              <span>100% Hygiene Verified</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Description</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              {food.description}
            </p>
          </div>

          {/* Special highlights */}
          <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100 space-y-2">
            <h4 className="text-xs font-bold text-orange-950 uppercase tracking-wider">Chef's Promise</h4>
            <p className="text-xs text-orange-900/80 leading-relaxed">
              Crafted fresh using responsibly sourced authentic ingredients, cooked to perfection right when your order is placed.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">Total Price</span>
            <p className="text-2xl font-black text-slate-900">₹{food.price * quantity}</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Quantity Controller */}
            <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-orange-500 hover:text-white transition"
                aria-label="Decrease"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 text-base font-bold text-slate-800">{quantity}</span>
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center hover:bg-orange-700 transition"
                aria-label="Increase"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAdd}
              disabled={!food.available}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold shadow-lg transition duration-200 ${
                food.available
                  ? 'bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white shadow-orange-500/30'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>{food.available ? 'Add to Cart' : 'Out of Stock'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetailsModal;
