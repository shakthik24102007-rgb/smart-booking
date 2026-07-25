import React, { useState } from 'react';
import { useCanteen } from '../context/CanteenContext';
import { WorkerDashboard } from './WorkerDashboard';
import { UserRole } from '../types';
import {
  ShieldAlert,
  Users,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  FileText,
  UserCheck,
  UserPlus,
  BarChart3,
  Search,
  CheckCircle2,
  Lock,
  ChevronRight
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    allUsers,
    updateUserRole,
    orders,
    menuItems,
    auditLogs,
    currentUser
  } = useCanteen();

  const [adminTab, setAdminTab] = useState<'kitchen' | 'users' | 'analytics'>('kitchen');
  const [userSearch, setUserSearch] = useState('');

  // Analytics Math
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const totalOrdersCount = orders.length;
  const activeOrdersCount = orders.filter(
    (o) => o.status === 'Placed' || o.status === 'Preparing' || o.status === 'Ready for Pickup'
  ).length;

  // Top Selling Items Math
  const itemSalesMap: { [key: string]: number } = {};
  orders.forEach((o) => {
    if (o.status !== 'Cancelled') {
      o.items.forEach((ci) => {
        itemSalesMap[ci.item.name] = (itemSalesMap[ci.item.name] || 0) + ci.quantity;
      });
    }
  });

  const topSellingList = Object.entries(itemSalesMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const filteredUsers = allUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Admin Header */}
      <div className="bg-purple-950 text-white rounded-3xl p-6 shadow-xl border border-purple-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-serif font-bold text-white">Chief Canteen Admin Portal</h1>
          </div>
          <p className="text-xs text-purple-200/80 mt-1">
            System oversight, user role access control, lifetime revenue analytics & kitchen management
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-purple-900/60 p-1 rounded-2xl border border-purple-800/80">
          <button
            onClick={() => setAdminTab('kitchen')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              adminTab === 'kitchen' ? 'bg-purple-500 text-purple-950 shadow-sm' : 'text-purple-200 hover:text-white'
            }`}
          >
            Kitchen & Inventory
          </button>
          <button
            onClick={() => setAdminTab('users')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              adminTab === 'users' ? 'bg-purple-500 text-purple-950 shadow-sm' : 'text-purple-200 hover:text-white'
            }`}
          >
            User Roles ({allUsers.length})
          </button>
          <button
            onClick={() => setAdminTab('analytics')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              adminTab === 'analytics' ? 'bg-purple-500 text-purple-950 shadow-sm' : 'text-purple-200 hover:text-white'
            }`}
          >
            System Oversight
          </button>
        </div>
      </div>

      {/* Tab 1: Kitchen & Inventory View (Delegates to Worker View) */}
      {adminTab === 'kitchen' && <WorkerDashboard />}

      {/* Tab 2: User Access & Role Management */}
      {adminTab === 'users' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-xs flex items-center justify-between gap-4">
            <div>
              <h2 className="font-serif font-bold text-lg text-gray-900">User Role Management</h2>
              <p className="text-xs text-gray-500">Assign or revoke permissions for Canteen Workers, Staff, and Admins</p>
            </div>

            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search user or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-purple-950 text-purple-200 font-bold border-b border-purple-900">
                  <tr>
                    <th className="p-4">User Details</th>
                    <th className="p-4">Department / Roll</th>
                    <th className="p-4">Current Role</th>
                    <th className="p-4">Change Role Permission</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-purple-50/40 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-900 font-bold flex items-center justify-center text-sm border border-purple-200">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{u.name}</p>
                          <p className="text-[11px] text-gray-500">{u.email}</p>
                        </div>
                      </td>
                      <td className="p-4">{u.department || 'N/A'}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-900 border border-purple-300'
                              : u.role === 'worker'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : u.role === 'staff'
                              ? 'bg-blue-100 text-blue-900 border border-blue-300'
                              : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit border border-gray-200">
                          {(['student', 'staff', 'worker', 'admin'] as UserRole[]).map((r) => (
                            <button
                              key={r}
                              onClick={() => updateUserRole(u.id, r)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                                u.role === r
                                  ? 'bg-purple-950 text-white shadow-xs'
                                  : 'text-gray-600 hover:text-gray-900'
                              }`}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: System Analytics & Audit Logs */}
      {adminTab === 'analytics' && (
        <div className="space-y-6">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Total System Revenue
              </span>
              <span className="text-2xl font-serif font-black text-purple-950">
                ₹{totalRevenue.toFixed(2)}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold block">+12% from yesterday</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Total Orders Placed
              </span>
              <span className="text-2xl font-serif font-black text-gray-900">
                {totalOrdersCount}
              </span>
              <span className="text-[10px] text-gray-500 font-medium block">Across all categories</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Active Kitchen Queue
              </span>
              <span className="text-2xl font-serif font-black text-amber-600">
                {activeOrdersCount}
              </span>
              <span className="text-[10px] text-amber-700 font-bold block">Orders currently in prep</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Registered Users
              </span>
              <span className="text-2xl font-serif font-black text-gray-900">
                {allUsers.length}
              </span>
              <span className="text-[10px] text-purple-700 font-bold block">Students, Staff & Workers</span>
            </div>
          </div>

          {/* Top Sellers & Audit Trail */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Top Selling Items */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-lg text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" /> Top Selling Food Items
              </h3>

              <div className="space-y-3">
                {topSellingList.map(([name, qty], idx) => (
                  <div key={name} className="flex items-center justify-between bg-purple-50/50 p-3 rounded-2xl border border-purple-100 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-purple-950 text-white font-bold flex items-center justify-center text-xs">
                        #{idx + 1}
                      </span>
                      <span className="font-bold text-gray-900">{name}</span>
                    </div>
                    <span className="font-mono font-bold text-purple-950">{qty} orders sold</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Log Trail */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-lg text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" /> System Audit Trail Logs
              </h3>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-xs space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-gray-400">
                      <span className="font-bold text-purple-800">{log.performedBy}</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="font-bold text-gray-900">{log.action}</p>
                    <p className="text-gray-600">{log.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
