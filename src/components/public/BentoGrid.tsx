"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

const items = [
  {
    title: "OutEye 系列",
    subtitle: "4 个 AI 产品，从原型到产品化",
    bgImage: "/assets/images/projects/outeye2/screenshot-1.jpg",
    span: "col-span-2 row-span-2",
    bgType: "image" as const,
  },
  {
    title: "MiMo 800亿",
    subtitle: "月消耗 Token 规模",
    bgImage: null,
    span: "",
    bgType: "pulse" as const,
  },
  {
    title: "挑战杯",
    subtitle: "揭榜挂帅 · 国家级 · 进行中",
    bgImage: "/assets/images/challenge-cup/tiaozhanbeihaibao.jpg",
    span: "",
    bgType: "image" as const,
  },
  {
    title: "技术栈",
    subtitle: "Next.js · React · TypeScript · Tailwind",
    bgImage: null,
    span: "col-span-2",
    bgType: "code" as const,
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/* ================================================================
   PulseCanvas v3 — 三层粒子系统 + 中心引擎脉冲 + 数据流引力
   ================================================================ */

function PulseCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let dpr = 1;
    let cw = 0;
    let ch = 0;

    // ── Layer 1: Background drift (starfield) ──
    const bgParticles = Array.from({ length: 45 }, () => ({
      x: Math.random() * 600,
      y: Math.random() * 200,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.1,
      r: 0.5 + Math.random() * 0.5,
    }));

    // ── Layer 2: Data flow (converge to center) ──
    const TRAIL_LEN = 8;
    interface FlowParticle {
      x: number; y: number;
      vx: number; vy: number;
      r: number; opacity: number;
      trail: { x: number; y: number }[];
    }
    const flowParticles: FlowParticle[] = Array.from({ length: 25 }, () => ({
      x: 0, y: 0,
      vx: 0.6 + Math.random() * 0.5,
      vy: 0,
      r: 1.5 + Math.random() * 1,
      opacity: 0.45 + Math.random() * 0.2,
      trail: [],
    }));

    // ── Layer 3: Core orbital ──
    interface OrbitalParticle {
      angle: number;
      rx: number; ry: number;
      r: number; speed: number;
      phase: number;
    }
    const coreParticles: OrbitalParticle[] = Array.from({ length: 6 }, () => ({
      angle: Math.random() * Math.PI * 2,
      rx: 25 + Math.random() * 30,
      ry: 15 + Math.random() * 20,
      r: 2 + Math.random() * 1.5,
      speed: 0.003 + Math.random() * 0.004,
      phase: Math.random() * Math.PI * 2,
    }));

    // ── Engine pulse state ──
    let arcAngle = 0;
    let pulseIntensity = 0.08;
    let pulseTarget = 0.08;
    let pulseDecay = 0;

    function resetFlowParticle(p: FlowParticle) {
      p.x = -5 - Math.random() * 20;
      p.y = ch * 0.15 + Math.random() * ch * 0.7;
      p.vx = 0.6 + Math.random() * 0.5;
      p.vy = 0;
      p.trail = [];
    }

    function resize() {
      const rect = canvas!.parentElement!.getBoundingClientRect();
      dpr = devicePixelRatio;
      cw = rect.width;
      ch = rect.height;
      canvas!.width = cw * dpr;
      canvas!.height = ch * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      canvas!.style.width = cw + "px";
      canvas!.style.height = ch + "px";
      for (const p of bgParticles) {
        p.x = Math.random() * cw;
        p.y = Math.random() * ch;
      }
      for (const p of flowParticles) resetFlowParticle(p);
    }

    function draw() {
      ctx!.clearRect(0, 0, cw, ch);
      const cx = cw / 2;
      const cy = ch / 2;

      // ── Layer 1: Background starfield ──
      for (const p of bgParticles) {
        ctx!.fillStyle = "rgba(30,64,175,0.15)";
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = cw;
        if (p.x > cw) p.x = 0;
        if (p.y < 0) p.y = ch;
        if (p.y > ch) p.y = 0;
      }

      // ── Central engine arcs ──
      arcAngle += (Math.PI * 2) / (30 * 60); // 30s per revolution
      // Pulse decay
      if (pulseDecay > 0) {
        pulseIntensity = 0.08 + 0.07 * pulseDecay;
        pulseDecay -= 0.02;
        if (pulseDecay < 0) pulseDecay = 0;
      } else {
        pulseIntensity = 0.08;
      }

      ctx!.save();
      ctx!.translate(cx, cy);
      ctx!.rotate(arcAngle);
      ctx!.strokeStyle = `rgba(6,182,212,${pulseIntensity})`;
      ctx!.lineWidth = 1;
      ctx!.lineCap = "round";
      // Draw 3 arc segments
      for (let i = 0; i < 3; i++) {
        const start = (i * Math.PI * 2) / 3;
        const end = start + Math.PI * 0.4;
        const radius = 35 + i * 8;
        ctx!.beginPath();
        ctx!.arc(0, 0, radius, start, end);
        ctx!.stroke();
      }
      ctx!.restore();

      // ── Layer 2: Data flow particles ──
      for (const p of flowParticles) {
        // Gravity toward center
        const dx = cx - p.x;
        const dy = cy - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const gravity = dist < 80 ? 0.015 : 0.004;
        p.vx += (dx / dist) * gravity;
        p.vy += (dy / dist) * gravity;
        // Dampen
        p.vx *= 0.995;
        p.vy *= 0.995;

        // Trail
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > TRAIL_LEN) p.trail.shift();

        // Draw trail
        for (let i = 0; i < p.trail.length - 1; i++) {
          const t = p.trail[i];
          const alpha = (i / p.trail.length) * p.opacity * 0.4;
          ctx!.strokeStyle = `rgba(6,182,212,${alpha})`;
          ctx!.lineWidth = p.r * 0.5;
          ctx!.beginPath();
          ctx!.moveTo(t.x, t.y);
          ctx!.lineTo(p.trail[i + 1].x, p.trail[i + 1].y);
          ctx!.stroke();
        }

        // Draw particle with glow
        const glowR = p.r * 3;
        const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
        grad.addColorStop(0, `rgba(6,182,212,${p.opacity})`);
        grad.addColorStop(0.4, `rgba(59,130,246,${p.opacity * 0.4})`);
        grad.addColorStop(1, "transparent");
        ctx!.fillStyle = grad;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, glowR, 0, Math.PI * 2);
        ctx!.fill();

        // Core
        ctx!.fillStyle = `rgba(165,243,252,${p.opacity})`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // If near center, trigger pulse and respawn
        if (dist < 20) {
          pulseDecay = 1;
          resetFlowParticle(p);
        }
        // If out of bounds, respawn
        if (p.x > cw + 20 || p.x < -30 || p.y < -20 || p.y > ch + 20) {
          resetFlowParticle(p);
        }
      }

      // ── Layer 3: Core orbital particles ──
      ctx!.save();
      ctx!.shadowBlur = 15;
      ctx!.shadowColor = "rgba(165,243,252,0.8)";
      for (const p of coreParticles) {
        p.angle += p.speed;
        const ox = cx + Math.cos(p.angle + p.phase) * p.rx;
        const oy = cy + Math.sin(p.angle + p.phase) * p.ry;
        const grad = ctx!.createRadialGradient(ox, oy, 0, ox, oy, p.r * 3);
        grad.addColorStop(0, "rgba(165,243,252,0.9)");
        grad.addColorStop(0.5, "rgba(6,182,212,0.3)");
        grad.addColorStop(1, "transparent");
        ctx!.fillStyle = grad;
        ctx!.beginPath();
        ctx!.arc(ox, oy, p.r * 3, 0, Math.PI * 2);
        ctx!.fill();
        // Bright core
        ctx!.fillStyle = "rgba(165,243,252,0.9)";
        ctx!.beginPath();
        ctx!.arc(ox, oy, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.shadowBlur = 0;
      ctx!.restore();

      animId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas!.parentElement!);
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0"
    />
  );
}

