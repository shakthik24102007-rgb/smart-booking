import React from 'react';
import { Store } from '../../types';
import { Star, Utensils, Sparkles } from 'lucide-react';

interface StoreSelectorProps {
  stores: Store[];
  selectedStoreId: string | null;
  onSelectStore: (storeId: string | null) => void;
}

export const StoreSelector: React.FC<StoreSelectorProps> = ({
  stores,
  selectedStoreId,
  onSelectStore,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#5a5a40] tracking-tight flex items-center">
            <Utensils className="w-5 h-5 text-[#5a5a40] mr-2" />
            Campus Canteens & Food Outlets
          </h2>
          <p className="text-xs sm:text-sm text-[#8a8a70] mt-0.5">
            Select a store to filter food items or browse all outlets.
          </p>
        </div>

        {selectedStoreId && (
          <button
            onClick={() => onSelectStore(null)}
            className="text-xs text-[#8b4513] hover:underline font-bold"
          >
            Clear Store Filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* All Outlets Option */}
        <div
          onClick={() => onSelectStore(null)}
          className={`cursor-pointer rounded-[24px] p-5 border transition-all duration-200 flex flex-col justify-between ${
            selectedStoreId === null
              ? 'bg-[#5a5a401a] border-[#5a5a40] text-[#5a5a40] shadow-sm'
              : 'bg-white hover:bg-[#fdfaf6] border-[#e8e8df] text-[#2d2d2a]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5a5a40] flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1" /> Campus Wide
              </span>
              <span className="text-[10px] bg-[#5a5a40] text-white font-mono px-2.5 py-0.5 rounded-full font-bold">
                4 Stores
              </span>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#3d3d3a]">All Food Outlets</h3>
            <p className="text-xs text-[#8a8a70] mt-1 line-clamp-2 leading-relaxed">
              Browse complete campus menu across Buddy Foods, Hydret Spot, RKM, and Retro.
            </p>
          </div>
          <div className="mt-4 text-xs font-bold text-[#5a5a40] flex items-center">
            View All Outlets &rarr;
          </div>
        </div>

        {/* 4 Distinct Campus Stores */}
        {stores.map(store => {
          const isSelected = selectedStoreId === store.id;
          return (
            <div
              key={store.id}
              onClick={() => onSelectStore(store.id)}
              className={`cursor-pointer rounded-[24px] overflow-hidden border transition-all duration-200 group flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-[#5a5a40] ring-2 ring-[#5a5a4022] shadow-md'
                  : 'bg-white hover:bg-[#fdfaf6] border-[#e8e8df]'
              }`}
            >
              <div className="relative h-28 overflow-hidden">
                <img
                  src={store.image}
                  alt={store.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-[#e8e8df] flex items-center space-x-1 text-xs font-bold text-[#5a5a40]">
                  <Star className="w-3 h-3 fill-[#5a5a40] text-[#5a5a40]" />
                  <span>{store.rating_avg.toFixed(1)}</span>
                </div>
                <div className="absolute bottom-2 left-3">
                  <span className="text-[10px] font-mono font-bold bg-[#5a5a40] text-white px-2 py-0.5 rounded-md">
                    #{store.code}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white mt-0.5 drop-shadow-sm">{store.name}</h3>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-[#8a8a70] line-clamp-2 leading-relaxed">{store.description}</p>
                <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-[#5a5a40] pt-2 border-t border-[#e8e8df]">
                  <span>Browse Menu</span>
                  <span className="text-[#8a8a70] font-mono font-normal">PIN: {store.pin}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
