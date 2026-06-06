-- 1. 新建 weekly_tasks 表
CREATE TABLE IF NOT EXISTS weekly_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start TIMESTAMPTZ NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
  time_slot TEXT NOT NULL CHECK (time_slot IN ('morning', 'afternoon', 'evening')),
  title TEXT NOT NULL,
  category TEXT DEFAULT '学习' CHECK (category IN ('学习', '竞赛', '杂事')),
  is_done BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 给 tasks 表加 category 字段
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS category TEXT DEFAULT '学习' CHECK (category IN ('学习', '竞赛', '杂事'));

-- 3. 索引
CREATE INDEX IF NOT EXISTS idx_weekly_tasks_week ON weekly_tasks (week_start);
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks (category);
