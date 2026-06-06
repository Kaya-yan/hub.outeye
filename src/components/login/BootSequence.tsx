"use client";

import { useState, useEffect } from "react";

const LINES = [
  { text: "> INITIALIZING ZHAOYAN HUB PROTOCOL...", delay: 0 },
  { text: "> AUTHENTICATING CREDENTIALS... [OK]", delay: 400 },
  { text: "> SYNCING NEURAL LINK...", delay: 800 },
  { text: "> LOADING PROJECT DATA... [100%]", delay: 1200 },
  { text: "> ACCESS GRANTED", delay: 1600, color: "text-emerald-400" },
];

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    LINES.forEach((line, i) => {
      timers.push(
        setTimeout(() => setVisibleLines(i + 1), line.delay)
      );
    });
    timers.push(setTimeout(onComplete, 2400));
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-6 font-mono text-sm space-y-1">
        {LINES.slice(0, visibleLines).map((line, i) => (
          <p
            key={i}
            className={`${line.color || "text-brand-cyan"} opacity-0 animate-[fadeIn_0.2s_ease-out_forwards]`}
            style={{ animationDelay: "0ms" }}
          >
            {line.text}
          </p>
        ))}
        {visibleLines >= LINES.length && (
          <div className="mt-4 h-0.5 w-full overflow-hidden rounded-full bg-zinc-800">
            <div className="h-full rounded-full brand-gradient animate-[loadBar_0.6s_ease-out_forwards]" />
          </div>
        )}
      </div>
    </div>
  );
}
