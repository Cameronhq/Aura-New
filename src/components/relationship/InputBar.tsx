"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ImageIcon, Send } from "lucide-react";
import { MagicMenu } from "./MagicMenu";

interface InputBarProps {
  onSend: (text: string) => void;
  onMenuSelect: (id: string) => void;
}

export function InputBar({ onSend, onMenuSelect }: InputBarProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-void/90 backdrop-blur-xl">
      <div className="max-w-lg mx-auto flex items-end gap-2 px-3 py-3 pb-safe">
        {/* Magic menu */}
        <MagicMenu onSelect={onMenuSelect} />

        {/* Text input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="向军师提问..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-aurora-mid/50 transition-colors pr-10"
          />
        </div>

        {/* Image upload */}
        <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors shrink-0">
          <ImageIcon className="w-5 h-5 text-text-tertiary" />
        </button>

        {/* Send */}
        {text.trim() && (
          <motion.button
            className="w-10 h-10 rounded-full bg-aurora-start flex items-center justify-center shrink-0"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
          >
            <Send className="w-4 h-4 text-white" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
