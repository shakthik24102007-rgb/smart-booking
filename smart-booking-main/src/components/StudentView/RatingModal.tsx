import React, { useState } from 'react';
import { useOrder } from '../../context/OrderContext';
import { Order } from '../../types';
import { X, Star, Sparkles, CheckCircle2 } from 'lucide-react';

interface RatingModalProps {
  order: Order | null;
  onClose: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({ order, onClose }) => {
  const { submitRating } = useOrder();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [selectedFoodId, setSelectedFoodId] = useState<string>(order?.items[0]?.food_item_id || '');
  const [submitted, setSubmitted] = useState(false);

  if (!order) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitRating(order.store_id, rating, review, selectedFoodId || undefined);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2d2d2a]/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-[#e8e8df] rounded-[32px] max-w-md w-full p-6 sm:p-8 shadow-2xl text-[#2d2d2a] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#8a8a70] hover:text-[#2d2d2a] hover:bg-[#e8e8df]"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="w-14 h-14 text-[#5a5a40] mx-auto animate-bounce" />
            <h3 className="font-serif text-xl font-bold text-[#3d3d3a]">Thank You for Your Feedback!</h3>
            <p className="text-xs text-[#8a8a70]">
              Your rating has been submitted to {order.store_name}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-2xl bg-[#5a5a401a] text-[#5a5a40] flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#3d3d3a]">Rate Your Food Experience</h3>
              <p className="text-xs text-[#8a8a70]">{order.store_name} • Order {order.order_number}</p>
            </div>

            {/* Select Food Item */}
            {order.items.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-[#8a8a70] uppercase tracking-wider mb-1.5">
                  Select Item to Rate
                </label>
                <select
                  value={selectedFoodId}
                  onChange={e => setSelectedFoodId(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-[#fdfaf6] border border-[#e8e8df] text-xs text-[#2d2d2a] focus:outline-none focus:border-[#5a5a40]"
                >
                  <option value="">Overall Store Rating ({order.store_name})</option>
                  {order.items.map(it => (
                    <option key={it.food_item_id} value={it.food_item_id}>
                      {it.food_name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Star Selector */}
            <div className="text-center space-y-2">
              <label className="block text-xs font-bold text-[#8a8a70] uppercase tracking-wider">
                Star Rating
              </label>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map(star => {
                  const active = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          active
                            ? 'fill-[#5a5a40] text-[#5a5a40]'
                            : 'text-[#e8e8df]'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Review text */}
            <div>
              <label className="block text-xs font-bold text-[#8a8a70] uppercase tracking-wider mb-1">
                Feedback / Review (Optional)
              </label>
              <textarea
                value={review}
                onChange={e => setReview(e.target.value)}
                placeholder="How was the food quality, speed, and taste?"
                className="w-full p-3 rounded-2xl bg-[#fdfaf6] border border-[#e8e8df] text-xs text-[#2d2d2a] placeholder-[#8a8a70] focus:outline-none focus:border-[#5a5a40] h-20 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-[#5a5a40] hover:opacity-90 text-white font-bold text-xs shadow-sm transition-all"
            >
              Submit Rating & Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
