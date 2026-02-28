"use client";

import { useState } from "react";
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
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedItemProps {
  item: FeedItemType;
  index: number;
  onAdopt?: (itemId: string) => void;
  onRegenerate?: (itemId: string) => void;
}

const typeIcons: Record<string, React.ElementType> = {
  message: MessageCircle,
  screenshot: Image,
  "date-plan": Calendar,
  "gift-list": Gift,
  "sos-reply": AlertCircle,
};

const toneLabels: Record<string, string> = {
  fox: "🦊 狐狸模式",
  dog: "🐕 忠犬模式",
  owl: "🦉 猫头鹰模式",
};

const magicLoadingLabels: Record<string, string> = {
  "date-plan": "策划约会中...",
  "gift-list": "寻找礼物中...",
  "sos-reply": "生成回复中...",
};

function formatDatePlanText(item: FeedItemType): string {
  if (!item.datePlan) return "";
  const { title, location, activities, estimated_cost } = item.datePlan;
  return [
    `约会方案：${title}`,
    `地点：${location}`,
    `活动：${activities.join(" · ")}`,
    `预算：${estimated_cost}`,
  ].join("\n");
}

function formatGiftListText(item: FeedItemType): string {
  if (!item.giftList) return "";
  const lines = item.giftList.items.map(
    (g, i) => `${i + 1}. ${g.name}（${g.price}）— ${g.reason}`
  );
  return `礼物推荐：\n${lines.join("\n")}`;
}

