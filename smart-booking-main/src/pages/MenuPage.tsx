import React, { useState, useMemo } from 'react';
import { useCanteen } from '../context/CanteenContext';
import { FoodCard } from '../components/FoodCard';
import { FoodItem, CategoryType } from '../types';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Flame,
  Leaf,
  Check,
  Utensils,
  ArrowUpDown
} from 'lucide-react';

interface MenuPageProps {
  onOpenDetail: (item: FoodItem) => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({ onOpenDetail }) => {
  const { menuItems } = useCanteen();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'nonveg'>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'rating' | 'prepTime'>('recommended');

  const categories: CategoryType[] = [
    'All',
    'Biryani & Rice',
    'Snacks & Rolls',
    'Beverages',
    'Quick Bites',
    'Desserts'
  ];

  const filteredItems = useMemo(() => {
    return menuItems
      .filter((item) => {
        // Search query match
        const matchesSearch =
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase());

        // Category match
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

        // Dietary match
        const matchesDiet =
          dietaryFilter === 'all' ||
          (dietaryFilter === 'veg' && item.isVeg) ||
          (dietaryFilter === 'nonveg' && !item.isVeg);

        // Stock filter
        const matchesStock = !inStockOnly || item.stock > 0;

        return matchesSearch && matchesCategory && matchesDiet && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'prepTime') return a.preparationTime - b.preparationTime;
        // recommended (popular first, then in stock)
        return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      });
  }, [menuItems, search, selectedCategory, dietaryFilter, inStockOnly, sortBy]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-amber-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-1">
            Fresh Canteen Menu
          </span>
          <h1 className="text-3xl font-serif font-bold text-white">Food Zone Menu Grid</h1>
          <p className="text-xs text-amber-200/80 mt-1">
            Filter by dietary choice, check stock status, and add directly to your cart
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search items (Biryani, Maggi, Roll)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-amber-900/60 text-white placeholder-amber-200/60 rounded-2xl border border-amber-700/60 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-xs space-y-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary Filters: Veg / Non-Veg, Stock, Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Veg/Non-Veg Toggle Pills */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
              <button
                onClick={() => setDietaryFilter('all')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  dietaryFilter === 'all' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setDietaryFilter('veg')}
                className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                  dietaryFilter === 'veg' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700'
                }`}
              >
                <Leaf className="w-3 h-3" /> Veg Only
              </button>
              <button
                onClick={() => setDietaryFilter('nonveg')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  dietaryFilter === 'nonveg' ? 'bg-rose-600 text-white shadow-xs' : 'text-rose-700'
                }`}
              >
                Non-Veg
              </button>
            </div>

            {/* In Stock Only Checkbox */}
            <label className="flex items-center gap-2 px-3 py-1.5 bg-amber-50/60 rounded-xl border border-amber-200/60 cursor-pointer select-none font-semibold text-amber-900">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-3.5 h-3.5 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
              />
              <span>In Stock Only</span>
            </label>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-xl font-bold text-gray-800 focus:ring-2 focus:ring-amber-500"
            >
              <option value="recommended">Recommended / Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="prepTime">Fastest Preparation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Menu Results Count */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <span>
          Showing <strong>{filteredItems.length}</strong> items in menu
        </span>
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-amber-700 font-bold hover:underline"
          >
            Clear search "{search}"
          </button>
        )}
      </div>

      {/* Food Cards Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <FoodCard key={item.id} item={item} onOpenDetail={onOpenDetail} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300 p-8 space-y-3">
          <Utensils className="w-12 h-12 text-amber-400 mx-auto opacity-50" />
          <h3 className="font-serif font-bold text-lg text-gray-900">No Food Items Match Your Filter</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try resetting your search filters or switching categories to see available dishes.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
              setDietaryFilter('all');
              setInStockOnly(false);
            }}
            className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors shadow-xs"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
