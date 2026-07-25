"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/ui";

interface Report {
  date: string;
  shopName: string;
  summary: {
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    revenue: number;
    cancelledOrders: number;
  };
  itemsSold: { name: string; quantity: number; revenue: number }[];
}

export default function StaffReportsPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/staff/reports");
      if (res.ok) {
        setReport(await res.json());
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen pb-10">
      <AppHeader
        title="Daily Report"
        subtitle="Accountability summary for today"
        backHref="/staff"
      />

      <main className="mx-auto max-w-3xl px-5 py-6">
        <div className="mb-5 flex gap-2">
          <Link href="/staff" className="btn-secondary text-sm">Orders</Link>
          <Link href="/staff/menu" className="btn-secondary text-sm">Menu</Link>
        </div>

        {loading ? (
          <p className="text-center text-sm opacity-60">Loading report…</p>
        ) : report ? (
          <>
            <div className="mb-2 text-sm opacity-70">
              {report.shopName} · {report.date}
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="card p-4 text-center">
                <div className="font-mono text-xl font-bold">{report.summary.totalOrders}</div>
                <div className="text-xs opacity-70">Total Orders</div>
              </div>
              <div className="card p-4 text-center">
                <div className="font-mono text-xl font-bold text-teal">
                  {report.summary.completedOrders}
                </div>
                <div className="text-xs opacity-70">Completed</div>
              </div>
              <div className="card p-4 text-center">
                <div className="font-mono text-xl font-bold text-mustard">
                  {report.summary.pendingOrders}
                </div>
                <div className="text-xs opacity-70">Pending</div>
              </div>
              <div className="card p-4 text-center">
                <div className="font-mono text-xl font-bold text-rust">
                  ₹{report.summary.revenue}
                </div>
                <div className="text-xs opacity-70">Revenue</div>
              </div>
            </div>

            <h3 className="mb-3 font-display font-bold">Items Sold Today</h3>
            {report.itemsSold.length === 0 ? (
              <div className="card p-6 text-center text-sm opacity-70">
                No items sold yet today.
              </div>
            ) : (
              <div className="card divide-y">
                {report.itemsSold.map((item) => (
                  <div key={item.name} className="flex items-center justify-between px-4 py-3 text-sm">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-xs opacity-60">{item.quantity} sold</p>
                    </div>
                    <span className="font-mono font-bold text-rust">₹{item.revenue}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="card p-6 text-center text-sm opacity-70">Could not load report.</div>
        )}
      </main>
    </div>
  );
}
