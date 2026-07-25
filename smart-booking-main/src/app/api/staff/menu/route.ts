import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { generateId, readDb, updateDb } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session || session.type !== "staff") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = readDb();
  const menuItems = db.menuItems.filter((m) => m.shopId === session.shopId);
  const shop = db.shops.find((s) => s.id === session.shopId);

  return NextResponse.json({ menuItems, shop });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.type !== "staff") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, price, category, isVeg } = await request.json();

  if (!name || !price || !category) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const item = {
    id: generateId("m"),
    shopId: session.shopId,
    name: String(name).trim(),
    price: Number(price),
    category: String(category).trim(),
    available: true,
    isVeg: Boolean(isVeg),
  };

  updateDb((db) => {
    db.menuItems.push(item);
  });

  return NextResponse.json({ item }, { status: 201 });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session || session.type !== "staff") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, available, name, price, category, isVeg, isOpen } = await request.json();

  if (isOpen !== undefined) {
    updateDb((db) => {
      const shop = db.shops.find((s) => s.id === session.shopId);
      if (shop) shop.isOpen = Boolean(isOpen);
    });
    const shop = readDb().shops.find((s) => s.id === session.shopId);
    return NextResponse.json({ shop });
  }

  const db = readDb();
  const item = db.menuItems.find((m) => m.id === id && m.shopId === session.shopId);

  if (!item) {
    return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
  }

  updateDb((db) => {
    const target = db.menuItems.find((m) => m.id === id);
    if (!target) return;
    if (available !== undefined) target.available = Boolean(available);
    if (name) target.name = String(name).trim();
    if (price !== undefined) target.price = Number(price);
    if (category) target.category = String(category).trim();
    if (isVeg !== undefined) target.isVeg = Boolean(isVeg);
  });

  const updated = readDb().menuItems.find((m) => m.id === id);
  return NextResponse.json({ item: updated });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session || session.type !== "staff") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Item ID required" }, { status: 400 });
  }

  updateDb((db) => {
    db.menuItems = db.menuItems.filter(
      (m) => !(m.id === id && m.shopId === session.shopId)
    );
  });

  return NextResponse.json({ ok: true });
}
