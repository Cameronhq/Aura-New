"use client";

import { ScoreGauge } from "./ScoreGauge";
import type { AnalysisResult } from "@/types";

interface AnalysisCardProps {
  result: AnalysisResult;
  personName: string;
  personType: string;
}

function getAccentGradient(score: number): string {
  if (score <= 30) return "from-red-50 to-orange-50";
  if (score <= 55) return "from-amber-50 to-yellow-50";
  if (score <= 75) return "from-lime-50 to-green-50";
  return "from-emerald-50 to-teal-50";
}

export function AnalysisCard({ result, personName, personType }: AnalysisCardProps) {
  return (
    <div id="analysis-card" className="bg-white rounded-2xl border border-[#EEEEEC] overflow-hidden shadow-sm">
      {/* Colored accent top bar */}
      <div className={`h-1.5 bg-gradient-to-r ${getAccentGradient(result.score)}`} />

      {/* Header */}
      <div className="px-6 pt-5 pb-3 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[3px] text-[#BBB] uppercase">
            好感度分析
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-[#1A1A1A]">{personName}</p>
          <p className="text-[11px] text-[#999]">{personType}</p>
        </div>
      </div>

      {/* Score — the hero */}
      <div className="flex flex-col items-center py-4">
        <ScoreGauge score={result.score} size={150} />
        <p className="mt-3 text-sm font-medium text-[#666]">{result.scoreLabel}</p>
      </div>

      {/* Verdict — centered, bold */}
      <div className="mx-6 mb-5 py-3.5 px-4 bg-[#FAFAF8] rounded-xl text-center">
        <p className="font-bold text-[#1A1A1A] text-[17px] leading-snug">{result.verdict}</p>
      </div>

      {/* Signals — pill tags */}
      <div className="px-6 mb-5">
        <p className="text-[11px] font-semibold tracking-[2px] text-[#999] mb-2.5">关键信号</p>
        <div className="flex flex-wrap gap-2">
          {result.signals.map((signal, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F5F3] rounded-full text-[13px] text-[#333]"
            >
              <span className="w-1 h-1 rounded-full bg-[#999]" />
              {signal}
            </span>
          ))}
        </div>
      </div>

      {/* Advice — highlighted */}
      <div className="mx-6 mb-5 p-4 bg-[#FAFAF8] rounded-xl border-l-[3px] border-[#1A1A1A]">
        <p className="text-[11px] font-semibold tracking-[2px] text-[#999] mb-1.5">军师建议</p>
        <p className="text-[15px] leading-relaxed text-[#333]">{result.advice}</p>
      </div>

      {/* Analysis — detailed */}
      <div className="px-6 pb-5">
        <p className="text-[11px] font-semibold tracking-[2px] text-[#999] mb-2">详细分析</p>
        <p className="text-[13px] leading-relaxed text-[#666]">{result.analysis}</p>
      </div>

      {/* Watermark footer */}
      <div className="border-t border-[#EEEEEC] px-6 py-3 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-[#1A1A1A] tracking-tight">感情军师</span>
        <span className="text-[10px] text-[#CCC]">AI 好感度分析 · junshi.app</span>
      </div>
    </div>
  );
}
