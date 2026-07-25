import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { FoodItem, Order, OrderStatus, CartItem, Rating, AnalyticsSummary } from '../types';
import { INITIAL_FOOD_ITEMS, INITIAL_STORES } from '../lib/initialData';
import { supabase, isSupabaseConfigured, syncChannel } from '../lib/supabase';
import { useAuth } from './AuthContext';
import {
  TimeSlot,
  NextSlotInfo,
  ORDERING_TIME_SLOTS,
  getCurrentOrderingSlot,
  getNextOrderingSlot,
  getSecondsRemainingInSlot,
} from '../lib/timeUtils';

interface OrderContextType {
  foodItems: FoodItem[];
  orders: Order[];
  cart: CartItem[];
  activeStoreFilter: string | null;
  setActiveStoreFilter: (storeId: string | null) => void;
  addToCart: (item: FoodItem, quantity?: number) => void;
  removeFromCart: (foodItemId: string) => void;
  updateCartQuantity: (foodItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  placeOrder: (storeId: string, notes?: string) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  toggleStock: (foodItemId: string) => Promise<void>;
  addNewFoodItem: (item: Omit<FoodItem, 'id' | 'rating_avg' | 'rating_count'>) => Promise<void>;
  updateFoodPrice: (foodItemId: string, newPrice: number) => Promise<void>;
  submitRating: (storeId: string, ratingNumber: number, review?: string, foodItemId?: string) => Promise<void>;
  getAnalyticsForStore: (storeId: string) => AnalyticsSummary;
  activeOrderNotification: string | null;
  dismissNotification: () => void;
  
  // Real-time Ordering Time Window state & helpers
  isOrderingOpen: boolean;
  currentSlot: TimeSlot | null;
  nextSlotInfo: NextSlotInfo;
  timeRemainingInSlot: number;
  effectiveTime: Date;
  simulatedPreset: string;
  setSimulatedPreset: (preset: string) => void;
  orderingTimeSlots: TimeSlot[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const FOOD_ITEMS_KEY = 'campus_food_items_v1';
const ORDERS_KEY = 'campus_food_orders_v1';
const COUNTER_KEY = 'campus_food_counters_v1';

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [activeStoreFilter, setActiveStoreFilter] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeOrderNotification, setActiveOrderNotification] = useState<string | null>(null);

  // Initialize Food Items from LocalStorage / Default Data
  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => {
    try {
      const saved = localStorage.getItem(FOOD_ITEMS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_FOOD_ITEMS;
    } catch {
      return INITIAL_FOOD_ITEMS;
    }
  });

  // Initialize Sample Mock Orders if none exist
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_KEY);
      if (saved) return JSON.parse(saved);
      
