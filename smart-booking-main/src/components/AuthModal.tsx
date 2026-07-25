import React, { useState } from 'react';
import { useCanteen } from '../context/CanteenContext';
import { UserRole } from '../types';
import { X, User, Lock, Mail, ShieldAlert, ChefHat, Sparkles, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { allUsers, loginUser, registerUser, currentUser } = useCanteen();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [department, setDepartment] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUser(email)) {
      onClose();
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    registerUser(name, email, role, department);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-amber-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="bg-amber-950 text-white p-6 pb-8 text-center relative overflow-hidden">
          <div className="w-12 h-12 bg-amber-500 text-amber-950 rounded-2xl flex items-center justify-center mx-auto font-bold text-xl mb-2 shadow-md">
            FZ
          </div>
          <h2 className="font-serif font-bold text-xl">Campus Food Zone Access</h2>
          <p className="text-xs text-amber-300 mt-0.5">Order ahead, skip lines & track real-time food status</p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {/* Quick Preset Selectors for Testing */}
          <div className="mb-6 p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs">
            <span className="font-bold text-amber-900 block mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Quick Demo Profiles:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {allUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    loginUser(u.email);
                    onClose();
                  }}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    currentUser.id === u.id
                      ? 'bg-amber-500 text-amber-950 border-amber-600 font-bold'
                      : 'bg-white text-gray-800 border-gray-200 hover:border-amber-300'
                  }`}
                >
                  <span className="block font-bold truncate">{u.name}</span>
                  <span className="text-[10px] opacity-80 uppercase tracking-wider">{u.role}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex border-b border-gray-200 mb-4">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-xs font-bold border-b-2 text-center transition-all ${
                mode === 'login' ? 'border-amber-600 text-amber-800' : 'border-transparent text-gray-400'
              }`}
            >
              Log In Existing User
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 text-xs font-bold border-b-2 text-center transition-all ${
                mode === 'register' ? 'border-amber-600 text-amber-800' : 'border-transparent text-gray-400'
              }`}
            >
              Create New Account
            </button>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Campus Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="alex.student@campus.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl transition-colors shadow-xs text-xs flex items-center justify-center gap-1.5"
              >
                <span>Log In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sam Wilson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Campus Email</label>
                <input
                  type="email"
                  required
                  placeholder="sam.wilson@campus.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Select Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'student', label: 'Student' },
                    { id: 'staff', label: 'Academic Staff' },
                    { id: 'worker', label: 'Canteen Staff' },
                    { id: 'admin', label: 'Admin' }
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id as UserRole)}
                      className={`p-2 rounded-xl text-center border font-semibold ${
                        role === r.id
                          ? 'bg-amber-500 text-amber-950 border-amber-600 font-bold'
                          : 'bg-gray-50 border-gray-200 text-gray-700'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Department / Roll No.</label>
                <input
                  type="text"
                  placeholder="e.g. Mechanical Engineering"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl transition-colors shadow-xs text-xs mt-2"
              >
                Register & Start Ordering
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
