export type UserRole = 'student' | 'worker';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email?: string;
  pin?: string;
  store_id?: string;
}

export interface Store {
  id: string;
  name: 'Buddy Foods' | 'Hydret Spot' | 'RKM' | 'Retro' | string;
  code: 'BF' | 'HS' | 'RKM' | 'RT' | string;
  pin: string;
  image: string;
  description: string;
  rating_avg: number;
}

export interface FoodItem {
  id: string;
  store_id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  is_sold_out: boolean;
  rating_avg: number;
  rating_count: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface OrderItem {
  id: string;
  order_id?: string;
  food_item_id: string;
  food_name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  order_number: string;
  student_id: string;
  student_name: string;
  store_id: string;
  store_name?: string;
  status: OrderStatus;
  total_amount: number;
  notes?: string;
  created_at: string;
  updated_at?: string;
  items: OrderItem[];
}

export interface Rating {
  id: string;
  student_id: string;
  store_id: string;
  food_item_id?: string;
  rating: number; // 1-5
  review?: string;
  created_at: string;
}

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
  notes?: string;
}

export interface AnalyticsSummary {
  totalSalesToday: number;
  totalOrdersCompleted: number;
  totalOrdersCancelled: number;
  totalOrdersPending: number;
  popularItems: {
    food_name: string;
    quantity: number;
    totalRevenue: number;
  }[];
}
