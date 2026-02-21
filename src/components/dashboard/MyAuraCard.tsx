"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { GlassCard } from "@/components/shared/GlassCard";
import { useDashboardStore } from "@/stores/dashboardStore";
import { useEffect } from "react";
import { User, ChevronRight } from "lucide-react";

export function MyAuraCard() {
  const { user, loadDashboard } = useDashboardStore();

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <Link href="/dashboard/mirror">
      <GlassCard hover className="relative overflow-hidden h-full min-h-[200px]">
        {/* Glow halo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-aurora-mid/10 blur-[40px]" />

        <div className="relative z-10 flex flex-col items-center text-center h-full justify-between">
          {/* Avatar */}
          <motion.div
            className="w-16 h-16 rounded-full bg-gradient-to-br from-aurora-start/30 to-glow-pink/30 flex items-center justify-center border border-white/20 mb-3"
            animate={{ boxShadow: ["0 0 15px rgba(168,85,247,0.2)", "0 0 30px rgba(168,85,247,0.4)", "0 0 15px rgba(168,85,247,0.2)"] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <User className="w-8 h-8 text-text-primary" />
          </motion.div>

          <div>
            <p className="text-text-primary font-medium text-sm">
              {user?.nickname || "我的灵气"}
            </p>
            {user?.auraLabels && user.auraLabels.length > 0 ? (
              <div className="flex flex-wrap gap-1 justify-center mt-2">
                {user.auraLabels.slice(0, 2).map((label) => (
                  <span
                    key={label}
                    className="px-2 py-0.5 rounded-full text-[10px] bg-aurora-start/15 text-aurora-end"
                  >
                    {label}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-text-tertiary text-xs mt-1">
                点击测测你的恋爱人格
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 text-text-tertiary text-xs mt-2">
            <span>Lv.{user?.auraLevel || 1} {user?.auraTitle || "初识"}</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}
