import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { aiMessages } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

const MESSAGE_LIMIT = 200;

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const paneId = req.nextUrl.searchParams.get("paneId");
  if (!paneId) return NextResponse.json({ error: "paneId required" }, { status: 400 });

  const messages = await db
    .select()
    .from(aiMessages)
    .where(eq(aiMessages.paneId, paneId))
    .orderBy(desc(aiMessages.createdAt))
    .limit(MESSAGE_LIMIT);

  return NextResponse.json(messages.reverse());
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const [message] = await db
    .insert(aiMessages)
    .values({
      paneId: body.paneId,
      role: body.role,
      content: body.content,
      tokensUsed: body.tokensUsed || null,
      latencyMs: body.latencyMs || null,
      isRelay: body.isRelay || false,
      relayFromMessageId: body.relayFromMessageId || null,
    })
    .returning();

  return NextResponse.json(message);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { paneId } = await req.json();
  await db.delete(aiMessages).where(eq(aiMessages.paneId, paneId));

  return NextResponse.json({ success: true });
}
