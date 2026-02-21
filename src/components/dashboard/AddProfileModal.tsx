"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { GlassCard } from "@/components/shared/GlassCard";
import { useDashboardStore } from "@/stores/dashboardStore";
import { X } from "lucide-react";
import { Relationship } from "@/types/relationship";

const typeOptions = [
  { value: "crush", label: "暧昧对象", emoji: "🌙" },
  { value: "partner", label: "恋人", emoji: "🌹" },
  { value: "friend", label: "朋友", emoji: "🤝" },
  { value: "complicated", label: "关系复杂", emoji: "🌀" },
  { value: "ex", label: "前任", emoji: "🍂" },
] as const;

const healthColors: Record<string, string> = {
  crush: "#a855f7",
  partner: "#34d399",
  friend: "#22d3ee",
  complicated: "#fbbf24",
  ex: "#f472b6",
};

interface AddProfileModalProps {
  onClose: () => void;
}

export function AddProfileModal({ onClose }: AddProfileModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<Relationship["type"]>("crush");
  const [zodiac, setZodiac] = useState("");
  const [platform, setPlatform] = useState("");
  const { addRelationship } = useDashboardStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addRelationship({
      name: name.trim(),
      avatar: "",
      type,
      zodiac: zodiac || undefined,
      platform: platform || undefined,
      tags: [typeOptions.find((t) => t.value === type)?.label || ""],
      healthColor: healthColors[type],
    });
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <GlassCard padding="lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-text-primary font-bold text-lg">新建关系档案</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/15 transition-colors"
            >
              <X className="w-4 h-4 text-text-secondary" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-text-secondary text-sm mb-2">
                TA 的名字
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="怎么称呼 TA？"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-aurora-mid/50 transition-colors"
                autoFocus
                required
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-text-secondary text-sm mb-2">
                关系类型
              </label>
              <div className="grid grid-cols-3 gap-2">
                {typeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setType(option.value)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      type === option.value
                        ? "bg-aurora-start/20 border-aurora-mid/50 text-aurora-end border"
                        : "bg-white/5 border border-white/10 text-text-secondary hover:bg-white/8"
                    }`}
                  >
                    <span className="block text-base mb-1">{option.emoji}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Zodiac + Platform row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-text-secondary text-sm mb-2">
                  星座（可选）
                </label>
                <input
                  type="text"
                  value={zodiac}
                  onChange={(e) => setZodiac(e.target.value)}
                  placeholder="如：天蝎座"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-aurora-mid/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-text-secondary text-sm mb-2">
                  平台（可选）
                </label>
                <input
                  type="text"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  placeholder="如：微信"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-aurora-mid/50 transition-colors"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full btn-glow py-3 rounded-xl text-sm font-semibold disabled:opacity-50"
            >
              创建档案
            </button>
          </form>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
