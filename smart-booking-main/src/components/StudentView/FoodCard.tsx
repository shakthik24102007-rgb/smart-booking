import React from 'react';
import { FoodItem, Store } from '../../types';
import { Star, Plus, Ban, Check } from 'lucide-react';

interface FoodCardProps {
  item: FoodItem;
  store?: Store;
  onAddToCart: (item: FoodItem) => void;
  isInCart: boolean;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  item,
  store,
  onAddToCart,
  isInCart,
}) => {
  return (
    <div
      className={`rounded-[24px] border transition-all duration-200 overflow-hidden flex flex-col justify-between bg-white ${
        item.is_sold_out
          ? 'border-[#8b4513]/30 opacity-75'
          : 'border-[#e8e8df] hover:border-[#5a5a40] hover:shadow-md'
      }`}
    >
      <div>
        {/* Card Image Header */}
        <div className="relative h-44 overflow-hidden bg-[#e8e8df]">
          <img
            src={item.image}
            alt={item.name}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              item.is_sold_out ? 'grayscale filter brightness-75' : 'hover:scale-105'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

          {/* Category Badge */}
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-[#e8e8df] text-[11px] font-bold text-[#5a5a40]">
            {item.category}
          </div>

          {/* Store Name Badge */}
          {store && (
            <div className="absolute top-2 right-2 bg-[#5a5a40] text-white backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold">
              {store.name}
            </div>
          )}

          {/* Sold Out Overlay Badge */}
          {item.is_sold_out && (
            <div className="absolute inset-0 bg-[#2d2d2a]/60 backdrop-blur-[2px] flex items-center justify-center p-2">
              <span className="px-3 py-1.5 rounded-full bg-[#8b4513] text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center space-x-1">
                <Ban className="w-4 h-4 mr-1" /> Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-serif font-bold text-[#3d3d3a] text-lg leading-snug line-clamp-1">
              {item.name}
            </h3>
            <span className="text-base font-extrabold text-[#5a5a40] font-mono ml-2">
              ₹{item.price.toFixed(2)}
            </span>
          </div>

          <p className="text-xs text-[#8a8a70] line-clamp-2 min-h-[32px] leading-relaxed">
            {item.description}
          </p>

          {/* Rating */}
          <div className="flex items-center space-x-1 text-xs text-[#8a8a70] pt-1">
            <Star className="w-3.5 h-3.5 fill-[#5a5a40] text-[#5a5a40]" />
            <span className="font-bold text-[#2d2d2a]">{item.rating_avg.toFixed(1)}</span>
            <span>({item.rating_count} reviews)</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 pt-0">
        <button
          onClick={() => onAddToCart(item)}
          disabled={item.is_sold_out}
          className={`w-full py-2.5 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
            item.is_sold_out
              ? 'bg-[#e8e8df] text-[#8a8a70] cursor-not-allowed border border-[#d9d9cf]'
              : isInCart
              ? 'bg-[#5a5a401a] text-[#5a5a40] border border-[#5a5a4033] hover:bg-[#5a5a402a]'
              : 'bg-[#5a5a40] hover:opacity-90 text-white shadow-xs active:scale-95'
          }`}
        >
          {item.is_sold_out ? (
            <>
              <Ban className="w-3.5 h-3.5" />
              <span>Unavailable (Sold Out)</span>
            </>
          ) : isInCart ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#5a5a40]" />
              <span>Added to Cart (+1)</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Pre-Order</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
