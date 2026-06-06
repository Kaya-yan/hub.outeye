"use client";

import { useState, useEffect, useCallback } from "react";

interface Task {
  id: string;
  title: string;
  project: string;
  priority: "high" | "medium" | "low";
  dueDate: string | null;
  status: "todo" | "in_progress" | "done";
}

const priorityConfig = {
  high: { emoji: "🔴", label: "高" },
  medium: { emoji: "🟡", label: "中" },
  low: { emoji: "🟢", label: "低" },
};

const projectLabels: Record<string, string> = {
  outeye2: "OutEye 2.0",
  outeye3: "OutEye 3.0",
  outeye4: "OutEye 4.0",
  "challenge-cup": "挑战杯",
  hub: "Hub",
};

export function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newProject, setNewProject] = useState("outeye4");
  const [newPriority, setNewPriority] = useState<"high" | "medium" | "low">("medium");

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      if (Array.isArray(data)) setTasks(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  async function addTask() {
    if (!newTitle.trim()) return;
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, project: newProject, priority: newPriority }),
    });
    const task = await res.json();
    setTasks([task, ...tasks]);
    setNewTitle("");
    setShowAdd(false);
  }

  async function toggleDone(id: string) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const newStatus = task.status === "done" ? "todo" : "done";
    const res = await fetch("/api/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });
    const updated = await res.json();
    setTasks(tasks.map((t) => (t.id === id ? updated : t)));
  }

  async function deleteTask(id: string) {
    await fetch("/api/tasks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setTasks(tasks.filter((t) => t.id !== id));
  }

  return (
    <section className="rounded-xl border border-black/8 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] p-5">
      <h2 className="mb-3 text-lg font-semibold">📋 今日任务</h2>
      <div className="space-y-2">
        {loading ? (
          <div className="py-8 text-center text-xs text-muted-foreground/40">加载中...</div>
        ) : tasks.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground/40">
            暂无任务 · 点击下方「+ 添加新任务」开始管理你的待办事项
          </div>
        ) : tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center justify-between rounded-lg border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] px-4 py-2.5 transition-all ${
              task.status === "done" ? "opacity-50" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <span>{priorityConfig[task.priority].emoji}</span>
              <div>
                <span
                  className={`text-sm ${task.status === "done" ? "line-through" : ""}`}
                >
                  {task.title}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-muted-foreground/60">
                    {projectLabels[task.project] || task.project}
                  </span>
                  {task.dueDate && (
                    <span className="text-[10px] text-muted-foreground/40">
                      截止 {task.dueDate}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => toggleDone(task.id)}
                className="rounded px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
              >
                {task.status === "done" ? "恢复" : "完成"}
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="rounded px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400"
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAdd ? (
        <div className="mt-3 flex gap-2">
          <input
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="任务标题..."
            className="flex-1 rounded-md border border-black/8 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:border-brand-cyan/30 focus:outline-none"
          />
          <select
            value={newProject}
            onChange={(e) => setNewProject(e.target.value)}
            className="rounded-md border border-black/8 dark:border-white/10 bg-background px-2 py-1.5 text-sm"
          >
            {Object.entries(projectLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value as "high" | "medium" | "low")}
            className="rounded-md border border-black/8 dark:border-white/10 bg-background px-2 py-1.5 text-sm"
          >
            <option value="high">🔴 高</option>
            <option value="medium">🟡 中</option>
            <option value="low">🟢 低</option>
          </select>
          <button
            onClick={addTask}
            className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"
          >
            添加
          </button>
          <button
            onClick={() => setShowAdd(false)}
            className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            取消
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="mt-3 w-full rounded-lg border border-dashed border-black/8 dark:border-white/10 py-2 text-sm text-muted-foreground transition-colors hover:border-black/15 dark:hover:border-white/20 hover:text-foreground"
        >
          + 添加新任务
        </button>
      )}
    </section>
  );
}
