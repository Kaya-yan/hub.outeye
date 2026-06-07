"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, GitFork, GraduationCap, FlaskConical, ExternalLink, Copy, Check } from "lucide-react";

const contacts = [
  {
    icon: Mail,
    label: "email",
    value: "Kaya-yan@outlook.com",
    href: "mailto:Kaya-yan@outlook.com",
    copyable: true,
  },
  {
    icon: GitFork,
    label: "github",
    value: "github.com/Kaya-yan",
    href: "https://github.com/Kaya-yan",
    copyable: false,
  },
  {
    icon: GraduationCap,
    label: "school",
    value: "山东大学（威海）翻译学院",
    href: null,
    copyable: false,
  },
  {
    icon: FlaskConical,
    label: "direction",
    value: "AI × 语言研究",
    href: null,
    copyable: false,
  },
];

const TYPEWRITER_LINES = [
  "$ ssh connect@zhaoyan.cn",
  "> Establishing secure connection...",
  "> Connected to ZhaoyanHub v1.0",
  "> Available channels listed below.",
];

function useTypewriter(lines: string[], speed = 28) {
  const [displayed, setDisplayed] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let lineIdx = 0;
    let charIdx = 0;
    const current: string[] = [];

    function tick() {
      if (cancelled) return;
      if (lineIdx >= lines.length) {
        setDone(true);
        return;
      }

      const line = lines[lineIdx];
      if (charIdx <= line.length) {
        current[lineIdx] = line.slice(0, charIdx);
        setDisplayed([...current]);
        charIdx++;
        setTimeout(tick, speed);
      } else {
        lineIdx++;
        charIdx = 0;
        setTimeout(tick, 200);
      }
    }

    tick();
    return () => { cancelled = true; };
  }, [lines, speed]);

  return { displayed, done };
}

export default function ContactPage() {
  const { displayed, done } = useTypewriter(TYPEWRITER_LINES);
  const [copied, setCopied] = useState<string | null>(null);

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-4xl font-bold tracking-tight text-balance">联系方式</h1>
        <p className="mt-2 text-muted-foreground">
          欢迎通过以下方式联系，通常 24 小时内回复
        </p>
      </motion.div>

      {/* Terminal window */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mt-10 overflow-hidden rounded-xl border border-black/8 dark:border-white/10"
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-black/8 dark:border-white/10 bg-foreground/[0.03] px-4 py-2.5">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
          </div>
          <span className="ml-2 font-mono text-[11px] text-muted-foreground">
            zhaoyan@hub:~$ contact
          </span>
        </div>

        {/* Body */}
        <div className="bg-[#0c0c0e] p-5 sm:p-6">
          {/* Typewriter header */}
          <div className="mb-5 space-y-1 font-mono text-[12px] leading-relaxed">
            {displayed.map((line, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "text-emerald-400/80"
                    : "text-zinc-500"
                }
              >
                {line}
                {i === displayed.length - 1 && !done && (
                  <span className="ml-0.5 inline-block animate-pulse text-brand-cyan">
                    ▊
                  </span>
                )}
              </p>
            ))}
          </div>

          {/* Contact channels */}
          <div className="space-y-1.5">
            {contacts.map((item, i) => {
              const Icon = item.icon;
              const isCopied = copied === item.value;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 1.8 + i * 0.12 }}
                  className="group flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-white/[0.04]"
                >
                  {/* Channel indicator */}
                  <span className="w-4 text-right font-mono text-[11px] text-brand-cyan/60">
                    {i + 1}
                  </span>

                  <Icon className="h-3.5 w-3.5 shrink-0 text-zinc-500" />

                  {/* Label */}
                  <span className="w-16 font-mono text-[11px] text-zinc-500">
                    {item.label}
                  </span>

                  {/* Separator */}
                  <span className="font-mono text-[11px] text-zinc-700">
                    →
                  </span>

                  {/* Value */}
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith("mailto") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="flex-1 min-w-0 truncate font-mono text-[12px] text-zinc-300 transition-colors hover:text-brand-cyan"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="flex-1 min-w-0 truncate font-mono text-[12px] text-zinc-300">
                      {item.value}
                    </span>
                  )}

                  {/* Copy / link action */}
                  <div className="flex shrink-0 items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                    {item.copyable && (
                      <button
                        onClick={() => handleCopy(item.value)}
                        className="rounded p-1 text-zinc-500 transition-colors hover:text-zinc-300 hover:bg-white/[0.06]"
                        title="复制"
                      >
                        {isCopied ? (
                          <Check className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    )}
                    {item.href && !item.href.startsWith("mailto") && (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded p-1 text-zinc-500 transition-colors hover:text-zinc-300 hover:bg-white/[0.06]"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Cursor line */}
          <div className="mt-4 flex items-center gap-2 font-mono text-[12px]">
            <span className="text-emerald-400/80">$</span>
            <span className="inline-block h-3.5 w-[7px] animate-pulse bg-brand-cyan/70" />
          </div>
        </div>
      </motion.div>

      {/* Note below terminal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="mt-6 rounded-xl border border-black/6 dark:border-white/8 p-5"
      >
        <h2 className="text-sm font-medium text-foreground">合作与交流</h2>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          如果你对 OutEye 系列产品、话语分析 AI 工具、或挑战杯项目感兴趣，欢迎邮件交流。也欢迎在 GitHub 上提 Issue 或 PR。
        </p>
      </motion.div>
    </div>
  );
}
