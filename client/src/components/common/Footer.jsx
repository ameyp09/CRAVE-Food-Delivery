import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Heart, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-xl shadow-lg shadow-orange-500/20">
                🔥
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                CRAVE
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Satisfying your deepest culinary cravings with chef-crafted gourmet meals delivered steaming hot to your doorstep in 30 minutes.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Quick Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-orange-400 transition">Home</Link></li>
              <li><Link to="/menu" className="hover:text-orange-400 transition">Explore Full Menu</Link></li>
              <li><Link to="/my-orders" className="hover:text-orange-400 transition">Live Order Tracker</Link></li>
              <li><Link to="/cart" className="hover:text-orange-400 transition">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Col 3: Popular Cuisines */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Popular Cuisines</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/menu?category=Pizza" className="hover:text-orange-400 transition">Woodfired Pizzas</Link></li>
              <li><Link to="/menu?category=Burgers" className="hover:text-orange-400 transition">Smash Burgers</Link></li>
              <li><Link to="/menu?category=Biryani" className="hover:text-orange-400 transition">Hyderabadi Biryani</Link></li>
              <li><Link to="/menu?category=Asian" className="hover:text-orange-400 transition">Asian & Dim Sum</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact & Assurance */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Support & Kitchen</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <span>100 Foodie Boulevard, San Francisco</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <span>+1 (800) CRAVE-HOT</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <span>support@cravefood.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CRAVE Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for food lovers everywhere.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