/* ================================================================
   CodeRain v3 — 多列并行 + 语法高亮 + 底部状态栏
   ================================================================ */

interface Token { text: string; color: string }

// Pre-tokenized code snippets with syntax highlighting
const CODE_SNIPPETS: Token[][] = [
  [
    { text: "import", color: "#c084fc" },
    { text: " { Next.js } ", color: "#e2e8f0" },
    { text: "from", color: "#c084fc" },
    { text: " 'react'", color: "#4ade80" },
  ],
  [
    { text: "const", color: "#c084fc" },
    { text: " db = ", color: "#e2e8f0" },
    { text: "new", color: "#c084fc" },
    { text: " Neon({ ssl: ", color: "#e2e8f0" },
    { text: "true", color: "#f472b6" },
    { text: " })", color: "#e2e8f0" },
  ],
  [
    { text: "export", color: "#c084fc" },
    { text: " default ", color: "#e2e8f0" },
    { text: "function", color: "#c084fc" },
    { text: " OutEye() { }", color: "#60a5fa" },
  ],
  [
    { text: "// OutEye 4.0: 200 comments", color: "#6b7280" },
  ],
  [
    { text: "tailwind.config = { theme: { extend: {} } }", color: "#e2e8f0" },
  ],
  [
    { text: "const", color: "#c084fc" },
    { text: " api = ", color: "#e2e8f0" },
    { text: "new", color: "#c084fc" },
    { text: " MiMo({ tokens: ", color: "#e2e8f0" },
    { text: "800_000_000_000", color: "#f472b6" },
    { text: " })", color: "#e2e8f0" },
  ],
  [
    { text: "const", color: "#c084fc" },
    { text: " { data } = ", color: "#e2e8f0" },
    { text: "useSWR", color: "#60a5fa" },
    { text: "('/api/data')", color: "#4ade80" },
  ],
  [
    { text: "await", color: "#c084fc" },
    { text: " db.", color: "#e2e8f0" },
    { text: "select", color: "#60a5fa" },
    { text: "().", color: "#e2e8f0" },
    { text: "from", color: "#60a5fa" },
    { text: "(corpus)", color: "#e2e8f0" },
  ],
  [
    { text: "const", color: "#c084fc" },
    { text: " model = ", color: "#e2e8f0" },
    { text: "'deepseek-v3'", color: "#4ade80" },
  ],
  [
    { text: "npx playwright install chromium", color: "#60a5fa" },
  ],
];

