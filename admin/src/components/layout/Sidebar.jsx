import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  PlusCircle, 
  ShoppingBag, 
  FolderKanban, 
  Users, 
  ExternalLink, 
  LogOut, 
  ShieldCheck 
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/orders', label: 'Orders Manager', icon: ShoppingBag },
  { to: '/inventory', label: 'Food Inventory', icon: UtensilsCrossed },
  { to: '/add-food', label: 'Add New Food', icon: PlusCircle },
  { to: '/categories', label: 'Categories', icon: FolderKanban },
  { to: '/customers', label: 'Customers', icon: Users },
];

const Sidebar = () => {
  const { adminUser, adminLogout } = useAdminAuth();

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 flex-shrink-0">
      
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-xl shadow-lg shadow-orange-500/20">
              🔥
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white">CRAVE</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  OPS
                </span>
              </div>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Admin Management
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer / User Profile & Customer Link */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        
        {/* Customer App Shortcut */}
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition group"
        >
          <span className="flex items-center gap-2">
            <span>🍔 View Customer Web App</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-orange-400 transition" />
        </a>

        {/* User Card */}
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 truncate pr-2">
            <div className="w-8 h-8 rounded-xl bg-orange-600/20 border border-orange-500/30 text-orange-400 flex items-center justify-center font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{adminUser?.name || 'Administrator'}</p>
              <p className="text-[10px] text-slate-400 truncate">{adminUser?.email}</p>
            </div>
          </div>

          <button
            onClick={() => adminLogout()}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>

    </aside>
  );
};

export default Sidebar;
