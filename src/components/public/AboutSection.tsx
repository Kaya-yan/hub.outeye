"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";

function AboutPhoto() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [5, -5]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-5, 5]), {
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
      className="hidden lg:block relative"
      style={{ perspective: 800 }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative"
      >
        <img
          src="/assets/images/profile/profile.jpg"
          alt="赵琰"
          className="aspect-[3/4] w-[320px] rounded-2xl object-cover object-top border border-brand-cyan/30"
          style={{
            boxShadow: "0 0 40px rgba(6,182,212,0.15), 0 0 80px rgba(6,182,212,0.08)",
          }}
        />
      </motion.div>
      <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl bg-brand-cyan/8 blur-3xl" />
    </div>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 lg:gap-16 items-center">
          {/* Left: Photo (desktop only) + mobile fallback */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex justify-center lg:justify-start"
          >
            {/* Mobile photo (static, no tilt) */}
            <div className="lg:hidden">
              <img
                src="/assets/images/profile/profile.jpg"
                alt="赵琰"
                className="aspect-[3/4] w-[220px] rounded-2xl object-cover object-top border border-brand-cyan/30"
                style={{
                  boxShadow: "0 0 30px rgba(6,182,212,0.15)",
                }}
              />
            </div>
            <AboutPhoto />
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="text-sm text-muted-foreground">Hi, I am</p>
            <h2 className="mt-1 text-4xl lg:text-5xl font-bold tracking-tight">
              赵<span className="text-brand-cyan">琰</span>
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-brand-cyan/10 px-3 py-1 text-brand-cyan">翻译学院本科生</span>
              <span className="rounded-full bg-brand-cyan/10 px-3 py-1 text-brand-cyan">中共党员</span>
              <span className="rounded-full bg-brand-cyan/10 px-3 py-1 text-brand-cyan">OutEye 系列维护者</span>
            </div>

            <p className="mt-5 text-sm text-muted-foreground leading-relaxed max-w-lg">
              山东大学翻译学院本科生，专注 AI 与语言研究的交叉领域。秉持「让 AI 服务于语言」的理念，开发并维护 OutEye 系列 AI 产品，覆盖语料分析、智能翻译和语言模型应用，累计处理超过 800 亿 Token 规模的语言数据。
            </p>

            {/* Metrics */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
              {[
                { value: "4+", label: "AI 产品" },
                { value: "21,381", label: "篇语料" },
                { value: "800 亿", label: "Token 规模" },
                { value: "17", label: "荣誉奖项" },
              ].map((m) => (
                <div key={m.label} className="flex items-baseline gap-1.5">
                  <span className="text-xl lg:text-2xl font-bold text-brand-cyan">{m.value}</span>
                  <span className="text-xs text-muted-foreground">{m.label}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="mt-6 flex gap-3">
              <Link
                href="/projects"
                className="group relative overflow-hidden rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_3s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                查看项目 →
              </Link>
              <Link
                href="/contact"
                className="rounded-lg border border-white/15 px-6 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-300 hover:border-brand-cyan/40 hover:bg-brand-cyan/5 hover:text-foreground"
              >
                联系我
              </Link>
            </div>

            {/* Project tags */}
            <div className="mt-5 flex flex-wrap gap-2">
              {["OutEye 2.0", "OutEye 3.0", "OutEye 4.0", "挑战杯"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-muted-foreground transition-all duration-200 hover:scale-105 hover:border-brand-cyan/20 hover:bg-white/[0.08]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
