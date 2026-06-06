import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  decimal,
  bigint,
  jsonb,
  check,
} from "drizzle-orm/pg-core";

// ============================================
// 任务表（用户自管理 CRUD）
// ============================================
export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  project: text("project"), // 'outeye2', 'outeye3', 'outeye4', 'challenge-cup', 'hub'
  status: text("status").default("todo").$type<"todo" | "in_progress" | "done">(),
  priority: text("priority").default("medium").$type<"low" | "medium" | "high">(),
  dueDate: timestamp("due_date", { withTimezone: true }),
  sortOrder: integer("sort_order").default(0),
  category: text("category").default("学习").$type<"学习" | "竞赛" | "杂事">(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ============================================
// 本周日程表（按周+天+时段定位）
// ============================================
export const weeklyTasks = pgTable("weekly_tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  weekStart: timestamp("week_start", { withTimezone: true }).notNull(), // 周一日期
  dayOfWeek: integer("day_of_week").notNull(), // 1=周一 ... 7=周日
  timeSlot: text("time_slot").notNull().$type<"morning" | "afternoon" | "evening">(),
  title: text("title").notNull(),
  category: text("category").default("学习").$type<"学习" | "竞赛" | "杂事">(),
  isDone: boolean("is_done").default(false),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ============================================
// 灵感表
// ============================================
export const ideas = pgTable("ideas", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  category: text("category"),
  tags: text("tags").array(),
  sourceUrl: text("source_url"),
  hasImage: boolean("has_image").default(false),
  convertedToTask: uuid("converted_to_task").references(() => tasks.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ============================================
// Token 消耗记录
// ============================================
export const tokenUsage = pgTable("token_usage", {
  id: uuid("id").primaryKey().defaultRandom(),
  platform: text("platform").notNull(),
  tokens: bigint("tokens", { mode: "number" }),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  costCurrency: text("cost_currency").default("CNY"),
  purpose: text("purpose"),
  project: text("project"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ============================================
// AI 额度预算表
// ============================================
export const aiBudgets = pgTable("ai_budgets", {
  id: uuid("id").primaryKey().defaultRandom(),
  platform: text("platform").notNull(),
  totalBudget: bigint("total_budget", { mode: "number" }),
  used: bigint("used", { mode: "number" }).default(0),
  unit: text("unit").default("tokens"),
  alertThreshold: integer("alert_threshold").default(80),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ============================================
// 快捷入口
// ============================================
export const quickLinks = pgTable("quick_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  icon: text("icon"),
  category: text("category"),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
});

// ============================================
// 竞赛指挥中心
// ============================================
export const competitions = pgTable("competitions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  competitionCode: text("competition_code"),
  status: text("status")
    .default("preparing")
    .$type<"preparing" | "submitted" | "reviewing" | "finals" | "completed">(),
  deadline: timestamp("deadline", { withTimezone: true }),
  progress: integer("progress").default(0),
  materials: jsonb("materials").default([]),
  teamMembers: text("team_members").array(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ============================================
// 项目数据快照
// ============================================
export const projectStats = pgTable("project_stats", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectName: text("project_name").notNull(),
  metricName: text("metric_name").notNull(),
  metricValue: integer("metric_value"),
  recordedAt: timestamp("recorded_at", { withTimezone: true }).defaultNow(),
});

// ============================================
// AI Hub 模型配置表
// ============================================
export const aiModels = pgTable("ai_models", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  provider: text("provider").notNull().$type<
    | "deepseek"
    | "anthropic"
    | "moonshot"
    | "mimo"
    | "openai"
    | "google"
    | "azure"
    | "siliconflow"
    | "aliyun"
    | "ollama"
    | "custom"
  >(),
  apiKey: text("api_key").notNull(), // AES 加密存储
  baseUrl: text("base_url"),
  modelId: text("model_id").notNull(),
  temperature: decimal("temperature", { precision: 3, scale: 2 }).default("0.7"),
  maxTokens: integer("max_tokens").default(4096),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ============================================
// AI Hub 话题表
// ============================================
export const aiThreads = pgTable("ai_threads", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  projectTag: text("project_tag"),
  color: text("color").default("#06b6d4"),
  isPinned: boolean("is_pinned").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ============================================
// AI Hub 窗格表
// ============================================
export const aiPanes = pgTable("ai_panes", {
  id: uuid("id").primaryKey().defaultRandom(),
  threadId: uuid("thread_id").references(() => aiThreads.id, {
    onDelete: "cascade",
  }),
  modelId: uuid("model_id").references(() => aiModels.id),
  paneName: text("pane_name"),
  position: integer("position").default(0),
  systemPrompt: text("system_prompt"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ============================================
// AI Hub 消息表 —— 每个窗格独立上下文
// ============================================
export const aiMessages = pgTable("ai_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  paneId: uuid("pane_id").references(() => aiPanes.id, {
    onDelete: "cascade",
  }),
  role: text("role").notNull().$type<"user" | "assistant" | "system">(),
  content: text("content").notNull(),
  tokensUsed: integer("tokens_used"),
  latencyMs: integer("latency_ms"),
  isRelay: boolean("is_relay").default(false),
  relayFromMessageId: uuid("relay_from_message_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
