import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';
import api, { getImageUrl } from '../services/api';
import FoodCard from '../components/common/FoodCard';
import FoodDetailsModal from '../components/common/FoodDetailsModal';
import SkeletonCard from '../components/common/SkeletonCard';

const HomePage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFood, setSelectedFood] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [vegFilter, setVegFilter] = useState('all'); // 'all', 'veg', 'nonveg'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, foodRes] = await Promise.all([
          api.get('/categories'),
          api.get('/food')
        ]);

        if (catRes.data?.success) {
          setCategories(catRes.data.categories);
        }
        if (foodRes.data?.success) {
          setFoods(foodRes.data.foods);
        }
      } catch (err) {
        console.error('Home data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/menu');
    }
  };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  // Filter foods for the popular grid
  const filteredFoods = foods.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesVeg =
      vegFilter === 'all' ||
      (vegFilter === 'veg' && item.isVeg) ||
      (vegFilter === 'nonveg' && !item.isVeg);

    return matchesCategory && matchesVeg;
  });

  // Chef specials (top rated)
  const chefSpecials = [...foods]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Food Details Modal */}
      {selectedFood && (
        <FoodDetailsModal
          food={selectedFood}
          onClose={() => setSelectedFood(null)}
        />
      )}

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-16 sm:py-24">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs sm:text-sm font-bold tracking-wide animate-pulse">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>HOT & FRESH FOOD IN 30 MINUTES</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
                Satisfy Your <br />
                <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                  Deepest Cravings
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Handcrafted gourmet pizzas, sizzling smash burgers, aromatic royal biryanis, and artisanal desserts cooked live and delivered lightning fast.
              </p>

              {/* Delivery Search Bar */}
              <form
                onSubmit={handleSearchSubmit}
                className="max-w-xl mx-auto lg:mx-0 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl flex items-center gap-2"
              >
                <div className="flex-1 flex items-center pl-3 gap-2">
                  <Search className="w-5 h-5 text-orange-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search dishes (e.g., Truffle Burger, Dum Biryani)..."
                    className="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 font-bold text-sm text-white shadow-lg shadow-orange-500/30 flex items-center gap-1.5 transition active:scale-95 flex-shrink-0"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Value Props Row */}
              <div className="pt-4 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 border-t border-slate-800/80">
                <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                  <Clock className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <span>30 Min Express</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Hygiene Verified</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                  <Truck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Live Tracking</span>
                </div>
              </div>

            </div>

            {/* Right Hero Graphic Showcase */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-72 h-72 sm:w-96 sm:h-96">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-orange-500/30 animate-spin-slow" />
                <img
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"
                  alt="Delicious Crave Burger"
                  className="w-full h-full object-cover rounded-full shadow-2xl ring-8 ring-white/10"
                />

                {/* Floating Micro Badge 1 */}
                <div className="absolute -top-4 -left-4 bg-white/95 backdrop-blur-md text-slate-900 p-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-bounce">
                  <span className="text-xl">⭐</span>
                  <div>
                    <p className="text-xs font-black">4.9 / 5.0</p>
                    <p className="text-[10px] text-slate-500 font-medium">10,000+ Happy Foodies</p>
                  </div>
                </div>

                {/* Floating Micro Badge 2 */}
                <div className="absolute -bottom-4 -right-4 bg-orange-600 text-white p-3 rounded-2xl shadow-xl flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <div>
                    <p className="text-xs font-black">Free Delivery</p>
                    <p className="text-[10px] text-orange-200">On all orders above ₹500</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CATEGORY SELECTOR CAROUSEL */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600">
                Explore Cuisines
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                What are you craving today?
              </h2>
            </div>

            <button
              onClick={() => navigate('/menu')}
              className="hidden sm:flex items-center gap-1 text-sm font-bold text-orange-600 hover:text-orange-700 transition"
            >
              <span>View All Menu</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Categories Grid / Carousel */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 sm:gap-4">
            {/* 'All' Category Button */}
            <button
              onClick={() => handleCategoryClick('All')}
              className={`flex flex-col items-center p-3 rounded-2xl border transition-all duration-200 ${
                selectedCategory === 'All'
                  ? 'border-orange-500 bg-orange-50/70 shadow-md scale-105'
                  : 'border-slate-100 hover:border-orange-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-2xl shadow-md">
                🍽️
              </div>
              <span className={`text-xs font-bold mt-2 truncate ${
                selectedCategory === 'All' ? 'text-orange-700 font-extrabold' : 'text-slate-700'
              }`}>
                All Dishes
              </span>
            </button>

            {/* Dynamic Categories */}
            {categories.map((cat) => {
              const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat._id}
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`flex flex-col items-center p-3 rounded-2xl border transition-all duration-200 ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50/70 shadow-md scale-105'
                      : 'border-slate-100 hover:border-orange-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <img
                    src={getImageUrl(cat.image)}
                    alt={cat.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover shadow-sm bg-slate-100"
                  />
                  <span className={`text-xs font-bold mt-2 truncate ${
                    isSelected ? 'text-orange-700 font-extrabold' : 'text-slate-700'
                  }`}>
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. POPULAR DISHES WITH FILTER TOGGLE */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600">
              Hand-Picked
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Popular Dishes in {selectedCategory === 'All' ? 'Our Kitchen' : selectedCategory}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Freshly prepared with authentic ingredients and delivered hot.
            </p>
          </div>

          {/* Veg / Non-Veg Toggle Pills */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl self-start sm:self-auto">
            <button
              onClick={() => setVegFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                vegFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setVegFilter('veg')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                vegFilter === 'veg'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-emerald-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Veg Only
            </button>
            <button
              onClick={() => setVegFilter('nonveg')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                vegFilter === 'nonveg'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-rose-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              Non-Veg
            </button>
          </div>
        </div>

        {/* Food Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8">
            <p className="text-3xl mb-2">🍽️</p>
            <h3 className="text-lg font-bold text-slate-800">No dishes match your selection</h3>
            <p className="text-sm text-slate-400 mt-1">
              Try switching your filter to "All" or explore other categories.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setVegFilter('all');
              }}
              className="mt-4 px-5 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredFoods.map((food) => (
              <FoodCard
                key={food._id}
                food={food}
                onSelect={(f) => setSelectedFood(f)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. CHEF'S SPECIALS SHOWCASE */}
      <section className="py-16 bg-gradient-to-b from-orange-50/50 to-white border-t border-orange-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-orange-600" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600">
              Chef's Masterpieces
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-8">
            Highest-Rated Gourmet Selections
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {chefSpecials.map((food) => (
              <FoodCard
                key={food._id}
                food={food}
                onSelect={(f) => setSelectedFood(f)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY CRAVE SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600">
            Uncompromising Quality
          </span>
          <h2 className="text-3xl font-black text-slate-900 mt-2">
            Why Food Lovers Choose CRAVE
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            We don't just deliver food; we deliver unforgettable gourmet experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl mb-6">
              🚀
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">30-Minute Express Delivery</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Equipped with insulated thermal bags to ensure your pizza crust stays crisp, burgers remain juicy, and biryani arrives steaming hot.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mb-6">
              ✨
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">100% Certified Clean Kitchens</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Strict 4-tier hygiene protocols with temperature logs, contactless packaging, and premium ingredients with zero synthetic additives.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl mb-6">
              📍
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Real-Time Live Tracker</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Track your culinary journey seamlessly from stove to doorstep with our interactive order progress timeline.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
