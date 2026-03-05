export interface AnalysisResult {
  score: number;
  scoreLabel: string;
  signals: string[];
  verdict: string;
  advice: string;
  analysis: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface Analysis {
  id: string;
  createdAt: number;
  personName: string;
  personType: string;
  duration?: string;
  concern?: string;
  result: AnalysisResult;
  chatHistory: ChatMessage[];
}

export interface MemoryItem {
  id: string;
  content: string;
  personName?: string;
  createdAt: number;
}
