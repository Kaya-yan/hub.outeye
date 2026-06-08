# ZhaoyanHub

赵琰的个人聚合平台 — AI x 语言研究

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4, shadcn/ui, Framer Motion 12 |
| 认证 | NextAuth.js v5 (Credentials Provider, JWT) |
| 数据库 | Neon PostgreSQL (Serverless) |
| ORM | Drizzle ORM |
| 状态管理 | Zustand |
| 图表 | Recharts |
| 部署 | Vercel |

## 项目结构

```
src/
├── app/
│   ├── (public)/           # 公开页面
│   │   ├── page.tsx        # 首页 (Hero + About + 荣誉时间线 + 荣誉墙)
│   │   ├── projects/       # 项目展示
│   │   ├── skills/         # 技能矩阵
│   │   ├── honors/         # 荣誉页 (独立入口，数据与首页共享)
│   │   └── contact/        # 联系页 (终端风格)
│   ├── (dashboard)/        # 需认证的工作台
│   │   └── dashboard/
│   │       ├── page.tsx    # 工作台总览
│   │       ├── ai-hub/     # AI Hub 多模型对话
│   │       ├── data/       # 数据中心 (图表)
│   │       ├── ai-budget/  # Token 额度监控
│   │       ├── ideas/      # 灵感收集
│   │       └── settings/   # 模型配置中心
│   ├── api/ai/             # AI Hub API
│   │   ├── chat/           # 流式对话代理 (maxDuration 30s)
│   │   ├── models/         # 模型 CRUD (AES 加密存储 API Key)
│   │   ├── threads/        # 话题管理
│   │   ├── panes/          # 窗格管理
│   │   ├── messages/       # 消息历史
│   │   └── test-connection/# 连接测试
│   └── login/              # 登录页
├── components/
│   ├── public/             # 公开页面组件
│   │   ├── GalaxyHero.tsx  # Hero — NASA 宇航员背景 + 视差 + 粒子
│   │   ├── AboutSection.tsx# 简历风格个人信息
│   │   ├── HonorsTimeline.tsx # 横向/垂直荣誉时间线
│   │   └── HonorsWall.tsx  # 证书荣誉墙 + 灯箱
│   ├── ai-hub/             # AI Hub 组件
│   │   ├── PaneView.tsx    # 对话窗格 (SSE 流式读取)
│   │   └── ThreadList.tsx  # 话题列表
│   └── layout/             # 布局组件
│       ├── Navbar.tsx      # 导航栏 (Hero 区域透明)
│       ├── Sidebar.tsx     # 工作台侧边栏
│       └── MainWrapper.tsx # 首页无 padding 包裹
├── lib/
│   ├── db/                 # 数据库
│   │   ├── index.ts        # Neon 连接
│   │   └── schema.ts       # Drizzle schema (11 张表)
│   ├── ai/
│   │   ├── providers.ts    # 多模型流式代理 (OpenAI/Anthropic 协议)
│   │   └── crypto.ts       # API Key AES-256-CBC 加解密
│   ├── auth.ts             # NextAuth 配置
│   ├── honors-data.ts      # 荣誉数据 (coreHonors + allHonors)
│   └── utils.ts            # cn() 工具函数
├── hooks/
│   └── useReducedMotion.ts # prefers-reduced-motion 检测
├── stores/
│   └── ai-hub.ts           # AI Hub Zustand 状态
└── middleware.ts            # 认证中间件 (dashboard 保护)
```

## 首页架构

首页为长滚动单页，包含 4 个区域：

1. **Hero** — NASA 宇航员全屏背景 + 多层 CSS 遮罩 + 视差滚动 + 星光粒子 + 模糊揭示入场动画
2. **About Me** — 简历风格紧凑布局，3D 倾斜证件照 + 打字机问候语 + 标签弹跳 + 指标展示
3. **荣誉时间线** — 桌面水平 3 列 Grid / 移动端垂直线，级别着色节点 + 进度条
4. **荣誉墙** — 证书图片自适应网格 + 灯箱

## AI Hub 支持的模型

通过设置页配置 API Key 后，支持对话的模型提供商：

| Provider | 协议 | 流式支持 |
|----------|------|---------|
| DeepSeek | OpenAI 兼容 | ✓ |
| Moonshot (Kimi) | OpenAI 兼容 | ✓ |
| Anthropic (Claude) | Anthropic Messages API | ✓ |
| MiMo | OpenAI 兼容 | ✓ (自动降级) |
| OpenAI (GPT) | OpenAI | ✓ |
| Google (Gemini) | OpenAI 兼容 | ✓ |
| SiliconFlow | OpenAI 兼容 | ✓ |
| 阿里云百炼 | OpenAI 兼容 | ✓ |
| Ollama (本地) | OpenAI 兼容 | ✓ |
| 自定义 Provider | OpenAI 兼容 | ✓ |

特性：
- 话题 + 窗格架构，支持最多 4 个模型并行对话
- SSE 流式响应，AbortController 取消机制
- 转发审核：将回复转发到另一模型窗格交叉验证
- 独立上下文 (每窗格 50 条历史)
- API Key AES-256-CBC 加密存储
- MiMo 等慢速模型自动限制 Max Tokens 1024
- 流式协议兼容：非 SSE 响应自动降级为单 chunk

## 数据库

Neon PostgreSQL，11 张表：

| 表 | 用途 |
|----|------|
| tasks | 任务管理 |
| weekly_tasks | 周日程 |
| ideas | 灵感收集 |
| token_usage | Token 消耗记录 |
| ai_budgets | AI 额度预算 |
| quick_links | 快捷入口 |
| competitions | 竞赛指挥中心 |
| project_stats | 项目数据快照 |
| ai_models | AI 模型配置 (API Key 加密) |
| ai_threads | 对话话题 |
| ai_panes | 对话窗格 |
| ai_messages | 对话消息 |

## 本地开发

```bash
# 安装依赖
npm install

# 配置环境变量 (.env.local)
# ADMIN_PASSWORD=    # 登录密码
# DATABASE_URL=      # Neon PostgreSQL 连接串
# NEXTAUTH_SECRET=   # JWT 签名密钥

# 启动开发服务器 (Turbopack)
npm run dev

# 构建
npm run build
```

## 部署

部署在 Vercel，需配置环境变量：

- `ADMIN_PASSWORD` — 后台登录密码
- `DATABASE_URL` — Neon PostgreSQL 连接串
- `NEXTAUTH_SECRET` — JWT 签名密钥 (用于加密 API Key 和签名认证令牌)
- `NEXTAUTH_URL` — `https://你的域名`

AI Hub 对话使用的 API 路由 (`/api/ai/chat`) 设置了 `maxDuration: 30s`。慢速模型 (如 MiMo) 建议限制 Max Tokens ≤ 1024 以避免超时。
