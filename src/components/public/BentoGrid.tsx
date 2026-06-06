"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

const items = [
  {
    title: "OutEye 系列",
    subtitle: "4 个 AI 产品，从原型到产品化",
    bgImage: "/assets/images/projects/outeye2/screenshot-1.jpg",
    span: "col-span-2 row-span-2",
  },
  {
    title: "MiMo 800亿",
    subtitle: "月消耗 Token 规模",
    bgImage: null,
    gradient: "from-brand-violet/20 to-transparent",
    span: "",
  },
  {
    title: "挑战杯",
    subtitle: "揭榜挂帅 · 国家级 · 进行中",
    bgImage: "/assets/images/challenge-cup/tiaozhanbeihaibao.jpg",
    span: "",
  },
  {
    title: "技术栈",
    subtitle: "Next.js · React · TypeScript · Tailwind",
    bgImage: null,
    gradient: "from-white/[0.06] to-transparent",
    span: "col-span-2",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const itemVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function BentoCard({ bentoItem }: { bentoItem: (typeof items)[number] }) {
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    cardRef.current!.style.setProperty("--x", `${e.clientX - rect.left}px`);
    cardRef.current!.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      variants={itemVariant}
      className={`spotlight-card group relative col-span-1 overflow-hidden rounded-xl border border-black/8 dark:border-white/10 ${bentoItem.span} flex min-h-[180px] items-end`}
    >
      {/* Background */}
      {bentoItem.bgImage ? (
        <img
          src={bentoItem.bgImage}
          alt={bentoItem.title}
          className="absolute inset-0 h-full w-full object-cover opacity-40 transition-opacity duration-300 group-hover:opacity-50"
        />
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${bentoItem.gradient || "from-brand-cyan/10 to-transparent"}`}
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Content */}
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
    <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-12">
      <h2 className="mb-6 text-sm font-medium text-neutral-500">
        核心亮点
      </h2>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-2 gap-3 md:grid-cols-4"
      >
        {items.map((bentoItem, i) => (
          <BentoCard key={bentoItem.title} bentoItem={bentoItem} />
        ))}
      </motion.div>
    </section>
  );
}
