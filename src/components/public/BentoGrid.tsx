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
    bgType: "meteor" as const,
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
    bgType: "terminal" as const,
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
   MeteorCanvas — 双层流星：流星雨 + 偶发流星
   ================================================================ */

function MeteorCanvas() {
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

    // Static stars
    interface Star { x: number; y: number }
    let stars: Star[] = [];

    // Generic meteor type
    interface Meteor {
      active: boolean;
      startX: number;
      startY: number;
      progress: number;
      speed: number;
      curveDir: number;
      curveAmt: number;
      trail: { x: number; y: number }[];
      headR: number;
      headAlpha: number;
      trailAlpha: number;
      trailWidthPct: number; // trail length as % of card width
      shadowBlur: number;
    }

    function makeMeteor(): Meteor {
      return {
        active: false, startX: 0, startY: 0, progress: 0,
        speed: 0, curveDir: 1, curveAmt: 0, trail: [],
        headR: 1, headAlpha: 0.5, trailAlpha: 0.4,
        trailWidthPct: 0.15, shadowBlur: 0,
      };
    }

    // Layer 1: meteor shower (frequent, subtle)
    const shower: Meteor = makeMeteor();
    let nextShowerTime = 0;

    // Layer 2: featured meteor (rare, bright)
    const featured: Meteor = makeMeteor();
    let nextFeaturedTime = 0;

    function spawnShower() {
      shower.active = true;
      shower.startX = -5;
      shower.startY = ch * 0.15 + Math.random() * ch * 0.7;
      shower.progress = 0;
      shower.speed = 0.008 + Math.random() * 0.004;
      shower.curveDir = Math.random() > 0.5 ? 1 : -1;
      shower.curveAmt = 5 + Math.random() * 8;
      shower.trail = [];
      shower.headR = 1.5;
      shower.headAlpha = 1;
      shower.trailAlpha = 0.7;
      shower.trailWidthPct = 0.2;
      shower.shadowBlur = 6;
    }

    function spawnFeatured() {
      featured.active = true;
      featured.startX = -10;
      featured.startY = ch * 0.2 + Math.random() * ch * 0.6;
      featured.progress = 0;
      featured.speed = 0.006 + Math.random() * 0.003;
      featured.curveDir = Math.random() > 0.5 ? 1 : -1;
      featured.curveAmt = 10 + Math.random() * 10;
      featured.trail = [];
      featured.headR = 1.5;
      featured.headAlpha = 0.9;
      featured.trailAlpha = 0.8;
      featured.trailWidthPct = 0.4;
      featured.shadowBlur = 8;
    }

    function getPos(m: Meteor) {
      const x = m.startX + m.progress * (cw + 30);
      const curve = m.curveAmt * 4 * m.progress * (1 - m.progress) * m.curveDir;
      return { x, y: m.startY + curve };
    }

    function drawMeteor(m: Meteor) {
      if (!m.active) return;
      m.progress += m.speed;

      const pos = getPos(m);
      m.trail.push(pos);
      const maxTrail = Math.floor(cw * m.trailWidthPct / 2);
      if (m.trail.length > maxTrail) m.trail.shift();

      // Trail
      if (m.trail.length > 1) {
        for (let i = 0; i < m.trail.length - 1; i++) {
          const a = (i / m.trail.length) * m.trailAlpha;
          ctx!.strokeStyle = `rgba(220,245,255,${a})`;
          ctx!.lineWidth = Math.max(0.8, m.headR * 0.8);
          ctx!.beginPath();
          ctx!.moveTo(m.trail[i].x, m.trail[i].y);
          ctx!.lineTo(m.trail[i + 1].x, m.trail[i + 1].y);
          ctx!.stroke();
        }
      }

      // Head
      ctx!.save();
      if (m.shadowBlur > 0) {
        ctx!.shadowBlur = m.shadowBlur;
        ctx!.shadowColor = "rgba(220,245,255,0.6)";
      }
      ctx!.fillStyle = `rgba(220,245,255,${m.headAlpha})`;
      ctx!.beginPath();
      ctx!.arc(pos.x, pos.y, m.headR, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.shadowBlur = 0;
      ctx!.restore();

      // Done?
      if (m.progress >= 1) {
        m.active = false;
        m.trail = [];
      }
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
      stars = Array.from({ length: 6 + Math.floor(Math.random() * 3) }, () => ({
        x: Math.random() * cw,
        y: Math.random() * ch,
      }));
    }

    function draw() {
      ctx!.clearRect(0, 0, cw, ch);

      // Background
      ctx!.fillStyle = "#050508";
      ctx!.fillRect(0, 0, cw, ch);
      const bgGrad = ctx!.createRadialGradient(cw / 2, ch / 2, 0, cw / 2, ch / 2, cw * 0.6);
      bgGrad.addColorStop(0, "rgba(15,20,40,0.3)");
      bgGrad.addColorStop(1, "transparent");
      ctx!.fillStyle = bgGrad;
      ctx!.fillRect(0, 0, cw, ch);

      // Stars
      for (const s of stars) {
        ctx!.fillStyle = "rgba(200,220,255,0.35)";
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, 0.5, 0, Math.PI * 2);
        ctx!.fill();
      }

      const now = performance.now();

      // Shower: spawn if inactive and past schedule
      if (!shower.active && now > nextShowerTime) {
        spawnShower();
      }
      drawMeteor(shower);
      if (!shower.active && nextShowerTime <= now) {
        nextShowerTime = now + 1500 + Math.random() * 1000; // 1.5-2.5s gap
      }

      // Featured: spawn if inactive and past schedule
      if (!featured.active && now > nextFeaturedTime) {
        spawnFeatured();
      }
      drawMeteor(featured);
      if (!featured.active && nextFeaturedTime <= now) {
        nextFeaturedTime = now + 8000 + Math.random() * 4000; // 8-12s gap
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    nextShowerTime = performance.now() + 1000;
    nextFeaturedTime = performance.now() + 5000 + Math.random() * 3000;
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
   MinimalTerminal — 极简终端：4 行打字机
   ================================================================ */

function MinimalTerminal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement[]>([]);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const LINES = [
      { key: "stack", value: "Next.js · React · TypeScript" },
      { key: "infra", value: "Neon · Vercel · Supabase" },
      { key: "ai", value: "MiMo · DeepSeek · Claude" },
      { key: "status", value: "production-ready" },
    ];

    let lineIdx = 0;
    let charIdx = 0;
    let timer = 0;
    let cancelled = false;

    function typeLine() {
      if (cancelled || lineIdx >= LINES.length) {
        // All done, show cursor
        if (cursorRef.current) {
          cursorRef.current.style.display = "inline";
        }
        return;
      }

      const line = LINES[lineIdx];
      const fullText = `▶ ${line.key}:  ${line.value}`;
      const el = linesRef.current[lineIdx];
      if (!el) return;

      if (charIdx <= fullText.length) {
        // Build highlighted HTML up to current char
        const typed = fullText.slice(0, charIdx);
        el.innerHTML = highlightLine(typed, line.key);
        charIdx++;
        timer = window.setTimeout(typeLine, 50);
      } else {
        // Line done, move to next after 2s
        lineIdx++;
        charIdx = 0;
        timer = window.setTimeout(typeLine, 2000);
      }
    }

    function highlightLine(text: string, key: string): string {
      // Highlight ▶ and key name in white, value in cyan
      const arrowMatch = text.match(/^(▶\s*)/);
      if (!arrowMatch) return escapeHTML(text);
      const arrow = arrowMatch[1];
      const rest = text.slice(arrow.length);

      const keyMatch = rest.match(/^(\w+:\s+)/);
      if (!keyMatch) {
        return `<span class="text-white">${escapeHTML(arrow)}</span><span class="text-cyan-400">${escapeHTML(rest)}</span>`;
      }
      const keyPart = keyMatch[1];
      const value = rest.slice(keyPart.length);

      return (
        `<span class="text-white">${escapeHTML(arrow)}</span>` +
        `<span class="text-white">${escapeHTML(keyPart)}</span>` +
        `<span class="text-cyan-400">${escapeHTML(value)}</span>`
      );
    }

    function escapeHTML(s: string): string {
      return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // Start after a short delay
    timer = window.setTimeout(typeLine, 800);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-10">
      {/* Horizon line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent" />

      {/* Terminal window */}
      <div className="relative w-[88%] rounded-md border border-white/5 bg-black/30">
        {/* Title bar */}
        <div className="flex items-center gap-1 border-b border-white/5 px-3 py-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-red-400/30" />
          <div className="h-1.5 w-1.5 rounded-full bg-yellow-400/30" />
          <div className="h-1.5 w-1.5 rounded-full bg-green-400/30" />
        </div>

        {/* Content */}
        <div className="p-3 font-mono text-[10px] leading-[1.8]">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} ref={(el) => { if (el) linesRef.current[i] = el; }} className="h-[1.8em]">
              {i === 0 ? " " : ""}
            </div>
          ))}
          {/* Cursor on last line */}
          <span
            ref={cursorRef}
            className="ml-0.5 hidden text-cyan-400 animate-[blink_1.2s_ease-in-out_infinite]"
          >
            █
          </span>
        </div>
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
      {bentoItem.bgType === "meteor" && <MeteorCanvas />}
      {bentoItem.bgType === "terminal" && <MinimalTerminal />}

      {/* Text overlay — always on top */}
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
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
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
