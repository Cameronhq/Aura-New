"use client";

import { motion } from "motion/react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { GlassCard } from "@/components/shared/GlassCard";
import { User, Sparkles } from "lucide-react";

export function MirrorScreen() {
  return (
    <section className="min-h-screen flex items-center py-20 px-6">
      <div className="max-w-6xl mx-auto w-full">
        <AnimatedSection className="text-center mb-16">
          <span className="text-sm text-glow-pink tracking-widest uppercase mb-3 block">
            场景二 · 镜像
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-text-primary mb-4">
            情感镜像
          </h2>
          <p className="text-text-secondary max-w-md mx-auto">
            像照镜子一样看清自己。通过心理学对话探索依恋类型和核心价值观。
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left: Pain point - blurry mirror */}
          <AnimatedSection direction="left">
            <GlassCard className="relative overflow-hidden min-h-[320px] flex flex-col items-center justify-center">
              <div className="mb-4">
                <p className="text-text-tertiary text-xs mb-2 text-center">用户心声</p>
                <p className="text-glow-pink italic text-sm text-center">
                  &ldquo;为什么我总是爱上错的人？我是不是不值得被爱？&rdquo;
                </p>
              </div>

              {/* Blurry figure */}
              <div className="relative mt-6">
                <motion.div
                  className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center"
                  style={{ filter: "blur(4px)" }}
                >
                  <User className="w-12 h-12 text-text-tertiary" />
                </motion.div>

                {/* Crack lines */}
                <svg
                  className="absolute inset-0 w-24 h-24"
                  viewBox="0 0 96 96"
                >
                  <line x1="48" y1="0" x2="48" y2="96" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  <line x1="30" y1="20" x2="60" y2="80" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                  <line x1="20" y1="48" x2="76" y2="48" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                </svg>

                {/* Question marks */}
                <motion.span
                  className="absolute -top-2 -right-4 text-text-tertiary text-lg"
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ?
                </motion.span>
                <motion.span
                  className="absolute -bottom-2 -left-4 text-text-tertiary text-sm"
                  animate={{ opacity: [0.5, 0.2, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  ?
                </motion.span>
              </div>
            </GlassCard>
          </AnimatedSection>

          {/* Right: Aura solution - clear mirror */}
          <AnimatedSection direction="right">
            <GlassCard glow="pink" className="relative min-h-[320px] flex flex-col items-center justify-center">
              <motion.div
                className="flex items-center gap-3 mb-6"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="w-10 h-10 rounded-full bg-glow-pink/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-glow-pink" />
                </div>
                <span className="text-glow-pink text-sm font-medium">Aura 镜像</span>
              </motion.div>

              {/* Clear figure with crown */}
              <div className="relative mb-6">
                <motion.div
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-aurora-start/30 to-glow-pink/30 flex items-center justify-center border border-white/20"
                  initial={{ filter: "blur(8px)" }}
                  whileInView={{ filter: "blur(0px)" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <User className="w-12 h-12 text-text-primary" />
                </motion.div>
                {/* Glow halo */}
                <motion.div
                  className="absolute -inset-3 rounded-full border border-aurora-mid/30"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                {/* Crown */}
                <motion.span
                  className="absolute -top-5 left-1/2 -translate-x-1/2 text-xl"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  👑
                </motion.span>
              </div>

              {/* Labels */}
              <motion.div
                className="flex flex-wrap gap-2 justify-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.8 } },
                }}
              >
                {["#焦虑型依恋", "#付出型人格", "#高敏感", "#理想主义者"].map(
                  (tag) => (
                    <motion.span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs bg-glow-pink/15 text-glow-pink border border-glow-pink/25"
                      variants={{
                        hidden: { opacity: 0, scale: 0.8 },
                        visible: { opacity: 1, scale: 1 },
                      }}
                    >
                      {tag}
                    </motion.span>
                  )
                )}
              </motion.div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
