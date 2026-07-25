import bcrypt from "bcryptjs";
import type { Database } from "./types";

export function getSeedData(): Database {
  const passwordHash = bcrypt.hashSync("demo123", 10);
  const staffHash = bcrypt.hashSync("staff123", 10);

  return {
    shops: [
      {
        id: "shop1",
        name: "Pizza Corner",
        code: "SHOP001",
        emoji: "🍕",
        tagline: "Wood-fired pizzas & garlic bread",
        isOpen: true,
      },
      {
        id: "shop2",
        name: "Burger Hub",
        code: "SHOP002",
        emoji: "🍔",
        tagline: "Juicy burgers & crispy fries",
        isOpen: true,
      },
      {
        id: "shop3",
        name: "Juice Bar",
        code: "SHOP003",
        emoji: "🥤",
        tagline: "Fresh juices, smoothies & shakes",
        isOpen: true,
      },
      {
        id: "shop4",
        name: "Desi Delights",
        code: "SHOP004",
        emoji: "🍛",
        tagline: "Biryani, thali & home-style meals",
        isOpen: true,
      },
    ],
    menuItems: [
      { id: "m1", shopId: "shop1", name: "Margherita Pizza", price: 120, category: "Pizza", available: true, isVeg: true },
      { id: "m2", shopId: "shop1", name: "Pepperoni Pizza", price: 150, category: "Pizza", available: true, isVeg: false },
      { id: "m3", shopId: "shop1", name: "Garlic Bread", price: 60, category: "Sides", available: true, isVeg: true },
      { id: "m4", shopId: "shop1", name: "Cheese Burst Pizza", price: 180, category: "Pizza", available: true, isVeg: true },
      { id: "m5", shopId: "shop2", name: "Classic Burger", price: 80, category: "Burgers", available: true, isVeg: false },
      { id: "m6", shopId: "shop2", name: "Veggie Burger", price: 70, category: "Burgers", available: true, isVeg: true },
      { id: "m7", shopId: "shop2", name: "French Fries", price: 50, category: "Sides", available: true, isVeg: true },
      { id: "m8", shopId: "shop2", name: "Chicken Wrap", price: 90, category: "Wraps", available: true, isVeg: false },
      { id: "m9", shopId: "shop3", name: "Mango Smoothie", price: 60, category: "Smoothies", available: true, isVeg: true },
      { id: "m10", shopId: "shop3", name: "Fresh Orange Juice", price: 45, category: "Juices", available: true, isVeg: true },
      { id: "m11", shopId: "shop3", name: "Cold Coffee", price: 55, category: "Beverages", available: true, isVeg: true },
      { id: "m12", shopId: "shop3", name: "Berry Blast Shake", price: 75, category: "Shakes", available: true, isVeg: true },
      { id: "m13", shopId: "shop4", name: "Veg Thali", price: 90, category: "Meals", available: true, isVeg: true },
      { id: "m14", shopId: "shop4", name: "Chicken Biryani", price: 110, category: "Meals", available: true, isVeg: false },
      { id: "m15", shopId: "shop4", name: "Paneer Roll", price: 55, category: "Snacks", available: true, isVeg: true },
      { id: "m16", shopId: "shop4", name: "Masala Chai", price: 15, category: "Beverages", available: true, isVeg: true },
    ],
    students: [
      { id: "STU001", name: "Demo Student", password: passwordHash },
      { id: "STU002", name: "Alex Kumar", password: passwordHash },
      { id: "STU003", name: "Guest Student", password: null },
    ],
    staff: [
      { id: "staff1", shopId: "shop1", username: "pizza_staff", password: staffHash, name: "Marco (Pizza)" },
      { id: "staff2", shopId: "shop2", username: "burger_staff", password: staffHash, name: "Sam (Burger)" },
      { id: "staff3", shopId: "shop3", username: "juice_staff", password: staffHash, name: "Priya (Juice)" },
      { id: "staff4", shopId: "shop4", username: "desi_staff", password: staffHash, name: "Raj (Desi)" },
    ],
    orders: [],
    reviews: [],
    notifications: [],
  };
}
