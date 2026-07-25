"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  userName?: string;
  badge?: string;
}

export function AppHeader({ title, subtitle, backHref, userName, badge }: HeaderProps) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-20 bg-gradient-to-br from-ink to-[#4a2015] px-5 py-4 text-cream shadow-lg">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          {backHref && (
            <Link href={backHref} className="mb-1 inline-block text-xs opacity-75 hover:opacity-100">
              ← Back
            </Link>
          )}
          <h1 className="truncate font-display text-lg font-bold">{title}</h1>
          {subtitle && <p className="truncate text-xs opacity-75">{subtitle}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {badge && (
            <span className="badge bg-mustard/20 text-mustard">{badge}</span>
          )}
          {userName && (
            <span className="hidden text-xs opacity-75 sm:inline">{userName}</span>
          )}
          <button
            onClick={logout}
            className="rounded-lg border border-cream/20 px-3 py-1.5 text-xs font-semibold hover:bg-cream/10"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    open: "bg-teal/15 text-teal-dark",
    closed: "bg-ink/10 text-ink/60",
    out_of_stock: "bg-rust/10 text-rust",
    pending: "bg-mustard/20 text-ink",
    received: "bg-blue-100 text-blue-800",
    preparing: "bg-orange-100 text-orange-800",
    ready: "bg-teal/15 text-teal-dark",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-gray-100 text-gray-600",
  };

  const labels: Record<string, string> = {
    open: "Open",
    closed: "Closed",
    out_of_stock: "Out of Stock",
    pending: "Pending",
    received: "Received",
    preparing: "Preparing",
    ready: "Ready",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return (
    <span className={`badge ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {labels[status] || status}
    </span>
  );
}

export function StarRating({
  value,
  onChange,
  readonly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`text-xl ${star <= value ? "text-mustard" : "text-gray-300"} ${readonly ? "cursor-default" : "hover:scale-110"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export function VegBadge({ isVeg }: { isVeg: boolean }) {
  return (
    <span
      className={`inline-flex h-3.5 w-3.5 items-center justify-center rounded-sm border ${
        isVeg ? "border-green-700" : "border-red-700"
      }`}
      title={isVeg ? "Vegetarian" : "Non-Vegetarian"}
    >
      <span
        className={`${
          isVeg
            ? "h-1.5 w-1.5 rounded-full bg-green-700"
            : "h-0 w-0 border-b-[6px] border-l-[3px] border-r-[3px] border-b-red-700 border-l-transparent border-r-transparent"
        }`}
      />
    </span>
  );
}

export const PICKUP_SLOTS = [
  "11:30 AM – 11:45 AM",
  "12:00 PM – 12:15 PM",
  "12:30 PM – 12:45 PM",
  "1:00 PM – 1:15 PM",
  "1:30 PM – 1:45 PM",
  "4:00 PM – 4:15 PM",
  "4:30 PM – 4:45 PM",
  "5:00 PM – 5:15 PM",
];
