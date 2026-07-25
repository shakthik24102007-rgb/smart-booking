import React from 'react';
import { useOrder } from '../../context/OrderContext';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Ban,
  Award,
  Calendar,
  FileSpreadsheet,
} from 'lucide-react';

interface DailyAccountingProps {
  storeId: string;
}

export const DailyAccounting: React.FC<DailyAccountingProps> = ({ storeId }) => {
  const { getAnalyticsForStore, orders } = useOrder();
  const analytics = getAnalyticsForStore(storeId);

  const storeOrders = orders.filter(o => o.store_id === storeId);
  const avgOrderValue = analytics.totalOrdersCompleted > 0
    ? analytics.totalSalesToday / analytics.totalOrdersCompleted
    : 0;

  const maxItemQty = Math.max(1, ...analytics.popularItems.map(p => p.quantity));

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#3d3d3a] flex items-center">
            <TrendingUp className="w-5 h-5 text-[#5a5a40] mr-2" />
            Daily Accounting & Financial Analytics
          </h2>
          <p className="text-xs text-[#8a8a70] mt-0.5">
            Real-time accounting ledger and top selling item analytics for today.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono bg-white border border-[#e8e8df] px-3.5 py-2 rounded-2xl text-[#2d2d2a] shadow-xs">
          <Calendar className="w-3.5 h-3.5 text-[#5a5a40]" />
          <span>{new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Sales Today */}
        <div className="p-6 rounded-[24px] bg-white border border-[#e8e8df] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#8a8a70] mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Total Sales Today</span>
            <div className="w-8 h-8 rounded-xl bg-[#5a5a401a] text-[#5a5a40] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#3d3d3a] font-mono mt-1">
            ₹{analytics.totalSalesToday.toFixed(2)}
          </div>
          <div className="text-[11px] text-[#5a5a40] font-medium mt-1">
            Live revenue from completed pre-orders
          </div>
        </div>

        {/* Total Orders Completed */}
        <div className="p-6 rounded-[24px] bg-white border border-[#e8e8df] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#8a8a70] mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Orders Completed</span>
            <div className="w-8 h-8 rounded-xl bg-[#5a5a401a] text-[#5a5a40] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#3d3d3a] font-mono mt-1">
            {analytics.totalOrdersCompleted}
          </div>
          <div className="text-[11px] text-[#5a5a40] font-medium mt-1">
            Succesfully fulfilled & collected
          </div>
        </div>

        {/* Avg Order Value */}
        <div className="p-6 rounded-[24px] bg-white border border-[#e8e8df] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#8a8a70] mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Avg Order Value</span>
            <div className="w-8 h-8 rounded-xl bg-[#5a5a401a] text-[#5a5a40] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#3d3d3a] font-mono mt-1">
            ₹{avgOrderValue.toFixed(2)}
          </div>
          <div className="text-[11px] text-[#5a5a40] font-medium mt-1">
            Revenue per order average
          </div>
        </div>

        {/* Total Cancelled */}
        <div className="p-6 rounded-[24px] bg-white border border-[#e8e8df] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#8a8a70] mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Cancelled Orders</span>
            <div className="w-8 h-8 rounded-xl bg-[#8b4513]/10 text-[#8b4513] flex items-center justify-center">
              <Ban className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#3d3d3a] font-mono mt-1">
            {analytics.totalOrdersCancelled}
          </div>
          <div className="text-[11px] text-[#8b4513] font-medium mt-1">
            Voided / Student cancelled
          </div>
        </div>

      </div>

      {/* Popular Items Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Most Popular Items Breakdown */}
        <div className="bg-white border border-[#e8e8df] rounded-[24px] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-[#3d3d3a] text-lg flex items-center">
              <Award className="w-4 h-4 text-[#5a5a40] mr-2" />
              Most Popular Items Sold Today
            </h3>
            <span className="text-xs text-[#8a8a70] font-mono">Top 5</span>
          </div>

          {analytics.popularItems.length === 0 ? (
            <p className="text-xs text-[#8a8a70] py-6 text-center">
              No completed order items logged yet today.
            </p>
          ) : (
            <div className="space-y-4">
              {analytics.popularItems.map((item, idx) => {
                const percentage = Math.round((item.quantity / maxItemQty) * 100);
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-[#2d2d2a]">
                        {idx + 1}. {item.food_name}
                      </span>
                      <span className="font-mono text-[#5a5a40] font-bold">
                        {item.quantity} sold • ₹{item.totalRevenue.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-[#fdfaf6] h-2.5 rounded-full overflow-hidden border border-[#e8e8df]">
                      <div
                        className="bg-[#5a5a40] h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Financial Log */}
        <div className="bg-white border border-[#e8e8df] rounded-[24px] p-6 space-y-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-[#3d3d3a] text-lg flex items-center">
              <FileSpreadsheet className="w-4 h-4 text-[#5a5a40] mr-2" />
              Recent Completed Ledger
            </h3>
            <span className="text-xs text-[#8a8a70] font-mono">
              {storeOrders.length} transactions
            </span>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-60 pr-1">
            {storeOrders.length === 0 ? (
              <p className="text-xs text-[#8a8a70] py-6 text-center">
                No orders logged today.
              </p>
            ) : (
              storeOrders.slice(0, 10).map(ord => (
                <div
                  key={ord.id}
                  className="p-3 rounded-2xl bg-[#fdfaf6] border border-[#e8e8df] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] font-bold bg-[#5a5a40] text-white px-2 py-0.5 rounded-md">
                      {ord.order_number}
                    </span>
                    <span className="text-[#2d2d2a] truncate font-semibold">
                      {ord.student_name}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 font-mono">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        ord.status === 'completed'
                          ? 'bg-[#5a5a401a] text-[#5a5a40]'
                          : ord.status === 'cancelled'
                          ? 'bg-[#8b4513]/10 text-[#8b4513]'
                          : 'bg-[#5a5a401a] text-[#5a5a40]'
                      }`}
                    >
                      {ord.status}
                    </span>
                    <span className="font-bold text-[#2d2d2a]">₹{ord.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