      // Default initial mock orders for vibrant dashboard experience
      const sampleOrders: Order[] = [
        {
          id: 'ord-sample-1',
          order_number: '#BF-1041',
          student_id: 'sample-student-1',
          student_name: 'Alex Rivera',
          store_id: 'store-bf-01',
          store_name: 'Buddy Foods',
          status: 'ready',
          total_amount: 15.74,
          notes: 'Extra spicy sauce on the fries please!',
          created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
          items: [
            { id: 'oi-1', food_item_id: 'bf-item-1', food_name: 'Double Smash Cheeseburger', quantity: 1, price: 8.99 },
            { id: 'oi-2', food_item_id: 'bf-item-2', food_name: 'Crispy Chicken Loaded Fries', quantity: 1, price: 6.75 },
          ]
        },
        {
          id: 'ord-sample-2',
          order_number: '#HS-1018',
          student_id: 'sample-student-2',
          student_name: 'Sarah Chen',
          store_id: 'store-hs-02',
          store_name: 'Hydret Spot',
          status: 'preparing',
          total_amount: 10.84,
          notes: 'Less ice in the boba tea',
          created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          items: [
            { id: 'oi-3', food_item_id: 'hs-item-1', food_name: 'Dragonfruit Acai Energy Smoothie', quantity: 1, price: 5.99 },
            { id: 'oi-4', food_item_id: 'hs-item-2', food_name: 'Brown Sugar Taro Boba Tea', quantity: 1, price: 4.85 },
          ]
        },
        {
          id: 'ord-sample-3',
          order_number: '#RKM-1025',
          student_id: 'sample-student-3',
          student_name: 'David Kim',
          store_id: 'store-rkm-03',
          store_name: 'RKM',
          status: 'completed',
          total_amount: 10.49,
          notes: '',
          created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          items: [
            { id: 'oi-5', food_item_id: 'rkm-item-1', food_name: 'Hyderabadi Dum Chicken/Veg Biryani', quantity: 1, price: 8.50 },
            { id: 'oi-6', food_item_id: 'rkm-item-4', food_name: 'Kulhad Elaichi Masala Chai', quantity: 1, price: 1.99 },
          ]
        }
      ];
      return sampleOrders;
    } catch {
      return [];
    }
  });

  // Persist Local State Changes
  useEffect(() => {
    localStorage.setItem(FOOD_ITEMS_KEY, JSON.stringify(foodItems));
  }, [foodItems]);

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  // Sync state with Supabase if credentials present
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const fetchSupabaseData = async () => {
      try {
        const { data: remoteFoods } = await supabase.from('food_items').select('*');
        if (remoteFoods && remoteFoods.length > 0) {
          setFoodItems(remoteFoods as FoodItem[]);
        }

        const { data: remoteOrders } = await supabase.from('orders').select('*, items:order_items(*)');
        if (remoteOrders && remoteOrders.length > 0) {
          setOrders(remoteOrders as Order[]);
        }
      } catch (err) {
        console.warn('Supabase fetch notice (using local store fallback):', err);
      }
    };

    fetchSupabaseData();

    // Subscribe to real-time order changes in Supabase
    const channel = supabase
      .channel('campus_orders_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchSupabaseData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Multi-tab sync channel handler
  useEffect(() => {
    if (!syncChannel) return;

    const handleBroadcast = (event: MessageEvent) => {
      const { type, payload } = event.data || {};
      if (type === 'FOOD_ITEMS_UPDATED') {
        setFoodItems(payload);
      } else if (type === 'ORDERS_UPDATED') {
        setOrders(payload);
      } else if (type === 'ORDER_STATUS_CHANGED') {
        setOrders(payload.orders);
        if (user && user.id === payload.studentId) {
          setActiveOrderNotification(`Order ${payload.orderNumber} is now: ${payload.status.toUpperCase()}`);
        }
      }
    };

    syncChannel.addEventListener('message', handleBroadcast);
    return () => syncChannel.removeEventListener('message', handleBroadcast);
  }, [user]);

  const dismissNotification = () => setActiveOrderNotification(null);

  // Cart Management
  const addToCart = (item: FoodItem, quantity: number = 1) => {
    if (item.is_sold_out) return;
    setCart(prev => {
      const existing = prev.find(c => c.foodItem.id === item.id);
      if (existing) {
        return prev.map(c =>
          c.foodItem.id === item.id ? { ...c, quantity: c.quantity + quantity } : c
        );
      }
      return [...prev, { foodItem: item, quantity }];
    });
  };

  const removeFromCart = (foodItemId: string) => {
    setCart(prev => prev.filter(c => c.foodItem.id !== foodItemId));
  };

  const updateCartQuantity = (foodItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(foodItemId);
      return;
    }
    setCart(prev =>
      prev.map(c => (c.foodItem.id === foodItemId ? { ...c, quantity } : c))
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce(
    (sum, c) => sum + c.foodItem.price * c.quantity,
    0
  );

  // Sequential Order Number Generator
  const getNextOrderNumber = (storeCode: string): string => {
    try {
      const raw = localStorage.getItem(COUNTER_KEY);
      const counters = raw ? JSON.parse(raw) : { BF: 1042, HS: 1019, RKM: 1026, RT: 1012 };
      const current = counters[storeCode] || 1001;
      counters[storeCode] = current + 1;
      localStorage.setItem(COUNTER_KEY, JSON.stringify(counters));
      return `#${storeCode}-${current}`;
    } catch {
      return `#${storeCode}-${Math.floor(1000 + Math.random() * 9000)}`;
    }
  };

  // Place Order Action
  const placeOrder = async (storeId: string, notes?: string): Promise<Order> => {
    if (cart.length === 0) throw new Error('Cart is empty');
    
    const store = INITIAL_STORES.find(s => s.id === storeId);
    const storeCode = store?.code || 'ORD';
    const storeName = store?.name || 'Campus Canteen';
    const orderNumber = getNextOrderNumber(storeCode);

    const newOrder: Order = {
      id: 'ord-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      order_number: orderNumber,
      student_id: user?.id || 'guest-student',
      student_name: user?.name || 'Guest Student',
      store_id: storeId,
      store_name: storeName,
      status: 'pending',
      total_amount: cartTotal,
      notes: notes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: cart.map(c => ({
        id: 'oi-' + Math.random().toString(36).substring(2, 7),
        food_item_id: c.foodItem.id,
        food_name: c.foodItem.name,
        quantity: c.quantity,
        price: c.foodItem.price,
      })),
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    clearCart();

    // Broadcast change
    if (syncChannel) {
      syncChannel.postMessage({ type: 'ORDERS_UPDATED', payload: updatedOrders });
    }

    // Attempt Supabase persist
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('orders').insert({
          id: newOrder.id,
          order_number: newOrder.order_number,
          student_id: newOrder.student_id,
          student_name: newOrder.student_name,
          store_id: newOrder.store_id,
          status: newOrder.status,
          total_amount: newOrder.total_amount,
          notes: newOrder.notes,
        });

        await supabase.from('order_items').insert(
          newOrder.items.map(item => ({
            order_id: newOrder.id,
            food_item_id: item.food_item_id,
            food_name: item.food_name,
            quantity: item.quantity,
            price: item.price,
          }))
        );
      } catch (err) {
        console.warn('Supabase insert note:', err);
      }
    }

    return newOrder;
  };

  // Update Order Status
  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const updatedOrders = orders.map(ord =>
      ord.id === orderId
        ? { ...ord, status, updated_at: new Date().toISOString() }
        : ord
    );
    setOrders(updatedOrders);

    const targetOrder = orders.find(o => o.id === orderId);

    if (syncChannel && targetOrder) {
      syncChannel.postMessage({
        type: 'ORDER_STATUS_CHANGED',
        payload: {
          orders: updatedOrders,
          studentId: targetOrder.student_id,
          orderNumber: targetOrder.order_number,
          status,
        },
      });
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('orders')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', orderId);
      } catch (err) {
        console.warn('Supabase status update note:', err);
      }
    }
  };

  // Cancel Active Order
  const cancelOrder = async (orderId: string) => {
    await updateOrderStatus(orderId, 'cancelled');
  };

  // Toggle Stock ("Available" / "Sold Out")
  const toggleStock = async (foodItemId: string) => {
    const updatedFoods = foodItems.map(item =>
      item.id === foodItemId ? { ...item, is_sold_out: !item.is_sold_out } : item
    );
    setFoodItems(updatedFoods);

    if (syncChannel) {
      syncChannel.postMessage({ type: 'FOOD_ITEMS_UPDATED', payload: updatedFoods });
    }

    if (isSupabaseConfigured && supabase) {
      const target = updatedFoods.find(f => f.id === foodItemId);
      if (target) {
        try {
          await supabase
            .from('food_items')
            .update({ is_sold_out: target.is_sold_out })
            .eq('id', foodItemId);
        } catch (err) {
          console.warn('Supabase toggle error:', err);
        }
      }
    }
  };

  // Add New Food Item (Worker Feature)
  const addNewFoodItem = async (newItem: Omit<FoodItem, 'id' | 'rating_avg' | 'rating_count'>) => {
    const created: FoodItem = {
      ...newItem,
      id: 'food-' + Date.now(),
      rating_avg: 5.0,
      rating_count: 1,
    };
    const updated = [...foodItems, created];
    setFoodItems(updated);

    if (syncChannel) {
      syncChannel.postMessage({ type: 'FOOD_ITEMS_UPDATED', payload: updated });
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('food_items').insert(created);
      } catch (err) {
        console.warn('Supabase insert food item note:', err);
      }
    }
  };

  // Update Food Price (Worker Feature)
  const updateFoodPrice = async (foodItemId: string, newPrice: number) => {
    if (newPrice <= 0) return;
    const updated = foodItems.map(item =>
      item.id === foodItemId ? { ...item, price: newPrice } : item
    );
    setFoodItems(updated);

    if (syncChannel) {
      syncChannel.postMessage({ type: 'FOOD_ITEMS_UPDATED', payload: updated });
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('food_items')
          .update({ price: newPrice })
          .eq('id', foodItemId);
      } catch (err) {
        console.warn('Supabase update price note:', err);
      }
    }
  };

  // Submit Rating for Store / Food
  const submitRating = async (
    storeId: string,
    ratingNumber: number,
    review?: string,
    foodItemId?: string
  ) => {
    if (foodItemId) {
      setFoodItems(prev =>
        prev.map(f => {
          if (f.id === foodItemId) {
            const count = f.rating_count + 1;
            const newAvg = Number(((f.rating_avg * f.rating_count + ratingNumber) / count).toFixed(1));
            return { ...f, rating_avg: newAvg, rating_count: count };
          }
          return f;
        })
      );
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('ratings').insert({
          student_id: user?.id,
          store_id: storeId,
          food_item_id: foodItemId,
          rating: ratingNumber,
          review,
        });
      } catch (err) {
        console.warn('Supabase rating insert note:', err);
      }
    }
  };

  // Daily Accounting & Analytics for Worker Dashboard
  const getAnalyticsForStore = useCallback(
    (storeId: string): AnalyticsSummary => {
      const storeOrders = orders.filter(o => o.store_id === storeId);
      
      const totalSalesToday = storeOrders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + o.total_amount, 0);

      const totalOrdersCompleted = storeOrders.filter(o => o.status === 'completed').length;
      const totalOrdersCancelled = storeOrders.filter(o => o.status === 'cancelled').length;
      const totalOrdersPending = storeOrders.filter(o => o.status === 'pending' || o.status === 'preparing').length;

      // Calculate popular items
      const itemMap: Record<string, { food_name: string; quantity: number; totalRevenue: number }> = {};

      storeOrders
        .filter(o => o.status !== 'cancelled')
        .forEach(o => {
          o.items.forEach(it => {
            if (!itemMap[it.food_name]) {
              itemMap[it.food_name] = { food_name: it.food_name, quantity: 0, totalRevenue: 0 };
            }
            itemMap[it.food_name].quantity += it.quantity;
            itemMap[it.food_name].totalRevenue += it.quantity * it.price;
          });
        });

      const popularItems = Object.values(itemMap)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      return {
        totalSalesToday,
        totalOrdersCompleted,
        totalOrdersCancelled,
        totalOrdersPending,
        popularItems,
      };
    },
    [orders]
  );

  return (
    <OrderContext.Provider
      value={{
        foodItems,
        orders,
        cart,
        activeStoreFilter,
        setActiveStoreFilter,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        placeOrder,
        updateOrderStatus,
        cancelOrder,
        toggleStock,
        addNewFoodItem,
        updateFoodPrice,
        submitRating,
        getAnalyticsForStore,
        activeOrderNotification,
        dismissNotification,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
