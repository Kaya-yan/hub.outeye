"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Tool {
  name: string;
  url: string;
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
    id: "ai-chat",
    label: "AI 对话",
    icon: "🤖",
    tools: [
      { name: "DeepSeek", url: "https://chat.deepseek.com", desc: "主力代码辅助" },
      { name: "Kimi", url: "https://kimi.moonshot.cn", desc: "长文本/文档" },
      { name: "Claude", url: "https://claude.ai", desc: "通用对话" },
      { name: "MiMo", url: "https://mimo.xiaomi.com", desc: "小米激励计划" },
      { name: "ChatGPT", url: "https://chatgpt.com", desc: "OpenAI 通用" },
      { name: "Gemini", url: "https://gemini.google.com", desc: "Google 多模态" },
      { name: "Cursor", url: "https://cursor.sh", desc: "AI 原生编辑器" },
      { name: "Copilot", url: "https://github.com/features/copilot", desc: "代码补全" },
    ],
  },
  {
    id: "ai-create",
    label: "AI 创作",
    icon: "🎨",
    tools: [
      { name: "Liblib", url: "https://www.liblib.art/", desc: "AI 绘画模型平台" },
      { name: "Motionsite", url: "https://motionsites.ai", desc: "AI 动效网站生成" },
      { name: "讯飞智作", url: "https://www.xfzhizuo.cn/make", desc: "AI 配音/数字人" },
      { name: "Coze", url: "https://www.coze.cn", desc: "AI Bot 搭建" },
      { name: "Canva", url: "https://canva.cn", desc: "海报/PPT 设计" },
    ],
  },
  {
    id: "dev",
    label: "开发部署",
    icon: "☁️",
    tools: [
      { name: "GitHub", url: "https://github.com/Kaya-yan", desc: "代码仓库" },
      { name: "Vercel", url: "https://vercel.com/dashboard", desc: "部署平台" },
      { name: "Neon", url: "https://console.neon.tech", desc: "Serverless PG" },
      { name: "Supabase", url: "https://supabase.com/dashboard", desc: "OutEye 数据库" },
      { name: "Hoppscotch", url: "https://hoppscotch.io", desc: "API 测试" },
      { name: "JSON Formatter", url: "https://jsonformatter.org", desc: "JSON 美化" },
    ],
  },
  {
    id: "academic",
    label: "学术研究",
    icon: "🎓",
    tools: [
      { name: "DeepL", url: "https://deepl.com/translator", desc: "学术翻译首选" },
      { name: "Overleaf", url: "https://overleaf.com", desc: "LaTeX 论文写作" },
      { name: "Xmind", url: "https://xmind.cn", desc: "思维导图" },
      { name: "Grammarly", url: "https://grammarly.com", desc: "英文写作润色" },
      { name: "CNKI 翻译", url: "https://dict.cnki.net", desc: "学术术语翻译" },
      { name: "Boardmix", url: "https://boardmix.cn", desc: "AI 论文摘要" },
      { name: "知云翻译", url: "https://i.zhiyunwenxian.cn", desc: "PDF 划词翻译" },
      { name: "Forest", url: "https://forestapp.cc", desc: "专注番茄钟" },
    ],
  },
  {
    id: "design",
    label: "设计工具",
    icon: "✏️",
    tools: [
      { name: "Excalidraw", url: "https://excalidraw.com", desc: "手绘架构图" },
      { name: "Figma", url: "https://figma.com", desc: "UI 设计" },
      { name: "Obsidian", url: "https://obsidian.md", desc: "个人知识库" },
      { name: "Tavily", url: "https://tavily.com", desc: "AI 搜索 API" },
    ],
  },
  {
    id: "fun",
    label: "趣味生活",
    icon: "🎮",
    tools: [
      { name: "电子木鱼", url: "https://ol.woobx.cn/tool/e-muyu", desc: "解压小工具" },
      { name: "心灵毒鸡汤", url: "https://ol.woobx.cn/tool/soul-words", desc: "每日一句" },
      { name: "历史上的今天", url: "https://ol.woobx.cn/tool/histoday", desc: "素材灵感" },
      { name: "天干地支", url: "https://ol.woobx.cn/tool/ganzhi", desc: "传统文化" },
      { name: "短网址", url: "https://ol.woobx.cn/tool/url-shortener", desc: "链接分享" },
    ],
  },
  {
    id: "campus",
    label: "校园服务",
    icon: "🏫",
    tools: [
      { name: "山大认证", url: "https://pass.sdu.edu.cn/cas/login?service=https%3A%2F%2Fservice.sdu.edu.cn%2Ftp_up%2Fview%3Fm%3Dup", desc: "统一身份认证" },
      { name: "威海图书馆", url: "https://lib.wh.sdu.edu.cn", desc: "图书检索预约" },
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
      <div className="mb-4 flex flex-wrap gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs transition-all duration-200 ${
              activeTab === cat.id
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
            }`}
          >
            <span className="text-sm">{cat.icon}</span>
            <span className="hidden sm:inline">{cat.label}</span>
            <span className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] leading-none ${
              activeTab === cat.id
                ? "bg-primary/20 text-primary"
                : "bg-white/[0.04] text-muted-foreground"
            }`}>
              {cat.tools.length}
            </span>
          </button>
        ))}
      </div>

      {/* Tool grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2"
        >
          {current.tools.map((link, i) => {
            const initial = link.name[0];
            return (
              <motion.a
                key={link.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, delay: i * 0.03, ease: "easeOut" }}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`${link.name} — ${link.desc}`}
                className="group flex flex-col items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-cyan/20 hover:bg-white/[0.04]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-cyan/10 text-xs font-bold text-brand-cyan group-hover:bg-brand-cyan/15 transition-colors">
                  {initial}
                </div>
                <div className="flex flex-col items-center min-w-0 w-full">
                  <span className="text-[11px] text-muted-foreground group-hover:text-foreground text-center truncate w-full">
                    {link.name}
                  </span>
                  <span className="text-[9px] text-muted-foreground/40 group-hover:text-muted-foreground/60 truncate w-full text-center mt-0.5">
                    {link.desc}
                  </span>
                </div>
              </motion.a>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
