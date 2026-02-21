"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Relationship, Reflection } from "@/types/relationship";
import { User } from "@/types/user";
import { mockRelationships } from "@/data/mock-relationships";
import { mockUser } from "@/data/mock-user";
import { mockReflections } from "@/data/mock-reflections";
import { DAILY_MIRROR_QUESTIONS } from "@/lib/constants";

interface MirrorAnswer {
  question: string;
  answer: string;
  insight: string;
  timestamp: string;
}

interface DashboardState {
  user: User | null;
  relationships: Relationship[];
  dailyQuestion: string;
  mirrorAnswers: MirrorAnswer[];
  reflections: Reflection[];
  isLoaded: boolean;
  loadDashboard: () => void;
  addRelationship: (rel: Omit<Relationship, "id" | "auraScore" | "lastInteraction" | "status">) => void;
  submitMirrorAnswer: (answer: string) => string;
  addReflection: (content: string) => void;
}

const MOCK_INSIGHTS = [
  "你的自我觉察正在变强。能够坦诚面对自己的感受，是情感成熟的重要标志。",
  "这种想法很正常。重要的是你开始关注自己内心的声音，而不只是对方的反应。",
  "你正在学会区分「需要」和「想要」。这种边界感会让你在关系中更加从容。",
  "看得出你在认真思考这段关系。有时候退一步看，反而能看到更完整的画面。",
  "共情能力是你的优势，但记得也把这份温柔留一些给自己。",
  "这个发现很有价值。了解自己的模式，是打破循环的第一步。",
];

const REFLECTION_INSIGHTS = [
  "你正在建立更清晰的自我认知，这会帮助你做出更好的关系决策。",
  "能够表达这些想法说明你在情感上正在成长。继续保持这种自我对话。",
  "这种感受是完全正常的。接纳它，而不是评判它，是自我关怀的第一步。",
  "你的直觉在告诉你一些重要的事情，试着信任它。",
  "自我反思是一种勇气。很多人不敢面对这些问题，但你选择了直面它。",
];

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      user: null,
      relationships: [],
      dailyQuestion: "",
      mirrorAnswers: [],
      reflections: [],
      isLoaded: false,
      loadDashboard: () => {
        if (get().isLoaded) return;
        const dayIndex = new Date().getDate() % DAILY_MIRROR_QUESTIONS.length;
        set({
          user: mockUser,
          relationships: mockRelationships,
          dailyQuestion: DAILY_MIRROR_QUESTIONS[dayIndex],
          reflections: mockReflections,
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
      submitMirrorAnswer: (answer: string) => {
        const state = get();
        const insight = MOCK_INSIGHTS[Math.floor(Math.random() * MOCK_INSIGHTS.length)];
        const entry: MirrorAnswer = {
          question: state.dailyQuestion,
          answer,
          insight,
          timestamp: new Date().toISOString(),
        };
        set({ mirrorAnswers: [...state.mirrorAnswers, entry] });
        return insight;
      },
      addReflection: (content: string) => {
        const state = get();
        const insight = REFLECTION_INSIGHTS[Math.floor(Math.random() * REFLECTION_INSIGHTS.length)];
        const newReflection: Reflection = {
          id: `ref-${Date.now()}`,
          date: new Date().toISOString().split("T")[0],
          mood: "reflective",
          content,
          insight,
          tags: ["自我反思"],
        };
        set({ reflections: [newReflection, ...state.reflections] });
      },
    }),
    {
      name: "aura-dashboard",
      partialize: (state) => ({
        mirrorAnswers: state.mirrorAnswers,
      }),
    }
  )
);
