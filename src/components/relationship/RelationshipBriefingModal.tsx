"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles } from "lucide-react";
import { useDashboardStore } from "@/stores/dashboardStore";
import { Relationship } from "@/types/relationship";

const durationOptions = ["刚认识", "1-3个月", "半年以上", "一年以上"];
const stageOptions = ["互相试探中", "开始约会", "已确认关系", "稳定交往"];
const frequencyOptions = ["每天都聊", "几天一次", "偶尔联系"];

interface Props {
  relationship: Relationship;
  onClose: () => void;
}

function ChipGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-text-secondary text-sm mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt === value ? "" : opt)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              value === opt
                ? "bg-aurora-start/20 border-aurora-mid/50 text-aurora-end"
                : "bg-white/5 border-white/10 text-text-secondary hover:bg-white/10"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export function RelationshipBriefingModal({ relationship, onClose }: Props) {
  const { updateRelationship } = useDashboardStore();

  const [duration, setDuration] = useState(relationship.acquaintanceDuration || "");
  const [stage, setStage] = useState(relationship.currentStage || "");
  const [frequency, setFrequency] = useState(relationship.interactionFrequency || "");
  const [note, setNote] = useState(relationship.recentNote || "");

  const hasAnyInput = duration || stage || frequency || note.trim();

  const handleSave = () => {
    updateRelationship(relationship.id, {
      acquaintanceDuration: duration || undefined,
      currentStage: stage || undefined,
      interactionFrequency: frequency || undefined,
      recentNote: note.trim() || undefined,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60" onClick={onClose} />

        {/* Sheet */}
        <motion.div
          className="relative z-10 w-full max-w-lg rounded-t-2xl bg-nebula border border-white/10 max-h-[85vh] overflow-y-auto"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-white/20" />
          </div>

          <div className="px-5 pb-8 pt-2 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-aurora-mid" />
                <h3 className="text-text-primary font-semibold">
                  告诉军师关于{relationship.name}的情况
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/15 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-text-secondary" />
              </button>
            </div>

            <p className="text-text-tertiary text-xs leading-relaxed -mt-2">
              这些信息会帮助军师给出更贴切的建议，全部可选
            </p>

            <ChipGroup
              label="认识多久了？"
              options={durationOptions}
              value={duration}
              onChange={setDuration}
            />

            <ChipGroup
              label="目前处于什么阶段？"
              options={stageOptions}
              value={stage}
              onChange={setStage}
            />

            <ChipGroup
              label="联系频率如何？"
              options={frequencyOptions}
              value={frequency}
              onChange={setFrequency}
            />

            {/* Recent note */}
            <div>
              <p className="text-text-secondary text-sm mb-2">最近发生了什么？（可选）</p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="比如：我们上周吵了一架，最近TA回消息变慢了..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-aurora-mid/50 transition-colors resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-sm text-text-secondary border border-white/10 hover:bg-white/5 transition-colors"
              >
                稍后再说
              </button>
              <button
                onClick={handleSave}
                disabled={!hasAnyInput}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold btn-glow disabled:opacity-40 disabled:cursor-not-allowed"
              >
                保存资料
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
