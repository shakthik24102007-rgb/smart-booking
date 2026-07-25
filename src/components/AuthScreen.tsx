import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Store,
  Lock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  KeyRound,
  Utensils,
  CheckCircle2,
} from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { loginStudent, loginWorker, stores } = useAuth();
  const [activeTab, setActiveTab] = useState<'student' | 'worker'>('student');

  // Student Form State
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');

  // Worker Form State
  const [selectedStoreId, setSelectedStoreId] = useState(stores[0]?.id || '');
  const [workerPin, setWorkerPin] = useState('');
  const [workerError, setWorkerError] = useState<string | null>(null);

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginStudent(studentName || 'Campus Student', studentEmail);
  };

  const handleQuickStudentSelect = (name: string, email: string) => {
    loginStudent(name, email);
  };

  const handleWorkerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWorkerError(null);
    if (!workerPin) {
      setWorkerError('Please enter the 4-digit store PIN.');
      return;
    }
    const result = loginWorker(selectedStoreId, workerPin);
    if (!result.success) {
      setWorkerError(result.error || 'Authentication failed');
    }
  };

  const selectedStore = stores.find(s => s.id === selectedStoreId);

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-10 px-4 bg-[#f5f5f0]">
      <div className="max-w-xl w-full">
        
        {/* Header Hero Title */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-[#5a5a401a] border border-[#5a5a4022] text-[#5a5a40] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campus Pre-Ordering Platform</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold italic text-[#5a5a40] tracking-tight">
            Welcome to CampusBite
          </h1>
          <p className="text-sm text-[#8a8a70] max-w-md mx-auto leading-relaxed">
            Order ahead from your favorite campus canteens or manage store orders & daily revenue in real-time.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white border border-[#e8e8df] rounded-[32px] shadow-sm overflow-hidden">
          
          {/* Tabs header */}
          <div className="flex bg-[#e8e8df] p-1.5 rounded-full m-4">
            <button
              onClick={() => setActiveTab('student')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'student'
                  ? 'bg-[#5a5a40] text-white shadow-xs'
                  : 'text-[#5a5a40] hover:bg-[#d9d9cf]'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Login</span>
            </button>

            <button
              onClick={() => setActiveTab('worker')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'worker'
                  ? 'bg-[#5a5a40] text-white shadow-xs'
                  : 'text-[#5a5a40] hover:bg-[#d9d9cf]'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Canteen Worker Login</span>
            </button>
          </div>

          <div className="p-6 sm:p-8 pt-2">
            
            {/* STUDENT LOGIN FLOW */}
            {activeTab === 'student' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#3d3d3a] flex items-center">
                    <Utensils className="w-5 h-5 text-[#5a5a40] mr-2" />
                    Student Pre-Ordering Access
                  </h2>
                  <p className="text-xs text-[#8a8a70] mt-1">
                    Select a quick demo profile or enter your student details to browse food menus.
                  </p>
                </div>

                {/* Quick Demo Profiles */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-[#8a8a70] uppercase tracking-wider block">
                    ⚡ 1-Click Instant Demo Login:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { name: 'Alex Rivera', email: 'alex@campus.edu' },
                      { name: 'Sarah Chen', email: 'sarah@campus.edu' },
                      { name: 'David Kim', email: 'david@campus.edu' },
                    ].map(demo => (
                      <button
                        key={demo.name}
                        type="button"
                        onClick={() => handleQuickStudentSelect(demo.name, demo.email)}
                        className="px-3 py-2.5 rounded-2xl bg-[#fdfaf6] hover:bg-[#e8e8df] border border-[#e8e8df] text-left transition-all group"
                      >
                        <div className="text-xs font-bold text-[#2d2d2a] group-hover:text-[#5a5a40] transition-colors">
                          {demo.name.split(' ')[0]}
                        </div>
                        <div className="text-[10px] text-[#8a8a70] truncate">
                          Student
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-[#e8e8df]"></div>
                  <span className="flex-shrink mx-3 text-[10px] text-[#8a8a70] uppercase font-bold tracking-wider">
                    or enter custom student profile
                  </span>
                  <div className="flex-grow border-t border-[#e8e8df]"></div>
                </div>

                {/* Custom Student Form */}
                <form onSubmit={handleStudentSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#8a8a70] uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={e => setStudentName(e.target.value)}
                      placeholder="e.g. Maya Lin"
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#fdfaf6] border border-[#e8e8df] text-[#2d2d2a] placeholder-[#8a8a70] focus:outline-none focus:border-[#5a5a40] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#8a8a70] uppercase tracking-wider mb-1">
                      Campus Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={studentEmail}
                      onChange={e => setStudentEmail(e.target.value)}
                      placeholder="e.g. m.lin@university.edu"
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#fdfaf6] border border-[#e8e8df] text-[#2d2d2a] placeholder-[#8a8a70] focus:outline-none focus:border-[#5a5a40] text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-2xl bg-[#5a5a40] hover:opacity-90 text-white font-bold text-sm shadow-sm flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
                  >
                    <span>Enter Food Ordering Page</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* CANTEEN WORKER LOGIN FLOW */}
            {activeTab === 'worker' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#3d3d3a] flex items-center">
                    <ShieldCheck className="w-5 h-5 text-[#5a5a40] mr-2" />
                    Canteen Worker & Store Manager Login
                  </h2>
                  <p className="text-xs text-[#8a8a70] mt-1">
                    Select your campus store and enter your 4-digit security PIN.
                  </p>
                </div>

                {/* PIN Helper Reference Banner */}
                <div className="p-4 rounded-2xl bg-[#fdfaf6] border border-[#e8e8df] text-xs text-[#2d2d2a] space-y-1">
                  <div className="flex items-center font-bold text-[#5a5a40] mb-1">
                    <KeyRound className="w-3.5 h-3.5 mr-1.5" />
                    Demo Store PIN Credentials Reference:
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                    {stores.map(st => (
                      <div
                        key={st.id}
                        onClick={() => {
                          setSelectedStoreId(st.id);
                          setWorkerPin(st.pin);
                        }}
                        className="cursor-pointer bg-white p-2 rounded-xl border border-[#e8e8df] hover:border-[#5a5a40] flex items-center justify-between transition-colors"
                      >
                        <span className="text-[#2d2d2a] font-sans font-medium truncate">{st.name}:</span>
                        <span className="text-[#5a5a40] font-bold bg-[#5a5a401a] px-2 py-0.5 rounded-md">
                          {st.pin}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleWorkerSubmit} className="space-y-4">
                  {/* Store Selector */}
                  <div>
                    <label className="block text-xs font-bold text-[#8a8a70] uppercase tracking-wider mb-1.5">
                      Select Campus Store
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {stores.map(s => {
                        const isSelected = selectedStoreId === s.id;
                        return (
                          <div
                            key={s.id}
                            onClick={() => setSelectedStoreId(s.id)}
                            className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                              isSelected
                                ? 'bg-[#5a5a401a] border-[#5a5a40] text-[#5a5a40] font-bold'
                                : 'bg-[#fdfaf6] border-[#e8e8df] text-[#2d2d2a] hover:bg-[#e8e8df]/50'
                            }`}
                          >
                            <div>
                              <div className="text-xs">{s.name}</div>
                              <div className="text-[10px] text-[#8a8a70]">Code: #{s.code}</div>
                            </div>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-[#5a5a40]" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* PIN Input */}
                  <div>
                    <label className="block text-xs font-bold text-[#8a8a70] uppercase tracking-wider mb-1">
                      4-Digit Store Security PIN
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        maxLength={4}
                        required
                        value={workerPin}
                        onChange={e => setWorkerPin(e.target.value)}
                        placeholder="••••"
                        className="w-full px-4 py-3 rounded-2xl bg-[#fdfaf6] border border-[#e8e8df] text-[#5a5a40] font-mono text-center text-2xl tracking-widest focus:outline-none focus:border-[#5a5a40]"
                      />
                      <Lock className="w-4 h-4 text-[#8a8a70] absolute left-3.5 top-4" />
                    </div>
                  </div>

                  {workerError && (
                    <div className="p-3 rounded-2xl bg-[#8b4513]/10 border border-[#8b4513]/30 text-[#8b4513] text-xs font-semibold">
                      {workerError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-2xl bg-[#5a5a40] hover:opacity-90 text-white font-bold text-sm shadow-sm flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
                  >
                    <span>Access {selectedStore?.name || 'Store'} Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-[#8a8a70]">
          Campus Food Pre-Ordering • Real-time Supabase Sync Enabled
        </div>
      </div>
    </div>
  );
};
