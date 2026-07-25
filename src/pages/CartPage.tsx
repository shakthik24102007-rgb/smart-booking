import React, { useState } from 'react';
import { useCanteen } from '../context/CanteenContext';
import { PaymentGatewayModal } from '../components/PaymentGatewayModal';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Utensils,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface CartPageProps {
  setActiveTab: (tab: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ setActiveTab }) => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    couponCode,
    discountPercent,
    applyCoupon,
    removeCoupon,
    currentUser
  } = useCanteen();

  const [inputCoupon, setInputCoupon] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);

  // Math
  const subtotal = cart.reduce((acc, ci) => acc + ci.item.price * ci.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxAmount = (subtotal - discountAmount) * 0.05;
  const finalTotal = subtotal - discountAmount + taxAmount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCoupon) {
      applyCoupon(inputCoupon);
      setInputCoupon('');
    }
  };

  const handleOrderCreatedSuccess = (orderId: string, pickupToken: string) => {
    setIsGatewayOpen(false);
    setActiveTab('user-dashboard');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="w-20 h-20 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-serif font-bold text-2xl text-gray-900">Your Cart is Empty</h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          You haven't added any delicious canteen snacks or meals yet. Explore our menu and place a pre-order!
        </p>
        <button
          onClick={() => setActiveTab('menu')}
          className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl text-xs shadow-md transition-all inline-flex items-center gap-2"
        >
          <span>Browse Food Zone Menu</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">My Canteen Order Cart</h1>
          <p className="text-xs text-gray-500">Review items before proceeding to demo payment gateway</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-600 font-bold hover:text-rose-800 flex items-center gap-1 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-amber-100 shadow-xs overflow-hidden">
            <div className="p-4 bg-amber-950 text-amber-200 text-xs font-bold flex justify-between">
              <span>Item Description & Customization</span>
              <span>Subtotal</span>
            </div>

            <div className="divide-y divide-gray-100">
              {cart.map(({ item, quantity, customization }) => (
                <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-gray-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                          }`}
                        />
                        <h3 className="font-serif font-bold text-base text-gray-900">{item.name}</h3>
                      </div>
                      <p className="text-xs text-amber-800 font-semibold mt-0.5">₹{item.price} each</p>

                      {customization && (
                        <p className="text-[11px] text-gray-500 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block mt-1">
                          Custom: {customization}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Delete */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-1">
                      <button
                        onClick={() => updateCartQuantity(item.id, quantity - 1)}
                        className="w-7 h-7 bg-white rounded-lg font-bold flex items-center justify-center hover:bg-amber-100 text-amber-900"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-bold text-xs px-2">{quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, quantity + 1)}
                        className="w-7 h-7 bg-amber-500 text-amber-950 font-bold rounded-lg flex items-center justify-center hover:bg-amber-400"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-serif font-bold text-gray-900 block">
                        ₹{item.price * quantity}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[11px] text-rose-500 hover:text-rose-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Special Instructions Field */}
          <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-xs space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block">
              Kitchen Special Instructions
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Serve hot, keep extra ketchup, less spice in biryani..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-2xl text-xs focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Sidebar Summary & Payment */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-amber-200/80 shadow-md space-y-5">
            <h2 className="font-serif font-bold text-lg text-gray-900 border-b border-gray-100 pb-3">
              Order Summary
            </h2>

            {/* Coupon Code Section */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-amber-600" /> Coupon Promo Code
              </label>

              {couponCode ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-emerald-900">{couponCode} ({discountPercent}% OFF)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-rose-600 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Try 'CAMPUS10'"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-xs font-mono uppercase focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-950 text-white font-bold rounded-xl text-xs hover:bg-amber-900"
                  >
                    Apply
                  </button>
                </form>
              )}
              <p className="text-[10px] text-gray-400">
                Hint: Use <strong>CAMPUS10</strong> for 10% off. Staff can use <strong>STAFF20</strong>.
              </p>
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs text-gray-600 border-t border-b border-gray-100 py-4">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-gray-900 font-mono">₹{subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount ({discountPercent}%)</span>
                  <span className="font-mono">- ₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>GST / Campus Canteen Tax (5%)</span>
                <span className="font-bold text-gray-900 font-mono">₹{taxAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
                <span className="font-serif">Total Payable</span>
                <span className="font-serif text-amber-800 text-xl font-black">
                  ₹{finalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => setIsGatewayOpen(true)}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl shadow-md transition-all text-sm flex items-center justify-center gap-2 transform active:scale-95"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Checkout with Demo Gateway</span>
            </button>

            <p className="text-[10px] text-center text-gray-400">
              Orders sent directly to Canteen Kitchen. Live tracking provided post-payment.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      <PaymentGatewayModal
        isOpen={isGatewayOpen}
        onClose={() => setIsGatewayOpen(false)}
        specialInstructions={specialInstructions}
        onSuccessOrderCreated={handleOrderCreatedSuccess}
      />
    </div>
  );
};
