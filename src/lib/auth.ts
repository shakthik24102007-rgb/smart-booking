import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { Session } from "./types";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "smart-booking-demo-secret-key-2026"
);

const COOKIE_NAME = "smart-booking-session";

export async function createSessionToken(session: Session): Promise<string> {
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as Session;
  } catch {
    return null;
  }
}

export { COOKIE_NAME };
