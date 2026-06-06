"use client";

import { useEffect, useState } from "react";
import { Plus, TrendingUp, AlertTriangle, Wallet } from "lucide-react";

interface Budget {
  id: string;
  platform: string;
  totalBudget: number;
  used: number;
  unit: string;
  alertThreshold: number;
}

const platformLabels: Record<string, { name: string; emoji: string; color: string }> = {
  mimo: { name: "MiMo（小米激励计划）", emoji: "🤖", color: "from-emerald-500 to-teal-500" },
  deepseek: { name: "DeepSeek", emoji: "🔍", color: "from-blue-500 to-cyan-500" },
  moonshot: { name: "Kimi", emoji: "🌙", color: "from-purple-500 to-violet-500" },
  anthropic: { name: "Claude", emoji: "🧠", color: "from-orange-500 to-amber-500" },
};

export default function AiBudgetPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    platform: "mimo",
    totalBudget: "",
    used: "",
    unit: "tokens",
    alertThreshold: "80",
  });
  const [manualEntry, setManualEntry] = useState<{
    platform: string;
    amount: string;
    purpose: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/budget")
      .then((r) => r.json())
      .then(setBudgets);
  }, []);

  async function addBudget() {
    const res = await fetch("/api/budget", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        totalBudget: parseInt(form.totalBudget),
        used: parseInt(form.used || "0"),
        alertThreshold: parseInt(form.alertThreshold),
      }),
    });
    const budget = await res.json();
    setBudgets([...budgets, budget]);
    setShowAdd(false);
    setForm({ platform: "mimo", totalBudget: "", used: "", unit: "tokens", alertThreshold: "80" });
  }

  async function updateUsed(id: string, additionalUsed: number) {
    const budget = budgets.find((b) => b.id === id);
    if (!budget) return;
    const res = await fetch("/api/budget", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, used: budget.used + additionalUsed }),
    });
    const updated = await res.json();
    setBudgets(budgets.map((b) => (b.id === id ? updated : b)));
  }

  async function deleteBudget(id: string) {
    await fetch("/api/budget", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setBudgets(budgets.filter((b) => b.id !== id));
  }

  function formatTokens(n: number): string {
    if (n >= 1e12) return `${(n / 1e12).toFixed(1)}T`;
    if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
    if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
    if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
    return n.toString();
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI 额度监控台</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            MiMo 进度条 · DeepSeek/Kimi/Claude 费用手动记录 · 预警设置
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> 添加额度
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="mt-6 rounded-xl border border-black/8 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] p-6">
          <h2 className="mb-4 text-lg font-semibold">添加额度监控</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">平台</label>
              <select
                value={form.platform}
                onChange={(e) => setForm({ ...form, platform: e.target.value })}
                className="w-full rounded-md border border-black/8 dark:border-white/10 bg-background px-3 py-2 text-sm"
              >
                {Object.entries(platformLabels).map(([k, v]) => (
                  <option key={k} value={k}>{v.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">总额度</label>
              <input
                type="number"
                value={form.totalBudget}
                onChange={(e) => setForm({ ...form, totalBudget: e.target.value })}
                placeholder="如 800000000000"
                className="w-full rounded-md border border-black/8 dark:border-white/10 bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">已使用</label>
              <input
                type="number"
                value={form.used}
                onChange={(e) => setForm({ ...form, used: e.target.value })}
                placeholder="0"
                className="w-full rounded-md border border-black/8 dark:border-white/10 bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">预警阈值 (%)</label>
              <input
                type="number"
                value={form.alertThreshold}
                onChange={(e) => setForm({ ...form, alertThreshold: e.target.value })}
                className="w-full rounded-md border border-black/8 dark:border-white/10 bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={addBudget} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
              保存
            </button>
            <button onClick={() => setShowAdd(false)} className="rounded-md px-4 py-2 text-sm text-muted-foreground">
              取消
            </button>
          </div>
        </div>
      )}

      {/* Manual Entry */}
      {manualEntry && (
        <div className="mt-6 rounded-xl border border-black/8 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] p-6">
          <h2 className="mb-4 text-lg font-semibold">
            手动记账 · {platformLabels[manualEntry.platform]?.name}
          </h2>
          <div className="flex gap-4">
            <input
              type="number"
              value={manualEntry.amount}
              onChange={(e) => setManualEntry({ ...manualEntry, amount: e.target.value })}
              placeholder="消耗量"
              className="flex-1 rounded-md border border-black/8 dark:border-white/10 bg-background px-3 py-2 text-sm"
            />
            <input
              value={manualEntry.purpose}
              onChange={(e) => setManualEntry({ ...manualEntry, purpose: e.target.value })}
              placeholder="用途"
              className="flex-1 rounded-md border border-black/8 dark:border-white/10 bg-background px-3 py-2 text-sm"
            />
            <button
              onClick={() => {
                const budget = budgets.find((b) => b.platform === manualEntry.platform);
                if (budget && manualEntry.amount) {
                  updateUsed(budget.id, parseInt(manualEntry.amount));
                }
                setManualEntry(null);
              }}
              className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
            >
              记录
            </button>
            <button
              onClick={() => setManualEntry(null)}
              className="rounded-md px-4 py-2 text-sm text-muted-foreground"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* Budget Cards */}
      <div className="mt-6 space-y-4">
        {budgets.map((budget) => {
          const meta = platformLabels[budget.platform] || {
            name: budget.platform,
            emoji: "💰",
            color: "from-gray-500 to-gray-600",
          };
          const percent = budget.totalBudget > 0 ? (budget.used / budget.totalBudget) * 100 : 0;
          const remaining = budget.totalBudget - budget.used;
          const isWarning = percent >= budget.alertThreshold;

          return (
            <div
              key={budget.id}
              className="rounded-xl border border-black/8 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{meta.emoji}</span>
                  <div>
                    <h3 className="font-semibold">{meta.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      阈值: {budget.alertThreshold}%
                    </p>
                  </div>
                </div>
                {isWarning && (
                  <span className="flex items-center gap-1 rounded bg-yellow-500/10 px-2 py-1 text-xs text-yellow-500">
                    <AlertTriangle className="h-3 w-3" /> 即将耗尽
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatTokens(budget.used)} / {formatTokens(budget.totalBudget)}</span>
                  <span>{percent.toFixed(1)}%</span>
                </div>
                <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${meta.color} transition-all`}
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>剩余: {formatTokens(remaining)}</span>
                  <button
                    onClick={() => setManualEntry({ platform: budget.platform, amount: "", purpose: "" })}
                    className="text-brand-cyan hover:underline"
                  >
                    手动记账+
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {budgets.length === 0 && (
          <div className="rounded-xl border border-dashed border-black/8 dark:border-white/10 py-16 text-center">
            <Wallet className="mx-auto h-8 w-8 text-muted-foreground/30" />
            <p className="mt-3 text-sm text-muted-foreground">
              暂无额度监控
            </p>
            <p className="mt-1 text-xs text-muted-foreground/40">
              点击"添加额度"开始监控 AI 平台消耗
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
