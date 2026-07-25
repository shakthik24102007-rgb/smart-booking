import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { generateId, readDb, updateDb } from "@/lib/db";
import type { OrderStatus } from "@/lib/types";

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["received", "cancelled"],
  received: ["preparing", "cancelled"],
  preparing: ["ready"],
  ready: ["completed"],
  completed: [],
  cancelled: [],
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.type !== "staff") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { status, readyMessage } = await request.json();

  const db = readDb();
  const order = db.orders.find((o) => o.id === id);

  if (!order || order.shopId !== session.shopId) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (status) {
    const allowed = VALID_TRANSITIONS[order.status];
    if (!allowed.includes(status)) {
      return NextResponse.json(
        { error: `Cannot change status from ${order.status} to ${status}` },
        { status: 400 }
      );
    }
  }

  updateDb((db) => {
    const target = db.orders.find((o) => o.id === id);
    if (!target) return;

    if (status) target.status = status;

    if (status === "ready") {
      const message =
        readyMessage ||
        `Your order from ${session.shopName} is ready for pickup! 🎉`;
      target.readyMessage = message;

      db.notifications.push({
        id: generateId("notif"),
        studentId: target.studentId,
        orderId: target.id,
        message,
        read: false,
        createdAt: new Date().toISOString(),
      });
    }
  });

  const updated = readDb().orders.find((o) => o.id === id);
  return NextResponse.json({ order: updated });
}
