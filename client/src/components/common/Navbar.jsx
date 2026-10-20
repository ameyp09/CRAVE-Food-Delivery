import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  User, 
  Menu as MenuIcon, 
  X, 
  Search, 
  Compass, 
  Clock, 
  LogOut, 
  Shield, 
  ChevronDown 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout, openAuthModal } = useAuth();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-orange-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform duration-300">
              <span className="text-2xl">🔥</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent">
                CRAVE
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-orange-950/60 -mt-1">
                Food Delivery
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-semibold transition-colors duration-200 ${
                isActive('/') ? 'text-orange-600 font-bold' : 'text-slate-600 hover:text-orange-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/menu"
              className={`flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200 ${
                isActive('/menu') ? 'text-orange-600 font-bold' : 'text-slate-600 hover:text-orange-600'
              }`}
            >
              <Compass className="w-4 h-4" />
              Explore Menu
            </Link>
            {isAuthenticated && (
              <Link
                to="/my-orders"
                className={`flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200 ${
                  isActive('/my-orders') ? 'text-orange-600 font-bold' : 'text-slate-600 hover:text-orange-600'
                }`}
              >
                <Clock className="w-4 h-4" />
                My Orders
              </Link>
            )}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Quick Menu Search Shortcut */}
            <button
              onClick={() => navigate('/menu')}
              aria-label="Search Menu"
              className="p-2.5 rounded-full text-slate-600 hover:text-orange-600 hover:bg-orange-50 transition"
              title="Search food"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-orange-50 text-orange-600 hover:bg-orange-100 transition duration-200 shadow-sm"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 text-white text-xs font-bold flex items-center justify-center shadow-md animate-bounce">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* User Profile or Sign In */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-full border border-slate-200 hover:border-orange-200 hover:bg-orange-50/50 transition bg-white shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline-block text-sm font-medium text-slate-700 max-w-[100px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400 uppercase font-semibold">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/my-orders"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition"
                    >
                      <Clock className="w-4 h-4 text-orange-500" />
                      Order History & Tracker
                    </Link>

                    {isAdmin && (
                      <a
                        href="http://localhost:5174"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-amber-700 bg-amber-50/70 hover:bg-amber-100/70 transition font-medium"
                      >
                        <Shield className="w-4 h-4 text-amber-600" />
                        Admin Dashboard ↗
                      </a>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-orange-600 transition"
                >
                  Log In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 transition duration-200"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-orange-600 hover:bg-orange-50 transition"
              aria-label="Open Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-orange-100 px-4 pt-2 pb-6 space-y-3 shadow-xl">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-xl text-base font-semibold ${
              isActive('/') ? 'bg-orange-50 text-orange-600' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Home
          </Link>
          <Link
            to="/menu"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-xl text-base font-semibold ${
              isActive('/menu') ? 'bg-orange-50 text-orange-600' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Explore Menu
          </Link>
          {isAuthenticated && (
            <Link
              to="/my-orders"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-xl text-base font-semibold ${
                isActive('/my-orders') ? 'bg-orange-50 text-orange-600' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              My Orders & Live Tracker
            </Link>
          )}

          {isAdmin && (
            <a
              href="http://localhost:5174"
              target="_blank"
              rel="noreferrer"
              className="block px-3 py-2.5 rounded-xl text-base font-semibold text-amber-700 bg-amber-50"
            >
              Open Admin Dashboard ↗
            </a>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
