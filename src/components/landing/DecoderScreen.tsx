"use client";

import { motion } from "motion/react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { GlassCard } from "@/components/shared/GlassCard";
import { ChatBubble } from "./ChatBubble";
import { Search } from "lucide-react";

export function DecoderScreen() {
  return (
    <section className="min-h-screen flex items-center py-20 px-6">
      <div className="max-w-6xl mx-auto w-full">
        {/* Section title */}
        <AnimatedSection className="text-center mb-16">
          <span className="text-sm text-aurora-mid tracking-widest uppercase mb-3 block">
            场景一 · 翻译
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-text-primary mb-4">
            潜台词翻译官
          </h2>
          <p className="text-text-secondary max-w-md mx-auto">
            上传聊天截图，秒懂真实情绪和隐藏意图。拒绝内耗，精准拿捏。
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left: Pain point */}
          <AnimatedSection direction="left">
            <GlassCard className="relative overflow-hidden">
              {/* User quote */}
              <div className="mb-6">
                <p className="text-text-tertiary text-xs mb-2">用户心声</p>
                <p className="text-glow-pink italic text-sm">
                  &ldquo;回消息这么慢，只回几个字，他是不是不喜欢我了？&rdquo;
                </p>
              </div>

              {/* Chat mock */}
              <div className="space-y-3">
                <ChatBubble text="今晚有空吗？想见你" isRight delay={0.1} />
                <ChatBubble text="嗯" delay={0.3} />
                <ChatBubble text="那去哪里好？你想吃什么？" isRight delay={0.5} />
                <ChatBubble text="我都行，看你吧" delay={0.7} />
              </div>

              {/* Messy lines overlay */}
              <motion.div
                className="absolute top-4 right-4 w-16 h-16 opacity-30"
                initial={{ rotate: 0 }}
                whileInView={{ rotate: 360 }}
                viewport={{ once: true }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <svg viewBox="0 0 64 64" className="text-glow-pink">
                  <path
                    d="M10 32 C 20 10, 44 10, 54 32 S 44 54, 10 32"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    opacity="0.5"
                  />
                  <path
                    d="M32 10 C 54 20, 54 44, 32 54 S 10 44, 32 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    opacity="0.3"
                  />
                </svg>
              </motion.div>
            </GlassCard>
          </AnimatedSection>

          {/* Right: Aura solution */}
          <AnimatedSection direction="right">
            <GlassCard glow="purple" className="relative">
              {/* Magnifying glass icon */}
              <motion.div
                className="flex items-center gap-3 mb-6"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="w-10 h-10 rounded-full bg-aurora-start/20 flex items-center justify-center">
                  <Search className="w-5 h-5 text-aurora-mid" />
                </div>
                <span className="text-aurora-end text-sm font-medium">Aura 解读</span>
              </motion.div>

              {/* Analysis result */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <p className="text-text-primary leading-relaxed">
                  他其实希望你做主，但需要你给他一个台阶。
                </p>
                <div className="flex flex-wrap gap-2">
                  {["被动沟通", "期待主导", "安全感测试"].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs bg-aurora-start/20 text-aurora-end border border-aurora-start/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="pt-3 border-t border-white/10">
                  <p className="text-text-secondary text-sm leading-relaxed">
                    💡 试试直接说「那我来安排，你只要出现就好」——给他一个既不费力又有参与感的角色。
                  </p>
                </div>
              </motion.div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
