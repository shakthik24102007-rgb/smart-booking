import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { COOKIE_NAME, createSessionToken } from "@/lib/auth";
import { readDb } from "@/lib/db";

export async function POST(request: Request) {
  const { shopCode, username, password } = await request.json();
  const code = String(shopCode || "").trim().toUpperCase();
  const user = String(username || "").trim();

  if (!code || !user || !password) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const db = readDb();
  const shop = db.shops.find((s) => s.code.toUpperCase() === code);

  if (!shop) {
    return NextResponse.json({ error: "Invalid shop code" }, { status: 401 });
  }

  const staff = db.staff.find(
    (s) => s.shopId === shop.id && s.username === user
  );

  if (!staff || !bcrypt.compareSync(password, staff.password)) {
    return NextResponse.json({ error: "Invalid staff credentials" }, { status: 401 });
  }

  const token = await createSessionToken({
    type: "staff",
    id: staff.id,
    name: staff.name,
    shopId: shop.id,
    shopName: shop.name,
    shopCode: shop.code,
  });

  const response = NextResponse.json({
    user: {
      id: staff.id,
      name: staff.name,
      shopId: shop.id,
      shopName: shop.name,
    },
  });

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
