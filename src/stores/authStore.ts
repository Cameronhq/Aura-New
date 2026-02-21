"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  user: { email: string; nickname: string } | null;
  hasCompletedOnboarding: boolean;
  login: (email: string, password: string) => boolean;
  register: (email: string, password: string) => boolean;
  logout: () => void;
  setOnboardingComplete: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      hasCompletedOnboarding: false,
      login: (email: string, password: string) => {
        if (password.length < 1) return false;
        set({ isAuthenticated: true, user: { email, nickname: "" } });
        return true;
      },
      register: (email: string, password: string) => {
        if (password.length < 1) return false;
        set({ isAuthenticated: true, user: { email, nickname: "" } });
        return true;
      },
      logout: () =>
        set({ isAuthenticated: false, user: null, hasCompletedOnboarding: false }),
      setOnboardingComplete: () => set({ hasCompletedOnboarding: true }),
    }),
    { name: "aura-auth" }
  )
);
