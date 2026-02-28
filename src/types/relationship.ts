export interface Relationship {
  id: string;
  name: string;
  avatar: string;
  type: "crush" | "partner" | "ex" | "friend" | "complicated";
  status: "active" | "paused" | "ended";
  birthday?: string;
  zodiac?: string;
  platform?: string;
  lastInteraction: string;
  lastActivity?: string;
  auraScore: number;
  tags: string[];
  healthColor?: string;
  // Relationship context for AI advisor
  acquaintanceDuration?: string;
  currentStage?: string;
  interactionFrequency?: string;
  recentNote?: string;
}

export interface FeedItem {
  id: string;
  relationshipId: string;
  type: "message" | "screenshot" | "voice" | "date-plan" | "gift-list" | "sos-reply";
  content: string;
  timestamp: string;
  evidence?: {
    screenshots?: string[];
    analysis: string;
    signals: string[];
    confidence: number;
    visionError?: string;
  };
  consultation?: {
    response: string;
    tone: "fox" | "dog" | "owl";
    suggestions?: string[];
  };
  datePlan?: {
    title: string;
    location: string;
    activities: string[];
    estimated_cost: string;
  };
  giftList?: {
    items: Array<{
      name: string;
      reason: string;
      price: string;
    }>;
  };
  sosReplies?: string[];
  isStreaming?: boolean;
  magicInputs?: Record<string, string>;
}

export interface Reflection {
  id: string;
  date: string;
  mood: string;
  content: string;
  insight: string;
  tags: string[];
}
