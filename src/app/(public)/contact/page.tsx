"use client";

import { motion } from "framer-motion";
import { Mail, GitFork, GraduationCap, FlaskConical, ExternalLink } from "lucide-react";

const contacts = [
  {
    icon: Mail,
    label: "邮箱",
    value: "Kaya-yan@outlook.com",
    href: "mailto:Kaya-yan@outlook.com",
    color: "text-brand-cyan",
  },
  {
    icon: GitFork,
    label: "GitHub",
    value: "github.com/Kaya-yan",
    href: "https://github.com/Kaya-yan",
    color: "text-foreground",
  },
  {
    icon: GraduationCap,
    label: "学校",
    value: "山东大学（威海）翻译学院",
    href: null,
    color: "text-brand-violet",
  },
  {
    icon: FlaskConical,
    label: "方向",
    value: "AI × 语言研究",
    href: null,
    color: "text-emerald-400",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold tracking-tight">联系方式</h1>
        <p className="mt-2 text-muted-foreground">
          欢迎通过以下方式联系我，通常 24 小时内回复
        </p>
      </motion.div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {contacts.map((item, i) => {
          const Icon = item.icon;
          const Wrapper = item.href ? "a" : "div";
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
            >
              <Wrapper
                {...(item.href
                  ? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group flex items-start gap-4 rounded-xl surface-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-cyan/20"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 dark:bg-white/5 ${item.color} transition-colors`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="mt-0.5 text-sm font-medium truncate">{item.value}</p>
                </div>
                {item.href && (
                  <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground/30 opacity-0 transition-opacity group-hover:opacity-100" />
                )}
              </Wrapper>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-12 rounded-xl surface-card p-6"
      >
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">合作与交流</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>如果你对 OutEye 系列产品、话语分析 AI 工具、或挑战杯项目感兴趣，欢迎邮件交流。</p>
          <p>也欢迎在 GitHub 上提 Issue 或 PR，共同改进开源工具。</p>
        </div>
      </motion.div>
    </div>
  );
}
