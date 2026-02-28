"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, X, Calendar, Gift, AlertCircle, Mic } from "lucide-react";

const menuItems = [
  { id: "date", icon: Calendar, label: "策划约会", emoji: "📅", color: "text-glow-cyan" },
  { id: "gift", icon: Gift, label: "挑选礼物", emoji: "🎁", color: "text-glow-amber" },
  { id: "sos", icon: AlertCircle, label: "紧急回复", emoji: "🆘", color: "text-glow-pink" },
  { id: "voice", icon: Mic, label: "语音复盘", emoji: "🎙️", color: "text-aurora-mid" },
];

interface MagicMenuProps {
  onSelect: (id: string) => void;
}

export function MagicMenu({ onSelect }: MagicMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Menu items */}
            <motion.div
              className="absolute bottom-16 left-0 z-50 space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  className="flex items-center gap-3 bg-nebula border border-white/15 rounded-2xl shadow-xl px-4 py-3 w-48 hover:bg-stardust transition-colors"
                  initial={{ opacity: 0, x: -20, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.8 }}
                  transition={{
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                  onClick={() => {
                    onSelect(item.id);
                    setIsOpen(false);
                  }}
                >
                  <span className="text-lg">{item.emoji}</span>
                  <span className="text-text-primary text-sm">{item.label}</span>
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        className="w-10 h-10 rounded-full bg-aurora-start flex items-center justify-center shadow-glow-purple z-50 relative"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <Plus className="w-5 h-5 text-white" />
        )}
      </motion.button>
    </div>
  );
}
