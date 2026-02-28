"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { GlassCard } from "@/components/shared/GlassCard";
import { useDashboardStore } from "@/stores/dashboardStore";
import { MessageCircle, Send } from "lucide-react";

export function DailyMirrorCard() {
  const { dailyQuestion, loadDashboard, submitMirrorAnswer } = useDashboardStore();
  const router = useRouter();
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setIsSubmitting(true);
    await submitMirrorAnswer(answer.trim());
    setIsSubmitting(false);
    router.push("/dashboard/mirror");
  };

  return (
    <GlassCard
      className="relative overflow-hidden"
      glow="purple"
    >
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

      {/* Fixed-height input slot — card never resizes */}
      <div className="relative z-10 mt-4 h-[88px]">
        <AnimatePresence mode="wait">
          {isInputOpen ? (
            <motion.div
              key="input"
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="说说你的想法..."
                rows={2}
                autoFocus
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-aurora-mid/50 transition-colors resize-none"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsInputOpen(false)}
                  className="px-4 py-1.5 rounded-lg text-sm text-text-tertiary hover:text-text-secondary transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!answer.trim() || isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg bg-aurora-start/30 text-aurora-end text-sm font-medium hover:bg-aurora-start/40 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      军师思考中...
                    </motion.span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      提交
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="trigger"
              className="w-full h-[88px] text-left text-text-tertiary text-sm border border-white/10 rounded-xl px-4 py-3 hover:bg-white/5 transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setIsInputOpen(true)}
            >
              点击回答...
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
}
