import React, { useState } from 'react';
import { useOrder } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { StoreSelector } from './StoreSelector';
import { FoodCard } from './FoodCard';
import { Order } from '../../types';
import {
  Search,
  Sparkles,
  Bell,
  X,
  Filter,
  CheckCircle2,
  Ban,
  UtensilsCrossed,
} from 'lucide-react';

interface StudentPageProps {
  onOpenCart: () => void;
  onOpenMyOrders: () => void;
  onSelectReceipt: (order: Order) => void;
}

export const StudentPage: React.FC<StudentPageProps> = ({
  onOpenCart,
  onOpenMyOrders,
  onSelectReceipt,
}) => {
  const {
    foodItems,
    cart,
    addToCart,
    activeStoreFilter,
    setActiveStoreFilter,
    activeOrderNotification,
    dismissNotification,
  } = useOrder();
  const { stores } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Extract all categories
  const categories = ['All', ...Array.from(new Set(foodItems.map(f => f.category)))];

  // Filter food items
  const filteredFoodItems = foodItems.filter(item => {
    const matchesStore = activeStoreFilter ? item.store_id === activeStoreFilter : true;
    const matchesCategory = selectedCategory === 'All' ? true : item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStore && matchesCategory && matchesSearch;
  });

  const cartFoodIds = new Set(cart.map(c => c.foodItem.id));
  const activeStore = stores.find(s => s.id === activeStoreFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Live Status Change Alert Toast Banner */}
      {activeOrderNotification && (
        <div className="p-4 rounded-2xl bg-[#5a5a401a] border border-[#5a5a40] text-[#5a5a40] flex items-center justify-between shadow-sm animate-bounce">
          <div className="flex items-center space-x-2 text-xs sm:text-sm font-bold">
            <Bell className="w-5 h-5 text-[#5a5a40] shrink-0" />
            <span>{activeOrderNotification}</span>
          </div>
          <button
            onClick={dismissNotification}
            className="p-1 rounded-lg hover:bg-[#5a5a4022] text-[#5a5a40]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Campus Stores Selector Header */}
      <StoreSelector
        stores={stores}
        selectedStoreId={activeStoreFilter}
        onSelectStore={setActiveStoreFilter}
      />

      {/* Food Browsing & Filter Bar */}
      <div className="space-y-4 pt-4 border-t border-[#e8e8df]">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#3d3d3a] flex items-center">
              <Sparkles className="w-5 h-5 text-[#5a5a40] mr-2" />
              {activeStore ? `${activeStore.name} Food Menu` : 'All Campus Food Items'}
            </h2>
            <p className="text-xs text-[#8a8a70] mt-0.5">
              {filteredFoodItems.length} items available for instant pre-order
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#8a8a70] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search burgers, smoothie, chai, pizza..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#fdfaf6] border border-[#e8e8df] text-xs text-[#2d2d2a] placeholder-[#8a8a70] focus:outline-none focus:border-[#5a5a40] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-[#8a8a70] hover:text-[#2d2d2a]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Categories Horizontal Filter Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none text-xs font-semibold">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#5a5a40] text-white font-bold shadow-xs'
                  : 'bg-[#e8e8df] text-[#5a5a40] hover:bg-[#d9d9cf]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Food Cards Grid */}
      {filteredFoodItems.length === 0 ? (
        <div className="bg-white border border-[#e8e8df] rounded-[32px] p-12 text-center space-y-3">
          <UtensilsCrossed className="w-12 h-12 text-[#8a8a70] mx-auto" />
          <h3 className="font-serif text-xl font-bold text-[#3d3d3a]">No Food Items Match Search</h3>
          <p className="text-xs text-[#8a8a70] max-w-sm mx-auto leading-relaxed">
            Try resetting your search query or choosing another category or store outlet.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setActiveStoreFilter(null);
            }}
            className="px-5 py-2.5 bg-[#5a5a40] text-white rounded-2xl text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFoodItems.map(item => {
            const itemStore = stores.find(s => s.id === item.store_id);
            return (
              <FoodCard
                key={item.id}
                item={item}
                store={itemStore}
                onAddToCart={addToCart}
                isInCart={cartFoodIds.has(item.id)}
              />
            );
          })}
        </div>
      )}

    </div>
  );
};