export function FeedItem({ item, index, onAdopt, onRegenerate }: FeedItemProps) {
  const [adopted, setAdopted] = useState(false);
  const [copiedSos, setCopiedSos] = useState<number | null>(null);

  const Icon = typeIcons[item.type] || MessageCircle;
  const isConsultation = item.type === "date-plan" || item.type === "gift-list" || item.type === "sos-reply";
  const isMagicStreaming = isConsultation && item.isStreaming;

  const haptic = (ms = 40) => {
    try { navigator.vibrate?.(ms); } catch { /* not supported */ }
  };

  const handleAdopt = async () => {
    let text = "";
    if (item.datePlan) text = formatDatePlanText(item);
    else if (item.giftList) text = formatGiftListText(item);
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // clipboard may be unavailable in some environments
    }
    haptic();
    setAdopted(true);
    onAdopt?.(item.id);
    setTimeout(() => setAdopted(false), 2000);
  };

  const handleCopySos = async (reply: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(reply);
    } catch {
      // clipboard may be unavailable
    }
    haptic();
    setCopiedSos(idx);
    setTimeout(() => setCopiedSos(null), 2000);
  };

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
              {/* Screenshot image grid */}
              {item.type === "screenshot" && item.evidence?.screenshots && item.evidence.screenshots.length > 0 && (
                <div
                  className={cn(
                    "grid gap-2 mb-2",
                    item.evidence.screenshots.length === 1 ? "grid-cols-1" : "grid-cols-2"
                  )}
                >
                  {item.evidence.screenshots.map((src, i) => (
                    <div key={i} className="relative overflow-hidden rounded-xl">
                      <img
                        src={src}
                        alt=""
                        className="w-full max-h-48 object-cover rounded-xl"
                      />
                      {item.isStreaming && (
                        <div className="absolute inset-0 bg-void/50 animate-pulse rounded-xl" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Screenshot loading indicator */}
              {item.type === "screenshot" && item.isStreaming && (
                <div className="flex items-center gap-2 mb-2 text-text-tertiary text-xs">
                  <Loader2 className="w-3 h-3 animate-spin text-aurora-mid" />
                  <span>军师正在分析截图...</span>
                </div>
              )}

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

              {/* Analysis text (from vision AI) */}
              {item.evidence?.analysis && (
                <p className="text-text-secondary text-xs leading-relaxed mt-2">
                  {item.evidence.analysis}
                </p>
              )}

              {/* Signal tags */}
              {item.evidence?.signals && item.evidence.signals.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {item.evidence.signals.map((signal) => (
                    <span
                      key={signal}
                      className="px-2 py-0.5 rounded-full text-[10px] bg-aurora-start/15 text-aurora-end border border-aurora-start/20"
                    >
                      {signal}
                    </span>
                  ))}
                </div>
              )}

              {/* Vision unavailable banner */}
              {item.evidence?.visionError && (
                <div className="flex items-center gap-1.5 mt-2 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                  <EyeOff className="w-3 h-3 text-text-tertiary shrink-0" />
                  <span className="text-text-tertiary text-[10px]">图片内容无法识别 — 配置 ANTHROPIC_API_KEY 可启用截图分析</span>
                </div>
              )}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Consultation layer - AI response (streaming or done) */}
      {item.consultation && (
        <div className="ml-4 border-l-2 border-aurora-start/30 pl-3">
          <GlassCard
            padding="sm"
            className="bg-aurora-start/5 border-aurora-start/20"
          >
            <p className="text-text-primary text-sm leading-relaxed">
              {item.consultation.response}
              {item.isStreaming && (
                <motion.span
                  className="inline-block w-0.5 h-4 bg-aurora-mid ml-0.5 align-middle"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                />
              )}
            </p>
            {!item.isStreaming && item.consultation.response && (
              <p className="text-text-tertiary text-[10px] mt-2">
                {toneLabels[item.consultation.tone] || toneLabels.fox}
              </p>
            )}
          </GlassCard>
        </div>
      )}

      {/* Magic menu items: loading state */}
      {isMagicStreaming && (
        <GlassCard padding="sm" className="bg-white/5">
          <div className="flex items-center gap-2 text-text-secondary text-sm">
            <Loader2 className="w-4 h-4 animate-spin text-aurora-mid" />
            <span>{magicLoadingLabels[item.type] || "生成中..."}</span>
          </div>
        </GlassCard>
      )}

      {/* Date plan card */}
      {item.datePlan && !item.isStreaming && (
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
            <button
              onClick={handleAdopt}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-glow-cyan/20 text-glow-cyan text-xs hover:bg-glow-cyan/30 transition-colors"
            >
              <Check className="w-3 h-3" />
              {adopted ? "已复制" : "采纳"}
            </button>
            <button
              onClick={() => onRegenerate?.(item.id)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 text-text-secondary text-xs hover:bg-white/10 transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> 重新生成
            </button>
          </div>
        </GlassCard>
      )}

      {/* Gift list card */}
      {item.giftList && !item.isStreaming && (
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
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAdopt}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-glow-amber/20 text-glow-amber text-xs hover:bg-glow-amber/30 transition-colors"
            >
              <Check className="w-3 h-3" />
              {adopted ? "已复制" : "采纳"}
            </button>
            <button
              onClick={() => onRegenerate?.(item.id)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 text-text-secondary text-xs hover:bg-white/10 transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> 重新生成
            </button>
          </div>
        </GlassCard>
      )}

      {/* SOS replies */}
      {item.sosReplies && !item.isStreaming && (
        <GlassCard padding="sm" className="bg-glow-pink/5 border-glow-pink/20">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-glow-pink" />
            <span className="text-glow-pink text-sm font-medium">紧急回复</span>
          </div>
          <div className="space-y-2">
            {item.sosReplies.map((reply, i) => (
              <button
                key={i}
                onClick={() => handleCopySos(reply, i)}
                className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group flex items-center gap-2"
              >
                <p className="text-text-primary text-sm flex-1">{reply}</p>
                {copiedSos === i ? (
                  <Check className="w-3.5 h-3.5 text-glow-pink shrink-0" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                )}
              </button>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => onRegenerate?.(item.id)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 text-text-secondary text-xs hover:bg-white/10 transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> 重新生成
            </button>
          </div>
        </GlassCard>
      )}
    </motion.div>
  );
}
