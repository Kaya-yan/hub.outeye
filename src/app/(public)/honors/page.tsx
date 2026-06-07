"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { coreHonors, allHonors, getLevelColor } from "@/lib/honors-data";

export default function HonorsPage() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="text-4xl font-bold tracking-tight">荣誉奖项</h1>
      <p className="mt-2 text-muted-foreground">
        学术竞赛与个人成长的时间线
      </p>

      {/* Alternating Timeline */}
      <div className="relative mt-16">
        {/* Central timeline line — desktop only */}
        <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-brand-cyan/40 via-brand-cyan/20 to-transparent md:block" />

        {/* Mobile left timeline line */}
        <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-brand-cyan/40 via-brand-cyan/20 to-transparent md:hidden" />

        <div className="space-y-12 md:space-y-16">
          {coreHonors.map((honor, i) => {
            const isLeft = i % 2 === 0;
            const colors = getLevelColor(honor.level);

            return (
              <motion.div
                key={honor.title}
                initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`relative flex items-start ${
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Desktop: center node */}
                <div className="absolute left-1/2 top-4 z-10 hidden -translate-x-1/2 md:block">
                  <div className={`h-4 w-4 rounded-full ${colors.dot} shadow-lg animate-[pulse_2.5s_ease-in-out_infinite]`} />
                </div>

                {/* Mobile: left node */}
                <div className="absolute left-2.5 top-4 z-10 md:hidden">
                  <div className={`h-3.5 w-3.5 rounded-full ${colors.dot} shadow-lg animate-[pulse_2.5s_ease-in-out_infinite]`} />
                </div>

                {/* Card */}
                <div className={`ml-10 w-full md:ml-0 md:w-[calc(50%-2rem)] ${isLeft ? "md:pr-0" : "md:pl-0"}`}>
                  <div
                    className={`group rounded-xl border bg-card/60 backdrop-blur-sm p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${colors.border} ${colors.hoverBorder} ${colors.hoverShadow}`}
                  >
                    {/* Header */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-mono text-brand-cyan">{honor.year}</span>
                      <span className={`rounded px-2 py-0.5 text-xs ${colors.text} ${colors.bg}/10`}>
                        {honor.level}
                      </span>
                      {honor.status === "进行中" && (
                        <span className="rounded bg-brand-cyan/10 px-2 py-0.5 text-xs text-brand-cyan">
                          {honor.status}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 text-lg font-semibold">{honor.title}</h3>
                    {honor.subtitle && (
                      <p className="mt-1 text-sm text-muted-foreground">{honor.subtitle}</p>
                    )}

                    {/* Progress bar for in-progress items */}
                    {honor.status === "进行中" && (
                      <div className="mt-4">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10">
                          <div
                            className="h-full rounded-full bg-brand-cyan"
                            style={{ width: `${honor.progress}%` }}
                          />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {honor.materials.map((m) => (
                            <span
                              key={m.name}
                              className={`rounded-md px-2 py-1 text-xs ${
                                m.done
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-black/5 dark:bg-white/5 text-muted-foreground"
                              }`}
                            >
                              {m.done ? "✓" : "◯"} {m.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Images */}
                    {honor.images.length > 0 && (
                      <div className="mt-4 flex gap-2 overflow-x-auto">
                        {honor.images.map((src) => (
                          <button
                            key={src}
                            onClick={() => setLightbox({ src, alt: honor.title })}
                            className="relative h-32 w-48 shrink-0 overflow-hidden rounded-lg border border-black/8 dark:border-white/10 cursor-zoom-in transition-transform duration-300 hover:scale-105"
                          >
                            <Image src={src} alt={honor.title} fill className="object-cover" sizes="192px" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Placeholder for missing images */}
                    {honor.images.length === 0 && honor.status !== "进行中" && (
                      <div className="mt-4 flex gap-2">
                        <div className="h-20 w-28 rounded-lg border border-dashed border-black/8 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-center text-xs text-muted-foreground/70">
                          证书图片
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Honor Wall */}
      <div className="mt-20">
        <h2 className="mb-6 text-xl font-semibold">荣誉墙</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {allHonors.map((honor, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              onClick={() => honor.image && setLightbox({ src: honor.image, alt: honor.title })}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg surface-card transition-all duration-300 hover:scale-105 hover:border-brand-cyan/20"
              style={honor.image ? { cursor: "zoom-in" } : undefined}
            >
              {honor.image ? (
                <>
                  <Image
                    src={honor.image}
                    alt={honor.title}
                    fill
                    className="object-cover opacity-80 transition-opacity group-hover:opacity-100"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 text-center">
                    <span className="text-xs font-mono text-white/80">{honor.year}</span>
                    <p className="mt-1 text-xs font-medium leading-tight text-white">{honor.title}</p>
                    <span className="mt-1 text-[10px] text-white/80">{honor.level}</span>
                  </div>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-3 text-center">
                  <span className="text-xs font-mono text-brand-cyan/60">{honor.year}</span>
                  <p className="mt-1 text-xs font-medium leading-tight text-foreground/80">{honor.title}</p>
                  <span className="mt-1 text-[10px] text-muted-foreground/70">{honor.level}</span>
                  {"note" in honor && honor.note && (
                    <span className="mt-0.5 text-[9px] text-muted-foreground/60 leading-tight">{honor.note}</span>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-h-[90vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightbox(null)}
                className="absolute -top-10 right-0 rounded-full p-1.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <Image
                src={lightbox.src}
                alt={lightbox.alt}
                width={1200}
                height={900}
                className="max-h-[85vh] w-auto rounded-lg object-contain shadow-2xl"
                unoptimized
              />
              <p className="mt-2 text-center text-sm text-white/80">{lightbox.alt}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
