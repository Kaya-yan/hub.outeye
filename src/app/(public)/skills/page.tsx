"use client";

import { motion } from "framer-motion";

const skillGroups = [
  {
    category: "前端开发",
    skills: [
      { name: "Next.js", level: "精通", icon: "▲" },
      { name: "React", level: "精通", icon: "⚛" },
      { name: "TypeScript", level: "熟练", icon: "TS" },
      { name: "Tailwind", level: "精通", icon: "🎨" },
      { name: "shadcn/ui", level: "熟练", icon: "◆" },
    ],
  },
  {
    category: "后端与数据库",
    skills: [
      { name: "Supabase", level: "熟练", icon: "⚡" },
      { name: "PostgreSQL", level: "了解", icon: "🐘" },
      { name: "Neon", level: "熟练", icon: "☁" },
      { name: "Vercel", level: "精通", icon: "△" },
      { name: "GitHub", level: "精通", icon: "⌨" },
    ],
  },
  {
    category: "AI 工具",
    skills: [
      { name: "DeepSeek", level: "精通", icon: "DS" },
      { name: "Kimi", level: "精通", icon: "K" },
      { name: "Claude", level: "精通", icon: "C" },
      { name: "MiMo", level: "精通", icon: "M" },
      { name: "ChatGPT", level: "精通", icon: "G" },
      { name: "Gemini", level: "熟练", icon: "Ge" },
    ],
  },
  {
    category: "AI 平台与工作流",
    skills: [
      { name: "Hermes", level: "熟练", icon: "H" },
      { name: "Trae", level: "熟练", icon: "Tr" },
      { name: "Coze", level: "熟练", icon: "Cz" },
      { name: "Observable", level: "熟练", icon: "◉" },
    ],
  },
  {
    category: "语言",
    skills: [
      { name: "英语", level: "专业级", icon: "EN", sub: "CEFR C1" },
      { name: "土耳其语", level: "进阶", icon: "TR" },
      { name: "中文", level: "母语", icon: "中" },
    ],
  },
];

const levelColor: Record<string, string> = {
  "精通": "bg-gradient-to-r from-brand-cyan to-brand-violet",
  "熟练": "bg-zinc-400 dark:bg-white/40",
  "了解": "bg-zinc-300 dark:bg-white/20",
  "专业级": "bg-gradient-to-r from-brand-cyan to-brand-violet",
  "进阶": "bg-zinc-400 dark:bg-white/40",
  "母语": "bg-gradient-to-r from-brand-cyan to-brand-violet",
};

function getLevelWidth(level: string): string {
  if (level === "精通" || level === "专业级" || level === "母语") return "100%";
  if (level === "熟练" || level === "进阶") return "70%";
  return "40%";
}

export default function SkillsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="text-4xl font-bold tracking-tight">技能与工具</h1>
      <p className="mt-2 text-muted-foreground">技术栈与能力图谱</p>

      <div className="mt-12 space-y-12">
        {skillGroups.map((group, gi) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: gi * 0.1 }}
          >
            <h2 className="mb-4 text-sm font-medium text-muted-foreground">
              {group.category}
            </h2>
            <div className="flex flex-wrap gap-3">
              {group.skills.map((skill) => (
                <div
                  key={skill.name}
                  className="group relative flex w-[88px] flex-col items-center gap-2 rounded-xl surface-card p-3 transition-all duration-300 hover:-translate-y-1 hover:border-brand-cyan/20 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)]"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/5 dark:bg-white/5 text-sm font-bold text-muted-foreground transition-colors group-hover:text-foreground">
                    {skill.icon}
                  </div>
                  <span className="text-[11px] font-medium text-foreground leading-tight text-center">
                    {skill.name}
                  </span>
                  <div className="h-0.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10">
                    <div
                      className={`h-full rounded-full ${levelColor[skill.level] || "bg-white/30"}`}
                      style={{ width: getLevelWidth(skill.level) }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {skill.sub || skill.level}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
