"use client";

import Link from "next/link";
import { useAppStore } from "@/stores/appStore";

interface RecentListProps {
  onReanalyze?: (name: string, type: string) => void;
}

function getScoreColor(score: number): string {
  if (score <= 25) return "bg-red-100 text-red-700";
  if (score <= 40) return "bg-orange-100 text-orange-700";
  if (score <= 55) return "bg-yellow-100 text-yellow-700";
  if (score <= 70) return "bg-lime-100 text-lime-700";
  if (score <= 85) return "bg-green-100 text-green-700";
  return "bg-emerald-100 text-emerald-700";
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "刚刚";
  if (mins < 60) return `${mins}分钟前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}天前`;
  return new Date(ts).toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
}

export function RecentList({ onReanalyze }: RecentListProps = {}) {
  const analyses = useAppStore((s) => s.analyses);

  if (analyses.length === 0) return null;

  return (
    <div>
      <p className="text-[11px] font-semibold tracking-[2px] text-[#999] uppercase mb-3">
        最近分析
      </p>
      <div className="space-y-2">
        {analyses.map((a) => (
          <div key={a.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#EEEEEC] hover:border-[#DDD] transition-colors">
            <Link href={`/analysis/${a.id}`} className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#F5F5F3] flex items-center justify-center text-sm font-bold text-[#666] shrink-0">
                {a.personName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#1A1A1A] text-sm">{a.personName}</span>
                  <span className="text-xs text-[#BBB]">{a.personType}</span>
                </div>
                <p className="text-xs text-[#999] truncate mt-0.5">{a.result.verdict}</p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getScoreColor(a.result.score)}`}>
                  {a.result.score}
                </span>
                <span className="text-[10px] text-[#CCC]">{timeAgo(a.createdAt)}</span>
              </div>
            </Link>
            {onReanalyze && (
              <button
                onClick={(e) => { e.stopPropagation(); onReanalyze(a.personName, a.personType); }}
                className="shrink-0 px-3 py-1.5 text-[11px] font-medium text-[#666] bg-[#F5F5F3] rounded-lg hover:bg-[#EEEEEC] transition-colors"
              >
                再次分析
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
