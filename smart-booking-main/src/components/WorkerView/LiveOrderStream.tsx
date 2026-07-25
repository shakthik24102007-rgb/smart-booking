import React, { useState } from 'react';
import { useOrder } from '../../context/OrderContext';
import { Order, OrderStatus } from '../../types';
import {
  Clock,
  ChefHat,
  ShoppingBag,
  CheckCircle,
  Ban,
  FileText,
  User,
  BellRing,
} from 'lucide-react';

interface LiveOrderStreamProps {
  storeId: string;
}

export const LiveOrderStream: React.FC<LiveOrderStreamProps> = ({ storeId }) => {
  const { orders, updateOrderStatus } = useOrder();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filter orders by store ID
  const storeOrders = orders.filter(o => o.store_id === storeId);

  const filteredOrders = storeOrders.filter(o => {
    if (filterStatus === 'all') return true;
    return o.status === filterStatus;
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#5a5a401a] text-[#5a5a40] border border-[#5a5a4033] animate-pulse">⏳ Pending Acceptance</span>;
      case 'preparing':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#5a5a401a] text-[#5a5a40] border border-[#5a5a4033]">🍳 Preparing in Kitchen</span>;
      case 'ready':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#5a5a401a] text-[#5a5a40] border border-[#5a5a4033]">🛍️ Ready for Pick-Up</span>;
      case 'completed':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#e8e8df] text-[#2d2d2a]">✅ Completed</span>;
      case 'cancelled':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#8b4513]/10 text-[#8b4513] border border-[#8b4513]/30">🚫 Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#3d3d3a] flex items-center">
            <BellRing className="w-5 h-5 text-[#5a5a40] mr-2" />
            Live Incoming Orders Stream
          </h2>
          <p className="text-xs text-[#8a8a70] mt-0.5">
            Real-time kitchen order queue. Advance order status as food is prepared.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto bg-white p-1.5 rounded-full border border-[#e8e8df] text-xs font-semibold">
          {[
            { id: 'all', label: 'All' },
            { id: 'pending', label: 'Pending' },
            { id: 'preparing', label: 'Preparing' },
            { id: 'ready', label: 'Ready' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id)}
              className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
                filterStatus === f.id
                  ? 'bg-[#5a5a40] text-white font-bold shadow-xs'
                  : 'text-[#8a8a70] hover:text-[#2d2d2a]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-[#e8e8df] rounded-[32px] p-12 text-center space-y-3">
          <Clock className="w-12 h-12 text-[#8a8a70] mx-auto" />
          <h3 className="font-serif text-xl font-bold text-[#3d3d3a]">No Orders in Stream</h3>
          <p className="text-xs text-[#8a8a70] max-w-sm mx-auto leading-relaxed">
            New pre-orders placed by campus students for your store will appear here automatically in real-time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map(order => (
            <div
              key={order.id}
              className={`bg-white rounded-[24px] border p-5 space-y-4 flex flex-col justify-between shadow-xs transition-all ${
                order.status === 'pending'
                  ? 'border-[#5a5a40] ring-1 ring-[#5a5a4033]'
                  : order.status === 'preparing'
                  ? 'border-[#5a5a4033]'
                  : order.status === 'ready'
                  ? 'border-[#5a5a4033]'
                  : 'border-[#e8e8df]'
              }`}
            >
              {/* Order Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-white bg-[#5a5a40] px-2.5 py-1 rounded-xl">
                    {order.order_number}
                  </span>
                  {getStatusBadge(order.status)}
                </div>

                <div className="flex items-center justify-between text-xs text-[#8a8a70] pt-1">
                  <span className="flex items-center font-medium text-[#2d2d2a]">
                    <User className="w-3.5 h-3.5 mr-1 text-[#8a8a70]" />
                    {order.student_name}
                  </span>
                  <span className="font-mono text-[#8a8a70]">
                    {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="bg-[#fdfaf6] rounded-2xl p-3.5 border border-[#e8e8df] space-y-2 flex-1">
                <div className="text-[11px] font-bold text-[#8a8a70] uppercase tracking-wider mb-1">
                  Order Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
                </div>
                {order.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-0.5">
                    <span className="font-semibold text-[#2d2d2a]">
                      <span className="text-[#5a5a40] font-mono font-bold mr-1.5">{it.quantity}x</span>
                      {it.food_name}
                    </span>
                    <span className="font-mono text-[#8a8a70]">₹{(it.price * it.quantity).toFixed(2)}</span>
                  </div>
                ))}

                {order.notes && (
                  <div className="mt-2 pt-2 border-t border-[#e8e8df] text-[11px] text-[#5a5a40] flex items-start space-x-1">
                    <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#5a5a40]" />
                    <span className="italic">"{order.notes}"</span>
                  </div>
                )}
              </div>

              {/* Total & Action Status Toggles */}
              <div className="space-y-3 pt-1">
                <div className="flex justify-between items-center text-sm font-bold text-[#2d2d2a]">
                  <span>Total Bill:</span>
                  <span className="text-[#5a5a40] font-mono text-base font-extrabold">
                    ₹{order.total_amount.toFixed(2)}
                  </span>
                </div>

                {/* Status Toggles */}
                {order.status === 'pending' && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleStatusChange(order.id, 'preparing')}
                      className="py-2.5 px-3 rounded-2xl bg-[#5a5a40] hover:opacity-90 text-white font-bold text-xs flex items-center justify-center space-x-1 transition-all shadow-xs"
                    >
                      <ChefHat className="w-4 h-4" />
                      <span>Accept & Prepare</span>
                    </button>
                    <button
                      onClick={() => handleStatusChange(order.id, 'cancelled')}
                      className="py-2.5 px-3 rounded-2xl bg-[#8b4513]/10 hover:bg-[#8b4513]/20 text-[#8b4513] font-bold text-xs border border-[#8b4513]/30 transition-all"
                    >
                      <span>Reject/Cancel</span>
                    </button>
                  </div>
                )}

                {order.status === 'preparing' && (
                  <button
                    onClick={() => handleStatusChange(order.id, 'ready')}
                    className="w-full py-2.5 px-3 rounded-2xl bg-[#5a5a40] hover:opacity-90 text-white font-bold text-xs flex items-center justify-center space-x-1 transition-all shadow-xs"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Mark Ready for Pick-up</span>
                  </button>
                )}

                {order.status === 'ready' && (
                  <button
                    onClick={() => handleStatusChange(order.id, 'completed')}
                    className="w-full py-2.5 px-3 rounded-2xl bg-[#e8e8df] hover:bg-[#d9d9cf] text-[#2d2d2a] font-bold text-xs flex items-center justify-center space-x-1 transition-all"
                  >
                    <CheckCircle className="w-4 h-4 text-[#5a5a40]" />
                    <span>Complete Order (Picked Up)</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
