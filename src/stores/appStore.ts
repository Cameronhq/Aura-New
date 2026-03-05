import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Analysis, ChatMessage, MemoryItem } from "@/types";

interface AppState {
  analyses: Analysis[];
  memory: MemoryItem[];

  addAnalysis: (analysis: Analysis) => void;
  appendChat: (analysisId: string, msg: ChatMessage) => void;
  updateLastAssistantMessage: (analysisId: string, content: string) => void;
  addMemoryItems: (items: Omit<MemoryItem, "id" | "createdAt">[]) => void;

  getAnalysis: (id: string) => Analysis | undefined;
  getMemoryForPerson: (name: string) => MemoryItem[];
  getAllMemory: () => MemoryItem[];
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      analyses: [],
      memory: [],

      addAnalysis: (analysis) =>
        set((s) => ({ analyses: [analysis, ...s.analyses].slice(0, 50) })),

      appendChat: (analysisId, msg) =>
        set((s) => ({
          analyses: s.analyses.map((a) =>
            a.id === analysisId
              ? { ...a, chatHistory: [...a.chatHistory, msg] }
              : a
          ),
        })),

      updateLastAssistantMessage: (analysisId, content) =>
        set((s) => ({
          analyses: s.analyses.map((a) => {
            if (a.id !== analysisId) return a;
            const history = [...a.chatHistory];
            const last = history[history.length - 1];
            if (last?.role === "assistant") {
              history[history.length - 1] = { ...last, content };
            }
            return { ...a, chatHistory: history };
          }),
        })),

      addMemoryItems: (items) =>
        set((s) => ({
          memory: [
            ...s.memory,
            ...items.map((it) => ({
              ...it,
              id: crypto.randomUUID(),
              createdAt: Date.now(),
            })),
          ].slice(-200),
        })),

      getAnalysis: (id) => get().analyses.find((a) => a.id === id),
      getMemoryForPerson: (name) =>
        get().memory.filter(
          (m) => !m.personName || m.personName === name
        ),
      getAllMemory: () => get().memory,
    }),
    {
      name: "junshi-app",
      partialize: (state) => ({
        analyses: state.analyses.map((a) => ({
          ...a,
          chatHistory: a.chatHistory.slice(-20),
        })),
        memory: state.memory,
      }),
    }
  )
);
