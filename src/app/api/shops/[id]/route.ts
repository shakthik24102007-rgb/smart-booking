import { NextResponse } from "next/server";
import { readDb } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = readDb();
  const shop = db.shops.find((s) => s.id === id);

  if (!shop) {
    return NextResponse.json({ error: "Shop not found" }, { status: 404 });
  }

  const menuItems = db.menuItems.filter((m) => m.shopId === id);
  const reviews = db.reviews.filter((r) => r.shopId === id);
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  return NextResponse.json({ shop, menuItems, reviews, avgRating });
}
