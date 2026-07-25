"use client";

import { useEffect, useState } from "react";
import { AppHeader, StarRating, StatusBadge } from "@/components/ui";
import type { Order } from "@/lib/types";

interface Notification {
  id: string;
  orderId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const STATUS_STEPS = ["pending", "received", "preparing", "ready", "completed"];

export default function StudentOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    const [ordersRes, notifRes] = await Promise.all([
      fetch("/api/orders"),
      fetch("/api/notifications"),
    ]);

    if (ordersRes.ok) {
      const data = await ordersRes.json();
      setOrders(data.orders);
    }
    if (notifRes.ok) {
      const data = await notifRes.json();
      setNotifications(data.notifications);

      for (const n of data.notifications.filter((x: Notification) => !x.read)) {
        await fetch("/api/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: n.id }),
        });
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 8000);
    return () => clearInterval(interval);
  }, []);

  async function submitReview() {
    if (!reviewOrder) return;
    setSubmitting(true);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shopId: reviewOrder.shopId,
        orderId: reviewOrder.id,
        rating,
        comment,
      }),
    });

    setSubmitting(false);
    if (res.ok) {
      setReviewOrder(null);
      setComment("");
      setRating(5);
      load();
    }
  }

  return (
    <div className="min-h-screen pb-10">
      <AppHeader title="My Orders" subtitle="Track status & notifications" backHref="/student" />

      <main className="mx-auto max-w-3xl px-5 py-6">
        {notifications.filter((n) => !n.read).length > 0 && (
          <div className="mb-5 space-y-2">
            {notifications
              .filter((n) => !n.read)
              .slice(0, 3)
              .map((n) => (
                <div
                  key={n.id}
                  className="rounded-xl border border-mustard/40 bg-mustard/15 px-4 py-3 text-sm font-medium"
                >
                  🔔 {n.message}
                </div>
              ))}
          </div>
        )}

        {loading ? (
          <p className="text-center text-sm opacity-60">Loading orders…</p>
        ) : orders.length === 0 ? (
          <div className="card p-8 text-center text-sm opacity-70">
            No orders yet. Browse the food court and pre-book your first meal!
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const stepIdx = STATUS_STEPS.indexOf(order.status);
              return (
                <div key={order.id} className="card p-5">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="font-mono text-sm opacity-60">
                      #{order.id.slice(-8)}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>

                  <div className="mb-4 flex justify-between gap-2">
                    {STATUS_STEPS.slice(0, 4).map((s, i) => (
                      <div key={s} className="flex-1 text-center">
                        <div
                          className={`mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                            i < stepIdx
                              ? "bg-teal text-white"
                              : i === stepIdx
                                ? "bg-mustard text-ink"
                                : "border border-gray-200 bg-white text-gray-400"
                          }`}
                        >
                          {i < stepIdx ? "✓" : i + 1}
                        </div>
                        <span className="text-[10px] font-semibold capitalize opacity-70">
                          {s}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="text-sm">
                    Pickup: <strong>{order.pickupTime}</strong>
                  </p>

                  <div className="mt-3 space-y-1 border-t pt-3 text-sm">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between">
                        <span>
                          {item.quantity}× {item.name}
                        </span>
                        <span className="font-mono">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="flex justify-between border-t pt-2 font-bold">
                      <span>Total</span>
                      <span className="font-mono text-rust">₹{order.total}</span>
                    </div>
                  </div>

                  {order.readyMessage && order.status === "ready" && (
                    <div className="mt-3 rounded-lg bg-teal/10 px-3 py-2 text-sm text-teal-dark">
                      ✅ {order.readyMessage}
                    </div>
                  )}

                  {!order.reviewed &&
                    (order.status === "ready" || order.status === "completed") && (
                      <button
                        onClick={() => setReviewOrder(order)}
                        className="mt-3 text-sm font-semibold text-teal hover:underline"
                      >
                        Rate this order →
                      </button>
                    )}
                  {order.reviewed && (
                    <p className="mt-3 text-xs text-teal">Review submitted ✓</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {reviewOrder && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <div className="card w-full max-w-md p-6">
            <h3 className="font-display text-lg font-bold">Rate your order</h3>
            <p className="mt-1 text-sm opacity-70">
              How was your experience at this store?
            </p>
            <div className="my-4">
              <StarRating value={rating} onChange={setRating} />
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Optional comment…"
              className="input-field min-h-[80px] resize-none"
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setReviewOrder(null)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
                disabled={submitting}
                className="btn-primary flex-1"
              >
                {submitting ? "Submitting…" : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
