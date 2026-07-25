import React, { useState } from 'react';
import { Order } from '../../types';
import { useOrder } from '../../context/OrderContext';
import {
  X,
  CheckCircle,
  Clock,
  Ban,
  ChefHat,
  ShoppingBag,
  Printer,
  XCircle,
  AlertCircle,
  Store,
} from 'lucide-react';

interface DigitalReceiptModalProps {
  order: Order | null;
  onClose: () => void;
  onOpenRating?: () => void;
}

export const DigitalReceiptModal: React.FC<DigitalReceiptModalProps> = ({
  order,
  onClose,
  onOpenRating,
}) => {
  const { cancelOrder, orders } = useOrder();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  if (!order) return null;

  // Refresh current order state from context
  const liveOrder = orders.find(o => o.id === order.id) || order;

  const handlePrint = () => {
    try {
      const printContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Receipt - Order #${liveOrder.order_number}</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; padding: 24px; color: #2d2d2a; max-width: 380px; margin: 0 auto; }
              .header { text-align: center; border-bottom: 2px dashed #2d2d2a; padding-bottom: 12px; margin-bottom: 16px; }
              .store { font-size: 22px; font-weight: bold; margin-bottom: 4px; }
              .order-num { font-size: 15px; font-weight: bold; background: #e8e8df; padding: 4px 12px; display: inline-block; border-radius: 12px; margin-top: 4px; }
              .meta { font-size: 12px; color: #5a5a40; margin-bottom: 16px; line-height: 1.6; }
              .item-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; border-bottom: 1px dotted #e8e8df; padding-bottom: 4px; }
              .total-row { border-top: 2px dashed #2d2d2a; padding-top: 12px; margin-top: 16px; font-weight: bold; font-size: 16px; display: flex; justify-content: space-between; }
              .refund-box { background: #fdf5f0; border: 1px solid #8b4513; color: #8b4513; padding: 10px; border-radius: 8px; margin-top: 12px; font-size: 12px; text-align: center; font-weight: bold; }
              .footer { text-align: center; margin-top: 24px; font-size: 11px; color: #8a8a70; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="store">${liveOrder.store_name || 'Campus Canteen'}</div>
              <div>Digital Canteen Pre-Order Receipt</div>
              <div class="order-num">Order #${liveOrder.order_number}</div>
            </div>
            <div class="meta">
              <div><b>Student:</b> ${liveOrder.student_name}</div>
              <div><b>Date:</b> ${new Date(liveOrder.created_at).toLocaleString()}</div>
              <div><b>Status:</b> ${liveOrder.status.toUpperCase()}</div>
              ${liveOrder.notes ? `<div><b>Notes:</b> ${liveOrder.notes}</div>` : ''}
            </div>
            <div style="font-weight:bold; font-size:12px; text-transform:uppercase; margin-bottom:8px; color:#5a5a40;">Items List</div>
            <div>
              ${liveOrder.items
                .map(
                  it => `
                <div class="item-row">
                  <span><b>${it.quantity}x</b> ${it.food_name}</span>
                  <span>₹${(it.price * it.quantity).toFixed(2)}</span>
                </div>
              `
                )
                .join('')}
            </div>
            <div class="total-row">
              <span>Total Paid</span>
              <span>₹${liveOrder.total_amount.toFixed(2)}</span>
            </div>
            ${
              liveOrder.status === 'cancelled'
                ? `<div class="refund-box">
                    80% Refund Issued: ₹${(liveOrder.total_amount * 0.8).toFixed(2)}<br/>
                    <span style="font-weight:normal; font-size:10px;">(20% Cancellation Fee: ₹${(liveOrder.total_amount * 0.2).toFixed(2)})</span>
                   </div>`
                : ''
            }
            <div class="footer">
              <p>Thank you for using CampusBite Canteen Services!</p>
            </div>
          </body>
        </html>
      `;

      const printWin = window.open('', '_blank', 'width=450,height=600');
      if (printWin) {
        printWin.document.write(printContent);
        printWin.document.close();
        printWin.focus();
        setTimeout(() => {
          printWin.print();
          printWin.close();
        }, 300);
      } else {
        window.print();
      }
    } catch (err) {
      window.print();
    }
  };

  const executeCancel = async () => {
    setIsCancelling(true);
    try {
      await cancelOrder(liveOrder.id);
    } finally {
      setIsCancelling(false);
      setShowCancelConfirm(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-[#5a5a401a] text-[#5a5a40] border-[#5a5a4033]';
      case 'preparing':
        return 'bg-[#5a5a401a] text-[#5a5a40] border-[#5a5a4033]';
      case 'ready':
        return 'bg-[#5a5a401a] text-[#5a5a40] border-[#5a5a4033]';
      case 'completed':
        return 'bg-[#e8e8df] text-[#2d2d2a] border-[#d9d9cf]';
      case 'cancelled':
        return 'bg-[#8b4513]/10 text-[#8b4513] border-[#8b4513]/30';
      default:
        return 'bg-[#e8e8df] text-[#2d2d2a]';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 animate-spin text-[#5a5a40]" />;
      case 'preparing':
        return <ChefHat className="w-4 h-4 text-[#5a5a40]" />;
      case 'ready':
        return <ShoppingBag className="w-4 h-4 text-[#5a5a40]" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-[#5a5a40]" />;
      case 'cancelled':
        return <Ban className="w-4 h-4 text-[#8b4513]" />;
      default:
        return null;
    }
  };

  // Status step index: 0=Pending, 1=Preparing, 2=Ready, 3=Completed
  const steps = [
    { key: 'pending', label: 'Order Sent' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'ready', label: 'Ready for Pick-up' },
    { key: 'completed', label: 'Completed' },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === liveOrder.status);

  return (
    <div className="fixed inset-0 z-50 bg-[#2d2d2a]/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#e8e8df] rounded-[32px] max-w-lg w-full p-6 sm:p-8 shadow-2xl text-[#2d2d2a] relative my-8 print:p-0 print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#8a8a70] hover:text-[#2d2d2a] hover:bg-[#e8e8df] transition-colors print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Digital Receipt Header */}
        <div className="text-center pb-6 border-b border-[#e8e8df] space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#5a5a40] text-white flex items-center justify-center mx-auto shadow-sm print:hidden">
            <Store className="w-6 h-6" />
          </div>
          <div className="text-xs font-bold text-[#5a5a40] uppercase tracking-widest font-mono">
            Digital Campus Pre-Order Receipt
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#3d3d3a] print:text-black">
            {liveOrder.store_name || 'Campus Canteen'}
          </h2>
          
          <div className="inline-block px-3 py-1 rounded-full bg-[#e8e8df] text-[#5a5a40] font-mono font-bold text-sm">
            Order Number: {liveOrder.order_number}
          </div>
        </div>

        {/* Order Status Progress Bar */}
        {liveOrder.status !== 'cancelled' ? (
          <div className="py-6 border-b border-[#e8e8df] print:hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#8a8a70] uppercase tracking-wider">
                Live Status Tracker
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center space-x-1.5 capitalize ${getStatusColor(
                  liveOrder.status
                )}`}
              >
                {getStatusIcon(liveOrder.status)}
                <span>{liveOrder.status.replace('-', ' ')}</span>
              </span>
            </div>

            {/* Step Bar */}
            <div className="grid grid-cols-4 gap-1 mt-3">
              {steps.map((st, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div key={st.key} className="text-center space-y-1">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isPassed
                          ? isCurrent
                            ? 'bg-[#5a5a40] animate-pulse'
                            : 'bg-[#5a5a40]'
                          : 'bg-[#e8e8df]'
                      }`}
                    />
                    <span
                      className={`text-[10px] font-semibold block truncate ${
                        isPassed ? 'text-[#2d2d2a]' : 'text-[#8a8a70]'
                      }`}
                    >
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="py-4 border-b border-[#e8e8df] text-center text-[#8b4513] font-bold text-xs bg-[#8b4513]/10 rounded-2xl my-4 p-3 border border-[#8b4513]/20">
            <XCircle className="w-5 h-5 mx-auto mb-1 text-[#8b4513]" />
            THIS ORDER HAS BEEN CANCELLED
          </div>
        )}

        {/* Receipt Details */}
        <div className="py-6 space-y-4 border-b border-[#e8e8df]">
          <div className="grid grid-cols-2 gap-4 text-xs text-[#8a8a70]">
            <div>
              <span className="block text-[11px] text-[#8a8a70]">Student Name</span>
              <span className="font-semibold text-[#2d2d2a]">{liveOrder.student_name}</span>
            </div>
            <div>
              <span className="block text-[11px] text-[#8a8a70]">Timestamp</span>
              <span className="font-semibold text-[#2d2d2a]">
                {new Date(liveOrder.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>

          {liveOrder.notes && (
            <div className="p-3.5 rounded-2xl bg-[#fdfaf6] border border-[#e8e8df] text-xs text-[#5a5a40]">
              <span className="font-bold text-[#8a8a70] block text-[10px] uppercase">
                Special Instructions:
              </span>
              "{liveOrder.notes}"
            </div>
          )}

          {/* Itemized Table */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-[#8a8a70] uppercase tracking-wider block">
              Itemized Breakdown
            </span>
            <div className="space-y-2 bg-[#fdfaf6] p-4 rounded-2xl border border-[#e8e8df]">
              {liveOrder.items.map((it, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs text-[#2d2d2a] py-1 border-b border-[#e8e8df] last:border-none"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-mono bg-[#5a5a40] text-white px-1.5 py-0.5 rounded text-[11px] font-bold">
                      {it.quantity}x
                    </span>
                    <span className="font-medium">{it.food_name}</span>
                  </div>
                  <span className="font-mono font-bold text-[#5a5a40]">
                    ₹{(it.price * it.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Cost & Refund Breakdown */}
          <div className="pt-2 space-y-2">
            <div className="flex justify-between items-center text-sm font-bold text-[#2d2d2a]">
              <span>Total Amount Paid</span>
              <span className="text-xl font-mono font-extrabold text-[#5a5a40]">
                ₹{liveOrder.total_amount.toFixed(2)}
              </span>
            </div>

            {liveOrder.status === 'cancelled' && (
              <div className="p-3.5 rounded-2xl bg-[#8b4513]/10 border border-[#8b4513]/30 text-xs text-[#8b4513] space-y-1">
                <div className="font-bold flex items-center justify-between">
                  <span>80% Refund Issued:</span>
                  <span className="font-mono text-sm">₹{(liveOrder.total_amount * 0.8).toFixed(2)}</span>
                </div>
                <div className="text-[11px] opacity-80 flex items-center justify-between">
                  <span>20% Cancellation Charge:</span>
                  <span className="font-mono">₹{(liveOrder.total_amount * 0.2).toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-6 space-y-3 print:hidden">
          {/* Cancel Button (For active pending or preparing orders) */}
          {(liveOrder.status === 'pending' || liveOrder.status === 'preparing') && (
            <>
              {showCancelConfirm ? (
                <div className="p-4 rounded-2xl bg-[#8b4513]/10 border border-[#8b4513]/30 text-xs text-[#8b4513] space-y-3 animate-in fade-in duration-150">
                  <div className="font-bold text-sm flex items-center space-x-1.5">
                    <AlertCircle className="w-4 h-4 text-[#8b4513]" />
                    <span>Confirm Order Cancellation?</span>
                  </div>
                  <div className="space-y-1 text-[#2d2d2a] font-medium">
                    <div className="flex justify-between">
                      <span>Total Amount Paid:</span>
                      <span className="font-mono font-bold">₹{liveOrder.total_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>80% Refund to UPI:</span>
                      <span className="font-mono">₹{(liveOrder.total_amount * 0.8).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[#8b4513] text-[11px]">
                      <span>20% Processing Fee:</span>
                      <span className="font-mono">₹{(liveOrder.total_amount * 0.2).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 pt-1">
                    <button
                      onClick={executeCancel}
                      disabled={isCancelling}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#8b4513] hover:opacity-90 text-white font-bold text-xs transition-all shadow-xs disabled:opacity-50"
                    >
                      {isCancelling ? 'Cancelling...' : 'Confirm 80% Refund'}
                    </button>
                    <button
                      onClick={() => setShowCancelConfirm(false)}
                      disabled={isCancelling}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#e8e8df] hover:bg-[#d9d9cf] text-[#2d2d2a] font-bold text-xs transition-all"
                    >
                      Keep Order
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="w-full py-3 px-4 rounded-2xl bg-[#8b4513]/10 hover:bg-[#8b4513]/20 border border-[#8b4513]/30 text-[#8b4513] font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Ban className="w-4 h-4" />
                  <span>Cancel Order Prior to Pickup (80% Refund)</span>
                </button>
              )}
            </>
          )}

          {/* Leave Rating for completed orders */}
          {liveOrder.status === 'completed' && onOpenRating && (
            <button
              onClick={() => {
                onClose();
                onOpenRating();
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#5a5a40] text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-all hover:opacity-90"
            >
              <span>⭐ Leave Shop & Food Rating</span>
            </button>
          )}

          <div className="flex space-x-3">
            <button
              onClick={handlePrint}
              className="flex-1 py-3 px-4 rounded-2xl bg-[#e8e8df] hover:bg-[#d9d9cf] text-[#5a5a40] font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-2xl bg-[#5a5a40] text-white font-bold text-xs hover:opacity-90 transition-colors shadow-sm"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
