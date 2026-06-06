import { create } from "zustand";

interface Model {
  id: string;
  name: string;
  provider: string;
  modelId: string;
  apiKey: string;
  apiKeyConfigured: boolean;
  baseUrl?: string;
  isActive: boolean;
}

interface Thread {
  id: string;
  title: string;
  projectTag?: string;
  color: string;
  isPinned: boolean;
  createdAt: string;
}

interface Pane {
  id: string;
  threadId: string;
  modelId: string;
  paneName?: string;
  position: number;
  systemPrompt?: string;
}

interface Message {
  id: string;
  paneId: string;
  role: "user" | "assistant" | "system";
  content: string;
  tokensUsed?: number;
  latencyMs?: number;
  isRelay: boolean;
  createdAt: string;
}

interface AIHubState {
  models: Model[];
  threads: Thread[];
  currentThreadId: string | null;
  panes: Pane[];
  messages: Record<string, Message[]>; // paneId -> messages
  isStreaming: Record<string, boolean>; // paneId -> streaming state

  setModels: (models: Model[]) => void;
  setThreads: (threads: Thread[]) => void;
  setCurrentThread: (id: string | null) => void;
  setPanes: (panes: Pane[]) => void;
  setMessages: (paneId: string, messages: Message[]) => void;
  addMessage: (paneId: string, message: Message) => void;
  appendToLastMessage: (paneId: string, content: string) => void;
  setStreaming: (paneId: string, streaming: boolean) => void;
  removePane: (paneId: string) => void;
}

export const useAIHubStore = create<AIHubState>((set) => ({
  models: [],
  threads: [],
  currentThreadId: null,
  panes: [],
  messages: {},
  isStreaming: {},

  setModels: (models) => set({ models }),
  setThreads: (threads) => set({ threads }),
  setCurrentThread: (id) => set({ currentThreadId: id }),
  setPanes: (panes) => set({ panes }),
  setMessages: (paneId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [paneId]: messages },
    })),
  addMessage: (paneId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [paneId]: [...(state.messages[paneId] || []), message],
      },
    })),
  appendToLastMessage: (paneId, content) =>
    set((state) => {
      const msgs = state.messages[paneId] || [];
      if (msgs.length === 0) return state;
      const last = msgs[msgs.length - 1];
      if (last.role !== "assistant") return state;
      const updated = { ...last, content: last.content + content };
      return {
        messages: {
          ...state.messages,
          [paneId]: [...msgs.slice(0, -1), updated],
        },
      };
    }),
  setStreaming: (paneId, streaming) =>
    set((state) => ({
      isStreaming: { ...state.isStreaming, [paneId]: streaming },
    })),
  removePane: (paneId) =>
    set((state) => {
      const { [paneId]: _, ...restMessages } = state.messages;
      const { [paneId]: __, ...restStreaming } = state.isStreaming;
      return {
        panes: state.panes.filter((p) => p.id !== paneId),
        messages: restMessages,
        isStreaming: restStreaming,
      };
    }),
}));
