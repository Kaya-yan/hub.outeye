"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Check, X, Plug, ChevronDown } from "lucide-react";

interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  modelId: string;
  apiKey: string;
  apiKeyConfigured: boolean;
  baseUrl?: string;
  temperature: string;
  maxTokens: number;
  isActive: boolean;
}

const PROVIDERS = [
  { value: "deepseek", label: "DeepSeek" },
  { value: "moonshot", label: "Moonshot (Kimi)" },
  { value: "anthropic", label: "Anthropic (Claude)" },
  { value: "mimo", label: "MiMo" },
  { value: "openai", label: "OpenAI (GPT)" },
  { value: "google", label: "Google (Gemini)" },
  { value: "siliconflow", label: "SiliconFlow" },
  { value: "aliyun", label: "阿里云百炼" },
  { value: "ollama", label: "本地模型 / Ollama" },
  { value: "custom", label: "自定义 Provider" },
];

const BASE_URL_HINTS: Record<string, string> = {
  mimo: "推荐 https://token-plan-cn.xiaomimimo.com/v1（OpenAI 兼容）",
  anthropic: "默认 https://api.anthropic.com，代理用户可自定义",
  ollama: "默认 http://localhost:11434/v1",
};

const PROVIDER_MAX_TOKENS: Record<string, number> = {
  mimo: 1024,
  moonshot: 2048,
  deepseek: 4096,
  anthropic: 4096,
  openai: 4096,
  google: 2048,
  siliconflow: 4096,
  aliyun: 2048,
  ollama: 2048,
};

const PROVIDER_NOTES: Record<string, string> = {
  mimo: "⚠ MiMo 响应较慢，Max Tokens 不宜超过 1024，否则 Vercel 函数可能超时",
};

const MODEL_PRESETS: Record<string, { id: string; label: string; desc: string }[]> = {
  deepseek: [
    { id: "deepseek-chat", label: "deepseek-chat", desc: "通用对话 · 默认" },
    { id: "deepseek-coder", label: "deepseek-coder", desc: "代码专用" },
    { id: "deepseek-reasoner", label: "deepseek-reasoner", desc: "深度推理" },
  ],
  moonshot: [
    { id: "moonshot-v1-8k", label: "moonshot-v1-8k", desc: "8K 上下文 · 默认" },
    { id: "moonshot-v1-32k", label: "moonshot-v1-32k", desc: "32K 长文本" },
    { id: "moonshot-v1-128k", label: "moonshot-v1-128k", desc: "128K 超长文本" },
  ],
  anthropic: [
    { id: "claude-sonnet-4-20250514", label: "claude-sonnet-4", desc: "最新旗舰 · 默认" },
    { id: "claude-haiku-4-20250414", label: "claude-haiku-4", desc: "快速轻量" },
    { id: "claude-3-5-sonnet-20241022", label: "claude-3.5-sonnet", desc: "上代旗舰" },
  ],
  mimo: [
    { id: "mimo-v2.5-pro", label: "mimo-v2.5-pro", desc: "最新版本 · 默认" },
  ],
  openai: [
    { id: "gpt-4o", label: "gpt-4o", desc: "多模态旗舰 · 默认" },
    { id: "gpt-4o-mini", label: "gpt-4o-mini", desc: "快速经济" },
    { id: "o3-mini", label: "o3-mini", desc: "推理模型" },
  ],
  google: [
    { id: "gemini-2.5-pro", label: "gemini-2.5-pro", desc: "最新旗舰 · 默认" },
    { id: "gemini-2.5-flash", label: "gemini-2.5-flash", desc: "快速经济" },
  ],
  siliconflow: [
    { id: "deepseek-ai/DeepSeek-V3", label: "DeepSeek-V3", desc: "默认" },
    { id: "Qwen/Qwen2.5-72B-Instruct", label: "Qwen2.5-72B", desc: "通义千问" },
  ],
  aliyun: [
    { id: "qwen-plus", label: "qwen-plus", desc: "均衡 · 默认" },
    { id: "qwen-turbo", label: "qwen-turbo", desc: "快速经济" },
    { id: "qwen-max", label: "qwen-max", desc: "最强能力" },
  ],
};

