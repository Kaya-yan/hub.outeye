"use client";

import { useEffect, useState } from "react";
import { formatTokens } from "@/lib/utils";

interface PulseData {
  corpusCount: number;
  corpusSource: string;
  mimoRemaining: string;
  mimoConfigured: boolean;
  weeklyTasks: string;
  lastUpdated: string;
}

export function DataPulse() {
  const [data, setData] = useState<PulseData | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [tasksRes, budgetRes] = await Promise.all([
          fetch("/api/tasks"),
          fetch("/api/budget"),
        ]);
        const [tasks, budgets] = await Promise.all([
          tasksRes.json(),
          budgetRes.json(),
        ]);

        // Weekly task stats — use client-side date to avoid timezone issues
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0=Sun
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - dayOfWeek);
        weekStart.setHours(0, 0, 0, 0);

        const weeklyTasks = Array.isArray(tasks)
          ? tasks.filter(
              (t: { createdAt: string }) =>
                new Date(t.createdAt) >= weekStart
            )
          : [];
        const weeklyDone = weeklyTasks.filter(
          (t: { status: string }) => t.status === "done"
        );

        // MiMo budget
        const mimoBudget = Array.isArray(budgets)
          ? budgets.find((b: { platform: string }) => b.platform === "mimo")
          : null;

        // Fetch project stats for corpus count
        let corpusCount = 0;
        let corpusSource = "OutEye 2.0 · 暂无数据";
        try {
          const statsRes = await fetch("/api/data?range=7d");
          if (statsRes.ok) {
            const statsData = await statsRes.json();
            const outeye2Stats = statsData.projectStats?.outeye2;
            if (outeye2Stats?.length > 0) {
              const corpusStat = outeye2Stats.find((s: { metricName: string }) => s.metricName === "语料总量");
              if (corpusStat) {
                corpusCount = corpusStat.metricValue;
                corpusSource = "OutEye 2.0 · 项目数据";
              }
            }
          }
        } catch { /* fallback to 0 */ }

        setData({
          corpusCount,
          corpusSource,
          mimoRemaining: mimoBudget
            ? formatTokens(mimoBudget.totalBudget - mimoBudget.used)
            : "未配置",
          mimoConfigured: !!mimoBudget,
          weeklyTasks: `${weeklyDone.length}/${weeklyTasks.length} 完成`,
          lastUpdated: new Date().toLocaleTimeString("zh-CN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
      } catch {
        setData({
          corpusCount: 0,
          corpusSource: "OutEye 2.0 · 加载失败",
          mimoRemaining: "加载失败",
          mimoConfigured: false,
          weeklyTasks: "加载失败",
          lastUpdated: "--:--",
        });
      }
    }
    load();
  }, []);

  const stats = [
    {
      label: "语料总量",
      value: data?.corpusCount?.toLocaleString() || "...",
      unit: "篇文章",
      color: "text-brand-cyan",
      note: data?.corpusSource || "...",
    },
    {
      label: "MiMo 额度",
      value: data?.mimoRemaining || "...",
      unit: data?.mimoConfigured ? "剩余" : "",
      color: "text-brand-violet",
      note: data?.mimoConfigured ? "从额度监控读取" : "请在额度监控页添加",
    },
    {
      label: "本周任务",
      value: data?.weeklyTasks || "...",
      unit: "",
      color: "text-emerald-400",
      note: "实时统计（客户端时区）",
    },
  ];

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">📊 数据脉搏</h2>
        <span className="text-[10px] text-muted-foreground/40">
          更新于 {data?.lastUpdated || "..."}
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-black/8 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] p-4"
          >
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className={`mt-1 text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground/60">{stat.unit}</p>
              <p className="text-[9px] text-muted-foreground/30">{stat.note}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
