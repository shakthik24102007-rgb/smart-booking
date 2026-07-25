import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.type !== "student") {
    redirect("/");
  }
  return <>{children}</>;
}
