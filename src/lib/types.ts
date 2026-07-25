export type OrderStatus = "pending" | "received" | "preparing" | "ready" | "completed" | "cancelled";

export interface Shop {
  id: string;
  name: string;
  code: string;
  emoji: string;
  tagline: string;
  isOpen: boolean;
}

export interface MenuItem {
  id: string;
  shopId: string;
  name: string;
  price: number;
  category: string;
  available: boolean;
  isVeg: boolean;
}

export interface Student {
  id: string;
  name: string;
  password: string | null;
}

export interface Staff {
  id: string;
  shopId: string;
  username: string;
  password: string;
  name: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  studentId: string;
  studentName: string;
  shopId: string;
  items: OrderItem[];
  pickupTime: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  readyMessage: string | null;
  reviewed: boolean;
}

export interface Review {
  id: string;
  shopId: string;
  studentId: string;
  studentName: string;
  orderId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  studentId: string;
  orderId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Database {
  shops: Shop[];
  menuItems: MenuItem[];
  students: Student[];
  staff: Staff[];
  orders: Order[];
  reviews: Review[];
  notifications: Notification[];
}

export interface SessionStudent {
  type: "student";
  id: string;
  name: string;
}

export interface SessionStaff {
  type: "staff";
  id: string;
  name: string;
  shopId: string;
  shopName: string;
  shopCode: string;
}

export type Session = SessionStudent | SessionStaff;
