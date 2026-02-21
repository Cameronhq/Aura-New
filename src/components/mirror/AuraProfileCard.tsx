"use client";

import { motion } from "motion/react";
import { GlassCard } from "@/components/shared/GlassCard";
import { useDashboardStore } from "@/stores/dashboardStore";
import { useEffect } from "react";
import { User, Sparkles } from "lucide-react";

export function AuraProfileCard() {
  const { user, loadDashboard } = useDashboardStore();

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (!user) return null;

  return (
    <GlassCard className="relative overflow-hidden">
      {/* Animated gradient header */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-r from-aurora-start via-aurora-mid to-glow-pink"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: "200% 200%" }}
      />

      <div className="relative z-10 pt-14 text-center">
        {/* Avatar */}
        <motion.div
          className="w-20 h-20 rounded-full bg-cosmos border-4 border-void flex items-center justify-center mx-auto mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <User className="w-10 h-10 text-text-primary" />
        </motion.div>

        <h2 className="text-text-primary font-bold text-xl">{user.nickname}</h2>
        <p className="text-text-secondary text-sm mt-1">
          {user.birthday && `${new Date().getFullYear() - parseInt(user.birthday.split("-")[0])}岁`}
        </p>

        {/* Aura labels */}
        <motion.div
          className="flex flex-wrap gap-2 justify-center mt-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {user.auraLabels.map((label) => (
            <motion.span
              key={label}
              className="px-3 py-1 rounded-full text-xs bg-aurora-start/20 text-aurora-end border border-aurora-start/30"
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 },
              }}
            >
              {label}
            </motion.span>
          ))}
        </motion.div>

        {/* Aura summary */}
        <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-aurora-mid" />
            <span className="text-text-secondary text-sm">灵气摘要</span>
          </div>
          <p className="text-text-primary text-sm leading-relaxed">
            你是一个高度敏感且富有共情力的人。在亲密关系中，你倾向于优先满足对方的需求，
            有时会忽略自己的感受。你正在学习建立更健康的边界。
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
