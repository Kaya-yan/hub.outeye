"use client";

import { useEffect, useState, useCallback } from "react";
import { useAIHubStore } from "@/stores/ai-hub";
import { ThreadList } from "@/components/ai-hub/ThreadList";
import { PaneView } from "@/components/ai-hub/PaneView";
import { Plus, Settings, X } from "lucide-react";
import Link from "next/link";

export default function AiHubPage() {
  const models = useAIHubStore((s) => s.models);
  const threads = useAIHubStore((s) => s.threads);
  const currentThreadId = useAIHubStore((s) => s.currentThreadId);
  const panes = useAIHubStore((s) => s.panes);
  const setModels = useAIHubStore((s) => s.setModels);
  const setThreads = useAIHubStore((s) => s.setThreads);
  const setPanes = useAIHubStore((s) => s.setPanes);
  const removePane = useAIHubStore((s) => s.removePane);
  const addMessage = useAIHubStore((s) => s.addMessage);
  const appendToLastMessage = useAIHubStore((s) => s.appendToLastMessage);
  const setStreaming = useAIHubStore((s) => s.setStreaming);
  const [loading, setLoading] = useState(true);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [relaySource, setRelaySource] = useState<{ content: string; fromPaneId: string } | null>(null);

  // Load initial data
  useEffect(() => {
    async function load() {
      const [modelsRes, threadsRes] = await Promise.all([
        fetch("/api/ai/models"),
        fetch("/api/ai/threads"),
      ]);
      const [modelsData, threadsData] = await Promise.all([
        modelsRes.json(),
        threadsRes.json(),
      ]);
      setModels(modelsData);
      setThreads(threadsData);
      setLoading(false);
    }
    load();
  }, [setModels, setThreads]);

  // Load panes when thread changes
  useEffect(() => {
    if (!currentThreadId) {
      setPanes([]);
      return;
    }
    async function loadPanes() {
      const res = await fetch(`/api/ai/panes?threadId=${currentThreadId}`);
      const data = await res.json();
      setPanes(data);
    }
    loadPanes();
  }, [currentThreadId, setPanes]);

  async function addPane(modelId: string) {
    if (!currentThreadId) return;
    if (panes.length >= 4) return;

    const model = models.find((m) => m.id === modelId);
    if (!model) return;

    const res = await fetch("/api/ai/panes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        threadId: currentThreadId,
        modelId: model.id,
        paneName: model.name,
      }),
    });
    const pane = await res.json();
    setPanes([...panes, pane]);
    setShowModelPicker(false);
  }

  async function deletePane(paneId: string) {
    try {
      await fetch("/api/ai/panes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: paneId }),
      });
      removePane(paneId);
    } catch {
      // keep state as-is on failure
    }
    setConfirmDelete(null);
  }

  // Called when user clicks "转发" on a message — opens pane selector
  function handleRelayClick(fromPaneId: string, content: string) {
    setRelaySource({ content, fromPaneId });
  }

  // Called when user selects a target pane from the relay modal
  async function handleRelayConfirm(toPaneId: string) {
    if (!relaySource) return;

    const relayContent = `请审核/补充以下内容：\n\n${relaySource.content}`;

    // Add user message to target pane's UI
    const userMsg = {
      id: `relay-${Date.now()}`,
      paneId: toPaneId,
      role: "user" as const,
      content: relayContent,
      isRelay: true,
      createdAt: new Date().toISOString(),
    };
    addMessage(toPaneId, userMsg);

    // Add empty assistant message for streaming
    const assistantMsg = {
      id: `relay-assistant-${Date.now()}`,
      paneId: toPaneId,
      role: "assistant" as const,
      content: "",
      isRelay: false,
      createdAt: new Date().toISOString(),
    };
    addMessage(toPaneId, assistantMsg);
    setStreaming(toPaneId, true);

    // Save to DB + trigger AI chat
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paneId: toPaneId, message: relayContent }),
      });

      if (!res.ok) throw new Error(await res.text());

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
            if (json.content) appendToLastMessage(toPaneId, json.content);
          } catch { /* skip */ }
        }
      }
    } catch (error) {
      appendToLastMessage(toPaneId, `\n\n[转发错误: ${error instanceof Error ? error.message : "未知错误"}]`);
    } finally {
      setStreaming(toPaneId, false);
    }

    setRelaySource(null);
  }

  const availableModels = models.filter((m) => m.apiKeyConfigured && m.isActive);
  const usedModelIds = new Set(panes.map((p) => p.modelId));
  const otherPanes = panes.filter((p) => p.id !== relaySource?.fromPaneId);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-sm text-muted-foreground">加载中...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <ThreadList />
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/8 dark:border-white/10 px-4 py-3">
          <h1 className="text-lg font-semibold">AI Hub</h1>
          <div className="flex items-center gap-2 relative">
            {currentThreadId && panes.length < 4 && (
              <button
                onClick={() => setShowModelPicker(!showModelPicker)}
                className="flex items-center gap-1 rounded-md bg-black/5 dark:bg-white/5 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-black/10 dark:hover:bg-white/10 hover:text-foreground"
              >
                <Plus className="h-3 w-3" /> 添加窗格
              </button>
            )}
            <Link
              href="/dashboard/settings"
              className="rounded-md p-1.5 text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
            </Link>

            {/* Model Picker Dropdown */}
            {showModelPicker && (
              <div className="absolute right-0 top-full z-50 mt-1 w-72 rounded-xl border border-black/8 dark:border-white/10 bg-background shadow-lg">
                <div className="flex items-center justify-between border-b border-black/8 dark:border-white/10 px-4 py-2.5">
                  <span className="text-sm font-medium">选择模型</span>
                  <button onClick={() => setShowModelPicker(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto p-1">
                  {availableModels.length === 0 ? (
                    <p className="px-3 py-4 text-center text-xs text-muted-foreground">
                      无可用模型，请先在配置中心添加
                    </p>
                  ) : (
                    availableModels.map((m) => {
                      const inUse = usedModelIds.has(m.id);
                      return (
                        <button
                          key={m.id}
                          onClick={() => addPane(m.id)}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{m.name}</span>
                              <span className="rounded bg-black/5 dark:bg-white/5 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                                {m.provider}
                              </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground/50 truncate">{m.modelId}</p>
                          </div>
                          {inUse && (
                            <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">
                              已使用
                            </span>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pane Grid */}
        <div className="flex-1 overflow-auto p-4">
          {!currentThreadId ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p className="text-4xl">🤖</p>
                <p className="mt-4 text-sm">选择或创建一个话题开始对话</p>
                <p className="mt-1 text-xs text-muted-foreground/40">
                  支持多模型并行 · 独立上下文 · 转发审核
                </p>
              </div>
            </div>
          ) : panes.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p className="text-sm">该话题暂无窗格</p>
                <button
                  onClick={() => setShowModelPicker(true)}
                  className="mt-3 rounded-md bg-primary/10 px-4 py-2 text-sm text-primary transition-colors hover:bg-primary/20"
                >
                  + 添加第一个窗格
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`grid gap-4 ${
                panes.length <= 2 ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-2"
              }`}
            >
              {panes.map((pane) => (
                <PaneView
                  key={pane.id}
                  paneId={pane.id}
                  paneName={pane.paneName}
                  modelId={pane.modelId}
                  onRelay={
                    panes.length > 1
                      ? (msgId, content) => handleRelayClick(pane.id, content)
                      : undefined
                  }
                  onDelete={() => setConfirmDelete(pane.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Relay Target Selector Modal */}
      {relaySource && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-xl border border-black/8 dark:border-white/10 bg-background p-5 shadow-xl">
            <h3 className="text-sm font-semibold">转发到窗格</h3>
            <p className="mt-1.5 text-xs text-muted-foreground">
              选择目标窗格，消息将自动发送并触发 AI 回复。
            </p>
            <div className="mt-3 space-y-1.5">
              {otherPanes.map((p) => {
                const paneModel = models.find((m) => m.id === p.modelId);
                return (
                  <button
                    key={p.id}
                    onClick={() => handleRelayConfirm(p.id)}
                    className="flex w-full items-center gap-3 rounded-lg border border-black/8 dark:border-white/10 px-3 py-2.5 text-left text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="font-medium">{p.paneName || paneModel?.name || "窗格"}</span>
                      {paneModel && (
                        <span className="ml-2 rounded bg-black/5 dark:bg-white/5 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          {paneModel.provider}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setRelaySource(null)}
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-xl border border-black/8 dark:border-white/10 bg-background p-5 shadow-xl">
            <h3 className="text-sm font-semibold">确定删除此窗格？</h3>
            <p className="mt-1.5 text-xs text-muted-foreground">
              该窗格的所有对话记录将被清除，此操作不可撤销。
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                取消
              </button>
              <button
                onClick={() => deletePane(confirmDelete)}
                className="rounded-md bg-red-500/10 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/20"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
