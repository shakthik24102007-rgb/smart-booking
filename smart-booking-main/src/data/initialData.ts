import { FoodItem, User, Order, AuditLog } from '../types';

export const INITIAL_FOOD_ITEMS: FoodItem[] = [
  {
    id: 'food-1',
    name: 'Chicken Biryani',
    category: 'Biryani & Rice',
    price: 150,
    isVeg: false,
    description: 'Fragrant basmati rice cooked with succulent chicken pieces, aromatic herbs, and authentic spices. Served with raita.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    stock: 25,
    preparationTime: 15,
    rating: 4.8,
    popular: true,
    calories: 520
  },
  {
    id: 'food-2',
    name: 'Veg Biryani',
    category: 'Biryani & Rice',
    price: 110,
    isVeg: true,
    description: 'A flavorful mix of fresh garden vegetables, paneer cubes, and saffron basmati rice layered with herbs.',
    image: 'https://images.unsplash.com/photo-1642821373181-696a54913e93?w=600&auto=format&fit=crop&q=80',
    stock: 20,
    preparationTime: 12,
    rating: 4.6,
    popular: true,
    calories: 410
  },
  {
    id: 'food-3',
    name: 'Veg Roll',
    category: 'Snacks & Rolls',
    price: 50,
    isVeg: true,
    description: 'Crispy flatbread stuffed with spiced crunchy shredded veggies, mint chutney, and tangy mayonnaise.',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
    stock: 35,
    preparationTime: 8,
    rating: 4.5,
    popular: true,
    calories: 280
  },
  {
    id: 'food-4',
    name: 'South Indian Coffee',
    category: 'Beverages',
    price: 20,
    isVeg: true,
    description: 'Authentic frothy filter coffee brewed fresh with rich roasted beans and steamed whole milk.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    stock: 50,
    preparationTime: 5,
    rating: 4.9,
    popular: true,
    calories: 120
  },
  {
    id: 'food-5',
    name: 'Chocolate Ice Cream',
    category: 'Desserts',
    price: 40,
    isVeg: true,
    description: 'Rich Belgian chocolate ice cream scoop topped with dark chocolate chips and fudge drizzle.',
    image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&auto=format&fit=crop&q=80',
    stock: 30,
    preparationTime: 3,
    rating: 4.7,
    popular: false,
    calories: 220
  },
  {
    id: 'food-6',
    name: 'Kothu Parotta',
    category: 'Snacks & Rolls',
    price: 30,
    isVeg: true,
    description: 'Flaky layered Malabar parotta chopped and tossed with spiced onion gravy and fresh curry leaves.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
    stock: 18,
    preparationTime: 10,
    rating: 4.6,
    popular: true,
    calories: 340
  },
  {
    id: 'food-7',
    name: 'Cheese Butter Maggi',
    category: 'Quick Bites',
    price: 40,
    isVeg: true,
    description: 'Hot piping noodles tossed with butter, secret campus spice mix, and melted cheddar cheese.',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80',
    stock: 40,
    preparationTime: 7,
    rating: 4.9,
    popular: true,
    calories: 310
  },
  {
    id: 'food-8',
    name: 'Crispy Chicken Nuggets',
    category: 'Quick Bites',
    price: 80,
    isVeg: false,
    description: '6 pieces of deep-fried golden chicken nuggets served with garlic mayo dip and tomato ketchup.',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80',
    stock: 15,
    preparationTime: 10,
    rating: 4.4,
    popular: true,
    calories: 380
  },
  {
    id: 'food-9',
    name: 'Paneer Butter Masala Roll',
    category: 'Snacks & Rolls',
    price: 75,
    isVeg: true,
    description: 'Soft cottage cheese cubes cooked in creamy tomato butter sauce rolled inside warm parotta.',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
    stock: 12,
    preparationTime: 10,
    rating: 4.7,
    popular: false,
    calories: 390
  },
  {
    id: 'food-10',
    name: 'Cold Coffee with Ice Cream',
    category: 'Beverages',
    price: 50,
    isVeg: true,
    description: 'Blended espresso with chilled milk, chocolate syrup, topped with a scoop of vanilla ice cream.',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80',
    stock: 22,
    preparationTime: 6,
    rating: 4.8,
    popular: true,
    calories: 260
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-student-1',
    name: 'Alex Sharma',
    email: 'alex.student@campus.edu',
    role: 'student',
    phone: '+91 98765 43210',
    department: 'Computer Science (B.Tech 3rd Yr)',
    rollNumber: '21CS1084',
    walletBalance: 450
  },
  {
    id: 'user-staff-1',
    name: 'Dr. Priya Ramesh',
    email: 'priya.ramesh@campus.edu',
    role: 'staff',
    phone: '+91 94432 11099',
    department: 'Electrical Engineering Dept.',
    walletBalance: 1200
  },
  {
    id: 'user-worker-1',
    name: 'Suresh Kumar',
    email: 'suresh.worker@foodzone.com',
    role: 'worker',
    phone: '+91 98840 55123',
    department: 'Canteen Kitchen Lead'
  },
  {
    id: 'user-admin-1',
    name: 'Rajesh V. (Canteen Manager)',
    email: 'admin@foodzone.com',
    role: 'admin',
    phone: '+91 98000 11223',
    department: 'Campus Food Operations Head'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'FZ-1082',
    pickupToken: 'A14',
    userId: 'user-student-1',
    userName: 'Alex Sharma',
    userEmail: 'alex.student@campus.edu',
    userRole: 'student',
    items: [
      {
        item: INITIAL_FOOD_ITEMS[0], // Chicken Biryani
        quantity: 1,
        customization: 'Extra raita please'
      },
      {
        item: INITIAL_FOOD_ITEMS[3], // Coffee
        quantity: 1
      }
    ],
    totalAmount: 170,
    taxAmount: 8.5,
    discountAmount: 0,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    status: 'Preparing',
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    estimatedMinutes: 8,
    specialInstructions: 'Less spicy biryani'
  },
  {
    id: 'FZ-1081',
    pickupToken: 'B08',
    userId: 'user-staff-1',
    userName: 'Dr. Priya Ramesh',
    userEmail: 'priya.ramesh@campus.edu',
    userRole: 'staff',
    items: [
      {
        item: INITIAL_FOOD_ITEMS[1], // Veg Biryani
        quantity: 1
      },
      {
        item: INITIAL_FOOD_ITEMS[2], // Veg Roll
        quantity: 2
      }
    ],
    totalAmount: 210,
    taxAmount: 10.5,
    discountAmount: 21,
    paymentMethod: 'Campus Wallet',
    paymentStatus: 'Paid',
    status: 'Ready for Pickup',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    estimatedMinutes: 0
  },
  {
    id: 'FZ-1079',
    pickupToken: 'C22',
    userId: 'user-student-1',
    userName: 'Alex Sharma',
    userEmail: 'alex.student@campus.edu',
    userRole: 'student',
    items: [
      {
        item: INITIAL_FOOD_ITEMS[6], // Maggi
        quantity: 2
      },
      {
        item: INITIAL_FOOD_ITEMS[9], // Cold Coffee
        quantity: 1
      }
    ],
    totalAmount: 130,
    taxAmount: 6.5,
    discountAmount: 0,
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    status: 'Completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    estimatedMinutes: 0
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    performedBy: 'Rajesh V. (Admin)',
    action: 'Stock Update',
    details: 'Increased Chicken Biryani stock count from 10 to 25'
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    performedBy: 'Rajesh V. (Admin)',
    action: 'Role Assignment',
    details: 'Assigned "worker" role to Suresh Kumar'
  }
];
