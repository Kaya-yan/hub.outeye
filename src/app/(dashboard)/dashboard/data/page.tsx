"use client";

import { useEffect, useState } from "react";
import { TrendingUp, AlertTriangle, GitBranch, Plus, X } from "lucide-react";

interface TokenData {
  platform: string;
  date: string;
  totalTokens: number;
  totalCost: number;
}

interface ProjectStats {
  [project: string]: { metricName: string; metricValue: number; recordedAt: string }[];
}

const projectMeta: Record<string, { name: string; codename: string; emoji: string }> = {
  outeye2: { name: "OutEye 2.0", codename: "OutSight", emoji: "📊" },
  outeye3: { name: "OutEye 3.0", codename: "OutEdu", emoji: "📚" },
  outeye4: { name: "OutEye 4.0", codename: "Pulse", emoji: "📡" },
  "challenge-cup": { name: "挑战杯", codename: "XH-202620", emoji: "🏆" },
};

interface Insight {
  type: string;
  icon: string;
  text: string;
}

export default function DataCenterPage() {
  const [range, setRange] = useState("7d");
  const [data, setData] = useState<{ tokenData: TokenData[]; projectStats: ProjectStats }>({
    tokenData: [],
    projectStats: {},
  });
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formProject, setFormProject] = useState("outeye2");
  const [formMetric, setFormMetric] = useState("");
  const [formValue, setFormValue] = useState("");
  const [formStatus, setFormStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/data?range=${range}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [range]);

  useEffect(() => {
    fetch("/api/insights")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setInsights(d); })
      .catch(() => {});
  }, []);

  async function handleSnapshot(e: React.FormEvent) {
    e.preventDefault();
    if (!formMetric || !formValue) return;
    setFormStatus("saving");
    try {
      const res = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "snapshot",
          projectName: formProject,
          metricName: formMetric,
          metricValue: Number(formValue),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setFormStatus("done");
      setFormMetric("");
      setFormValue("");
      // Refresh data
      fetch(`/api/data?range=${range}`).then((r) => r.json()).then(setData);
      fetch("/api/insights").then((r) => r.json()).then((d) => { if (Array.isArray(d)) setInsights(d); }).catch(() => {});
      setTimeout(() => setFormStatus("idle"), 2000);
    } catch {
      setFormStatus("error");
      setTimeout(() => setFormStatus("idle"), 2000);
    }
  }

  // Aggregate token data by platform
  const platformTotals: Record<string, number> = {};
  for (const d of data.tokenData) {
    platformTotals[d.platform] = (platformTotals[d.platform] || 0) + (d.totalTokens || 0);
  }

  const maxTokens = data.tokenData.reduce((max, d) => Math.max(max, d.totalTokens || 0), 0);

  const platformColor: Record<string, string> = {
    mimo: "bg-emerald-500",
    deepseek: "bg-blue-500",
    moonshot: "bg-purple-500",
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">数据中心</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            项目数据统计 · Token 消耗趋势 · 智能洞察
          </p>
        </div>
        <div className="flex gap-1">
          {["7d", "30d"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-md px-3 py-1.5 text-xs transition-colors ${
                range === r
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r === "7d" ? "本周" : "本月"}
            </button>
          ))}
        </div>
      </div>

      {/* Smart Insights */}
      <div className="mt-6 rounded-xl border border-black/8 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] p-5">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <AlertTriangle className="h-4 w-4 text-yellow-500" /> 智能洞察
        </h2>
        <div className="space-y-2">
          {insights.map((insight, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg bg-black/[0.02] dark:bg-white/[0.02] px-4 py-2.5 text-sm"
            >
              <span>{insight.icon}</span>
              <span>{insight.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Project Overview */}
      <div className="mt-6">
        <h2 className="mb-3 text-sm font-semibold">📊 OutEye 系列数据总览</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(projectMeta).map(([key, meta]) => (
            <div
              key={key}
              className="rounded-xl border border-black/8 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] p-4"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{meta.emoji}</span>
                <div>
                  <p className="text-sm font-medium">{meta.name}</p>
                  <p className="text-[10px] text-muted-foreground/40">
                    {meta.codename}
                  </p>
                </div>
              </div>
              {data.projectStats[key]?.length > 0 ? (
                <div className="mt-3 space-y-1">
                  {data.projectStats[key].slice(0, 3).map((stat) => (
                    <div key={stat.metricName} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{stat.metricName}</span>
                      <span className="font-medium">{stat.metricValue.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-xs text-muted-foreground/40">暂无数据快照</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Manual Snapshot Form */}
      <div className="mt-6 rounded-xl border border-black/8 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] p-5">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "收起" : "添加数据快照"}
        </button>
        {showForm && (
          <form onSubmit={handleSnapshot} className="mt-4 flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1 block text-[11px] text-muted-foreground">项目</label>
              <select
                value={formProject}
                onChange={(e) => setFormProject(e.target.value)}
                className="rounded-md border border-black/8 dark:border-white/10 bg-transparent px-3 py-1.5 text-sm"
              >
                {Object.entries(projectMeta).map(([key, meta]) => (
                  <option key={key} value={key}>{meta.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-muted-foreground">指标名</label>
              <input
                value={formMetric}
                onChange={(e) => setFormMetric(e.target.value)}
                placeholder="如：语料总量"
                className="rounded-md border border-black/8 dark:border-white/10 bg-transparent px-3 py-1.5 text-sm placeholder:text-muted-foreground/40"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-muted-foreground">数值</label>
              <input
                type="number"
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
                placeholder="21381"
                className="w-28 rounded-md border border-black/8 dark:border-white/10 bg-transparent px-3 py-1.5 text-sm placeholder:text-muted-foreground/40"
              />
            </div>
            <button
              type="submit"
              disabled={formStatus === "saving" || !formMetric || !formValue}
              className="rounded-md bg-primary/10 px-4 py-1.5 text-sm text-primary transition-colors hover:bg-primary/20 disabled:opacity-40"
            >
              {formStatus === "saving" ? "保存中..." : formStatus === "done" ? "已保存" : "保存"}
            </button>
            {formStatus === "error" && (
              <span className="text-xs text-red-400">保存失败</span>
            )}
          </form>
        )}
      </div>

      {/* Token Consumption Chart Placeholder */}
      <div className="mt-6 rounded-xl border border-black/8 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] p-5">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <TrendingUp className="h-4 w-4 text-brand-cyan" /> Token 消耗趋势
        </h2>
        {loading ? (
          <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
            加载中...
          </div>
        ) : data.tokenData.length > 0 ? (
          <div className="h-48">
            {/* Simple bar visualization */}
            <div className="flex h-full items-end gap-1">
              {data.tokenData.map((d, i) => {
                const height = maxTokens > 0 ? ((d.totalTokens || 0) / maxTokens) * 100 : 0;
                const color = platformColor[d.platform] || "bg-gray-500";
                return (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t ${color} transition-all`}
                      style={{ height: `${Math.max(height, 2)}%` }}
                      title={`${d.platform}: ${d.totalTokens?.toLocaleString()} tokens`}
                    />
                  </div>
                );
              })}
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-muted-foreground/40">
              <span>{data.tokenData[0]?.date?.slice(5, 10) || ""}</span>
              <span>{data.tokenData[data.tokenData.length - 1]?.date?.slice(5, 10) || ""}</span>
            </div>
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center text-sm text-muted-foreground/40">
            暂无 Token 消耗记录 · 手动维护中
          </div>
        )}
        {/* Legend */}
        <div className="mt-3 flex flex-wrap gap-3">
          {[
            { name: "MiMo", color: "bg-emerald-500" },
            { name: "DeepSeek", color: "bg-blue-500" },
            { name: "Kimi", color: "bg-purple-500" },
          ].map((item) => (
            <span key={item.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={`h-2 w-2 rounded-full ${item.color}`} />
              {item.name}
            </span>
          ))}
        </div>
      </div>

      {/* GitHub Activity Placeholder */}
      <div className="mt-6 rounded-xl border border-black/8 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] p-5">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <GitBranch className="h-4 w-4" /> 最近代码活动
        </h2>
        <div className="flex items-center justify-center py-8 text-xs text-muted-foreground/40">
          配置 GITHUB_TOKEN 环境变量以启用 · 可选功能
        </div>
      </div>
    </div>
  );
}
