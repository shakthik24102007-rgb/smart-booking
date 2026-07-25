import React, { useState } from 'react';
import { useOrder } from '../../context/OrderContext';
import { FoodItem } from '../../types';
import {
  Package,
  CheckCircle2,
  Ban,
  Plus,
  X,
  Star,
  Tag,
  DollarSign,
  Edit2,
  Check,
  Image as ImageIcon,
} from 'lucide-react';

interface StockControlProps {
  storeId: string;
}

export const StockControl: React.FC<StockControlProps> = ({ storeId }) => {
  const { foodItems, toggleStock, addNewFoodItem, updateFoodPrice } = useOrder();
  const [showAddModal, setShowAddModal] = useState(false);

  // Price Editing state
  const [editingPriceItemId, setEditingPriceItemId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');

  // New Food Item Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Snacks');
  const [image, setImage] = useState('');

  // Filter food items belonging to this store
  const storeFoodItems = foodItems.filter(f => f.store_id === storeId);

  const handleToggleStock = async (itemId: string) => {
    await toggleStock(itemId);
  };

  const startPriceEdit = (item: FoodItem) => {
    setEditingPriceItemId(item.id);
    setTempPrice(item.price.toString());
  };

  const savePriceEdit = async (itemId: string) => {
    const parsed = parseFloat(tempPrice);
    if (!isNaN(parsed) && parsed > 0) {
      await updateFoodPrice(itemId, parsed);
    }
    setEditingPriceItemId(null);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    await addNewFoodItem({
      store_id: storeId,
      name,
      description: description || 'Delicious item prepared fresh daily.',
      price: parseFloat(price) || 120,
      category,
      image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      is_sold_out: false,
    });

    setShowAddModal(false);
    setName('');
    setDescription('');
    setPrice('');
    setImage('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#3d3d3a] flex items-center">
            <Package className="w-5 h-5 text-[#5a5a40] mr-2" />
            Stock Control & Menu Inventory
          </h2>
          <p className="text-xs text-[#8a8a70] mt-0.5">
            Instantly toggle item availability or add new items to your canteen menu.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="py-2.5 px-4 rounded-2xl bg-[#5a5a40] hover:opacity-90 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Menu Item</span>
        </button>
      </div>

      {/* Food Items Inventory Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {storeFoodItems.map(item => (
          <div
            key={item.id}
            className={`p-5 rounded-[24px] bg-white border transition-all flex flex-col justify-between space-y-4 ${
              item.is_sold_out
                ? 'border-[#8b4513]/30 opacity-75'
                : 'border-[#e8e8df]'
            }`}
          >
            <div className="flex items-start space-x-3">
              <img
                src={item.image}
                alt={item.name}
                className={`w-16 h-16 rounded-2xl object-cover border ${
                  item.is_sold_out ? 'border-[#8b4513]/40 grayscale' : 'border-[#e8e8df]'
                }`}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#8a8a70] font-mono">
                    {item.category}
                  </span>
                  
                  {editingPriceItemId === item.id ? (
                    <div className="flex items-center space-x-1">
                      <span className="text-xs font-bold text-[#5a5a40]">₹</span>
                      <input
                        type="number"
                        step="1"
                        autoFocus
                        value={tempPrice}
                        onChange={e => setTempPrice(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') savePriceEdit(item.id);
                          if (e.key === 'Escape') setEditingPriceItemId(null);
                        }}
                        className="w-16 px-1.5 py-0.5 text-xs font-mono font-extrabold text-[#5a5a40] bg-[#fdfaf6] border border-[#5a5a40] rounded-md focus:outline-none"
                      />
                      <button
                        onClick={() => savePriceEdit(item.id)}
                        className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md"
                        title="Save Price"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startPriceEdit(item)}
                      className="group/price flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-[#5a5a401a] hover:bg-[#5a5a4022] text-[#5a5a40] transition-colors"
                      title="Click to change food price"
                    >
                      <span className="text-xs font-extrabold font-mono">
                        ₹{item.price.toFixed(2)}
                      </span>
                      <Edit2 className="w-3 h-3 opacity-60 group-hover/price:opacity-100" />
                    </button>
                  )}
                </div>

                <h3 className="font-serif font-bold text-[#3d3d3a] text-base truncate mt-0.5">
                  {item.name}
                </h3>

                <div className="flex items-center space-x-1 text-[11px] text-[#8a8a70] mt-1">
                  <Star className="w-3 h-3 fill-[#5a5a40] text-[#5a5a40]" />
                  <span>{item.rating_avg.toFixed(1)} ({item.rating_count})</span>
                </div>
              </div>
            </div>

            {/* Toggle Stock Switch */}
            <div className="pt-3 border-t border-[#e8e8df] flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                {item.is_sold_out ? (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#8b4513]/10 text-[#8b4513] border border-[#8b4513]/30 flex items-center">
                    <Ban className="w-3 h-3 mr-1" /> Sold Out
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#5a5a401a] text-[#5a5a40] border border-[#5a5a4033] flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> In Stock
                  </span>
                )}
              </div>

              <button
                onClick={() => handleToggleStock(item.id)}
                className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all ${
                  item.is_sold_out
                    ? 'bg-[#5a5a40] hover:opacity-90 text-white'
                    : 'bg-[#8b4513]/10 hover:bg-[#8b4513]/20 text-[#8b4513] border border-[#8b4513]/30'
                }`}
              >
                {item.is_sold_out ? 'Mark Available' : 'Set as Sold Out'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#2d2d2a]/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-[#e8e8df] rounded-[32px] max-w-md w-full p-6 sm:p-8 shadow-2xl text-[#2d2d2a] relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-[#8a8a70] hover:text-[#2d2d2a] hover:bg-[#e8e8df]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl font-bold text-[#3d3d3a] mb-1">Add New Menu Item</h3>
            <p className="text-xs text-[#8a8a70] mb-5">
              Create a new food or beverage item for your campus store.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#8a8a70] uppercase tracking-wider mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Cheesy Garlic Breadstick"
                  className="w-full p-3 rounded-2xl bg-[#fdfaf6] border border-[#e8e8df] text-xs text-[#2d2d2a] placeholder-[#8a8a70] focus:outline-none focus:border-[#5a5a40]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#8a8a70] uppercase tracking-wider mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="120"
                    className="w-full p-3 rounded-2xl bg-[#fdfaf6] border border-[#e8e8df] text-xs text-[#2d2d2a] font-mono placeholder-[#8a8a70] focus:outline-none focus:border-[#5a5a40]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#8a8a70] uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-[#fdfaf6] border border-[#e8e8df] text-xs text-[#2d2d2a] focus:outline-none focus:border-[#5a5a40]"
                  >
                    <option value="Snacks">Snacks</option>
                    <option value="Burgers">Burgers</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8a8a70] uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Brief appetizing ingredients or summary..."
                  className="w-full p-3 rounded-2xl bg-[#fdfaf6] border border-[#e8e8df] text-xs text-[#2d2d2a] placeholder-[#8a8a70] focus:outline-none focus:border-[#5a5a40] h-20 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8a8a70] uppercase tracking-wider mb-1">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-3 rounded-2xl bg-[#fdfaf6] border border-[#e8e8df] text-xs text-[#2d2d2a] placeholder-[#8a8a70] focus:outline-none focus:border-[#5a5a40]"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-[#8a8a70] hover:bg-[#e8e8df]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-[#5a5a40] text-white font-bold text-xs hover:opacity-90 transition-all shadow-xs"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
