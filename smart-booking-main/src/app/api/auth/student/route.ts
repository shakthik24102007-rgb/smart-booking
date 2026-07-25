import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { COOKIE_NAME, createSessionToken } from "@/lib/auth";
import { readDb } from "@/lib/db";

export async function POST(request: Request) {
  const { studentId, password } = await request.json();
  const id = String(studentId || "").trim().toUpperCase();

  if (!id) {
    return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
  }

  const db = readDb();
  const student = db.students.find((s) => s.id.toUpperCase() === id);

  if (!student) {
    return NextResponse.json({ error: "Student ID not found" }, { status: 401 });
  }

  if (student.password) {
    if (!password || !bcrypt.compareSync(password, student.password)) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
  }

  const token = await createSessionToken({
    type: "student",
    id: student.id,
    name: student.name,
  });

  const response = NextResponse.json({
    user: { id: student.id, name: student.name },
  });

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
