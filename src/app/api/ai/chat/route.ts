import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { aiModels, aiPanes, aiMessages } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";
import { decrypt } from "@/lib/ai/crypto";
import { streamChat, AIMessage, getProviderBaseUrl } from "@/lib/ai/providers";

const HISTORY_LIMIT = 50;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { paneId, message } = await req.json();

  const [pane] = await db.select().from(aiPanes).where(eq(aiPanes.id, paneId));
  if (!pane) return new Response("Pane not found", { status: 404 });

  const [model] = await db.select().from(aiModels).where(eq(aiModels.id, pane.modelId!));

  if (!model) return new Response("Model not found", { status: 404 });

  const apiKey = decrypt(model.apiKey);

  const [userMsg, history] = await Promise.all([
    db.insert(aiMessages).values({ paneId, role: "user", content: message }).returning(),
    db.select().from(aiMessages).where(eq(aiMessages.paneId, paneId)).orderBy(desc(aiMessages.createdAt)).limit(HISTORY_LIMIT),
  ]);

  const messages: AIMessage[] = [];
  if (pane.systemPrompt) {
    messages.push({ role: "system", content: pane.systemPrompt });
  }
  for (const msg of history.reverse()) {
    messages.push({ role: msg.role as "user" | "assistant", content: msg.content });
  }

  const startTime = Date.now();

  try {
    const stream = await streamChat(model.provider as string, {
      apiKey,
      baseUrl: model.baseUrl || getProviderBaseUrl(model.provider, model.baseUrl ?? undefined),
      modelId: model.modelId,
      temperature: parseFloat(model.temperature || "0.7"),
      maxTokens: model.maxTokens || 4096,
    }, messages);

    let fullContent = "";
    const reader = stream.getReader();
    const encoder = new TextEncoder();
    let saved = false;

    const transformedStream = new ReadableStream({
      async pull(controller) {
        try {
          const { done, value } = await reader.read();

          if (done) {
            if (!saved) {
              saved = true;
              const latency = Date.now() - startTime;
              await db.insert(aiMessages).values({
                paneId,
                role: "assistant",
                content: fullContent,
                latencyMs: latency,
              });
            }
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
            return;
          }

          if (value.done) {
            if (!saved) {
              saved = true;
              const latency = Date.now() - startTime;
              await db.insert(aiMessages).values({
                paneId,
                role: "assistant",
                content: fullContent,
                latencyMs: latency,
              });
            }
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
            return;
          }

          fullContent += value.content;
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: value.content })}\n\n`));
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : "Stream error";
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: errMsg })}\n\n`));
          if (!saved) {
            saved = true;
            const latency = Date.now() - startTime;
            await db.insert(aiMessages).values({
              paneId,
              role: "assistant",
              content: fullContent || `[Error: ${errMsg}]`,
              latencyMs: latency,
            });
          }
          controller.close();
        }
      },
    });

    return new Response(transformedStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    return new Response(`Error: ${errMsg}`, { status: 500 });
  }
}
