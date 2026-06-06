import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ideas, tasks } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const allIdeas = await db.select().from(ideas).orderBy(desc(ideas.createdAt));
  return NextResponse.json(allIdeas);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const [idea] = await db
    .insert(ideas)
    .values({
      content: body.content,
      category: body.category || null,
      tags: body.tags || [],
      sourceUrl: body.sourceUrl || null,
    })
    .returning();

  return NextResponse.json(idea);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, convertToTask, ...updates } = body;

  // Convert idea to task
  if (convertToTask) {
    const [idea] = await db.select().from(ideas).where(eq(ideas.id, id));
    if (idea) {
      const [task] = await db
        .insert(tasks)
        .values({
          title: idea.content.slice(0, 100),
          description: idea.content,
          project: idea.category || "hub",
        })
        .returning();

      const [updated] = await db
        .update(ideas)
        .set({ convertedToTask: task.id })
        .where(eq(ideas.id, id))
        .returning();

      return NextResponse.json({ idea: updated, task });
    }
  }

  const allowedUpdates: Record<string, unknown> = {};
  if (updates.content !== undefined) allowedUpdates.content = updates.content;
  if (updates.category !== undefined) allowedUpdates.category = updates.category;
  if (updates.tags !== undefined) allowedUpdates.tags = updates.tags;

  const [updated] = await db
    .update(ideas)
    .set(allowedUpdates)
    .where(eq(ideas.id, id))
    .returning();

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await db.delete(ideas).where(eq(ideas.id, id));

  return NextResponse.json({ success: true });
}
