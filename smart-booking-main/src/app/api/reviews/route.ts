import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { generateId, readDb, updateDb } from "@/lib/db";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.type !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { shopId, orderId, rating, comment } = await request.json();

  if (!shopId || !orderId || !rating) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const stars = Number(rating);
  if (stars < 1 || stars > 5) {
    return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
  }

  const db = readDb();
  const order = db.orders.find(
    (o) => o.id === orderId && o.studentId === session.id && o.shopId === shopId
  );

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status !== "completed" && order.status !== "ready") {
    return NextResponse.json(
      { error: "You can review after your order is ready or completed" },
      { status: 400 }
    );
  }

  if (order.reviewed) {
    return NextResponse.json({ error: "Order already reviewed" }, { status: 400 });
  }

  const review = {
    id: generateId("rev"),
    shopId,
    studentId: session.id,
    studentName: session.name,
    orderId,
    rating: stars,
    comment: String(comment || "").trim(),
    createdAt: new Date().toISOString(),
  };

  updateDb((db) => {
    db.reviews.push(review);
    const target = db.orders.find((o) => o.id === orderId);
    if (target) target.reviewed = true;
  });

  return NextResponse.json({ review }, { status: 201 });
}
