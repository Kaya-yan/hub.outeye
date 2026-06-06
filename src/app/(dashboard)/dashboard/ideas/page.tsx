"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Archive, CheckSquare, X, Lightbulb } from "lucide-react";

interface Idea {
  id: string;
  content: string;
  category: string | null;
  tags: string[];
  sourceUrl: string | null;
  hasImage: boolean;
  convertedToTask: string | null;
  createdAt: string;
}

const categoryOptions = [
  { value: "inbox", label: "#inbox（未分类）" },
  { value: "outeye2", label: "#outeye2" },
  { value: "outeye3", label: "#outeye3" },
  { value: "outeye4", label: "#outeye4" },
  { value: "challenge-cup", label: "#challenge-cup" },
  { value: "design", label: "#design" },
  { value: "hub", label: "#hub" },
  { value: "daily", label: "#daily" },
];

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "converted">("all");
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickContent, setQuickContent] = useState("");
  const [quickCategory, setQuickCategory] = useState("inbox");

  const fetchIdeas = useCallback(() => {
    fetch("/api/ideas")
      .then((r) => r.json())
      .then(setIdeas);
  }, []);

  useEffect(() => { fetchIdeas(); }, [fetchIdeas]);

  // Refresh list when global QuickIdeaOverlay saves
  useEffect(() => {
    const handler = () => fetchIdeas();
    window.addEventListener("idea-saved", handler);
    return () => window.removeEventListener("idea-saved", handler);
  }, [fetchIdeas]);

  async function addIdea() {
    if (!quickContent.trim()) return;
    const res = await fetch("/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: quickContent,
        category: quickCategory,
        sourceUrl: window.location.pathname,
      }),
    });
    const idea = await res.json();
    setIdeas([idea, ...ideas]);
    setQuickContent("");
    setQuickCategory("inbox");
    setShowQuickAdd(false);
  }

  async function convertToTask(id: string) {
    const res = await fetch("/api/ideas", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, convertToTask: true }),
    });
    const result = await res.json();
    setIdeas(ideas.map((i) => (i.id === id ? result.idea : i)));
  }

  async function deleteIdea(id: string) {
    await fetch("/api/ideas", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setIdeas(ideas.filter((i) => i.id !== id));
  }

  async function updateCategory(id: string, category: string) {
    const res = await fetch("/api/ideas", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, category }),
    });
    const updated = await res.json();
    setIdeas(ideas.map((i) => (i.id === id ? updated : i)));
  }

  const filteredIdeas = ideas.filter((idea) => {
    if (filter === "active") return !idea.convertedToTask;
    if (filter === "converted") return !!idea.convertedToTask;
    return true;
  });

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return `${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  }

  function openQuickAdd() {
    setShowQuickAdd(true);
  }

  return (
    <div className="p-6">
      {/* Quick Add Overlay */}
      {showQuickAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-black/8 dark:border-white/10 bg-background p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Lightbulb className="h-5 w-5 text-yellow-500" /> 快速记录灵感
              </h2>
              <button
                onClick={() => setShowQuickAdd(false)}
                className="rounded p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <textarea
              autoFocus
              value={quickContent}
              onChange={(e) => setQuickContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  addIdea();
                }
              }}
              placeholder="写下你的灵感，直接回车保存..."
              rows={4}
              className="mt-4 w-full resize-none rounded-lg border border-black/8 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-brand-cyan/30 focus:outline-none"
            />
            <div className="mt-3 flex items-center justify-between">
              <select
                value={quickCategory}
                onChange={(e) => setQuickCategory(e.target.value)}
                className="rounded-md border border-black/8 dark:border-white/10 bg-background px-3 py-1.5 text-sm"
              >
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowQuickAdd(false)}
                  className="rounded-md px-4 py-2 text-sm text-muted-foreground"
                >
                  取消
                </button>
                <button
                  onClick={addIdea}
                  disabled={!quickContent.trim()}
                  className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
                >
                  保存 (Enter)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">灵感收集</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ctrl + Shift + I 快速记录 · 默认 #inbox · 后续归类
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openQuickAdd}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> 记录新灵感
          </button>
          {(["all", "active", "converted"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1.5 text-xs transition-colors ${
                filter === f
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "全部" : f === "active" ? "未转化" : "已转化"}
            </button>
          ))}
        </div>
      </div>

      {/* Ideas List */}
      <div className="mt-6 space-y-2">
        {filteredIdeas.map((idea) => (
          <div
            key={idea.id}
            className={`group flex items-start justify-between rounded-xl border border-black/8 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] px-5 py-4 transition-all ${
              idea.convertedToTask ? "opacity-60" : ""
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground/40">
                  {formatDate(idea.createdAt)}
                </span>
                <select
                  value={idea.category || "inbox"}
                  onChange={(e) => updateCategory(idea.id, e.target.value)}
                  className="rounded bg-black/5 dark:bg-white/5 px-1.5 py-0.5 text-[10px] text-brand-cyan border-0 bg-transparent cursor-pointer"
                >
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {idea.convertedToTask && (
                  <span className="flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-400">
                    <CheckSquare className="h-3 w-3" /> 已转化为任务
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-sm leading-relaxed">{idea.content}</p>
            </div>
            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              {!idea.convertedToTask && (
                <button
                  onClick={() => convertToTask(idea.id)}
                  className="rounded p-1.5 text-muted-foreground hover:text-brand-cyan"
                  title="转化为任务"
                >
                  <CheckSquare className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => deleteIdea(idea.id)}
                className="rounded p-1.5 text-muted-foreground hover:text-red-400"
                title="删除"
              >
                <Archive className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredIdeas.length === 0 && (
          <div className="rounded-xl border border-dashed border-black/8 dark:border-white/10 py-16 text-center">
            <Lightbulb className="mx-auto h-8 w-8 text-muted-foreground/30" />
            <p className="mt-3 text-sm text-muted-foreground">
              {filter === "all" ? "暂无灵感记录" : "没有符合条件的灵感"}
            </p>
            <button
              onClick={openQuickAdd}
              className="mt-3 rounded-md bg-primary/10 px-4 py-2 text-sm text-primary transition-colors hover:bg-primary/20"
            >
              + 记录第一条灵感
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
