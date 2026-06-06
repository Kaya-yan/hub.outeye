import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { aiThreads } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const threads = await db.select().from(aiThreads).orderBy(desc(aiThreads.updatedAt));
  return NextResponse.json(threads);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const [thread] = await db
    .insert(aiThreads)
    .values({
      title: body.title,
      projectTag: body.projectTag || null,
      color: body.color || "#06b6d4",
    })
    .returning();

  return NextResponse.json(thread);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, title, projectTag, color, isPinned } = body;

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (title !== undefined) updates.title = title;
  if (projectTag !== undefined) updates.projectTag = projectTag;
  if (color !== undefined) updates.color = color;
  if (isPinned !== undefined) updates.isPinned = isPinned;

  const [thread] = await db
    .update(aiThreads)
    .set(updates)
    .where(eq(aiThreads.id, id))
    .returning();

  return NextResponse.json(thread);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await db.delete(aiThreads).where(eq(aiThreads.id, id));

  return NextResponse.json({ success: true });
}