export default function SettingsPage() {
  const [models, setModels] = useState<ModelConfig[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    provider: "deepseek",
    modelId: "",
    apiKey: "",
    baseUrl: "",
    temperature: "0.7",
    maxTokens: 4096,
  });
  const [customModelId, setCustomModelId] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { ok: boolean; message: string; debug?: { endpoint: string; protocol: string } }>>({});

  const presets = MODEL_PRESETS[form.provider] || [];

  useEffect(() => {
    fetch("/api/ai/models")
      .then((r) => r.json())
      .then(setModels);
  }, []);

  // Auto-set modelId when provider changes
  useEffect(() => {
    if (customModelId) return;
    const first = presets[0];
    if (first && !form.modelId) {
      setForm((f) => ({ ...f, modelId: first.id }));
    }
  }, [form.provider, presets, customModelId, form.modelId]);

  async function addModel() {
    const res = await fetch("/api/ai/models", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const model = await res.json();
    setModels([...models, model]);
    resetForm();
  }

  async function deleteModel(id: string) {
    await fetch("/api/ai/models", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setModels(models.filter((m) => m.id !== id));
  }

  async function toggleActive(model: ModelConfig) {
    await fetch("/api/ai/models", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: model.id, isActive: !model.isActive }),
    });
    setModels(models.map((m) => (m.id === model.id ? { ...m, isActive: !m.isActive } : m)));
  }

  async function testConnection(model: ModelConfig) {
    setTesting(model.id);
    try {
      const res = await fetch("/api/ai/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: model.provider,
          modelId: model.modelId,
          dbModelId: model.id,
          baseUrl: model.baseUrl,
        }),
      });
      const data = await res.json();
      setTestResults((prev) => ({
        ...prev,
        [model.id]: {
          ok: data.ok,
          message: data.ok
            ? `连接正常 · ${data.latency}ms`
            : data.error || "连接失败",
          debug: data.debug,
        },
      }));
    } catch {
      setTestResults((prev) => ({
        ...prev,
        [model.id]: { ok: false, message: "请求失败" },
      }));
    } finally {
      setTesting(null);
    }
  }

  function resetForm() {
    setForm({
      name: "",
      provider: "deepseek",
      modelId: "",
      apiKey: "",
      baseUrl: "",
      temperature: "0.7",
      maxTokens: 4096,
    });
    setCustomModelId(false);
    setShowAdd(false);
    setEditingId(null);
  }

  function handleProviderChange(provider: string) {
    setCustomModelId(false);
    const firstPreset = MODEL_PRESETS[provider]?.[0];
    setForm((f) => ({
      ...f,
      provider,
      modelId: firstPreset?.id || "",
      maxTokens: PROVIDER_MAX_TOKENS[provider] || 4096,
    }));
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">模型配置中心</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            管理 AI Hub 使用的模型和 API Key
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> 添加新模型
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showAdd || editingId) && (
        <div className="mt-6 rounded-xl border border-black/8 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] p-6">
          <h2 className="mb-4 text-lg font-semibold">
            {editingId ? "编辑模型" : "添加新模型"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">模型名称</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="如 DeepSeek-代码"
                className="w-full rounded-md border border-black/8 dark:border-white/10 bg-background px-3 py-2 text-sm focus:border-brand-cyan/30 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Provider</label>
              <select
                value={form.provider}
                onChange={(e) => handleProviderChange(e.target.value)}
                className="w-full rounded-md border border-black/8 dark:border-white/10 bg-background px-3 py-2 text-sm focus:border-brand-cyan/30 focus:outline-none"
              >
                {PROVIDERS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-muted-foreground">Model ID</label>
              {presets.length > 0 && !customModelId ? (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select
                      value={form.modelId}
                      onChange={(e) => setForm({ ...form, modelId: e.target.value })}
                      className="w-full rounded-md border border-black/8 dark:border-white/10 bg-background px-3 py-2 text-sm focus:border-brand-cyan/30 focus:outline-none"
                    >
                      {presets.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label} — {p.desc}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setCustomModelId(true)}
                    className="shrink-0 rounded-md border border-black/8 dark:border-white/10 px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    自定义
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={form.modelId}
                    onChange={(e) => setForm({ ...form, modelId: e.target.value })}
                    placeholder="输入自定义 Model ID"
                    className="flex-1 rounded-md border border-black/8 dark:border-white/10 bg-background px-3 py-2 text-sm focus:border-brand-cyan/30 focus:outline-none"
                  />
                  {presets.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomModelId(false);
                        setForm((f) => ({ ...f, modelId: presets[0]?.id || "" }));
                      }}
                      className="shrink-0 rounded-md border border-black/8 dark:border-white/10 px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      预设
                    </button>
                  )}
                </div>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">API Key</label>
              <input
                type="password"
                value={form.apiKey}
                onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
                placeholder="输入 API Key"
                className="w-full rounded-md border border-black/8 dark:border-white/10 bg-background px-3 py-2 text-sm focus:border-brand-cyan/30 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Base URL（可选）</label>
              <input
                value={form.baseUrl}
                onChange={(e) => setForm({ ...form, baseUrl: e.target.value })}
                placeholder="留空使用默认"
                className="w-full rounded-md border border-black/8 dark:border-white/10 bg-background px-3 py-2 text-sm focus:border-brand-cyan/30 focus:outline-none"
              />
              {BASE_URL_HINTS[form.provider] && (
                <p className="mt-1 text-[11px] text-muted-foreground/50">{BASE_URL_HINTS[form.provider]}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Temperature</label>
              <input
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={form.temperature}
                onChange={(e) => setForm({ ...form, temperature: e.target.value })}
                className="w-full rounded-md border border-black/8 dark:border-white/10 bg-background px-3 py-2 text-sm focus:border-brand-cyan/30 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Max Tokens</label>
              <input
                type="number"
                min="64"
                max="8192"
                step="256"
                value={form.maxTokens}
                onChange={(e) => setForm({ ...form, maxTokens: parseInt(e.target.value) || 2048 })}
                className="w-full rounded-md border border-black/8 dark:border-white/10 bg-background px-3 py-2 text-sm focus:border-brand-cyan/30 focus:outline-none"
              />
              {PROVIDER_NOTES[form.provider] && (
                <p className="mt-1 text-[11px] text-amber-400">{PROVIDER_NOTES[form.provider]}</p>
              )}
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={addModel}
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
            >
              <Check className="h-4 w-4" /> 保存
            </button>
            <button
              onClick={resetForm}
              className="flex items-center gap-2 rounded-md px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" /> 取消
            </button>
          </div>
        </div>
      )}

      {/* Model List */}
      <div className="mt-6 space-y-3">
        {models.map((model) => {
          const result = testResults[model.id];
          return (
            <div
              key={model.id}
              className={`flex items-center justify-between rounded-xl border border-black/8 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] p-4 transition-opacity ${
                model.isActive ? "" : "opacity-50"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-medium">{model.name}</span>
                  <span className="rounded bg-black/5 dark:bg-white/5 px-2 py-0.5 text-xs text-muted-foreground">
                    {model.provider}
                  </span>
                  <span className="text-xs text-muted-foreground/40">{model.modelId}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Key: {model.apiKey} | Base: {model.baseUrl || "默认"}
                </p>
                {result && (
                  <div className="mt-1">
                    <p className={`text-xs ${result.ok ? "text-emerald-400" : "text-red-400"}`}>
                      {result.ok ? "✅" : "❌"} {result.message}
                    </p>
                    {!result.ok && result.debug && (
                      <p className="text-[10px] text-muted-foreground/40 mt-0.5">
                        {result.debug.protocol} · {result.debug.endpoint}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-3">
                <button
                  onClick={() => testConnection(model)}
                  disabled={testing === model.id}
                  className="flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-40"
                  title="测试连接"
                >
                  <Plug className="h-3 w-3" />
                  {testing === model.id ? "测试中..." : "测试"}
                </button>
                <button
                  onClick={() => toggleActive(model)}
                  className={`rounded px-2 py-1 text-xs ${
                    model.isActive
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-black/5 dark:bg-white/5 text-muted-foreground"
                  }`}
                >
                  {model.isActive ? "启用" : "禁用"}
                </button>
                <button
                  onClick={() => deleteModel(model.id)}
                  className="rounded p-1.5 text-muted-foreground hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
        {models.length === 0 && (
          <div className="rounded-xl border border-dashed border-black/8 dark:border-white/10 py-12 text-center text-sm text-muted-foreground">
            暂无配置的模型，点击"添加新模型"开始
          </div>
        )}
      </div>
    </div>
  );
}
