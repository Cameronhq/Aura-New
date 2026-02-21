export interface User {
  id: string;
  email: string;
  nickname: string;
  birthday: string;
  gender: string;
  orientation: string;
  relationshipStatus: string;
  consultantVibe: "fox" | "dog" | "owl";
  auraLabels: string[];
  auraLevel?: number;
  auraTitle?: string;
  createdAt: string;
}

export interface OnboardingData {
  nickname: string;
  birthday: string;
  gender: string;
  orientation: string;
  relationshipStatus: string;
  consultantVibe: "fox" | "dog" | "owl" | null;
}
