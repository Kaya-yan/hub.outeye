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
          className="w-[270px] aspect-[3/4] rounded-xl object-cover object-top border border-cyan-500/10 transition-shadow duration-500 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)]"
        />
      </motion.div>
    </div>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-start">
          {/* Left: Photo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex justify-center lg:justify-start w-full lg:w-auto"
          >
            {/* Mobile photo (static) */}
            <div className="lg:hidden">
              <img
                src="/assets/images/profile/profile.jpg"
                alt="赵琰"
                className="w-[200px] aspect-[3/4] rounded-xl object-cover object-top border border-cyan-500/10"
              />
            </div>
            <ResumePhoto />
          </motion.div>

          {/* Right: Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex-1 min-w-0"
          >
            {/* Row 1: Greeting */}
            <p className="text-slate-500 text-sm">Hi, I am</p>

            {/* Row 2: Name */}
            <h2 className="mt-0.5 flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-bold text-white">赵琰</span>
              <span className="text-cyan-400 text-lg font-normal">Kaya</span>
            </h2>

            {/* Row 3: Badges */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["翻译学院本科生", "中共党员", "2025年度自强之星", "OutEye系列维护者"].map((b) => (
                <span
                  key={b}
                  className="rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 text-[11px] px-2.5 py-0.5 whitespace-nowrap"
                >
                  {b}
                </span>
              ))}
            </div>

            {/* Row 4: Bio */}
            <p className="mt-3 text-slate-300 text-sm leading-relaxed max-w-lg">
              山东大学翻译学院本科生，专注 AI 与语言研究的交叉领域。开发并维护 OutEye 系列 AI 产品，累计处理超过 800 亿 Token 规模的语言数据。
            </p>

            {/* Row 5: Metrics — big bold numbers */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              {[
                { value: "4+", label: "AI 产品" },
                { value: "21,381", label: "语料" },
                { value: "800 亿", label: "TOKEN" },
                { value: "17", label: "荣誉" },
              ].map((m, idx) => (
                <div key={m.label} className="flex items-center gap-3">
                  {idx > 0 && <span className="text-slate-700 text-lg font-light">|</span>}
                  <div className="flex flex-col items-start">
                    <span className="text-3xl md:text-4xl font-bold text-cyan-400 leading-none">{m.value}</span>
                    <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">{m.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 6: Contact */}
            <p className="mt-4 text-slate-400 text-sm">
              <a href="mailto:Kaya-yan@outlook.com" className="hover:text-cyan-400 transition-colors">Kaya-yan@outlook.com</a>
              {" · "}
              <a href="https://github.com/Kaya-yan" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">github.com/Kaya-yan</a>
            </p>

            {/* Row 7: Project tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {["OutEye 2.0", "OutEye 3.0", "OutEye 4.0", "挑战杯"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/5 text-slate-300 text-xs px-2.5 py-1"
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
