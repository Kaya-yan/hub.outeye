import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { aiModels } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { decrypt } from "@/lib/ai/crypto";
import { getProviderBaseUrl } from "@/lib/ai/providers";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { provider, modelId, apiKey, baseUrl, dbModelId } = await req.json();

  if (!provider || !modelId) {
    return NextResponse.json({ error: "缺少必要参数" }, { status: 400 });
  }

  // Resolve API key: either from DB (saved model) or from request body (new model)
  let decryptedKey: string;
  let resolvedBaseUrl = baseUrl;

  if (dbModelId) {
    const [savedModel] = await db.select().from(aiModels).where(eq(aiModels.id, dbModelId));
    if (!savedModel) {
      return NextResponse.json({ ok: false, error: "模型记录不存在" }, { status: 404 });
    }
    decryptedKey = decrypt(savedModel.apiKey);
    if (!resolvedBaseUrl) resolvedBaseUrl = savedModel.baseUrl || undefined;
  } else if (apiKey && !apiKey.includes("****")) {
    decryptedKey = decrypt(apiKey);
  } else {
    return NextResponse.json({ ok: false, error: "API Key 无效，请重新输入" }, { status: 400 });
  }

  const url = getProviderBaseUrl(provider, resolvedBaseUrl);
  const startTime = Date.now();

  // Protocol detection: URL-based, not provider-based
  const useAnthropicProtocol = url.includes("anthropic");

  const endpoint = useAnthropicProtocol
    ? `${url.replace(/\/$/, "")}/v1/messages`
    : `${url.replace(/\/$/, "")}/chat/completions`;

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const body: Record<string, unknown> = {
      model: modelId,
      messages: [{ role: "user", content: "hi" }],
    };

    if (useAnthropicProtocol) {
      headers["x-api-key"] = decryptedKey;
      headers["anthropic-version"] = "2023-06-01";
      body.max_tokens = 1;
    } else {
      headers["Authorization"] = `Bearer ${decryptedKey}`;
      body.max_tokens = 1;
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const latency = Date.now() - startTime;

    if (!res.ok) {
      const err = await res.text();
      console.error(`[Test Connection] ${provider} failed:`, { endpoint, status: res.status, body: err.slice(0, 500) });
      return NextResponse.json({
        ok: false,
        error: parseError(res.status, err),
        latency,
        debug: { endpoint, status: res.status, protocol: useAnthropicProtocol ? "anthropic" : "openai" },
      });
    }

    return NextResponse.json({ ok: true, latency, message: "连接正常" });
  } catch (error) {
    const latency = Date.now() - startTime;
    const msg = error instanceof Error ? error.message : "未知错误";
    console.error(`[Test Connection] ${provider} error:`, { endpoint, error: msg });
    if (msg.includes("fetch failed") || msg.includes("ECONNREFUSED") || msg.includes("timeout")) {
      return NextResponse.json({ ok: false, error: "网络不可达，请检查 Base URL", latency });
    }
    return NextResponse.json({ ok: false, error: msg, latency });
  }
}

function parseError(status: number, body: string): string {
  if (status === 401 || status === 403) return "API Key 无效或已过期";
  if (status === 404) return "模型 ID 不存在，请检查配置";
  if (status === 429) return "请求频率超限，请后重试";
  try {
    const json = JSON.parse(body);
    return json.error?.message || json.message || `HTTP ${status}`;
  } catch {
    return `HTTP ${status}`;
  }
}
