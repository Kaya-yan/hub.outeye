"use client";

import { useEffect, useRef } from "react";

const CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01ZHAOYANHUB";
const FONT_SIZE = 14;
const COLUMN_GAP = 20;

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Respect reduced motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    // Mobile fallback — smaller font, fewer columns
    const isMobile = window.innerWidth < 768;
    const fontSize = isMobile ? 12 : FONT_SIZE;
    const gap = isMobile ? 28 : COLUMN_GAP;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const columns = Math.floor(w / gap);
    const drops = Array.from({ length: columns }, () => Math.random() * -100);

    let animId: number;
    let lastTime = 0;
    const interval = isMobile ? 80 : 50;

    function draw(time: number) {
      if (time - lastTime < interval) {
        animId = requestAnimationFrame(draw);
        return;
      }
      lastTime = time;

      // Fade trail
      ctx!.fillStyle = "rgba(9, 9, 11, 0.06)";
      ctx!.fillRect(0, 0, w, h);

      ctx!.font = `${fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * gap;
        const y = drops[i] * fontSize;

        // Head character — bright cyan
        ctx!.fillStyle = "#06b6d4";
        ctx!.globalAlpha = 0.9;
        ctx!.fillText(char, x, y);

        // Trail characters — darker
        ctx!.globalAlpha = 0.3;
        ctx!.fillText(char, x, y - fontSize);

        ctx!.globalAlpha = 1;

        if (y > h && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.5 + Math.random() * 0.5;
      }

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

    function handleResize() {
      w = canvas!.width = window.innerWidth;
      h = canvas!.height = window.innerHeight;
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 opacity-20"
      aria-hidden="true"
    />
  );
}
