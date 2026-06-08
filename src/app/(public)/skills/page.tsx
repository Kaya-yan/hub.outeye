"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Skill {
  name: string;
  level: string;
  abbr: string;
  related?: string[];
  note?: string;
}

interface SkillGroup {
  category: string;
  color: string;
  skills: Skill[];
}

const skillGroups: SkillGroup[] = [
  {
    category: "前端",
    color: "#3B82F6",
    skills: [
      { name: "Next.js", level: "精通", abbr: "Nx", related: ["React", "Vercel"], note: "OutEye 全系列基座" },
      { name: "React", level: "精通", abbr: "Rc", related: ["Next.js", "TypeScript"] },
      { name: "TypeScript", level: "熟练", abbr: "TS", related: ["React", "Next.js"] },
      { name: "Tailwind", level: "精通", abbr: "Tw", related: ["shadcn/ui"] },
      { name: "shadcn/ui", level: "熟练", abbr: "sc", related: ["Tailwind", "React"] },
    ],
  },
  {
    category: "后端",
    color: "#10B981",
    skills: [
      { name: "Supabase", level: "熟练", abbr: "Sb", related: ["PostgreSQL"], note: "OutEye 2.0 数据层" },
      { name: "PostgreSQL", level: "了解", abbr: "Pg", related: ["Supabase", "Neon"] },
      { name: "Neon", level: "熟练", abbr: "Ne", related: ["PostgreSQL"], note: "ZhaoyanHub 数据库" },
      { name: "Vercel", level: "精通", abbr: "Vc", related: ["Next.js"] },
      { name: "GitHub", level: "精通", abbr: "Gh" },
    ],
  },
  {
    category: "AI",
    color: "#8B5CF6",
    skills: [
      { name: "DeepSeek", level: "精通", abbr: "DS", note: "OutEye 2.0 编码引擎" },
      { name: "Kimi", level: "精通", abbr: "Ki" },
      { name: "Claude", level: "精通", abbr: "Cl" },
      { name: "MiMo", level: "精通", abbr: "Mi", note: "月消耗 800 亿 Token" },
      { name: "ChatGPT", level: "精通", abbr: "Gt" },
      { name: "Gemini", level: "熟练", abbr: "Ge" },
    ],
  },
  {
    category: "平台",
    color: "#F59E0B",
    skills: [
      { name: "Hermes", level: "熟练", abbr: "Hr" },
      { name: "Trae", level: "熟练", abbr: "Tr" },
      { name: "Coze", level: "熟练", abbr: "Cz" },
      { name: "Observable", level: "熟练", abbr: "Ob" },
      { name: "Claude Code", level: "精通", abbr: "CC" },
    ],
  },
  {
    category: "语言",
    color: "#EF4444",
    skills: [
      { name: "中文", level: "母语", abbr: "中" },
      { name: "英语", level: "CEFR C1", abbr: "EN", note: "专业级阅读与写作" },
      { name: "土耳其语", level: "进阶", abbr: "TR" },
    ],
  },
];

const levelBar: Record<string, number> = {
  "精通": 100,
  "熟练": 72,
  "了解": 40,
  "母语": 100,
  "CEFR C1": 88,
  "进阶": 55,
};

export default function SkillsPage() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="text-4xl font-bold tracking-tight text-balance">技能与工具</h1>
      <p className="mt-2 text-muted-foreground">技术栈与能力矩阵</p>

      <div className="mt-14 space-y-14">
        {skillGroups.map((group) => (
          <section key={group.category}>
            {/* Category header */}
            <div className="mb-4 flex items-center gap-2.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: group.color }}
              />
              <h2 className="text-sm font-medium text-foreground">
                {group.category}
              </h2>
              <span className="text-xs text-muted-foreground">
                {group.skills.length} 项
              </span>
            </div>

            {/* Skills grid */}
            <div className="flex flex-wrap gap-2">
              {group.skills.map((skill, skillIdx) => {
                const isActive = active === `${group.category}-${skill.name}`;
                return (
                  <motion.button
                    key={skill.name}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: skillIdx * 0.06, ease: "easeOut" }}
                    onClick={() =>
                      setActive(isActive ? null : `${group.category}-${skill.name}`)
                    }
                    className={`
                      relative flex items-center gap-2 rounded-lg border px-3 py-2
                      text-left text-sm transition-colors duration-150
                      ${isActive
                        ? "border-foreground/20 bg-foreground/[0.04]"
                        : "border-black/6 dark:border-white/8 hover:border-foreground/15 hover:bg-foreground/[0.02]"
                      }
                    `}
                  >
                    {/* Abbreviation badge */}
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-[10px] font-bold"
                      style={{
                        background: `${group.color}15`,
                        color: group.color,
                      }}
                    >
                      {skill.abbr}
                    </span>

                    <div className="flex flex-col">
                      <span className="text-[13px] font-medium leading-tight">
                        {skill.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {skill.level}
                      </span>
                    </div>

                    {/* Level indicator bar */}
                    <div className="ml-auto h-1 w-8 overflow-hidden rounded-full bg-black/6 dark:bg-white/8">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${levelBar[skill.level] || 50}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 + skillIdx * 0.1, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ background: group.color }}
                      />
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Detail panel */}
            <AnimatePresence>
              {group.skills.map((skill) => {
                const key = `${group.category}-${skill.name}`;
                if (active !== key) return null;
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 rounded-lg border border-black/6 dark:border-white/8 bg-foreground/[0.02] p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium">{skill.name}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            掌握程度：{skill.level}
                          </p>
                          {skill.note && (
                            <p className="mt-1.5 text-xs text-muted-foreground">
                              {skill.note}
                            </p>
                          )}
                        </div>
                        {skill.related && skill.related.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {skill.related.map((r) => (
                              <span
                                key={r}
                                className="rounded bg-black/5 dark:bg-white/5 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                              >
                                {r}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </section>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-16 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span>5 个类别</span>
        <span className="text-muted-foreground/40">·</span>
        <span>{skillGroups.reduce((a, g) => a + g.skills.length, 0)} 项技能</span>
        <span className="text-muted-foreground/40">·</span>
        <span>点击展开详情</span>
      </div>
    </div>
  );
}
