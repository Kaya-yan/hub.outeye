import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tokenUsage, projectStats } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc, sql, and, gte } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const range = req.nextUrl.searchParams.get("range") || "7d";
  const daysAgo = range === "7d" ? 7 : range === "30d" ? 30 : 1;
  const since = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

  // Token usage grouped by platform and day
  const tokenData = await db
    .select({
      platform: tokenUsage.platform,
      date: sql<string>`date_trunc('day', ${tokenUsage.createdAt})::text`,
      totalTokens: sql<number>`sum(${tokenUsage.tokens})`,
      totalCost: sql<number>`sum(${tokenUsage.cost})`,
    })
    .from(tokenUsage)
    .where(gte(tokenUsage.createdAt, since))
    .groupBy(tokenUsage.platform, sql`date_trunc('day', ${tokenUsage.createdAt})`)
    .orderBy(sql`date_trunc('day', ${tokenUsage.createdAt})`);

  // Project stats latest snapshot
  const projects = await db
    .select()
    .from(projectStats)
    .orderBy(desc(projectStats.recordedAt));

  // Group by project
  const projectMap: Record<string, typeof projects> = {};
  for (const stat of projects) {
    if (!projectMap[stat.projectName]) projectMap[stat.projectName] = [];
    projectMap[stat.projectName].push(stat);
  }

  return NextResponse.json({ tokenData, projectStats: projectMap });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  if (body.type === "token") {
    const [record] = await db
      .insert(tokenUsage)
      .values({
        platform: body.platform,
        tokens: body.tokens,
        cost: body.cost?.toString(),
        costCurrency: body.costCurrency || "CNY",
        purpose: body.purpose,
        project: body.project,
      })
      .returning();
    return NextResponse.json(record);
  }

  if (body.type === "snapshot") {
    const [record] = await db
      .insert(projectStats)
      .values({
        projectName: body.projectName,
        metricName: body.metricName,
        metricValue: body.metricValue,
      })
      .returning();
    return NextResponse.json(record);
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
