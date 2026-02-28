"use client";

import { useState } from "react";
import { MessageCircle, Compass } from "lucide-react";
import { AuraProfileCard } from "@/components/mirror/AuraProfileCard";
import { DiscoveryLab } from "@/components/mirror/DiscoveryLab";
import { ReflectionTimeline } from "@/components/mirror/ReflectionTimeline";
import { MirrorAdvisorChat } from "@/components/mirror/MirrorAdvisorChat";

type Tab = "chat" | "explore";

export default function MirrorPage() {
  const [tab, setTab] = useState<Tab>("chat");

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex bg-white/[0.06] rounded-2xl p-1 gap-1">
        <button
          onClick={() => setTab("chat")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
            tab === "chat"
              ? "bg-gradient-to-r from-aurora-start to-aurora-mid text-white shadow-lg shadow-aurora-start/30"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          灵气对话
        </button>
        <button
          onClick={() => setTab("explore")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
            tab === "explore"
              ? "bg-gradient-to-r from-aurora-start to-aurora-mid text-white shadow-lg shadow-aurora-start/30"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <Compass className="w-4 h-4" />
          探索自我
        </button>
      </div>

      {tab === "chat" ? (
        <>
          <AuraProfileCard />
          <MirrorAdvisorChat />
        </>
      ) : (
        <>
          <DiscoveryLab />
          <ReflectionTimeline />
        </>
      )}
    </div>
  );
}
