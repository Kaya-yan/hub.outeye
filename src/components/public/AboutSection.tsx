"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

function ResumePhoto() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [3, -3]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-3, 3]), {
    stiffness: 200,
    damping: 20,
  });

  function handleMouseMove(e: React.MouseEvent) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="hidden lg:block flex-shrink-0"
      style={{ perspective: 600 }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative"
      >
        <img
          src="/assets/images/profile/profile.jpg"
          alt="赵琰"
          className="w-[280px] aspect-[3/4] rounded-xl object-cover object-top border border-cyan-500/20 transition-shadow duration-500 hover:shadow-[0_0_40px_rgba(6,182,212,0.2)]"
        />
      </motion.div>
    </div>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-sm p-8 md:p-12"
        >
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            {/* Left: Photo */}
            <div className="flex justify-center lg:justify-start w-full lg:w-auto">
              {/* Mobile photo (static) */}
              <div className="lg:hidden">
                <img
                  src="/assets/images/profile/profile.jpg"
                  alt="赵琰"
                  className="w-[200px] aspect-[3/4] rounded-xl object-cover object-top border border-cyan-500/20"
                />
              </div>
              <ResumePhoto />
            </div>

            {/* Right: Info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 tracking-wide">Hi, I am</p>
              <h2 className="mt-1 flex items-baseline gap-2">
                <span className="text-4xl md:text-5xl font-bold text-white">赵琰</span>
                <span className="text-lg text-cyan-400 font-medium">Kaya</span>
              </h2>

              {/* Badges */}
              <div className="mt-4 flex flex-wrap gap-2">
                {["翻译学院本科生", "中共党员", "2025年度自强之星", "OutEye系列维护者"].map((b) => (
                  <span
                    key={b}
                    className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-400"
                  >
                    {b}
                  </span>
                ))}
              </div>

              {/* Bio */}
              <p className="mt-4 text-sm text-slate-300 leading-relaxed max-w-lg">
                山东大学翻译学院本科生，专注 AI 与语言研究的交叉领域。秉持「让 AI 服务于语言」的理念，开发并维护 OutEye 系列 AI 产品。累计处理超过 800 亿 Token 规模的语言数据。
              </p>

              {/* Metrics */}
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                {[
                  { value: "4+", label: "AI产品" },
                  { value: "21,381", label: "篇语料" },
                  { value: "800亿", label: "Token" },
                  { value: "17", label: "荣誉" },
                ].map((m, idx) => (
                  <div key={m.label} className="flex items-center gap-3">
                    {idx > 0 && <div className="w-px h-5 bg-slate-700" />}
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-cyan-400">{m.value}</span>
                      <span className="text-[10px] text-slate-500 mt-0.5">{m.label}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact links */}
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-500">
                <a href="mailto:Kaya-yan@outlook.com" className="hover:text-cyan-400 transition-colors">
                  Kaya-yan@outlook.com
                </a>
                <a href="https://github.com/Kaya-yan" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
                  github.com/Kaya-yan
                </a>
              </div>

              {/* Project tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {["OutEye 2.0", "OutEye 3.0", "OutEye 4.0", "挑战杯"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
