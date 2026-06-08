"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/* ── Typewriter ─────────────────────────────────── */
function Typewriter({ text, active, className }: { text: string; active: boolean; className?: string }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!active) return;
    setDisplayed("");
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, 60);
    return () => clearInterval(timer);
  }, [text, active]);

  return <span className={className}>{displayed}<span className="animate-pulse text-cyan-400">|</span></span>;
}

/* ── 3D Photo ──────────────────────────────────── */
function ResumePhoto() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [3, -3]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-3, 3]), { stiffness: 200, damping: 20 });

  function handleMouseMove(e: React.MouseEvent) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }
  function handleMouseLeave() { mouseX.set(0.5); mouseY.set(0.5); }

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

/* ── Section ───────────────────────────────────── */
const badges = ["翻译学院本科生", "中共党员", "2025年度自强之星", "OutEye系列维护者"];
const metrics = ["4+ AI 产品", "21,381 篇语料", "800 亿 Token", "17 项荣誉"];
const tags = ["OutEye 2.0", "OutEye 3.0", "OutEye 4.0", "挑战杯"];

export function AboutSection() {
  const [inView, setInView] = useState(false);

  return (
    <section id="about" className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <motion.div
          onViewportEnter={() => setInView(true)}
          viewport={{ once: true, margin: "-200px" }}
          className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-start"
        >
          {/* Left: Photo — slide + 3D rotateY reveal */}
          <motion.div
            initial={{ opacity: 0, x: -60, rotateY: 10 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex justify-center lg:justify-start w-full lg:w-auto"
          >
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
          <div className="flex-1 min-w-0">
            {/* Greeting — typewriter */}
            <div className="text-slate-500 text-sm h-5">
              {inView && <Typewriter text="Hi, I am" active={inView} />}
            </div>

            {/* Name */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-0.5 flex items-baseline gap-2"
            >
              <span className="text-4xl md:text-5xl font-bold text-white">赵琰</span>
              <span className="text-cyan-400 text-lg font-normal">Kaya</span>
            </motion.h2>

            {/* Badges — stagger scale pop */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {badges.map((b, i) => (
                <motion.span
                  key={b}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.15 + i * 0.08, ease: "easeOut" }}
                  className="rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 text-[11px] px-2.5 py-0.5 whitespace-nowrap"
                >
                  {b}
                </motion.span>
              ))}
            </div>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-3 text-slate-300 text-sm leading-relaxed max-w-lg"
            >
              山东大学翻译学院本科生，专注 AI 与语言研究的交叉领域。开发并维护 OutEye 系列 AI 产品，累计处理超过 800 亿 Token 规模的语言数据。
            </motion.p>

            {/* Metrics — scale reveal */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              {metrics.map((m, idx) => (
                <div key={m} className="flex items-center gap-3">
                  {idx > 0 && <span className="text-slate-700 text-lg font-light">|</span>}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + idx * 0.1, ease: "easeOut" }}
                    className="flex flex-col items-start"
                  >
                    <span className="text-3xl md:text-4xl font-bold text-cyan-400 leading-none">
                      {m.split(" ")[0]}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">
                      {m.split(" ").slice(1).join(" ")}
                    </span>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Contact */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-4 text-slate-400 text-sm"
            >
              <a href="mailto:Kaya-yan@outlook.com" className="hover:text-cyan-400 transition-colors">Kaya-yan@outlook.com</a>
              {" · "}
              <a href="https://github.com/Kaya-yan" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">github.com/Kaya-yan</a>
            </motion.p>

            {/* Tags — stagger slide up */}
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.45 + i * 0.05, ease: "easeOut" }}
                  className="rounded-full border border-white/10 bg-white/5 text-slate-300 text-xs px-2.5 py-1"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
