import React, { useState } from 'react';
import { useOrder } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { Order } from '../../types';
import { UpiPaymentModal } from './UpiPaymentModal';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  FileText,
  ArrowRight,
  Loader2,
  Sparkles,
  QrCode,
  Smartphone,
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderPlaced: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onOrderPlaced,
}) => {
  const { cart, updateCartQuantity, removeFromCart, cartTotal, placeOrder, clearCart } = useOrder();
  const { stores } = useAuth();
  const [notes, setNotes] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showUpiModal, setShowUpiModal] = useState(false);

  if (!isOpen) return null;

  // Determine target store for cart items
  const primaryStoreId = cart[0]?.foodItem.store_id || '';
  const store = stores.find(s => s.id === primaryStoreId) || null;

  const handleOpenUpiModal = () => {
    if (cart.length === 0) return;
    setShowUpiModal(true);
  };

  const handlePaymentSuccess = async (upiRef: string) => {
    setShowUpiModal(false);
    setIsPlacing(true);
    setErrorMsg(null);

    try {
      const fullNotes = notes ? `${notes} (UPI Txn: ${upiRef})` : `(UPI Txn: ${upiRef})`;
      const order = await placeOrder(primaryStoreId, fullNotes);
      setIsPlacing(false);
      onClose();
      onOrderPlaced(order);
      setNotes('');
    } catch (err: unknown) {
      setIsPlacing(false);
      setErrorMsg(err instanceof Error ? err.message : 'Failed to place order.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#2d2d2a]/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-white border-l border-[#e8e8df] h-full flex flex-col justify-between shadow-2xl text-[#2d2d2a]">
        
        {/* Cart Drawer Header */}
        <div className="p-4 sm:p-6 border-b border-[#e8e8df] flex items-center justify-between bg-[#fdfaf6]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5a5a401a] text-[#5a5a40] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl text-[#3d3d3a]">Pre-Order Cart</h2>
              <p className="text-xs text-[#8a8a70]">
                {store ? `Ordering from ${store.name}` : `${cart.length} item(s) selected`}
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

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-[#fdfaf6] border border-[#e8e8df] flex items-center justify-center mx-auto text-[#8a8a70]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-[#3d3d3a] font-serif font-bold text-base">Your cart is currently empty.</p>
              <p className="text-xs text-[#8a8a70] max-w-xs mx-auto leading-relaxed">
                Explore campus canteens and add delicious snacks, beverages or main meals to pre-order!
              </p>
            </div>
          ) : (
            <>
              {/* Store Identifier Banner */}
              {store && (
                <div className="p-3.5 rounded-2xl bg-[#5a5a401a] border border-[#5a5a4033] text-xs text-[#5a5a40] flex items-center justify-between">
                  <span className="font-bold">Outlet: {store.name}</span>
                  <span className="font-mono bg-[#5a5a40] text-white px-2 py-0.5 rounded text-[10px] font-bold">
                    #{store.code}
                  </span>
                </div>
              )}

              {/* Items */}
              <div className="space-y-3">
                {cart.map(item => (
                  <div
                    key={item.foodItem.id}
                    className="p-3.5 rounded-2xl bg-[#fdfaf6] border border-[#e8e8df] flex items-center justify-between space-x-3"
                  >
                    <img
                      src={item.foodItem.image}
                      alt={item.foodItem.name}
                      className="w-14 h-14 rounded-xl object-cover border border-[#e8e8df]"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-serif font-bold text-[#3d3d3a] truncate">
                        {item.foodItem.name}
                      </h4>
                      <p className="text-xs text-[#5a5a40] font-mono font-extrabold mt-0.5">
                        ₹{(item.foodItem.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-1 bg-[#e8e8df] rounded-full p-1 border border-[#d9d9cf]">
                      <button
                        onClick={() => updateCartQuantity(item.foodItem.id, item.quantity - 1)}
                        className="p-1 rounded-full text-[#5a5a40] hover:bg-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-[#2d2d2a] font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.foodItem.id, item.quantity + 1)}
                        className="p-1 rounded-full text-[#5a5a40] hover:bg-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.foodItem.id)}
                      className="text-[#8a8a70] hover:text-[#8b4513] p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Special Instructions */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-[#8a8a70] uppercase tracking-wider flex items-center">
                  <FileText className="w-3.5 h-3.5 mr-1 text-[#5a5a40]" />
                  Special Instructions / Preparation Notes
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Extra spicy, less ice, allergy alert..."
                  className="w-full p-3 rounded-2xl bg-[#fdfaf6] border border-[#e8e8df] text-xs text-[#2d2d2a] placeholder-[#8a8a70] focus:outline-none focus:border-[#5a5a40] h-20 resize-none"
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-2xl bg-[#8b4513]/10 border border-[#8b4513]/30 text-[#8b4513] text-xs font-semibold">
                  {errorMsg}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-6 border-t border-[#e8e8df] bg-[#fdfaf6] space-y-3">
            <div className="space-y-1 text-xs text-[#8a8a70]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-[#2d2d2a]">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Campus Pickup Fee</span>
                <span className="font-mono text-[#5a5a40] font-bold">FREE</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#e8e8df] text-sm font-extrabold text-[#2d2d2a]">
                <span>Total Amount</span>
                <span className="font-mono text-[#5a5a40] text-base">₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleOpenUpiModal}
              disabled={isPlacing}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#5a5a40] hover:opacity-90 text-white font-extrabold text-sm shadow-sm flex items-center justify-center space-x-2 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isPlacing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing UPI Order...</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4" />
                  <span>Pay via UPI / QR Code (₹{cartTotal.toFixed(2)})</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>

            <button
              onClick={clearCart}
              className="w-full text-center text-xs text-[#8a8a70] hover:text-[#2d2d2a]"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>

      <UpiPaymentModal
        isOpen={showUpiModal}
        onClose={() => setShowUpiModal(false)}
        store={store}
        items={cart}
        totalAmount={cartTotal}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};
