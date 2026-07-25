"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AppHeader, PICKUP_SLOTS, StatusBadge, VegBadge } from "@/components/ui";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  available: boolean;
  isVeg: boolean;
}

interface Shop {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  isOpen: boolean;
}

export default function StorePage() {
  const params = useParams();
  const router = useRouter();
  const shopId = params.id as string;

  const [shop, setShop] = useState<Shop | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [pickupTime, setPickupTime] = useState(PICKUP_SLOTS[0]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/shops/${shopId}`);
      if (res.ok) {
        const data = await res.json();
        setShop(data.shop);
        setMenuItems(data.menuItems);
      }
      setLoading(false);
    }
    load();
  }, [shopId]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return menuItems;
    return menuItems.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
    );
  }, [menuItems, search]);

  const categories = useMemo(
    () => [...new Set(filtered.map((m) => m.category))],
    [filtered]
  );

  const cartTotal = useMemo(() => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const item = menuItems.find((m) => m.id === id);
      return sum + (item ? item.price * qty : 0);
    }, 0);
  }, [cart, menuItems]);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  function updateQty(id: string, delta: number) {
    setCart((prev) => {
      const next = { ...prev, [id]: Math.max(0, (prev[id] || 0) + delta) };
      if (next[id] === 0) delete next[id];
      return next;
    });
  }

  async function placeOrder() {
    if (cartCount === 0) return;
    setSubmitting(true);
    setMessage("");

    const items = Object.entries(cart).map(([menuItemId, quantity]) => ({
      menuItemId,
      quantity,
    }));

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shopId, items, pickupTime }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setMessage(data.error || "Failed to place order");
      return;
    }

    setCart({});
    router.push("/student/orders");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <AppHeader title="Loading…" backHref="/student" />
        <p className="p-8 text-center text-sm opacity-60">Loading menu…</p>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen">
        <AppHeader title="Store not found" backHref="/student" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28">
      <AppHeader
        title={`${shop.emoji} ${shop.name}`}
        subtitle={shop.tagline}
        backHref="/student"
      />

      <main className="mx-auto max-w-3xl px-5 py-6">
        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-medium">Pickup time</label>
          <select
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            className="input-field"
          >
            {PICKUP_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          placeholder="Search menu…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field mb-5"
        />

        {categories.map((cat) => (
          <section key={cat} className="mb-8">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-teal-dark">
              {cat}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {filtered
                .filter((m) => m.category === cat)
                .map((item) => (
                  <div
                    key={item.id}
                    className={`card p-4 ${!item.available ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 font-semibold">
                        <VegBadge isVeg={item.isVeg} />
                        {item.name}
                      </div>
                      <span className="font-mono font-bold text-rust">
                        ₹{item.price}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-teal">
                      {item.available ? "In stock" : "Sold out"}
                    </p>
                    {item.available && (
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border bg-cream font-bold"
                          >
                            −
                          </button>
                          <span className="min-w-[20px] text-center font-mono font-bold">
                            {cart[item.id] || 0}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border bg-cream font-bold"
                          >
                            +
                          </button>
                        </div>
                        {!cart[item.id] && (
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-cream"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </section>
        ))}

        {message && (
          <div className="rounded-xl border border-rust/30 bg-rust/10 px-4 py-3 text-sm text-rust">
            {message}
          </div>
        )}
      </main>

      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-br from-ink to-[#4a2015] px-5 py-4 text-cream shadow-2xl">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
            <div>
              <strong className="font-mono text-mustard">{cartCount}</strong> items ·{" "}
              <strong className="font-mono text-mustard">₹{cartTotal}</strong>
            </div>
            <button
              onClick={placeOrder}
              disabled={submitting}
              className="btn-accent shrink-0"
            >
              {submitting ? "Placing…" : "Pre-Book Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
