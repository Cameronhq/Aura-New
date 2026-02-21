"use client";

import { motion } from "motion/react";
import { GradientButton } from "@/components/shared/GradientButton";

export function FinalCTAScreen() {
  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center px-6 relative">
      {/* Ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[400px] h-[400px] rounded-full bg-aurora-mid/10 blur-[100px]" />
      </div>

      <div className="relative z-10 text-center max-w-lg mx-auto">
        <motion.h2
          className="text-2xl md:text-4xl font-bold text-text-primary mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          只有你懂自己，
          <br />
          爱才会有灵气。
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <GradientButton href="/register" size="lg">
            免费创建 Aura 档案 →
          </GradientButton>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        className="absolute bottom-6 text-text-tertiary text-xs"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
      >
        © 2024 Aura. Designed for Love.
      </motion.footer>
    </section>
  );
}
