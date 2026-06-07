"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ChevronDown } from "lucide-react";

const STAR_COUNT = 25;

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

function createStars(w: number, h: number): Star[] {
  return Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.15,
    vy: (Math.random() - 0.5) * 0.15 - 0.05,
    size: Math.random() < 0.3 ? 1.2 : 0.7,
    alpha: Math.random() * 0.12 + 0.04,
  }));
}

export function GalaxyHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animIdRef = useRef(0);
  const dimsRef = useRef({ w: 0, h: 0 });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) return;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      const ctx = canvas!.getContext("2d")!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dimsRef.current = { w, h };
      starsRef.current = createStars(w, h);
    }

    function draw() {
      const ctx = canvas!.getContext("2d")!;
      const { w, h } = dimsRef.current;

      ctx.clearRect(0, 0, w, h);

      for (const s of starsRef.current) {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = w;
        if (s.x > w) s.x = 0;
        if (s.y < 0) s.y = h;
        if (s.y > h) s.y = 0;

        const isBright = s.size > 1;
        ctx.fillStyle = isBright
          ? `rgba(6,182,212,${s.alpha})`
          : `rgba(255,255,255,${s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animIdRef.current = requestAnimationFrame(draw);
    }

    resize();
    animIdRef.current = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animIdRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [reducedMotion]);

  function handleArrowClick() {
    const el = document.getElementById("about");
    el?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="relative h-screen overflow-hidden bg-black">
      {/* Background image */}
      <Image
        src="/hero-bg.jpg"
        alt=""
        fill
        priority
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: "center bottom" }}
        sizes="100vw"
      />

      {/* Layer 1: bottom darkening gradient for text readability */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 30%, transparent 60%)",
        }}
      />

      {/* Layer 2: radial vignette to darken edges */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Subtle star particle overlay */}
      {!reducedMotion && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-[2] pointer-events-none"
        />
      )}

      {/* Text content */}
      <div className="absolute bottom-[15%] left-6 sm:left-10 lg:left-16 z-10 max-w-md">
        <p className="text-xs sm:text-sm font-medium tracking-[0.2em] uppercase text-cyan-400 mb-3"
          style={{ textShadow: "0 0 20px rgba(0,0,0,0.8)" }}
        >
          AI × 语言研究
        </p>
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white"
          style={{ textShadow: "0 0 60px rgba(0,0,0,0.9)" }}
        >
          赵<span className="text-brand-cyan">琰</span>
        </h1>
        <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed"
          style={{ textShadow: "0 0 20px rgba(0,0,0,0.9)" }}
        >
          山东大学翻译学院本科生 · OutEye 系列维护者 · 挑战杯揭榜挂帅参赛者
        </p>
      </div>

      {/* Scroll arrow */}
      <button
        onClick={handleArrowClick}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/50 hover:text-white/80 transition-colors cursor-pointer"
        style={{ animation: "floatArrow 2s ease-in-out infinite" }}
        aria-label="向下滚动"
      >
        <ChevronDown className="h-7 w-7" />
      </button>
    </section>
  );
}
