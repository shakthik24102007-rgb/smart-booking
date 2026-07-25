import React, { useState } from 'react';
import { FoodItem } from '../types';
import { useCanteen } from '../context/CanteenContext';
import { Clock, Star, Plus, Minus, Check, Flame, Sliders, AlertTriangle } from 'lucide-react';

interface FoodCardProps {
  item: FoodItem;
  onOpenDetail?: (item: FoodItem) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item, onOpenDetail }) => {
  const { cart, addToCart, updateCartQuantity } = useCanteen();

  const cartMatch = cart.find((c) => c.item.id === item.id);
  const currentCartQty = cartMatch ? cartMatch.quantity : 0;

  const isOutOfStock = item.stock <= 0;
  const isLowStock = item.stock > 0 && item.stock <= 5;

  return (
    <div
      id={`food-card-${item.id}`}
      className={`group bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md ${
        isOutOfStock
          ? 'border-gray-200 opacity-75 grayscale-[20%]'
          : 'border-amber-100 hover:border-amber-300'
      }`}
    >
      <div>
        {/* Card Header Image & Badges */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-amber-50">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Veg / Non-Veg Indicator */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg shadow-sm border border-gray-200 flex items-center gap-1.5 text-xs font-semibold">
            <span
              className={`w-3 h-3 rounded-full flex items-center justify-center border ${
                item.isVeg ? 'border-emerald-600' : 'border-rose-600'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                }`}
              />
            </span>
            <span className={item.isVeg ? 'text-emerald-800' : 'text-rose-800'}>
              {item.isVeg ? 'Veg' : 'Non-Veg'}
            </span>
          </div>

          {/* Popular Tag */}
          {item.popular && (
            <div className="absolute top-3 right-3 bg-amber-500 text-amber-950 font-bold text-[11px] px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
              <Flame className="w-3 h-3 fill-amber-950" />
              <span>Popular</span>
            </div>
          )}

          {/* Stock Badge Overlay */}
          <div className="absolute bottom-3 left-3">
            {isOutOfStock ? (
              <span className="bg-rose-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="bg-amber-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow flex items-center gap-1 animate-pulse">
                Only {item.stock} left!
              </span>
            ) : (
              <span className="bg-emerald-800/80 backdrop-blur-sm text-emerald-100 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-600/50">
                {item.stock} in stock
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-serif font-bold text-lg text-gray-900 group-hover:text-amber-800 transition-colors leading-snug">
              {item.name}
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 bg-amber-50 text-amber-800 rounded-md shrink-0 border border-amber-200">
              {item.category}
            </span>
          </div>

          <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">
            {item.description}
          </p>

          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{item.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>{item.preparationTime} mins prep</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Price & Add Button */}
      <div className="p-4 pt-0 border-t border-gray-100 mt-2 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-medium">
            Price
          </span>
          <span className="text-xl font-bold text-gray-900 font-serif">
            ₹{item.price}
          </span>
        </div>

        <div>
          {isOutOfStock ? (
            <button
              disabled
              className="px-4 py-2 bg-gray-100 text-gray-400 rounded-xl text-xs font-semibold cursor-not-allowed border border-gray-200"
            >
              Unavailable
            </button>
          ) : currentCartQty > 0 ? (
            <div className="flex items-center gap-2 bg-amber-100 border border-amber-300 rounded-xl p-1">
              <button
                onClick={() => updateCartQuantity(item.id, currentCartQty - 1)}
                className="w-7 h-7 rounded-lg bg-white text-amber-900 font-bold flex items-center justify-center hover:bg-amber-200 transition-colors shadow-xs"
                title="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm font-bold text-amber-950 px-1">
                {currentCartQty}
              </span>
              <button
                onClick={() => updateCartQuantity(item.id, currentCartQty + 1)}
                className="w-7 h-7 rounded-lg bg-amber-500 text-amber-950 font-bold flex items-center justify-center hover:bg-amber-400 transition-colors shadow-xs"
                title="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              {onOpenDetail && (
                <button
                  onClick={() => onOpenDetail(item)}
                  className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors"
                  title="Customize item"
                >
                  <Sliders className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => addToCart(item, 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-sm transition-all transform active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
