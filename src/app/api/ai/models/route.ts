import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { aiModels } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, asc } from "drizzle-orm";
import { encrypt, decrypt } from "@/lib/ai/crypto";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const models = await db.select().from(aiModels).orderBy(asc(aiModels.sortOrder));

  // Mask API keys in response
  const masked = models.map((m) => ({
    ...m,
    apiKey: m.apiKey ? `${m.apiKey.slice(0, 8)}****${m.apiKey.slice(-4)}` : "",
    apiKeyConfigured: !!m.apiKey,
  }));

  return NextResponse.json(masked);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  // Encrypt API key before storing
  const encryptedKey = encrypt(body.apiKey);

  const [model] = await db
    .insert(aiModels)
    .values({
      name: body.name,
      provider: body.provider,
      apiKey: encryptedKey,
      baseUrl: body.baseUrl || null,
      modelId: body.modelId,
      temperature: body.temperature?.toString() || "0.7",
      maxTokens: body.maxTokens || 4096,
    })
    .returning();

  return NextResponse.json({
    id: model.id,
    name: model.name,
    provider: model.provider,
    modelId: model.modelId,
    baseUrl: model.baseUrl,
    temperature: model.temperature,
    maxTokens: model.maxTokens,
    isActive: model.isActive,
    sortOrder: model.sortOrder,
    createdAt: model.createdAt,
    apiKey: `${encryptedKey.slice(0, 8)}****`,
    apiKeyConfigured: true,
  });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, apiKey, name, provider, modelId, baseUrl, temperature, maxTokens, isActive, sortOrder } = body;

  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name;
  if (provider !== undefined) updates.provider = provider;
  if (modelId !== undefined) updates.modelId = modelId;
  if (baseUrl !== undefined) updates.baseUrl = baseUrl;
  if (temperature !== undefined) updates.temperature = temperature.toString();
  if (maxTokens !== undefined) updates.maxTokens = maxTokens;
  if (isActive !== undefined) updates.isActive = isActive;
  if (sortOrder !== undefined) updates.sortOrder = sortOrder;
  if (apiKey && !apiKey.includes("****")) {
    updates.apiKey = encrypt(apiKey);
  }

  const [model] = await db
    .update(aiModels)
    .set(updates)
    .where(eq(aiModels.id, id))
    .returning();

  return NextResponse.json({
    ...model,
    apiKey: model.apiKey ? `${model.apiKey.slice(0, 8)}****` : "",
    apiKeyConfigured: !!model.apiKey,
  });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await db.delete(aiModels).where(eq(aiModels.id, id));

  return NextResponse.json({ success: true });
}
