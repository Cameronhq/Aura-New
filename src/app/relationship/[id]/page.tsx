"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { useRelationshipStore } from "@/stores/relationshipStore";
import { FeedItem } from "@/components/relationship/FeedItem";
import { InputBar } from "@/components/relationship/InputBar";
import { MagicInputModal } from "@/components/relationship/MagicInputModal";
import { RelationshipBriefingModal } from "@/components/relationship/RelationshipBriefingModal";
import { ArrowLeft, User, SlidersHorizontal, MessageCircle } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const GradientBackground = dynamic(
  () =>
    import("@/components/shared/GradientBackground").then(
      (mod) => mod.GradientBackground
    ),
  { ssr: false }
);

type PendingAction = "date" | "gift" | "sos" | null;

export default function RelationshipDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const {
    relationship,
    feed,
    loadRelationship,
    addMessage,
    addScreenshot,
    addDatePlan,
    addGiftList,
    addSosReply,
    regenerateMagicItem,
  } = useRelationshipStore();

  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [showBriefing, setShowBriefing] = useState(false);

  useEffect(() => {
    loadRelationship(id);
  }, [id, loadRelationship]);

  // Auto-show briefing on first visit (no context filled yet)
  useEffect(() => {
    if (relationship && !relationship.acquaintanceDuration) {
      setShowBriefing(true);
    }
  }, [relationship?.id]);

  const handleSend = (text: string, images?: string[]) => {
    if (images && images.length > 0) {
      addScreenshot(images, text || undefined);
    } else {
      addMessage(text);
    }
  };

  const handleMenuSelect = (menuId: string) => {
    if (menuId === "date" || menuId === "gift" || menuId === "sos") {
      setPendingAction(menuId);
    } else if (menuId === "voice") {
      addMessage("开始语音复盘");
    } else {
      addMessage(menuId);
    }
  };

  const handleMagicSubmit = (inputs: Record<string, string>) => {
    if (pendingAction === "date") addDatePlan(inputs);
    else if (pendingAction === "gift") addGiftList(inputs);
    else if (pendingAction === "sos") addSosReply(inputs);
    setPendingAction(null);
  };

  if (!relationship) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-tertiary">加载中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 relative">
      <GradientBackground variant="dashboard" />

      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-white/10 bg-void/80 backdrop-blur-xl">
        <div className="max-w-lg mx-auto flex items-center gap-3 px-4 py-3">
          <Link
            href="/dashboard"
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-text-secondary" />
          </Link>

          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
              <User className="w-5 h-5 text-text-secondary" />
            </div>
            <div
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-void"
              style={{ backgroundColor: relationship.healthColor || "#a855f7" }}
            />
          </div>

          <div className="flex-1">
            <p className="text-text-primary font-medium text-sm">
              {relationship.name}
            </p>
            <p className="text-text-tertiary text-xs">
              {relationship.tags.join(" · ")}
            </p>
          </div>

          <button
            onClick={() => setShowBriefing(true)}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
            title="完善资料"
          >
            <SlidersHorizontal className="w-4 h-4 text-text-secondary" />
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {feed.map((item, index) => (
          <FeedItem
            key={item.id}
            item={item}
            index={index}
            onAdopt={() => {}}
            onRegenerate={(itemId) => regenerateMagicItem(itemId)}
          />
        ))}

        {feed.length === 0 && (
          <motion.div
            className="text-center py-16 px-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-7 h-7 text-text-tertiary" />
            </div>
            <p className="text-text-primary font-medium mb-2">军师已就位</p>
            <p className="text-text-tertiary text-sm leading-relaxed">
              把TA发的消息告诉军师，上传聊天截图，<br />或者直接描述你们之间发生了什么。
            </p>
          </motion.div>
        )}
      </div>

      <InputBar onSend={handleSend} onMenuSelect={handleMenuSelect} />

      <MagicInputModal
        action={pendingAction}
        onClose={() => setPendingAction(null)}
        onSubmit={handleMagicSubmit}
      />

      {showBriefing && (
        <RelationshipBriefingModal
          relationship={relationship}
          onClose={() => setShowBriefing(false)}
        />
      )}
    </div>
  );
}
