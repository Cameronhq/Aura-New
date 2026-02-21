"use client";

import { motion } from "motion/react";
import { GlassCard } from "@/components/shared/GlassCard";
import { useDashboardStore } from "@/stores/dashboardStore";
import { useEffect } from "react";
import { MessageCircle } from "lucide-react";

export function DailyMirrorCard() {
  const { dailyQuestion, loadDashboard } = useDashboardStore();

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <GlassCard
      className="relative overflow-hidden min-h-[200px] flex flex-col justify-between"
      glow="purple"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-aurora-start/10 via-transparent to-glow-pink/5 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-aurora-start/20 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-aurora-mid" />
          </div>
          <span className="text-text-secondary text-sm">每日镜像</span>
        </div>

        <motion.p
          className="text-text-primary text-lg md:text-xl font-medium leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {dailyQuestion || "今天，你想和自己聊聊什么？"}
        </motion.p>
      </div>

      <motion.button
        className="relative z-10 mt-6 text-left text-text-tertiary text-sm border border-white/10 rounded-xl px-4 py-3 hover:bg-white/5 transition-colors"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        点击回答...
      </motion.button>
    </GlassCard>
  );
}
