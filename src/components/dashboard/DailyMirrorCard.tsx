"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GlassCard } from "@/components/shared/GlassCard";
import { useDashboardStore } from "@/stores/dashboardStore";
import { MessageCircle, Send, Sparkles } from "lucide-react";

export function DailyMirrorCard() {
  const { dailyQuestion, loadDashboard, submitMirrorAnswer } = useDashboardStore();
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [insight, setInsight] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleSubmit = () => {
    if (!answer.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const result = submitMirrorAnswer(answer.trim());
      setInsight(result);
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <GlassCard
      className="relative overflow-hidden min-h-[200px] flex flex-col justify-between"
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

      <AnimatePresence mode="wait">
        {insight ? (
          <motion.div
            key="insight"
            className="relative z-10 mt-4 p-4 rounded-xl bg-aurora-start/10 border border-aurora-start/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-aurora-mid" />
              <span className="text-aurora-end text-xs font-medium">灵气回响</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed">{insight}</p>
            <button
              onClick={() => {
                setInsight(null);
                setAnswer("");
                setIsInputOpen(false);
              }}
              className="mt-3 text-text-tertiary text-xs hover:text-text-secondary transition-colors"
            >
              关闭
            </button>
          </motion.div>
        ) : isInputOpen ? (
          <motion.div
            key="input"
            className="relative z-10 mt-4 space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="说说你的想法..."
              rows={3}
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-aurora-mid/50 transition-colors resize-none"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsInputOpen(false)}
                className="px-4 py-2 rounded-lg text-sm text-text-tertiary hover:text-text-secondary transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                disabled={!answer.trim() || isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-aurora-start/30 text-aurora-end text-sm font-medium hover:bg-aurora-start/40 transition-colors disabled:opacity-50"
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
            className="relative z-10 mt-6 text-left text-text-tertiary text-sm border border-white/10 rounded-xl px-4 py-3 hover:bg-white/5 transition-colors w-full"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setIsInputOpen(true)}
          >
            点击回答...
          </motion.button>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
