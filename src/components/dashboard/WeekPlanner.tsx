"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

type TimeSlot = "morning" | "afternoon" | "evening";
type Category = "学习" | "竞赛" | "杂事";

interface WeeklyTask {
  id: string;
  weekStart: string;
  dayOfWeek: number;
  timeSlot: TimeSlot;
  title: string;
  category: Category;
  isDone: boolean;
}

interface OngoingTask {
  id: string;
  title: string;
  category: Category;
  status: string;
  updatedAt?: string;
}

const SLOT_LABELS: Record<TimeSlot, { icon: string; label: string }> = {
  morning: { icon: "🌅", label: "上午" },
  afternoon: { icon: "🌞", label: "下午" },
  evening: { icon: "🌙", label: "晚上" },
};

const DAY_NAMES = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

const CATEGORY_STYLES: Record<Category, { dot: string; bg: string; border: string }> = {
  "学习": { dot: "bg-blue-400", bg: "bg-blue-500/20", border: "border-blue-500/30" },
  "竞赛": { dot: "bg-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/30" },
  "杂事": { dot: "bg-slate-400", bg: "bg-slate-500/20", border: "border-slate-500/30" },
};

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatDate(d: Date): string {
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function WeekPlanner() {
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const [weeklyTasks, setWeeklyTasks] = useState<WeeklyTask[]>([]);
  const [ongoingTasks, setOngoingTasks] = useState<OngoingTask[]>([]);
  const [collapsedDone, setCollapsedDone] = useState<Record<Category, boolean>>({
    "学习": true,
    "竞赛": true,
    "杂事": true,
  });
  const [loading, setLoading] = useState(true);
  const [fading, setFading] = useState(false);
  const [addingSlot, setAddingSlot] = useState<{ day: number; slot: TimeSlot } | null>(null);
  const [addTitle, setAddTitle] = useState("");
  const [addCategory, setAddCategory] = useState<Category>("学习");
  const [showOngoingAdd, setShowOngoingAdd] = useState<Category | null>(null);
  const [ongoingTitle, setOngoingTitle] = useState("");
  const [showSchedule, setShowSchedule] = useState<string | null>(null);

  const today = new Date();
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const weekStartStr = weekStart.toISOString().split("T")[0];

  const fetchWeekly = useCallback(async () => {
    const res = await fetch(`/api/weekly-tasks?weekStart=${weekStartStr}`);
    const data = await res.json();
    setWeeklyTasks(Array.isArray(data) ? data : []);
  }, [weekStartStr]);

  const fetchOngoing = useCallback(async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setOngoingTasks(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => {
    setLoading(true);
    setFading(true);
    Promise.all([fetchWeekly(), fetchOngoing()]).then(() => {
      setLoading(false);
      setTimeout(() => setFading(false), 200);
    });
  }, [fetchWeekly, fetchOngoing]);

  function switchWeek(offset: number) {
    setFading(true);
    const d = new Date(weekStart);
    d.setDate(d.getDate() + offset);
    setWeekStart(d);
  }

  async function addWeeklyTask(day: number, slot: TimeSlot) {
    if (!addTitle.trim()) return;
    const res = await fetch("/api/weekly-tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weekStart: weekStartStr, dayOfWeek: day, timeSlot: slot, title: addTitle, category: addCategory }),
    });
    const task = await res.json();
    setWeeklyTasks((prev) => [...prev, task].sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.timeSlot.localeCompare(b.timeSlot)));
    setAddTitle("");
    setAddingSlot(null);
  }

  async function toggleWeeklyDone(task: WeeklyTask) {
    const res = await fetch("/api/weekly-tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: task.id, isDone: !task.isDone }),
    });
    const updated = await res.json();
    setWeeklyTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
  }

  async function deleteWeeklyTask(id: string) {
    await fetch("/api/weekly-tasks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setWeeklyTasks((prev) => prev.filter((t) => t.id !== id));
  }

  async function addOngoingTask() {
    if (!ongoingTitle.trim() || !showOngoingAdd) return;
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: ongoingTitle, category: showOngoingAdd }),
    });
    const task = await res.json();
    setOngoingTasks((prev) => [task, ...prev]);
    setOngoingTitle("");
    setShowOngoingAdd(null);
  }

  async function toggleOngoingDone(task: OngoingTask) {
    const newStatus = task.status === "done" ? "todo" : "done";
    const res = await fetch("/api/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: task.id, status: newStatus }),
    });
    const updated = await res.json();
    setOngoingTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...updated, updatedAt: updated.updatedAt } : t))
    );
  }

  function sortTasks(catTasks: OngoingTask[]): OngoingTask[] {
    const undone = catTasks.filter((t) => t.status !== "done");
    const done = catTasks
      .filter((t) => t.status === "done")
      .sort((a, b) =>
        new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
      );
    return [...undone, ...done];
  }

  async function scheduleOngoing(ongoingId: string, day: number, slot: TimeSlot) {
    const task = ongoingTasks.find((t) => t.id === ongoingId);
    if (!task) return;
    const res = await fetch("/api/weekly-tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weekStart: weekStartStr, dayOfWeek: day, timeSlot: slot, title: task.title, category: task.category }),
    });
    const scheduled = await res.json();
    setWeeklyTasks((prev) => [...prev, scheduled].sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.timeSlot.localeCompare(b.timeSlot)));
    setShowSchedule(null);
  }

  return (
    <section className="rounded-xl border border-black/8 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] p-5">
      {/* ─── 上半：本周日程 ─── */}
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-semibold">📋 本周日程</h2>
        <div className="flex items-center gap-1">
          <button onClick={() => switchWeek(-7)} className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => setWeekStart(getMonday(new Date()))} className="rounded px-2 py-0.5 text-[10px] text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            本周
          </button>
          <button onClick={() => switchWeek(7)} className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        {formatDate(weekStart)} — {formatDate(weekEnd)}
      </p>

      {/* 7 天骨架 — 始终展示 */}
      <div className={`space-y-2 transition-opacity duration-200 ${fading ? "opacity-50" : "opacity-100"}`}>
        {DAY_NAMES.map((dayName, i) => {
          const dayNum = i + 1;
          const dayDate = new Date(weekStart);
          dayDate.setDate(dayDate.getDate() + i);
          const isToday = isSameDay(dayDate, today);
          const dayTasks = weeklyTasks.filter((t) => t.dayOfWeek === dayNum);

          return (
            <div
              key={dayNum}
              className={`flex items-start gap-3 py-2.5 border-l-2 pl-3 transition-colors ${
                isToday ? "border-blue-500 bg-blue-500/[0.03] rounded-r-lg" : "border-transparent"
              }`}
            >
              {/* 左侧日期 */}
              <div className="w-16 shrink-0 pt-1">
                <div className="flex items-center gap-1.5">
                  <p className={`text-sm font-medium ${isToday ? "text-blue-400" : "text-foreground"}`}>{dayName}</p>
                  {isToday && (
                    <span className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">今天</span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">{formatDate(dayDate)}</p>
              </div>

              {/* 右侧三时段 — 始终显示为可见容器 */}
              <div className="flex-1 grid grid-cols-3 gap-2">
                {(["morning", "afternoon", "evening"] as TimeSlot[]).map((slot) => {
                  const slotTasks = dayTasks.filter((t) => t.timeSlot === slot);
                  const isAdding = addingSlot?.day === dayNum && addingSlot?.slot === slot;
                  const hasTasks = slotTasks.length > 0;

                  return (
                    <div
                      key={slot}
                      className={`rounded-lg border p-2.5 min-h-[60px] transition-all duration-200 cursor-pointer ${
                        isAdding
                          ? "border-blue-500/50 bg-slate-800/80"
                          : "border-white/5 bg-slate-900/40 hover:border-blue-500/30 hover:bg-slate-800/40"
                      }`}
                      onClick={() => {
                        if (!isAdding && !hasTasks) setAddingSlot({ day: dayNum, slot });
                      }}
                    >
                      {/* 时段标识 — 始终保留 */}
                      <div className="flex items-center gap-1 mb-1.5">
                        <span className={`text-xs ${hasTasks ? "text-slate-500" : "text-slate-700"}`}>
                          {SLOT_LABELS[slot].icon} {SLOT_LABELS[slot].label}
                        </span>
                      </div>

                      {/* 任务列表 */}
                      <div className="space-y-0.5">
                        {slotTasks.map((task) => {
                          const cs = CATEGORY_STYLES[task.category] || CATEGORY_STYLES["学习"];
                          return (
                            <div
                              key={task.id}
                              className={`group flex items-center gap-1.5 rounded px-1.5 py-1 ${cs.bg} cursor-pointer transition-all duration-200 ${
                                task.isDone ? "opacity-50 line-through" : ""
                              }`}
                              onClick={() => toggleWeeklyDone(task)}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${cs.dot} shrink-0`} />
                              <span className="text-xs text-foreground truncate flex-1">{task.title}</span>
                              <button
                                onClick={(e) => { e.stopPropagation(); deleteWeeklyTask(task.id); }}
                                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 text-[10px] shrink-0"
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}

                        {/* 就地输入框 */}
                        {isAdding ? (
                          <div className="flex gap-1 mt-0.5">
                            <input
                              autoFocus
                              value={addTitle}
                              onChange={(e) => setAddTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") addWeeklyTask(dayNum, slot);
                                if (e.key === "Escape") setAddingSlot(null);
                              }}
                              onBlur={() => { if (addTitle.trim()) addWeeklyTask(dayNum, slot); else setAddingSlot(null); }}
                              placeholder="任务..."
                              className="flex-1 rounded border border-blue-500/50 bg-slate-800/80 px-1.5 py-0.5 text-xs text-foreground placeholder:text-slate-600 focus:outline-none"
                            />
                            <select
                              value={addCategory}
                              onChange={(e) => setAddCategory(e.target.value as Category)}
                              className="rounded border border-white/10 bg-slate-800/80 px-1 py-0.5 text-[10px] text-foreground"
                            >
                              <option value="学习">📚</option>
                              <option value="竞赛">🏆</option>
                              <option value="杂事">🔧</option>
                            </select>
                          </div>
                        ) : (
                          /* 空时段占位提示 + [+] 按钮 */
                          !hasTasks ? (
                            <p className="text-[10px] text-slate-800 text-center mt-1">点击添加</p>
                          ) : (
                            <button
                              onClick={(e) => { e.stopPropagation(); setAddingSlot({ day: dayNum, slot }); }}
                              className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors mt-0.5"
                            >
                              +
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── 分隔线 ─── */}
      <div className="border-t border-black/5 dark:border-white/5 mt-6 pt-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold">🔄 推进持续</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4">不绑定具体日期的长期事项</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(["学习", "竞赛", "杂事"] as Category[]).map((cat) => {
            const cs = CATEGORY_STYLES[cat];
            const allTasks = ongoingTasks.filter((t) => t.category === cat);
            const sortedTasks = sortTasks(allTasks);
            const undoneTasks = allTasks.filter((t) => t.status !== "done");
            const doneTasks = allTasks.filter((t) => t.status === "done");
            const allDone = allTasks.length > 0 && undoneTasks.length === 0;
            const icons: Record<Category, string> = { "学习": "📚", "竞赛": "🏆", "杂事": "🔧" };

            return (
              <div key={cat} className="rounded-lg border border-black/8 dark:border-white/10 overflow-hidden">
                {/* 卡片头部 */}
                <div className={`px-3 py-2 border-b-2 ${cs.border} bg-black/[0.02] dark:bg-white/[0.02]`}>
                  <span className="text-sm font-medium">{icons[cat]} {cat}类</span>
                </div>

                {/* 任务列表 */}
                <div className="p-2 space-y-0.5 min-h-[80px]">
                  {sortedTasks.length === 0 ? (
                    <>
                      {/* 骨架占位线 */}
                      <div className="space-y-2 py-2 px-2">
                        <div className="h-2 w-3/4 rounded bg-slate-800/50" />
                        <div className="h-2 w-1/2 rounded bg-slate-800/50" />
                        <div className="h-2 w-2/3 rounded bg-slate-800/50" />
                      </div>
                      {showOngoingAdd === cat ? (
                        <div className="flex gap-1 mt-1 px-1">
                          <input
                            autoFocus
                            value={ongoingTitle}
                            onChange={(e) => setOngoingTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") addOngoingTask();
                              if (e.key === "Escape") setShowOngoingAdd(null);
                            }}
                            onBlur={() => { if (ongoingTitle.trim()) addOngoingTask(); else setShowOngoingAdd(null); }}
                            placeholder={`${cat}任务...`}
                            className="flex-1 rounded border border-black/8 dark:border-white/10 bg-background px-2 py-1 text-xs focus:outline-none focus:border-brand-cyan/30"
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowOngoingAdd(cat)}
                          className="w-full rounded py-1 text-xs text-slate-600 hover:text-slate-400 transition-colors"
                        >
                          + 添加你的第一个{cat}任务
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      {/* All done empty state */}
                      {allDone && (
                        <p className="text-xs text-slate-500 text-center py-3">本周该分类暂无待办 ✓</p>
                      )}

                      {sortedTasks.map((task) => {
                        const isDone = task.status === "done";

                        // Skip done tasks on mobile when collapsed
                        if (isDone && collapsedDone[cat]) return null;

                        return (
                          <motion.div
                            key={task.id}
                            layout
                            transition={{ type: "spring", stiffness: 500, damping: 35, mass: 1 }}
                            className={`group flex items-center gap-2 rounded px-2 py-1.5 transition-all duration-200 cursor-pointer ${
                              isDone
                                ? "opacity-40 hover:opacity-60"
                                : "hover:bg-black/5 dark:hover:bg-white/5"
                            }`}
                            onClick={() => toggleOngoingDone(task)}
                          >
                            {/* Check / dot */}
                            {isDone ? (
                              <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <span className={`h-1.5 w-1.5 rounded-full ${cs.dot} shrink-0`} />
                            )}

                            {/* Title */}
                            <span
                              className={`text-sm flex-1 truncate ${
                                isDone
                                  ? "text-slate-400 line-through"
                                  : "text-muted-foreground group-hover:text-foreground"
                              }`}
                            >
                              {task.title}
                            </span>

                            {/* Actions — hidden for done tasks */}
                            {!isDone && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowSchedule(showSchedule === task.id ? null : task.id);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 text-[10px] text-muted-foreground hover:text-brand-cyan shrink-0"
                                  title="排入本周"
                                >
                                  📅
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleOngoingDone(task);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 text-[10px] text-muted-foreground hover:text-emerald-400 shrink-0"
                                  title="标记完成"
                                >
                                  ✓
                                </button>
                              </>
                            )}
                          </motion.div>
                        );
                      })}

                      {/* 排入日程选择器 */}
                      {showSchedule && ongoingTasks.some((t) => t.id === showSchedule) && (
                        <div className="mt-1 rounded border border-black/8 dark:border-white/10 bg-background p-2">
                          <p className="text-[10px] text-muted-foreground mb-1.5">排入哪天？</p>
                          <div className="grid grid-cols-7 gap-0.5">
                            {DAY_NAMES.map((dn, i) => (
                              <button
                                key={i}
                                onClick={() => scheduleOngoing(showSchedule, i + 1, "morning")}
                                className="rounded px-1 py-0.5 text-[10px] text-muted-foreground hover:bg-brand-cyan/10 hover:text-brand-cyan transition-colors"
                              >
                                {dn}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Mobile collapse toggle for done tasks */}
                      {doneTasks.length > 0 && (
                        <button
                          onClick={() =>
                            setCollapsedDone((prev) => ({
                              ...prev,
                              [cat]: !prev[cat],
                            }))
                          }
                          className="w-full text-[10px] text-slate-500 hover:text-slate-400 py-1 transition-colors sm:hidden"
                        >
                          {collapsedDone[cat]
                            ? `显示 ${doneTasks.length} 个已完成任务`
                            : `收起已完成任务`}
                        </button>
                      )}

                      {/* 添加按钮 */}
                      {showOngoingAdd === cat ? (
                        <div className="flex gap-1 mt-1">
                          <input
                            autoFocus
                            value={ongoingTitle}
                            onChange={(e) => setOngoingTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") addOngoingTask();
                              if (e.key === "Escape") setShowOngoingAdd(null);
                            }}
                            onBlur={() => { if (ongoingTitle.trim()) addOngoingTask(); else setShowOngoingAdd(null); }}
                            placeholder={`${cat}任务...`}
                            className="flex-1 rounded border border-black/8 dark:border-white/10 bg-background px-2 py-1 text-xs focus:outline-none focus:border-brand-cyan/30"
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowOngoingAdd(cat)}
                          className="w-full rounded py-1 text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                        >
                          + 添加
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
