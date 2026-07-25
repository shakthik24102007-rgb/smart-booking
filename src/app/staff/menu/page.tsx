"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppHeader, VegBadge } from "@/components/ui";
import type { MenuItem } from "@/lib/types";

export default function StaffMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "Meals",
    isVeg: true,
  });

  async function load() {
    const res = await fetch("/api/staff/menu");
    if (res.ok) {
      const data = await res.json();
      setMenuItems(data.menuItems);
      setIsOpen(data.shop?.isOpen ?? true);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleAvailable(item: MenuItem) {
    await fetch("/api/staff/menu", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, available: !item.available }),
    });
    load();
  }

  async function toggleShopOpen() {
    await fetch("/api/staff/menu", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isOpen: !isOpen }),
    });
    setIsOpen(!isOpen);
  }

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/staff/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        price: Number(form.price),
        category: form.category,
        isVeg: form.isVeg,
      }),
    });
    setForm({ name: "", price: "", category: "Meals", isVeg: true });
    load();
  }

  async function removeItem(id: string) {
    if (!confirm("Remove this menu item?")) return;
    await fetch(`/api/staff/menu?id=${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="min-h-screen pb-10">
      <AppHeader title="Menu Manager" subtitle="Manage items & availability" backHref="/staff" />

      <main className="mx-auto max-w-3xl px-5 py-6">
        <div className="mb-5 flex gap-2">
          <Link href="/staff" className="btn-secondary text-sm">Orders</Link>
          <Link href="/staff/reports" className="btn-secondary text-sm">Daily Report</Link>
        </div>

        <div className="card mb-6 flex items-center justify-between p-4">
          <div>
            <p className="font-semibold">Shop Status</p>
            <p className="text-xs opacity-70">
              {isOpen ? "Accepting pre-orders" : "Closed to students"}
            </p>
          </div>
          <button
            onClick={toggleShopOpen}
            className={`rounded-lg px-4 py-2 text-sm font-bold ${
              isOpen ? "bg-rust text-white" : "bg-teal text-white"
            }`}
          >
            {isOpen ? "Close Shop" : "Open Shop"}
          </button>
        </div>

        <form onSubmit={addItem} className="card mb-6 space-y-3 p-4">
          <h3 className="font-display font-bold">Add Menu Item</h3>
          <input
            required
            placeholder="Item name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input-field"
          />
          <div className="flex gap-2">
            <input
              required
              type="number"
              placeholder="Price ₹"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="input-field w-28"
            />
            <input
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="input-field flex-1"
            />
            <select
              value={form.isVeg ? "veg" : "nonveg"}
              onChange={(e) => setForm({ ...form, isVeg: e.target.value === "veg" })}
              className="input-field w-28"
            >
              <option value="veg">Veg</option>
              <option value="nonveg">Non-Veg</option>
            </select>
          </div>
          <button type="submit" className="btn-primary w-full">Add Item</button>
        </form>

        <h3 className="mb-3 font-display font-bold">Current Menu</h3>
        {loading ? (
          <p className="text-sm opacity-60">Loading…</p>
        ) : (
          <div className="space-y-2">
            {menuItems.map((item) => (
              <div key={item.id} className="card flex flex-wrap items-center gap-3 p-3">
                <VegBadge isVeg={item.isVeg} />
                <span className="flex-1 font-semibold text-sm">{item.name}</span>
                <span className="font-mono text-sm font-bold">₹{item.price}</span>
                <span className="text-xs opacity-60">{item.category}</span>
                <button
                  onClick={() => toggleAvailable(item)}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                    item.available ? "bg-teal/15 text-teal-dark" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {item.available ? "In Stock" : "Sold Out"}
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-xs font-semibold text-rust"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
