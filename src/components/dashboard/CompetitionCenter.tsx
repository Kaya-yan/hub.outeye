"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const competition = {
  name: "挑战杯揭榜挂帅",
  code: "XH-202620",
  status: "进行中",
  deadline: "2026-07-15",
  description: "学科垂类大模型与创新应用开发 · 揭榜挂帅赛道",
  team: "赵琰（负责人）",
  materials: [
    { name: "报名表", done: true },
    { name: "方案书", done: true },
    { name: "答辩PPT", done: false },
    { name: "演示视频", done: false },
  ],
};

export function CompetitionCenter() {
  const [expanded, setExpanded] = useState(false);
  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(competition.deadline).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24)
    )
  );

  const doneCount = competition.materials.filter((m) => m.done).length;

  return (
    <section className="rounded-xl border border-black/8 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] p-5">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          🏁 竞赛指挥中心
        </h2>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-brand-cyan transition-colors hover:text-brand-cyan/80"
        >
          {expanded ? "收起" : "查看详情"}
          {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      </div>
      <div className="mt-4 rounded-lg border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] p-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">🏆</span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{competition.name}</span>
              <span className="rounded bg-brand-cyan/10 px-2 py-0.5 text-xs text-brand-cyan">
                {competition.status}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              编号: {competition.code} · 答辩倒计时: {daysLeft} 天 · 材料 {doneCount}/{competition.materials.length}
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {competition.materials.map((m) => (
            <span
              key={m.name}
              className={`rounded-md px-2.5 py-1 text-xs ${
                m.done
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-black/5 dark:bg-white/5 text-muted-foreground"
              }`}
            >
              {m.done ? "✓" : "◯"} {m.name}
            </span>
          ))}
        </div>

        {expanded && (
          <div className="mt-4 border-t border-black/5 dark:border-white/5 pt-4 space-y-3">
            <div className="grid gap-2 sm:grid-cols-2 text-xs">
              <div>
                <span className="text-muted-foreground/60">赛道</span>
                <p className="mt-0.5">{competition.description}</p>
              </div>
              <div>
                <span className="text-muted-foreground/60">团队</span>
                <p className="mt-0.5">{competition.team}</p>
              </div>
              <div>
                <span className="text-muted-foreground/60">截止日期</span>
                <p className="mt-0.5">{competition.deadline}</p>
              </div>
              <div>
                <span className="text-muted-foreground/60">进度</span>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-cyan to-brand-violet"
                    style={{ width: `${(doneCount / competition.materials.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
