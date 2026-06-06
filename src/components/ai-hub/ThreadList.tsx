"use client";

import { useState } from "react";
import { useAIHubStore } from "@/stores/ai-hub";
import { cn } from "@/lib/utils";
import { Plus, Pin, Trash2 } from "lucide-react";

export function ThreadList() {
  const threads = useAIHubStore((s) => s.threads);
  const currentThreadId = useAIHubStore((s) => s.currentThreadId);
  const setCurrentThread = useAIHubStore((s) => s.setCurrentThread);
  const setThreads = useAIHubStore((s) => s.setThreads);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  async function addThread() {
    if (!newTitle.trim()) return;
    const res = await fetch("/api/ai/threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });
    const thread = await res.json();
    setThreads([thread, ...threads]);
    setCurrentThread(thread.id);
    setNewTitle("");
    setShowAdd(false);
  }

  async function deleteThread(id: string) {
    await fetch("/api/ai/threads", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setThreads(threads.filter((t) => t.id !== id));
    if (currentThreadId === id) setCurrentThread(null);
  }

  return (
    <div className="flex h-full w-56 flex-col border-r border-white/10 bg-sidebar">
      <div className="flex items-center justify-between border-b border-white/10 p-3">
        <span className="text-sm font-semibold">话题</span>
        <button
          onClick={() => setShowAdd(true)}
          className="rounded p-1 text-muted-foreground hover:bg-white/5 hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {showAdd && (
        <div className="border-b border-white/10 p-2">
          <input
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addThread();
              if (e.key === "Escape") setShowAdd(false);
            }}
            placeholder="话题名称..."
            className="w-full rounded border border-white/10 bg-background px-2 py-1 text-sm placeholder:text-muted-foreground focus:border-brand-cyan/30 focus:outline-none"
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-1">
        {threads.map((thread) => (
          <div
            key={thread.id}
            onClick={() => setCurrentThread(thread.id)}
            className={cn(
              "group flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
              currentThreadId === thread.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              {thread.isPinned && <Pin className="h-3 w-3 shrink-0" />}
              <span className="truncate">{thread.title}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteThread(thread.id);
              }}
              className="hidden rounded p-0.5 text-muted-foreground hover:text-red-400 group-hover:block"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
        {threads.length === 0 && (
          <p className="px-3 py-8 text-center text-xs text-muted-foreground/40">
            暂无话题，点击 + 创建
          </p>
        )}
      </div>
    </div>
  );
}
