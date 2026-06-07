"use client";

import { motion } from "framer-motion";
import type { HonorEntry } from "@/lib/honors-data";
import { getLevelColor } from "@/lib/honors-data";

interface Props {
  coreHonors: HonorEntry[];
}

export function HonorsTimeline({ coreHonors }: Props) {
  return (
    <>
      {/* Desktop: Horizontal timeline */}
      <div className="hidden lg:block relative mt-16">
        {/* Horizontal line */}
        <div className="absolute top-[36px] left-0 right-0 h-px bg-white/[0.08]" />

        <div className="grid grid-cols-3 gap-8">
          {coreHonors.map((honor, i) => {
            const colors = getLevelColor(honor.level);
            return (
              <motion.div
                key={honor.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex flex-col items-center text-center"
              >
                {/* Year label above line */}
                <span className="text-xs font-mono text-cyan-400 mb-3">{honor.year}</span>

                {/* Node on line */}
                <div className={`relative z-10 w-3 h-3 rounded-full ${colors.dot} ${colors.glow} mb-5`} />

                {/* Card */}
                <div className={`w-full rounded-xl border ${colors.border} bg-card/40 backdrop-blur-sm p-5 text-left transition-all duration-300 ${colors.hoverBorder} hover:-translate-y-0.5 ${colors.hoverShadow}`}>
                  <span className={`text-[11px] ${colors.text} font-medium`}>{honor.level}</span>
                  <h3 className="mt-2 font-semibold text-sm">{honor.title}</h3>
                  {honor.subtitle && (
                    <p className="mt-1 text-xs text-slate-400">{honor.subtitle}</p>
                  )}

                  {honor.status === "进行中" && honor.materials.length > 0 && (
                    <div className="mt-3">
                      <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-brand-cyan"
                          style={{ width: `${honor.progress}%` }}
                        />
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {honor.materials.map((m) => (
                          <span
                            key={m.name}
                            className={`text-[10px] rounded px-1.5 py-0.5 ${
                              m.done
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-white/5 text-muted-foreground"
                            }`}
                          >
                            {m.done ? "✓" : "◯"} {m.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mobile: Vertical timeline */}
      <div className="lg:hidden mt-12 space-y-8">
        {coreHonors.map((honor, i) => {
          const colors = getLevelColor(honor.level);
          return (
            <motion.div
              key={honor.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative pl-10 before:absolute before:left-[15px] before:top-0 before:h-full before:w-px before:bg-white/[0.08]"
            >
              {/* Node */}
              <div className={`absolute left-[9px] top-1 w-3.5 h-3.5 rounded-full ${colors.dot} ${colors.glow}`} />

              {/* Year */}
              <span className="text-xs font-mono text-cyan-400">{honor.year}</span>

              {/* Card */}
              <div className={`mt-2 rounded-xl border ${colors.border} bg-card/40 backdrop-blur-sm p-4`}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[11px] ${colors.text}`}>{honor.level}</span>
                  {honor.status === "进行中" && (
                    <span className="text-[10px] text-brand-cyan bg-brand-cyan/10 rounded px-2 py-0.5">
                      {honor.status}
                    </span>
                  )}
                </div>

                <h3 className="mt-2 font-semibold">{honor.title}</h3>
                {honor.subtitle && (
                  <p className="mt-1 text-xs text-slate-400">{honor.subtitle}</p>
                )}

                {honor.status === "进行中" && honor.materials.length > 0 && (
                  <div className="mt-3">
                    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-brand-cyan"
                        style={{ width: `${honor.progress}%` }}
                      />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {honor.materials.map((m) => (
                        <span
                          key={m.name}
                          className={`text-[10px] rounded px-1.5 py-0.5 ${
                            m.done
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-white/5 text-muted-foreground"
                          }`}
                        >
                          {m.done ? "✓" : "◯"} {m.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
