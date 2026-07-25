import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { ThemeSelector } from './ThemeSelector';
import {
  UtensilsCrossed,
  ShoppingBag,
  Clock,
  Store,
  LogOut,
  Code2,
  Lock,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenMyOrders: () => void;
  onOpenSqlModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCart,
  onOpenMyOrders,
  onOpenSqlModal,
}) => {
  const { user, currentStore, stores, logout, setWorkerStore, loginWorker } = useAuth();
  const { cart, orders } = useOrder();
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);
  const [pinInputModal, setPinInputModal] = useState<string | null>(null);
  const [pinError, setPinError] = useState<string | null>(null);
  const [enteredPin, setEnteredPin] = useState('');

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Active student orders count
  const studentActiveOrders = user && user.role === 'student'
    ? orders.filter(
        o =>
          (o.student_id === user.id || o.student_name === user.name) &&
          (o.status === 'pending' || o.status === 'preparing' || o.status === 'ready')
      ).length
    : 0;

  const handleStoreSwitchClick = (storeId: string) => {
    setShowStoreDropdown(false);
    if (user?.role === 'worker') {
      const targetStore = stores.find(s => s.id === storeId);
      if (targetStore && targetStore.id !== currentStore?.id) {
        setPinInputModal(targetStore.id);
        setEnteredPin('');
        setPinError(null);
      }
    }
  };

  const handleConfirmPinSwitch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInputModal) return;
    const targetStore = stores.find(s => s.id === pinInputModal);
    if (targetStore) {
      const res = loginWorker(targetStore.id, enteredPin);
      if (res.success) {
        setWorkerStore(targetStore.id);
        setPinInputModal(null);
      } else {
        setPinError(res.error || 'Incorrect PIN');
      }
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#f5f5f0]/90 backdrop-blur-md border-b border-[#5a5a401a] text-[#2d2d2a] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#5a5a40] rounded-full flex items-center justify-center text-white font-serif italic text-xl shadow-sm">
              B
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#5a5a40]">
                CampusBite
              </span>
              <span className="hidden sm:inline-block ml-2 px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-[#5a5a401a] text-[#5a5a40] border border-[#5a5a4022] rounded-full">
                Pre-Order
              </span>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-3">
            {/* Visual Theme Selector */}
            <ThemeSelector />

            {/* Schema SQL Button */}
            <button
              onClick={onOpenSqlModal}
              className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 rounded-full bg-[#e8e8df] hover:bg-[#d9d9cf] text-[#5a5a40] text-xs font-semibold transition-colors"
              title="View & copy Supabase SQL Database Schema"
            >
              <Code2 className="w-3.5 h-3.5 text-[#5a5a40]" />
              <span className="hidden lg:inline">Supabase SQL</span>
            </button>

            {user && (
              <>
                {user.role === 'worker' ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowStoreDropdown(!showStoreDropdown)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-full bg-[#e8e8df] text-[#5a5a40] hover:bg-[#d9d9cf] transition-all text-xs sm:text-sm font-medium border border-[#5a5a401a]"
                    >
                      <Store className="w-4 h-4 text-[#5a5a40]" />
                      <span>{currentStore?.name || 'Select Store'}</span>
                      <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                    </button>

                    {/* Store Dropdown */}
                    {showStoreDropdown && (
                      <div className="absolute right-0 mt-2 w-60 bg-[#fdfaf6] rounded-2xl border border-[#e8e8df] shadow-xl py-2 z-50">
                        <div className="px-4 py-1.5 text-[10px] font-bold text-[#8a8a70] uppercase tracking-wider">
                          Switch Store (Requires PIN)
                        </div>
                        {stores.map(st => (
                          <button
                            key={st.id}
                            onClick={() => handleStoreSwitchClick(st.id)}
                            className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-[#e8e8df]/60 transition-colors ${
                              currentStore?.id === st.id ? 'text-[#5a5a40] font-bold bg-[#e8e8df]/40' : 'text-[#2d2d2a]'
                            }`}
                          >
                            <span className="font-medium">{st.name}</span>
                            <span className="text-[10px] text-[#8a8a70] bg-[#e8e8df] px-2 py-0.5 rounded-full font-mono">
                              PIN: {st.pin}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="hidden xl:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#5a5a401a] text-[#5a5a40] border border-[#5a5a4022]">
                    <Sparkles className="w-3 h-3 mr-1 text-[#5a5a40]" /> Student Ordering
                  </span>
                )}

                {/* Student Cart & Orders buttons */}
                {user.role === 'student' && (
                  <>
                    <button
                      onClick={onOpenMyOrders}
                      className="relative flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#e8e8df] hover:bg-[#d9d9cf] text-[#5a5a40] text-xs sm:text-sm font-semibold transition-colors"
                    >
                      <Clock className="w-4 h-4 text-[#5a5a40]" />
                      <span className="hidden sm:inline">My Orders</span>
                      {studentActiveOrders > 0 && (
                        <span className="ml-1 px-2 py-0.5 text-[10px] font-bold bg-[#8b4513] text-white rounded-full">
                          {studentActiveOrders}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={onOpenCart}
                      className="relative flex items-center space-x-2 px-5 py-2 rounded-full bg-[#5a5a40] hover:bg-[#4a4a34] text-white font-semibold text-xs sm:text-sm shadow-sm transition-all active:scale-95"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Cart</span>
                      {cartItemCount > 0 && (
                        <span className="ml-1 px-2 py-0.5 text-xs font-bold bg-white text-[#5a5a40] rounded-full">
                          {cartItemCount}
                        </span>
                      )}
                    </button>
                  </>
                )}

                {/* User Profile / Logout */}
                <div className="flex items-center pl-2 border-l border-[#5a5a401a] space-x-2">
                  <div className="hidden sm:block text-right">
                    <div className="text-xs font-bold text-[#2d2d2a]">{user.name}</div>
                    <div className="text-[10px] font-semibold text-[#8a8a70] uppercase tracking-wider">{user.role}</div>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 rounded-full text-[#8a8a70] hover:text-[#8b4513] hover:bg-[#e8e8df] transition-colors"
                    title="Log out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* PIN Verification Modal for Switching Worker Store */}
      {pinInputModal && (
        <div className="fixed inset-0 z-50 bg-[#2d2d2a]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#e8e8df] rounded-[32px] max-w-md w-full p-6 sm:p-8 shadow-2xl text-[#2d2d2a]">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#5a5a401a] text-[#5a5a40] flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-[#3d3d3a]">Switch Store Verification</h3>
                <p className="text-xs text-[#8a8a70]">
                  Enter worker PIN for {stores.find(s => s.id === pinInputModal)?.name}
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmPinSwitch} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#8a8a70] uppercase tracking-wider mb-1">
                  4-Digit Store PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={enteredPin}
                  onChange={e => setEnteredPin(e.target.value)}
                  placeholder="e.g. 1111"
                  className="w-full px-4 py-3 rounded-2xl bg-[#fdfaf6] border border-[#e8e8df] text-center font-mono text-2xl tracking-widest text-[#5a5a40] focus:outline-none focus:border-[#5a5a40]"
                  autoFocus
                />
                <p className="text-[11px] text-[#8a8a70] mt-1.5">
                  Demo PIN for {stores.find(s => s.id === pinInputModal)?.name}:{' '}
                  <span className="font-mono text-[#5a5a40] font-bold">
                    {stores.find(s => s.id === pinInputModal)?.pin}
                  </span>
                </p>
              </div>

              {pinError && (
                <div className="p-3 rounded-xl bg-[#8b4513]/10 border border-[#8b4513]/30 text-[#8b4513] text-xs font-semibold">
                  {pinError}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPinInputModal(null)}
                  className="px-5 py-2.5 rounded-2xl text-xs font-semibold text-[#8a8a70] hover:text-[#2d2d2a] hover:bg-[#e8e8df]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl text-xs font-bold bg-[#5a5a40] text-white hover:opacity-90 transition-all shadow-sm"
                >
                  Verify & Switch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
