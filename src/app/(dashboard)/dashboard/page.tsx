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
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "long",
            })}
          </span>
          <a
            href="/赵琰简历.pdf"
            download
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            导出简历
          </a>
        </div>
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
