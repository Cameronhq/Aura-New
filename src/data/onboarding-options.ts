import { SelectOption } from "@/types/common";

export const genderOptions: SelectOption[] = [
  { value: "cis-female", label: "顺性别女性" },
  { value: "cis-male", label: "顺性别男性" },
  { value: "trans-female", label: "跨性别女性" },
  { value: "trans-male", label: "跨性别男性" },
  { value: "non-binary", label: "非二元性别" },
  { value: "genderqueer", label: "性别酷儿" },
  { value: "genderfluid", label: "流动性别" },
  { value: "agender", label: "无性别" },
  { value: "other", label: "其他" },
];

export const orientationOptions: SelectOption[] = [
  { value: "straight", label: "异性恋" },
  { value: "gay", label: "同性恋" },
  { value: "lesbian", label: "女同性恋" },
  { value: "bisexual", label: "双性恋" },
  { value: "pansexual", label: "泛性恋" },
  { value: "asexual", label: "无性恋" },
  { value: "sapiosexual", label: "智性恋" },
  { value: "demisexual", label: "半性恋" },
  { value: "queer", label: "酷儿" },
  { value: "questioning", label: "探索中" },
];

export const statusOptions: SelectOption[] = [
  { value: "single", label: "单身", emoji: "🦋", description: "AI 侧重自我提升、桃花辨别、约会技巧" },
  { value: "crushing", label: "暧昧/接触中", emoji: "🌙", description: "AI 侧重潜台词分析、推进关系、表白时机判断" },
  { value: "dating", label: "恋爱中", emoji: "🌹", description: "AI 侧重关系维护、矛盾调解、约会灵感" },
  { value: "married", label: "已婚/长期伴侣", emoji: "💍", description: "AI 侧重激情重燃、家庭矛盾处理、深度沟通" },
  { value: "complicated", label: "关系复杂", emoji: "🌀", description: "AI 侧重局势分析、利弊权衡、心理博弈" },
  { value: "breakup", label: "刚分手/断联", emoji: "🍂", description: "AI 侧重情绪疗愈、复盘分析、走出阴影" },
];

export const vibeOptions: SelectOption[] = [
  { value: "fox", emoji: "🦊", label: "犀利理智", description: "别废话，告诉我真相和最优解。" },
  { value: "dog", emoji: "🐶", label: "温柔陪伴", description: "我需要安慰和情绪价值。" },
  { value: "owl", emoji: "🦉", label: "客观分析", description: "从心理学角度中立分析。" },
];
