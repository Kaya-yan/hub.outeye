import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tasks } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const allTasks = await db.select().from(tasks).orderBy(desc(tasks.createdAt));
  return NextResponse.json(allTasks);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const [task] = await db
    .insert(tasks)
    .values({
      title: body.title,
      description: body.description,
      project: body.project,
      priority: body.priority,
      category: body.category || "学习",
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
    })
    .returning();

  return NextResponse.json(task);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, title, description, project, priority, status, dueDate, category } = body;

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (project !== undefined) updates.project = project;
  if (priority !== undefined) updates.priority = priority;
  if (status !== undefined) updates.status = status;
  if (dueDate !== undefined) updates.dueDate = dueDate ? new Date(dueDate) : null;
  if (category !== undefined) updates.category = category;

  const [task] = await db
    .update(tasks)
    .set(updates)
    .where(eq(tasks.id, id))
    .returning();

  return NextResponse.json(task);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await db.delete(tasks).where(eq(tasks.id, id));

  return NextResponse.json({ success: true });
}
