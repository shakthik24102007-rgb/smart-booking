import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readDb, updateDb } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session || session.type !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = readDb();
  const notifications = db.notifications
    .filter((n) => n.studentId === session.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return NextResponse.json({ notifications });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session || session.type !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json();

  updateDb((db) => {
    const notif = db.notifications.find(
      (n) => n.id === id && n.studentId === session.id
    );
    if (notif) notif.read = true;
  });

  return NextResponse.json({ ok: true });
}
