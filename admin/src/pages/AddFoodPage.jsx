import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Upload, 
  Image as ImageIcon, 
  ArrowLeft, 
  CheckCircle2, 
  X,
  Sparkles 
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AddFoodPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    prepTime: '20-30 mins',
    isVeg: true,
    available: true,
    description: '',
    imageUrlFallback: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data?.success && res.data.categories.length > 0) {
          setCategories(res.data.categories);
          setFormData((prev) => ({ ...prev, category: res.data.categories[0].name }));
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCats();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category || !formData.description) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (!imageFile && !formData.imageUrlFallback.trim()) {
      toast.error('Please upload an image file or provide an image URL.');
      return;
    }

    try {
      setIsSubmitting(true);
      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('category', formData.category.trim());
      data.append('price', formData.price);
      data.append('prepTime', formData.prepTime);
      data.append('isVeg', formData.isVeg);
      data.append('available', formData.available);
      data.append('description', formData.description.trim());

      if (imageFile) {
        data.append('image', imageFile);
      } else {
        data.append('image', formData.imageUrlFallback.trim());
      }

      const res = await api.post('/food', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data?.success) {
        toast.success(`Dish "${formData.name}" added to inventory successfully! 🍽️`);
        navigate('/inventory');
      }
    } catch (err) {
      console.error('Error adding food:', err);
      toast.error(err.response?.data?.message || 'Failed to add dish to inventory');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/inventory')}
          className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Add New Food Dish 🍲</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Create and publish a brand new mouthwatering recipe to the customer menu
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
        
        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-300 uppercase mb-1.5">
              Dish Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Signature Truffle Mac & Cheese"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition text-sm"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 uppercase mb-1.5">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-orange-500 transition text-sm cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c._id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-300 uppercase mb-1.5">
              Price (₹) *
            </label>
            <input
              type="number"
              required
              min={0}
              placeholder="e.g. 299"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition text-sm"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 uppercase mb-1.5">
              Dietary Preference
            </label>
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isVeg: true })}
                className={`flex-1 py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                  formData.isVeg ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-300" />
                Pure Veg
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isVeg: false })}
                className={`flex-1 py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                  !formData.isVeg ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-300" />
                Non-Veg
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 uppercase mb-1.5">
              Preparation Time
            </label>
            <input
              type="text"
              placeholder="e.g. 20-30 mins"
              value={formData.prepTime}
              onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-300 uppercase mb-1.5">
              Appetizing Recipe Description *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Describe the flavors, texture, artisanal ingredients, and cooking technique..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition text-sm"
            />
          </div>
        </div>

        {/* Image Upload & Preview Section */}
        <div className="border-t border-slate-700/80 pt-6 space-y-4">
          <label className="block text-xs font-bold text-slate-300 uppercase">
            Dish Image (Upload file or provide URL) *
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
            
            {/* File Drag/Drop or Select */}
            <div className="p-6 rounded-2xl border-2 border-dashed border-slate-700 hover:border-orange-500 transition bg-slate-900/60 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Click to upload image file</p>
                <p className="text-[11px] text-slate-500">Supports PNG, JPG, WEBP (Max 5MB)</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-600 file:text-white hover:file:bg-orange-700 cursor-pointer"
              />
            </div>

            {/* Preview Box */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 h-44 flex flex-col items-center justify-center relative overflow-hidden">
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : formData.imageUrlFallback ? (
                <img
                  src={formData.imageUrlFallback}
                  alt="URL Preview"
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="text-center text-slate-500 space-y-1">
                  <ImageIcon className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-xs">No image selected yet</p>
                </div>
              )}
            </div>

          </div>

          {/* Fallback image URL input */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              Or Paste an Image URL
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={formData.imageUrlFallback}
              onChange={(e) => setFormData({ ...formData, imageUrlFallback: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-700/80 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/inventory')}
            className="px-5 py-3 rounded-xl border border-slate-700 text-slate-300 font-bold text-xs hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-orange-600/25 flex items-center gap-2 transition active:scale-95 disabled:opacity-75"
          >
            <Plus className="w-4 h-4" />
            <span>{isSubmitting ? 'Uploading & Creating...' : 'Publish Food Dish'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};

export default AddFoodPage;
