"use client";

import { motion } from "motion/react";
import { GlassCard } from "@/components/shared/GlassCard";
import { useDashboardStore } from "@/stores/dashboardStore";
import { Clock } from "lucide-react";

const moodEmoji: Record<string, string> = {
  reflective: "🪞",
  anxious: "😰",
  hopeful: "🌟",
  confused: "🌀",
  calm: "🍃",
};

export function ReflectionTimeline() {
  const { reflections } = useDashboardStore();

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-glow-cyan" />
        <h3 className="text-text-primary font-medium">情感复盘记录</h3>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />

        <div className="space-y-4">
          {reflections.map((reflection, index) => (
            <motion.div
              key={reflection.id}
              className="relative pl-10"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Timeline dot */}
              <div className="absolute left-[11px] top-4 w-2.5 h-2.5 rounded-full bg-aurora-mid border-2 border-void" />

              <GlassCard padding="sm">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-sm">{moodEmoji[reflection.mood] || "💭"}</span>
                  <div className="flex-1">
                    <p className="text-text-tertiary text-xs">{reflection.date}</p>
                    <p className="text-text-primary text-sm mt-1 leading-relaxed">
                      {reflection.content}
                    </p>
                  </div>
                </div>

                {/* AI insight */}
                <div className="mt-3 p-3 rounded-lg bg-aurora-start/10 border border-aurora-start/20">
                  <p className="text-text-secondary text-xs leading-relaxed">
                    ✨ {reflection.insight}
                  </p>
                </div>

                <div className="flex gap-1.5 mt-2">
                  {reflection.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-text-tertiary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
