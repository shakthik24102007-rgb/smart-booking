import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';
import { LiveOrderStream } from './LiveOrderStream';
import { StockControl } from './StockControl';
import { DailyAccounting } from './DailyAccounting';
import {
  Store as StoreIcon,
  BellRing,
  Package,
  TrendingUp,
  Star,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';

export const WorkerDashboard: React.FC = () => {
  const { currentStore } = useAuth();
  const { getAnalyticsForStore } = useOrder();
  const [activeTab, setActiveTab] = useState<'stream' | 'stock' | 'accounting'>('stream');

  if (!currentStore) {
    return (
      <div className="text-center py-20 text-slate-400">
        No store selected. Please re-login with your store PIN.
      </div>
    );
  }

  const analytics = getAnalyticsForStore(currentStore.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Canteen Worker Store Hero Banner */}
      <div className="relative rounded-[32px] overflow-hidden border border-[#e8e8df] bg-white shadow-xs">
        <div className="absolute inset-0 h-32 sm:h-40 overflow-hidden">
          <img
            src={currentStore.image}
            alt={currentStore.name}
            className="w-full h-full object-cover filter brightness-95 opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
        </div>

        <div className="relative p-6 sm:p-8 pt-20 sm:pt-24 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          
          {/* Store Info */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#5a5a40] text-white font-mono font-bold text-xs">
                #{currentStore.code}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#5a5a401a] text-[#5a5a40] border border-[#5a5a4033] text-xs font-semibold flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Staff Management Active
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#3d3d3a] tracking-tight">
              {currentStore.name} Dashboard
            </h1>

            <p className="text-xs sm:text-sm text-[#8a8a70] max-w-xl">
              {currentStore.description}
            </p>
          </div>

          {/* Quick Header Metric Summary Pill */}
          <div className="flex items-center space-x-3 bg-[#fdfaf6] p-3.5 rounded-2xl border border-[#e8e8df] text-xs font-mono">
            <div className="text-center px-2">
              <span className="block text-[#8a8a70] text-[10px] uppercase font-bold">Pending</span>
              <span className="text-[#5a5a40] font-extrabold text-base">
                {analytics.totalOrdersPending}
              </span>
            </div>
            <div className="h-8 w-px bg-[#e8e8df]"></div>
            <div className="text-center px-2">
              <span className="block text-[#8a8a70] text-[10px] uppercase font-bold">Today Sales</span>
              <span className="text-[#5a5a40] font-extrabold text-base">
                ₹{analytics.totalSalesToday.toFixed(0)}
              </span>
            </div>
            <div className="h-8 w-px bg-[#e8e8df]"></div>
            <div className="text-center px-2">
              <span className="block text-[#8a8a70] text-[10px] uppercase font-bold">Rating</span>
              <span className="text-[#5a5a40] font-extrabold text-base flex items-center justify-center">
                <Star className="w-3.5 h-3.5 fill-[#5a5a40] mr-0.5 text-[#5a5a40]" />
                {currentStore.rating_avg.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex border-b border-[#e8e8df] space-x-2 text-sm font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('stream')}
          className={`pb-3 px-4 border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'stream'
              ? 'border-[#5a5a40] text-[#5a5a40]'
              : 'border-transparent text-[#8a8a70] hover:text-[#2d2d2a]'
          }`}
        >
          <BellRing className="w-4 h-4" />
          <span>Live Order Stream</span>
          {analytics.totalOrdersPending > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#5a5a40] text-white text-xs font-bold animate-pulse">
              {analytics.totalOrdersPending}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('stock')}
          className={`pb-3 px-4 border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'stock'
              ? 'border-[#5a5a40] text-[#5a5a40]'
              : 'border-transparent text-[#8a8a70] hover:text-[#2d2d2a]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Stock Control & Menu</span>
        </button>

        <button
          onClick={() => setActiveTab('accounting')}
          className={`pb-3 px-4 border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'accounting'
              ? 'border-[#5a5a40] text-[#5a5a40]'
              : 'border-transparent text-[#8a8a70] hover:text-[#2d2d2a]'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Daily Accounting & Revenue</span>
        </button>
      </div>

      {/* Tab View Content */}
      <div className="pt-2">
        {activeTab === 'stream' && <LiveOrderStream storeId={currentStore.id} />}
        {activeTab === 'stock' && <StockControl storeId={currentStore.id} />}
        {activeTab === 'accounting' && <DailyAccounting storeId={currentStore.id} />}
      </div>

    </div>
  );
};
