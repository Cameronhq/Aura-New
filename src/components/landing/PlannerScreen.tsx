"use client";

import { motion } from "motion/react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { GlassCard } from "@/components/shared/GlassCard";
import { Calendar, Gift, MapPin } from "lucide-react";

export function PlannerScreen() {
  return (
    <section className="min-h-screen flex items-center py-20 px-6">
      <div className="max-w-6xl mx-auto w-full">
        <AnimatedSection className="text-center mb-16">
          <span className="text-sm text-glow-amber tracking-widest uppercase mb-3 block">
            场景三 · 攻略
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-text-primary mb-4">
            完美约会策划
          </h2>
          <p className="text-text-secondary max-w-md mx-auto">
            基于 TA 的记忆库，一键生成绝不踩雷的约会方案和礼物清单。
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left: Pain point - calendar panic */}
          <AnimatedSection direction="left">
            <GlassCard className="relative overflow-hidden">
              <div className="mb-4">
                <p className="text-text-tertiary text-xs mb-2">用户心声</p>
                <p className="text-glow-amber italic text-sm">
                  &ldquo;下周纪念日，完全没想法，感觉又要搞砸了...&rdquo;
                </p>
              </div>

              {/* Calendar mock */}
              <div className="mt-6 grid grid-cols-7 gap-1 text-center text-xs text-text-tertiary">
                {["一", "二", "三", "四", "五", "六", "日"].map((d) => (
                  <span key={d} className="py-1 text-text-secondary">{d}</span>
                ))}
                {Array.from({ length: 28 }, (_, i) => {
                  const isTarget = i === 13;
                  return (
                    <motion.span
                      key={i}
                      className={`py-1.5 rounded-lg relative ${isTarget ? "text-white font-bold" : ""}`}
                    >
                      {i + 1}
                      {isTarget && (
                        <motion.span
                          className="absolute inset-0 rounded-lg bg-red-500/30 border border-red-400/50"
                          animate={{
                            boxShadow: [
                              "0 0 8px rgba(239,68,68,0.3)",
                              "0 0 20px rgba(239,68,68,0.6)",
                              "0 0 8px rgba(239,68,68,0.3)",
                            ],
                          }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </motion.span>
                  );
                })}
              </div>

              {/* Panic search */}
              <div className="mt-4 flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 text-sm text-text-tertiary">
                <span>🔍</span>
                <span>送什么礼物不挨骂</span>
              </div>
            </GlassCard>
          </AnimatedSection>

          {/* Right: Aura solution - plan */}
          <AnimatedSection direction="right">
            <GlassCard glow="cyan" className="relative">
              <motion.div
                className="flex items-center gap-3 mb-6"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="w-10 h-10 rounded-full bg-glow-cyan/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-glow-cyan" />
                </div>
                <span className="text-glow-cyan text-sm font-medium">Aura 策划</span>
              </motion.div>

              {/* Gift box animation */}
              <motion.div
                className="flex items-center gap-4 mb-4 p-3 rounded-xl bg-white/5"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  className="relative"
                  whileInView={{ rotate: [0, -5, 5, 0] }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <Gift className="w-8 h-8 text-glow-amber" />
                  {/* Sparkles */}
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="absolute w-1 h-1 rounded-full bg-glow-amber"
                      style={{
                        top: `${-4 + i * 3}px`,
                        left: `${8 + i * 6}px`,
                      }}
                      animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
                    />
                  ))}
                </motion.div>
                <div>
                  <p className="text-text-primary text-sm font-medium">拍立得相机</p>
                  <p className="text-text-tertiary text-xs">记录你们的专属瞬间 📸</p>
                </div>
              </motion.div>

              {/* Route plan */}
              <motion.div
                className="space-y-3"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.6 } },
                }}
              >
                {[
                  { time: "14:00", text: "798艺术区看展", icon: MapPin },
                  { time: "17:00", text: "隐藏餐厅（已帮你订位）", icon: MapPin },
                  { time: "19:00", text: "天台日落 + 蓝牙音箱", icon: MapPin },
                ].map((item) => (
                  <motion.div
                    key={item.time}
                    className="flex items-center gap-3 text-sm"
                    variants={{
                      hidden: { opacity: 0, x: 20 },
                      visible: { opacity: 1, x: 0 },
                    }}
                  >
                    <span className="text-glow-cyan text-xs font-mono">{item.time}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-glow-cyan" />
                    <span className="text-text-primary">{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
