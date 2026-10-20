import React from 'react';
import { Star, Clock, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../services/api';

const FoodCard = ({ food, onSelect }) => {
  const { getItemQuantity, addToCart, updateQuantity } = useCart();
  const quantityInCart = getItemQuantity(food._id || food.id);

  const handleIncrement = (e) => {
    e.stopPropagation();
    addToCart(food, 1);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    updateQuantity(food._id || food.id, quantityInCart - 1);
  };

  return (
    <div
      onClick={() => onSelect && onSelect(food)}
      className="group relative bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-orange-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Food Image Container */}
        <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-slate-100">
          <img
            src={getImageUrl(food.image)}
            alt={food.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Veg / Non-Veg Indicator Badge */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg shadow flex items-center gap-1.5 text-xs font-semibold">
            <span
              className={`w-3.5 h-3.5 border-2 rounded-sm flex items-center justify-center ${
                food.isVeg ? 'border-emerald-600' : 'border-rose-600'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  food.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                }`}
              />
            </span>
            <span className={food.isVeg ? 'text-emerald-700' : 'text-rose-700'}>
              {food.isVeg ? 'Veg' : 'Non-Veg'}
            </span>
          </div>

          {/* Rating Badge */}
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow flex items-center gap-1 text-xs font-bold text-slate-800">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{food.rating ? food.rating.toFixed(1) : '4.5'}</span>
          </div>

          {/* Prep Time Tag */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white/90 text-xs font-medium bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md">
            <Clock className="w-3.5 h-3.5 text-orange-400" />
            <span>{food.prepTime || '20-30 mins'}</span>
          </div>

          {/* Category Tag */}
          <div className="absolute bottom-3 right-3 text-white/90 text-xs font-medium bg-orange-600/80 backdrop-blur-sm px-2.5 py-1 rounded-md">
            {food.category}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5">
          <h3 className="font-bold text-lg text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-1">
            {food.name}
          </h3>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {food.description}
          </p>
        </div>
      </div>

      {/* Card Footer: Price & Add To Cart Button */}
      <div className="p-5 pt-0 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Price</span>
          <p className="text-xl font-extrabold text-slate-900">₹{food.price}</p>
        </div>

        {/* Dynamic Add / Counter Button */}
        {quantityInCart === 0 ? (
          <button
            onClick={handleIncrement}
            disabled={!food.available}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-bold shadow-md transition-all duration-200 ${
              food.available
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/25 active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{food.available ? 'Add' : 'Out of Stock'}</span>
          </button>
        ) : (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center bg-orange-50 border border-orange-200 rounded-2xl p-1 shadow-sm"
          >
            <button
              onClick={handleDecrement}
              className="w-8 h-8 rounded-xl bg-white text-orange-600 flex items-center justify-center hover:bg-orange-600 hover:text-white transition shadow-sm"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
            <span className="px-3 text-sm font-bold text-orange-950">
              {quantityInCart}
            </span>
            <button
              onClick={handleIncrement}
              className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center hover:bg-orange-700 transition shadow-sm"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodCard;
