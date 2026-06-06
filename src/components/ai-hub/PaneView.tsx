"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useAIHubStore } from "@/stores/ai-hub";
import { Send, Trash2, Forward, Copy, Check, Eraser } from "lucide-react";

const EMPTY_ARRAY: never[] = [];

interface PaneViewProps {
  paneId: string;
  paneName?: string;
  modelId: string;
  onRelay?: (messageId: string, content: string) => void;
  onDelete?: () => void;
}

export function PaneView({ paneId, paneName, modelId, onRelay, onDelete }: PaneViewProps) {
  const paneMessages = useAIHubStore((s) => s.messages[paneId] ?? EMPTY_ARRAY);
  const streaming = useAIHubStore((s) => s.isStreaming[paneId] || false);
  const models = useAIHubStore((s) => s.models);
  const model = useMemo(() => models.find((m) => m.id === modelId), [models, modelId]);
  const addMessage = useAIHubStore((s) => s.addMessage);
  const appendToLastMessage = useAIHubStore((s) => s.appendToLastMessage);
  const setStreaming = useAIHubStore((s) => s.setStreaming);
  const setMessages = useAIHubStore((s) => s.setMessages);
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [waitState, setWaitState] = useState<"idle" | "waiting" | "timeout">("idle");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const waitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (scrollTimeoutRef.current) return;
    scrollTimeoutRef.current = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      scrollTimeoutRef.current = null;
    }, 100);
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (waitTimerRef.current) clearTimeout(waitTimerRef.current);
      if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
    };
  }, [paneMessages]);

  async function sendMessage() {
    if (!input.trim() || streaming) return;
    const userContent = input;
    setInput("");

    // Add user message to UI immediately
    const userMsg = {
      id: `temp-${Date.now()}`,
      paneId,
      role: "user" as const,
      content: userContent,
      isRelay: false,
      createdAt: new Date().toISOString(),
    };
    addMessage(paneId, userMsg);

    // Add empty assistant message for streaming
    const assistantMsg = {
      id: `temp-assistant-${Date.now()}`,
      paneId,
      role: "assistant" as const,
      content: "",
      isRelay: false,
      createdAt: new Date().toISOString(),
    };
    addMessage(paneId, assistantMsg);
    setStreaming(paneId, true);
    setWaitState("idle");

    // Timeout hints for slow models
    let firstChunkReceived = false;
    waitTimerRef.current = setTimeout(() => {
      if (!firstChunkReceived) setWaitState("waiting");
    }, 8000);
    timeoutTimerRef.current = setTimeout(() => {
      if (!firstChunkReceived) setWaitState("timeout");
    }, 30000);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paneId, message: userContent }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;
          const data = trimmed.slice(6);
          if (data === "[DONE]") continue;
          try {
            const json = JSON.parse(data);
            if (json.content) {
              if (!firstChunkReceived) {
                firstChunkReceived = true;
                setWaitState("idle");
              }
              appendToLastMessage(paneId, json.content);
            }
          } catch {
            // skip
          }
        }
      }
    } catch (error) {
      appendToLastMessage(paneId, `\n\n[错误: ${error instanceof Error ? error.message : "未知错误"}]`);
    } finally {
      if (waitTimerRef.current) clearTimeout(waitTimerRef.current);
      if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
      setStreaming(paneId, false);
      setWaitState("idle");
    }
  }

  async function clearContext() {
    await fetch("/api/ai/messages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paneId }),
    });
    setMessages(paneId, []);
  }

  function copyContent(content: string, id: string) {
    navigator.clipboard.writeText(content);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="flex flex-col rounded-xl border border-black/8 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-black/8 dark:border-white/10 px-3 py-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-medium truncate">{paneName || model?.name || "窗格"}</span>
          {model && (
            <span className="shrink-0 rounded bg-black/5 dark:bg-white/5 px-1.5 py-0.5 text-[10px] text-muted-foreground">
              {model.provider}
            </span>
          )}
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={clearContext}
            className="rounded p-1 text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
            title="清空上下文"
          >
            <Eraser className="h-3 w-3" />
          </button>
          {onDelete && (
            <button
              onClick={onDelete}
              className="rounded p-1 text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
              title="删除窗格"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[200px] max-h-[400px]">
        {paneMessages.length === 0 && (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground/40">
            开始对话...
          </div>
        )}
        {paneMessages.map((msg) => (
          <div
            key={msg.id}
            className={`group ${msg.role === "user" ? "flex justify-end" : ""}`}
          >
            <div
              className={`inline-block max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-primary/20 text-foreground"
                  : "bg-black/5 dark:bg-white/5 text-foreground"
              }`}
            >
              <div className="whitespace-pre-wrap break-words">{msg.content}</div>
              {msg.role === "assistant" && msg.content && (
                <div className="mt-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => copyContent(msg.content, msg.id)}
                    className="rounded p-1 text-muted-foreground hover:text-foreground"
                    title="复制"
                  >
                    {copied === msg.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </button>
                  {onRelay && (
                    <button
                      onClick={() => onRelay(msg.id, msg.content)}
                      className="rounded p-1 text-muted-foreground hover:text-foreground"
                      title="转发给..."
                    >
                      <Forward className="h-3 w-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {streaming && paneMessages.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="animate-pulse">●</span>
            {waitState === "waiting" ? "模型响应较慢，请耐心等待..." :
             waitState === "timeout" ? "响应超时，模型可能暂时不可用" :
             "生成中..."}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-black/8 dark:border-white/10 p-2">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={streaming ? "生成中..." : "输入消息..."}
            disabled={streaming}
            rows={2}
            className="flex-1 resize-none rounded-md border border-black/8 dark:border-white/10 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-brand-cyan/30 focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={streaming || !input.trim()}
            className="self-end rounded-md bg-primary p-2 text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-30"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
