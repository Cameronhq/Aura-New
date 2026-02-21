"use client";

import { motion } from "motion/react";
import { GlassCard } from "@/components/shared/GlassCard";
import { FeedItem as FeedItemType } from "@/types/relationship";
import {
  MessageCircle,
  Image,
  Calendar,
  Gift,
  AlertCircle,
  Copy,
  RefreshCw,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedItemProps {
  item: FeedItemType;
  index: number;
}

const typeIcons: Record<string, React.ElementType> = {
  message: MessageCircle,
  screenshot: Image,
  "date-plan": Calendar,
  "gift-list": Gift,
  "sos-reply": AlertCircle,
};

export function FeedItem({ item, index }: FeedItemProps) {
  const Icon = typeIcons[item.type] || MessageCircle;
  const isConsultation = item.type === "date-plan" || item.type === "gift-list" || item.type === "sos-reply";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={cn(
        "w-full",
        isConsultation ? "pl-4" : ""
      )}
    >
      {/* Evidence layer - user content */}
      {!isConsultation && (
        <GlassCard padding="sm" className="mb-2">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-stardust flex items-center justify-center shrink-0 mt-0.5">
              <Icon className="w-4 h-4 text-text-secondary" />
            </div>
            <div className="flex-1">
              <p className="text-text-primary text-sm leading-relaxed">
                {item.content}
              </p>
              <p className="text-text-tertiary text-[10px] mt-2">
                {new Date(item.timestamp).toLocaleString("zh-CN", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              {/* Signal tags */}
              {item.evidence?.signals && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {item.evidence.signals.map((signal) => (
                    <span
                      key={signal}
                      className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-text-tertiary border border-white/10"
                    >
                      {signal}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Consultation layer - AI response */}
      {item.consultation && (
        <div className="ml-4 border-l-2 border-aurora-start/30 pl-3">
          <GlassCard
            padding="sm"
            className="bg-aurora-start/5 border-aurora-start/20"
          >
            <p className="text-text-primary text-sm leading-relaxed">
              {item.consultation.response}
            </p>
          </GlassCard>
        </div>
      )}

      {/* Date plan card */}
      {item.datePlan && (
        <GlassCard padding="sm" className="bg-glow-cyan/5 border-glow-cyan/20">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-glow-cyan" />
            <span className="text-glow-cyan text-sm font-medium">
              {item.datePlan.title}
            </span>
          </div>
          <p className="text-text-secondary text-xs mb-3">
            📍 {item.datePlan.location}
          </p>
          <div className="space-y-2">
            {item.datePlan.activities.map((activity, i) => (
              <p key={i} className="text-text-primary text-sm">
                {activity}
              </p>
            ))}
          </div>
          <p className="text-text-tertiary text-xs mt-3">
            预算：{item.datePlan.estimated_cost}
          </p>
          <div className="flex gap-2 mt-3">
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-glow-cyan/20 text-glow-cyan text-xs hover:bg-glow-cyan/30 transition-colors">
              <Check className="w-3 h-3" /> 采纳
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 text-text-secondary text-xs hover:bg-white/10 transition-colors">
              <RefreshCw className="w-3 h-3" /> 重新生成
            </button>
          </div>
        </GlassCard>
      )}

      {/* Gift list card */}
      {item.giftList && (
        <GlassCard padding="sm" className="bg-glow-amber/5 border-glow-amber/20">
          <div className="flex items-center gap-2 mb-3">
            <Gift className="w-4 h-4 text-glow-amber" />
            <span className="text-glow-amber text-sm font-medium">礼物推荐</span>
          </div>
          <div className="space-y-3">
            {item.giftList.items.map((gift, i) => (
              <div key={i} className="p-2 rounded-lg bg-white/5">
                <div className="flex items-center justify-between">
                  <p className="text-text-primary text-sm font-medium">
                    {gift.name}
                  </p>
                  <span className="text-glow-amber text-xs">{gift.price}</span>
                </div>
                <p className="text-text-tertiary text-xs mt-1">{gift.reason}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* SOS replies */}
      {item.sosReplies && (
        <GlassCard padding="sm" className="bg-glow-pink/5 border-glow-pink/20">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-glow-pink" />
            <span className="text-glow-pink text-sm font-medium">紧急回复</span>
          </div>
          <div className="space-y-2">
            {item.sosReplies.map((reply, i) => (
              <button
                key={i}
                className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group flex items-center gap-2"
              >
                <p className="text-text-primary text-sm flex-1">{reply}</p>
                <Copy className="w-3.5 h-3.5 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </button>
            ))}
          </div>
        </GlassCard>
      )}
    </motion.div>
  );
}
