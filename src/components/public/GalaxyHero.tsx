"use client";

import { useRef, useEffect, useCallback } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ChevronDown } from "lucide-react";

interface GalaxyParticle {
  r: number;
  theta: number;
  scatterR: number;
  scatterTheta: number;
  z: number;
  color: string;
  size: number;
}

const ARM_COUNT = 3;
const PARTICLES_PER_ARM = 35;
const TOTAL = ARM_COUNT * PARTICLES_PER_ARM;
const ROTATION_PERIOD_MS = 100_000;
const R_START = 3;
const SPIRAL_B = 0.18;

function hslToRgba(h: number, s: number, l: number, a: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  const rr = Math.round((r + m) * 255);
  const gg = Math.round((g + m) * 255);
  const bb = Math.round((b + m) * 255);
  return `rgba(${rr},${gg},${bb},${a.toFixed(3)})`;
}

function getColorForRadius(t: number, z: number): string {
  // t: 0=center, 1=edge. z: 0=far, 1=near
  const alpha = 0.12 + z * 0.65;
  if (t < 0.12) {
    const s = t / 0.12;
    return hslToRgba(187 - s * 187, 1, 0.55 + s * 0.45, alpha);
  }
  if (t < 0.45) {
    const s = (t - 0.12) / 0.33;
    return hslToRgba(190 + s * 15, 0.9, 0.6 - s * 0.3, alpha);
  }
  if (t < 0.75) {
    const s = (t - 0.45) / 0.3;
    return hslToRgba(205 + s * 20, 0.85, 0.3 - s * 0.15, alpha);
  }
  const s = (t - 0.75) / 0.25;
  return hslToRgba(225 + s * 15, 0.8, 0.15 - s * 0.08, alpha);
}

function createParticles(w: number, h: number): GalaxyParticle[] {
  const cx = w / 2;
  const cy = h / 2;
  const rMax = 0.85 * Math.sqrt(cx * cx + cy * cy);
  const thetaMax = Math.log(rMax / R_START) / SPIRAL_B;

  const particles: GalaxyParticle[] = [];

  for (let arm = 0; arm < ARM_COUNT; arm++) {
    const armOffset = arm * ((2 * Math.PI) / ARM_COUNT);
    for (let i = 0; i < PARTICLES_PER_ARM; i++) {
      const t = i / (PARTICLES_PER_ARM - 1);
      const theta = t * thetaMax * (0.85 + Math.random() * 0.15) + armOffset;
      const r = R_START * Math.exp(SPIRAL_B * theta);
      const normalizedR = r / rMax;
      const scatterR = (Math.random() - 0.5) * r * 0.1;
      const scatterTheta = (Math.random() - 0.5) * 0.2;

      const zBias = 1 - normalizedR;
      const z = Math.max(0, Math.min(1, zBias + (Math.random() - 0.5) * 0.4));

      particles.push({
        r,
        theta,
        scatterR,
        scatterTheta,
        z,
        color: getColorForRadius(Math.min(1, normalizedR), z),
        size: 0.6 + z * 2.0,
      });
    }
  }

  return particles;
}

export function GalaxyHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<GalaxyParticle[]>([]);
  const elapsedRef = useRef(0);
  const animIdRef = useRef(0);
  const dimsRef = useRef({ w: 0, h: 0 });
  const reducedMotion = useReducedMotion();

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const { w, h } = dimsRef.current;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#020205";
    ctx.fillRect(0, 0, w, h);

    // Subtle radial gradient background
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.6);
    grad.addColorStop(0, "rgba(6,182,212,0.04)");
    grad.addColorStop(0.5, "rgba(6,100,180,0.02)");
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    if (!reducedMotion) {
      const dt = 16.67;
      elapsedRef.current += dt;
      const rotationAngle = (elapsedRef.current / ROTATION_PERIOD_MS) * 2 * Math.PI;

      const ps = particlesRef.current;
      for (const p of ps) {
        const theta = p.theta + rotationAngle + p.scatterTheta;
        const r = p.r + p.scatterR;
        const x = cx + r * Math.cos(theta);
        const y = cy + r * Math.sin(theta);
        const scale = 1.0 + p.z * 0.6;
        const size = p.size * scale;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        // Bright core glow for near-center particles
        if (p.z > 0.75 && r < Math.min(w, h) * 0.3) {
          ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${(0.08 + p.z * 0.15).toFixed(3)})`);
          ctx.beginPath();
          ctx.arc(x, y, size * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else {
      // Static frame for reduced motion
      const ps = particlesRef.current;
      for (const p of ps) {
        const theta = p.theta + p.scatterTheta;
        const r = p.r + p.scatterR;
        const x = cx + r * Math.cos(theta);
        const y = cy + r * Math.sin(theta);
        const scale = 1.0 + p.z * 0.6;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(x, y, p.size * scale, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    animIdRef.current = requestAnimationFrame(drawFrame);
  }, [reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      const ctx = canvas!.getContext("2d")!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dimsRef.current = { w, h };
      particlesRef.current = createParticles(w, h);
    }

    resize();
    animIdRef.current = requestAnimationFrame(drawFrame);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animIdRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [drawFrame]);

  function handleArrowClick() {
    const el = document.getElementById("about");
    el?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="relative h-screen overflow-hidden" style={{ background: "#020205" }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Gradient mask for text readability — bottom-left to upper-right */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(2,2,5,0.85) 0%, rgba(2,2,5,0.5) 35%, transparent 65%)",
        }}
      />

      {/* Text content */}
      <div className="absolute bottom-[15%] left-6 sm:left-10 lg:left-16 z-10 max-w-lg">
        <p className="text-xs sm:text-sm font-medium tracking-[0.2em] uppercase text-cyan-400 mb-3">
          AI × 语言研究
        </p>
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white">
          赵<span className="text-brand-cyan" style={{ textShadow: "0 0 40px rgba(6,182,212,0.4)" }}>琰</span>
        </h1>
        <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed max-w-md">
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
