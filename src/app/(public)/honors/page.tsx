"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";

const coreHonors = [
  {
    year: "2026",
    title: "挑战杯揭榜挂帅",
    subtitle: "XH-202620 学科垂类大模型与创新应用开发",
    level: "国家级",
    status: "进行中",
    progress: 60,
    materials: [
      { name: "报名表", done: true },
      { name: "方案书", done: true },
      { name: "答辩PPT", done: false },
      { name: "演示视频", done: false },
    ],
    images: [] as string[],
  },
  {
    year: "2025",
    title: "山东大学自强之星",
    subtitle: "",
    level: "校级最高荣誉",
    status: "已获得",
    progress: 100,
    materials: [],
    images: ["/assets/images/honors/self-reliance-star.jpg"],
  },
  {
    year: "2025.12",
    title: "第一届新文科国际会议",
    subtitle: "投稿并获参会邀请 · 香港新文科答辩",
    level: "学术会议",
    status: "已获得",
    progress: 100,
    materials: [],
    images: ["/assets/images/honors/new-liberal-arts-cert.jpg"],
  },
  {
    year: "2025",
    title: "桥见中国·BRI沿线国家中国形象调研团",
    subtitle: "负责人 · 寒假社会实践",
    level: "院级二等奖",
    status: "已获得",
    progress: 100,
    materials: [],
    images: ["/assets/images/honors/winter-social-practice.jpg"],
  },
  {
    year: "2023",
    title: '第四届"新生杯"创业计划竞赛优胜奖',
    subtitle: "荣光薪传—全民国防教育服务平台",
    level: "校级",
    status: "已获得",
    progress: 100,
    materials: [],
    images: ["/assets/images/honors/freshmen-cup-merit.jpg"],
  },
  {
    year: "2023",
    title: "军训优秀学员",
    subtitle: "军事训练期间表现突出",
    level: "校级",
    status: "已获得",
    progress: 100,
    materials: [],
    images: ["/assets/images/honors/military-excellent.jpg"],
  },
];

const allHonors = [
  { year: "2026", title: "趣味运动会团队二等奖", level: "校级", image: "/assets/images/honors/fun-games-2nd.jpg" },
  { year: "2025.12", title: "第一届新文科国际会议", level: "学术会议", note: "投稿并获参会邀请 · 香港新文科答辩", image: "/assets/images/honors/new-liberal-arts-cert.jpg" },
  { year: "2025", title: "自强之星", level: "校级最高荣誉", image: "/assets/images/honors/self-reliance-star.jpg" },
  { year: "2025", title: "桥见中国·BRI沿线国家中国形象调研团", level: "院级二等奖", note: "负责人 · 寒假社会实践", image: "/assets/images/honors/winter-social-practice.jpg" },
  { year: "2025", title: "红色故事短剧大赛三等奖", level: "院级", image: "/assets/images/honors/red-drama-3rd.jpg" },
  { year: "2025", title: "军训歌咏比赛一等奖", level: "院级", image: "/assets/images/honors/military-choir-1st.jpg" },
  { year: "2025", title: "爱国主题教育征文活动三等奖", level: "校级", image: "/assets/images/honors/patriotic-essay-3rd.jpg" },
  { year: "2025", title: "拔河比赛第三名", level: "校级", image: "/assets/images/honors/tug-war-3rd.jpg" },
  { year: "2023", title: "军训优秀学员", level: "校级", image: "/assets/images/honors/military-excellent.jpg" },
  { year: "2023", title: "砺刃-2023军事基础技能比武 · 战斗小组单项科目第二名", level: "校级", image: "/assets/images/honors/military-2nd.jpg" },
  { year: "2023", title: '第四届"新生杯"创业计划竞赛优胜奖', level: "校级", image: "/assets/images/honors/freshmen-cup-merit.jpg" },
  { year: "2022", title: '煅镝-2022野外综合训练"训练标兵"', level: "校级", image: "/assets/images/honors/nudt-training-model.jpg" },
  { year: "2022-2023", title: '国防科技大学"学习之星"（两度）', level: "校级", image: "/assets/images/honors/nudt-star-learner.jpg" },
  { year: "2022-2023", title: '国防科技大学"学习标兵"', level: "校级", image: "/assets/images/honors/nudt-model-learner.jpg" },
  { year: "2022", title: "团校培训优秀学员", level: "校级", image: "/assets/images/honors/youth-school-excellent.jpg" },
  { year: "2022", title: "国防科技大学就读证书", level: "校级", image: "/assets/images/honors/nudt-enrollment.jpg" },
  { year: "2022", title: "国防科技大学心理骨干聘书", level: "校级", image: "/assets/images/honors/nudt-psychology.jpg" },
];

export default function HonorsPage() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="text-4xl font-bold tracking-tight">荣誉奖项</h1>
      <p className="mt-2 text-muted-foreground">
        学术竞赛与个人成长的时间线
      </p>

      {/* Core Honors Timeline */}
      <div className="mt-16 space-y-12">
        {coreHonors.map((honor, i) => (
          <motion.div
            key={honor.title}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="relative pl-8 before:absolute before:left-3 before:top-0 before:h-full before:w-px before:bg-gradient-to-b before:from-brand-cyan before:to-brand-violet"
          >
            <div className="absolute left-1.5 top-1 h-3 w-3 rounded-full bg-brand-cyan shadow-[0_0_8px_rgba(6,182,212,0.5)]" />

            <div className="rounded-xl surface-card p-6">
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-brand-cyan">{honor.year}</span>
                <span className="rounded bg-black/5 dark:bg-white/5 px-2 py-0.5 text-xs text-muted-foreground">
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

              {honor.status === "进行中" && (
                <div className="mt-4">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-cyan to-brand-violet"
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

              {honor.images.length === 0 && honor.status !== "进行中" && (
                <div className="mt-4 flex gap-2">
                  <div className="h-20 w-28 rounded-lg border border-dashed border-black/8 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-center text-xs text-muted-foreground/70">
                    证书图片
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
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
