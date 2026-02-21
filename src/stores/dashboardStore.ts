"use client";

import { create } from "zustand";
import { Relationship } from "@/types/relationship";
import { User } from "@/types/user";
import { mockRelationships } from "@/data/mock-relationships";
import { mockUser } from "@/data/mock-user";
import { DAILY_MIRROR_QUESTIONS } from "@/lib/constants";

interface DashboardState {
  user: User | null;
  relationships: Relationship[];
  dailyQuestion: string;
  isLoaded: boolean;
  loadDashboard: () => void;
}

export const useDashboardStore = create<DashboardState>()((set, get) => ({
  user: null,
  relationships: [],
  dailyQuestion: "",
  isLoaded: false,
  loadDashboard: () => {
    if (get().isLoaded) return;
    const dayIndex = new Date().getDate() % DAILY_MIRROR_QUESTIONS.length;
    set({
      user: mockUser,
      relationships: mockRelationships,
      dailyQuestion: DAILY_MIRROR_QUESTIONS[dayIndex],
      isLoaded: true,
    });
  },
}));
