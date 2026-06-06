import { auth } from "@/lib/auth";
import { CompetitionCenter } from "@/components/dashboard/CompetitionCenter";
import { ProjectSwitcher } from "@/components/dashboard/ProjectSwitcher";
import { WeekPlanner } from "@/components/dashboard/WeekPlanner";
import { QuickLinks } from "@/components/dashboard/QuickLinks";
import { DataPulse } from "@/components/dashboard/DataPulse";

export default async function DashboardPage() {
  const session = await auth();
  const hour = new Date().getHours();
  const greeting =
    hour < 6 ? "凌晨好" : hour < 12 ? "上午好" : hour < 18 ? "下午好" : "晚上好";

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          👋 {greeting}，{session?.user?.name || "赵琰"}
        </h1>
        <span className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
          })}
        </span>
      </div>

      <div className="space-y-6">
        <CompetitionCenter />
        <ProjectSwitcher />
        <WeekPlanner />
        <QuickLinks />
        <DataPulse />
      </div>
    </div>
  );
}
