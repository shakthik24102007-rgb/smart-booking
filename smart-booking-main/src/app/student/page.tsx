"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppHeader, StatusBadge } from "@/components/ui";

interface Shop {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  availableCount: number;
  menuCount: number;
  avgRating: number | null;
  reviewCount: number;
  status: string;
}

export default function StudentDashboard() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [session, setSession] = useState<{ name: string } | null>(null);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [shopsRes, sessionRes, notifRes] = await Promise.all([
        fetch("/api/shops"),
        fetch("/api/auth/session"),
        fetch("/api/notifications"),
      ]);

      if (shopsRes.ok) {
        const data = await shopsRes.json();
        setShops(data.shops);
      }
      if (sessionRes.ok) {
        const data = await sessionRes.json();
        setSession(data.session);
      }
      if (notifRes.ok) {
        const data = await notifRes.json();
        setUnread(data.notifications.filter((n: { read: boolean }) => !n.read).length);
      }
      setLoading(false);
    }
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen pb-24">
      <AppHeader
        title="Food Court"
        subtitle="Browse stores & pre-book your order"
        userName={session?.name}
        badge={unread > 0 ? `${unread} new` : undefined}
      />

      <main className="mx-auto max-w-3xl px-5 py-6">
        <div className="mb-6 flex gap-3">
          <Link href="/student/orders" className="btn-secondary flex-1 text-center text-sm">
            My Orders
          </Link>
        </div>

        {unread > 0 && (
          <div className="mb-5 rounded-xl border border-mustard/40 bg-mustard/15 px-4 py-3 text-sm">
            🔔 You have {unread} unread notification{unread > 1 ? "s" : ""}.{" "}
            <Link href="/student/orders" className="font-semibold underline">
              View orders
            </Link>
          </div>
        )}

        <h2 className="mb-4 font-display text-xl font-bold">Available Stores</h2>

        {loading ? (
          <p className="text-center text-sm opacity-60">Loading stores…</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {shops.map((shop) => (
              <Link
                key={shop.id}
                href={shop.status === "open" ? `/student/store/${shop.id}` : "#"}
                className={`card block p-5 transition ${
                  shop.status === "open"
                    ? "hover:-translate-y-0.5 hover:shadow-md"
                    : "cursor-not-allowed opacity-60"
                }`}
                onClick={(e) => shop.status !== "open" && e.preventDefault()}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-3xl">{shop.emoji}</span>
                  <StatusBadge status={shop.status} />
                </div>
                <h3 className="mt-2 font-display text-lg font-bold">{shop.name}</h3>
                <p className="mt-1 text-sm opacity-70">{shop.tagline}</p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="font-semibold text-teal">
                    {shop.availableCount} items available
                  </span>
                  {shop.avgRating !== null && (
                    <span className="text-mustard">
                      ★ {shop.avgRating.toFixed(1)} ({shop.reviewCount})
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
