"use client";

import { motion } from "motion/react";
import { Logo } from "@/components/shared/Logo";
import { GradientButton } from "@/components/shared/GradientButton";
import { LightFollowEffect } from "./LightFollowEffect";

export function HeroScreen() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      <LightFollowEffect />

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <Logo size="lg" className="mb-6" />

        <motion.h2
          className="text-3xl md:text-5xl font-bold text-text-primary mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          你的 AI 情感军师
        </motion.h2>

        <motion.p
          className="text-base md:text-lg text-text-secondary mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          别再一个人猜来猜去了。
          <br className="hidden md:block" />
          听懂潜台词，看清亲密关系，在爱里找回掌控感。
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <GradientButton href="/register" size="lg">
            唤醒我的专属军师 ✨
          </GradientButton>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-aurora-mid"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
