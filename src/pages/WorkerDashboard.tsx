import React, { useState } from 'react';
import { useCanteen } from '../context/CanteenContext';
import { OrderStatus, FoodItem, CategoryType } from '../types';
import {
  ChefHat,
  PackageCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Minus,
  Edit2,
  Trash2,
  Search,
  Filter,
  X,
  PlusCircle,
  Leaf,
  Layers,
  Utensils
} from 'lucide-react';

export const WorkerDashboard: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    menuItems,
    updateStock,
    updateMenuItem,
    addMenuItem,
    deleteMenuItem,
    showToast
  } = useCanteen();

  const [activeTab, setActiveTab] = useState<'orders' | 'inventory'>('orders');
  const [orderFilter, setOrderFilter] = useState<string>('active');
  const [orderSearch, setOrderSearch] = useState('');

  // Add Item Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<CategoryType>('Snacks & Rolls');
  const [newItemPrice, setNewItemPrice] = useState(50);
  const [newItemIsVeg, setNewItemIsVeg] = useState(true);
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemStock, setNewItemStock] = useState(20);
  const [newItemPrepTime, setNewItemPrepTime] = useState(10);
  const [newItemImage, setNewItemImage] = useState('');

  // Order Filtering
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.pickupToken.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.userName.toLowerCase().includes(orderSearch.toLowerCase());

    if (orderFilter === 'active') {
      return matchesSearch && (o.status === 'Placed' || o.status === 'Preparing' || o.status === 'Ready for Pickup');
    }
    if (orderFilter === 'Placed') return matchesSearch && o.status === 'Placed';
    if (orderFilter === 'Preparing') return matchesSearch && o.status === 'Preparing';
    if (orderFilter === 'Ready for Pickup') return matchesSearch && o.status === 'Ready for Pickup';
    if (orderFilter === 'Completed') return matchesSearch && o.status === 'Completed';

    return matchesSearch;
  });

  const handleAddNewItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) return;

    addMenuItem({
      name: newItemName,
      category: newItemCategory,
      price: Number(newItemPrice),
      isVeg: newItemIsVeg,
      description: newItemDescription || `${newItemName} cooked fresh at canteen counter.`,
      image:
        newItemImage ||
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      stock: Number(newItemStock),
      preparationTime: Number(newItemPrepTime),
      rating: 4.8,
      popular: false
    });

    setIsAddModalOpen(false);
    // Reset form
    setNewItemName('');
    setNewItemDescription('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-amber-950 text-white rounded-3xl p-6 shadow-md border border-amber-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-serif font-bold text-white">Canteen Worker Operations Portal</h1>
          </div>
          <p className="text-xs text-amber-200/80 mt-1">
            Manage incoming kitchen tickets, update cooking statuses, and monitor inventory levels
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-amber-900/60 p-1 rounded-2xl border border-amber-800/80">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders' ? 'bg-amber-500 text-amber-950 shadow-sm' : 'text-amber-200 hover:text-white'
            }`}
          >
            Live Kitchen Feed
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'inventory' ? 'bg-amber-500 text-amber-950 shadow-sm' : 'text-amber-200 hover:text-white'
            }`}
          >
            Menu & Stock Control
          </button>
        </div>
      </div>

      {/* Tab 1: Live Kitchen Order Feed */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { id: 'active', label: 'Active Queue' },
                { id: 'Placed', label: 'Placed (New)' },
                { id: 'Preparing', label: 'Preparing' },
                { id: 'Ready for Pickup', label: 'Ready' },
                { id: 'Completed', label: 'Completed' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setOrderFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    orderFilter === f.id
                      ? 'bg-amber-800 text-white shadow-xs'
                      : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search token or order ID..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Orders Grid */}
          {filteredOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className={`bg-white rounded-3xl border p-5 shadow-xs flex flex-col justify-between space-y-4 ${
                    order.status === 'Placed'
                      ? 'border-amber-400 ring-2 ring-amber-400/20'
                      : order.status === 'Preparing'
                      ? 'border-blue-400 bg-blue-50/20'
                      : order.status === 'Ready for Pickup'
                      ? 'border-emerald-400 bg-emerald-50/20'
                      : 'border-gray-200'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-3">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold block">
                          Token #{order.pickupToken} • Order {order.id}
                        </span>
                        <h3 className="font-serif font-bold text-base text-gray-900">{order.userName}</h3>
                        <p className="text-[11px] text-amber-800 font-medium">
                          {order.userRole.toUpperCase()} • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                          order.status === 'Placed'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : order.status === 'Preparing'
                            ? 'bg-blue-100 text-blue-900 border border-blue-300'
                            : order.status === 'Ready for Pickup'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    {/* Items List */}
                    <div className="py-3 space-y-1.5 text-xs text-gray-800">
                      <span className="font-bold text-gray-500 text-[10px] uppercase tracking-wider block">
                        Kitchen Ticket Items:
                      </span>
                      {order.items.map((ci, i) => (
                        <div key={i} className="flex justify-between items-center bg-gray-50 p-2 rounded-xl border border-gray-100">
                          <span className="font-semibold">
                            <span className="text-amber-800 font-bold">{ci.quantity}x</span> {ci.item.name}
                          </span>
                          {ci.customization && (
                            <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                              {ci.customization}
                            </span>
                          )}
                        </div>
                      ))}

                      {order.specialInstructions && (
                        <p className="text-[11px] text-rose-800 bg-rose-50 p-2 rounded-xl border border-rose-200 mt-2 font-medium">
                          <strong>Note:</strong> "{order.specialInstructions}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status Change Buttons */}
                  <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-1.5">
                    {order.status === 'Placed' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Preparing')}
                        className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-xs"
                      >
                        Start Preparing
                      </button>
                    )}

                    {order.status === 'Preparing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Ready for Pickup')}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs"
                      >
                        Mark Ready for Pickup
                      </button>
                    )}

                    {order.status === 'Ready for Pickup' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Completed')}
                        className="flex-1 py-2 bg-gray-900 hover:bg-black text-white font-bold rounded-xl text-xs shadow-xs"
                      >
                        Complete Order
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-gray-200 p-6">
              <p className="text-xs text-gray-500">No orders match the selected filter.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Menu & Stock Management */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-gray-900">
              Inventory & Menu Control ({menuItems.length} items)
            </h2>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-2xl shadow-xs flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" /> Add New Menu Item
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-amber-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-amber-950 text-amber-200 font-bold border-b border-amber-900">
                  <tr>
                    <th className="p-4">Food Item</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price (₹)</th>
                    <th className="p-4">Stock Count</th>
                    <th className="p-4">Stock Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                  {menuItems.map((item) => (
                    <tr key={item.id} className="hover:bg-amber-50/50 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-xl object-cover shrink-0 border border-gray-200"
                        />
                        <div>
                          <p className="font-bold text-gray-900">{item.name}</p>
                          <span className={`text-[10px] font-bold ${item.isVeg ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {item.isVeg ? 'Veg' : 'Non-Veg'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">{item.category}</td>
                      <td className="p-4 font-bold font-serif text-sm text-gray-900">₹{item.price}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateStock(item.id, item.stock - 1)}
                            className="w-6 h-6 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-bold"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-sm w-6 text-center">{item.stock}</span>
                          <button
                            onClick={() => updateStock(item.id, item.stock + 1)}
                            className="w-6 h-6 rounded-md bg-amber-500 hover:bg-amber-400 flex items-center justify-center text-amber-950 font-bold"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="p-4">
                        {item.stock <= 0 ? (
                          <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded text-[11px] font-bold">
                            Out of Stock
                          </span>
                        ) : item.stock <= 5 ? (
                          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[11px] font-bold">
                            Low Stock ({item.stock})
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[11px] font-bold">
                            In Stock ({item.stock})
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => deleteMenuItem(item.id)}
                          className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add New Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-amber-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-gray-900">Add New Food Item to Menu</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewItemSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samosa Chaat"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Category</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as CategoryType)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  >
                    <option value="Biryani & Rice">Biryani & Rice</option>
                    <option value="Snacks & Rolls">Snacks & Rolls</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Quick Bites">Quick Bites</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Initial Stock Count</label>
                  <input
                    type="number"
                    value={newItemStock}
                    onChange={(e) => setNewItemStock(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Prep Time (Mins)</label>
                  <input
                    type="number"
                    value={newItemPrepTime}
                    onChange={(e) => setNewItemPrepTime(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="isVeg"
                      checked={newItemIsVeg}
                      onChange={() => setNewItemIsVeg(true)}
                    />
                    <span>Vegetarian</span>
                  </label>
                  <label className="flex items-center gap-1.5 font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="isVeg"
                      checked={!newItemIsVeg}
                      onChange={() => setNewItemIsVeg(false)}
                    />
                    <span>Non-Vegetarian</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Image URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={newItemImage}
                  onChange={(e) => setNewItemImage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newItemDescription}
                  onChange={(e) => setNewItemDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 bg-gray-100 font-bold rounded-xl hover:bg-gray-200 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Add Item to Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
