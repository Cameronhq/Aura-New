"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send } from "lucide-react";
import { useDashboardStore } from "@/stores/dashboardStore";

export function MirrorChatInput() {
  const [text, setText] = useState("");
  const [lastInsight, setLastInsight] = useState<string | null>(null);
  const { addReflection } = useDashboardStore();

  const handleSend = () => {
    if (!text.trim()) return;
    addReflection(text.trim());
    setText("");
    // Show a brief confirmation
    setLastInsight("已记录你的想法，军师正在倾听... ✨");
    setTimeout(() => setLastInsight(null), 3000);
  };

  return (
    <div className="mt-6">
      <AnimatePresence>
        {lastInsight && (
          <motion.div
            className="mb-3 p-3 rounded-xl bg-aurora-start/10 border border-aurora-start/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <p className="text-text-secondary text-xs">{lastInsight}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="和军师聊聊自己..."
          className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-aurora-mid/50 transition-colors"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="w-10 h-10 rounded-full bg-aurora-mid/20 flex items-center justify-center hover:bg-aurora-mid/30 transition-colors disabled:opacity-30"
        >
          <Send className="w-4 h-4 text-aurora-end" />
        </button>
      </div>
    </div>
  );
}
