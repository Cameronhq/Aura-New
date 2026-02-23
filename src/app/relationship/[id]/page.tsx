"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { useRelationshipStore } from "@/stores/relationshipStore";
import { FeedItem } from "@/components/relationship/FeedItem";
import { InputBar } from "@/components/relationship/InputBar";
import { ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const GradientBackground = dynamic(
  () =>
    import("@/components/shared/GradientBackground").then(
      (mod) => mod.GradientBackground
    ),
  { ssr: false }
);

export default function RelationshipDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { relationship, feed, loadRelationship, addMessage, addScreenshot, addDatePlan, addGiftList, addSosReply } =
    useRelationshipStore();

  useEffect(() => {
    loadRelationship(id);
  }, [id, loadRelationship]);

  const handleSend = (text: string, images?: string[]) => {
    if (images && images.length > 0) {
      addScreenshot(images, text || undefined);
    } else {
      addMessage(text);
    }
  };

  const handleMenuSelect = (menuId: string) => {
    switch (menuId) {
      case "date":
        addDatePlan();
        break;
      case "gift":
        addGiftList();
        break;
      case "sos":
        addSosReply();
        break;
      case "voice":
        addMessage("开始语音复盘");
        break;
      default:
        addMessage(menuId);
    }
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
        </div>
      </div>

      {/* Feed */}
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {feed.map((item, index) => (
          <FeedItem key={item.id} item={item} index={index} />
        ))}

        {feed.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-text-tertiary text-sm">
              还没有任何记录。试试向军师提问吧。
            </p>
          </motion.div>
        )}
      </div>

      <InputBar onSend={handleSend} onMenuSelect={handleMenuSelect} />
    </div>
  );
}
