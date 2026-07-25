"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppHeader, StatusBadge } from "@/components/ui";
import type { Order, OrderStatus } from "@/lib/types";

interface Session {
  name: string;
  shopName: string;
  shopCode: string;
}

const NEXT_STATUS: Partial<Record<OrderStatus, { status: OrderStatus; label: string }>> = {
  pending: { status: "received", label: "Mark Received" },
  received: { status: "preparing", label: "Start Preparing" },
  preparing: { status: "ready", label: "Mark Ready & Notify" },
  ready: { status: "completed", label: "Complete (Picked Up)" },
};

export default function StaffDashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const [sessionRes, ordersRes] = await Promise.all([
      fetch("/api/auth/session"),
      fetch("/api/orders?today=true"),
    ]);

    if (sessionRes.ok) {
      const data = await sessionRes.json();
      setSession(data.session);
    }
    if (ordersRes.ok) {
      const data = await ordersRes.json();
      setOrders(data.orders);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 8000);
    return () => clearInterval(interval);
  }, []);

  async function updateStatus(order: Order) {
    const next = NEXT_STATUS[order.status];
    if (!next) return;

    let readyMessage: string | undefined;
    if (next.status === "ready") {
      readyMessage = `Your order from ${session?.shopName} is ready for pickup! 🎉 Pick up at the counter.`;
    }

    await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next.status, readyMessage }),
    });
    load();
  }

  const active = orders.filter((o) => !["completed", "cancelled"].includes(o.status));
  const pending = orders.filter((o) => o.status === "pending");
  const preparing = orders.filter((o) => ["received", "preparing"].includes(o.status));
  const ready = orders.filter((o) => o.status === "ready");

  return (
    <div className="min-h-screen pb-24">
      <AppHeader
        title={session?.shopName || "Staff Dashboard"}
        subtitle={`Shop code: ${session?.shopCode || "—"}`}
        userName={session?.name}
      />

      <main className="mx-auto max-w-3xl px-5 py-6">
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="card p-4 text-center">
            <div className="font-mono text-2xl font-bold text-rust">{pending.length}</div>
            <div className="text-xs opacity-70">New</div>
          </div>
          <div className="card p-4 text-center">
            <div className="font-mono text-2xl font-bold text-mustard">{preparing.length}</div>
            <div className="text-xs opacity-70">In Kitchen</div>
          </div>
          <div className="card p-4 text-center">
            <div className="font-mono text-2xl font-bold text-teal">{ready.length}</div>
            <div className="text-xs opacity-70">Ready</div>
          </div>
        </div>

        <div className="mb-5 flex gap-2 overflow-x-auto">
          <Link href="/staff" className="btn-primary shrink-0 text-sm">
            Orders
          </Link>
          <Link href="/staff/menu" className="btn-secondary shrink-0 text-sm">
            Menu
          </Link>
          <Link href="/staff/reports" className="btn-secondary shrink-0 text-sm">
            Daily Report
          </Link>
        </div>

        <h2 className="mb-4 font-display text-lg font-bold">
          Today&apos;s Orders ({active.length} active)
        </h2>

        {loading ? (
          <p className="text-center text-sm opacity-60">Loading…</p>
        ) : active.length === 0 ? (
          <div className="card p-8 text-center text-sm opacity-70">
            No active orders right now. New pre-orders will appear here.
          </div>
        ) : (
          <div className="space-y-3">
            {active.map((order) => {
              const next = NEXT_STATUS[order.status];
              return (
                <div key={order.id} className="card p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold">{order.studentName}</p>
                      <p className="text-xs opacity-60">Pickup: {order.pickupTime}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="mt-2 text-sm opacity-80">
                    {order.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-mono font-bold text-rust">₹{order.total}</span>
                    {next && (
                      <button
                        onClick={() => updateStatus(order)}
                        className={`rounded-lg px-4 py-2 text-xs font-bold ${
                          next.status === "ready"
                            ? "bg-mustard text-ink"
                            : "bg-teal text-white"
                        }`}
                      >
                        {next.label}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
