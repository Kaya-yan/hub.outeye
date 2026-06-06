"use client";

import { useState, useRef, useCallback } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { MatrixRain } from "@/components/login/MatrixRain";
import { BootSequence } from "@/components/login/BootSequence";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showBoot, setShowBoot] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleBootComplete = useCallback(() => {
    window.location.href = "/dashboard";
    timeoutRef.current = setTimeout(() => {
      window.location.reload();
    }, 3000);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("ACCESS DENIED");
      setLoading(false);
    } else {
      setShowBoot(true);
    }
  }

  if (showBoot) {
    return <BootSequence onComplete={handleBootComplete} />;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090B]">
      <MatrixRain />

      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-[440px] mx-4"
      >
        {/* Terminal window */}
        <div className="rounded-xl border border-brand-cyan/20 bg-[#0c0c0e]/90 backdrop-blur-xl overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.08)]">
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-brand-cyan/10 px-4 py-2.5">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
            </div>
            <span className="ml-2 font-mono text-[11px] text-brand-cyan/60">
              zhaoyan@hub:~$ login
            </span>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* ASCII art header */}
            <pre className="font-mono text-[10px] leading-tight text-brand-cyan/40 text-center select-none">
{` _____ _____ _   _ ______   ___  _   _ _____
|__  /|  _  | | | || ___ \\ / _ \\| | | |_   _|
  / / | | | | |_| || |_/ // /_\\ \\ | | | | |
 / /  | | | |  _  ||    / |  _  | | | | | |
/ /__ \\ \\_/ / | | || |\\ \\ | | | \\ \\_/ /_| |_
\\____/ \\___/\\_| |_/\_| \\_|\\_| |_/\\___/ \\___/`}
            </pre>

            <div className="space-y-1 font-mono text-xs text-zinc-500">
              <p>ZhaoyanHub Personal Digital Nexus</p>
              <p>Secure connection established</p>
            </div>

            {/* Login form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block font-mono text-[11px] text-brand-cyan/60">
                  {"❯"} PASSWORD
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoFocus
                    autoComplete="current-password"
                    className="w-full rounded-md border border-brand-cyan/15 bg-black/40 px-3 py-2.5 font-mono text-sm text-foreground placeholder:text-zinc-600 focus:border-brand-cyan/40 focus:outline-none focus:shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all"
                    placeholder="输入密码..."
                  />
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-mono text-xs text-red-400"
                >
                  {"❯"} {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md border border-brand-cyan/30 bg-brand-cyan/10 py-2.5 font-mono text-sm text-brand-cyan transition-all hover:bg-brand-cyan/20 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="animate-pulse">▮</span> 验证中...
                  </span>
                ) : (
                  "> 验证身份 [ENTER]"
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="border-t border-brand-cyan/10 pt-3 font-mono text-[10px] text-zinc-600 space-y-0.5">
              <p>赵琰 · 山东大学翻译学院</p>
              <p>AI × 语言研究 · OutEye Series</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
