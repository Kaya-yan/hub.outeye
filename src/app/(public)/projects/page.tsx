"use client";

import { motion } from "framer-motion";

const projects = [
  {
    name: "OutEye 2.0",
    codename: "OutSight",
    folder: "outeye2",
    description:
      "话语研究协作平台，提供从语料采集、AI 辅助编码到统计分析的全流程工具。21,381 篇语料，支持 AI 八维度自动化分析。",
    status: "运行中",
    statusColor: "bg-emerald-500",
    stats: "21,381 篇语料 · 45,672 词汇",
    mockup: "macbook",
    techTags: ["Next.js", "Supabase", "DeepSeek", "Playwright"],
    links: [
      { label: "GitHub", href: "https://github.com/Kaya-yan/outsight-project" },
    ],
  },
  {
    name: "OutEye 3.0",
    codename: "OutEdu",
    folder: "outeye3",
    description:
      "基于大模型与 RAG 的全学段外语智能教研平台。方案阶段，已完成系统架构与 RAG 流程设计。",
    status: "方案阶段",
    statusColor: "bg-yellow-500",
    stats: "60% 完成",
    mockup: "ipad",
    techTags: ["RAG", "LLM", "教育", "NLP"],
    links: [],
    phaseInfo: [
      { label: "系统架构", done: true },
      { label: "RAG 流程", done: true },
      { label: "原型设计", done: false },
      { label: "开发实现", done: false },
    ],
  },
  {
    name: "OutEye 4.0",
    codename: "Pulse",
    folder: "outeye4",
    description:
      "多平台评论采集与情感分析，Bookmarklet + Playwright 双轨。实时追踪舆情数据，支持多维度可视化展示。",
    status: "开发中",
    statusColor: "bg-blue-500",
    stats: "200 条评论",
    mockup: "iphone",
    techTags: ["Playwright", "Bookmarklet", "情感分析", "可视化"],
    links: [
      { label: "GitHub", href: "#" },
    ],
    comingSoon: true,
  },
];

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="text-4xl font-bold tracking-tight">OutEye 系列项目</h1>
      <p className="mt-2 text-muted-foreground">
        从话语研究到舆情分析，四个 AI 产品覆盖全流程
      </p>

      <div className="mt-12 space-y-16">
        {projects.map((project, i) => (
          <motion.div
            key={project.codename}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className="group relative overflow-hidden rounded-xl surface-card p-8 transition-all duration-300 hover:border-brand-cyan/20 hover:shadow-[0_0_40px_rgba(6,182,212,0.08)]">
              {/* Screenshot */}
              <div className="mb-8 flex aspect-video items-center justify-center rounded-lg border border-black/5 dark:border-white/5 bg-gradient-to-br from-black/[0.03] dark:from-white/[0.03] to-transparent">
                <img
                  src={`/assets/images/projects/${project.folder}/screenshot-1.jpg`}
                  alt={`${project.name} 截图`}
                  className="max-h-full max-w-full rounded object-contain"
                />
              </div>

              {/* Info */}
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold">{project.name}</h2>
                  <span className="text-sm text-muted-foreground">
                    · {project.codename}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-black/5 dark:bg-white/5 px-2.5 py-0.5 text-xs">
                    <span className={`h-1.5 w-1.5 rounded-full ${project.statusColor}`} />
                    {project.status}
                  </span>
                </div>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  {project.description}
                </p>

                {/* Tech Tags */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.techTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-black/5 dark:bg-white/5 px-2 py-0.5 text-[10px] text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Phase Info for OutEye 3.0 */}
                {project.phaseInfo && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.phaseInfo.map((p) => (
                      <span
                        key={p.label}
                        className={`rounded-md px-2.5 py-1 text-xs ${
                          p.done
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-black/5 dark:bg-white/5 text-muted-foreground"
                        }`}
                      >
                        {p.done ? "✓" : "◯"} {p.label}
                      </span>
                    ))}
                  </div>
                )}

                <p className="mt-2 text-xs text-muted-foreground">{project.stats}</p>
              </div>

              {/* Links */}
              <div className="mt-6 flex gap-3">
                {project.links.map((link) =>
                  project.comingSoon && link.href === "#" ? (
                    <button
                      key={link.label}
                      onClick={() => {
                        const existing = document.querySelector("[data-toast]");
                        if (existing) existing.remove();
                        const toast = document.createElement("div");
                        toast.setAttribute("data-toast", "");
                        toast.className =
                          "fixed bottom-6 right-6 z-50 rounded-lg bg-background border border-black/8 dark:border-white/10 px-4 py-3 text-sm shadow-lg";
                        toast.textContent = "敬请期待，项目开发中";
                        document.body.appendChild(toast);
                        setTimeout(() => toast.remove(), 2500);
                      }}
                      className="rounded-md border border-black/8 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-brand-cyan/20 hover:text-foreground"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md border border-black/8 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-brand-cyan/20 hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  )
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
