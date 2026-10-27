"use client";

import { motion } from "framer-motion";

const projects = [
  {
    name: "OutEye 2.0",
    codename: "OutSight",
    folder: "outeye2",
    description:
      "外媒中国报道话语研究平台：语料采集、AI 辅助编码到统计分析的全流程工具，双编码信度检验。",
    status: "运行中",
    statusColor: "bg-emerald-500",
    stats: "21,381 篇语料 · 17 维 AI 分析",
    mockup: "macbook",
    techTags: ["Next.js", "Supabase", "DeepSeek", "Playwright"],
    links: [
      { label: "访问站点", href: "https://v2.outeye.top" },
      { label: "GitHub", href: "https://github.com/Kaya-yan/outsight-project" },
    ],
  },
  {
    name: "OutEye 3.0",
    codename: "OutEdu",
    folder: "outeye3",
    description:
      "面向外语教师的智能教研工作台：上传课文获得词汇 / 句法 / 语篇 / 认知负荷六维分析，生成证据可溯源的教案。挑战杯「揭榜挂帅」参赛系统。",
    status: "运行中",
    statusColor: "bg-emerald-500",
    stats: "12 大理论工程化 · 80+ 后端测试",
    mockup: "ipad",
    techTags: ["RAG", "LLM Wiki", "教育", "NLP"],
    links: [{ label: "访问站点", href: "https://edu.outeye.top" }],
  },
  {
    name: "OutEye 4.0",
    codename: "Pulse",
    folder: "outeye4",
    description:
      "文化记忆传播效果分析工作台：多平台评论采集 → AI 六维分析 → t 检验与效应量统计报告的研究闭环。",
    status: "运行中",
    statusColor: "bg-emerald-500",
    stats: "6 维分析 · 小红书 / B 站",
    mockup: "iphone",
    techTags: ["Playwright", "Bookmarklet", "情感分析", "统计检验"],
    links: [{ label: "访问站点", href: "https://yh.outeye.top" }],
  },
  {
    name: "太虚册",
    codename: "Honglou Shiyi",
    folder: "honglou",
    description:
      "红楼梦互动叙事网页游戏：五境游园、清代工笔重彩美术、VR 360° 全景对话与 381 人关系星图。数字媒体科技作品赛参赛作品。",
    status: "运行中",
    statusColor: "bg-emerald-500",
    stats: "99 件美术 · 485 剧情节点 · 146 张 E2E 截图",
    mockup: "macbook",
    techTags: ["Next.js", "叙事引擎", "工笔重彩", "VR"],
    links: [
      { label: "访问站点", href: "https://honglou-shiyi.outeye.top" },
      { label: "GitHub", href: "https://github.com/Kaya-yan/honglou" },
    ],
  },
];

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="text-4xl font-bold tracking-tight">OutEye 系列项目</h1>
      <p className="mt-2 text-muted-foreground">
        外眼系列与作品矩阵 · 全部在线运行 ·{" "}
        <a
          href="https://lab.outeye.top"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-foreground"
        >
          平台总览见 lab.outeye.top
        </a>
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

                <p className="mt-2 text-xs text-muted-foreground">{project.stats}</p>
              </div>

              {/* Links */}
              <div className="mt-6 flex gap-3">
                {project.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md border border-black/8 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-brand-cyan/20 hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
