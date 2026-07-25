import React, { useState } from 'react';
import { FoodItem } from '../types';
import { useCanteen } from '../context/CanteenContext';
import { X, Plus, Minus, Clock, Flame, ShieldCheck, Heart } from 'lucide-react';

interface FoodDetailModalProps {
  item: FoodItem | null;
  onClose: () => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  const { addToCart } = useCanteen();
  const [quantity, setQuantity] = useState(1);
  const [selectedSpiciness, setSelectedSpiciness] = useState('Medium Spice');
  const [extraSauce, setExtraSauce] = useState(false);
  const [customNote, setCustomNote] = useState('');

  const handleAdd = () => {
    let customString = selectedSpiciness;
    if (extraSauce) customString += ', Extra Sauce';
    if (customNote.trim()) customString += `, "${customNote.trim()}"`;

    addToCart(item, quantity, customString);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-amber-100 flex flex-col max-h-[90vh]">
        {/* Header Image */}
        <div className="relative h-48 bg-amber-50">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold">
            {item.category}
          </div>
        </div>

        {/* Item Details */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-serif font-bold text-gray-900">{item.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${item.isVeg ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                  {item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {item.preparationTime} mins
                </span>
              </div>
            </div>
            <span className="text-2xl font-serif font-bold text-amber-800">
              ₹{item.price * quantity}
            </span>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>

          {/* Customization Options */}
          <div className="border-t border-gray-100 pt-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Spice Level
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {['Mild Spice', 'Medium Spice', 'Extra Spicy'].map((spice) => (
                <button
                  key={spice}
                  type="button"
                  onClick={() => setSelectedSpiciness(spice)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    selectedSpiciness === spice
                      ? 'bg-amber-500 text-amber-950 border-amber-600 font-bold shadow-xs'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {spice}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={extraSauce}
                  onChange={(e) => setExtraSauce(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-gray-300"
                />
                <span className="font-medium">Add Extra Mayo / Chutney Dip (+₹10)</span>
              </label>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Special Kitchen Instructions
              </label>
              <input
                type="text"
                placeholder="e.g., Less salt, serve hot, extra spoon"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-amber-50/50 border-t border-amber-100 flex items-center justify-between">
          <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-1 shadow-xs">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-lg bg-gray-100 font-bold flex items-center justify-center hover:bg-gray-200 text-gray-700"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-bold text-sm text-gray-900 w-6 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(item.stock, quantity + 1))}
              className="w-8 h-8 rounded-lg bg-amber-500 font-bold flex items-center justify-center hover:bg-amber-400 text-amber-950"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 ml-4 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2"
          >
            <span>Add to Cart</span>
            <span>•</span>
            <span>₹{item.price * quantity + (extraSauce ? 10 * quantity : 0)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
