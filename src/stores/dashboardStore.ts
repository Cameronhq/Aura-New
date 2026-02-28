"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Relationship, Reflection, FeedItem } from "@/types/relationship";
import { User } from "@/types/user";
import { DAILY_MIRROR_QUESTIONS } from "@/lib/constants";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { useAuthStore } from "@/stores/authStore";

interface MirrorAnswer {
  question: string;
  answer: string;
  insight: string;
  timestamp: string;
}

interface PendingMirrorContext {
  question: string;
  answer: string;
  insight: string;
}

interface MirrorChatMessage {
  role: "user" | "ai";
  text: string;
}

interface AuraProfile {
  summary: string;
  labels: string[];
  generatedAt: string;
}

interface DashboardState {
  user: User | null;
  relationships: Relationship[];
  dailyQuestion: string;
  mirrorAnswers: MirrorAnswer[];
  reflections: Reflection[];
  isLoaded: boolean;
  pendingMirrorContext: PendingMirrorContext | null;
  feeds: Record<string, FeedItem[]>;
  mirrorChatMessages: MirrorChatMessage[];
  auraProfile: AuraProfile | null;
  isGeneratingProfile: boolean;
  loadDashboard: () => void;
  addRelationship: (rel: Omit<Relationship, "id" | "auraScore" | "lastInteraction" | "status">) => void;
  updateRelationship: (id: string, updates: Partial<Relationship>) => void;
  submitMirrorAnswer: (answer: string) => Promise<string>;
  addReflection: (content: string) => Promise<void>;
  saveFeed: (relId: string, feed: FeedItem[]) => void;
  generateAuraProfile: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      user: null,
      relationships: [],
      dailyQuestion: "",
      mirrorAnswers: [],
      reflections: [],
      isLoaded: false,
      pendingMirrorContext: null,
      feeds: {},
      mirrorChatMessages: [],
      auraProfile: null,
      isGeneratingProfile: false,
      loadDashboard: () => {
        if (get().isLoaded) return;
        const dayIndex = new Date().getDate() % DAILY_MIRROR_QUESTIONS.length;

        const onboarding = useOnboardingStore.getState();
        const auth = useAuthStore.getState();

        const vibeLabels: Record<string, string[]> = {
          fox: ["洞察力敏锐", "策略思考", "情感独立"],
          dog: ["温暖真诚", "忠诚可靠", "情感支持"],
          owl: ["智慧深邃", "理性平衡", "洞察全局"],
        };
        const vibe = onboarding.consultantVibe || "fox";

        const realUser: User = {
          id: "user-1",
          email: auth.user?.email || "",
          nickname: onboarding.nickname || auth.user?.nickname || "",
          birthday: onboarding.birthday || "",
          gender: onboarding.gender || "",
          orientation: onboarding.orientation || "",
          relationshipStatus: onboarding.relationshipStatus || "",
          consultantVibe: vibe,
          auraLabels: vibeLabels[vibe],
          auraLevel: 1,
          auraTitle: "初心者",
          createdAt: new Date().toISOString(),
        };

        set({
          user: realUser,
          dailyQuestion: DAILY_MIRROR_QUESTIONS[dayIndex],
          isLoaded: true,
        });
      },
      addRelationship: (data) => {
        const state = get();
        const newRel: Relationship = {
          id: `rel-${Date.now()}`,
          auraScore: 50,
          lastInteraction: new Date().toISOString().split("T")[0],
          status: "active",
          lastActivity: "刚刚创建",
          ...data,
        };
        set({ relationships: [...state.relationships, newRel] });
      },
      updateRelationship: (id: string, updates: Partial<Relationship>) => {
        set((state) => ({
          relationships: state.relationships.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        }));
      },
      saveFeed: (relId: string, feed: FeedItem[]) => {
        set((state) => ({
          feeds: { ...state.feeds, [relId]: feed },
        }));
      },
      generateAuraProfile: async () => {
        const state = get();
        if (!state.user || state.isGeneratingProfile) return;
        set({ isGeneratingProfile: true });
        try {
          const res = await fetch("/api/aura-profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user: state.user,
              mirrorAnswers: state.mirrorAnswers.slice(-5),
              mirrorChatMessages: state.mirrorChatMessages.slice(-20),
            }),
          });
          if (!res.ok) throw new Error(`Profile API error: ${res.status}`);
          const data = await res.json();
          set({
            auraProfile: {
              summary: data.summary || "",
              labels: data.labels || [],
              generatedAt: new Date().toISOString(),
            },
            isGeneratingProfile: false,
          });
        } catch {
          set({ isGeneratingProfile: false });
        }
      },
      submitMirrorAnswer: async (answer: string) => {
        const state = get();

        // Optimistically push entry with empty insight
        const entry: MirrorAnswer = {
          question: state.dailyQuestion,
          answer,
          insight: "",
          timestamp: new Date().toISOString(),
        };
        set({ mirrorAnswers: [...state.mirrorAnswers, entry] });

        let accumulated = "";
        try {
          const response = await fetch("/api/mirror", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: state.dailyQuestion, answer }),
          });

          if (response.body) {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              accumulated += decoder.decode(value, { stream: true });
            }
          }
        } catch {
          accumulated = "你的感受值得被认真对待。每一次自我反思，都是与内心更近的一步。";
        }

        // Update the last mirror answer with final insight
        const updated = [...get().mirrorAnswers];
        if (updated.length > 0) {
          updated[updated.length - 1] = { ...updated[updated.length - 1], insight: accumulated };
          set({ mirrorAnswers: updated });
        }

        // Seed the mirror chat with this context
        set({
          pendingMirrorContext: {
            question: state.dailyQuestion,
            answer,
            insight: accumulated,
          },
        });

        // Auto-generate aura profile after first mirror answer
        if (!get().auraProfile) {
          get().generateAuraProfile();
        }

        return accumulated;
      },
      addReflection: async (content: string) => {
        const refId = `ref-${Date.now()}`;
        const newReflection: Reflection = {
          id: refId,
          date: new Date().toISOString().split("T")[0],
          mood: "reflective",
          content,
          insight: "",
          tags: ["自我反思"],
        };
        set({ reflections: [newReflection, ...get().reflections] });

        let accumulated = "";
        try {
          const response = await fetch("/api/mirror", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: "自我反思", answer: content }),
          });

          if (response.body) {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              accumulated += decoder.decode(value, { stream: true });
            }
          }
        } catch {
          accumulated = "自我反思是一种勇气。很多人不敢面对这些问题，但你选择了直面它。";
        }

        set({
          reflections: get().reflections.map((r) =>
            r.id === refId ? { ...r, insight: accumulated } : r
          ),
        });
      },
    }),
    {
      name: "aura-dashboard",
      partialize: (state) => ({
        mirrorAnswers: state.mirrorAnswers,
        relationships: state.relationships,
        reflections: state.reflections,
        mirrorChatMessages: state.mirrorChatMessages,
        auraProfile: state.auraProfile,
        feeds: Object.fromEntries(
          Object.entries(state.feeds).map(([id, items]) => [
            id,
            items.map((item) =>
              item.evidence?.screenshots?.length
                ? { ...item, evidence: { ...item.evidence, screenshots: [] } }
                : item
            ),
          ])
        ),
      }),
    }
  )
);
