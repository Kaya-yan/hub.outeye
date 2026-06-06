import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { aiBudgets } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const budgets = await db.select().from(aiBudgets).orderBy(asc(aiBudgets.platform));
  return NextResponse.json(budgets);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const [budget] = await db
    .insert(aiBudgets)
    .values({
      platform: body.platform,
      totalBudget: body.totalBudget,
      used: body.used || 0,
      unit: body.unit || "tokens",
      alertThreshold: body.alertThreshold || 80,
    })
    .returning();

  return NextResponse.json(budget);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, platform, totalBudget, used, unit, alertThreshold } = body;

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (platform !== undefined) updates.platform = platform;
  if (totalBudget !== undefined) updates.totalBudget = totalBudget;
  if (used !== undefined) updates.used = used;
  if (unit !== undefined) updates.unit = unit;
  if (alertThreshold !== undefined) updates.alertThreshold = alertThreshold;

  const [budget] = await db
    .update(aiBudgets)
    .set(updates)
    .where(eq(aiBudgets.id, id))
    .returning();

  return NextResponse.json(budget);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await db.delete(aiBudgets).where(eq(aiBudgets.id, id));

  return NextResponse.json({ success: true });
}
