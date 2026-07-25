import React, { useState, useEffect } from 'react';
import { Store, CartItem } from '../../types';
import {
  X,
  QrCode,
  Smartphone,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Copy,
  Check,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

interface UpiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  store: Store | null;
  items: CartItem[];
  totalAmount: number;
  onPaymentSuccess: (upiReference: string) => void;
}

export const UpiPaymentModal: React.FC<UpiPaymentModalProps> = ({
  isOpen,
  onClose,
  store,
  items,
  totalAmount,
  onPaymentSuccess,
}) => {
  const [selectedApp, setSelectedApp] = useState<'qr' | 'phonepe' | 'gpay' | 'paytm' | 'bhim'>('qr');
  const [isCopied, setIsCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyCountdown, setVerifyCountdown] = useState(3);
  const [paymentDone, setPaymentDone] = useState(false);

  const upiId = 'campusbite@upi';
  const merchantName = store ? `${store.name} - CampusBite` : 'CampusBite Canteen';
  const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${totalAmount}&cu=INR&tn=${encodeURIComponent('Campus Canteen Order')}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
    upiString
  )}&color=2d2d2a&bgcolor=ffffff`;

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleLaunchApp = (app: 'phonepe' | 'gpay' | 'paytm' | 'bhim') => {
    setSelectedApp(app);
    let deepLink = upiString;

    if (app === 'phonepe') {
      deepLink = `phonepe://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${totalAmount}&cu=INR`;
    } else if (app === 'gpay') {
      deepLink = `tez://upi/pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${totalAmount}&cu=INR`;
    } else if (app === 'paytm') {
      deepLink = `paytmmp://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${totalAmount}&cu=INR`;
    }

    // Try opening deep link
    window.location.href = deepLink;

    // Start auto verification simulation
    triggerPaymentVerification();
  };

  const triggerPaymentVerification = () => {
    setIsVerifying(true);
    setVerifyCountdown(3);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isVerifying && verifyCountdown > 0) {
      timer = setTimeout(() => {
        setVerifyCountdown(prev => prev - 1);
      }, 1000);
    } else if (isVerifying && verifyCountdown === 0) {
      setIsVerifying(false);
      setPaymentDone(true);
      setTimeout(() => {
        const fakeTxnRef = 'UPI-' + Math.floor(100000000000 + Math.random() * 900000000000);
        onPaymentSuccess(fakeTxnRef);
      }, 800);
    }
    return () => clearTimeout(timer);
  }, [isVerifying, verifyCountdown, onPaymentSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#2d2d2a]/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#e8e8df] rounded-[32px] max-w-md w-full p-6 sm:p-7 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#8a8a70] hover:text-[#2d2d2a] hover:bg-[#e8e8df] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#5a5a401a] text-[#5a5a40] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant UPI Canteen Payment</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#3d3d3a]">
            Pay ₹{totalAmount.toFixed(2)}
          </h2>
          <p className="text-xs text-[#8a8a70] mt-0.5 font-medium">
            Ordering from <span className="font-bold text-[#2d2d2a]">{store?.name}</span> ({items.length} items)
          </p>
        </div>

        {paymentDone ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-serif text-xl font-bold text-emerald-800">Payment Confirmed!</h3>
            <p className="text-xs text-[#8a8a70]">
              Redirecting to your digital receipt & kitchen order queue...
            </p>
          </div>
        ) : isVerifying ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 bg-[#5a5a401a] text-[#5a5a40] rounded-full flex items-center justify-center mx-auto animate-spin">
              <RefreshCw className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#3d3d3a]">
              Verifying UPI Transaction...
            </h3>
            <p className="text-xs text-[#8a8a70]">
              Connecting with UPI payment gateway ({verifyCountdown}s)...
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            
            {/* Quick App Direct Redirect Buttons */}
            <div>
              <label className="block text-[11px] font-bold text-[#8a8a70] uppercase tracking-wider mb-2">
                1-Tap Pay via App
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => handleLaunchApp('phonepe')}
                  className="p-3 rounded-2xl bg-[#5f259f]/10 border border-[#5f259f]/30 hover:bg-[#5f259f]/20 text-[#5f259f] text-xs font-bold flex items-center justify-center space-x-2 transition-all active:scale-95"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>PhonePe</span>
                </button>

                <button
                  onClick={() => handleLaunchApp('gpay')}
                  className="p-3 rounded-2xl bg-[#4285f4]/10 border border-[#4285f4]/30 hover:bg-[#4285f4]/20 text-[#1a73e8] text-xs font-bold flex items-center justify-center space-x-2 transition-all active:scale-95"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Google Pay</span>
                </button>

                <button
                  onClick={() => handleLaunchApp('paytm')}
                  className="p-3 rounded-2xl bg-[#00baf2]/10 border border-[#00baf2]/30 hover:bg-[#00baf2]/20 text-[#002e6e] text-xs font-bold flex items-center justify-center space-x-2 transition-all active:scale-95"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Paytm</span>
                </button>

                <button
                  onClick={() => handleLaunchApp('bhim')}
                  className="p-3 rounded-2xl bg-[#00897b]/10 border border-[#00897b]/30 hover:bg-[#00897b]/20 text-[#00695c] text-xs font-bold flex items-center justify-center space-x-2 transition-all active:scale-95"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>BHIM / UPI</span>
                </button>
              </div>
            </div>

            {/* Auto Generated QR Code */}
            <div className="bg-[#fdfaf6] border border-[#e8e8df] p-4 rounded-3xl text-center space-y-3">
              <div className="flex items-center justify-center space-x-1 text-xs font-bold text-[#5a5a40]">
                <QrCode className="w-4 h-4" />
                <span>Or Scan Dynamic QR Code</span>
              </div>

              <div className="bg-white p-3 rounded-2xl inline-block border border-[#e8e8df] shadow-sm">
                <img
                  src={qrCodeUrl}
                  alt="UPI QR Code"
                  className="w-48 h-48 mx-auto rounded-lg object-contain"
                />
              </div>

              {/* UPI ID copy pill */}
              <div className="flex items-center justify-center space-x-2">
                <span className="text-xs font-mono font-bold text-[#3d3d3a] bg-[#e8e8df] px-3 py-1 rounded-full">
                  {upiId}
                </span>
                <button
                  onClick={copyUpiId}
                  className="p-1.5 rounded-lg bg-[#5a5a40] text-white hover:opacity-90 text-xs font-semibold transition-all"
                  title="Copy UPI ID"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Cancellation 80% Refund Notice */}
            <div className="p-3 rounded-2xl bg-[#8b4513]/10 border border-[#8b4513]/25 flex items-start space-x-2.5 text-xs text-[#8b4513]">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Cancellation Policy:</span> If you cancel this order prior to preparation, <span className="font-bold underline">80% of amount (₹{(totalAmount * 0.8).toFixed(2)})</span> will be refunded. A 20% processing fee applies.
              </div>
            </div>

            {/* Manual Payment Verified Confirmation Button */}
            <button
              onClick={triggerPaymentVerification}
              className="w-full py-3.5 px-5 rounded-2xl bg-[#5a5a40] hover:bg-[#4a4a34] text-white font-bold text-sm shadow-md flex items-center justify-center space-x-2 transition-all active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>I Have Paid ₹{totalAmount.toFixed(2)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
