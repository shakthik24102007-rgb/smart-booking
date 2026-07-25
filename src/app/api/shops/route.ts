import { NextResponse } from "next/server";
import { readDb } from "@/lib/db";

export async function GET() {
  const db = readDb();

  const shops = db.shops.map((shop) => {
    const menuItems = db.menuItems.filter((m) => m.shopId === shop.id);
    const availableCount = menuItems.filter((m) => m.available).length;
    const reviews = db.reviews.filter((r) => r.shopId === shop.id);
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : null;

    return {
      ...shop,
      menuCount: menuItems.length,
      availableCount,
      avgRating,
      reviewCount: reviews.length,
      status: !shop.isOpen
        ? "closed"
        : availableCount === 0
          ? "out_of_stock"
          : "open",
    };
  });

  return NextResponse.json({ shops });
}
