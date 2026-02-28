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

const zodiacOptions = [
  "白羊座", "金牛座", "双子座", "巨蟹座",
  "狮子座", "处女座", "天秤座", "天蝎座",
  "射手座", "摩羯座", "水瓶座", "双鱼座",
];

const platformPresets = ["Tinder", "Hinge", "Bumble", "她说", "线下", "朋友介绍", "自定义"];

function getBirthdayZodiac(dateStr: string): string {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "白羊座";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "金牛座";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "双子座";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "巨蟹座";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "狮子座";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "处女座";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "天秤座";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "天蝎座";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "射手座";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "摩羯座";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "水瓶座";
  return "双鱼座";
}

interface AddProfileModalProps {
  onClose: () => void;
}

export function AddProfileModal({ onClose }: AddProfileModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<Relationship["type"]>("crush");
  const [birthday, setBirthday] = useState("");
  const [zodiac, setZodiac] = useState("");
  const [showZodiacPicker, setShowZodiacPicker] = useState(false);
  const [platform, setPlatform] = useState("");
  const [selectedPlatformPreset, setSelectedPlatformPreset] = useState("");
  const [customPlatform, setCustomPlatform] = useState("");
  const { addRelationship } = useDashboardStore();

  const handleBirthdayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setBirthday(val);
    if (val) setZodiac(getBirthdayZodiac(val));
  };

  const handlePlatformPreset = (preset: string) => {
    setSelectedPlatformPreset(preset);
    if (preset !== "自定义") {
      setPlatform(preset);
      setCustomPlatform("");
    } else {
      setPlatform("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalPlatform = selectedPlatformPreset === "自定义" ? customPlatform : platform;

    addRelationship({
      name: name.trim(),
      avatar: "",
      type,
      birthday: birthday || undefined,
      zodiac: zodiac || undefined,
      platform: finalPlatform || undefined,
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
        className="relative z-10 w-full max-w-md max-h-[90vh] overflow-y-auto"
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

            {/* Birthday → Zodiac */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-text-secondary text-sm">TA 的生日（可选）</label>
                <button
                  type="button"
                  onClick={() => setShowZodiacPicker(!showZodiacPicker)}
                  className="text-xs text-aurora-mid hover:text-aurora-end transition-colors"
                >
                  {showZodiacPicker ? "用生日推算 ↑" : "不知道生日？选星座 ▾"}
                </button>
              </div>

              {!showZodiacPicker ? (
                <div className="flex gap-2 items-center">
                  <input
                    type="date"
                    value={birthday}
                    onChange={handleBirthdayChange}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-aurora-mid/50 transition-colors"
                  />
                  {zodiac && (
                    <span className="text-sm text-aurora-end bg-aurora-start/10 border border-aurora-start/20 rounded-lg px-3 py-2 whitespace-nowrap">
                      {zodiac}
                    </span>
                  )}
                </div>
              ) : (
                <select
                  value={zodiac}
                  onChange={(e) => setZodiac(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-aurora-mid/50 transition-colors"
                >
                  <option value="">选择星座</option>
                  {zodiacOptions.map((z) => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
              )}
            </div>

            {/* 认识途径 chip grid */}
            <div>
              <label className="block text-text-secondary text-sm mb-2">
                认识途径（可选）
              </label>
              <div className="flex flex-wrap gap-2">
                {platformPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePlatformPreset(preset)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      selectedPlatformPreset === preset
                        ? "bg-aurora-start/20 border-aurora-mid/50 text-aurora-end"
                        : "bg-white/5 border-white/10 text-text-secondary hover:bg-white/8"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
              {selectedPlatformPreset === "自定义" && (
                <input
                  type="text"
                  value={customPlatform}
                  onChange={(e) => setCustomPlatform(e.target.value)}
                  placeholder="输入认识途径..."
                  className="mt-2 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-aurora-mid/50 transition-colors"
                />
              )}
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
