"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import type { AllHonorEntry } from "@/lib/honors-data";

interface Props {
  allHonors: AllHonorEntry[];
}

export function HonorsWall({ allHonors }: Props) {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {allHonors.map((honor, i) => (
          <motion.div
            key={`${honor.title}-${i}`}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
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
                  className="object-cover opacity-75 transition-all duration-300 group-hover:opacity-100 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/80 via-black/25 to-transparent p-3 text-center transition-opacity duration-300 group-hover:from-black/60">
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

      {/* Lightbox */}
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
    </>
  );
}
