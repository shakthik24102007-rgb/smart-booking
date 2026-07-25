import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.type !== "staff") {
    redirect("/");
  }
  return <>{children}</>;
}
