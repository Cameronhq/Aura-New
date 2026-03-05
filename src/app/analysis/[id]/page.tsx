"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { useAppStore } from "@/stores/appStore";
import { AnalysisCard } from "@/components/AnalysisCard";
import { ChatPanel } from "@/components/ChatPanel";

function getScoreReaction(score: number): { emoji: string; text: string } {
  if (score <= 20) return { emoji: "💔", text: "形势不太妙…但知道真相比蒙在鼓里好" };
  if (score <= 40) return { emoji: "😮‍💨", text: "信号偏冷，但别急，军师帮你想办法" };
  if (score <= 55) return { emoji: "🤔", text: "不上不下的暧昧区，最让人纠结的阶段" };
  if (score <= 70) return { emoji: "😏", text: "有戏！TA 对你有好感的信号很明显" };
  if (score <= 85) return { emoji: "🥰", text: "好感度很高！是时候大胆推进了" };
  return { emoji: "🔥", text: "几乎可以确认！TA 对你有很强的兴趣" };
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-[#EEEEEC] overflow-hidden animate-pulse">
      <div className="h-1.5 bg-[#EEEEEC]" />
      <div className="px-6 pt-5 pb-3 flex justify-between">
        <div className="w-20 h-3 bg-[#EEEEEC] rounded" />
        <div className="w-16 h-4 bg-[#EEEEEC] rounded" />
      </div>
      <div className="flex justify-center py-6">
        <div className="w-[150px] h-[150px] rounded-full border-8 border-[#EEEEEC]" />
      </div>
      <div className="mx-6 mb-5 h-12 bg-[#F5F5F3] rounded-xl" />
      <div className="px-6 mb-5 space-y-2">
        <div className="w-16 h-3 bg-[#EEEEEC] rounded" />
        <div className="flex gap-2">
          <div className="w-24 h-7 bg-[#F5F5F3] rounded-full" />
          <div className="w-32 h-7 bg-[#F5F5F3] rounded-full" />
          <div className="w-20 h-7 bg-[#F5F5F3] rounded-full" />
        </div>
      </div>
      <div className="px-6 pb-5 space-y-2">
        <div className="w-16 h-3 bg-[#EEEEEC] rounded" />
        <div className="h-4 bg-[#F5F5F3] rounded w-full" />
        <div className="h-4 bg-[#F5F5F3] rounded w-3/4" />
      </div>
    </div>
  );
}

export default function AnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const analysis = useAppStore((s) => s.getAnalysis(params.id as string));
  const [ready, setReady] = useState(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "saving" | "done">("idle");
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleShare = useCallback(async () => {
    const el = document.getElementById("analysis-card");
    if (!el) return;

    setShareStatus("saving");

    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(el, {
        backgroundColor: "#FFFFFF",
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );

      if (!blob) throw new Error("Failed to create image");

      if (navigator.share && navigator.canShare?.({ files: [new File([blob], "analysis.png", { type: "image/png" })] })) {
        await navigator.share({
          files: [new File([blob], "感情军师分析.png", { type: "image/png" })],
          title: "感情军师 - 好感度分析",
        });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "感情军师分析.png";
        a.click();
        URL.revokeObjectURL(url);
      }

      setShareStatus("done");
      setTimeout(() => setShareStatus("idle"), 2000);
    } catch {
      setShareStatus("idle");
    }
  }, []);

  if (!analysis) {
    return (
      <div className="min-h-dvh bg-[#FAFAF8] flex flex-col items-center justify-center px-5">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-[#999] mb-4">分析记录未找到</p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-[#1A1A1A] text-white rounded-xl font-medium text-sm"
        >
          返回首页
        </button>
      </div>
    );
  }

  const reaction = getScoreReaction(analysis.result.score);

  return (
    <div className="min-h-dvh bg-[#FAFAF8]">
      <div className="max-w-lg mx-auto px-5 py-6 pb-safe">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1 text-sm text-[#999] hover:text-[#333] transition-colors active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            返回
          </button>
          <button
            onClick={() => router.push("/")}
            className="text-sm font-medium text-[#1A1A1A] hover:opacity-70 transition-opacity active:scale-95"
          >
            + 新分析
          </button>
        </div>

        {/* Score emotional reaction */}
        {ready && (
          <div className="mb-5 text-center animate-in fade-in duration-500">
            <span className="text-3xl">{reaction.emoji}</span>
            <p className="text-sm text-[#666] mt-1.5">{reaction.text}</p>
          </div>
        )}

        {/* Result Card — skeleton then real */}
        <div ref={cardRef}>
          {!ready ? (
            <SkeletonCard />
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
              <AnalysisCard
                result={analysis.result}
                personName={analysis.personName}
                personType={analysis.personType}
              />
            </div>
          )}
        </div>

        {/* Action buttons */}
        {ready && (
          <div className="mt-4 flex gap-3 animate-in fade-in duration-500" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
            <button
              onClick={handleShare}
              disabled={shareStatus === "saving"}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-[#EEEEEC] rounded-xl text-sm font-medium text-[#333] hover:border-[#999] transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {shareStatus === "saving" ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-[#999]" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="60" strokeDashoffset="15" strokeLinecap="round" />
                  </svg>
                  生成中...
                </>
              ) : shareStatus === "done" ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2D8A2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span className="text-[#2D8A2D]">已保存</span>
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                    <polyline points="16 6 12 2 8 6"/>
                    <line x1="12" y1="2" x2="12" y2="15"/>
                  </svg>
                  保存/分享卡片
                </>
              )}
            </button>
            <button
              onClick={() => {
                const text = `好感度 ${analysis.result.score}/100：${analysis.result.verdict}`;
                navigator.clipboard?.writeText(text);
              }}
              className="px-4 py-3 bg-white border border-[#EEEEEC] rounded-xl text-sm text-[#666] hover:border-[#999] transition-all active:scale-95"
              title="复制结论"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="my-8 flex items-center gap-3 animate-in fade-in duration-700" style={{ animationDelay: "400ms", animationFillMode: "both" }}>
          <div className="flex-1 h-px bg-[#EEEEEC]" />
          <span className="text-[11px] font-semibold tracking-[2px] text-[#BBB] uppercase">追问军师</span>
          <div className="flex-1 h-px bg-[#EEEEEC]" />
        </div>

        {/* Chat */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: "500ms", animationFillMode: "both" }}>
          <ChatPanel analysis={analysis} />
        </div>

        {/* Bottom spacer for mobile */}
        <div className="h-8" />
      </div>
    </div>
  );
}
