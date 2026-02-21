"use client";

import { create } from "zustand";
import { Relationship, FeedItem } from "@/types/relationship";
import { mockRelationships } from "@/data/mock-relationships";
import { mockFeed } from "@/data/mock-feed";

interface RelationshipDetailState {
  relationship: Relationship | null;
  feed: FeedItem[];
  isLoaded: boolean;
  loadRelationship: (id: string) => void;
  addMessage: (text: string) => void;
}

export const useRelationshipStore = create<RelationshipDetailState>()((set, get) => ({
  relationship: null,
  feed: [],
  isLoaded: false,
  loadRelationship: (id: string) => {
    const rel = mockRelationships.find((r) => r.id === id) || null;
    const feed = mockFeed.filter((f) => f.relationshipId === id);
    set({ relationship: rel, feed, isLoaded: true });
  },
  addMessage: (text: string) => {
    const state = get();
    const newItem: FeedItem = {
      id: `feed-${Date.now()}`,
      relationshipId: state.relationship?.id || "",
      type: "message",
      content: text,
      timestamp: new Date().toISOString(),
      consultation: {
        response: "让我分析一下这段对话...",
        tone: "fox",
      },
    };
    set({ feed: [...state.feed, newItem] });
  },
}));
