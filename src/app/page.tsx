"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"student" | "staff">("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleStudentLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/student", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: form.get("studentId"),
        password: form.get("password") || undefined,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }

    router.push("/student");
    router.refresh();
  }

  async function handleStaffLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shopCode: form.get("shopCode"),
        username: form.get("username"),
        password: form.get("password"),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }

    router.push("/staff");
    router.refresh();
  }

  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-br from-ink to-[#4a2015] px-5 py-8 text-cream">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="flex h-11 w-11 rotate-[-6deg] items-center justify-center rounded-xl bg-gradient-to-br from-mustard to-[#e0a300] font-mono text-sm font-bold text-ink shadow-lg">
            SB
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Smart Booking</h1>
            <p className="text-sm opacity-75">Food court pre-ordering — skip the line</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-5 py-8">
        <div className="mb-6 flex rounded-xl bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => { setMode("student"); setError(""); }}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
              mode === "student" ? "bg-ink text-cream" : "text-ink/70 hover:text-ink"
            }`}
          >
            Student Login
          </button>
          <button
            type="button"
            onClick={() => { setMode("staff"); setError(""); }}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
              mode === "staff" ? "bg-ink text-cream" : "text-ink/70 hover:text-ink"
            }`}
          >
            Staff Login
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-rust/30 bg-rust/10 px-4 py-3 text-sm text-rust">
            {error}
          </div>
        )}

        {mode === "student" ? (
          <form onSubmit={handleStudentLogin} className="card space-y-4 p-6">
            <div>
              <h2 className="font-display text-xl font-bold">Student Portal</h2>
              <p className="mt-1 text-sm opacity-70">
                Browse all food court stores and pre-book your order
              </p>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Student ID</label>
              <input
                name="studentId"
                required
                placeholder="e.g. STU001"
                className="input-field font-mono uppercase"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Password <span className="font-normal opacity-60">(optional for guest)</span>
              </label>
              <input
                name="password"
                type="password"
                placeholder="Leave blank for guest login (STU003)"
                className="input-field"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Signing in…" : "Enter Food Court"}
            </button>
            <p className="text-center text-xs opacity-60">
              Demo: STU001 / demo123 · Guest: STU003 (no password)
            </p>
          </form>
        ) : (
          <form onSubmit={handleStaffLogin} className="card space-y-4 p-6">
            <div>
              <h2 className="font-display text-xl font-bold">Staff Portal</h2>
              <p className="mt-1 text-sm opacity-70">
                Login with your shop&apos;s unique code and staff credentials
              </p>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Shop Code</label>
              <input
                name="shopCode"
                required
                placeholder="e.g. SHOP001"
                className="input-field font-mono uppercase"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Username</label>
              <input
                name="username"
                required
                placeholder="e.g. pizza_staff"
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Password</label>
              <input
                name="password"
                type="password"
                required
                placeholder="staff123"
                className="input-field"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Signing in…" : "Open Staff Dashboard"}
            </button>
            <p className="text-center text-xs opacity-60">
              Demo: SHOP001 + pizza_staff / staff123
            </p>
          </form>
        )}

        <div className="mt-8 card p-5">
          <h3 className="font-display font-bold">Why pre-book?</h3>
          <ul className="mt-3 space-y-2 text-sm opacity-80">
            <li>🕐 Pick your pickup time and avoid peak-hour queues</li>
            <li>📱 Track order status live on your phone</li>
            <li>🔔 Get notified when your order is ready</li>
            <li>⭐ Rate stores after pickup</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
