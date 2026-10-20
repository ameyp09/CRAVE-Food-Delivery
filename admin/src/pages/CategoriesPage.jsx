import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  FolderKanban, 
  Trash2, 
  RefreshCw, 
  Upload, 
  X, 
  CheckCircle2, 
  Image as ImageIcon 
} from 'lucide-react';
import api, { getImageUrl } from '../services/api';
import toast from 'react-hot-toast';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New category form
  const [categoryName, setCategoryName] = useState('');
  const [categoryImageUrl, setCategoryImageUrl] = useState('');
  const [categoryFile, setCategoryFile] = useState(null);
  const [categoryPreview, setCategoryPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories?includeInactive=true');
      if (res.data?.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error('Fetch categories error:', err);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryFile(file);
      setCategoryPreview(URL.createObjectURL(file));
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    if (!categoryFile && !categoryImageUrl.trim()) {
      toast.error('Please upload an image or provide an image URL');
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('name', categoryName.trim());
      formData.append('isActive', true);

      if (categoryFile) {
        formData.append('image', categoryFile);
      } else {
        formData.append('image', categoryImageUrl.trim());
      }

      const res = await api.post('/categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.success) {
        toast.success(`Category "${categoryName}" added successfully!`);
        setIsAddModalOpen(false);
        setCategoryName('');
        setCategoryImageUrl('');
        setCategoryFile(null);
        setCategoryPreview(null);
        fetchCategories();
      }
    } catch (err) {
      console.error('Add category error:', err);
      toast.error(err.response?.data?.message || 'Failed to add category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      return;
    }

    try {
      const res = await api.delete(`/categories/${id}`);
      if (res.data?.success) {
        toast.success(`Category "${name}" deleted`);
        setCategories((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      toast.error('Failed to delete category');
    }
  };

  const handleToggleActive = async (cat) => {
    try {
      const res = await api.put(`/categories/${cat._id}`, {
        isActive: !cat.isActive
      });
      if (res.data?.success) {
        setCategories((prev) =>
          prev.map((c) => (c._id === cat._id ? { ...c, isActive: !cat.isActive } : c))
        );
        toast.success(`Category "${cat.name}" is now ${!cat.isActive ? 'Active' : 'Inactive'}`);
      }
    } catch (err) {
      toast.error('Failed to update category status');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Categories Manager 📂</h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize customer navigation and dish categorization across the platform
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-orange-600/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-500">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-orange-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700/60 shadow-lg flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={getImageUrl(cat.image)}
                  alt={cat.name}
                  className="w-16 h-16 rounded-2xl object-cover bg-slate-700 flex-shrink-0 shadow-md"
                />
                <div>
                  <h3 className="font-bold text-white text-base">{cat.name}</h3>
                  <button
                    onClick={() => handleToggleActive(cat)}
                    className={`mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition ${
                      cat.isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-700 text-slate-400 border-slate-600'
                    }`}
                  >
                    {cat.isActive ? 'Active on Menu' : 'Hidden'}
                  </button>
                </div>
              </div>

              <button
                onClick={() => handleDeleteCategory(cat._id, cat.name)}
                className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                title="Delete Category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ADD CATEGORY MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Create New Category</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mexican, Salads, Pasta"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">
                  Upload Category Image File
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-600 file:text-white hover:file:bg-orange-700 cursor-pointer"
                />
                {categoryPreview && (
                  <img
                    src={categoryPreview}
                    alt="Preview"
                    className="w-16 h-16 rounded-xl object-cover mt-2 border border-slate-700"
                  />
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">
                  Or Paste Category Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={categoryImageUrl}
                  onChange={(e) => setCategoryImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold"
                >
                  {isSubmitting ? 'Creating...' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CategoriesPage;
