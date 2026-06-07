"use client";

import { useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ParticleField } from "./ParticleField";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[80vh] lg:min-h-[92vh] items-center overflow-hidden px-4 sm:px-6 lg:px-12">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[10%] top-1/4 h-[300px] w-[300px] lg:h-[500px] lg:w-[500px] rounded-full bg-brand-cyan/6 blur-[100px] lg:blur-[150px]" />
        <div className="absolute left-[15%] top-2/3 h-[250px] w-[250px] lg:h-[400px] lg:w-[400px] rounded-full bg-brand-violet/5 blur-[80px] lg:blur-[130px]" />
        {/* Grid — slightly more visible with breathing */}
        <div
          className="absolute inset-0 opacity-[0.06] animate-[breathe_6s_ease-in-out_infinite]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Particles */}
      <ParticleField />

      <div className="relative z-10 mx-auto w-full max-w-7xl items-center gap-8 lg:grid lg:grid-cols-[1.6fr_1fr]">
        {/* Left: Text */}
        <div className="relative">
          {/* Vertical anchor line */}
          <div className="absolute -left-4 top-0 h-24 w-px bg-gradient-to-b from-transparent via-brand-cyan/40 to-transparent hidden lg:block" />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 lg:mb-5 text-xs sm:text-sm font-medium tracking-[0.2em] uppercase text-brand-cyan"
          >
            AI × 语言研究
          </motion.p>

          {/* Title with blur-in */}
          <motion.h1
            initial={{ opacity: 0, filter: "blur(12px)", y: 16 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="text-5xl sm:text-7xl lg:text-[7rem] font-bold tracking-tight leading-none"
          >
            赵<span className="text-brand-cyan">琰</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-4 lg:mt-5 text-base lg:text-lg text-neutral-500 dark:text-neutral-400 leading-[1.8]"
          >
            山东大学翻译学院本科生 · 中共党员
            <br />
            OutEye 系列维护者 · 挑战杯揭榜挂帅参赛者
          </motion.p>

          {/* Trust signals — refined */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-4 lg:mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-neutral-500 dark:text-neutral-400"
          >
            <span>4 个 AI 产品</span>
            <span className="text-neutral-400 dark:text-neutral-500">·</span>
            <span>21,381 篇语料</span>
            <span className="text-neutral-400 dark:text-neutral-500">·</span>
            <span>800 亿 Token 规模</span>
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="mt-4 lg:mt-5 flex flex-wrap gap-2"
          >
            {["OutEye 2.0", "OutEye 3.0", "OutEye 4.0", "挑战杯"].map(
              (tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-black/8 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.04] px-3 py-1 text-xs text-neutral-500 dark:text-neutral-400 transition-all duration-200 hover:scale-105 hover:border-brand-cyan/20 hover:bg-black/[0.06] dark:hover:bg-white/[0.08]"
                >
                  {tag}
                </span>
              )
            )}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-6 lg:mt-8 flex gap-3"
          >
            <a
              href="/projects"
              className="group relative overflow-hidden rounded-lg bg-primary px-5 lg:px-7 py-2.5 lg:py-3 text-sm font-medium text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]"
            >
              {/* Shimmer overlay */}
              <span className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_3s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              查看项目 →
            </a>
            <a
              href="/contact"
              className="rounded-lg border border-white/15 bg-transparent px-5 lg:px-7 py-2.5 lg:py-3 text-sm font-medium text-neutral-500 dark:text-neutral-400 transition-all duration-300 hover:border-brand-cyan/40 hover:bg-brand-cyan/5 hover:text-foreground"
            >
              联系我
            </a>
          </motion.div>
        </div>

        {/* Right: Avatar — desktop only, with 3D tilt */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="hidden lg:block lg:mt-16"
        >
          <TiltPhoto />
        </motion.div>
      </div>
    </section>
  );
}

function TiltPhoto() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [6, -6]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-6, 6]), {
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
      className="relative"
      style={{ perspective: 800 }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative"
      >
        <img
          src="/assets/images/profile/profile.jpg"
          alt="赵琰"
          className="aspect-[3/4] w-[360px] rounded-2xl object-cover object-top shadow-[0_0_60px_rgba(6,182,212,0.08),0_0_120px_rgba(6,182,212,0.04)] border border-white/[0.06]"
        />
      </motion.div>
      {/* Ambient glow behind photo */}
      <div className="absolute -bottom-6 -right-6 -z-10 h-full w-full rounded-2xl bg-brand-cyan/8 blur-3xl" />
    </div>
  );
}
