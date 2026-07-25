import React, { useState } from 'react';
import { useCanteen } from '../context/CanteenContext';
import { Order, OrderStatus } from '../types';
import {
  User,
  ShoppingBag,
  Clock,
  CheckCircle2,
  ChefHat,
  PackageCheck,
  XCircle,
  QrCode,
  RotateCcw,
  Receipt,
  Wallet,
  Sparkles,
  ArrowRight,
  Printer
} from 'lucide-react';

interface UserDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ setActiveTab }) => {
  const { currentUser, orders, cancelOrder, addToCart, showToast } = useCanteen();
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Filter user's personal orders
  const userOrders = orders.filter((o) => o.userId === currentUser.id || o.userEmail === currentUser.email);

  const activeOrders = userOrders.filter(
    (o) => o.status === 'Placed' || o.status === 'Preparing' || o.status === 'Ready for Pickup'
  );

  const pastOrders = userOrders.filter(
    (o) => o.status === 'Completed' || o.status === 'Cancelled'
  );

  const getStatusStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Placed':
        return 0;
      case 'Preparing':
        return 1;
      case 'Ready for Pickup':
        return 2;
      case 'Completed':
        return 3;
      default:
        return -1;
    }
  };

  const handleReorder = (order: Order) => {
    order.items.forEach((ci) => {
      addToCart(ci.item, ci.quantity, ci.customization);
    });
    showToast(`Added items from order ${order.id} back to cart!`, 'success');
    setActiveTab('cart');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* User Profile Card */}
      <div className="bg-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-amber-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-amber-950 font-black text-2xl flex items-center justify-center border-2 border-amber-400 shadow-md">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-serif font-bold text-white">{currentUser.name}</h1>
              <span className="bg-amber-800 text-amber-200 text-xs font-bold px-2.5 py-0.5 rounded-md border border-amber-700 uppercase">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-amber-200/80 mt-1">
              {currentUser.department || 'Campus Student'} {currentUser.rollNumber ? `• ${currentUser.rollNumber}` : ''}
            </p>
            <p className="text-xs text-amber-300/60 mt-0.5">{currentUser.email}</p>
          </div>
        </div>

        {/* Wallet & Stats */}
        <div className="flex items-center gap-4 bg-amber-900/60 p-3.5 rounded-2xl border border-amber-800/80 w-full md:w-auto justify-around">
          <div className="text-center px-3">
            <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
              Campus Wallet
            </span>
            <span className="text-xl font-serif font-bold text-amber-400 flex items-center justify-center gap-1">
              <Wallet className="w-4 h-4" /> ₹{currentUser.walletBalance || 0}
            </span>
          </div>
          <div className="h-8 w-px bg-amber-800" />
          <div className="text-center px-3">
            <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
              Total Orders
            </span>
            <span className="text-xl font-serif font-bold text-white">{userOrders.length}</span>
          </div>
        </div>
      </div>

      {/* Active Orders Live Tracker */}
      <div className="space-y-4">
        <h2 className="text-xl font-serif font-bold text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-600" />
          <span>Active Food Orders ({activeOrders.length})</span>
        </h2>

        {activeOrders.length > 0 ? (
          <div className="space-y-4">
            {activeOrders.map((order) => {
              const currentStep = getStatusStepIndex(order.status);
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border-2 border-amber-300 p-6 shadow-md space-y-6"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-amber-500 text-amber-950 font-black text-2xl font-serif rounded-2xl shadow-xs border border-amber-600">
                        {order.pickupToken}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-400">Order ID: #{order.id}</span>
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Placed at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex sm:flex-col justify-between items-end">
                      <span className="text-xl font-serif font-bold text-gray-900">₹{order.totalAmount}</span>
                      <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Paid via {order.paymentMethod}
                      </span>
                    </div>
                  </div>

                  {/* Real-time Status Progress Bar */}
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-3">
                      Live Kitchen Status Progression
                    </span>
                    <div className="relative flex items-center justify-between max-w-2xl mx-auto">
                      {/* Connecting line */}
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0" />
                      <div
                        className="absolute top-1/2 left-0 h-1 bg-amber-500 -translate-y-1/2 z-0 transition-all duration-500"
                        style={{
                          width: `${(currentStep / 3) * 100}%`
                        }}
                      />

                      {/* Stepper Dots */}
                      {[
                        { label: 'Placed', icon: <ShoppingBag className="w-4 h-4" /> },
                        { label: 'Preparing', icon: <ChefHat className="w-4 h-4" /> },
                        { label: 'Ready for Pickup', icon: <PackageCheck className="w-4 h-4" /> },
                        { label: 'Completed', icon: <CheckCircle2 className="w-4 h-4" /> }
                      ].map((step, idx) => {
                        const isDone = idx <= currentStep;
                        const isCurrent = idx === currentStep;
                        return (
                          <div key={step.label} className="relative z-10 flex flex-col items-center group">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                                isCurrent
                                  ? 'bg-amber-600 text-white ring-4 ring-amber-200 scale-110 animate-bounce'
                                  : isDone
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-white border-2 border-gray-300 text-gray-400'
                              }`}
                            >
                              {step.icon}
                            </div>
                            <span
                              className={`text-[11px] font-bold mt-2 text-center whitespace-nowrap ${
                                isCurrent
                                  ? 'text-amber-800 font-extrabold'
                                  : isDone
                                  ? 'text-emerald-800'
                                  : 'text-gray-400'
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ready for Pickup Alert */}
                  {order.status === 'Ready for Pickup' && (
                    <div className="p-4 bg-emerald-500 text-emerald-950 rounded-2xl flex items-center justify-between border-2 border-emerald-600 animate-pulse">
                      <div className="flex items-center gap-3">
                        <PackageCheck className="w-8 h-8 shrink-0" />
                        <div>
                          <p className="font-serif font-black text-lg leading-tight">Food is Ready for Pickup!</p>
                          <p className="text-xs font-semibold">Head over to Canteen Counter Bay 1 and show Token #{order.pickupToken}</p>
                        </div>
                      </div>
                      <QrCode className="w-10 h-10 opacity-80 shrink-0 hidden sm:block" />
                    </div>
                  )}

                  {/* Order Items Summary */}
                  <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100 space-y-2 text-xs">
                    <span className="font-bold text-amber-950 block">Ordered Items:</span>
                    <ul className="divide-y divide-amber-200/50">
                      {order.items.map((ci, i) => (
                        <li key={i} className="py-1.5 flex justify-between items-center text-gray-800">
                          <span>
                            <strong>{ci.quantity}x</strong> {ci.item.name} {ci.customization ? `(${ci.customization})` : ''}
                          </span>
                          <span className="font-mono font-bold">₹{ci.item.price * ci.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                    <button
                      onClick={() => setSelectedInvoiceOrder(order)}
                      className="flex items-center gap-1.5 text-amber-800 font-bold hover:underline"
                    >
                      <Receipt className="w-4 h-4" /> View Digital Receipt
                    </button>

                    {order.status === 'Placed' && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="text-rose-600 font-bold hover:text-rose-800 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-3xl border border-gray-200 p-6">
            <p className="text-xs text-gray-500">No active orders right now.</p>
          </div>
        )}
      </div>

      {/* Order History */}
      <div className="space-y-4">
        <h2 className="text-xl font-serif font-bold text-gray-900">Order History ({pastOrders.length})</h2>

        {pastOrders.length > 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="divide-y divide-gray-100">
              {pastOrders.map((order) => (
                <div key={order.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-sm text-gray-900">#{order.id}</span>
                      <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                        Token {order.pickupToken}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          order.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                      {order.items.map((ci) => `${ci.quantity}x ${ci.item.name}`).join(', ')}
                    </p>

                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-base font-serif font-bold text-gray-900 block">₹{order.totalAmount}</span>
                      <span className="text-[10px] text-gray-500">{order.paymentMethod}</span>
                    </div>

                    <button
                      onClick={() => handleReorder(order)}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl border border-amber-200 flex items-center gap-1"
                      title="Reorder same items"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reorder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-500 italic">No past completed orders yet.</p>
        )}
      </div>

      {/* Invoice Modal */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-amber-100 space-y-4">
            <div className="border-b border-gray-200 pb-4 text-center">
              <h3 className="font-serif font-bold text-xl text-amber-950">Campus Food Zone</h3>
              <p className="text-xs text-gray-500">Official Pre-Order Tax Invoice</p>
            </div>

            <div className="space-y-2 text-xs text-gray-700">
              <div className="flex justify-between">
                <span>Receipt Order ID:</span>
                <span className="font-bold font-mono">#{selectedInvoiceOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Pickup Token:</span>
                <span className="font-bold text-amber-800 text-sm">{selectedInvoiceOrder.pickupToken}</span>
              </div>
              <div className="flex justify-between">
                <span>Customer Name:</span>
                <span className="font-bold">{selectedInvoiceOrder.userName}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="font-bold">{selectedInvoiceOrder.paymentMethod}</span>
              </div>
            </div>

            <div className="border-t border-b border-gray-100 py-3 space-y-1 text-xs">
              {selectedInvoiceOrder.items.map((ci, i) => (
                <div key={i} className="flex justify-between">
                  <span>{ci.quantity}x {ci.item.name}</span>
                  <span className="font-mono">₹{ci.item.price * ci.quantity}</span>
                </div>
              ))}
              <div className="flex justify-between text-gray-500 pt-2 border-t border-gray-100">
                <span>Tax & Fees</span>
                <span>₹{selectedInvoiceOrder.taxAmount}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-1">
                <span>Total Paid</span>
                <span className="text-amber-800 font-serif">₹{selectedInvoiceOrder.totalAmount}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-gray-100 font-bold rounded-xl text-xs hover:bg-gray-200 flex items-center justify-center gap-1"
              >
                <Printer className="w-4 h-4" /> Print Receipt
              </button>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="flex-1 py-2.5 bg-amber-950 text-white font-bold rounded-xl text-xs hover:bg-amber-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
