import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  Check, 
  X, 
  UtensilsCrossed, 
  AlertTriangle 
} from 'lucide-react';
import api, { getImageUrl } from '../services/api';
import toast from 'react-hot-toast';

const FoodInventoryPage = () => {
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [categories, setCategories] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit Modal State
  const [editingFood, setEditingFood] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    price: '',
    category: '',
    prepTime: '',
    isVeg: true,
    description: '',
    image: ''
  });
  const [editFile, setEditFile] = useState(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const params = {};
      if (categoryFilter !== 'All') params.category = categoryFilter;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const [foodRes, catRes] = await Promise.all([
        api.get('/food', { params: { ...params, available: undefined } }),
        api.get('/categories')
      ]);

      if (foodRes.data?.success) setFoods(foodRes.data.foods);
      if (catRes.data?.success) setCategories(catRes.data.categories);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      toast.error('Failed to load food inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFoods();
  };

  const handleToggleAvailability = async (food) => {
    const newStatus = !food.available;
    try {
      const res = await api.put(`/food/${food._id}`, { available: newStatus });
      if (res.data?.success) {
        setFoods((prev) =>
          prev.map((f) => (f._id === food._id ? { ...f, available: newStatus } : f))
        );
        toast.success(
          `"${food.name}" is now ${newStatus ? 'In Stock (Available)' : 'Out of Stock'}`
        );
      }
    } catch (err) {
      toast.error('Failed to update availability status');
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      setIsDeleting(true);
      const res = await api.delete(`/food/${deletingId}`);
      if (res.data?.success) {
        setFoods((prev) => prev.filter((f) => f._id !== deletingId));
        toast.success('Food item deleted successfully');
      }
    } catch (err) {
      toast.error('Failed to delete food item');
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  const openEditModal = (food) => {
    setEditingFood(food);
    setEditFormData({
      name: food.name,
      price: food.price,
      category: food.category,
      prepTime: food.prepTime || '25-35 mins',
      isVeg: food.isVeg,
      description: food.description,
      image: food.image
    });
    setEditFile(null);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingFood) return;

    try {
      setIsSavingEdit(true);
      const formData = new FormData();
      formData.append('name', editFormData.name);
      formData.append('price', editFormData.price);
      formData.append('category', editFormData.category);
      formData.append('prepTime', editFormData.prepTime);
      formData.append('isVeg', editFormData.isVeg);
      formData.append('description', editFormData.description);

      if (editFile) {
        formData.append('image', editFile);
      } else {
        formData.append('image', editFormData.image);
      }

      const res = await api.put(`/food/${editingFood._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.success) {
        toast.success('Food item updated successfully!');
        setFoods((prev) =>
          prev.map((f) => (f._id === editingFood._id ? res.data.food : f))
        );
        setEditingFood(null);
      }
    } catch (err) {
      console.error('Update food error:', err);
      toast.error('Failed to save changes');
    } finally {
      setIsSavingEdit(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Food Inventory 🍴</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your kitchen dishes, in-stock availability, pricing, and recipes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchFoods}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/add-food"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-orange-600/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Dish</span>
          </Link>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by dish name or ingredient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </form>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setCategoryFilter('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              categoryFilter === 'All'
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              onClick={() => setCategoryFilter(c.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                categoryFilter === c.name
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-3xl bg-slate-800/80 border border-slate-700/60 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-700/80 bg-slate-900/60 text-slate-400 uppercase font-bold tracking-wider">
                <th className="py-4 px-4">Dish</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Price</th>
                <th className="py-4 px-4">Diet</th>
                <th className="py-4 px-4">In-Stock Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-orange-500" />
                    <span>Loading inventory items...</span>
                  </td>
                </tr>
              ) : foods.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No dishes found. Click "Add New Dish" to create one.
                  </td>
                </tr>
              ) : (
                foods.map((food) => (
                  <tr key={food._id} className="hover:bg-slate-700/30 transition">
                    {/* Thumbnail & Title */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={getImageUrl(food.image)}
                          alt={food.name}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-700 flex-shrink-0"
                        />
                        <div className="max-w-[200px]">
                          <span className="font-bold text-white block truncate">
                            {food.name}
                          </span>
                          <span className="text-[11px] text-slate-400 block truncate">
                            {food.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 font-semibold text-slate-300">
                      {food.category}
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-extrabold text-orange-400 text-sm">
                      ₹{food.price}
                    </td>

                    {/* Veg Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        food.isVeg
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}>
                        {food.isVeg ? 'Veg' : 'Non-Veg'}
                      </span>
                    </td>

                    {/* In-Stock Toggle Switch */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleAvailability(food)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs ${
                          food.available
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${food.available ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        <span>{food.available ? 'In Stock' : 'Out of Stock'}</span>
                      </button>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(food)}
                          className="p-2 rounded-lg bg-slate-700/60 hover:bg-slate-600 text-slate-300 hover:text-white transition"
                          title="Edit Food Item"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingId(food._id)}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                          title="Delete Food Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT FOOD MODAL */}
      {editingFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Edit Dish: {editingFood.name}</h3>
              <button
                onClick={() => setEditingFood(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="overflow-y-auto space-y-4 flex-1 pr-1 text-xs">
              <div>
                <label className="block font-bold text-slate-400 uppercase mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 uppercase mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-400 uppercase mb-1">Category *</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-orange-500"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 uppercase mb-1">Dietary Type</label>
                  <select
                    value={editFormData.isVeg ? 'true' : 'false'}
                    onChange={(e) => setEditFormData({ ...editFormData, isVeg: e.target.value === 'true' })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="true">Pure Vegetarian</option>
                    <option value="false">Non-Vegetarian</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-400 uppercase mb-1">Prep Time</label>
                  <input
                    type="text"
                    value={editFormData.prepTime}
                    onChange={(e) => setEditFormData({ ...editFormData, prepTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-400 uppercase mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 uppercase mb-1">Update Image File (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditFile(e.target.files[0])}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingFood(null)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold"
                >
                  {isSavingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="max-w-sm w-full bg-slate-900 border border-slate-700 rounded-3xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Delete Food Item?</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to remove this dish permanently from the inventory? This cannot be undone.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="py-2.5 rounded-xl border border-slate-700 text-slate-300 font-bold text-xs hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition"
              >
                {isDeleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FoodInventoryPage;
