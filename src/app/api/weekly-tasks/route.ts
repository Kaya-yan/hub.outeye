import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { weeklyTasks } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and, gte, lte } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const weekStart = req.nextUrl.searchParams.get("weekStart");
  if (!weekStart) {
    return NextResponse.json({ error: "weekStart required" }, { status: 400 });
  }

  const start = new Date(weekStart);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  const rows = await db
    .select()
    .from(weeklyTasks)
    .where(
      and(
        gte(weeklyTasks.weekStart, start),
        lte(weeklyTasks.weekStart, end),
      )
    )
    .orderBy(weeklyTasks.dayOfWeek, weeklyTasks.timeSlot, weeklyTasks.sortOrder);

  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const [task] = await db
    .insert(weeklyTasks)
    .values({
      weekStart: new Date(body.weekStart),
      dayOfWeek: body.dayOfWeek,
      timeSlot: body.timeSlot,
      title: body.title,
      category: body.category || "学习",
    })
    .returning();

  return NextResponse.json(task);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, isDone, title } = body;

  const updates: Record<string, unknown> = {};
  if (isDone !== undefined) updates.isDone = isDone;
  if (title !== undefined) updates.title = title;

  const [task] = await db
    .update(weeklyTasks)
    .set(updates)
    .where(eq(weeklyTasks.id, id))
    .returning();

  return NextResponse.json(task);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await db.delete(weeklyTasks).where(eq(weeklyTasks.id, id));

  return NextResponse.json({ success: true });
}
