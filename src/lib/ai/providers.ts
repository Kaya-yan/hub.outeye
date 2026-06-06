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
  const res = await fetch(`${baseUrl}/chat/completions`, {
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
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error (${res.status}): ${err}`);
  }

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  return new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }

      buffer += decoder.decode(value, { stream: true });
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
          const content = json.choices?.[0]?.delta?.content || "";
          if (content) {
            controller.enqueue({ content, done: false });
          }
        } catch {
          // skip malformed chunks
        }
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
  const res = await fetch(`${baseUrl}/v1/messages`, {
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
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API error (${res.status}): ${err}`);
  }

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  return new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data: ")) continue;
        try {
          const json = JSON.parse(trimmed.slice(6));
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
    },
  });
}
