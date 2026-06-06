import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tasks, aiBudgets, projectStats, tokenUsage } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { desc, sql, gte } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const insights: { type: string; icon: string; text: string }[] = [];

  // 1. Task completion stats
  const allTasks = await db.select().from(tasks);
  const weeklyTasks = allTasks.filter((t) => t.createdAt && new Date(t.createdAt) >= weekAgo);
  const weeklyDone = weeklyTasks.filter((t) => t.status === "done");
  if (weeklyTasks.length > 0) {
    const rate = Math.round((weeklyDone.length / weeklyTasks.length) * 100);
    insights.push({
      type: rate >= 80 ? "success" : rate >= 50 ? "info" : "warning",
      icon: rate >= 80 ? "🔥" : rate >= 50 ? "📊" : "⚠️",
      text: `本周任务完成率 ${rate}%（${weeklyDone.length}/${weeklyTasks.length}）`,
    });
  } else {
    insights.push({
      type: "info",
      icon: "📋",
      text: "本周暂无任务记录",
    });
  }

  // 2. Budget usage
  const budgets = await db.select().from(aiBudgets);
  for (const b of budgets) {
    if (b.totalBudget && b.used) {
      const pct = Math.round((b.used / b.totalBudget) * 100);
      if (pct >= (b.alertThreshold || 80)) {
        insights.push({
          type: "warning",
          icon: "⚠️",
          text: `${b.platform} 额度已使用 ${pct}%，剩余不足警戒线`,
        });
      } else if (pct >= 50) {
        insights.push({
          type: "info",
          icon: "📊",
          text: `${b.platform} 额度使用 ${pct}%，剩余充足`,
        });
      }
    }
  }

  // 3. Project stats highlights
  const stats = await db
    .select()
    .from(projectStats)
    .orderBy(desc(projectStats.recordedAt));

  const projectMap: Record<string, typeof stats> = {};
  for (const s of stats) {
    if (!projectMap[s.projectName]) projectMap[s.projectName] = [];
    projectMap[s.projectName].push(s);
  }

  for (const [project, projectStatsArr] of Object.entries(projectMap)) {
    const corpus = projectStatsArr.find((s) => s.metricName === "语料总量");
    const vocab = projectStatsArr.find((s) => s.metricName === "词汇量");
    const completion = projectStatsArr.find((s) => s.metricName === "完成进度");
    const comments = projectStatsArr.find((s) => s.metricName === "评论数");

    if (corpus && corpus.metricValue != null) {
      insights.push({
        type: "success",
        icon: "📊",
        text: `${project} 语料总量 ${corpus.metricValue.toLocaleString()} 篇`,
      });
    }
    if (completion && completion.metricValue != null) {
      insights.push({
        type: completion.metricValue >= 80 ? "success" : "info",
        icon: completion.metricValue >= 80 ? "🔥" : "📚",
        text: `${project} 完成进度 ${completion.metricValue}%`,
      });
    }
    if (comments && comments.metricValue != null) {
      insights.push({
        type: "info",
        icon: "💬",
        text: `${project} 评论采集 ${comments.metricValue.toLocaleString()} 条`,
      });
    }
  }

  // 4. Token usage this week
  const weeklyTokens = await db
    .select({
      total: sql<number>`sum(${tokenUsage.tokens})`,
    })
    .from(tokenUsage)
    .where(gte(tokenUsage.createdAt, weekAgo));

  const tokenTotal = weeklyTokens[0]?.total || 0;
  if (tokenTotal > 0) {
    const formatted =
      tokenTotal >= 1e6
        ? `${(tokenTotal / 1e6).toFixed(1)}M`
        : tokenTotal >= 1e3
          ? `${(tokenTotal / 1e3).toFixed(1)}K`
          : tokenTotal.toString();
    insights.push({
      type: "info",
      icon: "🤖",
      text: `本周 Token 总消耗 ${formatted}`,
    });
  }

  // Cap at 5 insights
  return NextResponse.json(insights.slice(0, 5));
}
