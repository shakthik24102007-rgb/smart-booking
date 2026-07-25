import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { generateId, readDb, updateDb } from "@/lib/db";
import type { OrderItem } from "@/lib/types";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const db = readDb();

  if (session.type === "student") {
    const orders = db.orders
      .filter((o) => o.studentId === session.id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return NextResponse.json({ orders });
  }

  let orders = db.orders.filter((o) => o.shopId === session.shopId);

  const status = searchParams.get("status");
  if (status) {
    orders = orders.filter((o) => o.status === status);
  }

  const today = new Date().toISOString().slice(0, 10);
  if (searchParams.get("today") === "true") {
    orders = orders.filter((o) => o.createdAt.startsWith(today));
  }

  orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.type !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { shopId, items, pickupTime } = await request.json();

  if (!shopId || !items?.length || !pickupTime) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const db = readDb();
  const shop = db.shops.find((s) => s.id === shopId);

  if (!shop || !shop.isOpen) {
    return NextResponse.json({ error: "Shop is not available" }, { status: 400 });
  }

  const orderItems: OrderItem[] = [];
  let total = 0;

  for (const item of items) {
    const menuItem = db.menuItems.find(
      (m) => m.id === item.menuItemId && m.shopId === shopId
    );
    if (!menuItem || !menuItem.available) {
      return NextResponse.json(
        { error: `${item.name || "Item"} is unavailable` },
        { status: 400 }
      );
    }
    const qty = Math.max(1, Number(item.quantity) || 1);
    orderItems.push({
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: qty,
    });
    total += menuItem.price * qty;
  }

  const order = {
    id: generateId("ord"),
    studentId: session.id,
    studentName: session.name,
    shopId,
    items: orderItems,
    pickupTime,
    status: "pending" as const,
    total,
    createdAt: new Date().toISOString(),
    readyMessage: null,
    reviewed: false,
  };

  updateDb((db) => {
    db.orders.push(order);
  });

  return NextResponse.json({ order }, { status: 201 });
}
