import React, { useState } from 'react';
import { useCanteen } from '../context/CanteenContext';
import { FoodCard } from '../components/FoodCard';
import { FoodItem } from '../types';
import {
  Search,
  Sparkles,
  Clock,
  ShieldCheck,
  Zap,
  TrendingUp,
  ArrowRight,
  Flame,
  Utensils,
  MapPin,
  CheckCircle,
  Coffee,
  ShoppingBag
} from 'lucide-react';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
  onOpenDetail: (item: FoodItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveTab, onOpenDetail }) => {
  const { menuItems, orders } = useCanteen();
  const [searchTerm, setSearchTerm] = useState('');

  const popularItems = menuItems.filter((i) => i.popular || i.rating >= 4.7).slice(0, 6);
  const activeOrdersCount = orders.filter(
    (o) => o.status === 'Placed' || o.status === 'Preparing' || o.status === 'Ready for Pickup'
  ).length;

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setActiveTab('menu');
    }
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-amber-950 via-amber-900 to-amber-950 text-white rounded-3xl overflow-hidden shadow-xl border border-amber-800/40">
        <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

        <div className="relative max-w-7xl mx-auto px-6 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold tracking-wide">
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Campus Fast Pickup System</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-white leading-tight">
              Pre-order Your Canteen Favorites <br />
              <span className="text-amber-400 underline decoration-amber-500/50">Skip the Queue.</span>
            </h1>

            <p className="text-sm sm:text-base text-amber-100/90 max-w-xl font-sans leading-relaxed">
              Order fresh Biryanis, Veg Rolls, South Indian Coffee, Maggi, and Snacks directly from your phone. Receive live status updates and pick up with your unique Token!
            </p>

            {/* Quick Search */}
            <form onSubmit={handleQuickSearch} className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-amber-500/30 max-w-md shadow-inner">
              <Search className="w-5 h-5 text-amber-300 ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Search Biryani, Roll, Coffee, Maggi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-white placeholder-amber-200/60 text-sm focus:outline-hidden py-2"
              />
              <button
                type="button"
                onClick={() => setActiveTab('menu')}
                className="bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors shrink-0 flex items-center gap-1 shadow-sm"
              >
                <span>Browse Menu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-amber-800/60 max-w-lg text-xs">
              <div>
                <span className="text-amber-300 block font-semibold">Average Prep Time</span>
                <span className="text-xl font-bold font-serif text-white">8 - 12 Mins</span>
              </div>
              <div>
                <span className="text-amber-300 block font-semibold">Active Kitchen Queue</span>
                <span className="text-xl font-bold font-serif text-amber-400">{activeOrdersCount} Orders</span>
              </div>
              <div>
                <span className="text-amber-300 block font-semibold">Food Hygiene Rating</span>
                <span className="text-xl font-bold font-serif text-white">4.9 / 5.0</span>
              </div>
            </div>
          </div>

          {/* Hero Illustration / Showcase */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-sm rounded-3xl overflow-hidden border-2 border-amber-500/30 shadow-2xl bg-amber-900/40 p-4 backdrop-blur-md space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-amber-800/60">
                <span className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400 fill-amber-400" /> Today's Top Seller
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40 font-bold">
                  Fresh Batch
                </span>
              </div>

              <div className="aspect-[4/3] rounded-2xl overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80"
                  alt="Chicken Biryani"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <div>
                    <p className="font-serif font-bold text-base">Special Chicken Biryani</p>
                    <p className="text-xs text-amber-300">Served with Raita & Salan</p>
                  </div>
                  <span className="font-serif font-black text-xl text-amber-400">₹150</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('menu')}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Order Now for Quick Pickup</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Shortcuts */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-bold text-gray-900">Explore Canteen Menu</h2>
            <p className="text-xs text-gray-500">Pick from our freshly prepared campus snacks & meals</p>
          </div>
          <button
            onClick={() => setActiveTab('menu')}
            className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1 group"
          >
            <span>View All Menu ({menuItems.length})</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { name: 'Biryani & Rice', icon: '🍚', color: 'bg-amber-50 text-amber-900 border-amber-200' },
            { name: 'Snacks & Rolls', icon: '🌯', color: 'bg-emerald-50 text-emerald-900 border-emerald-200' },
            { name: 'Beverages', icon: '☕', color: 'bg-blue-50 text-blue-900 border-blue-200' },
            { name: 'Quick Bites', icon: '🍜', color: 'bg-orange-50 text-orange-900 border-orange-200' },
            { name: 'Desserts', icon: '🍨', color: 'bg-pink-50 text-pink-900 border-pink-200' },
            { name: 'All Items', icon: '🍱', color: 'bg-purple-50 text-purple-900 border-purple-200' }
          ].map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveTab('menu')}
              className={`p-4 rounded-2xl border text-center transition-all hover:scale-105 hover:shadow-md flex flex-col items-center gap-2 ${cat.color}`}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-xs font-bold leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Popular Items Showcase Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-2">
              <Flame className="w-6 h-6 text-amber-600 fill-amber-500" />
              <span>Popular Student Choices</span>
            </h2>
            <p className="text-xs text-gray-500">Highest rated items prepared continuously at the counter</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularItems.map((item) => (
            <FoodCard key={item.id} item={item} onOpenDetail={onOpenDetail} />
          ))}
        </div>
      </section>

      {/* How It Works & Pickup Info */}
      <section className="bg-amber-50/80 rounded-3xl p-6 sm:p-8 border border-amber-200/60 space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
            Simple 3-Step Process
          </span>
          <h2 className="text-2xl font-serif font-bold text-amber-950 mt-2">
            How Food Zone Pre-ordering Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-xs space-y-2 text-center">
            <div className="w-10 h-10 bg-amber-500 text-amber-950 font-black rounded-xl flex items-center justify-center mx-auto text-lg shadow-xs">
              1
            </div>
            <h3 className="font-serif font-bold text-base text-gray-900">Select & Customize</h3>
            <p className="text-xs text-gray-600">
              Browse the menu, select quantity, add spice level or special instructions, and add to cart.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-xs space-y-2 text-center">
            <div className="w-10 h-10 bg-amber-500 text-amber-950 font-black rounded-xl flex items-center justify-center mx-auto text-lg shadow-xs">
              2
            </div>
            <h3 className="font-serif font-bold text-base text-gray-900">Demo Checkout & Token</h3>
            <p className="text-xs text-gray-600">
              Pay via simulated UPI, Card, or Campus Wallet. Receive a unique pickup Token (e.g. A42).
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-xs space-y-2 text-center">
            <div className="w-10 h-10 bg-amber-500 text-amber-950 font-black rounded-xl flex items-center justify-center mx-auto text-lg shadow-xs">
              3
            </div>
            <h3 className="font-serif font-bold text-base text-gray-900">Real-time Status & Pickup</h3>
            <p className="text-xs text-gray-600">
              Track live status (`Placed` ➔ `Preparing` ➔ `Ready`). Collect hot food at Counter Bay 1.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