function tokenizeToHTML(tokens: Token[]): string {
  return tokens
    .map(
      (t) =>
        `<span style="color:${t.color};text-shadow:0 0 6px ${t.color}33">${t.text}</span>`
    )
    .join("");
}

function CodeRain() {
  const containerRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement[]>([]);
  const statsRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const COLS = 3;
    let timer = 0;
    let lineCount = 0;

    // Dynamic stats counter
    const statsInterval = setInterval(() => {
      if (statsRef.current) {
        lineCount += Math.floor(Math.random() * 3) + 1;
        const chars = lineCount * 47 + Math.floor(Math.random() * 200);
        statsRef.current.textContent = `Lines: ${lineCount.toLocaleString()} | Chars: ${chars.toLocaleString()}`;
      }
    }, 1200);

    function spawn(colIdx: number) {
      const container = containerRef.current;
      if (!container) return;

      const snippet = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
      const colWidth = 100 / COLS;
      const left = colIdx * colWidth + 2;

      const el = document.createElement("div");
      el.className = "cr-line-v3";
      el.style.left = `${left}%`;
      el.style.width = `${colWidth - 3}%`;
      el.innerHTML = tokenizeToHTML(snippet);

      container.appendChild(el);
      linesRef.current.push(el);

      // Animate in
      requestAnimationFrame(() => {
        el.style.opacity = "1";
      });

      // Fade out and remove
      setTimeout(() => {
        el.style.opacity = "0";
        setTimeout(() => {
          el.remove();
          linesRef.current = linesRef.current.filter((l) => l !== el);
        }, 500);
      }, 2800);

      // Schedule next for this column
      const nextDelay = 300 + Math.random() * 400;
      window.setTimeout(() => spawn(colIdx), nextDelay);
    }

    // Stagger column starts
    for (let c = 0; c < COLS; c++) {
      window.setTimeout(() => spawn(c), c * 200 + 300);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(statsInterval);
      linesRef.current.forEach((el) => el.remove());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Status bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex h-5 items-center justify-between bg-black/30 px-3 backdrop-blur-[2px]">
        <div className="flex items-center gap-1.5">
          <div className="h-1 w-1 rounded-full bg-green-400 animate-pulse" />
          <span className="font-mono text-[9px] text-green-400/70">online</span>
        </div>
        <span
          ref={statsRef}
          className="font-mono text-[9px] text-slate-500"
        >
          Lines: 0 | Chars: 0
        </span>
        <span className="font-mono text-[9px] text-slate-600">
          UTF-8 | TypeScript
        </span>
      </div>
    </div>
  );
}

/* ================================================================
   BentoCard + BentoGrid
   ================================================================ */

function BentoCard({ bentoItem }: { bentoItem: (typeof items)[number] }) {
  return (
    <motion.div
      variants={itemVariant}
      className={`group relative col-span-1 overflow-hidden rounded-xl border border-black/8 dark:border-white/10 ${bentoItem.span} flex min-h-[180px] items-end transition-colors duration-200 hover:border-brand-cyan/20`}
    >
      {bentoItem.bgType === "image" && bentoItem.bgImage && (
        <img
          src={bentoItem.bgImage}
          alt={bentoItem.title}
          className="absolute inset-0 h-full w-full object-cover opacity-40 transition-opacity duration-300 group-hover:opacity-50"
        />
      )}
      {bentoItem.bgType === "pulse" && <PulseCanvas />}
      {bentoItem.bgType === "code" && <CodeRain />}
      {bentoItem.bgType !== "image" && (
        <div className="absolute inset-0 surface-bg" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="relative z-10 p-5">
        <h3 className="text-base font-semibold text-foreground">
          {bentoItem.title}
        </h3>
        <p className="mt-1 text-xs text-neutral-400">
          {bentoItem.subtitle}
        </p>
      </div>
    </motion.div>
  );
}

export function BentoGrid() {
  return (
    <>
      <style jsx global>{`
        .cr-line-v3 {
          position: absolute;
          top: 6%;
          font-family: var(--font-mono);
          font-size: 10px;
          line-height: 1.9;
          white-space: nowrap;
          opacity: 0;
          transition: opacity 0.4s ease;
          animation: cr3-fall 3.5s ease-out forwards;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        @keyframes cr3-fall {
          0%   { top: 4%; }
          100% { top: 78%; }
        }
      `}</style>
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-12">
        <h2 className="mb-6 text-sm font-medium text-muted-foreground">
          核心亮点
        </h2>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 gap-3 md:grid-cols-4"
        >
          {items.map((bentoItem) => (
            <BentoCard key={bentoItem.title} bentoItem={bentoItem} />
          ))}
        </motion.div>
      </section>
    </>
  );
}
