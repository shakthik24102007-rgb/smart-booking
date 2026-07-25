import React, { useState } from 'react';
import { useCanteen } from '../context/CanteenContext';
import { PaymentMethod } from '../types';
import {
  CreditCard,
  QrCode,
  Wallet,
  Coins,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  Sparkles,
  Receipt,
  Copy,
  AlertOctagon
} from 'lucide-react';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  specialInstructions?: string;
  onSuccessOrderCreated: (orderId: string, pickupToken: string) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  specialInstructions = '',
  onSuccessOrderCreated
}) => {
  if (!isOpen) return null;

  const {
    cart,
    discountPercent,
    currentUser,
    placeOrder,
    showToast
  } = useCanteen();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [upiId, setUpiId] = useState(`${currentUser.email.split('@')[0]}@okicici`);
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardCvv, setCardCvv] = useState('882');

  const [simulateFailure, setSimulateFailure] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentState, setPaymentState] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [completedOrderData, setCompletedOrderData] = useState<{ orderId: string; pickupToken: string } | null>(null);

  // Math Calculations
  const subtotal = cart.reduce((acc, ci) => acc + ci.item.price * ci.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxAmount = (subtotal - discountAmount) * 0.05;
  const finalTotal = subtotal - discountAmount + taxAmount;

  const handlePay = () => {
    setIsProcessing(true);
    setPaymentState('processing');

    setTimeout(() => {
      setIsProcessing(false);

      if (simulateFailure) {
        setPaymentState('failed');
        setErrorMessage('Transaction declined by issuing bank (Simulated Test Failure).');
        showToast('Payment failed (Simulated). Try switching off failure trigger.', 'error');
        return;
      }

      // Check Campus Wallet balance
      if (paymentMethod === 'Campus Wallet' && (currentUser.walletBalance || 0) < finalTotal) {
        setPaymentState('failed');
        setErrorMessage(`Insufficient Campus Wallet balance (Available: ₹${currentUser.walletBalance || 0})`);
        showToast('Insufficient wallet balance', 'error');
        return;
      }

      // Execute order creation in context
      const res = placeOrder(paymentMethod, specialInstructions);

      if (res.success && res.orderId && res.pickupToken) {
        setPaymentState('success');
        setCompletedOrderData({
          orderId: res.orderId,
          pickupToken: res.pickupToken
        });
        showToast(`Order Placed! Token: ${res.pickupToken}`, 'success');
        onSuccessOrderCreated(res.orderId, res.pickupToken);
      } else {
        setPaymentState('failed');
        setErrorMessage(res.message);
      }
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-amber-100 flex flex-col">
        {/* Modal Header */}
        <div className="bg-amber-950 text-white p-5 flex items-center justify-between border-b border-amber-900">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <h2 className="font-serif font-bold text-lg">Food Zone Demo Gateway</h2>
            </div>
            <p className="text-xs text-amber-300/80">Secure simulated checkout environment</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-amber-300 block">Total Payable</span>
            <span className="text-xl font-bold font-serif text-amber-400">₹{finalTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Modal Content depending on state */}
        {paymentState === 'idle' && (
          <div className="p-6 space-y-5">
            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Select Payment Method
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'UPI', label: 'UPI / QR Code', icon: <QrCode className="w-5 h-5 text-emerald-600" /> },
                  { id: 'Card', label: 'Credit / Debit Card', icon: <CreditCard className="w-5 h-5 text-blue-600" /> },
                  { id: 'Campus Wallet', label: `Wallet (₹${currentUser.walletBalance || 0})`, icon: <Wallet className="w-5 h-5 text-purple-600" /> },
                  { id: 'Counter Cash', label: 'Cash at Pickup', icon: <Coins className="w-5 h-5 text-amber-600" /> }
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                    className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      paymentMethod === m.id
                        ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                    }`}
                  >
                    {m.icon}
                    <div>
                      <p className="font-bold text-xs text-gray-900">{m.label}</p>
                      <p className="text-[10px] text-gray-500">
                        {m.id === 'UPI' ? 'GPay, PhonePe, Paytm' : m.id === 'Card' ? 'Visa, Mastercard' : m.id === 'Campus Wallet' ? 'Student ID Card' : 'Pay at counter'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Method Inputs */}
            {paymentMethod === 'UPI' && (
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900">Scan QR Code or Enter VPA</span>
                  <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded font-bold">Auto Verification</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-white p-1.5 rounded-xl border border-emerald-200 shrink-0 shadow-xs flex flex-col items-center justify-center">
                    <QrCode className="w-12 h-12 text-emerald-800" />
                    <span className="text-[8px] font-mono text-gray-500 mt-1">SCAN ME</span>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="text-[11px] font-semibold text-gray-600">Your UPI ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-emerald-300 rounded-xl font-mono focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'Card' && (
              <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-2 text-xs">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-blue-200 rounded-xl font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Expiry</label>
                    <input
                      type="text"
                      defaultValue="08 / 28"
                      className="w-full px-3 py-1.5 bg-white border border-blue-200 rounded-xl font-mono text-center"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-blue-200 rounded-xl font-mono text-center"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'Campus Wallet' && (
              <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-purple-900">Campus Student ID Wallet</span>
                  <span className="font-bold text-purple-900 text-sm">₹{currentUser.walletBalance || 0}</span>
                </div>
                <p className="text-gray-600">
                  Direct debit from your campus card ID ({currentUser.rollNumber || 'STUDENT-CARD'}). Instant processing.
                </p>
              </div>
            )}

            {/* Demo Simulation Toggle */}
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span className="text-xs font-bold text-amber-950">Simulate Payment Failure Trigger</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={simulateFailure}
                  onChange={(e) => setSimulateFailure(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-5 py-3 rounded-2xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-100 transition-colors"
              >
                Back to Cart
              </button>
              <button
                onClick={handlePay}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-2xl shadow-md transition-all text-xs flex items-center justify-center gap-2"
              >
                <span>Pay ₹{finalTotal.toFixed(2)} Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Processing State */}
        {paymentState === 'processing' && (
          <div className="p-10 text-center space-y-4">
            <Loader2 className="w-12 h-12 text-amber-600 animate-spin mx-auto" />
            <div>
              <h3 className="font-serif font-bold text-lg text-gray-900">Processing Payment...</h3>
              <p className="text-xs text-gray-500 mt-1">Connecting to bank & verifying token credentials</p>
            </div>
          </div>
        )}

        {/* Success State */}
        {paymentState === 'success' && completedOrderData && (
          <div className="p-6 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Payment Successful!
              </span>
              <h3 className="font-serif font-bold text-2xl text-gray-900 mt-2">
                Order Confirmed
              </h3>
            </div>

            {/* Token Highlight Box */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 text-center space-y-1">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-widest block">
                YOUR PICKUP TOKEN
              </span>
              <span className="text-4xl font-serif font-black text-amber-950 tracking-wider">
                {completedOrderData.pickupToken}
              </span>
              <p className="text-[11px] text-amber-800 font-medium pt-1">
                Show this token at the Canteen Counter when status updates to "Ready for Pickup"
              </p>
            </div>

            <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-200 flex justify-between">
              <span>Order Reference ID:</span>
              <span className="font-mono font-bold text-gray-900">{completedOrderData.orderId}</span>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-amber-950 text-white font-bold py-3 rounded-2xl text-xs hover:bg-amber-900 transition-colors shadow-sm"
            >
              View Order in My Dashboard
            </button>
          </div>
        )}

        {/* Failure State */}
        {paymentState === 'failed' && (
          <div className="p-6 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertOctagon className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                Payment Failed
              </span>
              <h3 className="font-serif font-bold text-xl text-gray-900 mt-2">
                Transaction Declined
              </h3>
            </div>

            <p className="text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200">
              {errorMessage || 'Payment could not be processed.'}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setPaymentState('idle');
                  setSimulateFailure(false);
                }}
                className="flex-1 bg-amber-600 text-white font-bold py-3 rounded-2xl text-xs hover:bg-amber-700"
              >
                Try Again
              </button>
              <button
                onClick={onClose}
                className="px-4 bg-gray-100 text-gray-700 font-bold py-3 rounded-2xl text-xs hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
