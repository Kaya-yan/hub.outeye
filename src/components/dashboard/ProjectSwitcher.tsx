"use client";

import { useCallback } from "react";

const projects = [
  {
    name: "OutEye 2.0",
    codename: "OutSight",
    status: "运行中",
    statusColor: "bg-emerald-500",
    stat: "21,381 篇语料",
    screenshot: "/assets/images/projects/outeye2/screenshot-1.jpg",
    href: "https://v2.outeye.top",
    external: true,
  },
  {
    name: "OutEye 3.0",
    codename: "OutEdu",
    status: "运行中",
    statusColor: "bg-emerald-500",
    stat: "12 大理论工程化",
    screenshot: "/assets/images/projects/outeye3/screenshot-1.jpg",
    href: "https://edu.outeye.top",
    external: true,
  },
  {
    name: "OutEye 4.0",
    codename: "Pulse",
    status: "运行中",
    statusColor: "bg-emerald-500",
    stat: "6 维传播效果分析",
    screenshot: "/assets/images/projects/outeye4/screenshot-1.jpg",
    href: "https://yh.outeye.top",
    external: true,
  },
  {
    name: "太虚册",
    codename: "Honglou Shiyi",
    status: "运行中",
    statusColor: "bg-emerald-500",
    stat: "红楼梦互动叙事",
    screenshot: "/assets/images/projects/honglou/screenshot-1.jpg",
    href: "https://honglou-shiyi.outeye.top",
    external: true,
  },
];

export function ProjectSwitcher() {
  const handleClick = useCallback((project: (typeof projects)[number]) => {
    if (project.href) {
      window.open(project.href, "_blank", "noopener,noreferrer");
    }
  }, []);

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">🚀 多项目切换器</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {projects.map((project) => (
          <button
            key={project.codename}
            onClick={() => handleClick(project)}
            className="group relative overflow-hidden rounded-xl border border-black/8 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-cyan/20"
          >
            <div className="relative h-32 overflow-hidden">
              <img
                src={project.screenshot}
                alt={project.name}
                className="h-full w-full object-cover opacity-50 transition-opacity duration-300 group-hover:opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/40 to-transparent" />
            </div>
            <div className="p-4 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{project.name}</span>
                <span className={`h-1.5 w-1.5 rounded-full ${project.statusColor}`} />
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {project.status} · {project.stat}
              </p>
              <p className="mt-2 text-xs text-brand-cyan opacity-0 transition-opacity group-hover:opacity-100">
                打开站点 →
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
