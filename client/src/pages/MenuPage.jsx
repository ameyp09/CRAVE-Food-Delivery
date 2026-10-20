import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import api from '../services/api';
import FoodCard from '../components/common/FoodCard';
import FoodDetailsModal from '../components/common/FoodDetailsModal';
import SkeletonCard from '../components/common/SkeletonCard';

const MenuPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [vegFilter, setVegFilter] = useState('all'); // 'all', 'veg', 'nonveg'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'price_asc', 'price_desc', 'rating_desc'
  const [selectedFood, setSelectedFood] = useState(null);

  // Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data?.success) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch foods whenever filters change
  useEffect(() => {
    const fetchFilteredFoods = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory && selectedCategory !== 'All') {
          params.category = selectedCategory;
        }
        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }
        if (vegFilter === 'veg') {
          params.isVeg = 'true';
        } else if (vegFilter === 'nonveg') {
          params.isVeg = 'false';
        }
        if (sortBy) {
          params.sort = sortBy;
        }

        const res = await api.get('/food', { params });
        if (res.data?.success) {
          setFoods(res.data.foods);
        }
      } catch (err) {
        console.error('Error fetching foods:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredFoods();
  }, [selectedCategory, searchQuery, vegFilter, sortBy]);

  const handleCategorySelect = (catName) => {
    setSelectedCategory(catName);
    const newParams = new URLSearchParams(searchParams);
    if (catName === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', catName);
    }
    setSearchParams(newParams);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      {/* Food Details Modal */}
      {selectedFood && (
        <FoodDetailsModal
          food={selectedFood}
          onClose={() => setSelectedFood(null)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            Explore Full Menu 🍔
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse through our wide variety of chef-crafted cuisines, customize your order, and dig in.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
          
          {/* Top Controls: Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by food name, ingredient, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort & Dietary Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Veg Toggle */}
              <div className="flex items-center bg-slate-100 p-1 rounded-2xl">
                <button
                  onClick={() => setVegFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    vegFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setVegFilter('veg')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    vegFilter === 'veg'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-emerald-700'
                  }`}
                >
                  Veg
                </button>
                <button
                  onClick={() => setVegFilter('nonveg')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    vegFilter === 'nonveg'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-rose-700'
                  }`}
                >
                  Non-Veg
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-3 pr-8 py-2.5 bg-slate-100 hover:bg-slate-200/70 border-none rounded-2xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer transition appearance-none"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating_desc">Highest Rated</option>
                </select>
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => handleCategorySelect('All')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === 'All'
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              All Cuisines
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategorySelect(cat.name)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory.toLowerCase() === cat.name.toLowerCase()
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-orange-50 hover:text-orange-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

        </div>

        {/* Results Counter & Active Filters Display */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>
            Showing <strong className="text-slate-900">{foods.length}</strong> delicious dishes
          </span>

          {(selectedCategory !== 'All' || vegFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setVegFilter('all');
                setSearchQuery('');
                setSearchParams({});
              }}
              className="text-orange-600 hover:underline font-bold"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Food Items Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        ) : foods.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8 space-y-3">
            <span className="text-4xl">🔍</span>
            <h3 className="text-xl font-bold text-slate-800">No dishes found</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              We couldn't find any food items matching your current filters. Try searching for something else or clearing the filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setVegFilter('all');
                setSearchQuery('');
                setSearchParams({});
              }}
              className="px-6 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {foods.map((food) => (
              <FoodCard
                key={food._id}
                food={food}
                onSelect={(f) => setSelectedFood(f)}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default MenuPage;
