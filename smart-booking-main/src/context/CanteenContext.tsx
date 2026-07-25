import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  UserRole,
  FoodItem,
  CartItem,
  Order,
  OrderStatus,
  PaymentMethod,
  CategoryType,
  AuditLog
} from '../types';
import {
  INITIAL_FOOD_ITEMS,
  INITIAL_USERS,
  INITIAL_ORDERS,
  INITIAL_AUDIT_LOGS
} from '../data/initialData';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface CanteenContextType {
  // Auth & Roles
  currentUser: User;
  allUsers: User[];
  switchUserByRole: (role: UserRole) => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  loginUser: (email: string) => boolean;
  registerUser: (name: string, email: string, role: UserRole, department?: string) => void;

  // Menu Management
  menuItems: FoodItem[];
  addMenuItem: (item: Omit<FoodItem, 'id'>) => void;
  updateMenuItem: (id: string, updatedFields: Partial<FoodItem>) => void;
  updateStock: (id: string, newStock: number) => void;
  deleteMenuItem: (id: string) => void;

  // Cart Management
  cart: CartItem[];
  addToCart: (item: FoodItem, quantity?: number, customization?: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  couponCode: string;
  discountPercent: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Orders
  orders: Order[];
  placeOrder: (
    paymentMethod: PaymentMethod,
    specialInstructions?: string
  ) => { success: boolean; orderId?: string; pickupToken?: string; message: string };
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  cancelOrder: (orderId: string) => void;

  // Toast / Alerts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Audit Logs
  auditLogs: AuditLog[];
  logAction: (action: string, details: string) => void;

  // Reset to default seed data
  resetSystemData: () => void;
}

const CanteenContext = createContext<CanteenContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'foodzone_app_state_v1';

export const CanteenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial state from LocalStorage if available
  const getInitialState = () => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          users: parsed.users || INITIAL_USERS,
          currentUserId: parsed.currentUserId || INITIAL_USERS[0].id,
          menu: parsed.menu || INITIAL_FOOD_ITEMS,
          orders: parsed.orders || INITIAL_ORDERS,
          auditLogs: parsed.auditLogs || INITIAL_AUDIT_LOGS
        };
      }
    } catch (e) {
      console.error('Failed to load from localStorage', e);
    }
    return {
      users: INITIAL_USERS,
      currentUserId: INITIAL_USERS[0].id,
      menu: INITIAL_FOOD_ITEMS,
      orders: INITIAL_ORDERS,
      auditLogs: INITIAL_AUDIT_LOGS
    };
  };

  const initialState = getInitialState();

  const [allUsers, setAllUsers] = useState<User[]>(initialState.users);
  const [currentUser, setCurrentUser] = useState<User>(
    initialState.users.find((u: User) => u.id === initialState.currentUserId) || initialState.users[0]
  );
  const [menuItems, setMenuItems] = useState<FoodItem[]>(initialState.menu);
  const [orders, setOrders] = useState<Order[]>(initialState.orders);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialState.auditLogs);

  // Sync to local storage
  useEffect(() => {
    try {
      const stateToSave = {
        users: allUsers,
        currentUserId: currentUser.id,
        menu: menuItems,
        orders: orders,
        auditLogs: auditLogs
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [allUsers, currentUser, menuItems, orders, auditLogs]);

  // Toast Helpers
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Audit Logs
  const logAction = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      performedBy: `${currentUser.name} (${currentUser.role})`,
      action,
      details
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Auth & Role Switcher
  const switchUserByRole = (role: UserRole) => {
    const userWithRole = allUsers.find((u) => u.role === role);
    if (userWithRole) {
      setCurrentUser(userWithRole);
      showToast(`Switched view to ${userWithRole.name} (${role.toUpperCase()})`, 'info');
    } else {
      showToast(`No demo user found for role: ${role}`, 'error');
    }
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, role: newRole }));
    }
    const target = allUsers.find((u) => u.id === userId);
    logAction('Role Change', `Updated role for ${target?.name || userId} to ${newRole}`);
    showToast(`Role updated to ${newRole.toUpperCase()}`, 'success');
  };

  const loginUser = (email: string): boolean => {
    const found = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      showToast(`Welcome back, ${found.name}!`, 'success');
      return true;
    }
    showToast(`No account registered with ${email}`, 'error');
    return false;
  };

  const registerUser = (name: string, email: string, role: UserRole, department?: string) => {
    const newUser: User = {
      id: 'user-' + Date.now(),
      name,
      email,
      role,
      department: department || 'Campus Community',
      walletBalance: 200
    };
    setAllUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    logAction('User Registration', `New user registered: ${name} (${role})`);
    showToast(`Account created! Welcome to Food Zone, ${name}`, 'success');
  };

  // Menu Operations
  const addMenuItem = (itemData: Omit<FoodItem, 'id'>) => {
    const newItem: FoodItem = {
      ...itemData,
      id: 'food-' + Date.now()
    };
    setMenuItems((prev) => [newItem, ...prev]);
    logAction('Menu Addition', `Added item "${newItem.name}" to menu at ₹${newItem.price}`);
    showToast(`"${newItem.name}" added to menu!`, 'success');
  };

  const updateMenuItem = (id: string, updatedFields: Partial<FoodItem>) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
    const existing = menuItems.find((i) => i.id === id);
    logAction('Menu Update', `Updated details for "${existing?.name || id}"`);
    showToast(`Item updated successfully`, 'success');
  };

  const updateStock = (id: string, newStock: number) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stock: Math.max(0, newStock) } : item))
    );
    const item = menuItems.find((i) => i.id === id);
    logAction('Stock Adjustment', `Updated stock for "${item?.name}" to ${newStock}`);
    showToast(`Stock updated for ${item?.name || 'item'}`, 'info');
  };

  const deleteMenuItem = (id: string) => {
    const item = menuItems.find((i) => i.id === id);
    setMenuItems((prev) => prev.filter((i) => i.id !== id));
    logAction('Menu Removal', `Removed item "${item?.name}" from menu`);
    showToast(`"${item?.name}" removed from menu`, 'info');
  };

  // Cart Operations
  const addToCart = (item: FoodItem, quantity = 1, customization = '') => {
    if (item.stock < quantity) {
      showToast(`Sorry, only ${item.stock} ${item.name}(s) available in stock!`, 'error');
      return;
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (ci) => ci.item.id === item.id && ci.customization === customization
      );
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantity;
        if (newQty > item.stock) {
          showToast(`Cannot add more than total stock (${item.stock})`, 'error');
          return prevCart;
        }
        updated[existingIndex].quantity = newQty;
        return updated;
      } else {
        return [...prevCart, { item, quantity, customization }];
      }
    });

    showToast(`Added ${quantity}x "${item.name}" to your cart`, 'success');
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    const itemInMenu = menuItems.find((m) => m.id === itemId);
    if (itemInMenu && quantity > itemInMenu.stock) {
      showToast(`Stock limit reached (${itemInMenu.stock} available)`, 'error');
      return;
    }

    setCart((prev) =>
      prev.map((ci) => (ci.item.id === itemId ? { ...ci, quantity } : ci))
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.item.id !== itemId));
    showToast(`Item removed from cart`, 'info');
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    setDiscountPercent(0);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'CAMPUS10' || cleanCode === 'FOODZONE10') {
      setCouponCode(cleanCode);
      setDiscountPercent(10);
      showToast('10% Campus discount applied!', 'success');
      return { success: true, message: '10% discount applied!' };
    } else if (cleanCode === 'STAFF20' && (currentUser.role === 'staff' || currentUser.role === 'admin')) {
      setCouponCode(cleanCode);
      setDiscountPercent(20);
      showToast('20% Staff discount applied!', 'success');
      return { success: true, message: '20% Staff discount applied!' };
    } else {
      showToast('Invalid coupon code. Try CAMPUS10', 'error');
      return { success: false, message: 'Invalid or expired coupon code' };
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountPercent(0);
    showToast('Coupon removed', 'info');
  };

  // Order Placement & Management
  const placeOrder = (
    paymentMethod: PaymentMethod,
    specialInstructions = ''
  ) => {
    if (cart.length === 0) {
      return { success: false, message: 'Cart is empty!' };
    }

    // Verify stock for all cart items
    for (const ci of cart) {
      const currentFood = menuItems.find((m) => m.id === ci.item.id);
      if (!currentFood || currentFood.stock < ci.quantity) {
        showToast(`Stock insufficient for ${ci.item.name}`, 'error');
        return {
          success: false,
          message: `Stock changed for ${ci.item.name}. Please review cart.`
        };
      }
    }

    const subtotal = cart.reduce((acc, ci) => acc + ci.item.price * ci.quantity, 0);
    const discount = (subtotal * discountPercent) / 100;
    const tax = (subtotal - discount) * 0.05; // 5% GST/Tax
    const total = subtotal - discount + tax;

    // Deduct stock from menu items
    setMenuItems((prev) =>
      prev.map((food) => {
        const cartMatch = cart.find((c) => c.item.id === food.id);
        if (cartMatch) {
          return { ...food, stock: Math.max(0, food.stock - cartMatch.quantity) };
        }
        return food;
      })
    );

    // Generate pickup token (e.g., A45, B12)
    const tokenLetter = ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)];
    const tokenNum = Math.floor(Math.random() * 89) + 10;
    const pickupToken = `${tokenLetter}${tokenNum}`;

    const orderId = `FZ-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: orderId,
      pickupToken,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userRole: currentUser.role,
      items: [...cart],
      totalAmount: Math.round(total * 100) / 100,
      taxAmount: Math.round(tax * 100) / 100,
      discountAmount: Math.round(discount * 100) / 100,
      paymentMethod,
      paymentStatus: 'Paid',
      status: 'Placed',
      createdAt: new Date().toISOString(),
      estimatedMinutes: Math.max(10, Math.max(...cart.map((c) => c.item.preparationTime)) + 3),
      specialInstructions
    };

    setOrders((prev) => [newOrder, ...prev]);
    logAction('Order Placed', `Order ${orderId} (${pickupToken}) placed by ${currentUser.name}`);
    clearCart();

    return {
      success: true,
      orderId,
      pickupToken,
      message: 'Order placed successfully!'
    };
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    const order = orders.find((o) => o.id === orderId);
    logAction('Order Status Change', `Order ${orderId} marked as ${newStatus}`);
    showToast(`Order ${order?.pickupToken || orderId} status set to "${newStatus}"`, 'success');
  };

  const cancelOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    // Restore stock if cancelled early
    if (order.status === 'Placed' || order.status === 'Preparing') {
      setMenuItems((prev) =>
        prev.map((food) => {
          const matchedItem = order.items.find((i) => i.item.id === food.id);
          if (matchedItem) {
            return { ...food, stock: food.stock + matchedItem.quantity };
          }
          return food;
        })
      );
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'Cancelled' } : o))
    );
    logAction('Order Cancelled', `Order ${orderId} was cancelled`);
    showToast(`Order ${order.pickupToken || orderId} cancelled`, 'info');
  };

  const resetSystemData = () => {
    setAllUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setMenuItems(INITIAL_FOOD_ITEMS);
    setOrders(INITIAL_ORDERS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCart([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    showToast('System reset to default demo data', 'info');
  };

  return (
    <CanteenContext.Provider
      value={{
        currentUser,
        allUsers,
        switchUserByRole,
        updateUserRole,
        loginUser,
        registerUser,
        menuItems,
        addMenuItem,
        updateMenuItem,
        updateStock,
        deleteMenuItem,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        couponCode,
        discountPercent,
        applyCoupon,
        removeCoupon,
        orders,
        placeOrder,
        updateOrderStatus,
        cancelOrder,
        toasts,
        showToast,
        removeToast,
        auditLogs,
        logAction,
        resetSystemData
      }}
    >
      {children}
    </CanteenContext.Provider>
  );
};

export const useCanteen = () => {
  const context = useContext(CanteenContext);
  if (!context) {
    throw new Error('useCanteen must be used within a CanteenProvider');
  }
  return context;
};
