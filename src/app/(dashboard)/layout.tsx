import { Sidebar } from "@/components/layout/Sidebar";
import { QuickIdeaOverlay } from "@/components/dashboard/QuickIdeaOverlay";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pt-12 lg:pt-0">
        {children}
        <QuickIdeaOverlay />
      </main>
    </div>
  );
}
