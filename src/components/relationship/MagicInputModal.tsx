"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, Gift, AlertCircle } from "lucide-react";

type ActionType = "date" | "gift" | "sos";

interface MagicInputModalProps {
  action: ActionType | null;
  onClose: () => void;
  onSubmit: (inputs: Record<string, string>) => void;
}

const actionConfig = {
  date: {
    icon: Calendar,
    color: "text-glow-cyan",
    bgColor: "bg-glow-cyan/10",
    borderColor: "border-glow-cyan/30",
    title: "策划约会",
    subtitle: "告诉军师更多细节，生成专属约会方案",
    fields: [
      {
        key: "occasion",
        label: "什么场合？",
        placeholder: "初次约会 / 纪念日 / 日常约会",
        required: false,
        type: "text" as const,
      },
      {
        key: "budget",
        label: "预算范围？",
        placeholder: "例如：200-500元",
        required: false,
        type: "text" as const,
      },
      {
        key: "preference",
        label: "活动偏好？",
        placeholder: "室内 / 户外 / 不限",
        required: false,
        type: "text" as const,
      },
    ],
  },
  gift: {
    icon: Gift,
    color: "text-glow-amber",
    bgColor: "bg-glow-amber/10",
    borderColor: "border-glow-amber/30",
    title: "挑选礼物",
    subtitle: "了解更多信息，推荐最贴心的礼物",
    fields: [
      {
        key: "occasion",
        label: "什么场合？",
        placeholder: "生日 / 纪念日 / 节日 / 日常",
        required: false,
        type: "text" as const,
      },
      {
        key: "interests",
        label: "TA 有什么兴趣爱好？",
        placeholder: "例如：喜欢音乐、读书、运动...",
        required: false,
        type: "text" as const,
      },
      {
        key: "budget",
        label: "预算范围？",
        placeholder: "例如：100-300元",
        required: false,
        type: "text" as const,
      },
    ],
  },
  sos: {
    icon: AlertCircle,
    color: "text-glow-pink",
    bgColor: "bg-glow-pink/10",
    borderColor: "border-glow-pink/30",
    title: "紧急回复",
    subtitle: "粘贴 TA 发的内容，军师帮你想好回复",
    fields: [
      {
        key: "message",
        label: "TA 发了什么？",
        placeholder: "粘贴原文...",
        required: true,
        type: "textarea" as const,
      },
      {
        key: "goal",
        label: "你希望达到什么效果？",
        placeholder: "例如：缓和气氛、表达关心、婉拒...",
        required: false,
        type: "text" as const,
      },
    ],
  },
};

export function MagicInputModal({ action, onClose, onSubmit }: MagicInputModalProps) {
  const [inputs, setInputs] = useState<Record<string, string>>({});

  const config = action ? actionConfig[action] : null;
  const Icon = config?.icon;

  const requiredFields = config?.fields.filter((f) => f.required) || [];
  const isSubmitEnabled = requiredFields.every((f) => inputs[f.key]?.trim());

  const handleSubmit = () => {
    if (!isSubmitEnabled) return;
    onSubmit(inputs);
    setInputs({});
    onClose();
  };

  return (
    <AnimatePresence>
      {action && config && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 max-w-lg mx-auto"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="bg-nebula border border-white/10 rounded-t-3xl px-5 pt-5 pb-8">
              {/* Handle */}
              <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />

              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  {Icon && (
                    <div className={`w-9 h-9 rounded-xl ${config.bgColor} border ${config.borderColor} flex items-center justify-center`}>
                      <Icon className={`w-4.5 h-4.5 ${config.color}`} />
                    </div>
                  )}
                  <div>
                    <h3 className="text-text-primary font-semibold text-base">{config.title}</h3>
                    <p className="text-text-tertiary text-xs mt-0.5">{config.subtitle}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4 text-text-secondary" />
                </button>
              </div>

              {/* Fields */}
              <div className="space-y-4 mb-6">
                {config.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-text-secondary text-sm mb-1.5">
                      {field.label}
                      {field.required && <span className="text-glow-pink ml-1">*</span>}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        value={inputs[field.key] || ""}
                        onChange={(e) =>
                          setInputs((prev) => ({ ...prev, [field.key]: e.target.value }))
                        }
                        placeholder={field.placeholder}
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-aurora-mid/50 transition-colors resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={inputs[field.key] || ""}
                        onChange={(e) =>
                          setInputs((prev) => ({ ...prev, [field.key]: e.target.value }))
                        }
                        placeholder={field.placeholder}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-aurora-mid/50 transition-colors"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!isSubmitEnabled}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-aurora-start to-aurora-mid text-white font-medium text-sm shadow-lg shadow-aurora-start/30 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                开始生成
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
