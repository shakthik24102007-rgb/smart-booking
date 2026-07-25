import React, { useState } from 'react';
import { useOrder } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { Order } from '../../types';
import {
  X,
  Clock,
  CheckCircle,
  Ban,
  FileText,
  Star,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';

interface MyOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectReceipt: (order: Order) => void;
  onOpenRating: (order: Order) => void;
}

export const MyOrdersModal: React.FC<MyOrdersModalProps> = ({
  isOpen,
  onClose,
  onSelectReceipt,
  onOpenRating,
}) => {
  const { orders, cancelOrder } = useOrder();
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [confirmingCancelId, setConfirmingCancelId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter student orders
  const studentOrders = orders.filter(
    o => o.student_id === user?.id || o.student_name === user?.name
  );

  const filteredOrders = studentOrders.filter(o => {
    if (filter === 'active') return o.status === 'pending' || o.status === 'preparing' || o.status === 'ready';
    if (filter === 'completed') return o.status === 'completed';
    if (filter === 'cancelled') return o.status === 'cancelled';
    return true;
  });

  const handleConfirmCancel = async (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation();
    await cancelOrder(orderId);
    setConfirmingCancelId(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#5a5a401a] text-[#5a5a40] border border-[#5a5a4033]">⏳ Pending</span>;
      case 'preparing':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#5a5a401a] text-[#5a5a40] border border-[#5a5a4033]">🍳 Preparing</span>;
      case 'ready':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#5a5a401a] text-[#5a5a40] border border-[#5a5a4033] animate-pulse">🛍️ Ready for Pick-Up</span>;
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#e8e8df] text-[#2d2d2a]">✅ Completed</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#8b4513]/10 text-[#8b4513] border border-[#8b4513]/30">🚫 Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2d2d2a]/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-[#e8e8df] rounded-[32px] max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl text-[#2d2d2a] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#e8e8df] flex items-center justify-between bg-[#fdfaf6]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5a5a401a] text-[#5a5a40] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-[#3d3d3a]">My Pre-Orders</h2>
              <p className="text-xs text-[#8a8a70]">
                Track live status, view digital receipts or cancel active orders.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#8a8a70] hover:text-[#2d2d2a] hover:bg-[#e8e8df] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-[#e8e8df] bg-[#fdfaf6] px-4 pt-3 space-x-2 text-xs font-semibold overflow-x-auto">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'active', label: 'Active Orders' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id as any)}
              className={`pb-3 px-3 border-b-2 transition-all whitespace-nowrap ${
                filter === t.id
                  ? 'border-[#5a5a40] text-[#5a5a40] font-bold'
                  : 'border-transparent text-[#8a8a70] hover:text-[#2d2d2a]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Orders List Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-12 h-12 text-[#8a8a70] mx-auto" />
              <p className="text-[#8a8a70] text-sm font-medium">No pre-orders found in this category.</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div
                key={order.id}
                onClick={() => onSelectReceipt(order)}
                className="p-4 rounded-2xl bg-[#fdfaf6] hover:bg-[#f8f5ef] border border-[#e8e8df] transition-all cursor-pointer group space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold bg-[#5a5a40] text-white px-2 py-0.5 rounded">
                      {order.order_number}
                    </span>
                    <span className="text-sm font-serif font-bold text-[#3d3d3a]">{order.store_name}</span>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                {/* Items preview */}
                <div className="text-xs text-[#2d2d2a] bg-white p-3 rounded-2xl border border-[#e8e8df] space-y-1">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{it.quantity}x {it.food_name}</span>
                      <span className="font-mono text-[#8a8a70]">₹{(it.price * it.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs pt-1 gap-2">
                  <div className="text-[#8a8a70] font-mono">
                    Total: <span className="text-[#5a5a40] font-extrabold">₹{order.total_amount.toFixed(2)}</span>
                    {order.status === 'cancelled' && (
                      <span className="ml-2 text-[11px] text-[#8b4513] font-bold bg-[#8b4513]/10 px-2 py-0.5 rounded-full border border-[#8b4513]/20">
                        80% Refunded: ₹{(order.total_amount * 0.8).toFixed(2)} (20% fee: ₹{(order.total_amount * 0.2).toFixed(2)})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {(order.status === 'pending' || order.status === 'preparing') && (
                      <>
                        {confirmingCancelId === order.id ? (
                          <div
                            onClick={e => e.stopPropagation()}
                            className="flex items-center space-x-1.5 bg-[#8b4513]/10 p-1.5 rounded-xl border border-[#8b4513]/30"
                          >
                            <span className="text-[10px] font-bold text-[#8b4513]">
                              Confirm 80% Refund (₹{(order.total_amount * 0.8).toFixed(2)})?
                            </span>
                            <button
                              onClick={e => handleConfirmCancel(e, order.id)}
                              className="px-2 py-0.5 rounded-lg bg-[#8b4513] text-white text-[10px] font-bold hover:opacity-90"
                            >
                              Yes, Cancel
                            </button>
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                setConfirmingCancelId(null);
                              }}
                              className="px-2 py-0.5 rounded-lg bg-[#e8e8df] text-[#2d2d2a] text-[10px] font-bold hover:bg-[#d9d9cf]"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setConfirmingCancelId(order.id);
                            }}
                            className="px-2.5 py-1 rounded-xl bg-[#8b4513]/10 hover:bg-[#8b4513]/20 text-[#8b4513] font-bold border border-[#8b4513]/30 text-[11px] flex items-center space-x-1"
                          >
                            <Ban className="w-3 h-3" />
                            <span>Cancel Order</span>
                          </button>
                        )}
                      </>
                    )}

                    {order.status === 'completed' && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onOpenRating(order);
                        }}
                        className="px-2.5 py-1 rounded-xl bg-[#5a5a401a] hover:bg-[#5a5a402a] text-[#5a5a40] font-bold border border-[#5a5a4033] text-[11px] flex items-center space-x-1"
                      >
                        <Star className="w-3 h-3 fill-[#5a5a40] text-[#5a5a40]" />
                        <span>Rate Food</span>
                      </button>
                    )}

                    <span className="text-[#8a8a70] group-hover:text-[#5a5a40] flex items-center text-[11px] font-bold">
                      Digital Receipt <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
