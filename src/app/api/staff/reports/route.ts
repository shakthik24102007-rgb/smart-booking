import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readDb } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session || session.type !== "staff") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = readDb();
  const today = new Date().toISOString().slice(0, 10);
  const orders = db.orders.filter(
    (o) => o.shopId === session.shopId && o.createdAt.startsWith(today)
  );

  const completed = orders.filter((o) => o.status === "completed");
  const pending = orders.filter(
    (o) => !["completed", "cancelled"].includes(o.status)
  );

  const revenue = completed.reduce((sum, o) => sum + o.total, 0);
  const itemCounts: Record<string, { name: string; quantity: number; revenue: number }> = {};

  for (const order of orders.filter((o) => o.status !== "cancelled")) {
    for (const item of order.items) {
      if (!itemCounts[item.menuItemId]) {
        itemCounts[item.menuItemId] = {
          name: item.name,
          quantity: 0,
          revenue: 0,
        };
      }
      itemCounts[item.menuItemId].quantity += item.quantity;
      itemCounts[item.menuItemId].revenue += item.price * item.quantity;
    }
  }

  const itemsSold = Object.values(itemCounts).sort(
    (a, b) => b.quantity - a.quantity
  );

  return NextResponse.json({
    date: today,
    shopName: session.shopName,
    summary: {
      totalOrders: orders.filter((o) => o.status !== "cancelled").length,
      completedOrders: completed.length,
      pendingOrders: pending.length,
      revenue,
      cancelledOrders: orders.filter((o) => o.status === "cancelled").length,
    },
    itemsSold,
  });
}
