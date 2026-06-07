export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIStreamChunk {
  content: string;
  done: boolean;
  tokensUsed?: number;
}

export interface AIProviderConfig {
  apiKey: string;
  baseUrl?: string;
  modelId: string;
  temperature?: number;
  maxTokens?: number;
}

const PROVIDER_DEFAULTS: Record<string, { baseUrl: string }> = {
  deepseek: { baseUrl: "https://api.deepseek.com" },
  anthropic: { baseUrl: "https://api.anthropic.com" },
  moonshot: { baseUrl: "https://api.moonshot.cn/v1" },
  mimo: { baseUrl: "https://api.mimo.ai" },
  openai: { baseUrl: "https://api.openai.com/v1" },
  google: { baseUrl: "https://generativelanguage.googleapis.com/v1beta" },
  azure: { baseUrl: "https://YOUR_RESOURCE.openai.azure.com" },
  siliconflow: { baseUrl: "https://api.siliconflow.cn/v1" },
  aliyun: { baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1" },
  ollama: { baseUrl: "http://localhost:11434/v1" },
};

export function getProviderBaseUrl(provider: string, customUrl?: string): string {
  if (customUrl) return customUrl;
  return PROVIDER_DEFAULTS[provider]?.baseUrl || "";
}

function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = 30000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...init, signal: controller.signal }).finally(() => clearTimeout(timeoutId));
}

function extractContentFromChunk(json: unknown): string {
  if (typeof json !== "object" || json === null) return "";
  const j = json as Record<string, unknown>;

  // OpenAI standard streaming: choices[0].delta.content
  const choices = j.choices as Array<Record<string, unknown>> | undefined;
  if (choices && Array.isArray(choices) && choices.length > 0) {
    const choice = choices[0];
    if (choice.delta && typeof (choice.delta as Record<string, unknown>).content === "string") {
      return (choice.delta as Record<string, unknown>).content as string;
    }
    if (choice.text && typeof choice.text === "string") {
      return choice.text;
    }
    if (choice.message && typeof (choice.message as Record<string, unknown>).content === "string") {
      return (choice.message as Record<string, unknown>).content as string;
    }
    if (typeof choice.content === "string") {
      return choice.content;
    }
  }

  // Direct content fields
  if (typeof j.content === "string") return j.content;
  if (j.delta && typeof (j.delta as Record<string, unknown>).content === "string") {
    return (j.delta as Record<string, unknown>).content as string;
  }
  if (j.message && typeof (j.message as Record<string, unknown>).content === "string") {
    return (j.message as Record<string, unknown>).content as string;
  }

  return "";
}

export async function streamChat(
  provider: string,
  config: AIProviderConfig,
  messages: AIMessage[]
): Promise<ReadableStream<AIStreamChunk>> {
  // Protocol detection: URL-based, not provider-based
  const anthropicLike = config.baseUrl?.includes("anthropic") ?? false;
  if (anthropicLike) return streamAnthropic(config, messages);

  switch (provider) {
    case "deepseek":
    case "openai":
    case "moonshot":
    case "azure":
    case "siliconflow":
    case "aliyun":
    case "ollama":
    case "custom":
    case "mimo":
      return streamOpenAICompatible(config, messages);
    default:
      return streamOpenAICompatible(config, messages);
  }
}

async function streamOpenAICompatible(
  config: AIProviderConfig,
  messages: AIMessage[]
): Promise<ReadableStream<AIStreamChunk>> {
  const baseUrl = config.baseUrl || "https://api.openai.com/v1";
  const res = await fetchWithTimeout(
    `${baseUrl}/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.modelId,
        messages,
        temperature: config.temperature ?? 0.7,
        max_tokens: config.maxTokens ?? 4096,
        stream: true,
      }),
    },
    30000
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error (${res.status}): ${err}`);
  }

  // If upstream returns a plain JSON response instead of SSE (some providers ignore stream: true),
  // wrap it into a single-chunk stream so downstream code stays uniform.
  const contentType = res.headers.get("content-type") || "";
  const isEventStream = contentType.includes("text/event-stream");

  if (!isEventStream && res.body) {
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      const fullContent = extractContentFromChunk(json) || (json.choices?.[0]?.message?.content as string) || "";
      return new ReadableStream({
        start(controller) {
          if (fullContent) {
            controller.enqueue({ content: fullContent, done: false });
          }
          controller.enqueue({ content: "", done: true });
          controller.close();
        },
      });
    } catch {
      // If it's not valid JSON either, treat the raw text as content
      return new ReadableStream({
        start(controller) {
          if (text) controller.enqueue({ content: text, done: false });
          controller.enqueue({ content: "", done: true });
          controller.close();
        },
      });
    }
  }

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  return new ReadableStream({
    async pull(controller) {
      try {
        const { done, value } = await reader.read();
        if (done) {
          controller.enqueue({ content: "", done: true });
          controller.close();
          return;
        }

        // Normalize \r\n to \n for robust SSE parsing
        buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;
          const data = trimmed.slice(6);
          if (data === "[DONE]") {
            controller.enqueue({ content: "", done: true });
            continue;
          }
          try {
            const json = JSON.parse(data);
            // Some providers send error events inside the stream
            if (json.error) {
              const msg = typeof json.error === "string" ? json.error : (json.error as Record<string, unknown>).message || JSON.stringify(json.error);
              controller.error(new Error(`Stream error: ${msg}`));
              return;
            }
            const content = extractContentFromChunk(json);
            if (content) {
              controller.enqueue({ content, done: false });
            }
          } catch {
            // skip malformed chunks
          }
        }
      } catch (err) {
        controller.error(err);
      }
    },
  });
}

async function streamAnthropic(
  config: AIProviderConfig,
  messages: AIMessage[]
): Promise<ReadableStream<AIStreamChunk>> {
  const systemMsg = messages.find((m) => m.role === "system");
  const chatMessages = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role, content: m.content }));

  const baseUrl = (config.baseUrl || "https://api.anthropic.com").replace(/\/$/, "");
  const res = await fetchWithTimeout(
    `${baseUrl}/v1/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": config.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: config.modelId,
        max_tokens: config.maxTokens ?? 4096,
        temperature: config.temperature ?? 0.7,
        system: systemMsg?.content,
        messages: chatMessages,
        stream: true,
      }),
    },
    30000
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API error (${res.status}): ${err}`);
  }

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  return new ReadableStream({
    async pull(controller) {
      try {
        const { done, value } = await reader.read();
        if (done) {
          controller.enqueue({ content: "", done: true });
          controller.close();
          return;
        }

        buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;
          try {
            const json = JSON.parse(trimmed.slice(6));
            if (json.error) {
              const msg = typeof json.error === "string" ? json.error : (json.error as Record<string, unknown>).message || JSON.stringify(json.error);
              controller.error(new Error(`Stream error: ${msg}`));
              return;
            }
            if (json.type === "content_block_delta") {
              const content = json.delta?.text || "";
              if (content) controller.enqueue({ content, done: false });
            }
            if (json.type === "message_stop") {
              controller.enqueue({ content: "", done: true });
            }
          } catch {
            // skip
          }
        }
      } catch (err) {
        controller.error(err);
      }
    },
  });
}
