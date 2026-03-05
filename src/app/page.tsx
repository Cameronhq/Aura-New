"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UploadZone } from "@/components/UploadZone";
import { RecentList } from "@/components/RecentList";
import { useAppStore } from "@/stores/appStore";

const RELATIONSHIP_TYPES = [
  "暧昧对象",
  "男/女朋友",
  "前任",
  "Crush",
  "相亲对象",
  "朋友",
];

const DURATION_OPTIONS = [
  "刚认识",
  "1-3个月",
  "3-6个月",
  "半年-1年",
  "1年以上",
  "3年以上",
];

const LOADING_STAGES = [
  "正在识别对话内容...",
  "分析 TA 的回复语气...",
  "评估互动频率和主动性...",
  "计算好感度指数...",
  "生成分析报告...",
];

export default function HomePage() {
  const router = useRouter();
  const { addAnalysis, addMemoryItems, getMemoryForPerson } = useAppStore();

  const [images, setImages] = useState<string[]>([]);
  const [personName, setPersonName] = useState("");
  const [personType, setPersonType] = useState("");
  const [duration, setDuration] = useState("");
  const [concern, setConcern] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading) { setLoadingStage(0); return; }
    const timer = setInterval(() => {
      setLoadingStage((s) => (s < LOADING_STAGES.length - 1 ? s + 1 : s));
    }, 1800);
    return () => clearInterval(timer);
  }, [loading]);

  const canSubmit = images.length > 0 && personName.trim() && personType && !loading;

  const handleAnalyze = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError("");

    const memoryItems = getMemoryForPerson(personName.trim());
    const memoryContext = memoryItems.length
      ? memoryItems.map((m) => `- ${m.content}`).join("\n")
      : "";

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images,
          personName: personName.trim(),
          personType,
          duration,
          concern: concern.trim(),
          memoryContext,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "分析失败");

      const id = crypto.randomUUID();
      const analysis = {
        id,
        createdAt: Date.now(),
        personName: personName.trim(),
        personType,
        duration,
        concern: concern.trim(),
        result: {
          score: data.score,
          scoreLabel: data.scoreLabel,
          signals: data.signals,
          verdict: data.verdict,
          advice: data.advice,
          analysis: data.analysis,
        },
        chatHistory: [],
      };

      addAnalysis(analysis);

      if (data.newInsights?.length) {
        addMemoryItems(
          data.newInsights.map((content: string) => ({
            content,
            personName: personName.trim(),
          }))
        );
      }

      router.push(`/analysis/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "分析失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-[#FAFAF8]">
      <div className="max-w-lg mx-auto px-5 py-8 pb-safe">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-[#1A1A1A] tracking-tight">
            感情军师
          </h1>
          <p className="text-sm text-[#999] mt-1">
            上传聊天截图，AI 帮你看清 TA 的真实态度
          </p>
        </div>

        {/* Scenario hooks — only when no analyses exist and no images selected */}
        {images.length === 0 && useAppStore.getState().analyses.length === 0 && (
          <div className="mb-6 space-y-2">
            {[
              { text: "秒回消息但从不主动找你", score: 48, color: "#DC6B3F" },
              { text: "深夜给你发歌说「想到你了」", score: 82, color: "#2D8A2D" },
              { text: "聊天永远用「哈哈」收尾", score: 31, color: "#B91C1C" },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-[#EEEEEC]"
              >
                <span className="flex-1 text-[14px] text-[#666] leading-snug">
                  {item.text}
                </span>
                <span className="text-xs text-[#BBB] mr-1">好感度</span>
                <span
                  className="text-lg font-extrabold tabular-nums min-w-[2ch] text-right"
                  style={{ color: item.color }}
                >
                  {item.score}
                </span>
              </div>
            ))}
            <p className="text-center text-xs text-[#BBB] pt-1">
              你的情况是哪种？上传截图，军师帮你看清
            </p>
          </div>
        )}

        {/* Upload */}
        <UploadZone
          images={images}
          onImagesSelected={setImages}
          onClear={() => setImages([])}
        />

        {/* Context Form — appears after images selected */}
        {images.length > 0 && (
          <div className="mt-5 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <label className="text-[11px] font-semibold tracking-[2px] text-[#999] uppercase block mb-2">
                这是和谁的对话？
              </label>
              <input
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder="输入 TA 的名字或昵称"
                className="w-full px-4 py-3 bg-white border border-[#EEEEEC] rounded-xl text-[15px] placeholder:text-[#CCC] focus:outline-none focus:border-[#999] transition-colors"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold tracking-[2px] text-[#999] uppercase block mb-2">
                你们的关系
              </label>
              <div className="flex flex-wrap gap-2">
                {RELATIONSHIP_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setPersonType(type)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      personType === type
                        ? "bg-[#1A1A1A] text-white"
                        : "bg-white border border-[#EEEEEC] text-[#666] hover:border-[#999]"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold tracking-[2px] text-[#999] uppercase block mb-2">
                认识/在一起多久了
              </label>
              <div className="flex flex-wrap gap-2">
                {DURATION_OPTIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                      duration === d
                        ? "bg-[#1A1A1A] text-white"
                        : "bg-white border border-[#EEEEEC] text-[#666] hover:border-[#999]"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold tracking-[2px] text-[#999] uppercase block mb-2">
                你最想了解什么？（选填）
              </label>
              <input
                value={concern}
                onChange={(e) => setConcern(e.target.value)}
                placeholder="例：TA 是不是不爱我了 / 该不该主动 / 这样回复正常吗"
                className="w-full px-4 py-3 bg-white border border-[#EEEEEC] rounded-xl text-[15px] placeholder:text-[#CCC] focus:outline-none focus:border-[#999] transition-colors"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-xl">{error}</p>
            )}

            {loading ? (
              <div className="w-full py-6 bg-[#1A1A1A] rounded-xl flex flex-col items-center gap-3">
                <div className="flex gap-1.5">
                  {[0,1,2].map((i) => (
                    <span key={i} className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
                <span key={loadingStage} className="text-white/90 text-sm animate-in fade-in duration-500">
                  {LOADING_STAGES[loadingStage]}
                </span>
              </div>
            ) : (
              <button
                onClick={handleAnalyze}
                disabled={!canSubmit}
                className="w-full py-4 bg-[#1A1A1A] text-white font-bold text-base rounded-xl disabled:opacity-30 transition-opacity active:scale-[0.98]"
              >
                开始分析
              </button>
            )}
          </div>
        )}

        {/* Recent Analyses */}
        <div className="mt-10">
          <RecentList onReanalyze={(name, type) => {
            setPersonName(name);
            setPersonType(type);
            setImages([]);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }} />
        </div>
      </div>
    </div>
  );
}
