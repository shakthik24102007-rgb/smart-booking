export type UserRole = 'student' | 'staff' | 'worker' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  department?: string;
  avatar?: string;
  rollNumber?: string;
  walletBalance?: number;
}

export type CategoryType = 
  | 'All'
  | 'Biryani & Rice'
  | 'Snacks & Rolls'
  | 'Beverages'
  | 'Quick Bites'
  | 'Desserts';

export interface FoodItem {
  id: string;
  name: string;
  category: CategoryType;
  price: number;
  isVeg: boolean;
  description: string;
  image: string;
  stock: number;
  preparationTime: number; // in minutes
  rating: number;
  popular?: boolean;
  calories?: number;
}

export interface CartItem {
  item: FoodItem;
  quantity: number;
  customization?: string;
}

export type OrderStatus = 'Placed' | 'Preparing' | 'Ready for Pickup' | 'Completed' | 'Cancelled';

export type PaymentMethod = 'UPI' | 'Card' | 'Campus Wallet' | 'Counter Cash';

export type PaymentStatus = 'Pending' | 'Paid' | 'Failed';

export interface Order {
  id: string;
  pickupToken: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  items: CartItem[];
  totalAmount: number;
  taxAmount: number;
  discountAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  createdAt: string;
  estimatedMinutes: number;
  specialInstructions?: string;
  canteenNote?: string;
}

export interface SystemStats {
  totalOrders: number;
  totalRevenue: number;
  activeOrdersCount: number;
  topSellingItems: { name: string; count: number }[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  performedBy: string;
  action: string;
  details: string;
}
