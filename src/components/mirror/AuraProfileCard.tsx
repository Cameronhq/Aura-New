"use client";

import { motion } from "motion/react";
import { GlassCard } from "@/components/shared/GlassCard";
import { useDashboardStore } from "@/stores/dashboardStore";
import { useEffect } from "react";
import { User, Sparkles, RefreshCw } from "lucide-react";

export function AuraProfileCard() {
  const { user, loadDashboard, auraProfile, isGeneratingProfile, generateAuraProfile } =
    useDashboardStore();

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (!user) return null;

  const vibeSummary: Record<string, string> = {
    fox: "你目光如炬，擅长洞察关系中的微妙信号。你的策略感让你在感情中总能保持清醒，但也要记得偶尔让直觉带路。",
    dog: "你温暖真诚，是身边人最可靠的支撑。你在感情中给予毫不吝啬，记得也要为自己留一份爱。",
    owl: "你智慧深邃，看待关系总能兼顾理性与感性。你的平衡感是你最大的礼物，也是对方最安心的港湾。",
  };

  // Use AI-generated labels if available, fall back to vibe defaults
  const displayLabels = auraProfile?.labels?.length ? auraProfile.labels : user.auraLabels;

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
          {displayLabels.map((label) => (
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
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-aurora-mid" />
              <span className="text-text-secondary text-sm">灵气摘要</span>
            </div>
            {/* Refresh button — only shown when a profile exists */}
            {auraProfile && (
              <button
                onClick={generateAuraProfile}
                disabled={isGeneratingProfile}
                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors disabled:opacity-40"
                title="更新灵气档案"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 text-text-tertiary ${isGeneratingProfile ? "animate-spin" : ""}`}
                />
              </button>
            )}
          </div>

          {isGeneratingProfile ? (
            <motion.p
              className="text-text-tertiary text-sm leading-relaxed"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              灵气分析中…
            </motion.p>
          ) : (
            <p className="text-text-primary text-sm leading-relaxed">
              {auraProfile?.summary || vibeSummary[user.consultantVibe] || vibeSummary.fox}
            </p>
          )}

          {auraProfile && (
            <p className="text-text-tertiary text-[10px] mt-2">
              {new Date(auraProfile.generatedAt).toLocaleDateString("zh-CN", {
                month: "short",
                day: "numeric",
              })} 更新
            </p>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
