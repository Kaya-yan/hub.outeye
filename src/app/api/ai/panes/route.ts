import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { aiPanes, aiModels } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and, asc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const threadId = req.nextUrl.searchParams.get("threadId");
  if (!threadId) return NextResponse.json({ error: "threadId required" }, { status: 400 });

  const panes = await db
    .select()
    .from(aiPanes)
    .where(eq(aiPanes.threadId, threadId))
    .orderBy(asc(aiPanes.position));

  return NextResponse.json(panes);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  // Check pane limit (max 4 per thread)
  const existingPanes = await db
    .select()
    .from(aiPanes)
    .where(eq(aiPanes.threadId, body.threadId));

  if (existingPanes.length >= 4) {
    return NextResponse.json({ error: "最多 4 个窗格" }, { status: 400 });
  }

  const [pane] = await db
    .insert(aiPanes)
    .values({
      threadId: body.threadId,
      modelId: body.modelId,
      paneName: body.paneName,
      position: existingPanes.length,
      systemPrompt: body.systemPrompt || null,
    })
    .returning();

  return NextResponse.json(pane);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await db.delete(aiPanes).where(eq(aiPanes.id, id));

  return NextResponse.json({ success: true });
}
