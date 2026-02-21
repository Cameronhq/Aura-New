"use client";

import { motion } from "motion/react";
import { GlassCard } from "@/components/shared/GlassCard";
import { FlaskConical, ChevronRight } from "lucide-react";

const tests = [
  {
    id: "attachment",
    title: "依恋类型深度测验",
    description: "AI 模拟心理咨询师，通过 5-10 轮对话探索你的依恋风格",
    emoji: "🔗",
    status: "available" as const,
  },
  {
    id: "mbti",
    title: "MBTI 恋爱人格分析",
    description: "不是做选择题，而是通过真实情境对话来分析你的恋爱人格",
    emoji: "🧠",
    status: "available" as const,
  },
  {
    id: "values",
    title: "价值观天平",
    description: "排序你在感情中最看重的关键词，找到真正的核心需求",
    emoji: "⚖️",
    status: "coming_soon" as const,
  },
];

export function DiscoveryLab() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <FlaskConical className="w-5 h-5 text-aurora-mid" />
        <h3 className="text-text-primary font-medium">自我探索实验室</h3>
      </div>

      <div className="space-y-3">
        {tests.map((test, index) => (
          <motion.button
            key={test.id}
            className="w-full text-left"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <GlassCard padding="sm" hover>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{test.emoji}</span>
                <div className="flex-1">
                  <p className="text-text-primary font-medium text-sm">
                    {test.title}
                  </p>
                  <p className="text-text-tertiary text-xs mt-0.5">
                    {test.description}
                  </p>
                </div>
                {test.status === "available" ? (
                  <ChevronRight className="w-4 h-4 text-text-tertiary" />
                ) : (
                  <span className="text-text-tertiary text-[10px] px-2 py-0.5 rounded-full bg-white/5">
                    即将上线
                  </span>
                )}
              </div>
            </GlassCard>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
