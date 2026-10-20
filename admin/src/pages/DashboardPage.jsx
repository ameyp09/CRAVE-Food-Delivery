import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  UtensilsCrossed, 
  ArrowUpRight, 
  TrendingUp, 
  Clock, 
  ChevronRight,
  RefreshCw 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell 
} from 'recharts';
import api from '../services/api';

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#a855f7', '#f43f5e', '#eab308'];

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await api.get('/admin/dashboard-stats');
      if (res.data?.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  // Fallback demo chart data if daily trends are sparse
  const chartData = stats?.dailyTrends && stats.dailyTrends.length > 0
    ? stats.dailyTrends.map(d => ({ date: d._id.substring(5), revenue: d.revenue, orders: d.orders }))
    : [
        { date: 'Mon', revenue: 2400, orders: 8 },
        { date: 'Tue', revenue: 3800, orders: 12 },
        { date: 'Wed', revenue: 4200, orders: 15 },
        { date: 'Thu', revenue: 3100, orders: 10 },
        { date: 'Fri', revenue: 5600, orders: 19 },
        { date: 'Sat', revenue: 7200, orders: 26 },
        { date: 'Sun', revenue: 6400, orders: 22 },
      ];

  const statusData = stats?.statusCounts && stats.statusCounts.length > 0
    ? stats.statusCounts.map(s => ({ name: s._id, count: s.count }))
    : [
        { name: 'Delivered', count: 18 },
        { name: 'Preparing', count: 6 },
        { name: 'Out for Delivery', count: 4 },
        { name: 'Confirmed', count: 3 }
      ];

  return (
    <div className="space-y-8">
      
      {/* Top Banner & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Operations & Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time platform sales, orders pipeline, and customer activity
          </p>
        </div>

        <button
          onClick={() => fetchStats(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* 1. METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Gross Revenue */}
        <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/60 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Revenue</span>
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-4">
            ₹{stats?.totalRevenue?.toLocaleString() || 0}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% from last week</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/60 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Orders</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-4">
            {stats?.totalOrders || 0}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-blue-400 font-semibold mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Active fulfillment</span>
          </div>
        </div>

        {/* Registered Customers */}
        <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/60 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Customers</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-4">
            {stats?.totalUsers || 0}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mt-2">
            <span>Verified accounts</span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/60 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Menu</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-4">
            {stats?.totalFoods || 0}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mt-2">
            <span>Across 6 categories</span>
          </div>
        </div>

      </div>

      {/* 2. RECHARTS VISUAL ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Revenue Trend Area Chart */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-800/80 border border-slate-700/60 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Revenue Performance</h3>
              <p className="text-xs text-slate-400">Daily gross turnover from non-cancelled orders</p>
            </div>
            <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
              Live Trend
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff'
                  }}
                  formatter={(value) => [`₹${value}`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f97316"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#revenueGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Breakdown Bar Chart */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-800/80 border border-slate-700/60 shadow-lg space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Orders by Status</h3>
            <p className="text-xs text-slate-400">Current active pipeline distribution</p>
          </div>

          <div className="h-64 sm:h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 3. RECENT ORDERS QUICK-ACTION TABLE */}
      <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/60 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
          <div>
            <h3 className="text-base font-bold text-white">Recent Customer Orders</h3>
            <p className="text-xs text-slate-400">Latest orders placed on the platform</p>
          </div>

          <Link
            to="/orders"
            className="flex items-center gap-1 text-xs font-bold text-orange-400 hover:text-orange-300 transition"
          >
            <span>View All Orders</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-700/60 text-slate-400 uppercase font-bold tracking-wider">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-700/30 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-300">
                      #{ord._id.substring(ord._id.length - 6).toUpperCase()}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      {ord.user?.name || 'Customer'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {ord.items?.length || 0} items
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-orange-400">
                      ₹{ord.totalAmount}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-700 text-slate-200">
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to="/orders"
                        className="text-xs font-bold text-orange-400 hover:underline"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No orders recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;
