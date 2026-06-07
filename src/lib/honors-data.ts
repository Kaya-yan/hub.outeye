export interface HonorEntry {
  year: string;
  title: string;
  subtitle: string;
  level: string;
  status: "进行中" | "已获得";
  progress: number;
  materials: { name: string; done: boolean }[];
  images: string[];
}

export interface AllHonorEntry {
  year: string;
  title: string;
  level: string;
  note?: string;
  image: string;
}

export function getLevelColor(level: string) {
  if (level.includes("国家级")) return {
    bg: "bg-red-500",
    text: "text-red-400",
    border: "border-red-500/30",
    hoverBorder: "hover:border-red-500/50",
    hoverShadow: "hover:shadow-[0_8px_30px_rgba(239,68,68,0.15)]",
    dot: "bg-red-500",
    glow: "shadow-[0_0_8px_rgba(239,68,68,0.5)]",
  };
  if (level.includes("省级") || level.includes("学术")) return {
    bg: "bg-amber-500",
    text: "text-amber-400",
    border: "border-amber-500/30",
    hoverBorder: "hover:border-amber-500/50",
    hoverShadow: "hover:shadow-[0_8px_30px_rgba(245,158,11,0.15)]",
    dot: "bg-amber-500",
    glow: "shadow-[0_0_8px_rgba(245,158,11,0.5)]",
  };
  if (level.includes("校级")) return {
    bg: "bg-blue-500",
    text: "text-blue-400",
    border: "border-blue-500/30",
    hoverBorder: "hover:border-blue-500/50",
    hoverShadow: "hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)]",
    dot: "bg-blue-500",
    glow: "shadow-[0_0_8px_rgba(59,130,246,0.5)]",
  };
  if (level.includes("院级")) return {
    bg: "bg-cyan-500",
    text: "text-cyan-400",
    border: "border-cyan-500/30",
    hoverBorder: "hover:border-cyan-500/50",
    hoverShadow: "hover:shadow-[0_8px_30px_rgba(6,182,212,0.15)]",
    dot: "bg-cyan-500",
    glow: "shadow-[0_0_8px_rgba(6,182,212,0.5)]",
  };
  return {
    bg: "bg-brand-cyan",
    text: "text-brand-cyan",
    border: "border-brand-cyan/30",
    hoverBorder: "hover:border-brand-cyan/50",
    hoverShadow: "hover:shadow-[0_8px_30px_rgba(6,182,212,0.15)]",
    dot: "bg-brand-cyan",
    glow: "shadow-[0_0_8px_rgba(6,182,212,0.5)]",
  };
}

export const coreHonors: HonorEntry[] = [
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
    images: [],
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

export const allHonors: AllHonorEntry[] = [
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
