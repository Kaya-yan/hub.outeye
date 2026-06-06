"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Lightbulb } from "lucide-react";

const categoryOptions = [
  { value: "inbox", label: "#inbox（未分类）" },
  { value: "outeye2", label: "#outeye2" },
  { value: "outeye3", label: "#outeye3" },
  { value: "outeye4", label: "#outeye4" },
  { value: "challenge-cup", label: "#challenge-cup" },
  { value: "design", label: "#design" },
  { value: "hub", label: "#hub" },
  { value: "daily", label: "#daily" },
];

export function QuickIdeaOverlay() {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("inbox");
  const [saving, setSaving] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && e.shiftKey && e.key === "I") {
      e.preventDefault();
      setOpen(true);
    }
    if (e.key === "Escape") setOpen(false);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  async function save() {
    if (!content.trim() || saving) return;
    setSaving(true);
    try {
      await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          category,
          sourceUrl: window.location.pathname,
        }),
      });
      window.dispatchEvent(new Event("idea-saved"));
      setContent("");
      setCategory("inbox");
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl border border-black/8 dark:border-white/10 bg-background p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Lightbulb className="h-5 w-5 text-yellow-500" /> 快速记录灵感
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="rounded p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <textarea
          autoFocus
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              save();
            }
          }}
          placeholder="写下你的灵感，直接回车保存..."
          rows={4}
          className="mt-4 w-full resize-none rounded-lg border border-black/8 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-brand-cyan/30 focus:outline-none"
        />
        <div className="mt-3 flex items-center justify-between">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-md border border-black/8 dark:border-white/10 bg-background px-3 py-1.5 text-sm"
          >
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              onClick={() => setOpen(false)}
              className="rounded-md px-4 py-2 text-sm text-muted-foreground"
            >
              取消
            </button>
            <button
              onClick={save}
              disabled={!content.trim() || saving}
              className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
            >
              {saving ? "保存中..." : "保存 (Enter)"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
