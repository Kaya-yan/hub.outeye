"use client";

import { useState } from "react";

interface Tool {
  name: string;
  url: string;
  color: string;
  desc: string;
}

interface Category {
  id: string;
  label: string;
  icon: string;
  tools: Tool[];
}

const categories: Category[] = [
  {
    id: "ai",
    label: "AI 对话",
    icon: "🤖",
    tools: [
      { name: "DeepSeek", url: "https://chat.deepseek.com", color: "from-blue-500/20", desc: "主力代码辅助" },
      { name: "Kimi", url: "https://kimi.moonshot.cn", color: "from-purple-500/20", desc: "长文本/文档" },
      { name: "Claude", url: "https://claude.ai", color: "from-orange-500/20", desc: "通用对话" },
      { name: "MiMo", url: "https://mimo.xiaomi.com", color: "from-green-500/20", desc: "小米激励计划" },
      { name: "ChatGPT", url: "https://chatgpt.com", color: "from-teal-500/20", desc: "OpenAI 通用" },
      { name: "Gemini", url: "https://gemini.google.com", color: "from-sky-500/20", desc: "Google 多模态" },
      { name: "Cursor", url: "https://cursor.sh", color: "from-violet-500/20", desc: "AI 原生编辑器" },
      { name: "Copilot", url: "https://github.com/features/copilot", color: "from-indigo-500/20", desc: "代码补全" },
    ],
  },
  {
    id: "dev",
    label: "开发部署",
    icon: "☁️",
    tools: [
      { name: "GitHub", url: "https://github.com/Kaya-yan", color: "from-gray-500/20", desc: "代码仓库" },
      { name: "Vercel", url: "https://vercel.com/dashboard", color: "from-white/10", desc: "部署平台" },
      { name: "Neon", url: "https://console.neon.tech", color: "from-emerald-500/20", desc: "Serverless PostgreSQL" },
      { name: "Supabase", url: "https://supabase.com/dashboard", color: "from-emerald-600/20", desc: "OutEye 数据库" },
      { name: "Hoppscotch", url: "https://hoppscotch.io", color: "from-lime-500/20", desc: "API 测试" },
      { name: "JSON Formatter", url: "https://jsonformatter.org", color: "from-amber-500/20", desc: "JSON 美化" },
    ],
  },
  {
    id: "academic",
    label: "学术研究",
    icon: "🎓",
    tools: [
      { name: "DeepL", url: "https://deepl.com/translator", color: "from-blue-600/20", desc: "学术翻译首选" },
      { name: "Overleaf", url: "https://overleaf.com", color: "from-green-600/20", desc: "LaTeX 论文写作" },
      { name: "Xmind", url: "https://xmind.cn", color: "from-red-500/20", desc: "思维导图" },
      { name: "Grammarly", url: "https://grammarly.com", color: "from-green-500/20", desc: "英文写作润色" },
      { name: "CNKI 翻译", url: "https://dict.cnki.net", color: "from-blue-700/20", desc: "学术术语翻译" },
      { name: "Boardmix", url: "https://boardmix.cn", color: "from-cyan-600/20", desc: "AI 论文摘要" },
    ],
  },
  {
    id: "design",
    label: "设计效率",
    icon: "🎨",
    tools: [
      { name: "Excalidraw", url: "https://excalidraw.com", color: "from-yellow-500/20", desc: "手绘架构图" },
      { name: "Figma", url: "https://figma.com", color: "from-pink-500/20", desc: "UI 设计" },
      { name: "Obsidian", url: "https://obsidian.md", color: "from-purple-600/20", desc: "个人知识库" },
      { name: "Tavily", url: "https://tavily.com", color: "from-cyan-500/20", desc: "AI 搜索 API" },
      { name: "Motionsite", url: "https://motionsites.ai", color: "from-cyan-500/20", desc: "AI 动效网站生成" },
      { name: "Liblib", url: "https://www.liblib.art/", color: "from-pink-500/20", desc: "AI 绘画模型平台" },
      { name: "Coze", url: "https://www.coze.cn", color: "from-rose-500/20", desc: "AI Bot 搭建" },
    ],
  },
  {
    id: "fun",
    label: "趣味生活",
    icon: "🎮",
    tools: [
      { name: "电子木鱼", url: "https://ol.woobx.cn/tool/e-muyu", color: "from-amber-600/20", desc: "解压小工具" },
      { name: "心灵毒鸡汤", url: "https://ol.woobx.cn/tool/soul-words", color: "from-rose-600/20", desc: "每日一句" },
      { name: "历史上的今天", url: "https://ol.woobx.cn/tool/histoday", color: "from-blue-500/20", desc: "素材灵感" },
      { name: "天干地支", url: "https://ol.woobx.cn/tool/ganzhi", color: "from-red-700/20", desc: "传统文化" },
      { name: "短网址", url: "https://ol.woobx.cn/tool/url-shortener", color: "from-teal-600/20", desc: "链接分享" },
      { name: "Canva", url: "https://canva.cn", color: "from-purple-500/20", desc: "海报/PPT 设计" },
      { name: "Forest", url: "https://forestapp.cc", color: "from-green-700/20", desc: "专注番茄钟" },
      { name: "知云翻译", url: "https://i.zhiyunwenxian.cn", color: "from-blue-800/20", desc: "PDF 划词翻译" },
    ],
  },
  {
    id: "campus",
    label: "校园服务",
    icon: "🏫",
    tools: [
      { name: "山大认证", url: "https://pass.sdu.edu.cn/cas/login?service=https%3A%2F%2Fservice.sdu.edu.cn%2Ftp_up%2Fview%3Fm%3Dup", color: "from-red-600/20", desc: "统一身份认证" },
      { name: "威海图书馆", url: "https://lib.wh.sdu.edu.cn", color: "from-blue-900/20", desc: "图书检索预约" },
    ],
  },
];

export function QuickLinks() {
  const [activeTab, setActiveTab] = useState(categories[0].id);
  const current = categories.find((c) => c.id === activeTab) || categories[0];

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">⚡ 工具快速导航</h2>

      {/* Tabs */}
      <div className="mb-3 flex flex-wrap gap-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-all ${
              activeTab === cat.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
            <span className="ml-0.5 text-[10px] opacity-50">{cat.tools.length}</span>
          </button>
        ))}
      </div>

      {/* Tool grid */}
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
        {current.tools.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`${link.name} — ${link.desc}`}
            className="group flex flex-col items-center gap-1.5 rounded-xl border border-black/8 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-cyan/20"
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${link.color} to-transparent text-xs font-bold text-foreground/60`}
            >
              {link.name[0]}
            </div>
            <span className="text-[10px] text-muted-foreground group-hover:text-foreground text-center leading-tight">
              {link.name}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
