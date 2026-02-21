"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  text: string;
  isRight?: boolean;
  className?: string;
  delay?: number;
}

export function ChatBubble({ text, isRight = false, className, delay = 0 }: ChatBubbleProps) {
  return (
    <motion.div
      className={cn(
        "max-w-[240px] px-4 py-2.5 rounded-2xl text-sm",
        isRight
          ? "bg-aurora-start/30 text-text-primary ml-auto rounded-br-sm"
          : "bg-white/10 text-text-secondary rounded-bl-sm",
        className
      )}
      initial={{ opacity: 0, y: 10, rotate: isRight ? 3 : -3 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {text}
    </motion.div>
  );
}
