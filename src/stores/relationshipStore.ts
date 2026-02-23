"use client";

import { create } from "zustand";
import { Relationship, FeedItem } from "@/types/relationship";
import { mockRelationships } from "@/data/mock-relationships";
import { mockFeed } from "@/data/mock-feed";
import { useDashboardStore } from "@/stores/dashboardStore";
import { useOnboardingStore } from "@/stores/onboardingStore";

interface RelationshipDetailState {
  relationship: Relationship | null;
  feed: FeedItem[];
  isLoaded: boolean;
  loadRelationship: (id: string) => void;
  addMessage: (text: string) => Promise<void>;
  addScreenshot: (images: string[], caption?: string) => Promise<void>;
  addDatePlan: () => Promise<void>;
  addGiftList: () => Promise<void>;
  addSosReply: () => Promise<void>;
}

export const useRelationshipStore = create<RelationshipDetailState>()((set, get) => ({
  relationship: null,
  feed: [],
  isLoaded: false,
  loadRelationship: (id: string) => {
    const all = [...mockRelationships, ...useDashboardStore.getState().relationships];
    const rel = all.find((r) => r.id === id) || null;
    const feed = mockFeed.filter((f) => f.relationshipId === id);
    set({ relationship: rel, feed, isLoaded: true });
  },
  addMessage: async (text: string) => {
    const state = get();
    const name = state.relationship?.name || "TA";
    const relId = state.relationship?.id || "";
    const relType = state.relationship?.type || "friend";
    const zodiac = state.relationship?.zodiac;
    const platform = state.relationship?.platform;

    const { consultantVibe, gender, orientation, relationshipStatus } =
      useOnboardingStore.getState();
    const vibe = consultantVibe || "fox";
    const userProfile = { gender, orientation, relationshipStatus };

    // Build conversation history from recent message feed items
    const messageFeed = get().feed.filter((item) => item.type === "message");
    const history = messageFeed
      .slice(-12)
      .map((item) => {
        if (item.consultation?.response) {
          return { role: "assistant" as const, content: item.consultation.response };
        } else {
          return { role: "user" as const, content: item.content };
        }
      })
      .filter((msg) => msg.content);

    // 1. Push user message
    const userItem: FeedItem = {
      id: `feed-${Date.now()}`,
      relationshipId: relId,
      type: "message",
      content: text,
      timestamp: new Date().toISOString(),
    };
    set({ feed: [...get().feed, userItem] });

    // 2. Push AI placeholder with streaming flag
    const aiId = `feed-ai-${Date.now()}`;
    const aiItem: FeedItem = {
      id: aiId,
      relationshipId: relId,
      type: "message",
      content: "",
      timestamp: new Date().toISOString(),
      isStreaming: true,
      consultation: { response: "", tone: vibe },
    };
    set({ feed: [...get().feed, aiItem] });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          name,
          type: relType,
          vibe,
          zodiac,
          platform,
          userProfile,
          history,
        }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      let toneParsed = false;
      let tone: "fox" | "dog" | "owl" = vibe;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulated += decoder.decode(value, { stream: true });

        // Parse tone tag from the very beginning
        if (!toneParsed) {
          const toneMatch = accumulated.match(/^\[(FOX|DOG|OWL)\]/);
          if (toneMatch) {
            tone = toneMatch[1].toLowerCase() as "fox" | "dog" | "owl";
            toneParsed = true;
          }
        }

        // Strip tone tag for display
        const displayText = accumulated.replace(/^\[(FOX|DOG|OWL)\]/, "");

        set({
          feed: get().feed.map((item) =>
            item.id === aiId
              ? { ...item, consultation: { response: displayText, tone } }
              : item
          ),
        });
      }

      // Stream done — finalize
      const finalText = accumulated.replace(/^\[(FOX|DOG|OWL)\]/, "");
      set({
        feed: get().feed.map((item) =>
          item.id === aiId
            ? { ...item, isStreaming: false, consultation: { response: finalText, tone } }
            : item
        ),
      });
    } catch {
      set({
        feed: get().feed.map((item) =>
          item.id === aiId
            ? {
                ...item,
                isStreaming: false,
                consultation: { response: "军师暂时无法连接，请稍后再试。", tone: vibe },
              }
            : item
        ),
      });
    }
  },
  addScreenshot: async (images: string[], caption?: string) => {
    const state = get();
    const name = state.relationship?.name || "TA";
    const relId = state.relationship?.id || "";
    const relType = state.relationship?.type || "friend";
    const zodiac = state.relationship?.zodiac;
    const platform = state.relationship?.platform;

    const { consultantVibe } = useOnboardingStore.getState();
    const vibe = consultantVibe || "fox";

    const itemId = `feed-screenshot-${Date.now()}`;
    const screenshotItem: FeedItem = {
      id: itemId,
      relationshipId: relId,
      type: "screenshot",
      content: caption || "上传的聊天截图",
      timestamp: new Date().toISOString(),
      evidence: { screenshots: images, analysis: "", signals: [], confidence: 0 },
      isStreaming: true,
    };
    set({ feed: [...get().feed, screenshotItem] });

    try {
      const res = await fetch("/api/screenshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images, caption, name, type: relType, zodiac, platform, vibe }),
      });

      if (!res.ok) throw new Error(`Screenshot API error: ${res.status}`);

      const data = await res.json();
      set({
        feed: get().feed.map((item) =>
          item.id === itemId
            ? {
                ...item,
                isStreaming: false,
                evidence: {
                  screenshots: images,
                  analysis: data.analysis || "",
                  signals: data.signals || [],
                  confidence: data.confidence || 0,
                },
                consultation: {
                  response: data.consultation || "",
                  tone: vibe,
                },
              }
            : item
        ),
      });
    } catch {
      set({
        feed: get().feed.map((item) =>
          item.id === itemId
            ? {
                ...item,
                isStreaming: false,
                evidence: {
                  screenshots: images,
                  analysis: "截图解析失败，请稍后重试。",
                  signals: [],
                  confidence: 0,
                },
                consultation: {
                  response: "军师暂时无法连接，请稍后再试。",
                  tone: vibe,
                },
              }
            : item
        ),
      });
    }
  },
  addDatePlan: async () => {
    const state = get();
    const name = state.relationship?.name || "TA";
    const relId = state.relationship?.id || "";
    const relType = state.relationship?.type || "friend";
    const zodiac = state.relationship?.zodiac;
    const platform = state.relationship?.platform;

    const placeholderId = `feed-${Date.now()}`;
    const placeholder: FeedItem = {
      id: placeholderId,
      relationshipId: relId,
      type: "date-plan",
      content: `为${name}策划的约会`,
      timestamp: new Date().toISOString(),
      isStreaming: true,
    };
    set({ feed: [...get().feed, placeholder] });

    try {
      const res = await fetch("/api/magic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "date", name, type: relType, zodiac, platform }),
      });
      const data = await res.json();
      set({
        feed: get().feed.map((item) =>
          item.id === placeholderId
            ? { ...item, isStreaming: false, datePlan: data.datePlan }
            : item
        ),
      });
    } catch {
      set({
        feed: get().feed.map((item) =>
          item.id === placeholderId
            ? {
                ...item,
                isStreaming: false,
                datePlan: {
                  title: "暂时无法生成",
                  location: "请稍后重试",
                  activities: ["军师暂时无法连接，请稍后再试"],
                  estimated_cost: "-",
                },
              }
            : item
        ),
      });
    }
  },
  addGiftList: async () => {
    const state = get();
    const name = state.relationship?.name || "TA";
    const relId = state.relationship?.id || "";
    const relType = state.relationship?.type || "friend";
    const zodiac = state.relationship?.zodiac;
    const platform = state.relationship?.platform;

    const placeholderId = `feed-${Date.now()}`;
    const placeholder: FeedItem = {
      id: placeholderId,
      relationshipId: relId,
      type: "gift-list",
      content: `给${name}的礼物推荐`,
      timestamp: new Date().toISOString(),
      isStreaming: true,
    };
    set({ feed: [...get().feed, placeholder] });

    try {
      const res = await fetch("/api/magic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "gift", name, type: relType, zodiac, platform }),
      });
      const data = await res.json();
      set({
        feed: get().feed.map((item) =>
          item.id === placeholderId
            ? { ...item, isStreaming: false, giftList: data.giftList }
            : item
        ),
      });
    } catch {
      set({
        feed: get().feed.map((item) =>
          item.id === placeholderId
            ? {
                ...item,
                isStreaming: false,
                giftList: {
                  items: [{ name: "暂时无法生成", reason: "军师暂时无法连接，请稍后再试", price: "-" }],
                },
              }
            : item
        ),
      });
    }
  },
  addSosReply: async () => {
    const state = get();
    const name = state.relationship?.name || "TA";
    const relId = state.relationship?.id || "";
    const relType = state.relationship?.type || "friend";
    const zodiac = state.relationship?.zodiac;
    const platform = state.relationship?.platform;

    const placeholderId = `feed-${Date.now()}`;
    const placeholder: FeedItem = {
      id: placeholderId,
      relationshipId: relId,
      type: "sos-reply",
      content: `给${name}的紧急回复`,
      timestamp: new Date().toISOString(),
      isStreaming: true,
    };
    set({ feed: [...get().feed, placeholder] });

    try {
      const res = await fetch("/api/magic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sos", name, type: relType, zodiac, platform }),
      });
      const data = await res.json();
      set({
        feed: get().feed.map((item) =>
          item.id === placeholderId
            ? { ...item, isStreaming: false, sosReplies: data.sosReplies }
            : item
        ),
      });
    } catch {
      set({
        feed: get().feed.map((item) =>
          item.id === placeholderId
            ? {
                ...item,
                isStreaming: false,
                sosReplies: ["军师暂时无法连接，请稍后再试。"],
              }
            : item
        ),
      });
    }
  },
}));
